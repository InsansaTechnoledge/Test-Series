import { Award, BookOpen, X } from 'lucide-react';
import React from 'react'

const AssignedExamsAndContests = ({ assignedItems, onRemove , handleAssignCertificateToTemplateOnBackend}) => {
    if (assignedItems.length === 0) {
        return (
            <div className='px-6 border border-gray-200 rounded-lg py-8 mt-12 mx-auto'>
                <h2 className='font-bold text-2xl text-gray-900 mb-2'>Assigned Exams & Contests</h2>
                <p className='text-gray-500 text-center py-8'>No assignments yet. Select a certificate template and exam to get started.</p>
            </div>
        );
    }

    return (
        <div className='px-6 border border-gray-200 rounded-lg  py-6 mt-12 mx-auto'>
            <div className='flex justify-between px-12'>
            <div>
            <h2 className='font-bold text-2xl text-gray-900 mb-4'>Assigned Exams & Contests</h2>
            <span className='text-sm text-gray-500 mb-6 block'>
                Manage your certificate assignments for exams and contests
            </span>
            </div>

            <button 
                onClick={() => handleAssignCertificateToTemplateOnBackend()}
                className='bg-green-600 px-3 py-4 rounded-2xl text-lg text-gray-50 w-sm cursor-pointer'
                >
                Confirm
            </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assignedItems.map((item, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <BookOpen size={20} className="text-indigo-600" />
                                <h3 className="font-semibold text-gray-800">{item.examName}</h3>
                            </div>
                            <button
                                onClick={() => onRemove(index)}
                                className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                                title="Remove assignment"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                            <Award size={16} className="text-amber-500" />
                            <span className="text-sm font-medium text-gray-700">{item.templateName}</span>
                        </div>
                        
                        <span className="inline-block text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                            {item.templateStyle}
                        </span>
                        
                        <div className="mt-3 text-xs text-gray-400">
                            Assigned on {item.assignedDate}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AssignedExamsAndContests
