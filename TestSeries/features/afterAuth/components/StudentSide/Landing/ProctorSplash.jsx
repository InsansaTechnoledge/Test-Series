import React, { useEffect, useState } from 'react';

const ProctorSplash = () => {
  const [isReady, setIsReady] = useState(false);
  const [examData, setExamData] = useState(null);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    // Get exam data from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const examId = urlParams.get('examId');
    const eventId = urlParams.get('eventId');
    
    if (userId && examId) {
      setExamData({ userId, examId, eventId });
      setIsReady(true);
    }

    // Listen for proctor engine logs from main process
    if (window.electronAPI) {
      window.electronAPI.onProctorLog((message) => {
        console.log('Proctor Log:', message);
      });

      window.electronAPI.onProctorWarning((warning) => {
        console.warn('Proctor Warning:', warning);
      });
    }
  }, []);

  const handleStartExam = async () => {
    if (!examData || !window.electronAPI) return;
    
    setIsStarting(true);
    
    try {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center border border-white/20 shadow-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Evalvo Proctor</h1>
          <p className="text-blue-200">Secure Exam Environment</p>
        </div>

        <div className="mb-8">
          {!isReady ? (
            <div className="text-yellow-300">
              Initializing exam environment...
            </div>
          ) : (
            <div className="text-green-300">
              Ready to start exam
            </div>
          )}
        </div>

        <div className="space-y-3 mb-8 text-sm text-blue-100">
          <button
            onClick={handleStartExam}
            disabled={!isReady || isStarting}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
              isReady && !isStarting
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
            }`}
          >
            {isStarting ? 'Starting Exam...' : 'Start Exam'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProctorSplash;
