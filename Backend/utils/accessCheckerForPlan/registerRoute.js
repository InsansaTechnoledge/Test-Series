import { checkFeatureAccess } from "../../middleware/checkFeatureAccess.middleware.js.js";
import { checkRoleAccess } from "../../middleware/checkRoleAccess.middleware.js";

export const registerRoute = (app, routePath, routeHandler, featureKey) => {
  if (featureKey) {
    app.use(routePath, checkFeatureAccess(featureKey),checkRoleAccess(featureKey), routeHandler);
  } else {
    app.use(routePath, routeHandler);
  }
};