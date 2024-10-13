import mongoose, { Document, Schema, Types } from "mongoose";
import validator from "validator";
import gradeSchema, { IGrade } from "./gradeModel.js";

export interface IStudent extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    class: Types.ObjectId;
    grades: IGrade[];
}

const studentSchema = new Schema<IStudent>({
    name: {
        type: String,
        required: [true, "you didn't entered your name"],
        maxlength: [30, "length of name can't be more than 30 letters"],
    },
    email: {
        type: String,
        required: [true, "you must enter your email"],
        validate: [validator.isEmail, "the email is not valid"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "you must enter a password"],
        minlength: [4, "password must contain at least 4 characters"],
        maxlength: [8, "password must contain less than 9 characters"],
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
    },
    grades: {
        type: [gradeSchema],
        default: [],
    },
});

const studentModel = mongoose.model("Student", studentSchema);

export default studentModel;