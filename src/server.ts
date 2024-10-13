import express, { Application } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app: Application = express();

app.use(cookieParser());

connectDB();

app.use(express.json());

app.use(errorHandler);

app.listen(PORT, ()=>{
    console.log("server listen on port ", PORT);
});