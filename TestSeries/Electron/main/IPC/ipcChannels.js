const IPC_CHANNELS = {
    // Protocol handling
    GET_PROTOCOL_PARAMS: 'get-protocol-params',
    GET_URL_PARAMS: 'get-url-params',
    PROTOCOL_URL_RECEIVED: 'protocol-url-received',
    
    // Window management
    WINDOW_MINIMIZE: 'window-minimize',
    WINDOW_MAXIMIZE: 'window-maximize',
    WINDOW_CLOSE: 'window-close',
    
    // Dialog operations
    DIALOG_OPEN_FILE: 'dialog-open-file',
    DIALOG_SAVE_FILE: 'dialog-save-file',
    
    // Developer tools
    OPEN_DEV_TOOLS: 'open-dev-tools',
    OPEN_EXTERNAL: 'open-external',
    
    // Exam operations
    START_EXAM: 'start-exam',
    SUBMIT_EXAM: 'submit-exam',
    
    // Proctor engine
    START_PROCTOR_ENGINE: 'start-proctor-engine',
    START_PROCTOR_ENGINE_ASYNC: 'start-proctor-engine-async',
    STOP_PROCTOR_ENGINE: 'stop-proctor-engine',
    STOP_PROCTOR_ENGINE_ASYNC: 'stop-proctor-engine-async',
    PROCTOR_EVENT: 'proctor-event',
    PROCTOR_WARNING: 'proctor-warning',
    PROCTOR_LOG: 'proctor-log',
    
    // Queue management
    CLEAR_DB_EVENTS: 'clear-db-events',
    
    // Renderer communication
    RENDERER_MESSAGE: 'renderer-message',
    RENDERER_READY: 'renderer-ready',

    // Camera permissions
    OPEN_CAMERA_SETTINGS: 'open-camera-settings',
  };
  
module.exports = IPC_CHANNELS;