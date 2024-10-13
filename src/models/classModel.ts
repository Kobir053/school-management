import mongoose, { Document, Schema, Types } from "mongoose";

export interface IClass extends Document {
    _id: Types.ObjectId;
    name: string;
    teacher: Types.ObjectId;
    students: Types.ObjectId[];
}

const classSchema = new Schema<IClass>({
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
        type: [{type: mongoose.Schema.Types.ObjectId, ref: "Student"}],
        default: [],
    },
});

const classModel = mongoose.model("Class", classSchema);

export default classModel;