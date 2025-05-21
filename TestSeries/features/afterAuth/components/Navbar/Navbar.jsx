import React from 'react';
import profile from '../../../../assests/Institute/profile.png';

const Navbar = () => {
  return (
    <nav className="fixed w-full z-40 bg-indigo-950 border-b border-gray-200">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">

        {/* Logo on the left */}
        <a href="/" className="flex items-center space-x-3">
          <img src={profile} className="h-8" alt="Logo" />
          <span className="text-2xl font-semibold text-white">Institute's Name</span>
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
              <span className="block text-sm">Bonnie Green</span>
              <span className="block text-sm text-gray-600 truncate">name@flowbite.com</span>
            </div>
            <ul className="py-2">
              <li><a href="#" className="block px-4 py-2 hover:bg-gray-600">Dashboard</a></li>
              <li><a href="#" className="block px-4 py-2 hover:bg-gray-600">Settings</a></li>
              <li><a href="#" className="block px-4 py-2 hover:bg-gray-600">Earnings</a></li>
              <li><a href="#" className="block px-4 py-2 hover:bg-gray-600">Sign out</a></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
