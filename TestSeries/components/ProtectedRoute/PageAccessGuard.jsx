import React, { cloneElement } from 'react';
import { useUser } from '../../contexts/currentUserContext';
import { useLocation } from 'react-router-dom';
import PageAccessContext from '../../contexts/PageAccessContext';


const PageAccessGuard = ({ children }) => {
    const { hasPlanFeature } = useUser();
    const location = useLocation()  ;
    // when used in the pageguard nothing to pass when pass in action or button have to pass parameter

    console.log("PageAccessGuard", location.pathname);
    const canAccess = hasPlanFeature({
        keyFromPageOrAction:null,
        location: location.pathname 
    });

    console.log("canAccess", canAccess);



      return (
    <PageAccessContext.Provider value={canAccess}>
      {children}
    </PageAccessContext.Provider>
  );    
};

export default PageAccessGuard;