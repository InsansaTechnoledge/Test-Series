import featureRoutes from './mongoRoutes/FirstDB/features.routes.js'
import organizationRoutes from './mongoRoutes/FirstDB/organization.routes.js'
import userRoutes from './mongoRoutes/FirstDB/user.routes.js';


const routes = (app) => {
    app.use('/api/v1/feature' , featureRoutes)
    app.use('/api/v1/organization' , organizationRoutes)
    app.use('/api/v1/users',userRoutes);

}

export default routes;
