import { Schema, Types } from "mongoose";
import { connTwo } from '../../database/MongoDB.js';

// Logic to extract response from response field will depend on type of exams
const wrongAnswersSchema = new Schema({
    questionId: {
        type: String,
        required: [true, 'questionId is required']
    },
    response: {
        type: Schema.Types.Mixed,
        required: [true, 'response is required']
    }
},{
    _id: false
});

const descriptiveResponsesSchema = new Schema({
    questionId: {
        type: String,
        required: [true, 'questionId is required']
    },
    response: {
        type: Schema.Types.Mixed,
        required: [true, 'response is required']
    },
    obtainedMarks: {
        type: Number,
        default: 0
    }
},{
    _id: false
});

const resultSchema = new Schema({
    studentId: {
        type: Types.ObjectId,
        ref: "Student",
        required: [true, "StudentId is required"],
        index: true
    },
    examId: {
        type: String,
        required: [true, "Exam id is required"],
        index: true
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
    },
    resultDate: {
        type: Date,
        default: Date.now()
    },
    evaluated:{
        type: Boolean,
        default: true
    },
    descriptiveResponses: {
        type: [descriptiveResponsesSchema],
        default: []
    }
},{
    timestamps: true
});


const Result = connTwo.model("Result", resultSchema);
export default Result;

