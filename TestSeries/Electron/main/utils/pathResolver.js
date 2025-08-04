const path = require('path');
const fs = require('fs');
const { app } = require('electron');
const { isDev } = require('./constants');

class PathResolver {
  
  static findReactBuildPath() {
    let buildPath = null;
    let debugInfo = {
      platform: process.platform,
      isDev: isDev,
      isPackaged: app.isPackaged,
      __dirname: __dirname,
      resourcesPath: process.resourcesPath,
      possiblePaths: [],
      existsChecks: []
    };

    const possiblePaths = [];
    
    if (isDev) {
      // Development paths
      possiblePaths.push(
        path.join(__dirname, '..', '..', 'dist', 'index.html'),
        path.join(__dirname, '..', 'dist', 'index.html'),
        path.join(process.cwd(), 'dist', 'index.html')
      );
    } else {
      // Production paths - works with asar
      if (process.platform === 'darwin') {
        // macOS paths
        possiblePaths.push(
          path.join(__dirname, 'dist', 'index.html'),              
          path.join(__dirname, '..', 'dist', 'index.html'),        
          path.join(process.resourcesPath, 'app.asar.unpacked', 'dist', 'index.html'),
          path.join(process.resourcesPath, 'dist', 'index.html'),  
          path.join(process.resourcesPath, 'frontend', 'index.html')
        );
      } else {
        // Windows/Linux paths
        possiblePaths.push(

          path.join(process.resourcesPath, 'dist', 'index.html'),
                              path.join(process.resourcesPath, 'app.asar.unpacked', 'dist', 'index.html'),
          path.join(__dirname, 'dist-electron', 'dist', 'index.html'),
          path.join(__dirname, 'dist-electron', 'index.html'),

        );
      }
    }

    debugInfo.possiblePaths = possiblePaths;

    console.log('🔍 Searching for React build files...');
    
    for (const testPath of possiblePaths) {
      console.log(`  Checking: ${testPath}`);
      
      try {
        if (!isDev && testPath.includes(__dirname)) {
          console.log(`  📦 Assuming asar path exists: ${testPath}`);
          debugInfo.existsChecks.push({ path: testPath, exists: 'assumed (asar)', chosen: true });
          buildPath = testPath;
          break;
        } else {
          const exists = fs.existsSync(testPath);
          debugInfo.existsChecks.push({ path: testPath, exists: exists, chosen: exists });
          console.log(`  ${exists ? '✅' : '❌'} ${testPath} - ${exists ? 'EXISTS' : 'NOT FOUND'}`);
          
          if (exists) {
            buildPath = testPath;
            break;
          }
        }
      } catch (error) {
        debugInfo.existsChecks.push({ path: testPath, exists: false, error: error.message, chosen: false });
        console.log(`  ❌ Error checking ${testPath}:`, error.message);
      }
    }

    global.buildDebugInfo = debugInfo;
    
    if (buildPath) {
      console.log(`✅ Selected React build path: ${buildPath}`);
    } else {
      console.warn('⚠️ React build files not found in any of the expected locations');
    }
    
    return buildPath;
  }

  static getBinaryPath() {
    const { APP_CONFIG, isWin } = require('./constants');
    const binaryName = APP_CONFIG.PROCTOR.BINARY_NAME;
    let binaryPath;

    if (isDev) {
      binaryPath = path.join(__dirname, '..', '..', 'bin', isWin ? 'win' : 'mac', binaryName);
    } else {
      binaryPath = path.join(process.resourcesPath, 'bin', isWin ? 'win' : 'mac', binaryName);
    }

    console.log("🛠️ Resolved binary path:", binaryPath);

    if (!fs.existsSync(binaryPath)) {
      throw new Error(`❌ Proctor Engine binary not found at: ${binaryPath}`);
    }

    return binaryPath;
  }
}

module.exports = PathResolver;