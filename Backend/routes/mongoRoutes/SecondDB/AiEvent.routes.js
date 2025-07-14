import express from 'express'
import { checkToStopExamForStudent, fetchEventsBasedOnAnomalies, receiveProctorEvent, stopExamForStudent} from '../../../controllers/SecondDB/eventAIProctor.controller.js'

const router = express.Router()

router.post('/emit-event' , receiveProctorEvent)
router.get('/get-events' , fetchEventsBasedOnAnomalies)
router.patch('/stop/:studentId', stopExamForStudent);
router.get('/check-stop/:studentId', checkToStopExamForStudent);

// router.post('/emit-event-with-screenshot', uploadScreenshot, receiveProctorEventWithScreenshot);

// router.post('/emit-event-universal', uploadScreenshot, receiveProctorEventUniversal);

// router.get('/screenshot/:filename', (req, res) => {
//     const filename = req.params.filename;
//     const filepath = `./uploads/screenshots/${filename}`;
    
//     if (fs.existsSync(filepath)) {
//         res.sendFile(path.resolve(filepath));
//     } else {
//         res.status(404).json({ message: 'Screenshot not found' });
//     }
// });

// router.get('/events/:studentId/:examId', async (req, res) => {
//     try {
//         const { studentId, examId } = req.params;
//         const events = await ProctorEvent.find({ 
//             studentId, 
//             examId 
//         }).sort({ createdAt: -1 });
        
//         res.json({ events });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });


export default router;