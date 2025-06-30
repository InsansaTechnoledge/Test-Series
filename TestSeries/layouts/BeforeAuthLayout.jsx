import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar/navbar';  
import Footer from '../components/Footer/footer';  
import { Outlet } from 'react-router-dom';  

const BeforeAuthLayout = ({ children }) => {

  const [isElectronEnv , setIsElectronEnv] = useState(false);

   useEffect(() => {
      const checkElectronEnv = () => {
      
        const isElectron = window.electronAPI !== undefined;
        setIsElectronEnv(isElectron);
      };
      
      checkElectronEnv();
    },[])
   
  return (
    
    <div className="relative bg-[#fcfcfd]">
     
     {
        !isElectronEnv && 
          <Navbar />
     }
      <main className="">
        {children || <Outlet />} 
      </main>
     
     {
      !isElectronEnv && 
        <Footer />
     }
    </div>
  );
};

export default BeforeAuthLayout;

