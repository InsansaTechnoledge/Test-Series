import roleRouter from './mongoRoutes/FirstDB/roles.routes.js';
import subscriptionPlanRouter from './mongoRoutes/FirstDB/subscriptionPlan.routes.js';
import featureRoutes from './mongoRoutes/FirstDB/features.routes.js'
import organizationRoutes from './mongoRoutes/FirstDB/organization.routes.js'
import userRoutes from './mongoRoutes/FirstDB/user.routes.js';
import studentRoutes from './mongoRoutes/FirstDB/student.routes.js'
import resultRoutes from './mongoRoutes/SecondDB/result.routes.js';
import authRoutes from './mongoRoutes/FirstDB/auth.routes.js';
import examRoutes from './supabaseRoutes/exam.routes.js';
import syllabusRoutes from './supabaseRoutes/syllabus.routes.js';
import batchRoutes from './supabaseRoutes/batch.routes.js'

const routes = (app) => {
    app.use('/api/v1/role', roleRouter);
    app.use('/api/v1/subscriptionPlan', subscriptionPlanRouter);
    app.use('/api/v1/feature', featureRoutes)
    app.use('/api/v1/organization', organizationRoutes)
    app.use('/api/v1/users', userRoutes);
    app.use('/api/v1/result', resultRoutes);
    app.use('/api/v1/student', studentRoutes);
    app.use('/api/v1/auth',authRoutes);
    app.use('/api/v1/exam', examRoutes);
    app.use('/api/v1/syllabus',syllabusRoutes);
    app.use('/api/v1/batch' , batchRoutes);
}

export default routes;
