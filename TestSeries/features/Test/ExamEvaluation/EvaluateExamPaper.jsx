import React, { useState, useEffect, useMemo } from 'react';
import { useUser } from "../../../contexts/currentUserContext";
import { ChevronRight, ChevronLeft, Users, FileText, CheckCircle, Clock, Award, Eye, Lock, Save, AlertTriangle } from 'lucide-react';
import NavigationBreadcrumb from './components/Navigation';
import BatchCard from './components/BatchCard';
import ExamCard from './components/ExamCard';
import StudentCard from './components/StudentCard';
import ResultsOverview from './components/ResultsOverView';
import QuestionEvaluation from './components/QuestionEvaluator';
import QuestionsCard from './components/QuestionsCard';
import { useCachedBatches } from '../../../hooks/useCachedBatches';
import { useCachedStudents } from '../../../hooks/useCachedStudents';
import { useExamManagement } from '../../../hooks/UseExam';
import { useCachedResultExamData } from '../../../hooks/useResultExamData';
import { saveDescriptiveResponse } from '../../../utils/services/resultService';
import { useQueryClient } from '@tanstack/react-query';
import { publishExamResults } from '../../../utils/services/examService';

const EvaluateExamPaper = () => {
  const { user } = useUser();
  const [currentView, setCurrentView] = useState('batches');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [navigationPath, setNavigationPath] = useState(['Batches']);

  // New state for result management
  const [localStudentResultMap, setLocalStudentResultMap] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showLockWarning, setShowLockWarning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  const { batchMap } = useCachedBatches();
  const { students } = useCachedStudents(user.role === 'user' ? selectedBatch?.id : null);
  const { exams } = useExamManagement();
  const { data } = useCachedResultExamData(selectedExam?.id, true, null);
  const questions = data?.questions;
  const studentResultMap = useMemo(() => {
    return Object.fromEntries(
      (data?.results || []).map((r) => [r.studentId, r])
    );
  }, [data?.results]);
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log("Exam Data:", data);
    console.log("Students:", students);
    console.log("Questions:", questions);
  }, [data, students, questions]);


  // Initialize local state when data changes
  useEffect(() => {
    if (studentResultMap && Object.keys(studentResultMap).length > 0) {
      setLocalStudentResultMap(prev => {
        const newMap = { ...prev };
        Object.keys(studentResultMap).forEach(studentId => {
          if (!newMap[studentId]) {
            newMap[studentId] = {
              ...studentResultMap[studentId],
              hasUnsavedChanges: false,
              isLocked: studentResultMap[studentId].evaluated || false,
              lastModified: null
            };
          }
        });
        return newMap;
      });
    }
  }, [studentResultMap]);

  const handleBatchSelect = (batch) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(() => () => {
        setSelectedBatch(batch);
        setCurrentView('exams');
        setNavigationPath(['Batches', batch.name]);
      });
      setShowLockWarning(true);
      return;
    }

    setSelectedBatch(batch);
    setCurrentView('exams');
    setNavigationPath(['Batches', batch.name]);
  };

  const handleExamSelect = (exam) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(() => () => {
        setSelectedExam(exam);
        setCurrentView('students');
        setNavigationPath(['Batches', selectedBatch.name, exam.name]);
      });
      setShowLockWarning(true);
      return;
    }

    setSelectedExam(exam);
    setCurrentView('students');
    setNavigationPath(['Batches', selectedBatch.name, exam.name]);
  };

  const handleStudentSelect = (student) => {
    if (hasUnsavedChanges && selectedStudent?._id !== student._id) {
      setPendingNavigation(() => () => {
        setSelectedStudent(student);
        setCurrentView('questions');
        setNavigationPath(['Batches', selectedBatch.name, selectedExam.name, student.name]);
      });
      setShowLockWarning(true);
      return;
    }

    setSelectedStudent(student);
    setCurrentView('questions');
    setNavigationPath(['Batches', selectedBatch.name, selectedExam.name, student.name]);
  };

  const handleQuestionSelect = (question) => {
    setSelectedQuestion(question);
    setCurrentView('evaluate');
    setNavigationPath(['Batches', selectedBatch.name, selectedExam.name, selectedStudent.name, `Question ${question.id}`]);
  };

  const handleNavigate = (index) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(() => () => {
        const views = ['batches', 'exams', 'students', 'questions', 'evaluate'];
        setCurrentView(views[index]);
        setNavigationPath(navigationPath.slice(0, index + 1));
      });
      setShowLockWarning(true);
      return;
    }

    const views = ['batches', 'exams', 'students', 'questions', 'evaluate'];
    setCurrentView(views[index]);
    setNavigationPath(navigationPath.slice(0, index + 1));
  };

  // Enhanced handleSave with local state management
  const handleSave = async (questionId, marks, feedback) => {
    console.log('Saving marks for question:', questionId, marks, feedback);

    if (!selectedStudent) return;

    setLocalStudentResultMap(prevMap => {
      const updatedMap = { ...prevMap };
      const studentData = updatedMap[selectedStudent._id];

      if (studentData) {        
        const responseIndex = studentData.descriptiveResponses?.findIndex(
          r => r.questionId === questionId
        );

        if (responseIndex !== -1) {
          updatedMap[selectedStudent._id] = {
            ...studentData,
            descriptiveResponses: studentData.descriptiveResponses.map((response, index) =>
              index === responseIndex
                ? { ...response, obtainedMarks: parseInt(marks) || 0, feedback: feedback || '' }
                : response
            ),
            hasUnsavedChanges: true,
            lastModified: new Date().toISOString()
          };
        }
      }

      return updatedMap;
    });

    setHasUnsavedChanges(true);

    // Navigate back to questions list
    setCurrentView('questions');
    setNavigationPath(navigationPath.slice(0, -1));
  };

  // Lock student result
  const handleLockResult = async (studentId) => {
    try {
      const studentData = localStudentResultMap[studentId];

      if (!studentData) {
        alert('Student data not found');
        return;
      }

      // Validate all descriptive questions have been evaluated
      const descriptiveQuestions = questions?.filter(q => q.question_type === 'descriptive') || [];
      const unevaluatedQuestions = descriptiveQuestions.filter(question => {
        const response = studentData.descriptiveResponses?.find(r => r.questionId === question.id);
        return !response || response.obtainedMarks === null || response.obtainedMarks === undefined;
      });

      if (unevaluatedQuestions.length > 0) {
        alert(`Please evaluate all descriptive questions before locking. ${unevaluatedQuestions.length} questions remaining.`);
        return;
      }

      // Prepare data for saving
      const dataToSave = {
        ...studentData,
        evaluated: true
      };

      // Save to backend
      const response = await saveDescriptiveResponse(dataToSave);

      if (response.status === 200) {
        console.log("Result locked successfully");

        // Update local state
        setLocalStudentResultMap(prevMap => ({
          ...prevMap,
          [studentId]: {
            ...prevMap[studentId],
            isLocked: true,
            hasUnsavedChanges: false,
            evaluated: true,
            lockedAt: new Date().toISOString()
          }
        }));

        // Clear unsaved changes if this was the current student
        if (selectedStudent?._id === studentId) {
          setHasUnsavedChanges(false);
        }

        // Invalidate query to refresh data
        queryClient.invalidateQueries({ queryKey: ['resultExamData', selectedExam.id] });

        alert('Student result locked successfully!');
      }
    } catch (error) {
      console.error('Error locking student result:', error);
      alert('Error saving result. Please try again.');
    }
  };

  // Handle navigation confirmation
  const handleConfirmNavigationWithoutLock = () => {
    if (selectedStudent) {
      // Reset unsaved changes for current student
      setLocalStudentResultMap(prevMap => {
        const updatedMap = { ...prevMap };
        const studentData = updatedMap[selectedStudent._id];

        if (studentData && studentData.hasUnsavedChanges) {
          // Reset to original state
          const originalData = studentResultMap[selectedStudent._id];
          updatedMap[selectedStudent._id] = {
            ...originalData,
            hasUnsavedChanges: false,
            isLocked: originalData?.evaluated || false
          };
        }

        return updatedMap;
      });
    }

    setHasUnsavedChanges(false);
    setShowLockWarning(false);

    // Execute pending navigation
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    }
  };

  const handleLockAndContinue = async () => {
    if (selectedStudent) {
      await handleLockResult(selectedStudent._id);
      setShowLockWarning(false);

      // Execute pending navigation
      if (pendingNavigation) {
        pendingNavigation();
        setPendingNavigation(null);
      }
    }
  };

  // Get student status
  const getStudentStatus = (studentId) => {
    const localData = localStudentResultMap[studentId];
    if (!localData) return 'not-started';

    if (localData.isLocked) return 'locked';
    if (localData.hasUnsavedChanges) return 'unsaved-changes';

    return 'in-progress';
  };

  // Get unsaved changes count
  const getUnsavedChangesCount = () => {
    if (!selectedStudent || !hasUnsavedChanges) return 0;

    const studentData = localStudentResultMap[selectedStudent._id];
    if (!studentData) return 0;

    return studentData.descriptiveResponses?.filter(
      response => response.obtainedMarks !== null && response.obtainedMarks !== undefined
    ).length || 0;
  };


  const handlePublishResult = async () => {
    try {
      const response = await publishExamResults(selectedExam.id);
      if (response.status === 200) {
        alert('Exam results published successfully!');
      }
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['exams', user._id] });
      setCurrentView('exams');
      setNavigationPath(navigationPath.slice(0, -1));

    } catch (error) {
      console.error('Error publishing exam results:', error);
      alert('Error publishing exam results. Please try again.');
    }

  }


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Exam Paper Evaluation</h1>
          <p className="text-gray-600 mt-2">Evaluate student submissions and publish results</p>
        </div>

        {currentView !== 'batches' && (
          <NavigationBreadcrumb path={navigationPath} onNavigate={handleNavigate} />
        )}




        {/* Warning Modal */}
        {showLockWarning && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-500 mr-3" />
                <h3 className="text-lg font-semibold">Unsaved Changes</h3>
              </div>

              <p className="text-gray-600 mb-6">
                You have unsaved changes for {selectedStudent?.name}. If you navigate away without locking the result,
                all changes will be lost.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowLockWarning(false);
                    setPendingNavigation(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLockAndContinue}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Lock & Continue
                </button>
                <button
                  onClick={handleConfirmNavigationWithoutLock}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Discard Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'batches' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Batch</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(batchMap).map(batch => (
                user.role === 'user' ?
                  (batch.id.includes(user.batch)) && (<BatchCard
                    key={batch.id}
                    batch={batch}
                    onSelect={handleBatchSelect}
                  />)
                  :
                  (<BatchCard
                    key={batch.id}
                    batch={batch}
                    onSelect={handleBatchSelect}
                  />)
              ))}
            </div>
          </div>
        )}

        {currentView === 'exams' && selectedBatch && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Exam</h2>
            <div className="space-y-4">
              {exams?.map(exam => (
                exam.batch_id === selectedBatch.id && (exam.exam_type === 'subjective' || exam.exam_type === 'semi_subjective') && (
                  <ExamCard key={exam.id} exam={exam} onSelect={handleExamSelect} />
                )
              ))}
            </div>
          </div>
        )}

        {currentView === 'students' && selectedExam && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Student List</h2>
              <button className="flex items-center text-blue-600 hover:text-blue-700">
                <Eye className="w-4 h-4 mr-1" />
                View Overview
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {students?.map(student => (
                <StudentCard
                  key={student._id}
                  student={student}
                  onSelect={handleStudentSelect}
                  result={localStudentResultMap[student._id] || studentResultMap[student._id]}
                  status={getStudentStatus(student._id)}
                />
              ))}
            </div>

            <ResultsOverview
              studentsData={data?.results || []}
              handlePublishResult={handlePublishResult}
              status={selectedExam?.status}
            />
          </div>
        )}

        {currentView === 'questions' && selectedStudent && (
          <QuestionsCard
            questions={questions}
            selectedStudent={selectedStudent}
            hasUnsavedChanges={hasUnsavedChanges}
            getUnsavedChangesCount={getUnsavedChangesCount}
            getStudentStatus={getStudentStatus}
            handleLockResult={handleLockResult}
            handleQuestionSelect={handleQuestionSelect}
            localStudentResultMap={localStudentResultMap}
          />
        )}

        {currentView === 'evaluate' && selectedQuestion && (
          <QuestionEvaluation
            question={selectedQuestion}
            result={localStudentResultMap[selectedStudent._id]}
            onUpdateMarks={(questionId, marks, feedback) => {
              // This can be used for additional logic if needed
            }}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
};

export default EvaluateExamPaper;