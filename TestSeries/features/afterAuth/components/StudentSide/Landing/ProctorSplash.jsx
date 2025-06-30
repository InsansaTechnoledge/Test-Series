import React, { useEffect, useState } from 'react';

const ProctorSplash = () => {
  const [isReady, setIsReady] = useState(false);
  const [examData, setExamData] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  const [logs, setLogs] = useState([]);
  const [isElectronEnv, setIsElectronEnv] = useState(false);

  useEffect(() => {
    // Check if we're in Electron environment
    const electronAvailable = typeof window !== 'undefined' && window.electronAPI;
    setIsElectronEnv(electronAvailable);
    
    if (!electronAvailable) {
      console.warn('Not in Electron environment - electronAPI not available');
    }

    // Get exam data from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const examId = urlParams.get('examId');
    const eventId = urlParams.get('eventId') || 'default';
    
    console.log('ProctorSplash - URL params:', { userId, examId, eventId });
    
    if (userId && examId) {
      setExamData({ userId, examId, eventId });
      setIsReady(true);
    } else {
      console.error('Missing required parameters:', { userId, examId });
    }

    // Listen for proctor engine logs from main process
    if (electronAvailable) {
      const handleProctorLog = (message) => {
        console.log('Proctor Log:', message);
        setLogs(prev => [...prev.slice(-9), { type: 'log', message, timestamp: new Date() }]);
      };

      const handleProctorWarning = (warning) => {
        console.warn('Proctor Warning:', warning);
        setLogs(prev => [...prev.slice(-9), { type: 'warning', message: warning, timestamp: new Date() }]);
      };

      window.electronAPI.onProctorLog(handleProctorLog);
      window.electronAPI.onProctorWarning(handleProctorWarning);

      // Cleanup
      return () => {
        if (window.electronAPI.removeAllListeners) {
          window.electronAPI.removeAllListeners('proctor-log');
          window.electronAPI.removeAllListeners('proctor-warning');
        }
      };
    }
  }, []);

  const handleStartExam = async () => {
    if (!examData || !window.electronAPI) {
      console.error('Cannot start exam - missing data or API');
      return;
    }
    
    setIsStarting(true);
    
    try {
      console.log('Starting exam with data:', examData);
      
      // Start the exam and proctor engine
      const result = await window.electronAPI.startExam(examData);
      
      if (result.success) {
        console.log('Exam started successfully');
        // The main process will navigate to the test page automatically
      } else {
        console.error('Failed to start exam:', result.message);
        alert('Failed to start exam: ' + result.message);
        setIsStarting(false);
      }
    } catch (error) {
      console.error('Error starting exam:', error);
      alert('Error starting exam: ' + error.message);
      setIsStarting(false);
    }
  };

  const handleCloseApp = () => {
    if (window.electronAPI) {
      window.electronAPI.closeWindow();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Evalvo Proctor</h1>
          <p className="text-blue-200">Secure Exam Environment</p>
        </div>

        {/* Status */}
        <div className="mb-6">
          {!isElectronEnv ? (
            <div className="text-red-300 bg-red-900/30 p-3 rounded-lg">
              ⚠️ Not in Electron environment
            </div>
          ) : !isReady ? (
            <div className="text-yellow-300 bg-yellow-900/30 p-3 rounded-lg">
              🔄 Initializing exam environment...
            </div>
          ) : (
            <div className="text-green-300 bg-green-900/30 p-3 rounded-lg">
              ✅ Ready to start exam
            </div>
          )}
        </div>

        {/* Exam Info */}
        {examData && (
          <div className="mb-6 text-left bg-white/5 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">Exam Details:</h3>
            <div className="text-blue-200 text-sm space-y-1">
              <div>User ID: {examData.userId}</div>
              <div>Exam ID: {examData.examId}</div>
              <div>Event ID: {examData.eventId}</div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleStartExam}
            disabled={!isReady || isStarting || !isElectronEnv}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
              isReady && !isStarting && isElectronEnv
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
            }`}
          >
            {isStarting ? '🚀 Starting Exam...' : '▶️ Start Exam'}
          </button>

          <button
            onClick={handleCloseApp}
            className="w-full py-2 px-4 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors"
          >
            ❌ Cancel
          </button>
        </div>

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs text-blue-300 space-y-1">
            <div>Environment: {isElectronEnv ? 'Electron' : 'Browser'}</div>
            <div>Ready: {isReady ? 'Yes' : 'No'}</div>
            <div>URL: {window.location.href}</div>
          </div>
        )}

        {/* Logs */}
        {logs.length > 0 && (
          <div className="mt-6 max-h-32 overflow-y-auto bg-black/30 p-3 rounded-lg">
            <h4 className="text-white text-sm font-semibold mb-2">Proctor Logs:</h4>
            {logs.map((log, index) => (
              <div key={index} className={`text-xs mb-1 ${
                log.type === 'warning' ? 'text-yellow-300' : 'text-green-300'
              }`}>
                {log.message}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProctorSplash;