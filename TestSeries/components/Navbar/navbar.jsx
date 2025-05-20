import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center px-6 md:px-12 py-3 shadow-sm bg-white sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">MyLogo</Link>
      </div>

     
      <div className="hidden md:flex space-x-8 text-gray-700">
        <Link to="/" className="hover:text-blue-600 transition">Home</Link>
        <Link to="/about" className="hover:text-blue-600 transition">About</Link>
        <Link to="/services" className="hover:text-blue-600 transition">Services</Link>
        <Link to="/contact" className="hover:text-blue-600 transition">Contact</Link>
      </div>

      {/* Authentication Section */}
      <div className="hidden md:flex items-center">
        <div className="flex items-center border-r border-gray-200 pr-5 mr-5">
          <Link to="/login?role=Student" className="text-blue-700 hover:text-blue-800 font-medium">
            Student Login
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link to="/login?role=Institute" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Institute Login
          </Link>
          <Link to="/institute-registration" className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition">
            Register Institute
          </Link>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden bg-gray-100 p-2 rounded-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-14 left-0 right-0 bg-white shadow-md z-50">
          <div className="flex flex-col p-4">
            <Link to="/" className="py-2 text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/about" className="py-2 text-gray-700 hover:text-blue-600">About</Link>
            <Link to="/services" className="py-2 text-gray-700 hover:text-blue-600">Services</Link>
            <Link to="/contact" className="py-2 text-gray-700 hover:text-blue-600">Contact</Link>
            
            <div className="border-t border-gray-200 my-2 pt-2">
              <div className="flex justify-between items-center">
                <Link to="/login?role=Student" className="flex-1 text-center py-2 text-blue-600 font-medium border-r border-gray-200">
                  Student Login
                </Link>
                <Link to="/login?role=Institute" className="flex-1 text-center py-2 text-indigo-600 font-medium">
                  Institute Login
                </Link>
              </div>
              <Link to="/institute-registration" className="block mt-3 bg-indigo-600 text-white py-2 rounded-md text-center">
                Register Institute
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );

}
export default Navbar;