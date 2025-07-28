import React from 'react';

const SubjectDistribution = ({ 
  formData, 
  handleSubjectChange, 
  distributeMarksEqually, 
  filteredSubjectCounts, 
  totalSelectedMarks 
}) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Subject Marks Distribution</h3>
        <button
          onClick={distributeMarksEqually}
          className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
        >
          Auto Distribute
        </button>
      </div>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {Object.keys(filteredSubjectCounts).map(subject => (
          <div key={subject} className="flex items-center justify-between bg-white p-3 rounded border">
            <div className="flex-1">
              <div className="font-medium text-gray-800 text-sm">{subject}</div>
              <div className="text-xs text-gray-500">
                Available Questions: {filteredSubjectCounts[subject]}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max={formData.totalMarks}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.subjects[subject] || 0}
                onChange={(e) => handleSubjectChange(subject, e.target.value)}
              />
              <span className="text-xs text-gray-500">marks</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded">
        <div className="text-sm">
          <span className="font-medium">Allocated Marks: {totalSelectedMarks}</span>
          <span className="text-gray-600 ml-2">/ Target: {formData.totalMarks}</span>
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

export default SubjectDistribution;