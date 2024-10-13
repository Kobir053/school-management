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
        maxlength: [50, "you allow to write a comment that its length is until 50 letters"],
    },
});
export default gradeSchema;
