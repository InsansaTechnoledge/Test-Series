import React , {useState} from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from '../features/afterAuth/components/Navbar/Navbar';
import LogoutModal from '../components/Logout/LogoutModal';
import { useTheme } from '../hooks/useTheme';
import PageFallback from '../features/afterAuth/components/ErrorBoundry/PageFallback';

const StudentLayout = () => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const {theme} = useTheme()

    const [isUsable] = useState(true);


  return (
    <>

      {showLogoutModal && (
          <LogoutModal setShowLogoutModal={setShowLogoutModal} />
        )}
      {
        isUsable ? (
          <div className='relative w-screen h-screen'>
        <div>
        <Navbar setShowLogoutModal={setShowLogoutModal}/>
        </div>
        <div className={` flex flex-col  gap-2  ${
          theme === 'light' ? 'bg-gray-100' : 'bg-gray-950'
        }`}>         <Outlet />
        </div>
      </div>
        ) : (
         <PageFallback setShowLogoutModal={setShowLogoutModal}/>
        )
      }
      
    </>
  )
}

export default StudentLayout;