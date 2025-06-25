import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Assuming you're using React Router
import logo from "../../assests/Landing/Navbar/evalvo logo blue 2.svg"
import { ArrowRight } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center px-6 md:px-22 py-6  bg-transparent backdrop-blur-xl sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">


        <img src={logo} width={150}></img>

        </Link>
      </div>

     
      <div className="hidden md:flex space-x-8 text-gray-700">
        <button onClick={() => navigate('/')} className="px-4 py-2 rounded-md hover:bg-indigo-100 hover:text-blue-600 transition duration-200">Home</button> 
        <button onClick={() => navigate('/about')} className="px-4 py-2 rounded-md cursor-pointer hover:bg-indigo-100 hover:text-blue-600 transition duration-200">About</button>        
        <button  onClick={() => navigate('/contact')} className="px-4 py-2 cursor-pointer rounded-md hover:bg-indigo-100 hover:text-blue-600 transition duration-200">Contact</button>        
        
      </div>

      {/* Authentication Section */}
      <div className="hidden  md:flex items-center">
        <div className="flex items-center border-r border-gray-200 pr-5 mr-5">
          <Link to="/login?role=Student" className="text-gray-600 bg-gray-100 hover:bg-gray-200 py-4 px-5 rounded-full hover:text-gray-700 font-medium">
            Student Login
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link to="/login?role=Institute" className="text-gray-600 bg-gray-100 hover:bg-gray-200 py-4 px-5 rounded-full hover:text-gray-700 font-medium">
            Institute Login
          </Link>
          <Link
              to="/institute-registration"
              className="group bg-indigo-600 text-white px-5 py-4 rounded-full hover:bg-indigo-700 transition inline-flex items-center gap-2"
          >
              Register Institute
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
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
            <button onClick={() => navigate('/')} className="px-4 py-2 rounded-md hover:bg-indigo-100 hover:text-blue-600 transition duration-200">Home</button> 
            <button disabled onClick={() => navigate('/about')} className="px-4 py-2 rounded-md  hover:bg-indigo-100 hover:text-blue-600 transition duration-200">About</button>        
            <button disabled onClick={() => navigate('/contact')} className="px-4 py-2 rounded-md hover:bg-indigo-100 hover:text-blue-600 transition duration-200">Contact</button>   
            
            <div className="border-t border-gray-200 my-2 pt-2">
              <div className="flex justify-between items-center">
                <Link to="/login?role=Student" className="flex-1 text-center py-2 text-indigo-600 hover:text-indigo-700 font-medium border-r border-gray-200">
                  Student Login
                </Link>
                <Link to="/login?role=Institute" className="flex-1 text-center py-2 text-indigo-600 hover:text-indigo-700 font-medium">
                  Institute Login
                </Link>
              </div>
              <Link to="/institute-registration" className="block mt-3 bg-indigo-600 text-white py-2  text-center">
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