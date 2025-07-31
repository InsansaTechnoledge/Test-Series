const path = require('path');
const fs = require('fs');
const { nativeImage, app } = require('electron');
const { isDev, APP_CONFIG } = require('../utils/constants');

class IconManager {
  
  static getIconPath() {
    const iconName = APP_CONFIG.ICON.NAME;
    let iconPath;

    if (isDev) {
      iconPath = path.join(__dirname, '..', '..', 'assets', iconName);
    } else {
      iconPath = path.join(process.resourcesPath, 'assets', iconName);
    }

    const fallbackPaths = [
      path.join(__dirname, '..', 'assets', iconName),
      path.join(__dirname, '..', '..', 'assets', iconName),
      path.join(__dirname, 'icons', iconName),
      path.join(__dirname, iconName),
      path.join(process.cwd(), 'assets', iconName),
      path.join(process.cwd(), 'icons', iconName)
    ];

    if (fs.existsSync(iconPath)) {
      console.log('✅ Icon found at:', iconPath);
      return iconPath;
    }

    for (const fallbackPath of fallbackPaths) {
      if (fs.existsSync(fallbackPath)) {
        console.log('✅ Icon found at fallback path:', fallbackPath);
        return fallbackPath;
      }
    }

    console.warn('⚠️ Icon not found. Checked paths:');
    console.warn('  Primary:', iconPath);
    fallbackPaths.forEach(p => console.warn('  Fallback:', p));

    return null;
  }

  static loadAppIcon() {
    const iconPath = this.getIconPath();
    let appIcon = null;

    if (iconPath) {
      try {
        appIcon = nativeImage.createFromPath(iconPath);
        
        if (!appIcon.isEmpty()) {
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

    return appIcon;
  }

  static setDockIcon(appIcon) {
    if (appIcon && (process.platform === 'darwin' || process.platform === 'linux')) {
      if (app.dock) {
        app.dock.setIcon(appIcon);
      }
    }
  }
}

module.exports = IconManager;