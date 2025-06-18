import React , {useState} from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from '../features/afterAuth/components/Navbar/Navbar';
import LogoutModal from '../components/Logout/LogoutModal';

const StudentLayout = () => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  return (
    <>
      {showLogoutModal && (
          <LogoutModal setShowLogoutModal={setShowLogoutModal} />
        )}

      <div className='relative w-screen h-screen'>
        <div>
        <Navbar setShowLogoutModal={setShowLogoutModal}/>
        </div>
        <div className='p-6 md:p-10 max-w-7xl mx-auto'>
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default StudentLayout;