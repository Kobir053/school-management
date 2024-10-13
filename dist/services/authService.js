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
import jwt from "jsonwebtoken";
import studentModel from "../models/studentModel.js";
import teacherModel from "../models/teacherModel.js";
const JWT_SECRET = process.env.JWT_SECRET || "my_secret_key";
export function isEmailUsedByUser(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const teacher = yield teacherModel.findOne({ email: email });
        if (teacher)
            return true;
        const student = yield studentModel.findOne({ email: email });
        if (student)
            return true;
        return false;
    });
}
export function setTokenIfUserExists(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const student = yield studentModel.findOne({ email });
        if (student && (yield bcrypt.compare(password, student.password))) {
            const token = jwt.sign({ id: student._id }, JWT_SECRET, { expiresIn: "1h" });
            return token;
        }
        const teacher = yield teacherModel.findOne({ email });
        if (teacher && (yield bcrypt.compare(password, teacher.password))) {
            const token = jwt.sign({ id: teacher._id }, JWT_SECRET, { expiresIn: "1h" });
            return token;
        }
        return null;
    });
}
