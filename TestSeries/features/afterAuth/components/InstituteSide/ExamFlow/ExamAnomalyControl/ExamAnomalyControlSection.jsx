import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { AlertTriangle, StopCircle, Eye, Users, BookOpen, Clock, Shield, CheckCircle, XCircle, Search, Filter, ChevronDown, ChevronUp, Activity, Monitor, Play, Pause, TrendingUp, AlertCircle, Zap } from 'lucide-react';
import { fetchEventsAnomaly, stopExamForStudent } from '../../../../../../utils/services/proctorService';
import { useTheme } from "../../../../../../hooks/useTheme";

const ExamAnomalyControlSection = () => {
  const [anomalies, setAnomalies] = useState([]);
  const [allLogs, setAllLogs] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [selectedExam, setSelectedExam] = useState('all');
  const [loading, setLoading] = useState(false);
  const [stoppedStudents, setStoppedStudents] = useState(new Set());
  const [goLive, setGoLive] = useState(false);

  // New state for scalability
  const [searchTerm, setSearchTerm] = useState('');

  const [itemsPerPage] = useState(20);
  const [expandedStudents, setExpandedStudents] = useState(new Set());

  console.log("fds",anomalies);
  

  // Memoized unique students and exams for performance
  const uniqueStudents = useMemo(() => {
    return [...new Set(allLogs.map(log => log.studentId))];
  }, [allLogs]);

  const uniqueExams = useMemo(() => {
    return [...new Set(allLogs.map(log => log.examId))];
  }, [allLogs]);
  const { theme } = useTheme();
  // Optimized data fetching
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [anomalyResult, logsResult] = await Promise.all([
        fetchEventsAnomaly(),
        // fetchEventsAnomaly() // Replace this with actual log fetch if needed
      ]);
      setAnomalies(anomalyResult?.data || []);
      setAllLogs(logsResult?.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    if (!goLive) return;

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, [goLive, fetchData]);

  const handleStopExam = useCallback(
    async (studentId) => {
      const confirmed = window.confirm(
        `Are you sure you want to stop the exam for student ${studentId}? This action cannot be undone.`
      );

      if (!confirmed) return;

      try {
        await stopExamForStudent(studentId);

        setStoppedStudents((prev) => new Set([...prev, studentId]));

        setAnomalies((prev) =>
          prev.map((anomaly) =>
            anomaly.studentId === studentId
              ? { ...anomaly, stopExam: true }
              : anomaly
          )
        );
      } catch (error) {
        console.error("Error stopping exam:", error);
      }
    },
    [setStoppedStudents, setAnomalies]
  );


  const toggleStudentExpansion = useCallback((studentId) => {
    setExpandedStudents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  }, []);

  const formatTimestamp = useCallback((timestamp) => {
    return new Date(timestamp).toLocaleString();
  }, []);

  const getEventTypeColor = useCallback((eventType) => {
    switch (eventType) {
      case 'anomaly':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'normal':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }, []);

  // Optimized filtering with search and sorting
  const filteredAndSortedLogs = useMemo(() => {
    let filtered = allLogs.filter(log => {
      const studentMatch = selectedStudent === 'all' || log.studentId === selectedStudent;
      const examMatch = selectedExam === 'all' || log.examId === selectedExam;
      const searchMatch = searchTerm === '' ||
        log.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.examId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase());
      const severityMatch = severityFilter === 'all' || log.eventType === severityFilter;

      return studentMatch && examMatch && searchMatch && severityMatch;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === 'timestamp') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (sortOrder === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    return filtered;
  }, [allLogs, selectedStudent, selectedExam, searchTerm]);

  

  // Optimized anomaly stats calculation
  const stats = useMemo(() => {
    const total = anomalies.length;
    const flagged = anomalies.filter(a => a.flaggedForReview).length;
    const stopped = stoppedStudents.size;
    return { total, flagged, stopped };
  }, [anomalies, stoppedStudents]);

  // Group anomalies by student with search filtering
  const groupedAnomalies = useMemo(() => {
    const filtered = anomalies.filter(anomaly => {
      const searchMatch = searchTerm === '' ||
        anomaly.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        anomaly.examId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        anomaly.details.toLowerCase().includes(searchTerm.toLowerCase());
      return searchMatch;
    });

    return filtered.reduce((acc, anomaly) => {
      if (!acc[anomaly.studentId]) {
        acc[anomaly.studentId] = [];
      }
      acc[anomaly.studentId].push(anomaly);
      return acc;
    }, {});
  }, [anomalies, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section - Bento Style */}
        <div className="mb-8">
          <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Exam Proctor Control</h1>
                <p className="text-blue-100 text-lg">Real-time monitoring & anomaly detection</p>
              </div>
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  goLive ? 'bg-green-500/20 text-green-100' : 'bg-gray-500/20 text-gray-100'
                }`}>
                  {goLive ? <Activity className="h-4 w-4 animate-pulse" /> : <Monitor className="h-4 w-4" />}
                  <span className="text-sm font-medium">
                    {goLive ? 'Live Monitoring' : 'Standby Mode'}
                  </span>
                </div>
                <button
                  onClick={() => setGoLive(prev => !prev)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all shadow-lg ${
                    goLive 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-white text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {goLive ? (
                    <div className="flex items-center gap-2">
                      <Pause className="h-4 w-4" />
                      Stop Live
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Play className="h-4 w-4" />
                      Go Live
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Stats Cards - Bento Style */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Anomalies */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-orange-100">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 font-medium">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">Anomalies Detected</span>
              </div>
            </div>

            {/* Students Stopped */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-red-100">
                  <StopCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 font-medium">Stopped</p>
                  <p className="text-2xl font-bold text-red-600">{stats.stopped}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-gray-600">Exams Terminated</span>
              </div>
            </div>

            {/* Active Exams */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-green-100">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 font-medium">Active</p>
                  <p className="text-2xl font-bold text-green-600">{uniqueExams.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">Live Exams</span>
              </div>
            </div>
          </div>

          {/* Control Panel - Bento Style */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <span className="text-sm font-medium text-gray-600">Monitoring Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    goLive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {goLive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <span className="text-sm font-medium text-gray-600">Auto-refresh</span>
                  <span className="text-xs text-gray-500">
                    {loading ? 'Updating...' : goLive ? 'Every 5s' : 'Disabled'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <span className="text-sm font-medium text-gray-600">Connected Students</span>
                  <span className="text-sm font-bold text-blue-600">{uniqueStudents.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Bento Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Anomalies Section */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-100">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Critical Anomalies</h2>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {Object.keys(groupedAnomalies).length} students
                    </span>
                  </div>
                  
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search anomalies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6">
                {!goLive ? (
                  <div className="text-center py-12">
                    <div className="p-4 rounded-full bg-blue-100 w-fit mx-auto mb-4">
                      <Monitor className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Mode Required</h3>
                    <p className="text-gray-600 mb-4">Activate live monitoring to view real-time anomalies</p>
                    <button
                      onClick={() => setGoLive(true)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Start Monitoring
                    </button>
                  </div>
                ) : Object.keys(groupedAnomalies).length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600">No anomalies detected. All systems normal.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {Object.entries(groupedAnomalies).map(([studentId, studentAnomalies]) => (
                      <div key={studentId} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleStudentExpansion(studentId)}
                              className="p-1 rounded hover:bg-gray-100"
                            >
                              {expandedStudents.has(studentId) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </button>
                            <Users className="h-4 w-4 text-gray-500" />
                            <span className="font-semibold text-gray-900">{studentId}</span>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              {studentAnomalies.length} issues
                            </span>
                          </div>
                          
                          {stoppedStudents.has(studentId) ? (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              EXAM STOPPED
                            </span>
                          ) : (
                            <button
                              onClick={() => handleStopExam(studentId)}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2"
                            >
                              <StopCircle className="h-4 w-4" />
                              Stop Exam
                            </button>
                          )}
                        </div>

                        {expandedStudents.has(studentId) && (
                          <div className="space-y-3 pl-8">
                            {studentAnomalies.map((event, index) => (
                              <div
                                key={event._id || index}
                                className="p-4 rounded-lg bg-red-50 border border-red-200"
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <AlertTriangle className="h-4 w-4 text-red-500" />
                                      <span className="text-sm font-medium text-red-800">
                                        {event.flaggedForReview ? 'CRITICAL' : 'WARNING'}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {formatTimestamp(event.timestamp)}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-800 mb-1 font-medium">{event.details}</p>
                                    <p className="text-xs text-gray-600">Exam: {event.examId}</p>
                                  </div>
                                  
                                  {event.imageBase && (
                                    <div className="flex-shrink-0">
                                      <img 
                                        src={event.imageBase} 
                                        alt="Anomaly snapshot" 
                                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Activity Logs Sidebar */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Eye className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Activity Feed</h2>
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Students</option>
                    {uniqueStudents.map(studentId => (
                      <option key={studentId} value={studentId}>{studentId}</option>
                    ))}
                  </select>
                  <select
                    value={selectedExam}
                    onChange={(e) => setSelectedExam(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Exams</option>
                    {uniqueExams.map(examId => (
                      <option key={examId} value={examId}>{examId}</option>
                    ))}
                  </select>
                </div>
              </div>

              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ExamAnomalyControlSection;