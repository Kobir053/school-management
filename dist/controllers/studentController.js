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
import studentModel from "../models/studentModel.js";
const JWT_SECRET = process.env.JWT_SECRET || "my_secret_key";
export function getYourGrades(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const studentToken = req.cookies["token"];
            if (!studentToken) {
                res.status(401).json({ message: "you don't have token.." });
                return;
            }
            let decoded = jwt.verify(studentToken, JWT_SECRET);
            const studentId = decoded.id;
            const student = yield studentModel.findById(studentId);
            res.status(200).json({ grades: student.grades, success: true });
        }
        catch (error) {
            next(error);
        }
    });
}
