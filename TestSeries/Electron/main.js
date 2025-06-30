const { app, BrowserWindow, ipcMain, dialog, shell, Menu, nativeImage } = require('electron');
const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const readline = require('readline');
const url = require('url');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;
let protocolUrl = null;
let proctorProcess = null;

// Function to get the correct icon path
function getIconPath() {
  const iconName = 'evalvo icon 2.png';
  let iconPath;
  
  if (isDev) {
    // In development, look in assets folder
    iconPath = path.join(__dirname, 'assets', iconName);
  } else {
    // In production, look in resources folder
    iconPath = path.join(process.resourcesPath, 'assets', iconName);
  }
  
  // Fallback paths to try
  const fallbackPaths = [
    path.join(__dirname, 'assets', iconName),
    path.join(__dirname, '..', 'assets', iconName),
    path.join(__dirname, 'icons', iconName),
    path.join(__dirname, iconName),
    path.join(process.cwd(), 'assets', iconName),
    path.join(process.cwd(), 'icons', iconName)
  ];
  
  // Check if the main path exists
  if (fs.existsSync(iconPath)) {
    console.log('✅ Icon found at:', iconPath);
    return iconPath;
  }
  
  // Try fallback paths
  for (const fallbackPath of fallbackPaths) {
    if (fs.existsSync(fallbackPath)) {
      console.log('✅ Icon found at fallback path:', fallbackPath);
      return fallbackPath;
    }
  }
  
  console.warn('⚠️ Icon not found. Checked paths:');
  console.warn('  Primary:', iconPath);
  fallbackPaths.forEach(p => console.warn('  Fallback:', p));
  
  return null; // Return null if no icon found
}

// Register the custom protocol
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('examproc', process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient('examproc');
}

// Safe send function for proctor communication
function safeSend(channel, data) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, data);
  }
}

// Function to get proctor engine binary path
function getBinaryPath() {
  const isWin = process.platform === 'win32';
  const binaryName = isWin ? 'proctor_engine.exe' : 'proctor_engine';
  
  let fullPath;
  
  if (isDev) {
    fullPath = path.join(__dirname, binaryName);
  } else {
    const platformDir = isWin ? 'win' : 'mac';
    const basePath = path.join(process.resourcesPath, 'bin', platformDir);
    fullPath = path.join(basePath, binaryName);
  }

  console.log("🛠️ Resolved binary path:", fullPath);
  console.log("🛠️ Current directory (__dirname):", __dirname);
  console.log("🛠️ isDev:", isDev);
  
  if (!fs.existsSync(fullPath)) {
    console.log("📁 Listing files in current directory:");
    try {
      const files = fs.readdirSync(__dirname);
      files.forEach(file => {
        const filePath = path.join(__dirname, file);
        const stats = fs.statSync(filePath);
        console.log(`  ${file} ${stats.isDirectory() ? '(dir)' : `(file, ${stats.size} bytes)`}`);
      });
    } catch (err) {
      console.error("❌ Error reading directory:", err);
    }
    
    throw new Error(`❌ Proctor Engine binary not found at: ${fullPath}`);
  }

  if (!isWin) {
    try {
      fs.accessSync(fullPath, fs.constants.F_OK | fs.constants.X_OK);
    } catch (err) {
      console.log("⚠️ Binary exists but may not be executable. Attempting to make it executable...");
      try {
        fs.chmodSync(fullPath, '755');
        console.log("✅ Made binary executable");
      } catch (chmodErr) {
        console.error("❌ Failed to make binary executable:", chmodErr);
        throw new Error(`❌ Proctor Engine binary is not executable: ${fullPath}`);
      }
    }
  }

  return fullPath;
}

function launchProctorEngine(params) {
  try {
    const binaryPath = getBinaryPath();
    
    const userId = params.userId;
    const examId = params.examId;
    const eventId = params.eventId || params.examId;
    
    if (!userId || !examId) {
      throw new Error(`❌ Missing required parameters. userId: ${userId}, examId: ${examId}`);
    }
    
    console.log('🚀 Launching proctor engine with params:', { userId, examId, eventId });
    
    proctorProcess = spawn(binaryPath, [
      '--user-id', userId,
      '--exam-id', examId,
      '--event-id', eventId
    ], {
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    });

    const rl = readline.createInterface({ input: proctorProcess.stdout });

    rl.on('line', (line) => {
      console.log('📤 Raw output from proctor engine:', line);
      
      try {
        const parsed = JSON.parse(line);
        console.log('📊 Parsed proctor data:', parsed);
        
        if (parsed?.eventType === 'anomaly') {
          safeSend('proctor-warning', parsed);
        } else {
          safeSend('proctor-event', parsed);
        }
      } catch (parseError) {
        console.log('📝 Non-JSON output from proctor:', line);
        safeSend('proctor-log', line);
      }
    });

    proctorProcess.stderr.on('data', (data) => {
      console.error('❌ Proctor engine stderr:', data.toString());
      safeSend('proctor-log', `❌ ERROR: ${data}`);
    });

    proctorProcess.on('exit', (code) => {
      console.log(`🛑 Proctor Engine exited with code ${code}`);
      safeSend('proctor-log', `🛑 Proctor Engine exited with code ${code}`);
      proctorProcess = null;
    });

    proctorProcess.on('error', (err) => {
      console.error('❌ Proctor process error:', err);
      safeSend('proctor-log', `❌ Failed to start engine: ${err.message}`);
      proctorProcess = null;
    });

    console.log('✅ Proctor engine launched successfully');
  } catch (error) {
    console.error('❌ Error launching proctor engine:', error);
    safeSend('proctor-log', `❌ Failed to launch proctor: ${error.message}`);
  }
}

function closeUnwantedApps() {
  const platform = process.platform;
  console.log('🔒 Platform detected:', platform);
}

function parseProtocolUrl(protocolUrl) {
  try {
    const parsedUrl = new URL(protocolUrl);
    const params = {
      userId: parsedUrl.searchParams.get('userId'),
      examId: parsedUrl.searchParams.get('examId'),
      eventId: parsedUrl.searchParams.get('eventId'),
      route: parsedUrl.searchParams.get('route') || '/student/proctor-splash',
      action: parsedUrl.pathname.replace('/', '')
    };
    
    console.log('📋 Parsed protocol URL:', protocolUrl);
    console.log('📋 Extracted parameters:', params);
    
    return params;
  } catch (error) {
    console.error('❌ Error parsing protocol URL:', error);
    return null;
  }
}

function handleProtocolUrl(url) {
  console.log('🔗 Handling protocol URL:', url);
  protocolUrl = url;
  
  const params = parseProtocolUrl(url);
  
  if (mainWindow && params) {
    mainWindow.webContents.send('protocol-url-received', params);
    
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    console.log('🔄 Second instance detected');
    
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
    
    const protocolUrl = commandLine.find(arg => arg.startsWith('examproc://'));
    if (protocolUrl) {
      handleProtocolUrl(protocolUrl);
    }
  });

  app.on('open-url', (event, url) => {
    console.log('🍎 macOS open-url event:', url);
    event.preventDefault();
    handleProtocolUrl(url);
  });

  app.whenReady().then(() => {
    createWindow();
    createMenu();
    
    if (process.platform === 'win32' || process.platform === 'linux') {
      const protocolUrl = process.argv.find(arg => arg.startsWith('examproc://'));
      if (protocolUrl) {
        console.log('🚀 App launched with protocol URL:', protocolUrl);
        handleProtocolUrl(protocolUrl);
      }
    }
  });
}

function createWindow() {
  console.log('🪟 Creating main window');
  
  // Get the icon path
  const iconPath = getIconPath();
  let appIcon = null;
  
  if (iconPath) {
    try {
      // Create native image from icon path
      appIcon = nativeImage.createFromPath(iconPath);
      
      // Resize icon if needed (optional - Electron usually handles this)
      if (!appIcon.isEmpty()) {
        // For Windows, you might want to resize to specific sizes
        if (process.platform === 'win32') {
          appIcon = appIcon.resize({ width: 256, height: 256 });
        }
        console.log('✅ Icon loaded successfully');
      } else {
        console.warn('⚠️ Icon file exists but could not be loaded as image');
        appIcon = null;
      }
    } catch (error) {
      console.error('❌ Error loading icon:', error);
      appIcon = null;
    }
  }
  
  const windowOptions = {
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
      allowRunningInsecureContent: false,
      experimentalFeatures: false
    },
    show: false,
    titleBarStyle: 'default',
    autoHideMenuBar: false
  };
  
  // Add icon only if we have one
  if (appIcon) {
    windowOptions.icon = appIcon;
  }
  
  mainWindow = new BrowserWindow(windowOptions);

  // Set app icon for dock/taskbar (macOS/Linux)
  if (appIcon && (process.platform === 'darwin' || process.platform === 'linux')) {
    app.dock?.setIcon(appIcon);
  }

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    const startUrl = process.env.ELECTRON_START_URL || url.format({
      pathname: path.join(__dirname, '../build/index.html'),
      protocol: 'file:',
      slashes: true
    });
    mainWindow.loadURL(startUrl);
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    if (protocolUrl) {
      const params = parseProtocolUrl(protocolUrl);
      if (params) {
        mainWindow.webContents.send('protocol-url-received', params);
      }
    }
    
    console.log('✅ Main window ready and visible');
  });

  mainWindow.on('closed', () => {
    if (proctorProcess) {
      proctorProcess.kill('SIGTERM');
      proctorProcess = null;
    }
    mainWindow = null;
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  closeUnwantedApps();
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            if (mainWindow) mainWindow.reload();
          }
        },
        {
          label: 'Force Reload',
          accelerator: 'CmdOrCtrl+Shift+R',
          click: () => {
            if (mainWindow) mainWindow.webContents.reloadIgnoringCache();
          }
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Ctrl+Shift+I',
          click: () => {
            if (mainWindow) mainWindow.webContents.toggleDevTools();
          }
        },
        { type: 'separator' },
        {
          label: 'Actual Size',
          accelerator: 'CmdOrCtrl+0',
          click: () => {
            if (mainWindow) mainWindow.webContents.setZoomLevel(0);
          }
        },
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+Plus',
          click: () => {
            if (mainWindow) {
              const currentZoom = mainWindow.webContents.getZoomLevel();
              mainWindow.webContents.setZoomLevel(currentZoom + 1);
            }
          }
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-',
          click: () => {
            if (mainWindow) {
              const currentZoom = mainWindow.webContents.getZoomLevel();
              mainWindow.webContents.setZoomLevel(currentZoom - 1);
            }
          }
        }
      ]
    }
  ];

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { label: 'About ' + app.getName(), role: 'about' },
        { type: 'separator' },
        { label: 'Services', role: 'services', submenu: [] },
        { type: 'separator' },
        { label: 'Hide ' + app.getName(), accelerator: 'Command+H', role: 'hide' },
        { label: 'Hide Others', accelerator: 'Command+Shift+H', role: 'hideothers' },
        { label: 'Show All', role: 'unhide' },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'Command+Q', click: () => app.quit() }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC handlers
ipcMain.handle('get-protocol-params', () => {
  if (protocolUrl) {
    return parseProtocolUrl(protocolUrl);
  }
  return null;
});

ipcMain.handle('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.handle('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle('window-close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle('dialog-open-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  return result;
});

ipcMain.handle('dialog-save-file', async (event, data) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    filters: [
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  return result;
});

ipcMain.handle('open-dev-tools', () => {
  if (mainWindow) mainWindow.webContents.openDevTools();
});

ipcMain.handle('start-exam', (event, examData) => {
  console.log('🎯 Starting exam:', examData);
  return { success: true, message: 'Exam started' };
});

ipcMain.handle('submit-exam', (event, examResults) => {
  console.log('📊 Submitting exam results:', examResults);
  return { success: true, message: 'Exam submitted' };
});

ipcMain.on('start-proctor-engine', (_event, params) => {
  if (proctorProcess) {
    safeSend('proctor-log', '⚠️ Proctor Engine already running.');
    return;
  }

  console.log('🚀 Starting proctor engine for:', params);
  launchProctorEngine(params);
});

ipcMain.handle('start-proctor-engine-async', async (_event, params) => {
  if (proctorProcess) {
    return { success: false, message: 'Proctor Engine already running.' };
  }

  try {
    launchProctorEngine(params);
    return { success: true, message: 'Proctor Engine started successfully.' };
  } catch (error) {
    return { success: false, message: `Failed to start proctor: ${error.message}` };
  }
});

ipcMain.handle('stop-proctor-engine-async', async () => {
  if (proctorProcess) {
    proctorProcess.kill('SIGINT');
    proctorProcess = null;
    return { success: true, message: 'Proctor Engine stopped.' };
  }
  return { success: false, message: 'Proctor Engine was not running.' };
});

ipcMain.on('renderer-message', (event, message) => {
  console.log('📨 Message from renderer:', message);
});

ipcMain.on('renderer-ready', () => {
  console.log('✅ Renderer process is ready');
});

app.on('window-all-closed', () => {
  if (proctorProcess) {
    proctorProcess.kill('SIGTERM');
    proctorProcess = null;
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});

app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
app.commandLine.appendSwitch('disk-cache-size', '0');

if (isDev) {
  console.log('📋 Development protocol registration result:', app.isDefaultProtocolClient('examproc'));
  console.log('🚀 Electron app ready - waiting for protocol calls...');
  console.log('💡 Test with: examproc://splash?userId=test&examId=test&eventId=test');
}