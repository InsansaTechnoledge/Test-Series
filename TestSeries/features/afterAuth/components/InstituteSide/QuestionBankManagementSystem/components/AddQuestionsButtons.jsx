import React from 'react'
import { Plus, Upload, X } from 'lucide-react';

const AddQuestionPart = ({handleAddingQuestions ,  isManuallyAddingQuestions , isBulkUploadingQuestions}) => {
    return (
      <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
        <button 
            onClick={() => handleAddingQuestions('manual')}
            className={`cursor-pointer flex items-center gap-2 text-lg ${isManuallyAddingQuestions ? 'text-red-600' : 'text-blue-600'}  bg-white px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition`}>
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
            className={`cursor-pointer flex items-center gap-2 text-lg ${isBulkUploadingQuestions ? 'text-red-600' : 'text-green-600'}  bg-white px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition`}>
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
      </div>
    );
  };

export default AddQuestionPart
