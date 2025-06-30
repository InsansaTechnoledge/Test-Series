const { app } = require('electron');
const path = require('path');

const PROTOCOL_NAME = 'examproc';

function registerProtocol() {
  try {
    if (process.env.NODE_ENV === 'development') {
      // For development
      app.removeAsDefaultProtocolClient(PROTOCOL_NAME);
      const result = app.setAsDefaultProtocolClient(
        PROTOCOL_NAME, 
        process.execPath, 
        [path.resolve(process.argv[1])]
      );
      console.log(`✅ Development protocol registration: ${result}`);
    } else {
      // For production
      const result = app.setAsDefaultProtocolClient(PROTOCOL_NAME);
      console.log(`✅ Production protocol registration: ${result}`);
    }
    
    // Test registration
    const isDefault = app.isDefaultProtocolClient(PROTOCOL_NAME);
    console.log(`🔍 Is default protocol client: ${isDefault}`);
    
    return isDefault;
  } catch (error) {
    console.error('❌ Protocol registration failed:', error);
    return false;
  }
}

// If run directly, register and exit
if (require.main === module) {
  app.whenReady().then(() => {
    const success = registerProtocol();
    console.log(success ? '✅ Protocol registered successfully' : '❌ Protocol registration failed');
    app.quit();
  });
}

module.exports = { registerProtocol };