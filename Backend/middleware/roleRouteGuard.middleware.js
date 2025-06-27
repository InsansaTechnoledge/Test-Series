import { categoryToRoutes } from "../config/roleRouteMap.config.js";
import { APIError } from "../utils/ResponseAndError/ApiError.utils.js";

export const roleRouteGuard = (req,res,next)=>{
    const path= req.route.path;
    const method = req.method;
    const category = req.roleKey;

    console.log("🗓️Checking role access for path:", path, "and method:", method);

    const routeConfig=categoryToRoutes?.[req.roleKey]?.[path];
    if(!routeConfig) {
        console.log(`No role found for the route: ${req.roleKey}/${path}`);
        return new APIError(403, "Forbidden", "You do not have access to this route").send(res);
    }

    
      if (!routeConfig.methods.includes(method)) {
    return res.status(405).json({ error: `Method ${method} not allowed on ${path}` });
  }

   const requiredFeature = routeConfig.roleFeature;
  const isFeatureActive = req.user.roleFeatures?.[category]?.[requiredFeature] === 'active';

  if (!isFeatureActive) {
    return new APIError(403, `Access denied to feature: ${requiredFeature}`).send(res);
  }

  console.log(`✅ Role feature allowed: ${category}.${requiredFeature}`);
  next();


}