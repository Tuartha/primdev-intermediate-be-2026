import prisma from '../config/database.config.js'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('🧹 Cleaning all tables...')

  // Delete in order to respect foreign key constraints
  await prisma.borrowings.deleteMany()
  await prisma.profiles.deleteMany()
  await prisma.books.deleteMany()
  await prisma.categories.deleteMany()
  await prisma.users.deleteMany()

  console.log('✅ All tables cleaned!')

  // ===================== CATEGORIES (20 data) =====================
  console.log('📂 Seeding categories...')
  const categories = await Promise.all([
    prisma.categories.create({ data: { name: 'Fiction' } }),
    prisma.categories.create({ data: { name: 'Non-Fiction' } }),
    prisma.categories.create({ data: { name: 'Science' } }),
    prisma.categories.create({ data: { name: 'Technology' } }),
    prisma.categories.create({ data: { name: 'History' } }),
    prisma.categories.create({ data: { name: 'Biography' } }),
    prisma.categories.create({ data: { name: 'Philosophy' } }),
    prisma.categories.create({ data: { name: 'Psychology' } }),
    prisma.categories.create({ data: { name: 'Mathematics' } }),
    prisma.categories.create({ data: { name: 'Art & Design' } }),
    prisma.categories.create({ data: { name: 'Business' } }),
    prisma.categories.create({ data: { name: 'Self-Help' } }),
    prisma.categories.create({ data: { name: 'Poetry' } }),
    prisma.categories.create({ data: { name: 'Romance' } }),
    prisma.categories.create({ data: { name: 'Thriller' } }),
    prisma.categories.create({ data: { name: 'Fantasy' } }),
    prisma.categories.create({ data: { name: 'Horror' } }),
    prisma.categories.create({ data: { name: 'Comics' } }),
    prisma.categories.create({ data: { name: 'Education' } }),
    prisma.categories.create({ data: { name: 'Travel' } }),
  ])
  console.log(`✅ ${categories.length} categories seeded!`)

  // ===================== USERS (20 data) =====================
  console.log('👤 Seeding users...')
  const hashedPassword = await bcrypt.hash('password123', 10)

  const usersData = [
    { name: 'Admin Utama', email: 'admin@library.com', password: hashedPassword, role: 'ADMIN' },
    { name: 'Admin Dua', email: 'admin2@library.com', password: hashedPassword, role: 'ADMIN' },
    { name: 'Budi Santoso', email: 'budi@gmail.com', password: hashedPassword, role: 'USER' },
    { name: 'Siti Nurhaliza', email: 'siti@gmail.com', password: hashedPassword, role: 'USER' },
    { name: 'Ahmad Fauzi', email: 'ahmad@gmail.com', password: hashedPassword, role: 'USER' },
    { name: 'Dewi Lestari', email: 'dewi@gmail.com', password: hashedPassword, role: 'USER' },
    { name: 'Rizky Pratama', email: 'rizky@gmail.com', password: hashedPassword, role: 'USER' },
    { name: 'Anisa Rahma', email: 'anisa@gmail.com', password: hashedPassword, role: 'USER' },
    { name: 'Fajar Nugroho', email: 'fajar@gmail.com', password: hashedPassword, role: 'USER' },
    { name: 'Putri Ayu', email: 'putri@gmail.com', password: hashedPassword, role: 'USER' },
    { name: 'Dimas Arya', email: 'dimas@gmail.com', password: hashedPassword, role: 'USER' },
    { name: 'Rina Wati', email: 'rina@gmail.com', password: hashedPassword, role: 'USER' },
    { name: 'Hendra Gunawan', email: 'hendra@gmail.com', password: hashedPassword, role: 'USER' },
    { name: 'Maya Sari', email: 'maya@gmail.com', password: hashedPassword, role: 'USER' },
    { name: 'Eko Prasetyo', email: 'eko@gmail.com', password: hashedPassword, role: 'USER' },
    { name: 'Lina Marlina', email: 'lina@gmail.com', password: hashedPassword, role: 'USER' },
    { name: 'Yoga Aditya', email: 'yoga@gmail.com', password: hashedPassword, role: 'USER' },
    { name: 'Nadia Putri', email: 'nadia@gmail.com', password: hashedPassword, role: 'USER' },
    { name: 'Rendi Saputra', email: 'rendi@gmail.com', password: hashedPassword, role: 'USER' },
    { name: 'Indah Permata', email: 'indah@gmail.com', password: hashedPassword, role: 'USER' },
  ]

  const users = await Promise.all(
    usersData.map((data) => prisma.users.create({ data }))
  )
  console.log(`✅ ${users.length} users seeded!`)

  // ===================== PROFILES (20 data, 1 per user) =====================
  console.log('📋 Seeding profiles...')
  const profilesData = [
    { userId: users[0].id, address: 'Jl. Admin No. 1, Jakarta', phone: '081200000001' },
    { userId: users[1].id, address: 'Jl. Admin No. 2, Jakarta', phone: '081200000002' },
    { userId: users[2].id, address: 'Jl. Merdeka No. 10, Bandung', phone: '081234567801' },
    { userId: users[3].id, address: 'Jl. Sudirman No. 25, Surabaya', phone: '081234567802' },
    { userId: users[4].id, address: 'Jl. Diponegoro No. 5, Yogyakarta', phone: '081234567803' },
    { userId: users[5].id, address: 'Jl. Pahlawan No. 17, Semarang', phone: '081234567804' },
    { userId: users[6].id, address: 'Jl. Gatot Subroto No. 8, Medan', phone: '081234567805' },
    { userId: users[7].id, address: 'Jl. Ahmad Yani No. 33, Malang', phone: '081234567806' },
    { userId: users[8].id, address: 'Jl. Veteran No. 12, Makassar', phone: '081234567807' },
    { userId: users[9].id, address: 'Jl. Kartini No. 45, Denpasar', phone: '081234567808' },
    { userId: users[10].id, address: 'Jl. Imam Bonjol No. 21, Palembang', phone: '081234567809' },
    { userId: users[11].id, address: 'Jl. Hasanuddin No. 9, Manado', phone: '081234567810' },
    { userId: users[12].id, address: 'Jl. Thamrin No. 55, Bekasi', phone: '081234567811' },
    { userId: users[13].id, address: 'Jl. Asia Afrika No. 30, Bandung', phone: '081234567812' },
    { userId: users[14].id, address: 'Jl. Pemuda No. 18, Solo', phone: '081234567813' },
    { userId: users[15].id, address: 'Jl. Hayam Wuruk No. 7, Cirebon', phone: '081234567814' },
    { userId: users[16].id, address: 'Jl. Gajah Mada No. 40, Tangerang', phone: '081234567815' },
    { userId: users[17].id, address: 'Jl. Teuku Umar No. 14, Bogor', phone: '081234567816' },
    { userId: users[18].id, address: 'Jl. Sisingamangaraja No. 22, Depok', phone: '081234567817' },
    { userId: users[19].id, address: 'Jl. Antasari No. 3, Balikpapan', phone: '081234567818' },
  ]

  const profiles = await Promise.all(
    profilesData.map((data) => prisma.profiles.create({ data }))
  )
  console.log(`✅ ${profiles.length} profiles seeded!`)

  // ===================== BOOKS (25 data) =====================
  console.log('📚 Seeding books...')
  const booksData = [
    { categoryId: categories[0].id, title: 'Laskar Pelangi', author: 'Andrea Hirata', year: 2005, available: true },
    { categoryId: categories[0].id, title: 'Bumi Manusia', author: 'Pramoedya Ananta Toer', year: 1980, available: true },
    { categoryId: categories[0].id, title: 'Perahu Kertas', author: 'Dee Lestari', year: 2009, available: false },
    { categoryId: categories[1].id, title: 'Sapiens', author: 'Yuval Noah Harari', year: 2011, available: true },
    { categoryId: categories[1].id, title: 'Atomic Habits', author: 'James Clear', year: 2018, available: true },
    { categoryId: categories[2].id, title: 'A Brief History of Time', author: 'Stephen Hawking', year: 1988, available: true },
    { categoryId: categories[2].id, title: 'Cosmos', author: 'Carl Sagan', year: 1980, available: false },
    { categoryId: categories[3].id, title: 'Clean Code', author: 'Robert C. Martin', year: 2008, available: true },
    { categoryId: categories[3].id, title: 'The Pragmatic Programmer', author: 'David Thomas', year: 1999, available: true },
    { categoryId: categories[4].id, title: 'Guns, Germs, and Steel', author: 'Jared Diamond', year: 1997, available: true },
    { categoryId: categories[4].id, title: 'Sejarah Indonesia Modern', author: 'M.C. Ricklefs', year: 1981, available: false },
    { categoryId: categories[5].id, title: 'Steve Jobs', author: 'Walter Isaacson', year: 2011, available: true },
    { categoryId: categories[6].id, title: 'Dunia Sophie', author: 'Jostein Gaarder', year: 1991, available: true },
    { categoryId: categories[7].id, title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', year: 2011, available: true },
    { categoryId: categories[8].id, title: 'Calculus Made Easy', author: 'Silvanus P. Thompson', year: 1910, available: true },
    { categoryId: categories[9].id, title: 'The Design of Everyday Things', author: 'Don Norman', year: 1988, available: false },
    { categoryId: categories[10].id, title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', year: 1997, available: true },
    { categoryId: categories[11].id, title: 'The Subtle Art of Not Giving a F*ck', author: 'Mark Manson', year: 2016, available: true },
    { categoryId: categories[13].id, title: 'Dilan 1990', author: 'Pidi Baiq', year: 2014, available: true },
    { categoryId: categories[14].id, title: 'The Girl on the Train', author: 'Paula Hawkins', year: 2015, available: true },
    { categoryId: categories[15].id, title: 'Harry Potter and the Philosopher\'s Stone', author: 'J.K. Rowling', year: 1997, available: false },
    { categoryId: categories[15].id, title: 'The Hobbit', author: 'J.R.R. Tolkien', year: 1937, available: true },
    { categoryId: categories[16].id, title: 'IT', author: 'Stephen King', year: 1986, available: true },
    { categoryId: categories[18].id, title: 'Matematika Diskrit', author: 'Rinaldi Munir', year: 2010, available: true },
    { categoryId: categories[19].id, title: 'Eat Pray Love', author: 'Elizabeth Gilbert', year: 2006, available: true },
  ]

  const books = await Promise.all(
    booksData.map((data) => prisma.books.create({ data }))
  )
  console.log(`✅ ${books.length} books seeded!`)

  // ===================== BORROWINGS (20 data) =====================
  console.log('📖 Seeding borrowings...')
  const borrowingsData = [
    { userId: users[2].id, bookId: books[0].id, borrow_date: new Date('2025-01-05'), returned_at: new Date('2025-01-19') },
    { userId: users[3].id, bookId: books[1].id, borrow_date: new Date('2025-01-10'), returned_at: new Date('2025-01-24') },
    { userId: users[4].id, bookId: books[3].id, borrow_date: new Date('2025-02-01'), returned_at: new Date('2025-02-15') },
    { userId: users[5].id, bookId: books[4].id, borrow_date: new Date('2025-02-14'), returned_at: new Date('2025-02-28') },
    { userId: users[6].id, bookId: books[7].id, borrow_date: new Date('2025-03-01'), returned_at: new Date('2025-03-15') },
    { userId: users[7].id, bookId: books[8].id, borrow_date: new Date('2025-03-10'), returned_at: null },
    { userId: users[8].id, bookId: books[9].id, borrow_date: new Date('2025-03-20'), returned_at: new Date('2025-04-03') },
    { userId: users[9].id, bookId: books[11].id, borrow_date: new Date('2025-04-01'), returned_at: null },
    { userId: users[10].id, bookId: books[12].id, borrow_date: new Date('2025-04-05'), returned_at: new Date('2025-04-19') },
    { userId: users[11].id, bookId: books[13].id, borrow_date: new Date('2025-04-10'), returned_at: new Date('2025-04-24') },
    { userId: users[12].id, bookId: books[16].id, borrow_date: new Date('2025-05-01'), returned_at: null },
    { userId: users[13].id, bookId: books[17].id, borrow_date: new Date('2025-05-05'), returned_at: new Date('2025-05-19') },
    { userId: users[14].id, bookId: books[18].id, borrow_date: new Date('2025-05-10'), returned_at: new Date('2025-05-24') },
    { userId: users[15].id, bookId: books[19].id, borrow_date: new Date('2025-06-01'), returned_at: null },
    { userId: users[16].id, bookId: books[21].id, borrow_date: new Date('2025-06-10'), returned_at: new Date('2025-06-24') },
    { userId: users[17].id, bookId: books[22].id, borrow_date: new Date('2025-06-15'), returned_at: new Date('2025-06-29') },
    { userId: users[18].id, bookId: books[23].id, borrow_date: new Date('2025-07-01'), returned_at: null },
    { userId: users[19].id, bookId: books[24].id, borrow_date: new Date('2025-07-10'), returned_at: new Date('2025-07-24') },
    { userId: users[2].id, bookId: books[5].id, borrow_date: new Date('2025-08-01'), returned_at: new Date('2025-08-15') },
    { userId: users[3].id, bookId: books[14].id, borrow_date: new Date('2025-08-10'), returned_at: null },
  ]

  const borrowings = await Promise.all(
    borrowingsData.map((data) => prisma.borrowings.create({ data }))
  )
  console.log(`✅ ${borrowings.length} borrowings seeded!`)

  console.log('\n🎉 Seeding complete!')
  console.log(`   📂 Categories: ${categories.length}`)
  console.log(`   👤 Users: ${users.length}`)
  console.log(`   📋 Profiles: ${profiles.length}`)
  console.log(`   📚 Books: ${books.length}`)
  console.log(`   📖 Borrowings: ${borrowings.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
