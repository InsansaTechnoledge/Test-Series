import React from 'react'

const AssignExamAndContests = ({ selectedCard, selectedExam, setSelectedExam, onAssign , Exams }) => {
    const handleExamAssign = () => {
        if (selectedCard && selectedExam) {
            onAssign();
        }
    };

    const isAssignDisabled = !selectedCard || !selectedExam;

    return (
        <div className='px-6 border border-gray-200 rounded-lg py-4 mt-12 mx-auto'>
            <h1 className='font-bold text-3xl text-gray-900 mb-1'>Assign Exam or Contest</h1>
            <span className='text-sm text-gray-500'>
              Select an exam or contest to assign the chosen certificate template
            </span>
          
            <div className="flex gap-4 mt-4">
                <select
                    id="examSelect"
                    name="examSelect"
                    value={selectedExam}
                    onChange={(e) => setSelectedExam(e.target.value)}
                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                    <option value="">Choose Exams or Contests</option>
                    {Exams.map(e => (
                        <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                </select>

                <button  
                    onClick={handleExamAssign}
                    disabled={isAssignDisabled}
                    className={`py-2 px-6 rounded-lg font-medium transition-colors duration-200 ${
                        isAssignDisabled 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer'
                    }`}
                >
                    Assign
                </button>
            </div>
        </div>
    );
};

export default AssignExamAndContests
