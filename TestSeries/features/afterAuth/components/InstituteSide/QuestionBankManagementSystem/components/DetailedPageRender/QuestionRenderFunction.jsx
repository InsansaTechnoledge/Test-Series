import { CheckSquare, Edit3, Hash, HelpCircle, Edit, Move, Trash2, Eye } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import React from "react";

// Convert to a proper React component
export const QuestionList = ({ 
  filteredQuestionsByType = [], 
  selectedQuestionType, 
  onEdit, 
  onMove, 
  onDelete 
}) => {
  const [displayedQuestions, setDisplayedQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const questionsPerLoad = 10;
  
  const getQuestionIcon = (type) => {
    switch (type) {
      case 'mcq': return <CheckSquare className="w-5 h-5 text-blue-500" />;
      case 'msq': return <CheckSquare className="w-5 h-5 text-purple-500" />;
      case 'fill': return <Edit3 className="w-5 h-5 text-green-500" />;
      default: return <HelpCircle className="w-5 h-5 text-orange-500" />;
    }
  };

  const getQuestionTypeLabel = (type) => {
    switch (type) {
      case 'mcq': return 'Multiple Choice Question';
      case 'msq': return 'Multiple Select Question';
      case 'fill': return 'Fill in the Blanks';
      default: return 'Question';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'mcq': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'msq': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'fill': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-orange-50 text-orange-700 border-orange-200';
    }
  };

  const getDifficultyStyle = (difficulty) => {
    const level = difficulty?.toLowerCase();
    switch (level) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  // Helper function to format CO's as array
  const formatCOs = (co) => {
    if (!co) return [];
    if (Array.isArray(co)) return co;
    if (typeof co === 'string') {
      // Handle comma-separated COs
      return co.split(',').map(item => item.trim()).filter(item => item);
    }
    return [co.toString()];
  };

  // Load initial questions
  useEffect(() => {
    if (filteredQuestionsByType.length > 0) {
      const initialQuestions = filteredQuestionsByType.slice(0, questionsPerLoad);
      setDisplayedQuestions(initialQuestions);
      setCurrentIndex(questionsPerLoad);
    } else {
      setDisplayedQuestions([]);
      setCurrentIndex(0);
    }
  }, [filteredQuestionsByType, selectedQuestionType]);

  // Load more questions
  const loadMoreQuestions = useCallback(() => {
    if (isLoading || currentIndex >= filteredQuestionsByType.length) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      const nextQuestions = filteredQuestionsByType.slice(
        currentIndex, 
        currentIndex + questionsPerLoad
      );
      
      setDisplayedQuestions(prev => [...prev, ...nextQuestions]);
      setCurrentIndex(prev => prev + questionsPerLoad);
      setIsLoading(false);
    }, 200);
  }, [currentIndex, filteredQuestionsByType, isLoading]);

  // Fixed infinite scroll handler with proper threshold
  const handleScroll = useCallback(() => {
    // Check if user has scrolled near the bottom (within 100px)
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Trigger when user is within 100px of the bottom
    if (scrollTop + windowHeight >= documentHeight - 100) {
      loadMoreQuestions();
    }
  }, [loadMoreQuestions]);

  // Attach scroll listener with proper cleanup
  useEffect(() => {
    const throttledHandleScroll = throttle(handleScroll, 200);
    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [handleScroll]);

  // Throttle function to prevent excessive scroll event firing
  const throttle = (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  };

  // Handle action callbacks with fallbacks
  const handleEdit = (question, index) => {
    if (onEdit && typeof onEdit === 'function') {
      onEdit(question, index);
    } else {
      console.log('Edit question:', question);
    }
  };

  const handleMove = (question, index) => {
    if (onMove && typeof onMove === 'function') {
      onMove(question, index);
    } else {
      console.log('Move question:', question);
    }
  };

  const handleDelete = (question, index) => {
    if (onDelete && typeof onDelete === 'function') {
      onDelete(question, index);
    } else {
      console.log('Delete question:', question);
    }
  };

  if (filteredQuestionsByType.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-xl opacity-30 scale-150"></div>
          <div className="relative p-6 bg-white rounded-full shadow-lg border border-gray-100">
            <HelpCircle className="w-16 h-16 text-gray-400" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3 mt-6">No Questions Found</h3>
        <p className="text-gray-500 max-w-md text-lg leading-relaxed">
          No {getQuestionTypeLabel(selectedQuestionType).toLowerCase()} questions are available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mobile Layout */}
      <div className="block lg:hidden">
        <div className="space-y-6">
          {displayedQuestions.map((q, index) => {
            const originalIndex = filteredQuestionsByType.findIndex(question => question === q);
            const cos = formatCOs(q?.CO);
            
            return (
              <div
                key={`${originalIndex}-${index}`}
                className="group bg-white rounded-3xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-gray-300 transition-all duration-500 overflow-hidden transform hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Mobile Header */}
                <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 px-4 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getQuestionIcon(selectedQuestionType)}
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-700">Q{originalIndex + 1}</span>
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1.5 rounded-full font-medium border ${getTypeColor(selectedQuestionType)}`}>
                      {getQuestionTypeLabel(selectedQuestionType)}
                    </span>
                  </div>
                </div>

                {/* Mobile Content */}
                <div className="p-4">
                  <div className="mb-4">
                    <p className="text-base text-gray-800 leading-relaxed font-medium">
                      {q.question_text || q.statement}
                    </p>
                  </div>

                  {/* Mobile Options */}
                  {(selectedQuestionType === 'mcq' || selectedQuestionType === 'msq') && q.options && (
                    <div className="mb-4">
                      <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
                        Options
                      </h4>
                      <div className="space-y-2">
                        {q.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex-shrink-0 w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center shadow-sm">
                              <span className="text-xs font-bold text-gray-600">
                                {String.fromCharCode(65 + optionIndex)}
                              </span>
                            </div>
                            <span className="text-gray-700 text-sm">{option}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mobile Metadata */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center">
                      <span className="text-xs text-gray-500 block mb-1">Difficulty</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getDifficultyStyle(q?.difficulty)}`}>
                        {q?.difficulty || 'Unknown'}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="text-xs text-gray-500 block mb-1">CO's</span>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {cos.length > 0 ? cos.map((co, coIndex) => (
                          <span key={coIndex} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium border border-gray-200">
                            {co}
                          </span>
                        )) : (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium border border-gray-200">
                            Unknown
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center">
                      <span className="text-xs text-gray-500 block mb-1">Bloom's Level</span>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium border border-gray-200 truncate">
                        {q?.bloom_level || 'Unknown'}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="text-xs text-gray-500 block mb-1">Subject</span>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium border border-gray-200 truncate">
                        {q?.subject || 'Unknown'}
                      </span>
                    </div>
                  </div>

                  {/* Mobile Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(q, originalIndex)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors font-medium text-sm border border-blue-200"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleMove(q, originalIndex)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors font-medium text-sm border border-amber-200"
                    >
                      <Move className="w-4 h-4" />
                      Move
                    </button>
                    <button
                      onClick={() => handleDelete(q, originalIndex)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors font-medium text-sm border border-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop Tabular Layout */}
      <div className="hidden lg:block">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-13 gap-0">
              <div className="col-span-1 px-4 py-4 text-center">
                <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">Sr No.</span>
              </div>
              <div className="col-span-4 px-6 py-4 border-l border-gray-200">
                <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">Question</span>
              </div>
              <div className="col-span-1 px-4 py-4 text-center border-l border-gray-200">
                <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">Difficulty</span>
              </div>
              <div className="col-span-1 px-4 py-4 text-center border-l border-gray-200">
                <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">CO's</span>
              </div>
              <div className="col-span-2 px-4 py-4 text-center border-l border-gray-200">
                <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">Bloom's Level</span>
              </div>
              <div className="col-span-2 px-4 py-4 text-center border-l border-gray-200">
                <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">Subject</span>
              </div>
              <div className="col-span-2 px-4 py-4 text-center border-l border-gray-200">
                <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">Actions</span>
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {displayedQuestions.map((q, index) => {
              const originalIndex = filteredQuestionsByType.findIndex(question => question === q);
              const cos = formatCOs(q?.CO);
              
              return (
                <div
                  key={`${originalIndex}-${index}`}
                  className="group hover:bg-gray-50 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="grid grid-cols-13 gap-0 items-start">
                    {/* Question Number */}
                    <div className="col-span-1 px-4 py-6 text-center">
                      <div className="flex flex-col items-center gap-2">
                        {/* <div className="transform group-hover:scale-110 transition-transform duration-300">
                          {getQuestionIcon(selectedQuestionType)}
                        </div> */}
                        <div className="flex items-center gap-1">
                          <Hash className="w-3 h-3 text-gray-400" />
                          <span className="text-sm font-bold text-gray-700">{originalIndex + 1}</span>
                        </div>
                        {/* <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getTypeColor(selectedQuestionType)}`}>
                          {selectedQuestionType.toUpperCase()}
                        </span> */}
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="col-span-4 px-6 py-6 border-l border-gray-100">
                      <div className="space-y-4">
                        <p className="text-base text-gray-800 leading-relaxed font-medium">
                          {q.question_text || q.statement}
                        </p>

                        {/* Options for MCQ/MSQ */}
                        {(selectedQuestionType === 'mcq' || selectedQuestionType === 'msq') && q.options && (
                          <div className="space-y-3">
                            <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-2">
                              <Eye className="w-3 h-3" />
                              Options
                            </h4>
                            <div className="space-y-2">
                              {q.options.map((option, optionIndex) => (
                                <div
                                  key={optionIndex}
                                  className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 group/option"
                                >
                                  <div className="flex-shrink-0 w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center shadow-sm group-hover/option:border-blue-400 transition-all duration-200">
                                    <span className="text-xs font-bold text-gray-600 group-hover/option:text-blue-600">
                                      {String.fromCharCode(65 + optionIndex)}
                                    </span>
                                  </div>
                                  <span className="text-sm text-gray-700 group-hover/option:text-gray-800">{option}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Difficulty */}
                    <div className="col-span-1 px-4 py-6 text-center border-l border-gray-100">
                      <span className={`text-xs px-3 py-1.5 rounded-full font-medium border ${getDifficultyStyle(q?.difficulty)}`}>
                        {q?.difficulty || 'Unknown'}
                      </span>
                    </div>

                    {/* CO's */}
                    <div className="col-span-1 px-4 py-6 text-center border-l border-gray-100">
                      <div className="flex flex-col gap-1">
                        {cos.length > 0 ? cos.map((co, coIndex) => (
                          <span key={coIndex} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium border border-gray-200">
                            {co}
                          </span>
                        )) : (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium border border-gray-200">
                            Unknown
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bloom's Level */}
                    <div className="col-span-2 px-4 py-6 text-center border-l border-gray-100">
                      <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full font-medium border border-gray-200">
                        {q?.bloom_level || 'Unknown'}
                      </span>
                    </div>

                    {/* Subject */}
                    <div className="col-span-2 px-4 py-6 text-center border-l border-gray-100">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1.5 rounded-full font-medium border border-gray-200">
                        {q?.subject || 'Unknown'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 px-4 py-6 text-center border-l border-gray-100">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleEdit(q, originalIndex)}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-blue-600  rounded-lg transition-all duration-300 font-medium text-sm  transform hover:scale-105"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleMove(q, originalIndex)}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-amber-600  rounded-lg transition-all duration-300 font-medium text-sm   transform hover:scale-105"
                        >
                          <Move className="w-3 h-3" />
                          Move
                        </button>
                        <button
                          onClick={() => handleDelete(q, originalIndex)}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-red-600  rounded-lg transition-all duration-300 font-medium text-sm transform hover:scale-105"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                        
                        {/* Position Info */}
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                            <p className="text-xs font-bold text-gray-700">
                              {originalIndex + 1} of {filteredQuestionsByType.length}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Load More Button (as fallback) */}
      {!isLoading && 
       currentIndex < filteredQuestionsByType.length && 
       displayedQuestions.length > 0 && (
        <div className="flex items-center justify-center py-8">
          <button
            onClick={loadMoreQuestions}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Load More Questions
          </button>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-4 text-gray-600 bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="relative">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-8 h-8 border-4 border-transparent border-r-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
            </div>
            <span className="text-sm font-semibold">Loading more questions...</span>
          </div>
        </div>
      )}

      {/* End of Results Indicator */}
      {!isLoading && currentIndex >= filteredQuestionsByType.length && displayedQuestions.length > 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center rounded-2xl p-8 ">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center">
              <CheckSquare className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-lg font-bold text-gray-800 mb-2">All Questions Loaded!</p>
            <p className="text-sm text-gray-500">
              Showing all {filteredQuestionsByType.length} questions
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Legacy function wrapper for backward compatibility (without hooks)
export const renderQuestions = (filteredQuestionsByType, selectedQuestionType, onEdit, onMove, onDelete) => {
  // This is just a JSX element, not using hooks
  return (
    <QuestionList
      filteredQuestionsByType={filteredQuestionsByType}
      selectedQuestionType={selectedQuestionType}
      onEdit={onEdit}
      onMove={onMove}
      onDelete={onDelete}
    />
  );
};