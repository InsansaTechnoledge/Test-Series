const { APP_CONFIG } = require('../utils/constants');

class ProtocolHandler {
  constructor() {
    this.protocolUrl = null;
  }

  parseProtocolUrl(protocolUrl) {
    try {
      const parsedUrl = new URL(protocolUrl);
      const params = {
        userId: parsedUrl.searchParams.get('userId'),
        examId: parsedUrl.searchParams.get('examId'),
        eventId: parsedUrl.searchParams.get('eventId'),
        route: parsedUrl.searchParams.get('route') || APP_CONFIG.PROTOCOL.DEFAULT_ROUTE,
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

  handleProtocolUrl(url, mainWindow) {
    console.log('🔗 Handling protocol URL:', url);
    this.protocolUrl = url;

    const params = this.parseProtocolUrl(url);

    if (mainWindow && params) {
      mainWindow.webContents.send('protocol-url-received', params);
      
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }

    return params;
  }

  getProtocolParams() {
    if (this.protocolUrl) {
      return this.parseProtocolUrl(this.protocolUrl);
    }
    return null;
  }
}

module.exports = ProtocolHandler;