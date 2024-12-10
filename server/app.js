import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

import express from "express";
import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

// Route
import authRouter from "./Route/auth.route.js";
import userRouter from "./Route/user.route.js";
import contestRouter from "./Route/contest.route.js";
import ticketRouter from "./Route/ticket.route.js";

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
//CORS policy
if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
}

const __dirname = path.resolve();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.use("/api/v1/auth/", authRouter);
app.use("/api/v1/user/", userRouter);
app.use("/api/v1/contest/", contestRouter);
app.use("/api/v1/ticket/", ticketRouter);

// Serving Client as Static in production
if (process.env.NODE_ENV === "development") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}

export default app;
export { cloudinary };
