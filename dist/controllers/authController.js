var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from "bcrypt";
import classModel from "../models/classModel.js";
import { isEmailUsedByUser, setTokenIfUserExists } from "../services/authService.js";
import teacherModel from "../models/teacherModel.js";
import studentModel from "../models/studentModel.js";
export function registerForTeacher(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let classAdded = false;
        try {
            const name = req.body.name;
            const email = req.body.email;
            const password = req.body.password;
            const className = req.body.class;
            if (!name || !email || !password || !className) {
                res.status(400).json({ message: "you need to enter name, password, email and class-name" });
                return;
            }
            if (yield isEmailUsedByUser(email)) {
                res.status(409).json({ message: "This email is already register" });
                return;
            }
            const newClass = {
                name: className
            };
            const addedClass = yield classModel.create(newClass);
            classAdded = true;
            const newTeacher = {
                name,
                email,
                password,
                class: addedClass._id
            };
            const passwordHash = yield bcrypt.hash(password, 10);
            newTeacher.password = passwordHash;
            const addedTeacher = yield teacherModel.create(newTeacher);
            res.status(201).json({ classID: addedTeacher.class, success: true });
        }
        catch (error) {
            if (classAdded) {
                yield classModel.deleteOne({ name: req.body.class });
            }
            next(error);
        }
    });
}
export function registerForStudent(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const name = req.body.name;
            const email = req.body.email;
            const password = req.body.password;
            const className = req.body.class;
            if (!name || !email || !password || !className) {
                res.status(400).json({ message: "you need to enter name, password, email and class-name" });
                return;
            }
            if (yield isEmailUsedByUser(email)) {
                res.status(409).json({ message: "This email is already register" });
                return;
            }
            const classToJoin = yield classModel.findOne({ name: className });
            if (!classToJoin) {
                res.status(404).json({ message: "this class is not exists" });
                return;
            }
            const newStudent = {
                name,
                email,
                password,
                class: classToJoin._id
            };
            const passwordHash = yield bcrypt.hash(password, 10);
            newStudent.password = passwordHash;
            const addedStudent = yield studentModel.create(newStudent);
            const updatedClass = yield classModel.findByIdAndUpdate(classToJoin._id, { $push: { students: addedStudent } });
            res.status(201).json({ student: addedStudent, success: true });
        }
        catch (error) {
            next(error);
        }
    });
}
export function login(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const email = req.body.email;
            const password = req.body.password;
            if (!email || !password) {
                res.status(400).json({ message: "you have to enter your email and your password to log in" });
                return;
            }
            const token = yield setTokenIfUserExists(email, password);
            if (!token) {
                res.status(404).json({ message: "this user didn't founded" });
                return;
            }
            res.cookie('token', token, {
                maxAge: 3600000, // 1 hour in milliseconds
                sameSite: 'strict', // Strict cross-site cookie policy
            });
            res.status(200).json({ token: token, success: true });
        }
        catch (error) {
            next(error);
        }
    });
}
