import { Award, BookOpen, X, Calendar, CheckCircle2, Package } from 'lucide-react';
import React, { useState } from 'react';

const AssignedExamsAndContests = ({ assignedItems, onRemove, handleAssignCertificateToTemplateOnBackend }) => {
    const [submitCoolDown, setSubmitCoolDown] = useState(true);

    if (assignedItems.length === 0) {
        return (
            <div className='mx-auto mt-12'>
                <div className='bg-white border-2 border-gray-100 rounded-2xl shadow-sm overflow-hidden'>
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-8 py-6 border-b border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className='font-bold text-3xl text-gray-900'>Assigned Exams & Contests</h2>
                        </div>
                        <p className="text-gray-600 text-lg">
                            Manage your certificate assignments for exams and contests
                        </p>
                    </div>

                    {/* Empty State */}
                    <div className='px-8 py-16'>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Assignments Yet</h3>
                            <p className='text-gray-500'>
                                Select a certificate template and exam to get started with your first assignment.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='mx-auto mt-12'>
            <div className='bg-white border-2 border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden'>
                {/* Header Section */}
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-8 py-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className='font-bold text-3xl text-gray-900'>Assigned Exams & Contests</h2>
                            </div>
                            <p className="text-gray-600 text-lg">
                                Manage your certificate assignments for exams and contests
                            </p>
                        </div>

                        <button 
                            onClick={() => { 
                                if(submitCoolDown) {
                                    setSubmitCoolDown(false);
                                    handleAssignCertificateToTemplateOnBackend();
                                    setTimeout(() => {
                                        setSubmitCoolDown(true);
                                    }, 5000);
                                }
                            }}
                            disabled={!submitCoolDown}
                            className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 shadow-sm focus:outline-none focus:ring-4 ${
                                submitCoolDown
                                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 focus:ring-green-200 shadow-green-200'
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                {submitCoolDown ? (
                                    <>
                                        <CheckCircle2 className="w-5 h-5" />
                                        Confirm
                                    </>
                                ) : (
                                    'Please Wait...'
                                )}
                            </div>
                        </button>
                    </div>
                </div>

                {/* Content Section */}
                <div className="px-8 py-8">
                    {/* Status Info */}
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                        <span className="text-sm font-medium text-blue-600">
                            {assignedItems.length} Assignment{assignedItems.length !== 1 ? 's' : ''} Ready
                        </span>
                    </div>

                    {/* Assignments Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {assignedItems.map((item, index) => (
                            <div 
                                key={index} 
                                className="group bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200"
                            >
                                {/* Header with Remove Button */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                            <BookOpen size={16} className="text-indigo-600" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                                            {item.examName}
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => onRemove(index)}
                                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg p-1.5 transition-all duration-200"
                                        title="Remove assignment"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                
                                {/* Template Info */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-6 h-6 bg-amber-100 rounded-md flex items-center justify-center">
                                        <Award size={14} className="text-amber-600" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">
                                        {item.templateName}
                                    </span>
                                </div>
                                
                                {/* Style Badge */}
                                <div className="mb-4">
                                    <span className="inline-flex items-center text-xs font-medium text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                                        {item.templateStyle}
                                    </span>
                                </div>
                                
                                {/* Date */}
                                <div className="flex items-center gap-2 text-xs text-gray-500 pt-3 border-t border-gray-100">
                                    <Calendar size={12} />
                                    <span>Assigned on {item.assignedDate}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Help Text */}
                    <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-700 text-sm font-medium">
                                Click "Confirm" to save all assignments to the system.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignedExamsAndContests;