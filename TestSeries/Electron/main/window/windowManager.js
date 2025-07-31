const { BrowserWindow, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const url = require('url');
const IconManager = require('./iconManager');
const PathResolver = require('../utils/pathResolver');
const PlatformUtils = require('../utils/platformUtils');
const { isDev, APP_CONFIG } = require('../utils/constants');

class WindowManager {
  constructor() {
    this.mainWindow = null;
  }

  createWindow() {
    console.log('🪟 Creating main window');

    const appIcon = IconManager.loadAppIcon();

    const windowOptions = {
      width: APP_CONFIG.WINDOW.WIDTH,
      height: APP_CONFIG.WINDOW.HEIGHT,
      minWidth: APP_CONFIG.WINDOW.MIN_WIDTH,
      minHeight: APP_CONFIG.WINDOW.MIN_HEIGHT,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '..', '..', 'preload.js'),
        webSecurity: true,
        allowRunningInsecureContent: false,
        experimentalFeatures: false
      },
      show: false,
      titleBarStyle: 'default',
      autoHideMenuBar: false
    };

    if (appIcon) {
      windowOptions.icon = appIcon;
    }

    this.mainWindow = new BrowserWindow(windowOptions);

    IconManager.setDockIcon(appIcon);

    this.loadContent();
    this.setupEventHandlers();

    return this.mainWindow;
  }

  /**
   * Load window content (dev server or production build)
   */
  loadContent() {
    if (isDev) {
      this.loadDevContent();
    } else {
      this.loadProductionContent();
    }
  }

  /**
   * Load content in development mode
   */
  loadDevContent() {
    const devUrl = APP_CONFIG.DEV_SERVER.URL;
    
    console.log('🔧 Development mode detected, trying to load:', devUrl);
    
    this.mainWindow.loadURL(devUrl).catch((error) => {
      console.warn('⚠️ Could not load dev server, creating fallback HTML:', error.message);
      this.createAndLoadFallbackHTML();
    });
  }

  /**
   * Load content in production mode
   */
  loadProductionContent() {
    const buildPath = PathResolver.findReactBuildPath();
    
    if (buildPath) {
      const startUrl = url.format({
        pathname: buildPath,
        protocol: 'file:',
        slashes: true
      });
      
      console.log('🏗️ Production mode, loading:', startUrl);
      
      this.mainWindow.loadURL(startUrl).catch((error) => {
        console.error('❌ Failed to load build file:', error);
        console.log('🔄 Trying direct file load...');
        
        this.mainWindow.loadFile(buildPath).catch((fileError) => {
          console.error('❌ Failed to load with loadFile:', fileError);
          this.createAndLoadFallbackHTML(buildPath, error, fileError);
        });
      });
    } else {
      console.warn('⚠️ Build files not found, creating fallback HTML');
      this.createAndLoadFallbackHTML(null);
    }
  }

  /**
   * Create and load fallback HTML with debugging information
   */
  createAndLoadFallbackHTML(attemptedBuildPath, loadUrlError, loadFileError) {
    const debugInfo = global.buildDebugInfo || {};
    
    const fallbackHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Evalvo Proctor - Debug Mode</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          margin: 0;
          padding: 20px;
          min-height: 100vh;
        }
        .container {
          max-width: 1000px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        h1 {
          font-size: 2.5em;
          margin-bottom: 20px;
          background: linear-gradient(45deg, #fff, #e0e0e0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-align: center;
        }
        .debug-section {
          margin: 20px 0;
          padding: 20px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          border-left: 4px solid #00ff96;
        }
        .error-section {
          margin: 20px 0;
          padding: 20px;
          background: rgba(255, 100, 100, 0.1);
          border-radius: 10px;
          border-left: 4px solid #ff6464;
        }
        .path-item {
          margin: 10px 0;
          padding: 10px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 5px;
          font-family: monospace;
          font-size: 12px;
        }
        .exists-true { border-left: 3px solid #00ff96; }
        .exists-false { border-left: 3px solid #ff6464; }
        .exists-assumed { border-left: 3px solid #ffaa00; }
        code {
          background: rgba(0, 0, 0, 0.3);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 11px;
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
          margin: 10px 5px;
        }
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 255, 150, 0.3);
        }
        .info-grid {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 10px;
          margin: 15px 0;
        }
        .info-label {
          font-weight: bold;
          color: #00ff96;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🛡️ Evalvo Proctor - Debug Mode</h1>
        
        <div class="error-section">
          <h3>⚠️ Frontend Build Not Loaded</h3>
          <p>The React application could not be loaded. This page shows debugging information to help resolve the issue.</p>
        </div>

        <div class="debug-section">
          <h3>📊 System Information</h3>
          <div class="info-grid">
            <span class="info-label">Platform:</span> <span>${debugInfo.platform || process.platform}</span>
            <span class="info-label">Development:</span> <span>${debugInfo.isDev ? 'Yes' : 'No'}</span>
            <span class="info-label">App Packaged:</span> <span>${debugInfo.isPackaged ? 'Yes' : 'No'}</span>
            <span class="info-label">Electron Version:</span> <span>${process.versions.electron}</span>
            <span class="info-label">Node Version:</span> <span>${process.versions.node}</span>
            <span class="info-label">__dirname:</span> <code>${debugInfo.__dirname || __dirname}</code>
            <span class="info-label">Resources Path:</span> <code>${debugInfo.resourcesPath || process.resourcesPath}</code>
            <span class="info-label">Attempted Build Path:</span> <code>${attemptedBuildPath || 'None'}</code>
          </div>
        </div>

        ${loadUrlError || loadFileError ? `
        <div class="error-section">
          <h3>❌ Load Errors</h3>
          ${loadUrlError ? `<p><strong>loadURL Error:</strong> ${loadUrlError.message}</p>` : ''}
          ${loadFileError ? `<p><strong>loadFile Error:</strong> ${loadFileError.message}</p>` : ''}
        </div>
        ` : ''}

        <div class="debug-section">
          <h3>🔍 Path Detection Results</h3>
          <p>Paths checked for React build files:</p>
          ${debugInfo.existsChecks && debugInfo.existsChecks.length > 0 ? 
            debugInfo.existsChecks.map((check, index) => `
              <div class="path-item exists-${check.exists === true ? 'true' : check.exists === 'assumed (asar)' ? 'assumed' : 'false'}">
                <strong>${index + 1}.</strong> <code>${check.path}</code><br>
                <small>Status: ${check.exists === true ? '✅ EXISTS' : check.exists === 'assumed (asar)' ? '🔶 ASSUMED (ASAR)' : '❌ NOT FOUND'}</small>
                ${check.chosen ? '<small style="color: #00ff96;"> ← SELECTED</small>' : ''}
                ${check.error ? `<br><small style="color: #ff6464;">Error: ${check.error}</small>` : ''}
              </div>
            `).join('')
            : '<p>No path checks recorded</p>'
          }
        </div>

        <div class="debug-section">
          <h3>🔧 Actions</h3>
          <button onclick="reloadApp()">Reload App</button>
          <button onclick="openDevTools()">Open DevTools</button>
          <button onclick="testProtocol()">Test Protocol</button>
        </div>

        <div id="protocol-status"></div>
        <div id="debug-output"></div>
      </div>

      <script>
        function reloadApp() {
          location.reload();
        }

        function openDevTools() {
          if (window.electronAPI) {
            window.electronAPI.openDevTools();
          }
        }

        function testProtocol() {
          const testUrl = 'examproc://splash?userId=testUser&examId=testExam&eventId=testEvent';
          document.getElementById('debug-output').innerHTML = 
            '<div style="margin-top: 20px; padding: 15px; background: rgba(0, 255, 150, 0.2); border-radius: 8px;">' +
            '<strong>Protocol Test:</strong> ' + testUrl + '</div>';
        }

        if (window.electronAPI) {
          window.electronAPI.onProtocolUrlReceived((event, params) => {
            const statusDiv = document.getElementById('protocol-status');
            statusDiv.innerHTML = 
              '<div style="margin-top: 20px; padding: 15px; background: rgba(0, 255, 150, 0.2); border-radius: 8px;">' +
              '<strong>Protocol URL Received!</strong><br>' +
              'User ID: ' + params.userId + '<br>' +
              'Exam ID: ' + params.examId + '<br>' +
              'Event ID: ' + params.eventId + '<br>' +
              'Route: ' + params.route + '</div>';
          });

          window.electronAPI.rendererReady();
        }
      </script>
    </body>
    </html>
    `;

    const tempDir = PlatformUtils.getTempDir();
    const tempHtmlPath = path.join(tempDir, 'debug_fallback.html');
    
    try {
      fs.writeFileSync(tempHtmlPath, fallbackHTML);
      
      const fallbackUrl = url.format({
        pathname: tempHtmlPath,
        protocol: 'file:',
        slashes: true
      });
      
      console.log('📄 Loading enhanced fallback HTML from:', fallbackUrl);
      
      this.mainWindow.loadURL(fallbackUrl).then(() => {
        console.log('✅ Fallback HTML loaded successfully');
      }).catch((error) => {
        console.error('❌ Failed to load fallback HTML:', error);
        const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(fallbackHTML)}`;
        this.mainWindow.loadURL(dataUrl);
      });
      
      setTimeout(() => {
        try {
          if (fs.existsSync(tempHtmlPath)) {
            fs.unlinkSync(tempHtmlPath);
            console.log('🧹 Cleaned up temporary HTML file');
          }
        } catch (err) {
          console.warn('Could not clean up temp HTML file:', err);
        }
      }, 15000);
      
    } catch (error) {
      console.error('❌ Failed to create fallback HTML:', error);
      const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(fallbackHTML)}`;
      this.mainWindow.loadURL(dataUrl);
    }
  }

  /**
   * Setup window event handlers
   */
  setupEventHandlers() {
    this.mainWindow.once('ready-to-show', () => {
      console.log('✅ Window ready to show');
      this.mainWindow.show();
      console.log('✅ Main window ready and visible');
    });

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    this.mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);
      return { action: 'deny' };
    });
  }

  /**
   * Handle protocol URL received event
   */
  handleProtocolUrl(params) {
    if (this.mainWindow && params) {
      this.mainWindow.webContents.send('protocol-url-received', params);
      
      if (this.mainWindow.isMinimized()) this.mainWindow.restore();
      this.mainWindow.focus();
    }
  }

  /**
   * Get main window instance
   */
  getMainWindow() {
    return this.mainWindow;
  }
}

module.exports = WindowManager;
