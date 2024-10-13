import { Schema } from "mongoose";
const gradeSchema = new Schema({
    grade: {
        type: Number,
        required: [true, "you have to enter the grade"],
        max: [100, "you can't set a grade that is greater than 100"],
        min: [0, "you can't set a grade that is less than ZERO"],
    },
    comment: {
        type: String,
        required: [true, "you have to write a comment to the student for his grade"],
    },
});
export default gradeSchema;
