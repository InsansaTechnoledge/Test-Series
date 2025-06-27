import { useState, useEffect, useCallback } from 'react';

export const useElectron = () => {
  const [isElectron, setIsElectron] = useState(false);
  const [proctorEvents, setProctoringEvents] = useState([]);
  const [systemInfo, setSystemInfo] = useState(null);
  const [examInProgress, setExamInProgress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if running in Electron environment
  useEffect(() => {
    const checkElectron = () => {
      const isElectronEnv = !!(window.electronAPI && window.examSecurity);
      setIsElectron(isElectronEnv);
      
      if (isElectronEnv) {
        console.log('Running in Electron environment');
        loadSystemInfo();
        loadProctoringEvents();
        checkExamStatus();
      } else {
        console.log('Running in web browser');
      }
    };

    checkElectron();
  }, []);

  // Load system information
  const loadSystemInfo = async () => {
    if (!window.electronAPI) return;
    
    try {
      const info = await window.electronAPI.getSystemInfo();
      setSystemInfo(info);
    } catch (error) {
      console.error('Failed to load system info:', error);
    }
  };

  // Load proctoring events
  const loadProctoringEvents = async () => {
    if (!window.electronAPI) return;
    
    try {
      const events = await window.electronAPI.getProctoringEvents();
      setProctoringEvents(events || []);
    } catch (error) {
      console.error('Failed to load proctoring events:', error);
    }
  };

  // Check exam status
  const checkExamStatus = async () => {
    if (!window.electronAPI) return;
    
    try {
      const inProgress = await window.electronAPI.isExamInProgress();
      setExamInProgress(inProgress);
    } catch (error) {
      console.error('Failed to check exam status:', error);
    }
  };

  // Set up proctoring event listener
  useEffect(() => {
    if (!window.electronAPI) return;

    const handleProctoringEvent = (eventData) => {
      console.log('Proctoring event received:', eventData);
      setProctoringEvents(prev => [...prev, eventData]);
      
      // Show notification for violations
      if (eventData.type === 'violation') {
        showNotification('Exam Violation Detected', eventData.message);
      }
    };

    // Add event listener
    window.electronAPI.onProctoringEvent(handleProctoringEvent);

    // Cleanup on unmount
    return () => {
      if (window.electronAPI.removeProctoringListener) {
        window.electronAPI.removeProctoringListener();
      }
    };
  }, [isElectron]);

  // Start exam function
  const startExam = useCallback(async (examData) => {
    if (!window.electronAPI) {
      throw new Error('Electron API not available');
    }

    setIsLoading(true);
    
    try {
      console.log('Starting exam with data:', examData);
      
      const result = await window.electronAPI.startExam(examData);
      
      if (result.success) {
        setExamInProgress(true);
        
        // Enable security mode
        if (window.examSecurity) {
          window.examSecurity.enableSecurityMode();
        }
        
        // Request media permissions for proctoring
        if (window.screenSecurity) {
          await window.screenSecurity.requestMediaPermissions();
        }
        
        showNotification('Exam Started', 'AI Proctoring is now active');
        
        return result;
      } else {
        throw new Error(result.message || 'Failed to start exam');
      }
    } catch (error) {
      console.error('Error starting exam:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // End exam function
  const endExam = useCallback(async () => {
    if (!window.electronAPI) {
      throw new Error('Electron API not available');
    }

    setIsLoading(true);
    
    try {
      const result = await window.electronAPI.endExam();
      
      if (result.success) {
        setExamInProgress(false);
        setProctoringEvents([]);
        
        // Disable security mode
        if (window.examSecurity) {
          window.examSecurity.disableSecurityMode();
        }
        
        // Stop media streams
        if (window.screenSecurity) {
          window.screenSecurity.stopMediaStreams();
        }
        
        showNotification('Exam Ended', 'Thank you for taking the exam');
        
        return result;
      } else {
        throw new Error(result.message || 'Failed to end exam');
      }
    } catch (error) {
      console.error('Error ending exam:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Report violation
  const reportViolation = useCallback(async (violation) => {
    if (!window.electronAPI) return;
    
    try {
      await window.electronAPI.reportExamViolation(violation);
    } catch (error) {
      console.error('Error reporting violation:', error);
    }
  }, []);

  // Show notification
  const showNotification = useCallback((title, message) => {
    if (window.electronAPI) {
      window.electronAPI.showNotification(title, message);
    } else {
      // Fallback for web browser
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body: message });
      }
    }
  }, []);

  // Open external link
  const openExternalLink = useCallback((url) => {
    if (window.electronAPI) {
      window.electronAPI.openExternalLink(url);
    } else {
      // Fallback for web browser
      window.open(url, '_blank');
    }
  }, []);

  // Get latest proctoring events
  const refreshProctoringEvents = useCallback(async () => {
    if (!window.electronAPI) return;
    
    try {
      const events = await window.electronAPI.getProctoringEvents();
      setProctoringEvents(events || []);
    } catch (error) {
      console.error('Error refreshing proctoring events:', error);
    }
  }, []);

  // Window controls (for custom title bar if needed)
  const minimizeWindow = useCallback(() => {
    if (window.electronAPI) {
      window.electronAPI.minimizeWindow();
    }
  }, []);

  const maximizeWindow = useCallback(() => {
    if (window.electronAPI) {
      window.electronAPI.maximizeWindow();
    }
  }, []);

  const closeWindow = useCallback(() => {
    if (window.electronAPI) {
      window.electronAPI.closeWindow();
    }
  }, []);

  // Get app version
  const getAppVersion = useCallback(async () => {
    if (!window.electronAPI) return null;
    
    try {
      return await window.electronAPI.getAppVersion();
    } catch (error) {
      console.error('Error getting app version:', error);
      return null;
    }
  }, []);

  // Get platform information
  const getPlatform = useCallback(() => {
    if (window.electronAPI) {
      return window.electronAPI.getPlatform();
    }
    return 'web';
  }, []);

  return {
    // State
    isElectron,
    proctorEvents,
    systemInfo,
    examInProgress,
    isLoading,
    
    // Exam functions
    startExam,
    endExam,
    
    // Utility functions
    reportViolation,
    showNotification,
    openExternalLink,
    refreshProctoringEvents,
    
    // Window controls
    minimizeWindow,
    maximizeWindow,
    closeWindow,
    
    // System info
    getAppVersion,
    getPlatform,
    
    // Data refresh
    loadSystemInfo,
    loadProctoringEvents,
    checkExamStatus
  };
};