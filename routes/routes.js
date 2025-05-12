import roleRouter from './mongoRoutes/FirstDB/roles.routes.js';
import subscriptionPlanRouter from './mongoRoutes/FirstDB/subscriptionPlan.routes.js';

const routes=(app)=>{
    app.use('/api/v1/role/', roleRouter);
    app.use('/api/v1/subscriptionPlan/', subscriptionPlanRouter);

}
export default routes;