import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar/navbar';
import Footer from '../components/Footer/footer';
import { Outlet } from 'react-router-dom';

const BeforeAuthLayout = ({ children }) => {

  const [isElectronEnv, setIsElectronEnv] = useState(false);
  const [permission, setPermission] = useState('pending');

  useEffect(() => {
    let isMounted = true;
    const checkElectronEnv = () => {

      const isElectron = window.electronAPI !== undefined;
      if (isMounted) setIsElectronEnv(isElectron);
    };



    const check = async () => {
      if (window?.electronAPI) {
        const result = await window.electronAPI.checkCameraPermission();
        if (isMounted) {
          setPermission(result.granted ? 'granted' : 'denied');
        }
        console.log('🔍 Camera permission status:', result.granted ? 'Granted' : 'Denied');
      }
    };
    checkElectronEnv();
    check();
    return () => {
      isMounted = false; // Cleanup to avoid memory leaks
    };
  }, []);

  return (

    <div className="relative bg-[#fcfcfd]">

      {
        !isElectronEnv &&
        <Navbar />
      }

      {
        isElectronEnv && permission === 'pending' && (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Loading...</h1>
              <p>Please wait while we check your camera permissions.</p>
            </div>
          </div>
        )
      }

      {
        isElectronEnv && permission === 'denied' && (
          <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-white text-black z-50">
            <h2 className="text-2xl mb-4">Camera permission is required to continue</h2>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mb-2"
              onClick={() => window.electronAPI.openCameraSettings()}
            >
              Open Camera Settings
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => window.electronAPI.closeWindow()}
            >
              Exit App
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded mt-2"
              onClick={async () => {
                const result = await window.electronAPI.checkCameraPermission();
                setPermission(result.granted ? 'granted' : 'denied');
              }}
            >
              Retry Permission Check
            </button>

          </div>
        )
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

