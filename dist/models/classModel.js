import mongoose, { Schema } from "mongoose";
const classSchema = new Schema({
    name: {
        type: String,
        required: [true, "you have to enter the name oof the class"],
        unique: true,
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: [true, "the class must to have a teacher..."],
    },
    students: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
        default: [],
    },
});
const classModel = mongoose.model("Class", classSchema);
export default classModel;
