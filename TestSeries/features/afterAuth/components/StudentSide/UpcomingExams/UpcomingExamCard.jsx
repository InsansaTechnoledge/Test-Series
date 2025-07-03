import { BookOpen, CalendarDays, Clock, Goal, ReceiptText } from 'lucide-react'
import React from 'react'
import dateFormatter from '../../../../../utils/dateFormatter';
import { useTheme } from '../../../../../hooks/useTheme';

const UpcomingExamCard = ({ data }) => {
    const { theme } = useTheme();
    
    const isDark = theme === 'dark';
    
    return (
    
        <div className={`
            group relative overflow-hidden max-w-md mx-auto
            hover:scale-[1.02] hover:-translate-y-1 
            duration-300 transition-all ease-out
            flex flex-col gap-5 
            shadow-lg hover:shadow-2xl w-[100%]
            ${isDark 
                ? 'bg-gray-800 border border-gray-700 hover:border-indigo-500/40 shadow-black/20 hover:shadow-indigo-500/20' 
                : 'bg-white border border-gray-200 hover:border-indigo-300 shadow-gray-200/50 hover:shadow-indigo-200/30'
            }
            p-6 rounded-2xl
            before:absolute before:inset-0 before:bg-gradient-to-br 
            ${isDark 
                ? 'before:from-indigo-400/5 before:to-purple-400/5' 
                : 'before:from-indigo-50/80 before:to-blue-50/80'
            }
            before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300
        `}>
            {/* Header Section with Upcoming Badge */}
            <div className='relative z-10 flex justify-between items-start'>
                <div className='flex gap-4 items-center flex-1 min-w-0'>
                    <div className={`
                        p-3 rounded-xl transition-all duration-300 shrink-0
                        ${isDark 
                            ? 'bg-indigo-400/10 group-hover:bg-indigo-400/20' 
                            : 'bg-indigo-100 group-hover:bg-indigo-200'
                        }
                    `}>
                        <BookOpen className={`
                            w-6 h-6 transition-colors duration-300
                            ${isDark ? 'text-indigo-400' : 'text-indigo-600'}
                        `} />
                    </div>
                    <h3 className={`
                        text-lg font-bold transition-colors duration-300 truncate
                        ${isDark ? 'text-white' : 'text-gray-900'}
                        group-hover:${isDark ? 'text-indigo-300' : 'text-indigo-700'}
                    `}>
                        {data?.name}
                    </h3>
                </div>
                
                {/* Upcoming Badge */}
                <div className={`
                    relative flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold text-xs
                    transition-all duration-300 ml-3 shrink-0
                    ${isDark 
                        ? 'bg-blue-900/30 text-blue-400 border border-blue-500/30' 
                        : 'bg-blue-100 text-blue-700 border border-blue-200'
                    }
                    group-hover:scale-105
                `}>
                    <CalendarDays className={`
                        w-4 h-4
                        ${isDark ? 'text-blue-400' : 'text-blue-600'}
                    `} />
                    <span>Upcoming</span>
                </div>
            </div>
            
            {/* Description */}
            <div className={`
                text-sm leading-relaxed transition-colors duration-300 relative z-10
                ${isDark ? 'text-gray-300' : 'text-gray-600'}
            `}>
                <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    Description: 
                </span>
                <span className='ml-1 line-clamp-2'>{data?.description}</span>
            </div>
            
            {/* Stats Section */}
            <div className='space-y-3 relative z-10'>
                {/* Marks and Duration Row */}
                <div className='grid grid-cols-2 gap-3'>
                    <div className={`
                        flex items-center gap-2 p-3 rounded-xl transition-all duration-300
                        ${isDark 
                            ? 'bg-gray-900/50 hover:bg-gray-800/50' 
                            : 'bg-gray-50 hover:bg-gray-100'
                        }
                    `}>
                        <Goal className={`
                            w-4 h-4 transition-colors duration-300
                            ${isDark ? 'text-indigo-400' : 'text-indigo-600'}
                        `} />
                        <div className='flex flex-col min-w-0'>
                            <span className={`
                                text-xs font-medium transition-colors duration-300
                                ${isDark ? 'text-gray-400' : 'text-gray-500'}
                            `}>
                                Total Marks
                            </span>
                            <span className={`
                                font-bold transition-colors duration-300 truncate
                                ${isDark ? 'text-white' : 'text-gray-900'}
                            `}>
                                {data?.total_marks}
                            </span>
                        </div>
                    </div>
                    
                    <div className={`
                        flex items-center gap-2 p-3 rounded-xl transition-all duration-300
                        ${isDark 
                            ? 'bg-gray-900/50 hover:bg-gray-800/50' 
                            : 'bg-gray-50 hover:bg-gray-100'
                        }
                    `}>
                        <Clock className={`
                            w-4 h-4 transition-colors duration-300
                            ${isDark ? 'text-indigo-400' : 'text-indigo-600'}
                        `} />
                        <div className='flex flex-col min-w-0'>
                            <span className={`
                                text-xs font-medium transition-colors duration-300
                                ${isDark ? 'text-gray-400' : 'text-gray-500'}
                            `}>
                                Duration
                            </span>
                            <span className={`
                                font-bold transition-colors duration-300 truncate
                                ${isDark ? 'text-white' : 'text-gray-900'}
                            `}>
                                {data?.duration} mins
                            </span>
                        </div>
                    </div>
                </div>
                
                {/* Date Section */}
                <div className={`
                    flex items-center gap-3 p-3 rounded-xl transition-all duration-300
                    ${isDark 
                        ? 'bg-indigo-400/10 border border-indigo-400/20' 
                        : 'bg-indigo-50 border border-indigo-100'
                    }
                `}>
                    <CalendarDays className={`
                        w-4 h-4 transition-colors duration-300
                        ${isDark ? 'text-indigo-400' : 'text-indigo-600'}
                    `} />
                    <div className='flex flex-col min-w-0'>
                        <span className={`
                            text-xs font-medium transition-colors duration-300
                            ${isDark ? 'text-indigo-300' : 'text-indigo-700'}
                        `}>
                            Exam Date
                        </span>
                        <span className={`
                            font-bold transition-colors duration-300 truncate
                            ${isDark ? 'text-indigo-200' : 'text-indigo-800'}
                        `}>
                            {dateFormatter(data?.date)}
                        </span>
                    </div>
                </div>
            </div>
            
            {/* Action Buttons Section */}
            <div className='flex flex-col gap-3 mt-4 relative z-10'>
                {/* Info Buttons */}
                <div className='flex gap-2'>
                    <button className={`
                        relative overflow-hidden group/btn
                        px-3 py-2 rounded-lg font-medium text-xs flex-1
                        transition-all duration-300 transform
                        hover:scale-[1.02] active:scale-[0.98]
                        ${isDark 
                            ? 'bg-gray-800 text-indigo-300 border border-indigo-400/30 hover:bg-gray-700 hover:border-indigo-400/50' 
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300'
                        }
                        before:absolute before:inset-0 before:bg-gradient-to-r 
                        ${isDark 
                            ? 'before:from-indigo-400/0 before:to-indigo-400/10' 
                            : 'before:from-indigo-100/0 before:to-indigo-200/50'
                        }
                        before:translate-x-full group-hover/btn:before:translate-x-0 before:transition-transform before:duration-300
                    `}>
                        <span className='relative z-10'>View Syllabus</span>
                    </button>
                    
                    <button className={`
                        relative overflow-hidden group/btn
                        px-3 py-2 rounded-lg font-medium text-xs flex-1
                        transition-all duration-300 transform
                        hover:scale-[1.02] active:scale-[0.98]
                        ${isDark 
                            ? 'bg-indigo-400 text-gray-900 hover:bg-indigo-300 hover:shadow-lg hover:shadow-indigo-400/25' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/25'
                        }
                        before:absolute before:inset-0 before:bg-gradient-to-r 
                        ${isDark 
                            ? 'before:from-indigo-300/0 before:to-indigo-200/30' 
                            : 'before:from-indigo-500/0 before:to-indigo-400/30'
                        }
                        before:translate-x-full group-hover/btn:before:translate-x-0 before:transition-transform before:duration-300
                    `}>
                        <span className='relative z-10'>View Guidelines</span>
                    </button>
                </div>
            </div>
        </div>

        
    )
}

export default UpcomingExamCard