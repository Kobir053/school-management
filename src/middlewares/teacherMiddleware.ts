import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import teacherModel from "../models/teacherModel.js";
import studentModel from "../models/studentModel.js";
import classModel from "../models/classModel.js";

const JWT_SECRET: string = process.env.JWT_SECRET || "my_secret_key";

export async function teacherMiddlewareForSpecificStudent (req: Request, res: Response, next: NextFunction) {
    if(!req.cookies["token"]){
        res.status(401).json({message: "you don't have a token cookie!"});
        return;
    }
    
    try {
        const teacherToken = req.cookies["token"];
        console.log(teacherToken);
        let decoded = jwt.verify(teacherToken, JWT_SECRET) as {id: string, iat: number, exp: number};
        const teacher = await teacherModel.findById(decoded.id);

        if(!teacher){
            res.status(403).json({message: "the token you are not a teacher"});
            return;
        }

        const studentId = req.params.id;
        if(!studentId){
            res.status(400).json({message: "you have to enter the id of the student"});
            return;
        }
        const student = await studentModel.findById(studentId);
        if(!student){
            res.status(404).json({message: "there is no student with that id"});
            return;
        }
        const classOfTeacher = classModel.findById(teacher.class._id);
        const classOfStudent = classModel.findById(student.class._id);
        if(classOfStudent !== classOfTeacher){
            res.status(403).json({message: "you don't have access to another classes details"});
            return;
        }

        next();
    } 
    catch (error: any) {
        res.status(403).json({message:"Invalid token, the error is: " + error.message});
    }
}

export async function teacherGeneralMiddleware (req: Request, res: Response, next: NextFunction) {
    if(!req.cookies["token"]){
        res.status(401).json({message: "you don't have a token cookie!"});
        return;
    }
    
    try {
        const teacherToken = req.cookies["token"];
        let decoded = jwt.verify(teacherToken, JWT_SECRET) as {id: string, iat: number, exp: number};
        const teacher = await teacherModel.findById(decoded.id);

        if(!teacher){
            res.status(403).json({message: "the token you are not a teacher"});
            return;
        }

        next();
    } 
    catch (error: any) {
        res.status(403).json({message:"Invalid token, the error is: " + error.message});
    }
}