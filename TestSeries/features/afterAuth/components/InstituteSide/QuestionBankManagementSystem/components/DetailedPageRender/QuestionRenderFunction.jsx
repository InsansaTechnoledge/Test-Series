import { CheckSquare, Edit3, Hash, HelpCircle, Edit, Move, Trash2 } from "lucide-react";
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
      case 'mcq': return <CheckSquare className="w-5 h-5 text-blue-400" />;
      case 'msq': return <CheckSquare className="w-5 h-5 text-purple-400" />;
      case 'fill': return <Edit3 className="w-5 h-5 text-green-400" />;
      default: return <HelpCircle className="w-5 h-5 text-orange-400" />;
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
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-4 bg-slate-100 rounded-full mb-4">
          <HelpCircle className="w-12 h-12 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-700 mb-2">No Questions Found</h3>
        <p className="text-slate-500 max-w-md">
          No {getQuestionTypeLabel(selectedQuestionType).toLowerCase()} questions are available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Questions List with Grid Layout */}
      <div className="space-y-4">
        {displayedQuestions.map((q, index) => {
          const originalIndex = filteredQuestionsByType.findIndex(question => question === q);
          return (
            <div
              key={`${originalIndex}-${index}`}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Left Column - Question Content (75% width on large screens) */}
                <div className="lg:col-span-9">
                  {/* Question Header */}
                  <div className="bg-gradient-to-r from-slate-50 to-white px-6 py-4 border-b border-slate-100 lg:border-r">
                    <div className="flex items-center gap-3">
                      {getQuestionIcon(selectedQuestionType)}
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-600">Question {originalIndex + 1}</span>
                      </div>
                      <div className="ml-auto">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium">
                          {getQuestionTypeLabel(selectedQuestionType)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Question Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <p className="text-lg text-slate-800 leading-relaxed font-medium">
                        {q.question_text || q.statement}
                      </p>
                    </div>

                    {/* Options for MCQ/MSQ */}
                    {(selectedQuestionType === 'mcq' || selectedQuestionType === 'msq') && q.options && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">
                          Options
                        </h4>
                        <div className="grid gap-2">
                          {q.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors"
                            >
                              <div className="flex-shrink-0 w-6 h-6 bg-white border-2 border-slate-300 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-slate-600">
                                  {String.fromCharCode(65 + optionIndex)}
                                </span>
                              </div>
                              <span className="text-slate-700">{option}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Action Buttons (25% width on large screens) */}
                <div className="lg:col-span-3 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-100">
                  <div className="p-6 h-full flex flex-col justify-center">
                    <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4 text-center">
                      Actions
                    </h4>
                    <div className="space-y-3">
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEdit(q, originalIndex)}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>

                      {/* Move Button */}
                      <button
                        onClick={() => handleMove(q, originalIndex)}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors font-medium"
                      >
                        <Move className="w-4 h-4" />
                        Move
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(q, originalIndex)}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>

                    {/* Question Position Info */}
                    <div className="mt-6 pt-4 border-t border-slate-200">
                      <div className="text-center">
                        <p className="text-xs text-slate-500 mb-1">Position</p>
                        <p className="text-sm font-medium text-slate-700">
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

      {/* Load More Button (as fallback) */}
      {!isLoading && 
       currentIndex < filteredQuestionsByType.length && 
       displayedQuestions.length > 0 && (
        <div className="flex items-center justify-center py-8">
          <button
            onClick={loadMoreQuestions}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            Load More Questions
          </button>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3 text-slate-600">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin"></div>
            <span className="text-sm font-medium">Loading more questions...</span>
          </div>
        </div>
      )}

      {/* End of Results Indicator */}
      {!isLoading && currentIndex >= filteredQuestionsByType.length && displayedQuestions.length > 0 && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-sm text-slate-500 mb-2">You've reached the end!</p>
            <p className="text-xs text-slate-400">
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