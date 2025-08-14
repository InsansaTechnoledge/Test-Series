import express from 'express'
import { isOrganizationAuthenticated } from '../../../middleware/isLoggedIn.middleware.js';
import { getActiveUsers } from '../../../controllers/FirstDB/adminlogs.controllers.js';

const router = express.Router();


router.get('/active-users', getActiveUsers);


export default router 
