import { useState } from 'react';
import { useUser } from '../../contexts/currentUserContext';
import { useLocation } from 'react-router-dom';
import PageAccessContext from '../../contexts/PageAccessContext';
import Navbar from '../../features/afterAuth/components/Navbar/Navbar';
import LogoutModal from '../Logout/LogoutModal';
import AccessDenied from '../NoAccessPage/AccessDenied';

const PageAccessGuard = ({ children }) => {
  const [ShowLogoutModal, setShowLogoutModal] = useState(false);
  const { hasPlanFeature, user, hasRoleAccess } = useUser();
  const location = useLocation();


  if (!user) return null; 

  const hasAccess =
    user.role === 'organization' ?
      Boolean(user.planPurchased) && Object.keys(user.planFeatures || {}).length > 0
      : Object.keys(user.planFeatures || {}).length > 0


  if (hasAccess) {
    let canAccess = false;
    const hasPlanAccess = hasPlanFeature({
      keyFromPageOrAction: null,
      location: location.pathname
    });
    console.log("hasPlanAccess", hasPlanAccess);


    if (user.role === 'organization') {
      canAccess = hasPlanAccess;
      console.log("canAccess", canAccess);
      return (
        <PageAccessContext.Provider value={canAccess}>
          {children}
        </PageAccessContext.Provider>
      );

    } else {
      const hasRoleBasedAccess = hasRoleAccess({
        keyFromPageOrAction: null,
        location: location.pathname
      });

      console.log("hasRoleBasedAccess", hasRoleBasedAccess);
      canAccess = hasPlanAccess && hasRoleBasedAccess;
      console.log("canAccess", canAccess);


       if(hasRoleBasedAccess){ return (
          <PageAccessContext.Provider value={canAccess}>
            {children}
          </PageAccessContext.Provider>
        );
      }

    }



  }


  return (
    <>
      {
        ShowLogoutModal && (
          <LogoutModal setShowLogoutModal={setShowLogoutModal} />
        )
      }
      <Navbar setShowLogoutModal={setShowLogoutModal} />
      {/* <div className="w-full h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-semibold text-red-600">Access Denied</h1>
        <p className="text-gray-500 mt-2">
          Your organization has not been approved yet. Please contact admin.
        </p>
      </div> */}
      <AccessDenied />
    </>
  );
};

export default PageAccessGuard;