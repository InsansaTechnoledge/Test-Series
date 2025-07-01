import React , {useState} from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from '../features/afterAuth/components/Navbar/Navbar';
import LogoutModal from '../components/Logout/LogoutModal';
import { useTheme } from '../hooks/useTheme';

const StudentLayout = () => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const {theme} = useTheme()
  return (
    <>
      {showLogoutModal && (
          <LogoutModal setShowLogoutModal={setShowLogoutModal} />
        )}

      <div className='relative w-screen h-screen'>
        <div>
        <Navbar setShowLogoutModal={setShowLogoutModal}/>
        </div>
        <div className={`h-screen flex flex-col  ${
          theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'
        }`}>         <Outlet />
        </div>
      </div>
    </>
  )
}

export default StudentLayout;