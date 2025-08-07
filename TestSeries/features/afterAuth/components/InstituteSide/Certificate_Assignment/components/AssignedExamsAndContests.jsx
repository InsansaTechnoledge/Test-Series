import { Award, BookOpen, X, Calendar, CheckCircle2, Package } from 'lucide-react';
import React, { useState } from 'react';

const AssignedExamsAndContests = ({ assignedItems, onRemove, handleAssignCertificateToTemplateOnBackend }) => {
    const [submitCoolDown, setSubmitCoolDown] = useState(true);

    if (assignedItems.length === 0) {
        return (
            <div className='max-w-7xl mx-auto mt-12'>
                <div className='bg-white border-2 border-gray-100 rounded-2xl shadow-sm overflow-hidden'>
                    {/* Header Section */}
                    <div className="bg-indigo-600 px-8 py-6 border-b border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className='font-bold text-2xl text-gray-100'>Assigned Exams & Contests (No Exams/Contest)</h2>
                        </div>
                        <p className="text-gray-200 text-lg">
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
        <div className=' max-w-7xl mx-auto mt-12'>
            <div className='bg-white border-2 border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden'>
                {/* Header Section */}
                <div className="bg-indigo-600 px-8 py-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className='font-bold text-2xl text-gray-100'>Assigned Exams & Contests For Submission</h2>
                            </div>
                            <p className="text-gray-200 text-lg">
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
                                    ? 'bg-indigo-400 text-white focus:ring-gray-100 shadow-gray-100'
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                {submitCoolDown ? (
                                    <>
                                        <CheckCircle2 className="w-8 h-8" />
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
                        <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
                        {/* <span className="text-sm font-medium text-blue-600">
                            {assignedItems.length} Assignment{assignedItems.length !== 1 ? 's' : ''} Ready
                        </span> */}
                        <span className="text-sm font-medium text-blue-600"><span className='text-gray-800'>Exams Selected: </span>{assignedItems?.filter(e => e.type === 'exam').length}</span>
                        <span className="text-sm font-medium text-blue-600"> <span className='text-gray-800'>Contests Selected: </span>{assignedItems?.filter(e => e.type === 'contest').length}</span>

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
                                    <div className=" flex items-center gap-3">
                                        <div className="rounded-lg flex items-center justify-center">
                                            <span className="text-indigo-600" >{item.type === 'exam' ? 'Exam Name :' : 'Contest Name :'}</span>
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
                                    <div className="rounded-md flex items-center justify-center">
                                        <span className='text-indigo-600'>Certificate Name :</span>
                                    </div>
                                    <span className="text-lg font-semibold text-gray-700">
                                        {item.templateName}
                                    </span>
                                </div>
                                
                                {/* Style Badge */}
                                <div className="flex gap-4 mb-4">
                                <div className="rounded-md flex items-center justify-center">
                                        <span className='text-indigo-600'>Certificate Type :</span>
                                    </div>
                                    <span className="inline-flex items-center text-xs font-medium text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                                        {item.templateStyle}
                                    </span>
                                </div>
                                
                                {/* Date */}
                                <div className="flex items-center gap-2 text-xs text-gray-500 pt-3 border-t border-gray-100">
                                    <Calendar size={12} />
                                    <span>Ready to Assign on {item.assignedDate}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Help Text */}
                    <div className="mt-8 p-4 bg-indigo-200 border border-gray-200 rounded-xl">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                            <span className="text-indigo-700 text-sm font-medium">
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