const { exec } = require('child_process');
const { isWin } = require('./constants');

class PlatformUtils {
  
  static killProcessWindows(process) {
    if (process && process.pid) {
      exec(`taskkill /PID ${process.pid} /T /F`, (err, stdout, stderr) => {
        if (err) {
          console.error('❌ Error killing process:', err);
        } else {
          console.log('✅ Process killed:', stdout);
        }
      });
    }
  }


  static cleanupPlatformSpecific() {
    const platform = process.platform;
    console.log('🔒 Platform detected:', platform);
    // Add platform-specific cleanup here
  }

  
  static getTempDir() {
    const { isDev } = require('./constants');
    if (isDev) {
      return __dirname;
    }
    return process.platform === 'darwin' ? 
      require('path').dirname(process.execPath) : 
      process.cwd();
  }
}

module.exports = PlatformUtils;