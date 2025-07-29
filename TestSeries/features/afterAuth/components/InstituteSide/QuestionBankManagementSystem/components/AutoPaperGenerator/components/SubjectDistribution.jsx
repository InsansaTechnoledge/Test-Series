import React from 'react'
const SubjectDistribution = ({ formData, handleSubjectChange, distributeMarksEqually, filteredSubjectCounts, totalSelectedMarks }) => {
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-gray-800">Subject Marks Distribution</h3>
          <button
            onClick={distributeMarksEqually}
            className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
          >
            Auto Distribute
          </button>
        </div>
        
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {Object.keys(filteredSubjectCounts).map(subject => (
            <div key={subject} className="flex items-center justify-between bg-white p-2 rounded border">
              <div className="flex-1">
                <div className="font-medium text-gray-800 text-xs">{subject}</div>
                <div className="text-xs text-gray-500">Available: {filteredSubjectCounts[subject]}</div>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max={formData.totalMarks}
                  className="w-12 px-1 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.subjects[subject] || 0}
                  onChange={(e) => handleSubjectChange(subject, e.target.value)}
                />
                <span className="text-xs text-gray-500">marks</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-3 p-2 bg-blue-50 rounded">
          <div className="text-xs">
            <span className="font-medium">Allocated: {totalSelectedMarks}</span>
            <span className="text-gray-600 ml-1">/ Target: {formData.totalMarks}</span>
          </div>
          {totalSelectedMarks !== formData.totalMarks && (
            <div className="text-xs text-orange-600 mt-1">
              {totalSelectedMarks > formData.totalMarks 
                ? `Excess: ${totalSelectedMarks - formData.totalMarks} marks` 
                : `Remaining: ${formData.totalMarks - totalSelectedMarks} marks`
              }
            </div>
          )}
        </div>
      </div>
    );
  };

export default SubjectDistribution
