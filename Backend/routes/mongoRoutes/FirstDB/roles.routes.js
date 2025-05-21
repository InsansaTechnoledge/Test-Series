import express from 'express';
import { addRole, deleteRole, fetchRoleDetails, fetchRolesForOrganization, updateRole } from '../../../controllers/FirstDB/roles.controllers.js';

const router = express.Router();

router.post('/', addRole);
router.get('/', fetchRolesForOrganization);
router.patch('/', updateRole);
router.delete('/:id', deleteRole);
router.get('/:id', fetchRoleDetails);

export default router;