import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import studentModel, { IStudent } from "../models/studentModel.js";
import teacherModel, { ITeacher } from "../models/teacherModel.js";

const JWT_SECRET: string = process.env.JWT_SECRET || "my_secret_key";

export async function isEmailUsedByUser (email: string) : Promise<boolean> {
    const teacher: ITeacher | null = await teacherModel.findOne({email: email}); 
    if(teacher)
        return true;
    const student: IStudent | null = await studentModel.findOne({email: email});
    if(student)
        return true;
    return false;
}

export async function setTokenIfUserExists (email: string, password: string) : Promise<string | null> {
    const student = await studentModel.findOne({email});
    if(student && await bcrypt.compare(password, student.password)){
        const token = jwt.sign({id: student._id}, JWT_SECRET, {expiresIn: "1h"});
        return token;
    }

    const teacher = await teacherModel.findOne({email});
    if(teacher && await bcrypt.compare(password, teacher.password)){
        const token = jwt.sign({id: teacher._id}, JWT_SECRET, {expiresIn: "1h"});
        return token;
    }
    return null;     
}