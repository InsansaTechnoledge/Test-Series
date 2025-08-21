import React, { useState } from 'react';
import { useUser } from "../../../contexts/currentUserContext";
import { ChevronRight, ChevronLeft, Users, FileText, CheckCircle, Clock, Award, Eye } from 'lucide-react';
import NavigationBreadcrumb from './components/Navigation';
import BatchCard from './components/BatchCard';
import ExamCard from './components/ExamCard';
import StudentCard from './components/StudentCard';
import ResultsOverview from './components/ResultsOverView';
import QuestionEvaluation from './components/QuestionEvaluator';
import { useCachedBatches } from '../../../hooks/useCachedBatches';
import { useCachedStudents } from '../../../hooks/useCachedStudents';
import { useExamManagement } from '../../../hooks/UseExam';
import { useCachedResultExamData } from './components/useResultExamData';


const EvaluateExamPaper = () => {
  const { user } = useUser();
  const [currentView, setCurrentView] = useState('batches');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [navigationPath, setNavigationPath] = useState(['Batches']);
  const { batchMap } = useCachedBatches();
  const { students } = useCachedStudents(user.role === 'user' ? selectedBatch?.id : null);
  const { exams } = useExamManagement();
  // const {questions} = useCachedQuestions(selectedExam?.id);
  const { data } = useCachedResultExamData(selectedExam?.id, true, null)
  const questions = data?.questions;
  const studentResultMap = Object.fromEntries((data?.results || []).map((r) => [r.studentId, r]));

  { console.log("Exam Data:", studentResultMap) }

  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch);
    setCurrentView('exams');
    setNavigationPath(['Batches', batch.name]);
  };

  const handleExamSelect = (exam) => {
    setSelectedExam(exam);
    setCurrentView('students');
    setNavigationPath(['Batches', selectedBatch.name, exam.name]);
  };

  const handleStudentSelect = (student) => {
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
    const views = ['batches', 'exams', 'students', 'questions', 'evaluate'];
    setCurrentView(views[index]);
    setNavigationPath(navigationPath.slice(0, index + 1));
  };

  const handleUpdateMarks = (questionId, marks, feedback) => {
    // Update marks logic here
    console.log('Updated marks for question:', questionId, marks, feedback);
  };

  const handleSave = () => {
    // Save logic here
    setCurrentView('questions');
    setNavigationPath(navigationPath.slice(0, -1));
  };

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
                <StudentCard key={student.id} student={student} onSelect={handleStudentSelect} result={studentResultMap[student._id]} />
              ))}
            </div>


            <ResultsOverview
              studentsData={data?.results || []}
            />
          </div>
        )}

        {currentView === 'questions' && selectedStudent && (
          <div>
            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedStudent.profilePhoto}
                  alt={selectedStudent.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedStudent.name}</h2>
                  {/* <p className="text-gray-600">Roll No: {selectedStudent.rollNo}</p> */}
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions</h3>
            <div className="space-y-4">
              {questions?.map((question, index) => (
                <div
                  key={question.id}
                  className="p-4 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-gray-300"
                  onClick={() => handleQuestionSelect(question)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Question {index + 1}</h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{question.question_text}</p>
                      <div className="mt-2 flex items-center space-x-4">
                        <span className="text-sm text-gray-500">Marks: {question.positive_marks}</span>
                        <span className="text-sm text-gray-500">Negative Marks: {question.negative_marks}</span>
                        <span className="text-sm text-gray-500">Type: {question.question_type.replace('_', ' ')}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {(() => {
                        const resp = studentResultMap[selectedStudent._id]?.descriptiveResponses
                          ?.find(r => r.questionId === question.id);

                        if (!resp) return null; // no response at all

                        if (resp.obtainedMarks === 0 && !resp.evaluated) {
                          return (
                            <>
                              <Clock className="w-5 h-5 text-yellow-500" />
                              <span className="text-sm text-yellow-700">Pending</span>
                            </>
                          );
                        }

                        return (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-sm font-medium text-green-700">
                              {resp.obtainedMarks}/{question.marks}
                            </span>
                          </>
                        );
                      })()}

                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'evaluate' && selectedQuestion && (
          <QuestionEvaluation
            question={selectedQuestion}
            result={studentResultMap[selectedStudent._id]}
            onUpdateMarks={handleUpdateMarks}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
};

export default EvaluateExamPaper;
