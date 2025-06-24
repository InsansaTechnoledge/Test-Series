import express from 'express';
import { addRole, deleteRole, fetchRoleDetails, fetchRolesForOrganization, updateRole } from '../../../controllers/FirstDB/roles.controllers.js';
import { checkLimitAccess } from '../../../middleware/checkLimitAccess.middleware.js';

const router = express.Router();

router.post('/', checkLimitAccess,addRole);
router.get('/', fetchRolesForOrganization);
router.patch('/', updateRole);
router.delete('/:id', deleteRole);
router.get('/:id', fetchRoleDetails);

export default router;