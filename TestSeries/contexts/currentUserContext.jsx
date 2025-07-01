import React, { createContext, useContext, useEffect, useState } from "react";
import { match } from 'path-to-regexp';
import { VITE_PLAN_FEATURE_MAP, VITE_ROLE_FEATURE_MAP } from "../features/constants/env";

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

    const rawMap = JSON.parse(import.meta.env.VITE_PLAN_FEATURE_MAP || VITE_PLAN_FEATURE_MAP || '{}');
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
    const rawMap = JSON.parse(import.meta.env.VITE_PLAN_FEATURE_MAP || VITE_PLAN_FEATURE_MAP || '{}');
    return rawMap[location] || null;
  };

  const getRoleFeatureKeyFromLocation = (location) => {
    const rawMap = JSON.parse(import.meta.env.VITE_ROLE_FEATURE_MAP || VITE_ROLE_FEATURE_MAP|| '{}');
    return rawMap[location] || null;
  };

  const hasRoleAccess = ({ keyFromPageOrAction, location }) => {
    if (user?.role === 'organization') {
      return true; // Skip role access check for organization users
    }


    const rawMap = JSON.parse(import.meta.env.VITE_ROLE_FEATURE_MAP || VITE_ROLE_FEATURE_MAP || '{}');
    let matchedKey = null;


    if (keyFromPageOrAction) {
      const requiredFeatureKeys = matchedKey
        ? rawMap[matchedKey]
        : rawMap[keyFromPageOrAction];

      if (!requiredFeatureKeys) return false;

      const featureList = Array.isArray(requiredFeatureKeys)
        ? requiredFeatureKeys
        : [requiredFeatureKeys];

      const [category, action] = featureList[0]?.split(':') || [];

      return user?.roleFeatures?.[category]?.[action] === 'active';


    }

    // PAGE-based check: any feature active
    else if (location) {

      for (const routePattern in rawMap) {
        const matcher = match(routePattern, { decode: decodeURIComponent });
        const matched = matcher(location) || matcher(keyFromPageOrAction);
        if (matched) {
          matchedKey = routePattern;
          break;
        }
      }


      const requiredFeatureKeys = matchedKey
        ? rawMap[matchedKey]
        : rawMap[keyFromPageOrAction];

      if (!requiredFeatureKeys) return false;

      const featureList = Array.isArray(requiredFeatureKeys)
        ? requiredFeatureKeys
        : [requiredFeatureKeys];

      return featureList.some(feature => {
        const [category, action] = feature.split(':');
        return user?.roleFeatures?.[category]?.[action] === 'active';
      });
    }
    return false;
  };




  return (
    <currentUserContext.Provider value={{ user, setUser, isUserLoggedOut, setIsUserLoggedOut, hasPlanFeature, getFeatureKeyFromLocation, hasRoleAccess, getRoleFeatureKeyFromLocation }}>
      {children}
    </currentUserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(currentUserContext);
};