import React from 'react'
import { ExamCountdown, getExamTargetISO, toISTDisplayString } from './CountDownUtil';
import HeadingUtil from '../../../utility/HeadingUtil';
import ExamBadge from './ExamBadge';

const UpcomingExamCard = ({ upcomingExams , theme , isAiProctored , isElectronEnv}) => {
    
    return (
        <section className="mb-20">
            <div className="mb-12">
                <HeadingUtil 
                    heading="Upcoming Exams" 
                    subHeading="Scheduled exams that will be available soon"
                />
            </div>
            
            <div className="space-y-8">
                {upcomingExams && upcomingExams.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {upcomingExams.map((exam, idx) => (
                            <div
                                key={idx}
                                className={`
                                    relative overflow-hidden rounded-xl border transition-all duration-300
                                    hover:shadow-lg hover:-translate-y-1 group cursor-default
                                    ${theme === 'light' 
                                        ? 'bg-white border-gray-200 hover:border-indigo-600 hover:shadow-indigo-600/10' 
                                        : 'bg-gray-950 border-gray-800 hover:border-indigo-400 hover:shadow-indigo-400/10'
                                    }
                                `}
                                style={{
                                    animationDelay: `${idx * 100}ms`,
                                }}
                            >
                                {/* Top Border Accent */}
                                <div className={`h-1 w-full ${
                                    theme === 'light' ? 'bg-orange-500' : 'bg-orange-400'
                                }`}></div>
                                
                                {/* Upcoming Badge */}
                                <div className="absolute top-4 right-4 z-10">
                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                                        theme === 'light' 
                                            ? 'bg-orange-500 text-white' 
                                            : 'bg-orange-400 text-gray-950'
                                    }`}>
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Upcoming
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="mb-4">
                                        <ExamBadge exam={exam} theme={theme} isAiProctored={isAiProctored} isElectronEnv={isElectronEnv}/>
                                    </div>
                                    
                                    <div className="mb-6">
                                        <h3 className={`text-xl font-semibold mb-2 line-clamp-2 ${
                                            theme === 'light' ? 'text-gray-900' : 'text-white'
                                        }`}>
                                            {exam.name || 'Untitled Exam'}
                                        </h3>
                                    </div>

                                    {/* Exam Details */}
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                                    theme === 'light' ? 'bg-indigo-50' : 'bg-indigo-950'
                                                }`}>
                                                    <svg className={`w-3 h-3 ${
                                                        theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'
                                                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <span className={`text-sm font-medium ${
                                                    theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                                }`}>
                                                    Duration
                                                </span>
                                            </div>
                                            <span className={`text-sm font-semibold ${
                                                theme === 'light' ? 'text-gray-900' : 'text-white'
                                            }`}>
                                                {exam.duration || 'N/A'} min
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                                    theme === 'light' ? 'bg-indigo-50' : 'bg-indigo-950'
                                                }`}>
                                                    <svg className={`w-3 h-3 ${
                                                        theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'
                                                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <span className={`text-sm font-medium ${
                                                    theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                                }`}>
                                                    Total Marks
                                                </span>
                                            </div>
                                            <span className={`text-sm font-semibold ${
                                                theme === 'light' ? 'text-gray-900' : 'text-white'
                                            }`}>
                                                {exam.total_marks || 'N/A'}
                                            </span>
                                        </div>

                                        {/* Countdown */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                                    theme === 'light' ? 'bg-orange-50' : 'bg-orange-950'
                                                }`}>
                                                    <svg className={`w-3 h-3 ${
                                                        theme === 'light' ? 'text-orange-600' : 'text-orange-400'
                                                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <span className={`text-sm font-medium ${
                                                    theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                                                }`}>
                                                    Starts In
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <ExamCountdown exam={exam} theme={theme} />
                                            </div>
                                        </div>

                                        {(exam.date && exam.exam_time) && (
                                        <div className={`text-xs p-2 rounded-lg ${
                                            theme === 'light' ? 'bg-gray-50 text-gray-600' : 'bg-gray-900 text-gray-400'
                                        }`}>
                                            <div className="flex items-center gap-2">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                                            </svg>
                                            {toISTDisplayString(getExamTargetISO(exam))} IST
                                            </div>
                                        </div>
                                        )}

                                        {/* Divider */}
                                        <div className={`border-t ${
                                            theme === 'light' ? 'border-gray-100' : 'border-gray-800'
                                        }`}></div>
                                    </div>

                                    <button
                                        disabled={true}
                                        className={`
                                            w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200
                                            cursor-not-allowed opacity-50 ${
                                                theme === 'light' 
                                                    ? 'bg-gray-100 text-gray-400 border border-gray-200' 
                                                    : 'bg-gray-800 text-gray-500 border border-gray-700'
                                            }
                                        `}
                                    >
                                        Not Available Yet
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={`
                        text-center py-16 px-8 rounded-xl border-2 border-dashed
                        ${theme === 'light' 
                            ? 'border-gray-200 bg-gray-50' 
                            : 'border-gray-700 bg-gray-900'
                        }
                    `}>
                        <div className="mb-4">
                            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                                theme === 'light' ? 'bg-orange-50' : 'bg-orange-950'
                            }`}>
                                <svg className={`w-8 h-8 ${
                                    theme === 'light' ? 'text-orange-600' : 'text-orange-400'
                                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className={`text-lg font-semibold mb-2 ${
                            theme === 'light' ? 'text-gray-900' : 'text-white'
                        }`}>
                            No Upcoming Exams
                        </h3>
                        <p className={`text-sm ${
                            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                            There are no scheduled exams at the moment. Check with your instructor for updates.
                        </p>
                    </div>
                )}
            </div>
        </section>
    )
}

export default UpcomingExamCard