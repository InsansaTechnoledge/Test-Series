import { CheckCircle, ChevronRight, Clock, Save, Lock } from "lucide-react";


const QuestionCard = ({ 
    questions, 
    selectedStudent, 
    hasUnsavedChanges, 
    getUnsavedChangesCount, 
    getStudentStatus, 
    handleLockResult,
    handleQuestionSelect,
    localStudentResultMap
}) => {
    return (
        <div>
            {/* Student Status Bar */}
            { (
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <img
                                src={selectedStudent.profilePhoto}
                                alt={selectedStudent.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                                <h2 className="text-lg font-semibold">{selectedStudent.name}</h2>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStudentStatus(selectedStudent._id) === 'locked'
                                        ? 'bg-green-100 text-green-800'
                                        : getStudentStatus(selectedStudent._id) === 'unsaved-changes'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {getStudentStatus(selectedStudent._id) === 'locked' && 'Locked'}
                                    {getStudentStatus(selectedStudent._id) === 'unsaved-changes' && 'Unsaved Changes'}
                                    {getStudentStatus(selectedStudent._id) === 'in-progress' && 'In Progress'}
                                    {getStudentStatus(selectedStudent._id) === 'not-started' && 'Not Started'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            {hasUnsavedChanges && (
                                <span className="text-sm text-yellow-600 flex items-center">
                                    <Save className="w-4 h-4 mr-1" />
                                    {getUnsavedChangesCount()} unsaved changes
                                </span>
                            )}

                            <button
                                onClick={() => handleLockResult(selectedStudent._id)}
                                disabled={getStudentStatus(selectedStudent._id) === 'locked'}
                                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${getStudentStatus(selectedStudent._id) === 'locked'
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                            >
                                <Lock className="w-4 h-4" />
                                <span>
                                    {getStudentStatus(selectedStudent._id) === 'locked' ? 'Locked' : 'Lock Result'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Questions List */}
            { (
                <div>
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
                                            const resp = localStudentResultMap[selectedStudent._id]?.descriptiveResponses
                                                ?.find(r => r.questionId === question.id);

                                            if (!resp) return null;

                                            if (resp.obtainedMarks === null || resp.obtainedMarks === undefined) {
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
                                                        {resp.obtainedMarks}/{question.positive_marks}
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
        </div>
    );
}

export default QuestionCard;