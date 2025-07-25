import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { AlertTriangle, StopCircle, Eye, Users, BookOpen, Clock, Shield, CheckCircle, XCircle, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchEventsAnomaly, stopExamForStudent } from '../../../../../../utils/services/proctorService';
import { useTheme } from "../../../../../../hooks/useTheme";

const ExamAnomalyControlSection = () => {
  const [anomalies, setAnomalies] = useState([]);
  const [allLogs, setAllLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('anomalies');
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [selectedExam, setSelectedExam] = useState('all');
  const [loading, setLoading] = useState(false);
  const [stoppedStudents, setStoppedStudents] = useState(new Set());
  const [goLive, setGoLive] = useState(false);

  // New state for scalability
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [expandedStudents, setExpandedStudents] = useState(new Set());
  const [severityFilter, setSeverityFilter] = useState('all');

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

  const displayImage = (base64Image) => {
    return base64Image ? <img src={base64Image} alt="Anomaly Image" className="max-w-full h-auto" /> : null;
  };


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
  }, [allLogs, selectedStudent, selectedExam, searchTerm, severityFilter, sortBy, sortOrder]);

  // Pagination for logs
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedLogs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedLogs, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedLogs.length / itemsPerPage);

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

  // Pagination controls component
  const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;

      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) pages.push(i);
          pages.push('...');
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1);
          pages.push('...');
          for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
        } else {
          pages.push(1);
          pages.push('...');
          for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
          pages.push('...');
          pages.push(totalPages);
        }
      }

      return pages;
    };

    return (
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedLogs.length)} of {filteredAndSortedLogs.length} results
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              className={`px-3 py-1 border rounded-md text-sm ${page === currentPage
                ? 'bg-blue-500 text-white border-blue-500'
                : page === '...'
                  ? 'cursor-default'
                  : 'hover:bg-gray-50'
                }`}
              disabled={page === '...'}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  };
  //theme
  const containerClasses = `min-h-screen p-6 ${theme === "light" ? "bg-gray-50 text-gray-900" : "bg-gray-950 text-indigo-100"
    }`;
  const headerTitleClasses = `text-3xl font-bold mb-2 ${theme === "light" ? "text-gray-900" : "text-indigo-100"
    }`;
  const headerSubtitleClasses = `${theme === "light" ? "text-gray-600" : "text-indigo-100"
    }`;
  const searchContainerClasses = `p-4 rounded-xl shadow-sm mb-6 border ${theme === "light"
    ? "bg-white border-gray-200"
    : "bg-gray-800 border-gray-600"
    }`;

  const inputClasses = `w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${theme === "light"
    ? "bg-white text-gray-900 border-gray-300 focus:ring-blue-500 placeholder-gray-400"
    : "bg-gray-700 text-indigo-100 border-gray-600 focus:ring-indigo-500 placeholder-indigo-300"
    }`;

  const iconColor = theme === "light" ? "text-gray-400" : "text-indigo-300";
  const selectClasses = `px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 ${theme === "light"
    ? "bg-white text-gray-900 border-gray-300 focus:ring-blue-500 placeholder-gray-400"
    : "bg-gray-700 text-indigo-100 border-gray-600 focus:ring-indigo-500 placeholder-indigo-300"
    }`;

  const buttonClasses = `px-3 py-2 rounded-lg text-sm flex items-center gap-2 border ${theme === "light"
    ? "border-gray-300 text-gray-900 hover:bg-gray-50"
    : "border-gray-600 text-indigo-100 hover:bg-gray-700"
    }`;
  const cardClasses = `p-6 rounded-xl shadow-sm border ${theme === "light"
    ? "bg-white border-gray-200"
    : "bg-gray-800 border-gray-700"
    }`;

  const labelClasses = `text-sm font-medium ${theme === "light" ? "text-gray-600" : "text-indigo-300"
    }`;

  const valueClasses = `text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-indigo-100"
    }`;
  const tabContainerClasses = `rounded-xl shadow-sm mb-6 border ${theme === "light" ? "bg-white border-gray-200" : "bg-gray-800 border-gray-700"
    }`;

  const tabBarClasses = `flex border-b ${theme === "light" ? "border-gray-200" : "border-gray-600"
    }`;

  const inactiveTabClasses = theme === "light"
    ? "border-transparent text-gray-500 hover:text-gray-700"
    : "border-transparent text-indigo-300 hover:text-indigo-100";

  const activeTabStyles = {
    anomalies: "border-red-500 text-red-500",
    logs: "border-blue-500 text-blue-400"
  };
  const baseBoxStyle = theme === 'light'
    ? 'bg-white border border-gray-200 text-gray-900'
    : 'bg-gray-800 border border-gray-700 text-indigo-100';

  const subtleText = theme === 'light' ? 'text-gray-500' : 'text-indigo-300';
  const headerText = theme === 'light' ? 'text-gray-900' : 'text-indigo-100';
  const lightBg = theme === 'light' ? 'bg-gray-50' : 'bg-gray-900';
  const highlightRed = theme === 'light' ? 'bg-red-50 border-red-200' : 'bg-red-900/30 border-red-700';
  const highlightOrange = theme === 'light' ? 'bg-orange-50 border-orange-200' : 'bg-orange-900/30 border-orange-700';



  return (
    <div className={containerClasses}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className={headerTitleClasses}>Exam Proctor Control Panel</h1>
          <p className={headerSubtitleClasses}>Monitor and manage exam anomalies in real-time</p>
        </div>

        {/* Enhanced Search and Filter Bar */}
        <div className={searchContainerClasses}>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${iconColor}`} />
                <input
                  type="text"
                  placeholder="Search students, exams, or details..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className={selectClasses}
            >
              <option value="all">All Types</option>
              <option value="anomaly">Anomalies</option>
              <option value="warning">Warnings</option>
              <option value="normal">Normal</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={selectClasses}
            >
              <option value="timestamp">Sort by Time</option>
              <option value="studentId">Sort by Student</option>
              <option value="examId">Sort by Exam</option>
              <option value="eventType">Sort by Type</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className={buttonClasses}
            >
              {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className={cardClasses}>
            <div className="flex items-center justify-between">
              <div>
                <p className={labelClasses}>Total Anomalies</p>
                <p className={valueClasses}>{stats.total}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </div>

          <div className={cardClasses}>
            <div className="flex items-center justify-between">
              <div>
                <p className={labelClasses}>Flagged for Review</p>
                <p className="text-2xl font-bold text-red-600">{stats.flagged}</p>
              </div>
              <Shield className="h-8 w-8 text-red-500" />
            </div>
          </div>

          <div className={cardClasses}>
            <div className="flex items-center justify-between">
              <div>
                <p className={labelClasses}>Students Stopped</p>
                <p className="text-2xl font-bold text-red-600">{stats.stopped}</p>
              </div>
              <StopCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>

          <div className={cardClasses}>
            <div className="flex items-center justify-between">
              <div>
                <p className={labelClasses}>Active Exams</p>
                <p className="text-2xl font-bold text-green-600">{uniqueExams.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={tabContainerClasses}>
          <div className={tabBarClasses}>
            <button
              onClick={() => setActiveTab('anomalies')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${activeTab === 'anomalies' ? activeTabStyles.anomalies : inactiveTabClasses
                }`}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Anomalies ({Object.keys(groupedAnomalies).length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${activeTab === 'logs' ? activeTabStyles.logs : inactiveTabClasses
                }`}
            >
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                All Logs ({filteredAndSortedLogs.length})
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'anomalies' && goLive ? (
              // ✅ If Live Mode is ON
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-xl font-semibold ${headerText}`}>Critical Anomalies</h2>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className={`h-4 w-4 ${subtleText}`} />
                      <span className={`text-sm ${subtleText}`}>
                        {loading ? 'Updating...' : 'Auto-refresh every 5s'}
                      </span>
                    </div>
                    <button
                      onClick={() => setGoLive(prev => !prev)}
                      className={`py-2 px-3 rounded-2xl transition-colors font-medium ${theme === 'light'
                        ? 'bg-red-400 text-white hover:bg-red-500'
                        : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                    >
                      Stop Live
                    </button>
                  </div>
                </div>

                {/* No anomalies */}
                {Object.keys(groupedAnomalies).length === 0 ? (
                  <div className={`text-center py-12 ${baseBoxStyle}`}>
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className={`${subtleText}`}>No anomalies flagged for review.</p>
                  </div>
                ) : (
                  // Anomalies grouped by student
                  <div className="space-y-4">
                    {Object.entries(groupedAnomalies).map(([studentId, studentAnomalies]) => (
                      <div key={studentId} className={`p-4 rounded-xl ${baseBoxStyle}`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleStudentExpansion(studentId)}
                              className={`${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'} p-1 rounded`}
                            >
                              {expandedStudents.has(studentId) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </button>
                            <Users className={`h-5 w-5 ${subtleText}`} />
                            <h3 className={`text-lg font-semibold ${headerText}`}>Student: {studentId}</h3>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                              {studentAnomalies.length} anomalies
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {stoppedStudents.has(studentId) ? (
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300">
                                EXAMS STOPPED
                              </span>
                            ) : (
                              <button
                                onClick={() => handleStopExam(studentId)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm font-medium"
                              >
                                <StopCircle className="h-4 w-4" />
                                Stop Exam
                              </button>
                            )}
                          </div>
                        </div>

                        {expandedStudents.has(studentId) && (
                          <div className="space-y-3">
                            {studentAnomalies.map((event, index) => (
                              <div
                                key={event._id || index}
                                className={`p-4 rounded-lg border ${event.flaggedForReview
                                  ? 'bg-red-50 border-red-200'
                                  : 'bg-orange-50 border-orange-200'
                                  }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-3">
                                    <AlertTriangle
                                      className={`h-4 w-4 ${event.flaggedForReview ? 'text-red-500' : 'text-orange-500'
                                        }`}
                                    />
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs font-medium ${event.flaggedForReview
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-orange-100 text-orange-800'
                                        }`}
                                    >
                                      {event.flaggedForReview ? 'FLAGGED' : 'DETECTED'}
                                    </span>
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    {formatTimestamp(event.timestamp)}
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div>
                                    <p className="text-xs text-gray-600 mb-1">Exam ID</p>
                                    <p className="text-sm font-medium text-gray-900">{event.examId}</p>
                                  </div>
                                  <div className="md:col-span-2">
                                    <p className="text-xs text-gray-600 mb-1">Anomaly Details</p>
                                    <p className="text-sm font-medium text-gray-900">{event.details}</p>
                                  </div>
                                  <div className="md:col-span-2">
                                   <img src={event.imageBase} alt="" />
                                  </div>
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
            ) : activeTab === 'anomalies' ? (
              // ✅ If Live Mode is OFF
              <div className={`shadow-md border rounded-2xl p-6 w-full max-w-md mx-auto text-center ${baseBoxStyle}`}>
                <h2 className={`text-xl font-semibold mb-2 ${headerText}`}>
                  Live Mode Required
                </h2>
                <p className={`mb-4 ${subtleText}`}>
                  To initiate real-time monitoring and enable live proctoring, please activate Live Mode.
                </p>
                <button
                  onClick={() => setGoLive(prev => !prev)}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2.5 rounded-xl shadow-md hover:from-red-600 hover:to-red-700 transition-all font-medium"
                >
                  Activate Live Mode
                </button>
              </div>
            ) : null}

            {activeTab === 'logs' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-xl font-semibold ${headerText}`}>Complete Activity Logs</h2>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Users className={`h-4 w-4 ${subtleText}`} />
                      <select
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                        className={`px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
            ${theme === 'light'
                            ? 'bg-white border border-gray-300 text-gray-900'
                            : 'bg-gray-800 border border-gray-700 text-indigo-100'}`}
                      >
                        <option value="all">All Students</option>
                        {uniqueStudents.map(studentId => (
                          <option key={studentId} value={studentId}>{studentId}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-gray-400" />
                      <select
                        value={selectedExam}
                        onChange={(e) => setSelectedExam(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Exams</option>
                        {uniqueExams.map(examId => (
                          <option key={examId} value={examId}>{examId}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className={`${lightBg} rounded-xl p-4`}>
                  <div className="max-h-96 overflow-y-auto space-y-3">
                    {paginatedLogs.length === 0 ? (
                      <div className="text-center py-8">
                        <p className={`${subtleText}`}>No logs found for the selected filters.</p>
                      </div>
                    ) : (
                      paginatedLogs.map((log, index) => (
                        <div
                          key={log._id || index}
                          className={`p-4 rounded-lg border ${getEventTypeColor(log.eventType)} ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-indigo-100'
                            }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${theme === 'light' ? 'bg-white/50 text-gray-700' : 'bg-indigo-100/10 text-indigo-200'
                                }`}>
                                {log.eventType.toUpperCase()}
                              </span>
                              <span className="text-sm font-medium">{log.examId}</span>
                            </div>
                            <span className={`text-xs ${subtleText}`}>{formatTimestamp(log.timestamp)}</span>
                          </div>
                          <p className={`text-sm mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-indigo-100'}`}>{log.details}</p>
                          <p className={`text-xs ${subtleText}`}>Student: {log.studentId}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {totalPages > 1 && (
                    <PaginationControls
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamAnomalyControlSection;