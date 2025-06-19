import { checkFeatureAccess } from "../../middleware/checkFeatureAccess.js";

export const registerRoute = (app, routePath, routeHandler, featureKey) => {
  if (featureKey) {
    app.use(routePath, checkFeatureAccess(featureKey), routeHandler);
  } else {
    app.use(routePath, routeHandler);
  }
};