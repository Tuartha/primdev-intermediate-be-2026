import express from "express";
import router from "./routes/index.routes.js"
import pinoHttp from 'pino-http' // jangan lupa import
import logger from './config/logger.config.js' // jangan lupa import


const app = express();
const port = 3000;
app.use(pinoHttp()) // Tambahkan ini
app.use(express.json());
app.use(router)


app.listen(port, () => {
  logger.info(`Library API is running url: http://localhost:${port}`);
});
