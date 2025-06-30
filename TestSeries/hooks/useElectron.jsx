import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useElectronProtocolHandler = () => {
  const [protocolParams, setProtocolParams] = useState(null);
  const [isElectronApp, setIsElectronApp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we're running in Electron
    const isElectron = !!(window.electronAPI);
    setIsElectronApp(isElectron);

    if (!isElectron) {
      console.log('📱 Not running in Electron - protocol handling disabled');
      return;
    }

    console.log('🔌 Setting up Electron protocol handler');

    // Function to handle protocol parameters
    const handleProtocolParams = (params) => {
      console.log('📨 Received protocol parameters:', params);
      setProtocolParams(params);

      if (params && params.userId && params.examId) {
        // Navigate to the exam page
        const examUrl = `/student/test?userId=${params.userId}&examId=${params.examId}&eventId=${params.eventId || 'default'}`;
        console.log('🎯 Navigating to exam:', examUrl);
        navigate(examUrl);
      }
    };

    // Listen for protocol URL events (when app is already running)
    window.electronAPI.onProtocolUrl(handleProtocolParams);

    // Check for initial protocol parameters (when app is launched with URL)
    window.electronAPI.getProtocolParams().then((params) => {
      if (params) {
        console.log('🚀 App launched with protocol parameters:', params);
        handleProtocolParams(params);
      }
    }).catch(error => {
      console.error('❌ Error getting initial protocol params:', error);
    });

    // Cleanup
    return () => {
      if (window.electronAPI && window.electronAPI.removeProtocolUrlListener) {
        window.electronAPI.removeProtocolUrlListener();
      }
    };
  }, [navigate]);

  return {
    protocolParams,
    isElectronApp,
    clearProtocolParams: () => setProtocolParams(null)
  };
};

// Component to be used in your main App component
export const ElectronProtocolHandler = () => {
  const { protocolParams, isElectronApp } = useElectronProtocolHandler();

  // This component doesn't render anything, it just handles the protocol
  useEffect(() => {
    if (isElectronApp) {
      console.log('🔧 Electron protocol handler active');
    }
  }, [isElectronApp]);

  // Optional: Show debug info in development
  if (process.env.NODE_ENV === 'development' && isElectronApp && protocolParams) {
    return (
      <div style={{
        position: 'fixed',
        top: 10,
        left: 10,
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 10000
      }}>
        <div>🔗 Protocol URL received:</div>
        <div>User ID: {protocolParams.userId}</div>
        <div>Exam ID: {protocolParams.examId}</div>
        <div>Event ID: {protocolParams.eventId}</div>
        <div>Action: {protocolParams.action}</div>
      </div>
    );
  }

  return null;
};