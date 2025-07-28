import React, { useState } from 'react';
import QuestionCategoriesBento from './Bento/QuestionCategoriesBento';
import AddQuestionPart from './AddQuestionsButtons';
import BulkUploadSection from './UploadingQuestions/BulkUploadSection';
import ManualUploadSection from './UploadingQuestions/ManualUploadSection';



const AllCategoriesBody = ({ categories , organizationId , setSelectedQuestionType , setShowAnalysis , theme}) => {
    const [isManuallyAddingQuestions , setIsManuallyAddingQuestions] = useState(false);
    const [isBulkUploadingQuestions , setIsBulkUploadingQuestions] = useState(false);

    const [questions, setQuestions] = useState([]);

    const handleAddingQuestions = (type) => {
        if(type === 'manual') {
            if(isBulkUploadingQuestions) {
                setIsBulkUploadingQuestions(false)
            }
            setIsManuallyAddingQuestions(p => !p)
        }
        else if(type === 'bulk') {
            if(isManuallyAddingQuestions) {
                setIsManuallyAddingQuestions(false)
            }
            setIsBulkUploadingQuestions(p => !p)
        }
    }

  return (
    <div className={`mt-8 ${theme === 'light' ? 'bg-white border-gray-200 ' : ' bg-gray-800 border-gray-600'} mx-6 rounded-2xl border  py-6 shadow-sm`}>
      <div className="mb-6">
        {/* Header with buttons */}
        <div className="px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className={`${theme === 'dark' && 'text-indigo-100'} text-3xl font-semibold mb-2`}>
            { isManuallyAddingQuestions || isBulkUploadingQuestions ? (isBulkUploadingQuestions ? 'Adding questions in Bulk' : 'Adding questions Manually') : 'All Categories of Questions'}
          </h1>
          <AddQuestionPart 
            handleAddingQuestions={handleAddingQuestions}
            isManuallyAddingQuestions={isManuallyAddingQuestions}
            isBulkUploadingQuestions={isBulkUploadingQuestions}
            setShowAnalysis={setShowAnalysis}
            theme={theme}
          />
        </div>

        {/* Bento Grid or uploading question section */}
        {
            isBulkUploadingQuestions || isManuallyAddingQuestions ? 
                (isBulkUploadingQuestions ? 
                        <BulkUploadSection 
                            setQuestions={setQuestions}
                            organizationId={organizationId}
                            questions={questions}
                           
                        /> 
                    : 
                        <ManualUploadSection 
                            setQuestions={setQuestions}
                            organizationId={organizationId}
                            questions={questions}
                        />
                ) : 

                <QuestionCategoriesBento 
                    categories={categories} 
                    organizationId={organizationId}
                    setSelectedQuestionType={setSelectedQuestionType}
                    theme={theme}
                    
                />
        }
      </div>
    </div>
  );
};

export default AllCategoriesBody;
