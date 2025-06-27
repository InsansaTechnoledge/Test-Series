import express from 'express';
import { addRole, deleteRole, fetchRoleDetails, fetchRolesForOrganization, updateRole } from '../../../controllers/FirstDB/roles.controllers.js';
import { checkLimitAccess } from '../../../middleware/checkLimitAccess.middleware.js';
import { roleRouteGuard } from '../../../middleware/roleRouteGuard.middleware.js';

const router = express.Router();

router.post('/', roleRouteGuard,checkLimitAccess,addRole);
router.get('/', fetchRolesForOrganization);
router.patch('/', roleRouteGuard,updateRole);
router.delete('/:id', roleRouteGuard,deleteRole);
router.get('/:id', fetchRoleDetails);

export default router;