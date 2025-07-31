const { spawn } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const PathResolver = require('../utils/pathResolver');
const PlatformUtils = require('../utils/platformUtils');
const { isWin } = require('../utils/constants');

class ProctorProcess {
  constructor() {
    this.process = null;
  }

  launch(params, onEvent, onWarning, onLog) {
    try {
      const binaryPath = PathResolver.getBinaryPath();
      
      const userId = params.userId;
      const examId = params.examId;
      const eventId = params.eventId || params.examId;
      
      if (!userId || !examId) {
        throw new Error(`❌ Missing required parameters. userId: ${userId}, examId: ${examId}`);
      }
      
      console.log('🚀 Launching proctor engine with params:', { userId, examId, eventId });

      this.process = spawn(binaryPath, [
        '--user-id', userId,
        '--exam-id', examId,
        '--event-id', eventId
      ], {
        stdio: ['ignore', 'pipe', 'pipe'],
        windowsHide: true,
      });

      this.setupEventHandlers(onEvent, onWarning, onLog);

      console.log('✅ Proctor engine launched successfully');
      return { success: true, message: 'Proctor engine started successfully' };
    } catch (error) {
      console.error('❌ Error launching proctor engine:', error);
      onLog(`❌ Failed to launch proctor: ${error.message}`);
      return { success: false, message: error.message };
    }
  }


  setupEventHandlers(onEvent, onWarning, onLog) {
    if (!this.process) return;

    const rl = readline.createInterface({ input: this.process.stdout });

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
          onWarning(parsed);
        } else {
          onEvent(parsed);
        }
      } catch (parseError) {
        console.log('📝 Non-JSON output from proctor:', line);
        onLog(line);
      }
    });

    this.process.stderr.on('data', (data) => {
      console.error('❌ Proctor engine stderr:', data.toString());
      onLog(`❌ ERROR: ${data}`);
    });

    this.process.on('exit', (code) => {
      console.log(`🛑 Proctor Engine exited with code ${code}`);
      onLog(`🛑 Proctor Engine exited with code ${code}`);
      this.process = null;
    });

    this.process.on('error', (err) => {
      console.error('❌ Proctor process error:', err);
      onLog(`❌ Failed to start engine: ${err.message}`);
      this.process = null;
    });
  }

  stop() {
    if (this.process) {
      if (isWin) {
        PlatformUtils.killProcessWindows(this.process);
      } else {
        this.process.kill('SIGTERM');
      }
      this.process = null;
      return { success: true, message: 'Proctor Engine stopped.' };
    }
    return { success: false, message: 'Proctor Engine was not running.' };
  }

 
  isRunning() {
    return this.process !== null;
  }
}

module.exports = ProctorProcess;