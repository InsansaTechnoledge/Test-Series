import { Schema, Types } from "mongoose";
import { connTwo } from '../../database/MongoDB';

// Logic to extract response from response field will depend on type of exams
const wrongAnswersSchema = new Schema({
    questionId: {
        type: String,
        required: [true, 'questionId is required']
    },
    response: {
        type: String,
        required: [true, 'response is required']
    }
},{
    _id: false
});

const resultSchema = new Schema({
    studentId: {
        type: Types.ObjectId,
        ref: "Student",
        required: [true, "StudentId is required"]
    },
    examId: {
        type: String,
        required: [true, "Exam id is required"]
    },
    status: {
        type: String,
        enum: ["attempted", "unattempted", "disqualified"],
        required: [true, "Status is required"]
    },
    wrongAnswers: {
        type: [wrongAnswersSchema],
        default: []
    },
    unattempted: {
        type: [String],
        default: []
    },
    marks: {
        type: Number,
        required: [true, "Marks are required"]
    },
    rank: {
        type: Number,
        min: [1, `Rank can't be negative`]
    }
},{
    timestamps: true
});


const Result = connTwo.model("Result", resultSchema);
export default Result;

