import ProctorEvent from "../../models/SecondDB/AiProctorEvent.model.js";
import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js";
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";

export const receiveProctorEvent = async (req , res) => {
    try{
        console.log("🟢 Received payload from C++ Engine:", req.body); 

        const { events } = req.body;

        // if (!studentId || !examId || !eventType || !timestamp || !details) {
        //     return res.status(400).json({ message: 'Missing required fields' });
        // }

         const savedEvent = await ProctorEvent.insertMany(events);

        console.log("✅ Event saved:", savedEvent);

        return new APIResponse(201 , savedEvent, 'Event saved Sucessfully').send(res);
    } catch(error) {
        console.error('❌ Error saving proctor event:', error);
        return new APIError(500 , [error.message , 'internal server error']).send(res)
    }
}

export const fetchEventsBasedOnAnomalies = async (req, res) => {
    try {
      const data = await ProctorEvent.find({   
        eventType: 'anomaly',
        // flaggedForReview: true,
        stopExam: false
      });
  
      if (!data || data.length === 0) {
        return new APIResponse(200 , data ,'No anomalies found').send(res);
      }
  
      return new APIResponse(200, data, 'Anomalies found successfully').send(res);
  
    } catch (e) {
      return new APIError(500, ['Something went wrong while fetching anomaly list', e.message]).send(res);
    }
  };
  
  
export const stopExamForStudent = async (req, res) => {
    try {
      const { studentId } = req.params;
  
      if (!studentId) {
        return new APIError(404, 'No student ID provided').send(res);
      }
  
      const result = await ProctorEvent.updateMany(
        { studentId },
        { $set: { stopExam: true } }
      );
  
      if (result.modifiedCount === 0) {
        return new APIError(404, result ,  'No matching records found to update').send(res);
      }
  
      return new APIResponse(200, result, 'Exam stopped for student successfully').send(res);
    } catch (e) {
      return new APIError(500, ['Something went wrong', e.message]).send(res);
    }
  };

  export const checkToStopExamForStudent = async (req, res) => {
    try {
      const { studentId } = req.params;
  
      if (!studentId) {
        return new APIError(400, 'Student ID is required').send(res);
      }
  
      // Check if any event has stopExam: true for this student
      const shouldStop = await ProctorEvent.exists({ studentId, stopExam: true });
  
      return new APIResponse(200, { stopExam: !!shouldStop }, 'Checked stop exam status').send(res);
    } catch (e) {
      return new APIError(500, ['Failed to check stop exam status', e.message]).send(res);
    }
  };

// import ProctorEvent from "../../models/SecondDB/AiProctorEvent.model.js";
// import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js";
// import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';

// // Configure multer for file uploads
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const uploadDir = './uploads/screenshots';
//         if (!fs.existsSync(uploadDir)) {
//             fs.mkdirSync(uploadDir, { recursive: true });
//         }
//         cb(null, uploadDir);
//     },
//     filename: function (req, file, cb) {
//         // Generate unique filename with timestamp
//         const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
//         const studentId = req.body.eventData ? 
//             JSON.parse(req.body.eventData).studentId || 'unknown' : 'unknown';
//         cb(null, `${studentId}_${timestamp}_${file.originalname}`);
//     }
// });

// const upload = multer({ 
//     storage: storage,
//     limits: {
//         fileSize: 10 * 1024 * 1024, // 10MB limit
//     },
//     fileFilter: function (req, file, cb) {
//         // Only allow image files
//         if (file.mimetype.startsWith('image/')) {
//             cb(null, true);
//         } else {
//             cb(new Error('Only image files are allowed'));
//         }
//     }
// });

// // Original endpoint for JSON-only events (keep this for backward compatibility)
// export const receiveProctorEvent = async (req, res) => {
//     try {
//         console.log("🟢 Received payload from C++ Engine:", req.body); 

//         const { studentId, examId, eventType, timestamp, details } = req.body;

//         if (!studentId || !examId || !eventType || !timestamp || !details) {
//             return res.status(400).json({ message: 'Missing required fields' });
//         }

//         const savedEvent = await ProctorEvent.create({
//             studentId,
//             examId,
//             eventType,
//             timestamp,
//             details,
//         });

//         console.log("✅ Event saved:", savedEvent);

//         return new APIResponse(201, savedEvent, 'Event saved Successfully').send(res);
//     } catch (error) {
//         console.error('❌ Error saving proctor event:', error);
//         return new APIError(500, [error.message, 'internal server error']).send(res);
//     }
// }

// // New endpoint for events with screenshots
// export const receiveProctorEventWithScreenshot = async (req, res) => {
//     try {
//         console.log("🟢 Received event with screenshot from C++ Engine");
        
//         let eventData;
        
//         // Check if this is a multipart request (with screenshot)
//         if (req.file && req.body.eventData) {
//             // Parse JSON from form field
//             eventData = JSON.parse(req.body.eventData);
//             console.log("📋 Event data:", eventData);
//             console.log("📸 Screenshot info:", {
//                 filename: req.file.filename,
//                 size: req.file.size,
//                 mimetype: req.file.mimetype
//             });
//         } else {
//             // Fallback to regular JSON body (no screenshot)
//             eventData = req.body;
//             console.log("📋 Event data (no screenshot):", eventData);
//         }

//         const { studentId, examId, eventType, timestamp, details } = eventData;

//         if (!studentId || !examId || !eventType || !timestamp || !details) {
//             return res.status(400).json({ message: 'Missing required fields' });
//         }

//         // Prepare event data for database
//         const eventToSave = {
//             studentId,
//             examId,
//             eventType,
//             timestamp,
//             details,
//         };

//         // Add screenshot info if available
//         if (req.file) {
//             eventToSave.screenshot = {
//                 filename: req.file.filename,
//                 originalname: req.file.originalname,
//                 size: req.file.size,
//                 mimetype: req.file.mimetype,
//                 path: req.file.path,
//                 uploadedAt: new Date().toISOString()
//             };
//         }

//         const savedEvent = await ProctorEvent.create(eventToSave);

//         console.log("✅ Event saved with screenshot:", savedEvent);

//         return new APIResponse(201, {
//             event: savedEvent,
//             screenshot: req.file ? {
//                 filename: req.file.filename,
//                 size: req.file.size
//             } : null
//         }, 'Event saved Successfully').send(res);

//     } catch (error) {
//         console.error('❌ Error saving proctor event with screenshot:', error);
        
//         // Clean up uploaded file on error
//         if (req.file && fs.existsSync(req.file.path)) {
//             try {
//                 fs.unlinkSync(req.file.path);
//                 console.log("🗑️ Cleaned up uploaded file due to error");
//             } catch (cleanupError) {
//                 console.error("❌ Error cleaning up file:", cleanupError);
//             }
//         }
        
//         return new APIError(500, [error.message, 'internal server error']).send(res);
//     }
// }

// // Middleware wrapper for multer
// export const uploadScreenshot = upload.single('screenshot');

// // Universal endpoint that handles both cases
// export const receiveProctorEventUniversal = async (req, res) => {
//     try {
//         console.log("🟢 Received payload from C++ Engine");
        
//         let eventData;
//         let screenshotInfo = null;
        
//         // Determine if this is multipart or JSON request
//         if (req.file && req.body.eventData) {
//             // Multipart request with screenshot
//             eventData = JSON.parse(req.body.eventData);
//             screenshotInfo = {
//                 filename: req.file.filename,
//                 originalname: req.file.originalname,
//                 size: req.file.size,
//                 mimetype: req.file.mimetype,
//                 path: req.file.path,
//                 uploadedAt: new Date().toISOString()
//             };
//             console.log("📋 Event data with screenshot:", eventData);
//             console.log("📸 Screenshot info:", screenshotInfo);
//         } else {
//             // Regular JSON request
//             eventData = req.body;
//             console.log("📋 Event data (JSON only):", eventData);
//         }

//         const { studentId, examId, eventType, timestamp, details } = eventData;

//         // Validation
//         if (!studentId || !examId || !eventType || !timestamp || !details) {
//             // Clean up uploaded file on validation error
//             if (req.file && fs.existsSync(req.file.path)) {
//                 fs.unlinkSync(req.file.path);
//             }
//             return res.status(400).json({ message: 'Missing required fields' });
//         }

//         // Prepare event data for database
//         const eventToSave = {
//             studentId,
//             examId,
//             eventType,
//             timestamp,
//             details,
//         };

//         // Add screenshot info if available
//         if (screenshotInfo) {
//             eventToSave.screenshot = screenshotInfo;
//         }

//         const savedEvent = await ProctorEvent.create(eventToSave);

//         console.log("✅ Event saved:", savedEvent);

//         return new APIResponse(201, {
//             event: savedEvent,
//             hasScreenshot: !!screenshotInfo,
//             screenshot: screenshotInfo ? {
//                 filename: screenshotInfo.filename,
//                 size: screenshotInfo.size
//             } : null
//         }, 'Event saved Successfully').send(res);

//     } catch (error) {
//         console.error('❌ Error saving proctor event:', error);
        
//         // Clean up uploaded file on error
//         if (req.file && fs.existsSync(req.file.path)) {
//             try {
//                 fs.unlinkSync(req.file.path);
//                 console.log("🗑️ Cleaned up uploaded file due to error");
//             } catch (cleanupError) {
//                 console.error("❌ Error cleaning up file:", cleanupError);
//             }
//         }
        
//         return new APIError(500, [error.message, 'internal server error']).send(res);
//     }
// }