import React from 'react';
import { ChevronRight } from 'lucide-react';

const steps = [
  {
    title: 'STEP 1',
    description: 'Click on Start Exam to begin the process.'
  },
  {
    title: 'STEP 2',
    description: 'System prompts to download proctor_engine.exe or .dmg based on your OS.'
  },
  {
    title: 'STEP 3',
    description: 'If already downloaded, you’ll see a confirmation to open the Test Window.'
  },
  {
    title: 'STEP 4',
    description: 'Test Window displays all guidelines. Read and accept them.'
  },
  {
    title: 'STEP 5',
    description: 'Click Start Exam inside the window to begin the proctored test.'
  }
];

const AiWorkingSteps = () => {
  return (
    <section className="bg-white py-16 px-6 md:px-20 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-3">
        How Ai Proctor Works
      </h2>
      <p className="text-red-600 max-w-xl border-b-2 py-2 mx-auto mb-12">
       Note: downloading is a one time process , user do not have to repeate it untill user delete the .exe/dmg file or there is a new update  
      </p>

      <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="text-left bg-blue-100 border-l-3  py-2 px-3 rounded-3xl max-w-xs">
              <p className="text-sm font-bold mb-3 text-blue-900 uppercase ">{step.title}</p>
              <p className="text-gray-700  py-3 px-2 w-3/4 text-sm text-left">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <ChevronRight className="text-blue-500 w-6 h-6" />
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default AiWorkingSteps;
