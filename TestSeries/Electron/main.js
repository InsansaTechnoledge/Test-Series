const { app } = require('electron');
const path = require('path');
// Import modular components
const WindowManager = require('./main/window/windowManager');
const MenuManager = require('./main/window/menuManager');
const ProtocolHandler = require('./main/protocol/protocolHandler');
const ProctorManager = require('./main/proctor/proctorManager');
const IPCHandlers = require('./main/IPC/ipcHandlers');
const PlatformUtils = require('./main/utils/platformUtils');
const { isDev, APP_CONFIG } = require('./main/utils/constants');
const QueueManager = require('./queueManager');
class ElectronApp {
  constructor() {
    this.windowManager = new WindowManager();
    this.protocolHandler = new ProtocolHandler();
    this.queue = new QueueManager();
    this.proctorManager = new ProctorManager(this.queue);
    this.ipcHandlers = new IPCHandlers(this.protocolHandler, this.proctorManager, this.queue);
    
    this.mainWindow = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    // Register custom protocol
    this.registerProtocol();
    
    // Handle single instance
    this.handleSingleInstance();
    
    // Setup app event handlers
    this.setupAppEvents();
    
    this.isInitialized = true;
  }

  registerProtocol() {
    if (process.defaultApp) {
      if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient(APP_CONFIG.PROTOCOL.SCHEME, process.execPath, [path.resolve(process.argv[1])]);
      }
    } else {
      app.setAsDefaultProtocolClient(APP_CONFIG.PROTOCOL.SCHEME);
    }
  }

  handleSingleInstance() {
    const gotTheLock = app.requestSingleInstanceLock();

    if (!gotTheLock) {
      app.quit();
      return;
    }

    app.on('second-instance', (event, commandLine, workingDirectory) => {
      console.log('🔄 Second instance detected');
      
      if (this.mainWindow) {
        if (this.mainWindow.isMinimized()) this.mainWindow.restore();
        this.mainWindow.focus();
      }
      
      const protocolUrl = commandLine.find(arg => arg.startsWith(`${APP_CONFIG.PROTOCOL.SCHEME}://`));
      if (protocolUrl) {
        this.handleProtocolUrl(protocolUrl);
      }
    });
  }

  setupAppEvents() {
    app.on('open-url', (event, url) => {
      console.log('🍎 macOS open-url event:', url);
      event.preventDefault();
      this.handleProtocolUrl(url);
    });

    app.whenReady().then(() => {
      this.createWindow();
      this.setupIPC();
      
      if (process.platform === 'win32' || process.platform === 'linux') {
        const protocolUrl = process.argv.find(arg => arg.startsWith(`${APP_CONFIG.PROTOCOL.SCHEME}://`));
        if (protocolUrl) {
          console.log('🚀 App launched with protocol URL:', protocolUrl);
          this.handleProtocolUrl(protocolUrl);
        }
      }
    });

    app.on('window-all-closed', () => {
      this.cleanup();
      if (process.platform !== 'darwin') {
        app.quit();
      }
      app.quit();
    });

    app.on('activate', () => {
      if (this.windowManager.getMainWindow() === null) {
        this.createWindow();
      }
    });

    app.on('web-contents-created', (event, contents) => {
      contents.on('new-window', (event, navigationUrl) => {
        event.preventDefault();
        require('electron').shell.openExternal(navigationUrl);
      });
    });

    // Performance optimizations
    app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
    app.commandLine.appendSwitch('disk-cache-size', '0');
  }

  createWindow() {
    this.mainWindow = this.windowManager.createWindow();
    this.ipcHandlers.setMainWindow(this.mainWindow);
    
    MenuManager.createMenu(this.mainWindow);
    
    PlatformUtils.cleanupPlatformSpecific();
  }

  setupIPC() {
    this.ipcHandlers.registerHandlers();
  }


  handleProtocolUrl(url) {
    const params = this.protocolHandler.handleProtocolUrl(url, this.mainWindow);
    this.windowManager.handleProtocolUrl(params);
  }

  async cleanup() {
    try {
      await this.queue.flushNow();
      this.queue.clearDB();
      this.queue.close();
      console.log('🗑️ Event queue flushed and cleared');
    } catch (error) {
      console.error('Error clearing event queue:', error);
    }

    if (this.proctorManager.isRunning()) {
      this.proctorManager.stop();
    }
  }
}

// Initialize and start the application
const electronApp = new ElectronApp();

electronApp.initialize().then(() => {
  if (isDev) {
    console.log('📋 Development protocol registration result:', app.isDefaultProtocolClient(APP_CONFIG.PROTOCOL.SCHEME));
    console.log('🚀 Electron app ready - waiting for protocol calls...');
    console.log(`💡 Test with: ${APP_CONFIG.PROTOCOL.SCHEME}://splash?userId=test&examId=test&eventId=test`);
  }
}).catch((error) => {
  console.error('❌ Failed to initialize Electron app:', error);
  app.quit();
});