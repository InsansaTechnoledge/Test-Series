import ProctorEvent from "../../models/SecondDB/AiProctorEvent.model.js";
import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js";
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";

export const receiveProctorEvent = async (req , res) => {
    try{
        console.log("🟢 Received payload from C++ Engine:", req.body); 

        const { studentId, examId, eventType, timestamp, details } = req.body;

        if (!studentId || !examId || !eventType || !timestamp || !details) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

         const savedEvent = await ProctorEvent.create({
            studentId,
            examId,
            eventType,
            timestamp,
            details,
        });
  
        console.log("✅ Event saved:", savedEvent);

        return new APIResponse(201 , savedEvent, 'Event saved Sucessfully').send(res);
    } catch(error) {
        console.error('❌ Error saving proctor event:', error);
        return new APIError(500 , [error.message , 'internal server error']).send(res)
    }
}