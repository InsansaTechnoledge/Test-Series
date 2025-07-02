import { categoryToRoutes } from "../config/roleRouteMap.config.js";
import { APIError } from "../utils/ResponseAndError/ApiError.utils.js";

export const roleRouteGuard = (req, res, next) => {
  if (req.user.role === 'organization') {
    console.log("🗓️ User is an organization, skipping role access check.")
    return next();
  }
  if(req.method === 'GET' || req.user.role === 'student') {
    console.log("🗓️ User is a student or GET request, skipping role access  check.");
    return next();
  }
  
  const path = req.route.path;
  const method = req.method;
  const category = req.roleKey;

  console.log("🗓️Checking role access for path:", path, "and method:", method);

  const routeConfig = categoryToRoutes?.[category]?.[path]?.[method];

  if (!routeConfig) {
    console.log(`⛔ Access denied: No config for ${category}${path} [${method}]`);
    return res.status(403).json({
      error: `You do not have access to ${path} with method ${method}`,
    });
  }

  const requiredFeature = routeConfig.roleFeature;
  const isFeatureActive = req.user.roleFeatures?.[category]?.[requiredFeature] === "active";

  if (!isFeatureActive) {
    return new APIError(403, `Access denied to feature: ${requiredFeature}`).send(res);
  }

  console.log(`✅ Role feature allowed: ${category}.${requiredFeature}`);
  next();


}