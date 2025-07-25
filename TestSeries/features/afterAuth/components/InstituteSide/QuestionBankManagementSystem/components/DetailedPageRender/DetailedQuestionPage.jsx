import React from 'react';
import { renderQuestions } from './QuestionRenderFunction';
import Sidebar from './components/Sidebar';
import { ArrowLeft } from 'lucide-react';

const DetailedQuestionPage = ({ setSelectedQuestionType, selectedQuestionType, filteredQuestionsByType, categories }) => {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="h-full flex-shrink-0">
          <Sidebar 
            categories={categories} 
            setSelectedQuestionType={setSelectedQuestionType} 
            selectedQuestionType={selectedQuestionType} 
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 h-full overflow-y-auto">
          {/* Header */}
          <div className="bg-white border-b border-slate-200 px-8 py-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
               
                
                <div className="h-8 w-px bg-slate-200"></div>
                
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">
                    Questions Library
                  </h1>
                  <p className="text-slate-600 mt-1">
                    Viewing <span className="font-semibold capitalize text-slate-800">{selectedQuestionType}</span> questions
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                  {filteredQuestionsByType.length} questions
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {renderQuestions(filteredQuestionsByType, selectedQuestionType)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedQuestionPage;