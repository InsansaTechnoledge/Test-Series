import React, { cloneElement } from 'react';
import { useUser } from '../../contexts/currentUserContext';
import { useLocation } from 'react-router-dom';
import PageAccessContext from '../../contexts/PageAccessContext';


const PageAccessGuard = ({ children }) => {
    const { hasPlanFeature ,user} = useUser();
    const location = useLocation()  ;
    // when used in the pageguard nothing to pass when pass in action or button have to pass parameter

    if(user?.planPurchased || user?.planFeatures){

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
}else{
    if (!user.planPurchased) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-semibold text-red-600">Access Denied</h1>
        <p className="text-gray-500 mt-2">Your organization has not been approved yet. Please contact admin.</p>
      </div>
    );
  }

}

};

export default PageAccessGuard;