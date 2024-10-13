import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import errorHandler from "./middlewares/errorHandler.js";
import authRouter from "./routes/authRoutes.js";
import teacherRouter from "./routes/teacherRoutes.js";
dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cookieParser());
connectDB();
app.use(express.json());
app.use("/auth", authRouter);
app.use("/teacher", teacherRouter);
app.use(errorHandler);
app.listen(PORT, () => {
    console.log("server listen on port ", PORT);
});
