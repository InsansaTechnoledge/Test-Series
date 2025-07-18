// const { contextBridge, ipcRenderer } = require('electron');

// // Expose protected methods that allow the renderer process to use
// // the ipcRenderer without exposing the entire object
// contextBridge.exposeInMainWorld('electronAPI', {
//   // Exam Management
//   startExam: (examData) => ipcRenderer.invoke('start-exam', examData),
//   endExam: () => ipcRenderer.invoke('end-exam'),
//   isExamInProgress: () => ipcRenderer.invoke('is-exam-in-progress'),
  
//   // System Information
//   getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
//   getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
//   // Proctoring Events
//   onProctoringEvent: (callback) => {
//     ipcRenderer.on('proctor-event', (event, data) => callback(data));
//   },
  
//   removeProctoringListener: () => {
//     ipcRenderer.removeAllListeners('proctor-event');
//   },
  
//   getProctoringEvents: () => ipcRenderer.invoke('get-proctor-events'),
  
//   // Navigation and External Links
//   openExternalLink: (url) => ipcRenderer.invoke('open-external', url),
  
//   // Window Management
//   minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
//   maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
//   closeWindow: () => ipcRenderer.invoke('close-window'),
  
//   // Notifications
//   showNotification: (title, body) => ipcRenderer.invoke('show-notification', { title, body }),
  
//   // Violation Reporting
//   reportExamViolation: (violation) => ipcRenderer.invoke('report-violation', violation),
  
//   // Platform Detection
//   getPlatform: () => process.platform,
  
//   // Exam Security Functions
//   preventCopy: () => {
//     // This function will be called by the exam page to enable security measures
//     return true; // Just confirm it's available
//   }
// });

// // Enhanced exam security features
// contextBridge.exposeInMainWorld('examSecurity', {
//   // Enable exam security mode
//   enableSecurityMode: () => {
//     // Disable right-click context menu
//     document.addEventListener('contextmenu', e => {
//       e.preventDefault();
//       return false;
//     });
    
//     // Disable key combinations
//     document.addEventListener('keydown', e => {
//       // List of disabled key combinations
//       const disabledKeys = [
//         { key: 'F12' }, // Developer tools
//         { key: 'F5' }, // Refresh
//         { key: 'F11' }, // Fullscreen toggle
//         { ctrl: true, key: 'R' }, // Refresh
//         { ctrl: true, key: 'U' }, // View source
//         { ctrl: true, key: 'S' }, // Save
//         { ctrl: true, key: 'P' }, // Print
//         { ctrl: true, key: 'C' }, // Copy
//         { ctrl: true, key: 'V' }, // Paste
//         { ctrl: true, key: 'X' }, // Cut
//         { ctrl: true, key: 'A' }, // Select all
//         { ctrl: true, key: 'Z' }, // Undo
//         { ctrl: true, key: 'Y' }, // Redo
//         { ctrl: true, shift: true, key: 'I' }, // Developer tools
//         { ctrl: true, shift: true, key: 'J' }, // Console
//         { ctrl: true, shift: true, key: 'C' }, // Inspector
//         { alt: true, key: 'F4' }, // Close window
//         { alt: true, key: 'Tab' }, // Switch apps
//       ];
      
//       const isDisabled = disabledKeys.some(combo => {
//         if (combo.key && e.code === combo.key) {
//           if (combo.ctrl && !e.ctrlKey) return false;
//           if (combo.shift && !e.shiftKey) return false;
//           if (combo.alt && !e.altKey) return false;
//           return true;
//         }
//         return false;
//       });
      
//       if (isDisabled) {
//         e.preventDefault();
//         e.stopPropagation();
//         return false;
//       }
//     });
    
//     // Disable text selection
//     document.addEventListener('selectstart', e => {
//       e.preventDefault();
//       return false;
//     });
    
//     // Disable drag and drop
//     document.addEventListener('dragstart', e => {
//       e.preventDefault();
//       return false;
//     });
    
//     // Disable print screen (partial - can't fully block)
//     document.addEventListener('keyup', e => {
//       if (e.keyCode === 44) { // Print Screen
//         // Report violation
//         ipcRenderer.invoke('report-violation', {
//           message: 'Print screen key detected',
//           severity: 'high'
//         });
//       }
//     });
    
//     // Monitor focus changes
//     window.addEventListener('blur', () => {
//       ipcRenderer.invoke('report-violation', {
//         message: 'Window lost focus - possible app switching',
//         severity: 'medium'
//       });
//     });
    
//     // Monitor visibility changes
//     document.addEventListener('visibilitychange', () => {
//       if (document.hidden) {
//         ipcRenderer.invoke('report-violation', {
//           message: 'Tab/window became hidden',
//           severity: 'medium'
//         });
//       }
//     });
    
//     console.log('Exam security mode enabled');
//   },
  
//   // Disable security mode
//   disableSecurityMode: () => {
//     // Note: This is a simplified disable - in a real app you'd want to 
//     // properly track and remove specific event listeners
//     console.log('Exam security mode disabled');
//   },
  
//   // Check if running in electron
//   isElectronEnvironment: () => {
//     return true; // Since this preload script only runs in Electron
//   }
// });

// // Screen and media security
// contextBridge.exposeInMainWorld('screenSecurity', {
//   // Request camera and microphone permissions
//   requestMediaPermissions: async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ 
//         video: true, 
//         audio: true 
//       });
      
//       // Store the stream reference for the exam
//       window.examMediaStream = stream;
      
//       return { 
//         success: true, 
//         hasVideo: stream.getVideoTracks().length > 0,
//         hasAudio: stream.getAudioTracks().length > 0
//       };
//     } catch (error) {
//       return { 
//         success: false, 
//         error: error.message 
//       };
//     }
//   },
  
//   // Stop media streams
//   stopMediaStreams: () => {
//     if (window.examMediaStream) {
//       window.examMediaStream.getTracks().forEach(track => track.stop());
//       window.examMediaStream = null;
//     }
//   },
  
//   // Detect screen recording (limited capabilities in web)
//   detectScreenRecording: () => {
//     // This is a placeholder - actual screen recording detection would require
//     // native implementation or more sophisticated techniques
//     return Promise.resolve({ detected: false });
//   }
// });

// // Initialize security when DOM is loaded
// window.addEventListener('DOMContentLoaded', () => {
//   // Add exam app identifier to the page
//   document.body.setAttribute('data-exam-app', 'true');
  
//   // Log that we're running in the secure environment
//   console.log('Secure Exam Environment Loaded');
  
//   // Prevent drag and drop of files
//   document.addEventListener('dragover', e => e.preventDefault());
//   document.addEventListener('drop', e => e.preventDefault());
// });

// // Monitor for suspicious activities
// window.addEventListener('load', () => {
//   // Monitor for developer tools opening
//   let devtools = { open: false, orientation: null };
  
//   setInterval(() => {
//     if (window.outerHeight - window.innerHeight > 200 || 
//         window.outerWidth - window.innerWidth > 200) {
//       if (!devtools.open) {
//         devtools.open = true;
//         ipcRenderer.invoke('report-violation', {
//           message: 'Developer tools may be open',
//           severity: 'high'
//         });
//       }
//     } else {
//       devtools.open = false;
//     }
//   }, 500);
// });

// // Export for debugging in development only
// if (process.env.NODE_ENV === 'development') {
//   contextBridge.exposeInMainWorld('electronDebug', {
//     getProctoringEvents: () => ipcRenderer.invoke('get-proctor-events'),
//     testViolation: (message) => ipcRenderer.invoke('report-violation', {
//       message: message || 'Test violation',
//       severity: 'medium'
//     })
//   });
// }


// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Existing methods
  isElectron: true,
  getProtocolParams: () => ipcRenderer.invoke('get-protocol-params'),
  getURLParams: () => ipcRenderer.invoke('get-url-params'),
  onExamParameters: (callback) => {
    ipcRenderer.on('exam-parameters', (_event, data) => {
      console.log('📥 Preload: exam-parameters received:', data);
      callback(data);
    });
  },
  
  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('window-minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window-maximize'),
  closeWindow: () => ipcRenderer.invoke('window-close'),

  // ✅ FIXED: Proctor engine methods with proper parameter passing
  startProctorEngineAsync: (params) => {
    console.log('🔧 Preload: startProctorEngineAsync called with:', params);
    return ipcRenderer.invoke('start-proctor-engine-async', params);
  },
  
  stopProctorEngineAsync: () => {
    console.log('🛑 Preload: stopProctorEngineAsync called');
    return ipcRenderer.invoke('stop-proctor-engine-async');
  },
  
  startProctorEngine: (params) => {
    console.log('🔧 Preload: startProctorEngine called with:', params);
    ipcRenderer.send('start-proctor-engine', params);
  },
  
  stopProctorEngine: () => {
    console.log('🛑 Preload: stopProctorEngine called');
    ipcRenderer.invoke('stop-proctor-engine');
  },

  // ✅ FIXED: Event listeners for proctor events
  onProctorWarning: (callback) => {
    const listener = (event, data) => {
      console.log('📥 Preload: proctor-warning received:', data);
      callback(event, data);
    };
    ipcRenderer.on('proctor-warning', listener);
    return listener;
  },

  onProctorEvent: (callback) => {
    const listener = (event, data) => {
      console.log('📥 Preload: proctor-event received:', data);
      callback(event, data);
    };
    ipcRenderer.on('proctor-event', listener);
    return listener;
  },

  onProctorLog: (callback) => {
    const listener = (event, data) => {
      console.log('📝 Preload: proctor-log received:', data);
      callback(event, data);
    };
    ipcRenderer.on('proctor-log', listener);
    return listener;
  },

  // ✅ FIXED: Cleanup method for event listeners
  cleanupProctorListeners: () => {
    console.log('🧹 Preload: cleaning up proctor listeners');
    ipcRenderer.removeAllListeners('proctor-warning');
    ipcRenderer.removeAllListeners('proctor-event');
    ipcRenderer.removeAllListeners('proctor-log');
  },

  // Protocol URL handling
  onProtocolUrlReceived: (callback) => {
    ipcRenderer.on('protocol-url-received', callback);
  },

  // Development helpers
  openDevTools: () => ipcRenderer.invoke('open-dev-tools'),
  
  // Send messages to main process
  sendMessage: (message) => ipcRenderer.send('renderer-message', message),
  
  // Notify main process that renderer is ready
  rendererReady: () => ipcRenderer.send('renderer-ready')
});

