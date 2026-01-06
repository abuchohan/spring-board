import express from "express";
import router from "./routes/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";

export const app = express();


const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
}

app.use(
  cors({
    origin: "*",
    credentials: false,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

export default app;
