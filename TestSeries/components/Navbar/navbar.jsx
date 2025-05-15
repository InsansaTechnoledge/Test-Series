import React, { useState } from 'react';
import { ArrowRight, User, GraduationCap, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="top-0 fixed w-full z-50 bg-blue-950 text-white px-6 py-4 shadow-lg">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
         
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-200 to-violet-200 bg-clip-text text-transparent">
            myApp
          </div>
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-8 font-medium">
          <li><a href="/features" className="hover:text-blue-200 transition-colors duration-200">Features</a></li>
          <li><a href="/pricing" className="hover:text-blue-200 transition-colors duration-200">Pricing</a></li>
          <li><a href="/contact" className="hover:text-blue-200 transition-colors duration-200">Contact</a></li>
        </ul>

        {/* Login Options */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button 
              className="flex items-center space-x-2 bg-blue-800 bg-opacity-50 hover:bg-opacity-70 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span>Login</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}/>
            </button>
            
            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50">
                <a 
                  href="/educator-login" 
                  className="flex items-center space-x-2 px-4 py-3 text-gray-800 hover:bg-blue-50 transition-colors duration-200"
                >
                  <User className="h-5 w-5 text-blue-700" />
                  <span>Educator Login</span>
                </a>
                <div className="border-b border-gray-200"></div>
                <a 
                  href="/student-login" 
                  className="flex items-center space-x-2 px-4 py-3 text-gray-800 hover:bg-blue-50 transition-colors duration-200"
                >
                  <GraduationCap className="h-5 w-5 text-violet-700" />
                  <span>Student Login</span>
                </a>
              </div>
            )}
          </div>

          <button className="group bg-blue-600 flex items-center space-x-2 text-white font-semibold px-6 py-2 rounded-lg border border-blue-400 shadow-md transition-all duration-300">
            <span>Sign Up</span>
            <ArrowRight className="group-hover:translate-x-1 transition-transform duration-200 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;