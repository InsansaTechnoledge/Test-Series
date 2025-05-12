import express from 'express';
import { addRole, deleteRole, fetchRoleDetails, fetchRolesForOrganization, updateRole } from '../../../controllers/FirstDB/roles.controllers.js';

const router = express.Router();

router.post('/', addRole);
router.delete('/:id', deleteRole);
router.patch('/:id', updateRole);
router.get('/organization/:id', fetchRolesForOrganization);
router.get('/:id', fetchRoleDetails);

export default router;