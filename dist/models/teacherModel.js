import mongoose, { Schema } from "mongoose";
import validator from "validator";
const teacherSchema = new Schema({
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
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
    },
});
const teacherModel = mongoose.model("Teacher", teacherSchema);
export default teacherModel;
