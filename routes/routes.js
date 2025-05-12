import app from "../app.js".<<<<<<< HEAD
import userRoutes from './mongoRoutes/FirstDB/user.routes.js';

const routes=(app)=>{
    app.use('/api/v1/users',userRoutes);
}

export default routes;
