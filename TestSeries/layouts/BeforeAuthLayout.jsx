import React from 'react';
import Navbar from '../components/Navbar/navbar';  
// import Footer from '../components/Footer';  
import { Outlet } from 'react-router-dom';  

const BeforeAuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="w-full overflow-x-hidden">
        {children || <Outlet />} {/* supports both routing and direct nesting */}
      </main>
     
      {/* <Footer /> */}
    </div>
  );
};

export default BeforeAuthLayout;
