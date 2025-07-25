import React, { useState } from 'react';
import { ChevronDown, User, LogOut, Settings, DoorClosed, LogOutIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LogoutModal from '../../../../../../components/Logout/LogoutModal';
import QBMSLogo from '../../../../../../assests/Logo/QBMS.svg'
import { useUser } from '../../../../../../contexts/currentUserContext';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const {user} = useUser();

  console.log(user)
  const navigate = useNavigate();

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleExitToEvalvo = () => {
    navigate('/')
  };

  const handleLogOut = () => {
    navigate('/')
    setShowLogoutModal(true);
  }

  return (
    <>
    {showLogoutModal && (
        <LogoutModal setShowLogoutModal={setShowLogoutModal} />
      )}
    <nav className="  px-12 py-4 flex justify-between items-center ">
      <div className="text-white font-bold text-2xl tracking-tight">
       <img src={QBMSLogo} alt="" />
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="text-white bg-indigo-400 flex items-center space-x-3 px-5 py-2.5  rounded-2xl transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/30"
          >
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <span className="font-medium">{user?.name || 'undefined'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-2xl z-10 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{user?.name || 'undefined'}</p>
                    <p className="text-sm text-gray-500">{user?.email || 'unknown@email.com'}</p>
                  </div>
                </div>
              </div>
              <ul className="p-2">
                <li>
                  <button
                    onClick={() => handleLogOut()}
                    className="w-full text-left flex items-center space-x-3 text-gray-700 px-4 py-3 hover:bg-red-50 rounded-xl transition-colors group"
                  >
                    <LogOut className="w-4 h-4 group-hover:text-red-600" />
                    <span className="group-hover:text-red-600">Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        <button
          onClick={handleExitToEvalvo}
          className=" flex gap-2 bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-50 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 border border-white/20"
        >
          <LogOutIcon/>
          Exit to Evalvo
        </button>
      </div>
    </nav>
    </>
  );
};

export default Navbar;