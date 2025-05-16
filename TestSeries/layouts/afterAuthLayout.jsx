import React from 'react';
import Navbar from '../components/Navbar/navbar';  
import Footer from '../components/Footer/footer';  
import { Outlet } from 'react-router-dom';  

const AfterAuthLayout = ({ children }) => {
  return (
    <div className="relative">
      {/* <Navbar />  */}
      <main className="px-10">
        {children || <Outlet />}
      </main>
     
      {/* <Footer /> */}
    </div>
  );
};

export default AfterAuthLayout;
