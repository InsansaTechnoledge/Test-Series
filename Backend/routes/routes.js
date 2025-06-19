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
import questionUploadRoutes from './supabaseRoutes/questionUpload.routes.js'
import questionRoutes from './supabaseRoutes/question.routes.js';
import videoRoutes from './supabaseRoutes/video.routes.js';
import contestRoutes from './supabaseRoutes/contest.routes.js';
import { checkFeatureAccess } from '../middleware/checkFeatureAccess.js';

const routes = (app) => {
    app.use('/api/v1/role', checkFeatureAccess('role_feature'),roleRouter);
    app.use('/api/v1/subscriptionPlan', subscriptionPlanRouter);
    app.use('/api/v1/feature', checkFeatureAccess("role_feature"),featureRoutes)
    app.use('/api/v1/organization', organizationRoutes)
    app.use('/api/v1/users',checkFeatureAccess('user_feature'), userRoutes);
    app.use('/api/v1/result', checkFeatureAccess('exam_feature'),resultRoutes);
    app.use('/api/v1/student', checkFeatureAccess('student_feature'),studentRoutes);
    app.use('/api/v1/auth',authRoutes);
    app.use('/api/v1/exam', checkFeatureAccess('exam_feature'),examRoutes);
    app.use('/api/v1/syllabus',checkFeatureAccess('batch_feature'),syllabusRoutes);
    app.use('/api/v1/batch' ,checkFeatureAccess('batch_feature'), batchRoutes); 
    app.use('/api/v1/questionUpload', checkFeatureAccess('exam_feature'),questionUploadRoutes);
    app.use('/api/v1/question', checkFeatureAccess('exam_feature'),questionRoutes);
    app.use('/api/v1/video', checkFeatureAccess('videoMaterial_feature'),videoRoutes);
    app.use('/api/v1/contest',checkFeatureAccess('coding_feature'),contestRoutes);

}

export default routes;
