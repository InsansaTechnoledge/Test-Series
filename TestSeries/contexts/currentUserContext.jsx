import React, { createContext, useContext, useEffect, useState } from "react";
import { match } from 'path-to-regexp';

const currentUserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [isUserLoggedOut, setIsUserLoggedOut] = useState(true);
  useEffect(() => {
    if (user) {
      setIsUserLoggedOut(false)
    }
  }, [user])

  const hasPlanFeature = ({ keyFromPageOrAction, location }) => {

    const rawMap = JSON.parse(import.meta.env.VITE_PLAN_FEATURE_MAP || '{}');
    let matchedKey = null;

    for (const routePattern in rawMap) {
      const matcher = match(routePattern, { decode: decodeURIComponent });
      const matched = matcher(location) || matcher(keyFromPageOrAction);
      if (matched) {
        matchedKey = routePattern;
        break;
      }
    }

    const featureKeys = matchedKey
      ? rawMap[matchedKey] 
      : rawMap[keyFromPageOrAction];

    if (!featureKeys) return false;
    const features = Array.isArray(featureKeys) ? featureKeys : [featureKeys];

    console.log("features", features);

    for (const feature of features) {
      const value = user?.planFeatures?.[feature]?.value;

      if (
        (typeof value === 'boolean' && value !== true) ||
        (typeof value === 'number' && value <= 0) ||
        value === undefined
      ) {
        return false;
      }
    }

    return true; // all features are valid



  }

  const getFeatureKeyFromLocation = (location) => {
    const rawMap = JSON.parse(import.meta.env.VITE_PLAN_FEATURE_MAP || '{}');
    return rawMap[location] || null;
  };



  return (
    <currentUserContext.Provider value={{ user, setUser, isUserLoggedOut, setIsUserLoggedOut, hasPlanFeature, getFeatureKeyFromLocation }}>
      {children}
    </currentUserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(currentUserContext);
};