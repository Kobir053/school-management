var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
import teacherModel from "../models/teacherModel.js";
import studentModel from "../models/studentModel.js";
import classModel from "../models/classModel.js";
const JWT_SECRET = process.env.JWT_SECRET || "my_secret_key";
export function teacherMiddlewareForSpecificStudent(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.cookies["token"]) {
            res.status(401).json({ message: "you don't have a token cookie!" });
            return;
        }
        try {
            const teacherToken = req.cookies["token"];
            console.log(teacherToken);
            let decoded = jwt.verify(teacherToken, JWT_SECRET);
            const teacher = yield teacherModel.findById(decoded.id);
            if (!teacher) {
                res.status(403).json({ message: "the token you are not a teacher" });
                return;
            }
            const studentId = req.params.id;
            if (!studentId) {
                res.status(400).json({ message: "you have to enter the id of the student" });
                return;
            }
            const student = yield studentModel.findById(studentId);
            if (!student) {
                res.status(404).json({ message: "there is no student with that id" });
                return;
            }
            const classOfTeacher = classModel.findById(teacher.class._id);
            const classOfStudent = classModel.findById(student.class._id);
            if (classOfStudent !== classOfTeacher) {
                res.status(403).json({ message: "you don't have access to another classes details" });
                return;
            }
            next();
        }
        catch (error) {
            res.status(403).json({ message: "Invalid token, the error is: " + error.message });
        }
    });
}
export function teacherGeneralMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.cookies["token"]) {
            res.status(401).json({ message: "you don't have a token cookie!" });
            return;
        }
        try {
            const teacherToken = req.cookies["token"];
            let decoded = jwt.verify(teacherToken, JWT_SECRET);
            const teacher = yield teacherModel.findById(decoded.id);
            if (!teacher) {
                res.status(403).json({ message: "the token you are not a teacher" });
                return;
            }
            next();
        }
        catch (error) {
            res.status(403).json({ message: "Invalid token, the error is: " + error.message });
        }
    });
}
