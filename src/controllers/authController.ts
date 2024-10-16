import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import classModel, { IClass } from "../models/classModel.js";
import { isEmailUsedByUser, setTokenIfUserExists } from "../services/authService.js";
import teacherModel, { ITeacher } from "../models/teacherModel.js";
import studentModel from "../models/studentModel.js";

export async function registerForTeacher (req: Request, res: Response, next: NextFunction) : Promise<void> {
    let classAdded = false;
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const className = req.body.class;
        if(!name || !email || !password || !className){
            res.status(400).json({message: "you need to enter name, password, email and class-name"});
            return;
        }

        if(await isEmailUsedByUser(email)){
            res.status(409).json({message: "This email is already register"});
            return;
        }

        const newClass = {
            name: className
        } as IClass;

        const addedClass: IClass = await classModel.create(newClass);
        classAdded = true;

        const newTeacher = {
            name,
            email,
            password,
            class: addedClass._id
        } as ITeacher;

        const passwordHash = await bcrypt.hash(password, 10);
        newTeacher.password = passwordHash;
    
        const addedTeacher = await teacherModel.create(newTeacher);
        res.status(201).json({classID: addedTeacher.class, success: true});

    } 
    catch (error: any) {
        if(classAdded){
            await classModel.deleteOne({name: req.body.class});
        }
        next(error);
    }
}

export async function registerForStudent (req: Request, res: Response, next: NextFunction) : Promise<void> {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const className = req.body.class;
        if(!name || !email || !password || !className){
            res.status(400).json({message: "you need to enter name, password, email and class-name"});
            return;
        }

        if(await isEmailUsedByUser(email)){
            res.status(409).json({message: "This email is already register"});
            return;
        }

        const classToJoin: IClass | null = await classModel.findOne({name: className});
        if(!classToJoin){
            res.status(404).json({message: "this class is not exists"});
            return;
        }

        const newStudent = {
            name,
            email,
            password,
            class: classToJoin._id
        }

        const passwordHash = await bcrypt.hash(password, 10);
        newStudent.password = passwordHash;
    
        const addedStudent = await studentModel.create(newStudent);
        const updatedClass = await classModel.findByIdAndUpdate(classToJoin._id, {$push: {students: addedStudent}});
        res.status(201).json({student: addedStudent, success: true});
    } 
    catch (error: any) {
        next(error);
    }
}

export async function login (req: Request, res: Response, next: NextFunction) : Promise<void> {
    try {
        const email = req.body.email;
        const password = req.body.password;
        if(!email || !password){
            res.status(400).json({message: "you have to enter your email and your password to log in"});
            return;
        }

        const token = await setTokenIfUserExists(email, password);
        if(!token){
            res.status(404).json({message: "this user didn't founded"});
            return;
        }

        res.cookie('token', token, {
            maxAge: 3600000, // 1 hour in milliseconds
            sameSite: 'strict', // Strict cross-site cookie policy
        });

        res.status(200).json({token: token, success: true});
    } 
    catch (error: any) {
        next(error);
    }
}