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
import eventAiRoutes from './mongoRoutes/SecondDB/AiEvent.routes.js'
import certificateRoutes from './mongoRoutes/SecondDB/certificateTemplate.routes.js'

import { registerRoute } from '../utils/accessCheckerForPlan/registerRoute.js';
const routeFeatureMap = JSON.parse(process.env.ROUTE_FEATURE_MAP || '{}');

const routes = (app) => {


    registerRoute(app,'/api/v1/role',roleRouter,routeFeatureMap['/api/v1/role']);

    registerRoute(app,'/api/v1/subscriptionPlan',subscriptionPlanRouter,null);

    registerRoute(app,'/api/v1/feature',featureRoutes,routeFeatureMap['/api/v1/feature']);

    registerRoute(app,'/api/v1/organization',organizationRoutes,null);

    registerRoute(app,'/api/v1/users',userRoutes,routeFeatureMap['/api/v1/users']);

    registerRoute(app,'/api/v1/result',resultRoutes,routeFeatureMap['/api/v1/result']);

    registerRoute(app,'/api/v1/student',studentRoutes,routeFeatureMap['/api/v1/student']);

    registerRoute(app,'/api/v1/auth',authRoutes,null);

    registerRoute(app,'/api/v1/exam',examRoutes,routeFeatureMap['/api/v1/exam']);

    registerRoute(app,'/api/v1/syllabus',syllabusRoutes,routeFeatureMap['/api/v1/syllabus']);

    registerRoute(app,'/api/v1/batch',batchRoutes,routeFeatureMap['/api/v1/batch']);

    registerRoute(app,'/api/v1/questionUpload',questionUploadRoutes,routeFeatureMap['/api/v1/questionUpload']);

    registerRoute(app,'/api/v1/question',questionRoutes,routeFeatureMap['/api/v1/question']);

    registerRoute(app,'/api/v1/video',videoRoutes,routeFeatureMap['/api/v1/video']);

    registerRoute(app,'/api/v1/contest',contestRoutes,routeFeatureMap['/api/v1/contest']);

    registerRoute(app,'/api/v1/certificate' , certificateRoutes)

    app.use('/api/v1/proctor' , eventAiRoutes)

}

export default routes;
