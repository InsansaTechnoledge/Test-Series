import React, { useState } from 'react';
import profile2 from '../../../../assests/Institute/profile.png';
import { useUser } from '../../../../contexts/currentUserContext';
import LogoutModal from '../../../../components/Logout/LogoutModal';

const Navbar = () => {
  const { user } = useUser();
  console.log(user)

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  console.log(user?.user.logoUrl)

  const User = user?.user || user;
  const profile = User.logoUrl || profile2

  return (
    <>
    {
      showLogoutModal
      ?
      <LogoutModal setShowLogoutModal={setShowLogoutModal}/>
      :
      null
    }
      <div className="w-full z-40 bg-indigo-950 border-b border-gray-200">
        <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">

          {/* Logo on the left */}
          <a href="/" className="flex items-center space-x-3">
            <img src={profile} className="h-8" alt="Logo" />
            <span className="text-2xl font-semibold text-white">{User.name}</span>
          </a>

          {/* Centered Nav Links */}
          <div className="hidden md:flex flex-1 justify-center">
            <ul className="flex space-x-8 text-white font-medium">
              <li><a href="#" className="hover:text-blue-400">Home</a></li>
              <li><a href="#" className="hover:text-blue-400">About</a></li>
              <li><a href="#" className="hover:text-blue-400">Services</a></li>
              <li><a href="#" className="hover:text-blue-400">Pricing</a></li>
              <li><a href="#" className="hover:text-blue-400">Contact</a></li>
            </ul>
          </div>

          {/* Profile on the right */}
          <div className="relative ml-auto group">
            <button
              type="button"
              className="flex text-sm rounded-full focus:ring-2 focus:ring-gray-300"
            >
              <span className="sr-only">Open user menu</span>
              <img className="w-8 h-8 rounded-full" src={profile} alt="user profile" />
            </button>

            {/* Dropdown on hover */}
            <div className="absolute top-full right-0 z-50 hidden group-hover:block w-48 bg-gray-100 text-indigo-950 rounded-lg shadow-md">
              <div className="px-4 py-3">
                <span className="block text-sm">{User.name}</span>
                <span className="block text-sm text-gray-600 truncate">{User.email}</span>
              </div>
              <ul className="py-2">
                <li><button className="block px-4 py-2 hover:bg-gray-600">Dashboard</button></li>
                <li><button className="block px-4 py-2 hover:bg-gray-600">Settings</button></li>
                <li><button className="block px-4 py-2 hover:bg-gray-600">Earnings</button></li>
                <li><button className="block px-4 py-2 hover:bg-gray-600">Sign out</button></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
