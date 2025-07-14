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

  // New Fields
  flaggedForReview: {
    type: Boolean,
    default: false
  },
  stopExam: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

proctorEventSchema.post('save', async function (doc) {
  try {
    if (doc.eventType !== 'anomaly') return;

    const ProctorEvent = connTwo.model('ProctorEvent');

    // Count all anomaly events for same student & exam
    const count = await ProctorEvent.countDocuments({
      studentId: doc.studentId,
      examId: doc.examId,
      eventType: 'anomaly'
    });

    if (count >= 5) {
      // Flag all anomaly events
      await ProctorEvent.updateMany(
        {
          studentId: doc.studentId,
          examId: doc.examId,
          eventType: 'anomaly'
        },
        {
          $set: { flaggedForReview: true }
        }
      );

      
    //   await ProctorEvent.findByIdAndUpdate(doc._id, {
    //     $set: { stopExam: true }
    //   });
    }

  } catch (error) {
    console.error("Error in proctorEventSchema post-save hook:", error);
  }
});

const ProctorEvent = connTwo.model('ProctorEvent', proctorEventSchema);

export default ProctorEvent;
