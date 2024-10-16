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
const JWT_SECRET = process.env.JWT_SECRET || "my_secret_key";
export function getGradesOfAllStudents(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const teacherToken = req.cookies["token"];
            let decoded = jwt.verify(teacherToken, JWT_SECRET);
            const teacher = yield teacherModel.findById(decoded.id).populate({ path: "class" });
            if (!teacher) {
                res.status(404).json({ message: "couldn't find the grades of all students" });
                return;
            }
            const studentsGrades = yield studentModel.aggregate([
                {
                    $match: { class: teacher.class._id }
                },
                {
                    $project: {
                        _id: 0,
                        name: 1,
                        grades: { grade: 1 }
                    }
                }
            ]);
            res.status(200).json({ grades: studentsGrades, success: true });
        }
        catch (error) {
            next(error);
        }
    });
}
export function addGradeForStudent(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const grade = req.body.grade;
            const comment = req.body.comment;
            if (!grade || !comment) {
                res.status(400).json({ message: "you have to enter a grade and a comment for the grade as well" });
                return;
            }
            const newGrade = {
                grade,
                comment
            };
            const studentId = req.params.id;
            const updatedStudent = yield studentModel.findByIdAndUpdate({ _id: studentId }, { $push: { grades: newGrade } }, { new: true });
            res.status(200).json({ updated: updatedStudent, success: true });
        }
        catch (error) {
            next(error);
        }
    });
}
export function editGradeForStudent(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const grade = req.body.grade;
            const comment = req.body.comment;
            if (!grade || !comment) {
                res.status(400).json({ message: "you have to enter a grade and a comment for the grade as well" });
                return;
            }
            const gradeId = req.params.gradeId;
            if (!gradeId) {
                res.status(400).json({ message: "to update the grade you have to enter the gradeID" });
                return;
            }
            const updatedGrade = {
                grade,
                comment
            };
            const studentId = req.params.id;
            const updatedStudent = yield studentModel.findByIdAndUpdate({ _id: studentId }, { $set: { grades: updatedGrade } }, { new: true });
            res.status(200).json({ updated: updatedStudent, success: true });
        }
        catch (error) {
            next(error);
        }
    });
}
export function getGradeOfStudent(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const studentId = req.params.id;
            const student = yield studentModel.findById(studentId);
            res.status(200).json({ grades: student.grades, success: true });
        }
        catch (error) {
            next(error);
        }
    });
}
export function getAverageOfGradesOfStudents(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const teacherToken = req.cookies["token"];
            let decoded = jwt.verify(teacherToken, JWT_SECRET);
            const teacher = yield teacherModel.findById(decoded.id).populate({ path: "class" });
            if (!teacher) {
                res.status(404).json({ message: "couldn't find the grades of all students" });
                return;
            }
            const studentsGrades = yield studentModel.aggregate([
                {
                    $match: { class: teacher.class._id }
                },
                {
                    $project: {
                        _id: 0,
                        name: 1,
                        grades: { grade: 1 }
                    }
                }
            ]);
            let averageList = [];
            let sum = 0;
            let objOfStudent = {};
            studentsGrades.forEach((obj) => {
                obj.grades.forEach((grade) => {
                    sum += grade.grade;
                });
                objOfStudent = { name: obj.name, average: sum / obj.grades.length };
                averageList.push(objOfStudent);
                sum = 0;
            });
            res.status(200).json({ averages: averageList, success: true });
        }
        catch (error) {
            next(error);
        }
    });
}
