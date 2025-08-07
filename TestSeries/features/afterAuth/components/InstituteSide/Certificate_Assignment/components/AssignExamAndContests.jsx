import React from 'react';
import Select from 'react-select';

const AssignExamAndContests = ({ selectedCard, selectedExam, setSelectedExam, onAssign, Exams , assignedItems}) => {
  const handleExamAssign = () => {
    if (selectedCard && selectedExam) {
      onAssign();
    }
  };

  const isAssignDisabled = !selectedCard || !selectedExam;

  console.log("fr", {assignedItems} , Exams)

  // it would filter the exams that are even assigned but not submitted 
  const options = Exams?.filter(
    (e) => !assignedItems?.find((a) => a.examId === e.id)
  )?.map((e) => ({
    value: e.id,
    label: (
      <div className="flex items-center justify-between w-full py-1">
        <span className="font-medium text-gray-800">{e.name}</span>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full text-white shadow-sm ${
            e.type === 'exam' 
              ? 'bg-gradient-to-r from-green-400 to-green-500' 
              : 'bg-gradient-to-r from-indigo-400 to-indigo-500'
          }`}
        >
          {e.type.toUpperCase()}
        </span>
      </div>
    ),
  })) || [];
  
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '48px',
      border: state.isFocused ? '2px solid #6366f1' : '2px solid #e5e7eb',
      borderRadius: '12px',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(99, 102, 241, 0.1)' : 'none',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        border: '2px solid #6366f1',
      }
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af',
      fontSize: '16px',
      fontWeight: '500'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? '#6366f1' // bg after selected 
        : state.isFocused 
        ? '#f8fafc' 
        : 'white',
      color: state.isSelected ? 'white' : '#374151',
      padding: '12px 16px',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: state.isSelected ? '#6366f1' : '#f1f5f9'
      }
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '12px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      border: '1px solid #e5e7eb',
      overflow: 'hidden',
      zIndex: 9999, // High z-index to ensure it appears above other elements
    }),
    menuList: (provided) => ({
      ...provided,
      padding: '8px',
      maxHeight: '200px', // Limit height and add scroll
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999, // High z-index for portal
    })
  };

  return (
    <div className=" max-w-7xl mx-auto mt-12 rounded-2xl">
      <div className="bg-white border-2 border-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-visible">
        {/* Header Section */}
        <div className="bg-indigo-600 px-8 py-6 border-b rounded-t-2xl border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-bold text-2xl text-gray-100">Assign Exam or Contest</h1>
          </div>
          <p className="text-gray-100 text-sm">
            Select an exam or contest to assign the chosen certificate template
          </p>
        </div>

        {/* Content Section */}
        <div className="px-8 py-8">
          {/* Status Indicator */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${selectedCard ? 'bg-green-400' : 'bg-gray-300'}`}></div>
              <span className={`text-sm font-medium ${selectedCard ? 'text-green-600' : 'text-gray-500'}`}>
                Certificate {selectedCard ? 'Selected' : 'Not Selected'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${selectedExam ? 'bg-green-400' : 'bg-gray-300'}`}>
              </div>
              <span className={`text-sm font-medium ${selectedExam ? 'text-green-600' : 'text-gray-500'}`}>
                Exam/Contest {selectedExam ? 'Selected' : 'Not Selected'}
              </span>
            </div>
          </div>

          {/* Main Action Area */}
          <div className="flex gap-6 items-end">
            <div className="flex-1 relative z-10">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Choose Exam or Contest
              </label>
              <Select
                styles={customSelectStyles}
                options={options}
                placeholder="Search and select exams or contests..."
                isSearchable
                onChange={(selected) => {
                  if (selected) setSelectedExam(selected.value);
                  else setSelectedExam('');
                }}
                value={options.find(option => option.value === selectedExam) || null}
                noOptionsMessage={() => "No exams or contests found"}
                menuPortalTarget={document.body} // Render menu in document body
                menuPosition="fixed" // Use fixed positioning
                menuPlacement="auto" // Auto placement
              />
            </div>

            <button
              onClick={handleExamAssign}
              disabled={isAssignDisabled}
              className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 ${
                isAssignDisabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none transform-none'
                  : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 focus:ring-indigo-200 shadow-indigo-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Assign
              </div>
            </button>
          </div>

          {/* Help Text */}
          {!selectedCard && (
            <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-indigo-700 text-sm font-medium">
                  Please select a certificate template first before assigning an exam or contest.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignExamAndContests;