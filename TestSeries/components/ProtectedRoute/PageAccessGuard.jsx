import React, { useState } from 'react';
import { useUser } from '../../contexts/currentUserContext';
import { useLocation } from 'react-router-dom';
import PageAccessContext from '../../contexts/PageAccessContext';
import Navbar from '../../features/afterAuth/components/Navbar/Navbar';
import LogoutModal from '../Logout/LogoutModal';

const PageAccessGuard = ({ children }) => {
  const [ShowLogoutModal, setShowLogoutModal] = useState(false);
  const { hasPlanFeature, user } = useUser();
  const location = useLocation();

  // Optional: wait until user is fully loaded
  if (!user) return null; // Or show a loading spinner

  const hasAccess =
    Boolean(user.planPurchased) &&
    Array.isArray(user.planFeatures) &&
    user.planFeatures.length > 0;

  if (hasAccess) {
    const canAccess = hasPlanFeature({
      keyFromPageOrAction: null,
      location: location.pathname,
    });

    return (
      <PageAccessContext.Provider value={canAccess}>
        {children}
      </PageAccessContext.Provider>
    );
  }

  
  return (
    <>
    {
      ShowLogoutModal && (
        <LogoutModal setShowLogoutModal={setShowLogoutModal}/>
      )
    }
      <Navbar setShowLogoutModal={setShowLogoutModal} />
      <div className="w-full h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-semibold text-red-600">Access Denied</h1>
        <p className="text-gray-500 mt-2">
          Your organization has not been approved yet. Please contact admin.
        </p>
      </div>
    </>
  );
};

export default PageAccessGuard;
