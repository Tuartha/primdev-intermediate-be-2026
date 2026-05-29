import prisma from '../config/database.config.js'
import logger from '../config/logger.config.js'
import { getCache, setCache } from '../helpers/cache.js'

const BORROW_DURATION_DAYS = 14 // Durasi peminjaman standar
const CACHE_TTL_SECONDS = 300   // Cache berlaku 5 menit

export const getStatistics = async (req, res) => {
  try {
    logger.debug({ query: req.query }, 'getStatistics: Started')

    const { startDate, endDate, trend = 'monthly' } = req.query

    const dateFilter = {}
    if (startDate) {
      dateFilter.gte = new Date(startDate)
    }
    if (endDate) {
      // Set endDate ke akhir hari (23:59:59) agar inklusif
      const endOfDay = new Date(endDate)
      endOfDay.setHours(23, 59, 59, 999)
      dateFilter.lte = endOfDay
    }

    const hasDateFilter = Object.keys(dateFilter).length > 0

    // Cache key dibuat unik berdasarkan semua parameter
    // agar request dengan parameter berbeda tidak saling tumpang tindih
    const cacheKey = `admin_stats_${startDate || 'all'}_${endDate || 'all'}_${trend}`
    const cachedData = getCache(cacheKey)

    if (cachedData) {
      logger.info({ cacheKey }, 'Statistics served from cache')
      return res.status(200).json({
        success: true,
        message: 'Statistics retrieved successfully (cached)',
        data: cachedData,
      })
    }

    const [
      totalBooks,
      totalUsers,
      activeBorrowings,
      allBorrowingsForOverdue,
      borrowingsForTopBooks,
      usersForTrend,
      borrowingsForDayRate,
      borrowingsForCategoryRank,
    ] = await Promise.all([
      // ── Query 3a: Total buku ──
      prisma.books.count(),

      // ── Query 3b: Total user ──
      prisma.users.count(),

      // ── Query 3c: Active borrowings (belum dikembalikan) ──
      prisma.borrowings.count({
        where: {
          returned_at: null,
          // Jika ada date filter, filter juga berdasarkan borrow_date
          ...(hasDateFilter ? { borrow_date: dateFilter } : {}),
        },
      }),

      // ── Query 3d: Semua borrowing aktif (untuk hitung overdue) ──
      prisma.borrowings.findMany({
        where: {
          returned_at: null,
          ...(hasDateFilter ? { borrow_date: dateFilter } : {}),
        },
        select: {
          id: true,
          borrow_date: true,
        },
      }),

      // ── Query 3e: Borrowing data untuk Top 10 Books ──
      prisma.borrowings.findMany({
        where: {
          ...(hasDateFilter ? { borrow_date: dateFilter } : {}),
        },
        select: {
          bookId: true,
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              year: true,
              cloudinaryId: true,
              categories: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),

      // ── Query 3f: Users untuk registration trend ──
      prisma.users.findMany({
        where: {
          ...(hasDateFilter ? { createdAt: dateFilter } : {}),
        },
        select: {
          id: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
      }),

      // ── Query 3g: Borrowings untuk rate per hari ──
      prisma.borrowings.findMany({
        where: {
          ...(hasDateFilter ? { borrow_date: dateFilter } : {}),
        },
        select: {
          borrow_date: true,
        },
      }),

      // ── Query 3h: Borrowings untuk category ranking ──
      prisma.borrowings.findMany({
        where: {
          ...(hasDateFilter ? { borrow_date: dateFilter } : {}),
        },
        select: {
          book: {
            select: {
              categoryId: true,
              categories: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
    ])

    logger.debug('All parallel queries completed')

    const now = new Date()
    let overdueCount = 0

    for (const borrowing of allBorrowingsForOverdue) {
      const dueDate = new Date(borrowing.borrow_date)
      dueDate.setDate(dueDate.getDate() + BORROW_DURATION_DAYS)

      if (now > dueDate) {
        overdueCount++
      }
    }

    const summary = {
      totalBooks,
      totalUsers,
      activeBorrowings,
      overdueCount,
      returnRate:
        activeBorrowings > 0
          ? `${(((activeBorrowings - overdueCount) / activeBorrowings) * 100).toFixed(1)}%`
          : '100%',
    }

    const bookBorrowCounts = {}

    for (const borrowing of borrowingsForTopBooks) {
      const bookId = borrowing.bookId

      if (!bookBorrowCounts[bookId]) {
        bookBorrowCounts[bookId] = {
          bookId: bookId,
          book: borrowing.book,
          borrowCount: 0,
        }
      }
      bookBorrowCounts[bookId].borrowCount++
    }

    // Sort descending dan ambil top 10
    const top10Books = Object.values(bookBorrowCounts)
      .sort((a, b) => b.borrowCount - a.borrowCount)
      .slice(0, 10)
      .map((item, index) => ({
        rank: index + 1,
        bookId: item.bookId,
        title: item.book.title,
        author: item.book.author,
        year: item.book.year,
        category: item.book.categories?.name || null,
        borrowCount: item.borrowCount,
      }))

    const registrationTrend = {}

    for (const user of usersForTrend) {
      const date = new Date(user.createdAt)
      let periodKey

      if (trend === 'weekly') {
        const startOfYear = new Date(date.getFullYear(), 0, 1)
        const daysSinceStart = Math.floor(
          (date - startOfYear) / (1000 * 60 * 60 * 24),
        )
        const weekNumber = Math.ceil((daysSinceStart + startOfYear.getDay() + 1) / 7)
        periodKey = `${date.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`
        // Contoh output: "2026-W22" (minggu ke-22 tahun 2026)
      } else {
        // Monthly: gunakan format YYYY-MM
        periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        // Contoh output: "2026-05" (Mei 2026)
      }

      if (!registrationTrend[periodKey]) {
        registrationTrend[periodKey] = 0
      }
      registrationTrend[periodKey]++
    }

    const registrationData = Object.entries(registrationTrend)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([period, count]) => ({
        period,
        newUsers: count,
      }))

    const categoryCounts = {}

    for (const borrowing of borrowingsForCategoryRank) {
      const category = borrowing.book.categories
      if (!category) continue // Skip buku tanpa category

      const catId = category.id
      if (!categoryCounts[catId]) {
        categoryCounts[catId] = {
          categoryId: catId,
          name: category.name,
          borrowCount: 0,
        }
      }
      categoryCounts[catId].borrowCount++
    }

    const categoryRanking = Object.values(categoryCounts)
      .sort((a, b) => b.borrowCount - a.borrowCount)
      .map((cat, index) => ({
        rank: index + 1,
        ...cat,
      }))

    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]
    const dayCounters = [0, 0, 0, 0, 0, 0, 0]

    for (const borrowing of borrowingsForDayRate) {
      const dayOfWeek = new Date(borrowing.borrow_date).getDay()
      dayCounters[dayOfWeek]++
    }

    const totalBorrowingsForRate = borrowingsForDayRate.length

    const borrowingByDay = dayNames.map((name, index) => ({
      day: name,
      count: dayCounters[index],
      percentage:
        totalBorrowingsForRate > 0
          ? `${((dayCounters[index] / totalBorrowingsForRate) * 100).toFixed(1)}%`
          : '0%',
    }))

    // Cari hari paling sibuk dan paling sepi
    const busiestDay = borrowingByDay.reduce(
      (max, day) => (day.count > max.count ? day : max),
      borrowingByDay[0],
    )
    const quietestDay = borrowingByDay.reduce(
      (min, day) => (day.count < min.count ? day : min),
      borrowingByDay[0],
    )

    const responseData = {
      generatedAt: now.toISOString(),
      dateRange: {
        startDate: startDate || 'all time',
        endDate: endDate || 'now',
        trend: trend,
      },
      summary,
      top10MostBorrowedBooks: top10Books,
      userRegistrationTrend: {
        trendType: trend,
        data: registrationData,
        totalNewUsers: usersForTrend.length,
      },
      categoryPopularity: {
        ranking: categoryRanking,
        totalCategories: categoryRanking.length,
      },
      borrowingRateByDay: {
        distribution: borrowingByDay,
        busiestDay: {
          day: busiestDay.day,
          count: busiestDay.count,
          percentage: busiestDay.percentage,
        },
        quietestDay: {
          day: quietestDay.day,
          count: quietestDay.count,
          percentage: quietestDay.percentage,
        },
        totalBorrowings: totalBorrowingsForRate,
      },
    }

    // Simpan ke cache
    setCache(cacheKey, responseData, CACHE_TTL_SECONDS)
    logger.info(
      { cacheKey, ttl: CACHE_TTL_SECONDS },
      'Statistics cached successfully',
    )

    logger.info('Statistics generated successfully')

    res.status(200).json({
      success: true,
      message: 'Statistics retrieved successfully',
      data: responseData,
    })
  } catch (error) {
    logger.error({ error: error.message }, 'Failed to generate statistics')
    res.status(500).json({
      success: false,
      message: 'An error occurred while generating statistics',
      error: error.message,
    })
  }
}