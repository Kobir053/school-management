import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import teacherModel, { ITeacher } from "../models/teacherModel.js";
import { IGrade } from "../models/gradeModel.js";
import studentModel, { IStudent } from "../models/studentModel.js";

const JWT_SECRET: string = process.env.JWT_SECRET || "my_secret_key";

export async function getGradesOfAllStudents (req: Request, res: Response, next: NextFunction) : Promise<void> {
    try {
        const teacherToken = req.cookies["token"];
        let decoded = jwt.verify(teacherToken, JWT_SECRET) as {id: string, iat: number, exp: number};

        const teacher: ITeacher | null = await teacherModel.findById(decoded.id).populate({path: "class"});
        if(!teacher){
            res.status(404).json({message: "couldn't find the grades of all students"});
            return;
        }

        const studentsGrades: IStudent[] = await studentModel.aggregate([
            {
                $match: {class: teacher.class._id}
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    grades: {grade: 1} 
                }
            }
        ]);
        res.status(200).json({grades: studentsGrades, success: true});
    } 
    catch (error: any) {
        next(error);
    }
}

export async function addGradeForStudent (req: Request, res: Response, next: NextFunction) : Promise<void> {
    try {
        const grade = req.body.grade;
        const comment = req.body.comment;
        if(!grade || !comment){
            res.status(400).json({message: "you have to enter a grade and a comment for the grade as well"});
            return;
        }

        const newGrade = {
            grade,
            comment
        } as IGrade;

        const studentId = req.params.id;
        const updatedStudent: IStudent | null = await studentModel.findByIdAndUpdate({_id: studentId}, {$push: {grades: newGrade}}, {new: true});
        res.status(200).json({updated: updatedStudent, success: true});
    } 
    catch (error: any) {
        next(error);
    }
}

export async function editGradeForStudent (req: Request, res: Response, next: NextFunction) : Promise<void> {
    try {
        const grade = req.body.grade;
        const comment = req.body.comment;
        if(!grade || !comment){
            res.status(400).json({message: "you have to enter a grade and a comment for the grade as well"});
            return;
        }

        const gradeId = req.params.gradeId;
        if(!gradeId){
            res.status(400).json({message: "to update the grade you have to enter the gradeID"});
            return;
        }

        const updatedGrade = {
            grade,
            comment
        } as IGrade;

        const studentId = req.params.id;
        const updatedStudent: IStudent | null = await studentModel.findByIdAndUpdate({_id: studentId}, {$set: {grades: updatedGrade}}, {new: true});
        res.status(200).json({updated: updatedStudent, success: true});
    } 
    catch (error: any) {
        next(error);
    }
}

export async function getGradeOfStudent (req: Request, res: Response, next: NextFunction) : Promise<void> {
    try {
        const studentId = req.params.id;
        const student: IStudent | null = await studentModel.findById(studentId);
        res.status(200).json({grades: student!.grades, success: true});
    } 
    catch (error: any) {
        next(error);
    }
}

export async function getAverageOfGradesOfStudents (req: Request, res: Response, next: NextFunction) : Promise<void> {
    try {
        const teacherToken = req.cookies["token"];
        let decoded = jwt.verify(teacherToken, JWT_SECRET) as {id: string, iat: number, exp: number};

        const teacher: ITeacher | null = await teacherModel.findById(decoded.id).populate({path: "class"});
        if(!teacher){
            res.status(404).json({message: "couldn't find the grades of all students"});
            return;
        }

        const studentsGrades: IStudent[] = await studentModel.aggregate([
            {
                $match: {class: teacher.class._id}
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    grades: {grade: 1} 
                }
            }
        ]);
        let averageList: object[] = [];
        let sum = 0;
        let objOfStudent = {};
        studentsGrades.forEach((obj) => {
            
            obj.grades.forEach((grade) => {
                sum += grade.grade;
            });
            objOfStudent = {name: obj.name, average: sum/obj.grades.length};
            averageList.push(objOfStudent);
            sum = 0;
        })
        res.status(200).json({averages: averageList, success: true});
    } 
    catch (error: any) {
        next(error);
    }
}