import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import studentModel, { IStudent } from "../models/studentModel.js";

const JWT_SECRET: string = process.env.JWT_SECRET || "my_secret_key";

export async function getYourGrades (req: Request, res: Response, next: NextFunction) : Promise<void> {
    try {
        const studentToken = req.cookies["token"];
        if(!studentToken){
            res.status(401).json({message: "you don't have token.."});
            return;
        }
        let decoded = jwt.verify(studentToken, JWT_SECRET) as {id: string, iat: number, exp: number};

        const studentId = decoded.id;
        const student: IStudent | null = await studentModel.findById(studentId);
        res.status(200).json({grades: student!.grades, success: true});
    } 
    catch (error: any) {
        next(error);
    }
}