import express from 'express'
import { addNewFeaturesToPlan, addSubscription, deleteSubscription, getSubscriptionFeaturesByPlanId, getSubscriptionPlanById, getSubscriptionPlans, removeOldFeaturesFromPlan, updateSubscription } from '../../../controllers/FirstDB/subscriptionPlan.controllers.js';

const router = express.Router();

router.post('/', addSubscription);
router.get('/', getSubscriptionPlans);
router.delete('/:id', deleteSubscription);
router.patch('/:id', updateSubscription);
router.post('/features/add/:id', addNewFeaturesToPlan);
router.post('/features/remove/:id', removeOldFeaturesFromPlan);
router.get('/features/:id', getSubscriptionFeaturesByPlanId);
router.get('/:id', getSubscriptionPlanById);

export default router;