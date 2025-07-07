import { useEffect, useRef, useCallback } from 'react';

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
  // Refs to prevent stale closure issues and infinite loops
  const warningCountRef = useRef(warningCount);
  const violationTimeoutRef = useRef(null);
  const devToolsCheckRef = useRef(null);
  const isSubmittingRef = useRef(false);
  const lastViolationRef = useRef(null);
  const fullscreenRetryRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Update warning count ref whenever it changes
  useEffect(() => {
    warningCountRef.current = warningCount;
  }, [warningCount]);

  // Debounced violation logger to prevent spam
  const logViolation = useCallback((type) => {
    // Prevent duplicate violations within 1 second
    const now = Date.now();
    if (lastViolationRef.current && 
        lastViolationRef.current.type === type && 
        now - lastViolationRef.current.timestamp < 1000) {
      return;
    }

    const violation = {
      type,
      timestamp: now,
      userId,
      examId,
    };

    lastViolationRef.current = violation;
    
    try {
      setExamViolations(prev => {
        // Prevent duplicate violations
        if (prev.some(v => v.type === type && Math.abs(v.timestamp - now) < 1000)) {
          return prev;
        }
        return [...prev, violation];
      });
      console.warn('Violation:', violation);
    } catch (error) {
      console.error('Error logging violation:', error);
    }
  }, [setExamViolations, userId, examId]);

  // Debounced warning system
  const showWarning = useCallback((message) => {
    if (isSubmittingRef.current || submitted) return;

    // Clear any existing timeout
    if (violationTimeoutRef.current) {
      clearTimeout(violationTimeoutRef.current);
    }

    violationTimeoutRef.current = setTimeout(() => {
      try {
        const currentCount = warningCountRef.current;
        const nextCount = currentCount + 1;
        
        setWarningCount(nextCount);
        
        const warningMessage = `⚠️ WARNING: ${message}\n\nThis is warning ${nextCount}. Multiple violations may result in exam termination.`;
        
        // Use a more user-friendly notification system if available
        if (window.showExamWarning) {
          window.showExamWarning(warningMessage);
        } else {
          alert(warningMessage);
        }
        
        // Auto-submit after 3 warnings with additional safety checks
        if (nextCount >= 3 && !isSubmittingRef.current) {
          isSubmittingRef.current = true;
          const submitMessage = 'Too many violations. Exam will be auto-submitted.';
          
          if (window.showExamWarning) {
            window.showExamWarning(submitMessage);
          } else {
            alert(submitMessage);
          }
          
          setTimeout(() => {
            if (handleSubmitTest && typeof handleSubmitTest === 'function') {
              handleSubmitTest();
            }
          }, 2000);
        }
      } catch (error) {
        console.error('Error showing warning:', error);
      }
    }, 500); // 500ms debounce
  }, [setWarningCount, handleSubmitTest, submitted]);

  // Optimized key handler with debouncing
  const disableKeys = useCallback((e) => {
    if (submitted || isSubmittingRef.current) return;

    const violations = [
      { combo: e.key === 'F12', label: 'F12 key' },
      { combo: e.ctrlKey && e.shiftKey && e.key === 'I', label: 'Ctrl+Shift+I' },
      { combo: e.ctrlKey && e.shiftKey && e.key === 'J', label: 'Ctrl+Shift+J' },
      { combo: e.ctrlKey && e.shiftKey && e.key === 'C', label: 'Ctrl+Shift+C' },
      { combo: e.ctrlKey && e.key === 'u', label: 'Ctrl+U' },
      { combo: e.ctrlKey && e.key === 's', label: 'Ctrl+S' },
      { combo: e.ctrlKey && e.key === 'p', label: 'Ctrl+P' },
      { combo: e.altKey && e.key === 'Tab', label: 'Alt+Tab' },
      { combo: e.ctrlKey && e.key === 'Tab', label: 'Ctrl+Tab' },
      { combo: e.key === 'Meta', label: 'Windows key' },
      { combo: e.ctrlKey && e.key === 'n', label: 'Ctrl+N' },
      { combo: e.ctrlKey && e.key === 't', label: 'Ctrl+T' },
      { combo: e.ctrlKey && e.key === 'w', label: 'Ctrl+W' },
      { combo: e.ctrlKey && e.key === 'r', label: 'Ctrl+R' },
      { combo: e.key === 'F5', label: 'F5' }
    ];

    const violation = violations.find(v => v.combo);
    if (violation) {
      e.preventDefault();
      e.stopPropagation();
      logViolation(`${violation.label} pressed`);
      showWarning(`${violation.label} is disabled during the exam.`);
    }
  }, [submitted, logViolation, showWarning]);

  // Copy/paste prevention
  const preventCopyPaste = useCallback((e) => {
    if (submitted || isSubmittingRef.current) return;

    if (e.ctrlKey && ['c', 'v', 'x', 'a'].includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
      logViolation(`Copy/Paste/Select (${e.key}) attempted`);
      showWarning(`Keyboard shortcuts like Ctrl+${e.key.toUpperCase()} are disabled.`);
    }
  }, [submitted, logViolation, showWarning]);

  // Throttled dev tools detection
  const checkDevTools = useCallback(() => {
    if (submitted || isSubmittingRef.current) return;

    try {
      const threshold = 160;
      const heightDiff = window.outerHeight - window.innerHeight;
      const widthDiff = window.outerWidth - window.innerWidth;
      
      if (heightDiff > threshold || widthDiff > threshold) {
        logViolation('Developer tools detected');
        showWarning('Developer tools usage is not allowed.');
      }
    } catch (error) {
      console.error('Error checking dev tools:', error);
    }
  }, [submitted, logViolation, showWarning]);

  // Window focus handlers
  const handleWindowBlur = useCallback(() => {
    if (submitted || isSubmittingRef.current) return;
    logViolation('Window lost focus');
    showWarning('You switched away from the exam window!');
  }, [submitted, logViolation, showWarning]);

  const handleVisibilityChange = useCallback(() => {
    if (submitted || isSubmittingRef.current) return;
    if (document.hidden) {
      logViolation('Page became hidden');
      showWarning('You switched tabs or minimized the window!');
    }
  }, [submitted, logViolation, showWarning]);

  // Fullscreen management with retry logic
  const enterFullscreen = useCallback(() => {
    if (!examContainerRef?.current || submitted || isSubmittingRef.current) return;

    try {
      const el = examContainerRef.current;
      const requestFullscreen = el.requestFullscreen || 
                               el.webkitRequestFullscreen || 
                               el.msRequestFullscreen;
      
      if (requestFullscreen) {
        requestFullscreen.call(el).catch(err => {
          console.warn('Fullscreen request failed:', err);
        });
      }
    } catch (error) {
      console.error('Error entering fullscreen:', error);
    }
  }, [examContainerRef, submitted]);

  const handleFullscreenChange = useCallback(() => {
    if (submitted || isSubmittingRef.current) return;

    if (!document.fullscreenElement) {
      logViolation('Exited fullscreen mode');
      showWarning('You must stay in fullscreen during the exam.');
      
      // Retry fullscreen with exponential backoff
      if (fullscreenRetryRef.current) {
        clearTimeout(fullscreenRetryRef.current);
      }
      
      fullscreenRetryRef.current = setTimeout(() => {
        enterFullscreen();
      }, 1000);
    }
  }, [submitted, logViolation, showWarning, enterFullscreen]);

  // Context menu and drag/drop handlers
  const disableContextMenu = useCallback((e) => {
    if (submitted || isSubmittingRef.current) return;
    e.preventDefault();
    logViolation('Right-click attempted');
  }, [submitted, logViolation]);

  const disableDragDrop = useCallback((e) => {
    if (submitted || isSubmittingRef.current) return;
    e.preventDefault();
    logViolation('Drag/Drop attempted');
  }, [submitted, logViolation]);

  // Navigation handlers
  const handlePopState = useCallback((e) => {
    if (submitted || isSubmittingRef.current) return;
    e.preventDefault();
    logViolation('Back button pressed');
    showWarning('Back navigation is disabled!');
    
    // Restore current state
    try {
      window.history.pushState(null, null, window.location.pathname);
    } catch (error) {
      console.error('Error handling popstate:', error);
    }
  }, [submitted, logViolation, showWarning]);

  const handleBeforeUnload = useCallback((e) => {
    if (submitted || isSubmittingRef.current) return;
    logViolation('Page refresh/close attempted');
    e.preventDefault();
    e.returnValue = 'Are you sure you want to leave? Your test will be lost.';
  }, [submitted, logViolation]);

  // Main effect for security initialization
  useEffect(() => {
    if (!eventDetails || submitted || isInitializedRef.current) return;

    isInitializedRef.current = true;
    console.log('Initializing exam security...');

    // Initialize history state
    try {
      window.history.pushState(null, null, window.location.pathname);
    } catch (error) {
      console.error('Error initializing history:', error);
    }

    // Add all event listeners
    const cleanup = [];
    
    try {
      document.addEventListener('contextmenu', disableContextMenu, { passive: false });
      cleanup.push(() => document.removeEventListener('contextmenu', disableContextMenu));

      document.addEventListener('keydown', disableKeys, { passive: false });
      cleanup.push(() => document.removeEventListener('keydown', disableKeys));

      document.addEventListener('keydown', preventCopyPaste, { passive: false });
      cleanup.push(() => document.removeEventListener('keydown', preventCopyPaste));

      document.addEventListener('visibilitychange', handleVisibilityChange);
      cleanup.push(() => document.removeEventListener('visibilitychange', handleVisibilityChange));

      document.addEventListener('fullscreenchange', handleFullscreenChange);
      cleanup.push(() => document.removeEventListener('fullscreenchange', handleFullscreenChange));

      document.addEventListener('dragstart', disableDragDrop, { passive: false });
      cleanup.push(() => document.removeEventListener('dragstart', disableDragDrop));

      document.addEventListener('drop', disableDragDrop, { passive: false });
      cleanup.push(() => document.removeEventListener('drop', disableDragDrop));

      window.addEventListener('blur', handleWindowBlur);
      cleanup.push(() => window.removeEventListener('blur', handleWindowBlur));

      window.addEventListener('popstate', handlePopState);
      cleanup.push(() => window.removeEventListener('popstate', handlePopState));

      window.addEventListener('beforeunload', handleBeforeUnload);
      cleanup.push(() => window.removeEventListener('beforeunload', handleBeforeUnload));

      // Start dev tools monitoring with throttling
      devToolsCheckRef.current = setInterval(checkDevTools, 2000);
      cleanup.push(() => {
        if (devToolsCheckRef.current) {
          clearInterval(devToolsCheckRef.current);
        }
      });

      // Enter fullscreen after a brief delay
      setTimeout(() => {
        if (!submitted && !isSubmittingRef.current) {
          enterFullscreen();
        }
      }, 500);

    } catch (error) {
      console.error('Error setting up security listeners:', error);
    }

    // Cleanup function
    return () => {
      console.log('Cleaning up exam security...');
      isInitializedRef.current = false;
      
      cleanup.forEach(fn => {
        try {
          fn();
        } catch (error) {
          console.error('Error during cleanup:', error);
        }
      });

      // Clear all timeouts
      if (violationTimeoutRef.current) {
        clearTimeout(violationTimeoutRef.current);
      }
      if (fullscreenRetryRef.current) {
        clearTimeout(fullscreenRetryRef.current);
      }
      if (devToolsCheckRef.current) {
        clearInterval(devToolsCheckRef.current);
      }
    };
  }, [eventDetails, submitted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isSubmittingRef.current = false;
      if (violationTimeoutRef.current) {
        clearTimeout(violationTimeoutRef.current);
      }
      if (fullscreenRetryRef.current) {
        clearTimeout(fullscreenRetryRef.current);
      }
      if (devToolsCheckRef.current) {
        clearInterval(devToolsCheckRef.current);
      }
    };
  }, []);
};