import React from 'react';
import Navbar from '../components/Navbar/navbar';  
import Footer from '../components/Footer/footer';  
import { Outlet } from 'react-router-dom';  
import ScrollTop from '../components/ScrollToTop/ScrollTop';

const AuthLayout = ({ children }) => {
  return (
    <div className="relative">
      {/* <Navbar /> */}
      <ScrollTop/>
      <main className="">
        {children || <Outlet />}
      </main>
     
      <Footer />
    </div>
  );
};

export default AuthLayout;
