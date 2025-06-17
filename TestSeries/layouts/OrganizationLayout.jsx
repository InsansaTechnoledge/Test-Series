import { BookOpen, Info, LogOut, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../features/afterAuth/components/Navbar/Navbar';
import LogoutModal from '../components/Logout/LogoutModal';
import BottomNavigator from '../features/afterAuth/components/Navigator/BottomNavigator';

export default function OrganizationLayout() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    console.log('Current location changed:', location.pathname);
  }, [location.pathname]);

  return (
    <>
      {showLogoutModal && (
        <LogoutModal setShowLogoutModal={setShowLogoutModal} />
      )}

      <div className="flex bg-blue-50/30 flex-col h-screen w-screen overflow-hidden">
        <Navbar setShowLogoutModal={setShowLogoutModal}/>

        <main className="flex-1 overflow-y-auto pb-24">
          <div className="p-6">
            <Outlet />
          </div>
        </main>

        <BottomNavigator setShowLogoutModal={setShowLogoutModal} />
      </div>
    </>
  );
}