import { useEffect, useRef, useCallback, useState } from 'react';
import ExamToaster from '../Toaster/StandardExamWarningToaster';

export const useExamSecurity = ({
  eventDetails,
  submitted,
  setExamViolations,
  setWarningCount,
  warningCount,
  userId,
  examId,
  handleSubmitTest,
  examContainerRef
}) => {
  // Toaster state
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(0);

  // Refs to prevent stale closure issues and manage state
  const warningCountRef = useRef(warningCount);
  const violationCountRef = useRef(0);
  const issuedWarningsRef = useRef(0);
  const isSubmittingRef = useRef(false);
  const lastViolationRef = useRef(null);
  const devToolsCheckRef = useRef(null);
  const isInitializedRef = useRef(false);
  const fullscreenAttemptRef = useRef(0);
  const windowCheckIntervalRef = useRef(null); // New ref for window monitoring
  const maxFullscreenAttempts = 3;
  
  // Lenient settings
  const violationCooldown = 20000000; // 2000
  const violationsPerWarning = 3;
  const maxWarnings = 5;
  const lastViolationTimeRef = useRef(0);

  // Update warning count ref whenever it changes
  useEffect(() => {
    warningCountRef.current = warningCount;
  }, [warningCount]);

  // Update submitting ref when submitted changes
  useEffect(() => {
    if (submitted) {
      isSubmittingRef.current = true;
    }
  }, [submitted]);

  // Toaster functions
  const addToast = useCallback((message, type = 'info', details = '', duration = 5000) => {
    const id = ++toastIdRef.current;
    const toast = {
      id,
      message,
      type,
      details,
      timestamp: Date.now()
    };

    setToasts(prev => [...prev, toast]);

    if (type !== 'error' && duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Enhanced violation logger
  const logViolation = useCallback((type, details = '') => {
    if (isSubmittingRef.current || submitted) return;

    const now = Date.now();
    const timeSinceLastViolation = now - lastViolationTimeRef.current;
    
    if (timeSinceLastViolation < violationCooldown) {
      console.log(`Violation ignored - in cooldown period (${Math.ceil((violationCooldown - timeSinceLastViolation) / 1000)}s remaining)`);
      return;
    }

    const violation = {
      type,
      details,
      timestamp: now,
      userId,
      examId,
    };

    lastViolationTimeRef.current = now;
    violationCountRef.current++;
    
    try {
      setExamViolations(prev => [...prev, violation]);
      console.warn(`Security Violation #${violationCountRef.current}:`, violation);
      
      addToast(
        `Security violation detected: ${type}`,
        'info',
        `${details} (Violation #${violationCountRef.current})`,
        4000
      );
      
      const warningsNeeded = Math.floor(violationCountRef.current / violationsPerWarning);
      if (warningsNeeded > issuedWarningsRef.current) {
        issuedWarningsRef.current = warningsNeeded;
        setTimeout(() => {
          showWarning(`Multiple security violations detected (${violationCountRef.current} total).`, warningsNeeded);
        }, 0);
      }
      
    } catch (error) {
      console.error('Error logging violation:', error);
      addToast('Error logging security violation', 'error', error.message, 3000);
    }
  }, [setExamViolations, userId, examId, submitted, addToast]);

  // Enhanced warning system
  const showWarning = useCallback((message, warningNumber) => {
    if (isSubmittingRef.current || submitted) return;
  
    try {
      if (warningCountRef.current !== warningNumber) {
        warningCountRef.current = warningNumber;
        setWarningCount(prev => {
          if (prev === warningNumber) return prev;
          return warningNumber;
        });
      }
  
      const warningMessage = `Security Alert: ${message}\n\nWarning ${warningNumber}/${maxWarnings} - Please follow exam guidelines to avoid automatic submission.`;
  
      addToast(
        warningMessage,
        'warning',
        `This is warning ${warningNumber} of ${maxWarnings}`,
        8000
      );
  
      if (warningNumber >= maxWarnings && !isSubmittingRef.current) {
        isSubmittingRef.current = true;
  
        const submitMessage = `EXAM TERMINATED\n\nMaximum security warnings (${maxWarnings}) reached. Your exam will be auto-submitted now.`;
  
        addToast(
          submitMessage,
          'error',
          'Auto-submitting in 2 seconds...',
          0
        );
  
        setTimeout(() => {
          if (handleSubmitTest && typeof handleSubmitTest === 'function') {
            handleSubmitTest();
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Error showing warning:', error);
      addToast('Error showing security warning', 'error', error.message, 3000);
    }
  }, [handleSubmitTest, submitted, addToast]);

  // NEW: Window maximization function
  const maximizeWindow = useCallback(() => {
    if (isSubmittingRef.current || submitted) return;

    try {
      // Focus the window first
      window.focus();
      
      // Try to maximize using different methods
      if (window.screen && window.screen.availWidth && window.screen.availHeight) {
        // Method 1: Resize to screen dimensions
        window.resizeTo(window.screen.availWidth, window.screen.availHeight);
        window.moveTo(0, 0);
      }
      
      // Method 2: Try to trigger fullscreen if available
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        enterFullscreen();
      }
      
      console.log('Window maximized/focused');
      
    } catch (error) {
      console.warn('Could not maximize window:', error);
      // Fallback: at least try to focus
      try {
        window.focus();
      } catch (focusError) {
        console.warn('Could not focus window:', focusError);
      }
    }
  }, [submitted]);

  // NEW: Window state monitoring
  const checkWindowState = useCallback(() => {
    if (isSubmittingRef.current || submitted) return;

    try {
      // Check if window is minimized or not focused
      const isMinimized = document.hidden || 
                         document.visibilityState === 'hidden' ||
                         !document.hasFocus();
      
      // Check window dimensions (might indicate minimized state)
      const isSmallWindow = window.innerWidth < 800 || window.innerHeight < 600;
      
      if (isMinimized || isSmallWindow) {
        console.log('Window appears minimized or small, attempting to maximize...');
        maximizeWindow();
        
        // Log violation for minimization
        if (isMinimized) {
          logViolation('Window Minimized', 'Window was minimized or lost focus');
        }
      }
      
    } catch (error) {
      console.warn('Error checking window state:', error);
    }
  }, [submitted, maximizeWindow, logViolation]);

  // Enhanced window focus/blur handlers
  const handleWindowBlur = useCallback(() => {
    if (isSubmittingRef.current || submitted) return;
    
    logViolation('Window Focus Lost', 'User switched away from exam');
    
    // Attempt to regain focus after a short delay
    setTimeout(() => {
      if (!isSubmittingRef.current && !submitted) {
        maximizeWindow();
      }
    }, 1000);
  }, [submitted, logViolation, maximizeWindow]);

  const handleWindowFocus = useCallback(() => {
    if (isSubmittingRef.current || submitted) return;
    
    // Ensure window is maximized when it gains focus
    setTimeout(() => {
      if (!isSubmittingRef.current && !submitted) {
        maximizeWindow();
      }
    }, 100);
  }, [submitted, maximizeWindow]);

  // Enhanced visibility change handler
  const handleVisibilityChange = useCallback(() => {
    if (isSubmittingRef.current || submitted) return;
    
    if (document.hidden) {
      logViolation('Tab Hidden', 'Tab became hidden or minimized');
    } else {
      // When tab becomes visible again, maximize the window
      setTimeout(() => {
        if (!isSubmittingRef.current && !submitted) {
          maximizeWindow();
        }
      }, 100);
    }
  }, [submitted, logViolation, maximizeWindow]);

  // Key handler (unchanged)
  const handleKeyDown = useCallback((e) => {
    if (isSubmittingRef.current || submitted) return;

    const violations = [
      { condition: e.key === 'F12', label: 'F12 (Dev Tools)' },
      { condition: e.ctrlKey && e.shiftKey && e.key === 'I', label: 'Ctrl+Shift+I (Dev Tools)' },
      { condition: e.ctrlKey && e.shiftKey && e.key === 'J', label: 'Ctrl+Shift+J (Console)' },
      { condition: e.ctrlKey && e.shiftKey && e.key === 'C', label: 'Ctrl+Shift+C (Inspector)' },
      { condition: e.ctrlKey && e.shiftKey && e.key === 'K', label: 'Ctrl+Shift+K (Console)' },
      { condition: e.ctrlKey && e.key === 'u', label: 'Ctrl+U (View Source)' },
      { condition: e.ctrlKey && e.key === 's', label: 'Ctrl+S (Save Page)' },
      { condition: e.ctrlKey && e.key === 'p', label: 'Ctrl+P (Print)' },
      { condition: e.altKey && e.key === 'Tab', label: 'Alt+Tab (Switch Window)' },
      { condition: e.ctrlKey && e.key === 'Tab', label: 'Ctrl+Tab (Switch Tab)' },
      { condition: e.ctrlKey && e.shiftKey && e.key === 'Tab', label: 'Ctrl+Shift+Tab (Switch Tab)' },
      { condition: e.key === 'Meta' || e.key === 'Cmd', label: 'Windows/Cmd Key' },
      { condition: e.ctrlKey && e.key === 'n', label: 'Ctrl+N (New Window)' },
      { condition: e.ctrlKey && e.key === 't', label: 'Ctrl+T (New Tab)' },
      { condition: e.ctrlKey && e.key === 'w', label: 'Ctrl+W (Close Tab)' },
      { condition: e.ctrlKey && e.key === 'r', label: 'Ctrl+R (Refresh)' },
      { condition: e.ctrlKey && e.key === 'l', label: 'Ctrl+L (Address Bar)' },
      { condition: e.key === 'F5', label: 'F5 (Refresh)' },
      { condition: e.key === 'F1', label: 'F1 (Help)' },
      { condition: e.key === 'F6', label: 'F6 (Address Bar)' },
      { condition: e.key === 'F11', label: 'F11 (Fullscreen Toggle)' },
    ];

    const violation = violations.find(v => v.condition);
    if (violation) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      logViolation('Restricted Key Pressed', violation.label);
    }
  }, [submitted, logViolation]);

  // Dev tools detection (unchanged)
  const checkDevTools = useCallback(() => {
    if (isSubmittingRef.current || submitted) return;

    try {
      const threshold = 200;
      const heightDiff = window.outerHeight - window.innerHeight;
      const widthDiff = window.outerWidth - window.innerWidth;
      
      if (heightDiff > threshold || widthDiff > threshold) {
        logViolation('Developer Tools Detected', `Height: ${heightDiff}, Width: ${widthDiff}`);
      }

      let devtools = { open: false };
      const element = new Image();
      element.__defineGetter__('id', function() {
        devtools.open = true;
      });
      
      console.log('%c', element);
      
      if (devtools.open) {
        logViolation('Console Access Detected', 'Console opened');
      }
    } catch (error) {
      // Silently handle errors
    }
  }, [submitted, logViolation]);

  // Fullscreen management (unchanged)
  const enterFullscreen = useCallback(() => {
    if (!examContainerRef?.current || isSubmittingRef.current || submitted) return;
    
    if (fullscreenAttemptRef.current >= maxFullscreenAttempts) {
      logViolation('Fullscreen Enforcement Failed', 'Maximum attempts exceeded');
      return;
    }

    try {
      const el = examContainerRef.current;
      const requestFullscreen = el.requestFullscreen || 
                               el.webkitRequestFullscreen || 
                               el.mozRequestFullScreen ||
                               el.msRequestFullscreen;
      
      if (requestFullscreen) {
        fullscreenAttemptRef.current++;
        requestFullscreen.call(el).catch(err => {
          console.warn('Fullscreen request failed:', err);
          logViolation('Fullscreen Request Failed', err.message);
        });
      } else {
        logViolation('Fullscreen Not Supported', 'Browser does not support fullscreen');
      }
    } catch (error) {
      console.error('Error entering fullscreen:', error);
      logViolation('Fullscreen Error', error.message);
    }
  }, [examContainerRef, submitted, logViolation]);

  const handleFullscreenChange = useCallback(() => {
    if (isSubmittingRef.current || submitted) return;

    const isFullscreen = !!(document.fullscreenElement || 
                           document.webkitFullscreenElement || 
                           document.mozFullScreenElement || 
                           document.msFullscreenElement);

    if (!isFullscreen && fullscreenAttemptRef.current < maxFullscreenAttempts) {
      logViolation('Fullscreen Exited', 'User exited fullscreen mode');
      
      setTimeout(() => {
        if (!isSubmittingRef.current && !submitted) {
          enterFullscreen();
        }
      }, 3000);
    }
  }, [submitted, logViolation, enterFullscreen]);

  // Other handlers (unchanged)
  const handleContextMenu = useCallback((e) => {
    if (isSubmittingRef.current || submitted) return;
    e.preventDefault();
    logViolation('Right Click Attempted', 'Context menu blocked');
  }, [submitted, logViolation]);

  const handleDragStart = useCallback((e) => {
    if (isSubmittingRef.current || submitted) return;
    if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
      e.preventDefault();
      logViolation('Drag Operation Attempted', 'Media drag blocked');
    }
  }, [submitted, logViolation]);

  const handleDrop = useCallback((e) => {
    if (isSubmittingRef.current || submitted) return;
    e.preventDefault();
    logViolation('Drop Operation Attempted', 'Drop blocked');
  }, [submitted, logViolation]);

  const handlePopState = useCallback((e) => {
    if (isSubmittingRef.current || submitted) return;
    
    logViolation('Navigation Attempted', 'Back button pressed');
    
    try {
      window.history.pushState(null, null, window.location.pathname);
    } catch (error) {
      console.error('Error preventing navigation:', error);
    }
  }, [submitted, logViolation]);

  const handleBeforeUnload = useCallback((e) => {
    if (isSubmittingRef.current || submitted) return;
    
    logViolation('Page Unload Attempted', 'User tried to leave page');
    const message = 'Are you sure you want to leave? Your exam progress will be lost.';
    e.preventDefault();
    e.returnValue = message;
    return message;
  }, [submitted, logViolation]);

  // Main effect with enhanced window monitoring
  useEffect(() => {
    if (!eventDetails || submitted || isInitializedRef.current) return;

    console.log('🔒 Initializing exam security measures with window maximization...');
    isInitializedRef.current = true;

    addToast(
      'Exam security measures activated',
      'info',
      'Security monitoring is now active. Window will be kept maximized.',
      4000
    );

    try {
      window.history.pushState(null, null, window.location.pathname);
    } catch (error) {
      console.error('Error initializing history:', error);
    }

    const eventOptions = { passive: false, capture: true };
    const passiveOptions = { passive: true };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown, eventOptions);
    document.addEventListener('contextmenu', handleContextMenu, eventOptions);
    document.addEventListener('visibilitychange', handleVisibilityChange, passiveOptions);
    document.addEventListener('fullscreenchange', handleFullscreenChange, passiveOptions);
    document.addEventListener('dragstart', handleDragStart, eventOptions);
    document.addEventListener('drop', handleDrop, eventOptions);
    window.addEventListener('blur', handleWindowBlur, passiveOptions);
    window.addEventListener('focus', handleWindowFocus, passiveOptions); // NEW
    window.addEventListener('popstate', handlePopState, eventOptions);
    window.addEventListener('beforeunload', handleBeforeUnload, eventOptions);

    // Start monitoring intervals
    devToolsCheckRef.current = setInterval(checkDevTools, 5000);
    windowCheckIntervalRef.current = setInterval(checkWindowState, 2000); // NEW: Check window state every 2 seconds

    // Initial setup
    const setupTimeout = setTimeout(() => {
      if (!isSubmittingRef.current && !submitted) {
        maximizeWindow();
        enterFullscreen();
      }
    }, 1000);

    // Cleanup function
    return () => {
      console.log('🔓 Cleaning up exam security measures...');
      
      // Remove event listeners
      document.removeEventListener('keydown', handleKeyDown, eventOptions);
      document.removeEventListener('contextmenu', handleContextMenu, eventOptions);
      document.removeEventListener('visibilitychange', handleVisibilityChange, passiveOptions);
      document.removeEventListener('fullscreenchange', handleFullscreenChange, passiveOptions);
      document.removeEventListener('dragstart', handleDragStart, eventOptions);
      document.removeEventListener('drop', handleDrop, eventOptions);
      window.removeEventListener('blur', handleWindowBlur, passiveOptions);
      window.removeEventListener('focus', handleWindowFocus, passiveOptions);
      window.removeEventListener('popstate', handlePopState, eventOptions);
      window.removeEventListener('beforeunload', handleBeforeUnload, eventOptions);

      // Clear intervals
      if (devToolsCheckRef.current) {
        clearInterval(devToolsCheckRef.current);
        devToolsCheckRef.current = null;
      }
      
      if (windowCheckIntervalRef.current) {
        clearInterval(windowCheckIntervalRef.current);
        windowCheckIntervalRef.current = null;
      }
      
      clearTimeout(setupTimeout);
      
      // Reset refs
      isInitializedRef.current = false;
      fullscreenAttemptRef.current = 0;
      violationCountRef.current = 0;
      issuedWarningsRef.current = 0;
      lastViolationTimeRef.current = 0;
    };
  }, [eventDetails, submitted, handleKeyDown, handleContextMenu, handleVisibilityChange, 
      handleFullscreenChange, handleDragStart, handleDrop, handleWindowBlur, handleWindowFocus,
      handlePopState, handleBeforeUnload, checkDevTools, checkWindowState, enterFullscreen, 
      maximizeWindow, addToast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isSubmittingRef.current = false;
      if (devToolsCheckRef.current) {
        clearInterval(devToolsCheckRef.current);
      }
      if (windowCheckIntervalRef.current) {
        clearInterval(windowCheckIntervalRef.current);
      }
      clearAllToasts();
    };
  }, [clearAllToasts]);

  // Return components and utilities
  return {
    violationCount: violationCountRef.current,
    warningCount: warningCountRef.current,
    toasts,
    addToast,
    dismissToast,
    clearAllToasts,
    maximizeWindow, // NEW: Expose maximize function
    ToasterComponent: () => (
      <ExamToaster 
        toasts={toasts} 
        onDismiss={dismissToast} 
      />
    )
  };
};