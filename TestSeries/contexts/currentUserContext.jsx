import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const currentUserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [isUserLoggedOut, setIsUserLoggedOut] = useState(true);
    useEffect(() => {
        if (user) {
            setIsUserLoggedOut(false)
        }
    }, [user])

    const hasPlanFeature = ({keyFromPageOrAction,location}) => {

        const rawMap=JSON.parse(import.meta.env.VITE_PLAN_FEATURE_MAP || '{}');
        console.log("rawMap", rawMap);
               
        const featureKeys = location
    ? rawMap[location] // e.g. "/institute/batch-list"
    : rawMap[keyFromPageOrAction];

  if (!featureKeys) return false; // no mapping exists

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



    return (
        <currentUserContext.Provider value={{ user, setUser, isUserLoggedOut, setIsUserLoggedOut ,hasPlanFeature}}>
            {children}
        </currentUserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(currentUserContext);
};