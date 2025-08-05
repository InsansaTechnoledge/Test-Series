import React, { useEffect, useState } from 'react';
import { useUser } from '../../../../../../contexts/currentUserContext';
import { Lock } from 'lucide-react';

const ExamControllSettings = ({user, handleChange, form, theme }) => {



  useEffect(() => {
    console.log("sfa", form.auto_submittable )
  },[form.auto_submittable])
  const isLight = theme === 'light';

  const cardStyle = `p-6 rounded-xl border backdrop-blur-sm transition-all hover:shadow-lg ${
    isLight
      ? 'bg-white/80 border-gray-200'
      : 'bg-gray-800/60 border-gray-700'
  }`;

  const labelText = isLight ? 'text-gray-800' : 'text-gray-100';
  const spanText = isLight ? 'text-gray-700' : 'text-gray-200';

  const [isAiProcted , setIsAiProcted] = useState(form.ai_proctored)

  return (
    <div className="space-y-6">

      {/* AI Proctoring */}
      <div className={cardStyle}>
        {
          (user?.planFeatures?.proctore_feature?.isActive &&  user?.planFeatures?.proctore_feature?.value) ?
          (
            <>
             <label htmlFor="ai_proctored" className={`font-semibold mb-3 flex items-center space-x-2 ${labelText}`}>
              <span>Enable AI Proctoring?</span>
             </label>
            <div className="flex items-center space-x-3 mt-2">
              <input
                id="ai_proctored"
                name="ai_proctored"
                type="checkbox"
                className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500 transition"
                onChange={(e) => {
                  setIsAiProcted(prev => !prev);
                  handleChange(e);
                }}
                
                checked={form.ai_proctored}
              />
              <span className={`font-medium ${spanText}`}>Yes</span>
            </div>
            </>
          ) : (
            <span className={`${theme === 'light' ? 'text-red-600' : 'text-red-400'} flex justify-between`}>Ai Proctor is not included in your plan <Lock/></span>
          )
        }
       
      </div>

      {/* Auto Submit on Proctor Violation */}
      {
        isAiProcted === true && ( 
          <div className={cardStyle}>
            <label htmlFor="auto_submittable" className={`font-semibold mb-3 flex items-center space-x-2 ${labelText}`}>
              <span>Auto-submit after 5 proctor violations?</span>
            </label>
            <div className="flex items-center space-x-3 mt-2">
              <input
                id="auto_submittable"
                name="auto_submittable"
                type="checkbox"
                className="h-5 w-5 text-red-600 border-gray-300 rounded focus:ring-red-500 transition"
                onChange={handleChange}
                checked={form.auto_submittable === undefined ? true : form.auto_submittable}
              />
              <span className={`font-medium ${spanText}`}>Enable</span>
            </div>
            <span className={`${theme === 'light' ? 'text-red-400' : 'text-red-600'}  text-xs`}>(We recommend Checking the Box)</span>
          </div>
        )
      }
     
      {/* Reapplicable */}
      <div className={cardStyle}>
        <label htmlFor="reapplicable" className={`font-semibold mb-3 flex items-center space-x-2 ${labelText}`}>
          <span>Can students apply multiple times?</span>
        </label>
        <div className="flex items-center space-x-3 mt-2">
          <input
            id="reapplicable"
            name="reapplicable"
            type="checkbox"
            className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition"
            onChange={handleChange}
            checked={form.reapplicable}
          />
          <span className={`font-medium ${spanText}`}>Allow reattempt</span>
        </div>
      </div>


    </div>
  );
};

export default ExamControllSettings;
