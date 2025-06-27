import {Schema} from 'mongoose'
import { connTwo } from '../../database/MongoDB.js';

const proctorEventSchema = new Schema({
    studentId: {
        type: Schema.Types.ObjectId, 
        required: true
      },
      examId: { type: String, required: true },
      eventType: { type: String, required: true },
      timestamp: { type: String, required: true },
      details: { type: String, required: true }
    }, { timestamps: true });
  
  const ProctorEvent = connTwo.model('ProctorEvent', proctorEventSchema);
  
  export default ProctorEvent;