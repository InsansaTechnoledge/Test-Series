import React from 'react'
import { EyeIcon, Plus, Upload, X } from 'lucide-react';

const AddQuestionPart = ({handleAddingQuestions ,  isManuallyAddingQuestions , isBulkUploadingQuestions , setShowAnalysis , theme}) => {
    return (
      <div className="grid grid-cols-3 gap-4 w-full max-w-4xl">
        <button 
            onClick={() => handleAddingQuestions('manual')}
            className={`cursor-pointer flex items-center gap-2 text-lg ${isManuallyAddingQuestions ? 'text-red-600' : 'text-blue-600'} ${theme === 'light' ? 'bg-white' : 'bg-gray-900 hover:bg-gray-950'}  px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition`}>
            {!isManuallyAddingQuestions ? (
            <span className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Question
            </span>
            ) : 
            <span className="flex items-center gap-2">
                <X className="w-5 h-5" />
                Close Tab
            </span>}
        </button>
  
        <button 
            onClick={() => handleAddingQuestions('bulk')}
            className={`cursor-pointer flex items-center gap-2 text-lg ${isBulkUploadingQuestions ? 'text-red-600' : 'text-green-600'} ${theme === 'light' ? 'bg-white' : 'bg-gray-900 hover:bg-gray-950'}  px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition`}>
            {!isBulkUploadingQuestions ? (
                <span className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Bulk Upload Questions
                </span>
            ) : 
            <span className="flex items-center gap-2">
                <X className='w-5 h-5'/>
                Close Tab
            </span>
            }
          
        </button>
        <button
             onClick={() => setShowAnalysis(true)}
             className={`cursor-pointer flex items-center gap-2 text-lg text-blue-600 ${theme === 'light' ? 'bg-white' : 'bg-gray-900 hover:bg-gray-950'}  px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition`}>
            <EyeIcon/>
            Show Analysis
        </button>
      </div>
    );
  };

export default AddQuestionPart
