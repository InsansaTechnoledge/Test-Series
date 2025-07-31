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

  clearDbEvents: () => {
    console.log('🗑️ Preload: clearDbEvents called');
    ipcRenderer.invoke('clear-db-events');
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

