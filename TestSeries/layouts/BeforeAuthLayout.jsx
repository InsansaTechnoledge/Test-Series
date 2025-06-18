import React from 'react';
import Navbar from '../components/Navbar/navbar';  
import Footer from '../components/Footer/footer';  
import { Outlet } from 'react-router-dom';  

const BeforeAuthLayout = ({ children }) => {
  return (
    
    <div className="relative bg-[#fcfcfd]">
     
      <Navbar />
      <main className="">
        {children || <Outlet />} {/* supports both routing and direct nesting */}
      </main>
     
      <Footer />
    </div>
  );
};

export default BeforeAuthLayout;

