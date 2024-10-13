import mongoose, { Document, Schema, Types } from "mongoose";

export interface IClass extends Document {
    _id: Types.ObjectId;
    name: string;
    students: Types.ObjectId[];
}

const classSchema = new Schema<IClass>({
    name: {
        type: String,
        required: [true, "you have to enter the name oof the class"],
        unique: true,
    },
    students: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: "Student"}],
        default: [],
    },
});

const classModel = mongoose.model("Class", classSchema);

export default classModel;