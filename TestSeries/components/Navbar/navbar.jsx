import React from 'react';
import { ArrowRight } from 'lucide-react';

const Navbar = () => {
  return (
    <div className="top-0 fixed w-full z-50 bg-blue-950 text-white px-6 py-6 ">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold">
          MyApp
        </div>

        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-8 font-medium">
          <li><a href="/" className="hover:text-blue-200">Home</a></li>
          <li><a href="/about" className="hover:text-blue-200">About</a></li>
          <li><a href="/contact" className="hover:text-blue-200">Contact</a></li>
        </ul>

        {/* CTA Button */}

        <button className="group bg-blue-700 space-x-1.5 flex text-white font-semibold px-8 py-2 rounded-lg border-2 border-indigo-500">
          <span>Sign in</span>
          <ArrowRight className='group-hover:pl-2 group-hover:h-6 group-hover:w-6 h-6 w-6'/>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
