import express from 'express'
import { receiveProctorEvent } from '../../../controllers/SecondDB/eventAIProctor.controller.js'

const router = express.Router()

router.post('/emit-event' , receiveProctorEvent)

export default router;