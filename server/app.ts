import express from "express";
import router from "./routes/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

export const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use("/api/auth", authLimiter);
app.use("/api", router);

export default app;
