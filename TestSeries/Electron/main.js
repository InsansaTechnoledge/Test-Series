// const { app, BrowserWindow, ipcMain, dialog, shell, Menu, nativeImage } = require('electron');
// const { spawn, exec } = require('child_process');
// const path = require('path');
// const fs = require('fs');
// const readline = require('readline');
// const url = require('url');
// const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
// const QueueManager = require('./queueManager');
// const queue= new QueueManager();
 
// let mainWindow;
// let protocolUrl = null;
// let proctorProcess = null;
 
// // Function to get the correct icon path
// function getIconPath() {
//   const iconName = 'evalvo icon 2.png';
//   let iconPath;
 
//   if (isDev) {
//     // In development, look in assets folder
//     iconPath = path.join(__dirname, 'assets', iconName);
//   } else {
//     // In production, look in resources folder
//     iconPath = path.join(process.resourcesPath, 'assets', iconName);
//   }
 
//   // Fallback paths to try
//   const fallbackPaths = [
//     path.join(__dirname, 'assets', iconName),
//     path.join(__dirname, '..', 'assets', iconName),
//     path.join(__dirname, 'icons', iconName),
//     path.join(__dirname, iconName),
//     path.join(process.cwd(), 'assets', iconName),
//     path.join(process.cwd(), 'icons', iconName)
//   ];
 
//   // Check if the main path exists
//   if (fs.existsSync(iconPath)) {
//     console.log('✅ Icon found at:', iconPath);
//     return iconPath;
//   }
 
//   // Try fallback paths
//   for (const fallbackPath of fallbackPaths) {
//     if (fs.existsSync(fallbackPath)) {
//       console.log('✅ Icon found at fallback path:', fallbackPath);
//       return fallbackPath;
//     }
//   }
 
//   console.warn('⚠️ Icon not found. Checked paths:');
//   console.warn('  Primary:', iconPath);
//   fallbackPaths.forEach(p => console.warn('  Fallback:', p));
 
//   return null; // Return null if no icon found
// }

// function killProctorProcessWindows() {
//   if (proctorProcess && proctorProcess.pid) {
//     exec(`taskkill /PID ${proctorProcess.pid} /T /F`, (err, stdout, stderr) => {
//       if (err) {
//         console.error('❌ Error killing process:', err);
//       } else {
//         console.log('✅ Proctor process killed:', stdout);
//         proctorProcess = null;
//       }
//     });
//   }
// }
// // Register the custom protocol
// if (process.defaultApp) {
//   if (process.argv.length >= 2) {
//     app.setAsDefaultProtocolClient('examproc', process.execPath, [path.resolve(process.argv[1])]);
//   }
// } else {
//   app.setAsDefaultProtocolClient('examproc');
// }
 
// // Safe send function for proctor communication
// function safeSend(channel, data) {
//   if (mainWindow && !mainWindow.isDestroyed()) {
//     mainWindow.webContents.send(channel, data);
//   }
// }
 
//   const isWin = process.platform === 'win32';
// // // Function to get proctor engine binary path
// // function getBinaryPath() {

// //   const is64Bit = process.arch === 'x64';
// //   const binaryName = isWin ? 'proctor_engine.exe' : 'proctor_engine';
// //   console.log("Platform:", process.platform);
// // console.log("Architecture:", process.arch);
// //   let fullPath;
 
// //   if (isDev) {
// //     fullPath = path.join(__dirname, binaryName);
// //   } else {
// //     const platformDir = isWin ? 'win' : 'mac';
// //     const basePath = path.join(process.resourcesPath, 'bin', platformDir);
// //     fullPath = path.join(basePath, binaryName);
// //   }
 
// //   console.log("🛠️ Resolved binary path:", fullPath);
// //   console.log("🛠️ Current directory (__dirname):", __dirname);
// //   console.log("🛠️ isDev:", isDev);
 
// //   if (!fs.existsSync(fullPath)) {
// //     console.log("📁 Listing files in current directory:");
// //     try {
// //       const files = fs.readdirSync(__dirname);
// //       files.forEach(file => {
// //         const filePath = path.join(__dirname, file);
// //         const stats = fs.statSync(filePath);
// //         console.log(`  ${file} ${stats.isDirectory() ? '(dir)' : `(file, ${stats.size} bytes)`}`);
// //       });
// //     } catch (err) {
// //       console.error("❌ Error reading directory:", err);
// //     }
   
// //     throw new Error(`❌ Proctor Engine binary not found at: ${fullPath}`);
// //   }
 
// //   if (!isWin) {
// //     try {
// //       fs.accessSync(fullPath, fs.constants.F_OK | fs.constants.X_OK);
// //     } catch (err) {
// //       console.log("⚠️ Binary exists but may not be executable. Attempting to make it executable...");
// //       try {
// //         fs.chmodSync(fullPath, '755');
// //         console.log("✅ Made binary executable");
// //       } catch (chmodErr) {
// //         console.error("❌ Failed to make binary executable:", chmodErr);
// //         throw new Error(`❌ Proctor Engine binary is not executable: ${fullPath}`);
// //       }
// //     }
// //   }
 
// //   return fullPath;
// // }

// function getBinaryPath() {
//   const is64Bit = process.arch === 'x64';
//   const binaryName = isWin ? 'proctor_engine.exe' : 'proctor_engine'; // Set binary name based on platform
//   let binaryPath;

//   if (isDev) {
//     // In development, use the local path
//     binaryPath = path.join(__dirname, 'bin', isWin ? 'win' : 'mac', binaryName);
//   } else {
//     // In production, resolve the path based on resources
//     binaryPath = path.join(process.resourcesPath, 'bin', isWin ? 'win' : 'mac', binaryName);
//   }

//   console.log("🛠️ Resolved binary path:", binaryPath);

//   // Check if binary exists
//   if (!fs.existsSync(binaryPath)) {
//     console.log("📁 Listing files in current directory:");
//     const files = fs.readdirSync(__dirname);
//     files.forEach(file => {
//       const filePath = path.join(__dirname, file);
//       const stats = fs.statSync(filePath);
//       console.log(`  ${file} ${stats.isDirectory() ? '(dir)' : `(file, ${stats.size} bytes)`}`);
//     });
//     throw new Error(`❌ Proctor Engine binary not found at: ${binaryPath}`);
//   }

//   return binaryPath;
// }

 
// function launchProctorEngine(params) {
//   try {
//     const binaryPath = getBinaryPath();
   
//     const userId = params.userId;
//     const examId = params.examId;
//     const eventId = params.eventId || params.examId;
   
//     if (!userId || !examId) {
//       throw new Error(`❌ Missing required parameters. userId: ${userId}, examId: ${examId}`);
//     }
   
//     console.log('🚀 Launching proctor engine with params:', { userId, examId, eventId });
  

//     proctorProcess = spawn(binaryPath, [
//       '--user-id', userId,
//       '--exam-id', examId,
//       '--event-id', eventId
//     ], {
//       // cwd: path.dirname(binaryPath),
//       stdio: ['ignore', 'pipe', 'pipe'],
//       windowsHide: true,
//     });
 
//     const rl = readline.createInterface({ input: proctorProcess.stdout });
 
//     rl.on('line', (line) => {
//       console.log('📤 Raw output from proctor engine:', line);
     
//       try {
//         const parsed = JSON.parse(line);
//         console.log('📊 Parsed proctor data:', parsed);
       
//         if (parsed?.eventType === 'anomaly') {
          
//           if(parsed?.image && fs.existsSync(parsed.image)){
//             const imageBuffer = fs.readFileSync(parsed.image);
//             parsed.imageBase = `data:image/jpg;base64,${imageBuffer.toString('base64')}`;
//             delete parsed.image;
//           } 
//           console.log('📸 Anomaly detected:', parsed);

//         queue.addEvent(parsed);

//           safeSend('proctor-warning', parsed);
//         } else {
//           safeSend('proctor-event', parsed);
//         }
//       } catch (parseError) {
//         console.log('📝 Non-JSON output from proctor:', line);
//         safeSend('proctor-log', line);
//       }
//     });
 
//     proctorProcess.stderr.on('data', (data) => {
//       console.error('❌ Proctor engine stderr:', data.toString());
//       safeSend('proctor-log', `❌ ERROR: ${data}`);
//     });
 
//     proctorProcess.on('exit', (code) => {
//       console.log(`🛑 Proctor Engine exited with code ${code}`);
//       safeSend('proctor-log', `🛑 Proctor Engine exited with code ${code}`);
//       proctorProcess = null;
//     });
 
//     proctorProcess.on('error', (err) => {
//       console.error('❌ Proctor process error:', err);
//       safeSend('proctor-log', `❌ Failed to start engine: ${err.message}`);
//       proctorProcess = null;
//     });
 
//     console.log('✅ Proctor engine launched successfully');
//   } catch (error) {
//     console.error('❌ Error launching proctor engine:', error);
//     safeSend('proctor-log', `❌ Failed to launch proctor: ${error.message}`);
//   }
// }
 
 
 
 
// function closeUnwantedApps() {
//   const platform = process.platform;
//   console.log('🔒 Platform detected:', platform);
// }
 
// function parseProtocolUrl(protocolUrl) {
//   try {
//     const parsedUrl = new URL(protocolUrl);
//     const params = {
//       userId: parsedUrl.searchParams.get('userId'),
//       examId: parsedUrl.searchParams.get('examId'),
//       eventId: parsedUrl.searchParams.get('eventId'),
//       route: parsedUrl.searchParams.get('route') || '/student/proctor-splash',
//       action: parsedUrl.pathname.replace('/', '')
//     };
   
//     console.log('📋 Parsed protocol URL:', protocolUrl);
//     console.log('📋 Extracted parameters:', params);
   
//     return params;
//   } catch (error) {
//     console.error('❌ Error parsing protocol URL:', error);
//     return null;
//   }
// }
 
// function handleProtocolUrl(url) {
//   console.log('🔗 Handling protocol URL:', url);
//   protocolUrl = url;
 
//   const params = parseProtocolUrl(url);
 
//   if (mainWindow && params) {
//     mainWindow.webContents.send('protocol-url-received', params);
   
//     if (mainWindow.isMinimized()) mainWindow.restore();
//     mainWindow.focus();
//   }
// }
 
// const gotTheLock = app.requestSingleInstanceLock();
 
// if (!gotTheLock) {
//   app.quit();
// } else {
//   app.on('second-instance', (event, commandLine, workingDirectory) => {
//     console.log('🔄 Second instance detected');
   
//     if (mainWindow) {
//       if (mainWindow.isMinimized()) mainWindow.restore();
//       mainWindow.focus();
//     }
   
//     const protocolUrl = commandLine.find(arg => arg.startsWith('examproc://'));
//     if (protocolUrl) {
//       handleProtocolUrl(protocolUrl);
//     }
//   });
 
//   app.on('open-url', (event, url) => {
//     console.log('🍎 macOS open-url event:', url);
//     event.preventDefault();
//     handleProtocolUrl(url);
//   });
 
//   app.whenReady().then(() => {
//     createWindow();
//     createMenu();
   
//     if (process.platform === 'win32' || process.platform === 'linux') {
//       const protocolUrl = process.argv.find(arg => arg.startsWith('examproc://'));
//       if (protocolUrl) {
//         console.log('🚀 App launched with protocol URL:', protocolUrl);
//         handleProtocolUrl(protocolUrl);
//       }
//     }
//   });
// }
 
// function createWindow() {
//   console.log('🪟 Creating main window');
 
//   // Get the icon path
//   const iconPath = getIconPath();
//   let appIcon = null;
 
//   if (iconPath) {
//     try {
//       // Create native image from icon path
//       appIcon = nativeImage.createFromPath(iconPath);
     
//       // Resize icon if needed (optional - Electron usually handles this)
//       if (!appIcon.isEmpty()) {
//         // For Windows, you might want to resize to specific sizes
//         if (process.platform === 'win32') {
//           appIcon = appIcon.resize({ width: 256, height: 256 });
//         }
//         console.log('✅ Icon loaded successfully');
//       } else {
//         console.warn('⚠️ Icon file exists but could not be loaded as image');
//         appIcon = null;
//       }
//     } catch (error) {
//       console.error('❌ Error loading icon:', error);
//       appIcon = null;
//     }
//   }
 
//   const windowOptions = {
//     width: 1400,
//     height: 900,
//     minWidth: 800,
//     minHeight: 600,
//     // fullscreen: true,
//     webPreferences: {
//       nodeIntegration: false,
//       contextIsolation: true,
//       preload: path.join(__dirname, 'preload.js'),
//       webSecurity: true,
//       allowRunningInsecureContent: false,
//       experimentalFeatures: false
//     },
//     show: false,
//     titleBarStyle: 'default',
//     autoHideMenuBar: false
//   };
 
//   // Add icon only if we have one
//   if (appIcon) {
//     windowOptions.icon = appIcon;
//   }
 
//   mainWindow = new BrowserWindow(windowOptions);
 
//   // Set app icon for dock/taskbar (macOS/Linux)
//   if (appIcon && (process.platform === 'darwin' || process.platform === 'linux')) {
//     app.dock?.setIcon(appIcon);
//   }
 
//   // FIXED: Better content loading logic
//   if (isDev) {
//     // Development mode - try to load from local server or create a simple HTML page
//     const devUrl = 'http://localhost:5173';
   
//     console.log('🔧 Development mode detected, trying to load:', devUrl);
   
//     // Try to load from dev server, if it fails, create a simple HTML page
//     mainWindow.loadURL(devUrl).catch((error) => {
//       console.warn('⚠️ Could not load dev server, creating fallback HTML:', error.message);
//       createFallbackHTML();
//     });
   
//     // Open dev tools in development
//     // mainWindow.webContents.openDevTools();
//   } else {
//     // Production mode - load from build folder or create fallback
//     const indexPath = path.join(__dirname, 'dist', 'index.html');
//     const startUrl = url.format({
//       pathname: indexPath,
//       protocol: 'file:',
//       slashes: true
//     });
   
//     console.log('🏗️ Production mode, trying to load:', startUrl);
   
//     if (fs.existsSync(indexPath)) {
//       mainWindow.loadURL(startUrl);
//     } else {
//       console.warn('⚠️ Build files not found, creating fallback HTML');
//       createFallbackHTML();
//     }
//   }
 
//   // Function to create a fallback HTML page
//   function createFallbackHTML() {
//     const fallbackHTML = `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Evalvo Proctor</title>
//       <style>
//         body {
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           color: white;
//           margin: 0;
//           padding: 0;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           min-height: 100vh;
//         }
//         .container {
//           text-align: center;
//           background: rgba(255, 255, 255, 0.1);
//           backdrop-filter: blur(10px);
//           border-radius: 20px;
//           padding: 40px;
//           box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           max-width: 600px;
//         }
//         h1 {
//           font-size: 2.5em;
//           margin-bottom: 20px;
//           background: linear-gradient(45deg, #fff, #e0e0e0);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//         }
//         .status {
//           font-size: 1.2em;
//           margin: 20px 0;
//           padding: 15px;
//           background: rgba(255, 255, 255, 0.1);
//           border-radius: 10px;
//           border: 1px solid rgba(255, 255, 255, 0.2);
//         }
//         .info {
//           margin: 15px 0;
//           padding: 10px;
//           background: rgba(0, 255, 150, 0.1);
//           border-radius: 8px;
//           border-left: 4px solid #00ff96;
//         }
//         .protocol-test {
//           margin-top: 30px;
//           padding: 20px;
//           background: rgba(255, 255, 255, 0.05);
//           border-radius: 10px;
//         }
//         button {
//           background: linear-gradient(45deg, #00ff96, #00cc7a);
//           border: none;
//           color: white;
//           padding: 12px 24px;
//           font-size: 16px;
//           border-radius: 8px;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           margin: 10px;
//         }
//         button:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 5px 15px rgba(0, 255, 150, 0.3);
//         }
//         .dev-tools {
//           margin-top: 20px;
//         }
//         code {
//           background: rgba(0, 0, 0, 0.3);
//           padding: 2px 6px;
//           border-radius: 4px;
//           font-family: 'Courier New', monospace;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <h1>🛡️ Evalvo Proctor</h1>
//         <div class="status">
//           ✅ Application is running successfully on Windows
//         </div>
       
//         <div class="info">
//           <strong>Platform:</strong> ${process.platform}<br>
//           <strong>Environment:</strong> ${isDev ? 'Development' : 'Production'}<br>
//           <strong>Version:</strong> Electron ${process.versions.electron}
//         </div>
 
//         <div class="protocol-test">
//           <h3>Protocol Test</h3>
//           <p>Test the examproc:// protocol:</p>
//           <code>examproc://splash?userId=test&examId=exam123&eventId=event456</code>
//           <br><br>
//           <button onclick="testProtocol()">Test Protocol</button>
//           <button onclick="openExternal()">Open External Link</button>
//         </div>
 
//         ${isDev ? `
//         <div class="dev-tools">
//           <h3>Development Tools</h3>
//           <button onclick="openDevTools()">Open DevTools</button>
//           <button onclick="reloadApp()">Reload App</button>
//         </div>
//         ` : ''}
 
//         <div id="protocol-status"></div>
//       </div>
 
//       <script>
//         // Protocol URL handling
//         if (window.electronAPI) {
//           window.electronAPI.onProtocolUrlReceived((event, params) => {
//             const statusDiv = document.getElementById('protocol-status');
//             statusDiv.innerHTML = \`
//               <div style="margin-top: 20px; padding: 15px; background: rgba(0, 255, 150, 0.2); border-radius: 8px;">
//                 <strong>Protocol URL Received!</strong><br>
//                 User ID: \${params.userId}<br>
//                 Exam ID: \${params.examId}<br>
//                 Event ID: \${params.eventId}<br>
//                 Route: \${params.route}
//               </div>
//             \`;
//           });
 
//           // Send ready signal
//           window.electronAPI.rendererReady();
//         }
 
//         function testProtocol() {
//           const testUrl = 'examproc://splash?userId=testUser&examId=testExam&eventId=testEvent';
//           if (window.electronAPI) {
//             window.electronAPI.sendMessage(\`Testing protocol: \${testUrl}\`);
//           }
//           alert('Protocol test initiated! Check the status below.');
//         }
 
//         function openExternal() {
//           window.open('https://www.evalvo.com', '_blank');
//         }
 
//         ${isDev ? `
//         function openDevTools() {
//           if (window.electronAPI) {
//             window.electronAPI.openDevTools();
//           }
//         }
 
//         function reloadApp() {
//           location.reload();
//         }
//         ` : ''}
 
//         console.log('Evalvo Proctor App Loaded Successfully');
//         console.log('Platform:', '${process.platform}');
//         console.log('Environment:', '${isDev ? 'Development' : 'Production'}');
//       </script>
//     </body>
//     </html>
//     `;
 
//     // Write fallback HTML to a temporary file and load it
//     const tempHtmlPath = path.join(__dirname, 'temp_index.html');
//     fs.writeFileSync(tempHtmlPath, fallbackHTML);
   
//     const fallbackUrl = url.format({
//       pathname: tempHtmlPath,
//       protocol: 'file:',
//       slashes: true
//     });
   
//     mainWindow.loadURL(fallbackUrl);
   
//     // Clean up temp file after loading
//     setTimeout(() => {
//       try {
//         if (fs.existsSync(tempHtmlPath)) {
//           fs.unlinkSync(tempHtmlPath);
//         }
//       } catch (err) {
//         console.warn('Could not clean up temp HTML file:', err);
//       }
//     }, 5000);
//   }
 
//   mainWindow.once('ready-to-show', () => {
//     mainWindow.show();
   
//     if (protocolUrl) {
//       const params = parseProtocolUrl(protocolUrl);
//       if (params) {
//         mainWindow.webContents.send('protocol-url-received', params);
//       }
//     }
   
//     console.log('✅ Main window ready and visible');
//   });
 
//   mainWindow.on('closed', () => {
//     if (proctorProcess) {
//       if(isWin){
//         killProctorProcessWindows();
//       }
//       else
//       proctorProcess.kill('SIGTERM');
//       proctorProcess = null;
//     }
//     mainWindow = null;
//   });
 
//   mainWindow.webContents.setWindowOpenHandler(({ url }) => {
//     shell.openExternal(url);
//     return { action: 'deny' };
//   });
 
//   closeUnwantedApps();
// }
 
// function createMenu() {
//   const template = [
//     {
//       label: 'File',
//       submenu: [
//         {
//           label: 'Reload',
//           accelerator: 'CmdOrCtrl+R',
//           click: () => {
//             if (mainWindow) mainWindow.reload();
//           }
//         },
//         {
//           label: 'Force Reload',
//           accelerator: 'CmdOrCtrl+Shift+R',
//           click: () => {
//             if (mainWindow) mainWindow.webContents.reloadIgnoringCache();
//           }
//         },
//         { type: 'separator' },
//         {
//           label: 'Quit',
//           accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
//           click: () => {
//             app.quit();
//           }
//         }
//       ]
//     },
//     {
//       label: 'View',
//       submenu: [
//         {
//           label: 'Toggle Developer Tools',
//           accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Ctrl+Shift+I',
//           click: () => {
//             if (mainWindow) mainWindow.webContents.toggleDevTools();
//           }
//         },
//         { type: 'separator' },
//         {
//           label: 'Actual Size',
//           accelerator: 'CmdOrCtrl+0',
//           click: () => {
//             if (mainWindow) mainWindow.webContents.setZoomLevel(0);
//           }
//         },
//         {
//           label: 'Zoom In',
//           accelerator: 'CmdOrCtrl+Plus',
//           click: () => {
//             if (mainWindow) {
//               const currentZoom = mainWindow.webContents.getZoomLevel();
//               mainWindow.webContents.setZoomLevel(currentZoom + 1);
//             }
//           }
//         },
//         {
//           label: 'Zoom Out',
//           accelerator: 'CmdOrCtrl+-',
//           click: () => {
//             if (mainWindow) {
//               const currentZoom = mainWindow.webContents.getZoomLevel();
//               mainWindow.webContents.setZoomLevel(currentZoom - 1);
//             }
//           }
//         }
//       ]
//     }
//   ];
 
//   if (process.platform === 'darwin') {
//     template.unshift({
//       label: app.getName(),
//       submenu: [
//         { label: 'About ' + app.getName(), role: 'about' },
//         { type: 'separator' },
//         { label: 'Services', role: 'services', submenu: [] },
//         { type: 'separator' },
//         { label: 'Hide ' + app.getName(), accelerator: 'Command+H', role: 'hide' },
//         { label: 'Hide Others', accelerator: 'Command+Shift+H', role: 'hideothers' },
//         { label: 'Show All', role: 'unhide' },
//         { type: 'separator' },
//         { label: 'Quit', accelerator: 'Command+Q', click: () => app.quit() }
//       ]
//     });
//   }
 
//   const menu = Menu.buildFromTemplate(template);
//   Menu.setApplicationMenu(menu);
// }
 
// // IPC handlers
// ipcMain.handle('get-protocol-params', () => {
//   if (protocolUrl) {
//     return parseProtocolUrl(protocolUrl);
//   }
//   return null;
// });

// let deeplinkURL = null;

// ipcMain.handle('get-url-params', () => {
//   if (!deeplinkURL) return null;

//   try {
//     const parsedUrl = new URL(deeplinkURL);
//     const params = Object.fromEntries(parsedUrl.searchParams.entries());
//     return params;
//   } catch (err) {
//     return null;
//   }
// });

 
// ipcMain.handle('window-minimize', () => {
//   if (mainWindow) mainWindow.minimize();
// });
 
// ipcMain.handle('window-maximize', () => {
//   if (mainWindow) {
//     if (mainWindow.isMaximized()) {
//       mainWindow.unmaximize();
//     } else {
//       mainWindow.maximize();
//     }
//   }
// });
 
// ipcMain.handle('window-close', () => {
//   if (mainWindow) mainWindow.close();
// });
 
// ipcMain.handle('dialog-open-file', async () => {
//   const result = await dialog.showOpenDialog(mainWindow, {
//     properties: ['openFile'],
//     filters: [
//       { name: 'All Files', extensions: ['*'] }
//     ]
//   });
//   return result;
// });
 
// ipcMain.handle('dialog-save-file', async (event, data) => {
//   const result = await dialog.showSaveDialog(mainWindow, {
//     filters: [
//       { name: 'All Files', extensions: ['*'] }
//     ]
//   });
//   return result;
// });
 
// ipcMain.handle('open-dev-tools', () => {
//   if (mainWindow) mainWindow.webContents.openDevTools();
// });
 
// ipcMain.handle('start-exam', (event, examData) => {
//   console.log('🎯 Starting exam:', examData);
//   return { success: true, message: 'Exam started' };
// });
 
// ipcMain.handle('submit-exam', (event, examResults) => {
//   console.log('📊 Submitting exam results:', examResults);
//   return { success: true, message: 'Exam submitted' };
// });
 
// ipcMain.on('start-proctor-engine', (_event, params) => {
//   console.log('🔧 Received request to start proctor engine with params:', params);
//   if (proctorProcess) {
//     safeSend('proctor-log', '⚠️ Proctor Engine already running.');
//     return;
//   }
 
//   console.log('🚀 Starting proctor engine for:', params);
//   launchProctorEngine(params);
// });
 
// ipcMain.handle('start-proctor-engine-async', async (_event, params) => {
//   console.log('🔧 Received async request to start proctor engine with params:', params);
//   if (proctorProcess) {
//     return { success: false, message: 'Proctor Engine already running.' };
//   }
 
//   try {
//     launchProctorEngine(params);
//     return { success: true, message: 'Proctor Engine started successfully.' };
//   } catch (error) {
//     return { success: false, message: `Failed to start proctor: ${error.message}` };
//   }
// });
 
 
// ipcMain.handle('stop-proctor-engine-async', async () => {
//   if (proctorProcess) {
//     if (isWin) {
//       killProctorProcessWindows();
//     }
//     else
//     proctorProcess.kill('SIGTERM');
//     proctorProcess = null;
//     return { success: true, message: 'Proctor Engine stopped.' };
//   }
//   return { success: false, message: 'Proctor Engine was not running.' };
// });

// ipcMain.handle('stop-proctor-engine', () => {

//   if (proctorProcess) {
//     if (isWin) {
//       killProctorProcessWindows();
//     } else {
//       proctorProcess.kill('SIGTERM');
//     }
//     proctorProcess = null;
//     return { success: true, message: 'Proctor Engine stopped.' };
//   }
//   return { success: false, message: 'Proctor Engine was not running.' };
// });
 
// ipcMain.on('renderer-message', (event, message) => {
//   console.log('📨 Message from renderer:', message);
// });
 
// ipcMain.on('renderer-ready', () => {
//   console.log('✅ Renderer process is ready');
// });
 
// app.on('window-all-closed', () => {
//   if (proctorProcess) {
//     if(isWin){
//       killProctorProcessWindows();
//     }
//     else
//     proctorProcess.kill('SIGTERM');
//     proctorProcess = null;
//   }
 
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
//   app.quit();
// });
 
// app.on('activate', () => {
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow();
//   }
// });
 
// app.on('web-contents-created', (event, contents) => {
//   contents.on('new-window', (event, navigationUrl) => {
//     event.preventDefault();
//     shell.openExternal(navigationUrl);
//   });
// });
 
// app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
// app.commandLine.appendSwitch('disk-cache-size', '0');
 
// if (isDev) {
//   console.log('📋 Development protocol registration result:', app.isDefaultProtocolClient('examproc'));
//   console.log('🚀 Electron app ready - waiting for protocol calls...');
//   console.log('💡 Test with: examproc://splash?userId=test&examId=test&eventId=test');
// }
 
const { app, BrowserWindow, ipcMain, dialog, shell, Menu, nativeImage } = require('electron');
const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const readline = require('readline');
const url = require('url');
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
const QueueManager = require('./queueManager');
const queue = new QueueManager();

let mainWindow;
let protocolUrl = null;
let proctorProcess = null;

// Function to get the correct icon path
function getIconPath() {
  const iconName = 'evalvo icon 2.png'; // Remove spaces from filename
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

function killProctorProcessWindows() {
  if (proctorProcess && proctorProcess.pid) {
    exec(`taskkill /PID ${proctorProcess.pid} /T /F`, (err, stdout, stderr) => {
      if (err) {
        console.error('❌ Error killing process:', err);
      } else {
        console.log('✅ Proctor process killed:', stdout);
        proctorProcess = null;
      }
    });
  }
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

const isWin = process.platform === 'win32';

function getBinaryPath() {
  const is64Bit = process.arch === 'x64';
  const binaryName = isWin ? 'proctor_engine.exe' : 'proctor_engine';
  let binaryPath;

  if (isDev) {
    // In development, use the local path
    binaryPath = path.join(__dirname, 'bin', isWin ? 'win' : 'mac', binaryName);
  } else {
    // In production, resolve the path based on resources
    binaryPath = path.join(process.resourcesPath, 'bin', isWin ? 'win' : 'mac', binaryName);
  }

  console.log("🛠️ Resolved binary path:", binaryPath);

  // Check if binary exists
  if (!fs.existsSync(binaryPath)) {
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
    throw new Error(`❌ Proctor Engine binary not found at: ${binaryPath}`);
  }

  return binaryPath;
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
          if (parsed?.image && fs.existsSync(parsed.image)) {
            const imageBuffer = fs.readFileSync(parsed.image);
            parsed.imageBase = `data:image/jpg;base64,${imageBuffer.toString('base64')}`;
            delete parsed.image;
          }
          console.log('📸 Anomaly detected:', parsed);
          queue.addEvent(parsed);
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

// Fixed function to find React build files
function findReactBuildPath() {
  const possiblePaths = [
    // Standard React build locations
    // path.join(__dirname, 'build', 'index.html'),
    // path.join(__dirname, 'dist', 'index.html'),
    // path.join(__dirname, '..', 'build', 'index.html'),
    // path.join(__dirname, '..', 'dist', 'index.html'),
    // If build is in resources
    // path.join(process.resourcesPath, 'build', 'index.html'),
    // path.join(process.resourcesPath, 'dist', 'index.html'),
    // If build is in app.asar
    // path.join(__dirname, '..', '..', 'build', 'index.html'),
    // path.join(__dirname, '..', '..', 'dist', 'index.html')

    path.join(__dirname, 'dist', 'dist', 'index.html'),  
    path.join(__dirname, 'dist', 'index.html'),  

    // If build is inside app.asar
    path.join(process.resourcesPath, 'dist', 'dist', 'index.html')
  ];

  console.log('🔍 Searching for React build files...');
  
  for (const buildPath of possiblePaths) {
    console.log(`  Checking: ${buildPath}`);
    if (fs.existsSync(buildPath)) {
      console.log(`✅ Found React build at: ${buildPath}`);
      return buildPath;
    }
  }
  
  console.warn('⚠️ React build files not found in any of the expected locations');
  return null;
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
    if (app.dock) {
      app.dock.setIcon(appIcon);
    }
  }

  // Improved content loading logic
  if (isDev) {
    // Development mode - try to load from local server
    const devUrl = 'http://localhost:5173';
    
    console.log('🔧 Development mode detected, trying to load:', devUrl);
    
    mainWindow.loadURL(devUrl).catch((error) => {
      console.warn('⚠️ Could not load dev server, creating fallback HTML:', error.message);
      createAndLoadFallbackHTML();
    });
  } else {
    // Production mode - find and load React build
    const buildPath = findReactBuildPath();
    
    if (buildPath) {
      const startUrl = url.format({
        pathname: buildPath,
        protocol: 'file:',
        slashes: true
      });
      
      console.log('🏗️ Production mode, loading:', startUrl);
      
      mainWindow.loadURL(startUrl).catch((error) => {
        console.error('❌ Failed to load build file:', error);
        createAndLoadFallbackHTML(buildPath);
      });
    } else {
      console.warn('⚠️ Build files not found, creating fallback HTML');
      createAndLoadFallbackHTML(buildPath);
    }
  }

  // Function to create and load fallback HTML
  function createAndLoadFallbackHTML(buildPath) {
    const fallbackHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Evalvo Proctor</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }
        .container {
          text-align: center;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
          max-width: 600px;
        }
        h1 {
          font-size: 2.5em;
          margin-bottom: 20px;
          background: linear-gradient(45deg, #fff, #e0e0e0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .status {
          font-size: 1.2em;
          margin: 20px 0;
          padding: 15px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .info {
          margin: 15px 0;
          padding: 10px;
          background: rgba(0, 255, 150, 0.1);
          border-radius: 8px;
          border-left: 4px solid #00ff96;
        }
        .error {
          margin: 15px 0;
          padding: 10px;
          background: rgba(255, 100, 100, 0.1);
          border-radius: 8px;
          border-left: 4px solid #ff6464;
        }
        .protocol-test {
          margin-top: 30px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        button {
          background: linear-gradient(45deg, #00ff96, #00cc7a);
          border: none;
          color: white;
          padding: 12px 24px;
          font-size: 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin: 10px;
        }
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 255, 150, 0.3);
        }
        .dev-tools {
          margin-top: 20px;
        }
        code {
          background: rgba(0, 0, 0, 0.3);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🛡️ Evalvo Proctor</h1>
        
        ${!isDev ? `
        <div class="error">
          ⚠️ React build files not found. Please ensure your React app is built and placed in the correct directory.
        </div>
        ` : ''}
        
        <div class="status">
          ✅ Application is running successfully
        </div>
        
        <div class="info">
          <strong>Path:</strong> ${buildPath || 'N/A'}<br>
          <strong>Platform:</strong> ${process.platform}<br>
          <strong>Environment:</strong> ${isDev ? 'Development' : 'Production'}<br>
          <strong>Version:</strong> Electron ${process.versions.electron}<br>
          <strong>App Packaged:</strong> ${app.isPackaged ? 'Yes' : 'No'}
        </div>

        <div class="protocol-test">
          <h3>Protocol Test</h3>
          <p>Test the examproc:// protocol:</p>
          <code>examproc://splash?userId=test&examId=exam123&eventId=event456</code>
          <br><br>
          <button onclick="testProtocol()">Test Protocol</button>
          <button onclick="openExternal()">Open External Link</button>
        </div>

        ${isDev ? `
        <div class="dev-tools">
          <h3>Development Tools</h3>
          <button onclick="openDevTools()">Open DevTools</button>
          <button onclick="reloadApp()">Reload App</button>
        </div>
        ` : ''}

        <div id="protocol-status"></div>
      </div>

      <script>
        // Protocol URL handling
        if (window.electronAPI) {
          window.electronAPI.onProtocolUrlReceived((event, params) => {
            const statusDiv = document.getElementById('protocol-status');
            statusDiv.innerHTML = \`
              <div style="margin-top: 20px; padding: 15px; background: rgba(0, 255, 150, 0.2); border-radius: 8px;">
                <strong>Protocol URL Received!</strong><br>
                User ID: \${params.userId}<br>
                Exam ID: \${params.examId}<br>
                Event ID: \${params.eventId}<br>
                Route: \${params.route}
              </div>
            \`;
          });

          // Send ready signal
          window.electronAPI.rendererReady();
        }

        function testProtocol() {
          const testUrl = 'examproc://splash?userId=testUser&examId=testExam&eventId=testEvent';
          if (window.electronAPI) {
            window.electronAPI.sendMessage(\`Testing protocol: \${testUrl}\`);
          }
          alert('Protocol test initiated! Check the status below.');
        }

        function openExternal() {
          if (window.electronAPI) {
            window.electronAPI.openExternal('https://www.evalvo.com');
          } else {
            window.open('https://www.evalvo.com', '_blank');
          }
        }

        ${isDev ? `
        function openDevTools() {
          if (window.electronAPI) {
            window.electronAPI.openDevTools();
          }
        }

        function reloadApp() {
          location.reload();
        }
        ` : ''}

        console.log('Evalvo Proctor App Loaded Successfully');
        console.log('Platform:', '${process.platform}');
        console.log('Environment:', '${isDev ? 'Development' : 'Production'}');
        console.log('App Packaged:', ${app.isPackaged});
      </script>
    </body>
    </html>
    `;

    // Create a temporary HTML file in a writable directory
    const tempDir = isDev ? __dirname : path.join(process.cwd());
    const tempHtmlPath = path.join(tempDir, 'temp_index.html');
    
    try {
      fs.writeFileSync(tempHtmlPath, fallbackHTML);
      
      const fallbackUrl = url.format({
        pathname: tempHtmlPath,
        protocol: 'file:',
        slashes: true
      });
      
      console.log('📄 Loading fallback HTML from:', fallbackUrl);
      
      mainWindow.loadURL(fallbackUrl).then(() => {
        console.log('✅ Fallback HTML loaded successfully');
      }).catch((error) => {
        console.error('❌ Failed to load fallback HTML:', error);
      });
      
      // Clean up temp file after loading
      setTimeout(() => {
        try {
          if (fs.existsSync(tempHtmlPath)) {
            fs.unlinkSync(tempHtmlPath);
            console.log('🧹 Cleaned up temporary HTML file');
          }
        } catch (err) {
          console.warn('Could not clean up temp HTML file:', err);
        }
      }, 10000); // Increased timeout to 10 seconds
      
    } catch (error) {
      console.error('❌ Failed to create fallback HTML:', error);
      // Last resort - load a data URL
      const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(fallbackHTML)}`;
      mainWindow.loadURL(dataUrl);
    }
  }

  // Add error handling for window load failures
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('❌ Window failed to load:', {
      errorCode,
      errorDescription,
      validatedURL
    });
    
    // Try to load fallback HTML if main content fails
    if (!validatedURL.includes('temp_index.html') && !validatedURL.startsWith('data:')) {
      console.log('🔄 Attempting to load fallback HTML due to load failure');
      createAndLoadFallbackHTML();
    }
  });

  mainWindow.once('ready-to-show', () => {
    console.log('✅ Window ready to show');
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
      if (isWin) {
        killProctorProcessWindows();
      } else {
        proctorProcess.kill('SIGTERM');
      }
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

let deeplinkURL = null;

ipcMain.handle('get-url-params', () => {
  if (!deeplinkURL) return null;

  try {
    const parsedUrl = new URL(deeplinkURL);
    const params = Object.fromEntries(parsedUrl.searchParams.entries());
    return params;
  } catch (err) {
    return null;
  }
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

ipcMain.handle('open-external', (event, url) => {
  shell.openExternal(url);
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
  console.log('🔧 Received request to start proctor engine with params:', params);
  if (proctorProcess) {
    safeSend('proctor-log', '⚠️ Proctor Engine already running.');
    return;
  }

  console.log('🚀 Starting proctor engine for:', params);
  launchProctorEngine(params);
});

ipcMain.handle('start-proctor-engine-async', async (_event, params) => {
  console.log('🔧 Received async request to start proctor engine with params:', params);
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
    if (isWin) {
      killProctorProcessWindows();
    } else {
      proctorProcess.kill('SIGTERM');
    }
    proctorProcess = null;
    return { success: true, message: 'Proctor Engine stopped.' };
  }
  return { success: false, message: 'Proctor Engine was not running.' };
});

ipcMain.handle('stop-proctor-engine', () => {
  if (proctorProcess) {
    if (isWin) {
      killProctorProcessWindows();
    } else {
      proctorProcess.kill('SIGTERM');
    }
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
    if (isWin) {
      killProctorProcessWindows();
    } else {
      proctorProcess.kill('SIGTERM');
    }
    proctorProcess = null;
  }

  if (process.platform !== 'darwin') {
    app.quit();
  }
  app.quit();
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