import express from "express";
import router from "./routes/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

export const app = express();

const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 200,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use("/api", apiLimiter);
app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

export default app;
