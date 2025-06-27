const { app, BrowserWindow, ipcMain, shell } = require('electron');
const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

let mainWindow;
let proctorProcess = null;

// PROTOCOL REGISTRATION - Done BEFORE app.whenReady()
const PROTOCOL_NAME = 'examproc';

// For development, force protocol registration
if (process.env.NODE_ENV === 'development') {
    app.removeAsDefaultProtocolClient(PROTOCOL_NAME);
    app.setAsDefaultProtocolClient(PROTOCOL_NAME, process.execPath, [path.resolve(process.argv[1])]);
  } else {
    if (!app.isDefaultProtocolClient(PROTOCOL_NAME)) {
      app.setAsDefaultProtocolClient(PROTOCOL_NAME);
    }
  }
  

function safeSend(channel, data) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, data);
  }
}

function closeUnwantedApps() {
  const platform = process.platform;
  console.log(platform);

  // For example, close unwanted apps on macOS and Windows (commented for production)
  // if (platform === 'darwin') {
  //   const appsToKill = ['Safari', 'Google Chrome'];
  //   appsToKill.forEach(app => {
  //     exec(`osascript -e 'quit app "${app}"'`, (err) => {
  //       if (err) console.warn(`⚠️ Failed to quit ${app}:`, err.message);
  //       else console.log(`✅ ${app} closed.`);
  //     });
  //   });
  // }
}

function createWindow(route = '', userId = null, examId = null, eventId = null) {
  const preloadPath = path.resolve(__dirname, 'preload.js');
  
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    fullscreen: route === 'test', // Only fullscreen for actual test
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  let url;
  const isDev = process.env.NODE_ENV === 'development';
  
  if (route === 'splash' && userId && examId) {
    // Load splash page with exam parameters
    url = isDev 
      ? `http://localhost:5173/student/proctor-splash?userId=${userId}&examId=${examId}&eventId=${eventId || 'default'}`
      : `file://${path.join(__dirname, '../build/index.html')}#/student/proctor-splash?userId=${userId}&examId=${examId}&eventId=${eventId || 'default'}`;
  } else if (route === 'test' && userId && examId) {
    // Load test page
    url = isDev 
      ? `http://localhost:5173/student/test?userId=${userId}&examId=${examId}&eventId=${eventId || 'default'}`
      : `file://${path.join(__dirname, '../build/index.html')}#/student/test?userId=${userId}&examId=${examId}&eventId=${eventId || 'default'}`;
  } else {
    // Default to upcoming exams page
    url = isDev 
      ? 'http://localhost:5173/student/upcoming-exams'
      : `file://${path.join(__dirname, '../build/index.html')}#/student/upcoming-exams`;
  }

  console.log('🔗 Loading URL:', url);
  mainWindow.loadURL(url);

  // Add development tools in dev mode
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
    // Clean up proctor process when window closes
    if (proctorProcess) {
      proctorProcess.kill('SIGTERM');
      proctorProcess = null;
    }
  });

  // Only close unwanted apps when starting actual test, not splash
  if (route === 'test') {
    closeUnwantedApps();
  }
}

function getBinaryPath() {
  const isWin = process.platform === 'win32';
  const platformDir = isWin ? 'win' : 'mac';
  const binaryName = isWin ? 'ai_proctor.exe' : 'ai_proctor';

  let basePath = path.join(process.resourcesPath, 'bin', platformDir);
  const fullPath = path.join(basePath, binaryName);

  console.log("🛠️ Resolved binary path:", fullPath);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`❌ AI Proctor binary not found at: ${fullPath}`);
  }

  return fullPath;
}

function launchProctorEngine(studentId, examId, eventId = 'default') {
  if (proctorProcess) {
    console.log('⚠️ Proctor engine already running');
    return;
  }

  try {
    const binaryPath = getBinaryPath();
    console.log('🚀 Launching proctor with:', { studentId, examId, eventId });
    
    proctorProcess = spawn(binaryPath, [
      '--student-id', studentId,
      '--exam-id', examId,
      '--event-id', eventId
    ], {
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    });

    proctorProcess.stdout.on('data', (data) => {
      const message = data.toString();
      console.log('📊 Proctor stdout:', message);
      safeSend('proctor-log', message);
    });

    proctorProcess.stderr.on('data', (data) => {
      const message = data.toString();
      console.error('❌ Proctor stderr:', message);
      safeSend('proctor-log', `❌ ERROR: ${message}`);
    });

    proctorProcess.on('exit', (code) => {
      const message = `Proctor Engine exited with code ${code}`;
      console.log('🛑', message);
      safeSend('proctor-log', message);
      proctorProcess = null;
    });

    proctorProcess.on('error', (error) => {
      console.error('❌ Proctor process error:', error);
      safeSend('proctor-log', `❌ Process Error: ${error.message}`);
      proctorProcess = null;
    });

  } catch (error) {
    console.error('❌ Failed to launch proctor engine:', error);
    safeSend('proctor-log', `❌ Launch Error: ${error.message}`);
  }
}

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
  app.commandLine.appendSwitch('disk-cache-size', '0');
  app.disableHardwareAcceleration();

  let pendingOpenUrl = null;

  function checkPendingProtocol() {
    if (process.platform === 'win32') {
      const urlArg = process.argv.find(arg => arg.startsWith(`${PROTOCOL_NAME}://`));
      if (urlArg) {
        console.log('🔵 Windows protocol detected:', urlArg);
        pendingOpenUrl = urlArg;
      }
    }
  }

  checkPendingProtocol();

  app.whenReady().then(() => {
    console.log('🚀 App ready, checking pending protocol...');
    
    if (pendingOpenUrl) {
      console.log('🔄 Processing pending URL:', pendingOpenUrl);
      handleOpenUrl(pendingOpenUrl);
      pendingOpenUrl = null;
    } else {
      createWindow();
    }
  });

  // Handle protocol URLs
  app.on('open-url', (event, url) => {
    console.log('📨 Protocol URL received:', url);
    event.preventDefault();
    
    if (app.isReady()) {
      handleOpenUrl(url);
    } else {
      pendingOpenUrl = url;
    }
  });

  app.on('second-instance', (event, commandLine) => {
    console.log('🔄 Second instance detected');
    
    // If we already have a window, focus it
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }

    // Check for protocol URL in command line
    if (process.platform === 'win32') {
      const url = commandLine.find(arg => arg.startsWith(`${PROTOCOL_NAME}://`));
      if (url) {
        console.log('🔵 Protocol URL from second instance:', url);
        handleOpenUrl(url);
      }
    }
  });

  function handleOpenUrl(url) {
    console.log('🔧 Processing protocol URL:', url);

    try {
      const parsedUrl = new URL(url);
      const action = parsedUrl.hostname; // 'splash', 'start', 'test'
      const userId = parsedUrl.searchParams.get('userId');
      const examId = parsedUrl.searchParams.get('examId');
      const eventId = parsedUrl.searchParams.get('eventId') || 'default';

      console.log('📋 Parsed parameters:', { action, userId, examId, eventId });

      // Handle test action (for backwards compatibility)
      if (action === 'test') {
        console.warn('⚠️ Direct test launch is deprecated, use splash instead');
        action = 'splash';
      }

      if (action === 'splash') {
        if (!userId || !examId) {
          console.error('❌ Missing required parameters for splash');
          showError('Invalid exam link: Missing required parameters');
          return;
        }

        // Create or update window with splash page
        if (!mainWindow || mainWindow.isDestroyed()) {
          createWindow('splash', userId, examId, eventId);
        } else {
          const isDev = process.env.NODE_ENV === 'development';
          const splashUrl = isDev 
            ? `http://localhost:5173/student/proctor-splash?userId=${userId}&examId=${examId}&eventId=${eventId}`
            : `file://${path.join(__dirname, '../build/index.html')}#/student/proctor-splash?userId=${userId}&examId=${examId}&eventId=${eventId}`;
          
          mainWindow.loadURL(splashUrl);
          mainWindow.show();
          mainWindow.focus();
        }
      } else {
        console.error('❌ Unknown protocol action:', action);
        showError(`Unknown action: ${action}`);
      }

    } catch (error) {
      console.error('❌ Error parsing URL:', error);
      showError(`Error processing exam link: ${error.message}`);
    }
  }

  function showError(message) {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.executeJavaScript(`
        alert('${message}');
      `);
    }
  }

  // IPC Handlers
  ipcMain.handle('start-exam', async (event, examData) => {
    try {
      const { userId, examId, eventId = 'default' } = examData;
      
      console.log('🎯 Starting exam:', { userId, examId, eventId });

      // Switch to fullscreen test mode
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.setFullScreen(true);
        
        const isDev = process.env.NODE_ENV === 'development';
        const testPageUrl = isDev 
          ? `http://localhost:5173/student/test?userId=${userId}&examId=${examId}&eventId=${eventId}`
          : `file://${path.join(__dirname, '../build/index.html')}#/student/test?userId=${userId}&examId=${examId}&eventId=${eventId}`;
        
        await mainWindow.loadURL(testPageUrl);
        closeUnwantedApps(); // Close unwanted apps when starting test
      }

      // Launch the proctor engine for monitoring
      launchProctorEngine(userId, examId, eventId);

      return { success: true, message: 'Exam started successfully' };
    } catch (error) {
      console.error('❌ Failed to start exam:', error);
      return { success: false, message: error.message };
    }
  });

  ipcMain.handle('end-exam', async (event) => {
    try {
      if (proctorProcess) {
        proctorProcess.kill('SIGINT');
        proctorProcess = null;
        console.log("🛑 AI Proctor Engine stopped.");
      }
      
      // Exit fullscreen mode
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.setFullScreen(false);
      }
      
      return { success: true, message: 'Exam ended successfully' };
    } catch (error) {
      console.error('❌ Failed to end exam:', error);
      return { success: false, message: error.message };
    }
  });

  ipcMain.handle('get-system-info', async () => {
    const os = require('os');
    return {
      platform: os.platform(),
      arch: os.arch(),
      memory: os.totalmem(),
      cpus: os.cpus().length
    };
  });

  ipcMain.on('start-proctor-engine', (_event, { userId, examId, eventId }) => {
    launchProctorEngine(userId, examId, eventId || 'default');
  });

  ipcMain.on('stop-proctor-engine', () => {
    if (proctorProcess) {
      proctorProcess.kill('SIGINT');
      proctorProcess = null;
      console.log("🛑 AI Proctor Engine stopped manually.");
    }
  });

  ipcMain.on('close-electron-window', () => {
    if (proctorProcess) {
      proctorProcess.kill('SIGINT');
      proctorProcess = null;
    }

    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.close();
    }
  });

  // App event handlers
  app.on('window-all-closed', () => {
    if (proctorProcess) {
      proctorProcess.kill('SIGTERM');
      proctorProcess = null;
    }
    app.quit();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  // Security: Prevent new window creation
  app.on('web-contents-created', (event, contents) => {
    contents.on('new-window', (event, navigationUrl) => {
      event.preventDefault();
    });
  });

  // Handle external links
  app.on('web-contents-created', (event, contents) => {
    contents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);
      return { action: 'deny' };
    });
  });
}