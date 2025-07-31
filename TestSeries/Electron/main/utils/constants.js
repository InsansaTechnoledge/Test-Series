const { app } = require('electron');

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
const isWin = process.platform === 'win32';
const isMac = process.platform === 'darwin';
const isLinux = process.platform === 'linux';

const APP_CONFIG = {
  WINDOW: {
    WIDTH: 1400,
    HEIGHT: 900,
    MIN_WIDTH: 800,
    MIN_HEIGHT: 600
  },
  DEV_SERVER: {
    HOST: 'localhost',
    PORT: 5173,
    URL: 'http://localhost:5173'
  },
  PROCTOR: {
    BINARY_NAME: isWin ? 'proctor_engine.exe' : 'proctor_engine'
  },
  PROTOCOL: {
    SCHEME: 'examproc',
    DEFAULT_ROUTE: '/student/proctor-splash'
  },
  ICON: {
    NAME: 'evalvo icon 2.png'
  }
};

module.exports = {
  isDev,
  isWin,
  isMac,
  isLinux,
  APP_CONFIG
};