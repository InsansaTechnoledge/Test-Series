import React, { useEffect } from 'react';
import { useTheme } from '../../../hooks/useTheme';
import MarkingScheme from '../../constants/MarkingScheme';
import QuestionsAndImage from '../../constants/QuestionsAndImage';

const DescriptiveQuestion = ({ selectedQuestion, option, setOption }) => {
    const { theme } = useTheme();

    console.log("gr😩", selectedQuestion);

    useEffect(() => {
        if (selectedQuestion) {
            // Set existing response or empty string
            setOption(
                typeof selectedQuestion?.response === 'string'
                    ? selectedQuestion.response
                    : ""
            );
        }
    }, [selectedQuestion, setOption]);

    if (!selectedQuestion) return <div>No question selected.</div>;
    
    const min = selectedQuestion?.min_words ?? null;
    const max = selectedQuestion?.max_words ?? null;
    const words = (option || "").trim().split(/\s+/).filter(Boolean).length;
  
    const withinMin = min == null || words >= min;
    const withinMax = max == null || words <= max;

    // Handle copy/paste prevention and max word limit
    const handleKeyDown = (e) => {
        // Prevent Ctrl+V, Ctrl+C, Ctrl+X
        if (e.ctrlKey && (e.key === 'v' || e.key === 'c' || e.key === 'x')) {
            e.preventDefault();
        }
        // Prevent Cmd+V, Cmd+C, Cmd+X on Mac
        if (e.metaKey && (e.key === 'v' || e.key === 'c' || e.key === 'x')) {
            e.preventDefault();
        }
        
        // Prevent further input if max word limit is reached
        if (max != null && words >= max) {
            // Allow backspace, delete, arrow keys, and other navigation keys
            const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Tab'];
            if (!allowedKeys.includes(e.key)) {
                e.preventDefault();
            }
        }
    };

    const handleChange = (e) => {
        const newValue = e.target.value;
        const newWords = newValue.trim().split(/\s+/).filter(Boolean).length;
        
        // If there's a max limit and new input would exceed it, don't update
        if (max != null && newWords > max) {
            return;
        }
        
        setOption(newValue);
    };

    const handleContextMenu = (e) => {
        // Prevent right-click context menu
        e.preventDefault();
    };

    const handlePaste = (e) => {
        // Prevent paste event
        e.preventDefault();
    };

    const handleCopy = (e) => {
        // Prevent copy event
        e.preventDefault();
    };

    const handleCut = (e) => {
        // Prevent cut event
        e.preventDefault();
    };
  
    return (
        <div
            className={`space-y-2 px-6 transition-all duration-300 ${
                theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'
            }`}
        >
            <MarkingScheme selectedQuestion={selectedQuestion} theme={theme} />

            <QuestionsAndImage selectedQuestion={selectedQuestion} />

            {/* Word Count Instructions */}
            <div className={`p-4 border-l-4 rounded-r-lg ${
                theme === 'light' 
                    ? 'bg-blue-50 border-blue-400 text-blue-700' 
                    : 'bg-blue-900/30 border-blue-500 text-blue-300'
            }`}>
                <div className="flex items-center mb-2">
                    <svg className={`w-5 h-5 mr-2 ${
                        theme === 'light' ? 'text-blue-500' : 'text-blue-400'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className={`font-medium ${
                        theme === 'light' ? 'text-blue-800' : 'text-blue-200'
                    }`}>Writing Guidelines</span>
                </div>
                <p className={`text-sm font-medium ${
                    theme === 'light' ? 'text-blue-700' : 'text-blue-300'
                }`}>
                    {min && max && `Write between ${min}–${max} words.`}
                    {!min && max && `Write up to ${max} words.`}
                    {min && !max && `Write at least ${min} words.`}
                </p>
            </div>

            {/* Text Area */}
            <div className="space-y-3">
                <div className="relative">
                    <textarea
                        className={`w-full p-4 rounded-lg border-2 transition-all duration-200 shadow-sm focus:outline-none resize-none ${
                            theme === 'light' 
                                ? 'bg-white' 
                                : 'bg-gray-800 text-white'
                        } ${
                            withinMin && withinMax 
                                ? theme === 'light'
                                    ? "border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200" 
                                    : "border-green-600 focus:border-green-400 focus:ring-2 focus:ring-green-800"
                                : theme === 'light'
                                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                                    : "border-red-600 focus:border-red-400 focus:ring-2 focus:ring-red-800"
                        }`}
                        rows={8}
                        placeholder="Type your answer here... (Copy/paste is disabled)"
                        value={option || ""}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onContextMenu={handleContextMenu}
                        onPaste={handlePaste}
                        onCopy={handleCopy}
                        onCut={handleCut}
                        style={{ userSelect: 'text' }}
                    />
                    
                    {/* Typing indicator */}
                    {option && (
                        <div className="absolute bottom-3 right-3">
                            <div className="flex items-center space-x-1">
                                <div className={`w-2 h-2 rounded-full animate-pulse ${
                                    theme === 'light' ? 'bg-blue-400' : 'bg-blue-500'
                                }`}></div>
                                <div className={`w-2 h-2 rounded-full animate-pulse ${
                                    theme === 'light' ? 'bg-blue-400' : 'bg-blue-500'
                                }`} style={{animationDelay: '0.2s'}}></div>
                                <div className={`w-2 h-2 rounded-full animate-pulse ${
                                    theme === 'light' ? 'bg-blue-400' : 'bg-blue-500'
                                }`} style={{animationDelay: '0.4s'}}></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Word Count Display */}
                <div className={`flex items-center justify-between p-4 rounded-lg border shadow-sm ${
                    theme === 'light' 
                        ? 'bg-white border-gray-200' 
                        : 'bg-gray-800 border-gray-700'
                }`}>
                    <div className="flex items-center space-x-2">
                        <svg className={`w-5 h-5 ${
                            theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className={`text-sm font-medium ${
                            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                        }`}>Word count:</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        <span className={`text-lg font-bold px-3 py-1 rounded-full ${
                            withinMin && withinMax 
                                ? theme === 'light'
                                    ? "text-green-700 bg-green-100" 
                                    : "text-green-300 bg-green-900/50"
                                : theme === 'light'
                                    ? "text-red-700 bg-red-100"
                                    : "text-red-300 bg-red-900/50"
                        }`}>
                            {words}
                        </span>
                        
                        {max != null && words >= max && (
                            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
                                theme === 'light' 
                                    ? 'text-red-600 bg-red-50' 
                                    : 'text-red-400 bg-red-900/50'
                            }`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <span className="text-sm font-medium">
                                    {words === max ? 'Limit reached' : `${words - max} over limit`}
                                </span>
                            </div>
                        )}

                        {min != null && words < min && (
                            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
                                theme === 'light' 
                                    ? 'text-amber-600 bg-amber-50' 
                                    : 'text-amber-400 bg-amber-900/50'
                            }`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm font-medium">
                                    {min - words} more needed
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Security Notice */}
                <div className={`p-3 border rounded-lg ${
                    theme === 'light' 
                        ? 'bg-amber-50 border-amber-200' 
                        : 'bg-amber-900/20 border-amber-700'
                }`}>
                    <div className="flex items-center space-x-2">
                        <svg className={`w-4 h-4 ${
                            theme === 'light' ? 'text-amber-600' : 'text-amber-400'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-1a2 2 0 00-2-2H6a2 2 0 00-2 2v1a2 2 0 002 2zM12 10a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                        <span className={`text-xs font-medium ${
                            theme === 'light' ? 'text-amber-700' : 'text-amber-300'
                        }`}>
                            Copy and paste functions are disabled for this input field
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DescriptiveQuestion;