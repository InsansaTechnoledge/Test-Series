import QuestionCategoriesBento from "./Bento/QuestionCategoriesBento";

import React from 'react'
import QBMSstats from "./QBMSstats";
import AllCategoriesBody from "./AllCategoriesBody";

const BodySkeleton = ({categories, QuestionLength , organizationId , setSelectedQuestionType , setShowAnalysis , theme}) => {
  return (
    <>
        <div className="mb-8">
            <QBMSstats categories={categories} QuestionLength={QuestionLength} theme={theme} />
            <AllCategoriesBody categories={categories} organizationId={organizationId} setSelectedQuestionType={setSelectedQuestionType} setShowAnalysis={setShowAnalysis} theme={theme}/>
        </div>
    </>
  )
}

export default BodySkeleton
