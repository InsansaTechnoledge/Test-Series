const ProctorProcess = require('./proctorProcess');

class ProctorManager {
  constructor(queue) {
    this.proctorProcess = new ProctorProcess();
    this.queue = queue;
  }


  safeSend(mainWindow, channel, data) {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send(channel, data);
    }
  }

  start(params, mainWindow) {
    if (this.proctorProcess.isRunning()) {
      this.safeSend(mainWindow, 'proctor-log', '⚠️ Proctor Engine already running.');
      return { success: false, message: 'Proctor Engine already running.' };
    }

    const onEvent = (data) => this.safeSend(mainWindow, 'proctor-event', data);
    const onAudioLevelEvent = (data) => this.safeSend(mainWindow, 'proctor-audio-level', data);
    const onWarning = (data) => {
      this.queue.addEvent(data);
      this.safeSend(mainWindow, 'proctor-warning', data);
    };
    const onLog = (data) => this.safeSend(mainWindow, 'proctor-log', data);

    return this.proctorProcess.launch(params, onEvent, onWarning, onLog,onAudioLevelEvent);
  }

  
  stop() {
    return this.proctorProcess.stop();
  }


  isRunning() {
    return this.proctorProcess.isRunning();
  }
}

module.exports = ProctorManager;