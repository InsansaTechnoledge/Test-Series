// import {Schema} from 'mongoose'
// import { connTwo } from '../../database/MongoDB.js';

// const proctorEventSchema = new Schema({
//     studentId: {
//         type: Schema.Types.ObjectId, 
//         required: true
//       },
//       examId: { type: String, required: true },
//       eventType: { type: String, required: true },
//       timestamp: { type: String, required: true },
//       details: { type: String, required: true }
//     }, { timestamps: true });
  
//   const ProctorEvent = connTwo.model('ProctorEvent', proctorEventSchema);
  
//   export default ProctorEvent;

import { Schema } from 'mongoose';
import { connTwo } from '../../database/MongoDB.js';

const proctorEventSchema = new Schema({
    studentId: {
        type: Schema.Types.ObjectId, 
        required: true
    },
    examId: { 
        type: String, 
        required: true 
    },
    eventType: { 
        type: String, 
        required: true 
    },
    timestamp: { 
        type: String, 
        required: true 
    },
    details: { 
        type: String, 
        required: true 
    },
    // New field for screenshot information
    screenshot: {
        filename: { type: String },
        originalname: { type: String },
        size: { type: Number },
        mimetype: { type: String },
        path: { type: String },
        uploadedAt: { type: String }
    },
    // Optional: Add fields for anomaly classification
    isAnomaly: { 
        type: Boolean, 
        default: false 
    },
    severity: { 
        type: String, 
        enum: ['LOW', 'MEDIUM', 'HIGH'], 
        default: 'MEDIUM' 
    },
    // Optional: Add processing status
    processed: { 
        type: Boolean, 
        default: false 
    },
    processingNotes: { 
        type: String 
    }
}, { timestamps: true });

// Add indexes for better query performance
proctorEventSchema.index({ studentId: 1, examId: 1 });
proctorEventSchema.index({ eventType: 1 });
proctorEventSchema.index({ isAnomaly: 1 });
proctorEventSchema.index({ createdAt: -1 });

const ProctorEvent = connTwo.model('ProctorEvent', proctorEventSchema);

export default ProctorEvent;