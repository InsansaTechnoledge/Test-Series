const { ipcMain, dialog, shell } = require('electron');
const IPC_CHANNELS = require('./ipcChannels');
const { isWin, isMac } = require('../utils/constants');

class IPCHandlers {
  constructor(protocolHandler, proctorManager, queue) {
    this.protocolHandler = protocolHandler;
    this.proctorManager = proctorManager;
    this.queue = queue;
    this.mainWindow = null;
    this.deeplinkURL = null;
  }

  setMainWindow(mainWindow) {
    this.mainWindow = mainWindow;
  }

  /**
   * Register all IPC handlers
   */
  registerHandlers() {
    // Protocol handlers
    ipcMain.handle(IPC_CHANNELS.GET_PROTOCOL_PARAMS, () => {
      return this.protocolHandler.getProtocolParams();
    });

    ipcMain.handle(IPC_CHANNELS.GET_URL_PARAMS, () => {
      if (!this.deeplinkURL) return null;

      try {
        const parsedUrl = new URL(this.deeplinkURL);
        const params = Object.fromEntries(parsedUrl.searchParams.entries());
        return params;
      } catch (err) {
        return null;
      }
    });

    // Queue management
    ipcMain.handle(IPC_CHANNELS.CLEAR_DB_EVENTS, async () => {
      if (this.queue) {
        await this.queue.flushNow();
        this.queue.clearDB();
        return { success: true, message: 'Event queue cleared' };
      }
      return { success: false, message: 'No event queue found' };
    });

    // Window management
    ipcMain.handle(IPC_CHANNELS.WINDOW_MINIMIZE, () => {
      if (this.mainWindow) this.mainWindow.minimize();
    });

    ipcMain.handle(IPC_CHANNELS.WINDOW_MAXIMIZE, () => {
      if (this.mainWindow) {
        if (this.mainWindow.isMaximized()) {
          this.mainWindow.unmaximize();
        } else {
          this.mainWindow.maximize();
        }
      }
    });

    ipcMain.handle(IPC_CHANNELS.WINDOW_CLOSE, async () => {
      try {
        await this.queue.flushNow();
        this.queue.clearDB();
        this.queue.close();
        console.log('🗑️ Event queue flushed and cleared');
      } catch (error) {
        console.error('Error clearing event queue:', error);
      }
      if (this.mainWindow) this.mainWindow.close();
    });

    // Dialog operations
    ipcMain.handle(IPC_CHANNELS.DIALOG_OPEN_FILE, async () => {
      const result = await dialog.showOpenDialog(this.mainWindow, {
        properties: ['openFile'],
        filters: [
          { name: 'All Files', extensions: ['*'] }
        ]
      });
      return result;
    });

    ipcMain.handle(IPC_CHANNELS.DIALOG_SAVE_FILE, async (event, data) => {
      const result = await dialog.showSaveDialog(this.mainWindow, {
        filters: [
          { name: 'All Files', extensions: ['*'] }
        ]
      });
      return result;
    });

    // Developer tools
    ipcMain.handle(IPC_CHANNELS.OPEN_DEV_TOOLS, () => {
      if (this.mainWindow) this.mainWindow.webContents.openDevTools();
    });

    ipcMain.handle(IPC_CHANNELS.OPEN_EXTERNAL, (event, url) => {
      shell.openExternal(url);
    });

    // Exam operations
    ipcMain.handle(IPC_CHANNELS.START_EXAM, (event, examData) => {
      console.log('🎯 Starting exam:', examData);
      return { success: true, message: 'Exam started' };
    });

    ipcMain.handle(IPC_CHANNELS.SUBMIT_EXAM, (event, examResults) => {
      console.log('📊 Submitting exam results:', examResults);
      return { success: true, message: 'Exam submitted' };
    });

    // Proctor engine handlers
    ipcMain.on(IPC_CHANNELS.START_PROCTOR_ENGINE, (_event, params) => {
      console.log('🔧 Received request to start proctor engine with params:', params);
      this.proctorManager.start(params, this.mainWindow);
    });

    ipcMain.handle(IPC_CHANNELS.START_PROCTOR_ENGINE_ASYNC, async (_event, params) => {
      console.log('🔧 Received async request to start proctor engine with params:', params);
      return this.proctorManager.start(params, this.mainWindow);
    });

    ipcMain.handle(IPC_CHANNELS.STOP_PROCTOR_ENGINE_ASYNC, async () => {
      return this.proctorManager.stop();
    });

    ipcMain.handle(IPC_CHANNELS.STOP_PROCTOR_ENGINE, () => {
      return this.proctorManager.stop();
    });

    // Renderer communication
    ipcMain.on(IPC_CHANNELS.RENDERER_MESSAGE, (event, message) => {
      console.log('📨 Message from renderer:', message);
    });

    ipcMain.on(IPC_CHANNELS.RENDERER_READY, () => {
      console.log('✅ Renderer process is ready');
    });


    ipcMain.handle(IPC_CHANNELS.OPEN_CAMERA_SETTINGS, () => {
      console.log('🔧 Opening camera settings');
      if(isWin){
        shell.openExternal('ms-settings:privacy-webcam');
      }
      else if(isMac){
        shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_Camera');
      }
    });

    ipcMain.handle(IPC_CHANNELS.OPEN_MIC_SETTINGS, () => {
  console.log('🎤 Opening microphone settings');
  if (isWin) {
    shell.openExternal('ms-settings:privacy-microphone');
  } else if (isMac) {
    shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_Microphone');
  }
});

  }

  setDeeplinkURL(url) {
    this.deeplinkURL = url;
  }
}

module.exports = IPCHandlers;