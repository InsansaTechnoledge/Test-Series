import { BookOpen, CalendarDays, Clock, Goal, ReceiptText } from 'lucide-react'
import React from 'react'
import dateFormatter from '../../../../../utils/dateFormatter';
import { useTheme } from '../../../../../hooks/useTheme';

const UpcomingExamCard = ({ data }) => {
    const { theme } = useTheme();
    
    const isDark = theme === 'dark';
    
    return (
        <div className={`
            group relative overflow-hidden
            hover:scale-[1.02] hover:-translate-y-1 
            duration-300 transition-all ease-out
            flex flex-col gap-4 
            shadow-lg hover:shadow-2xl
            ${isDark 
                ? 'bg-gray-950 border border-gray-800 hover:border-indigo-400/30' 
                : 'bg-white border border-gray-100 hover:border-indigo-200'
            }
            p-8 rounded-2xl
            before:absolute before:inset-0 before:bg-gradient-to-br 
            ${isDark 
                ? 'before:from-indigo-400/5 before:to-purple-400/5' 
                : 'before:from-indigo-50 before:to-blue-50'
            }
            before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300
        `}>
            {/* Header Section */}
            <div className='relative z-10 flex gap-5 items-center'>
                <div className={`
                    p-3 rounded-xl transition-all duration-300
                    ${isDark 
                        ? 'bg-indigo-400/10 group-hover:bg-indigo-400/20' 
                        : 'bg-indigo-50 group-hover:bg-indigo-100'
                    }
                `}>
                    <BookOpen className={`
                        w-8 h-8 transition-colors duration-300
                        ${isDark ? 'text-indigo-400' : 'text-indigo-600'}
                    `} />
                </div>
                <h3 className={`
                    text-2xl font-bold transition-colors duration-300
                    ${isDark ? 'text-white' : 'text-gray-900'}
                    group-hover:${isDark ? 'text-indigo-300' : 'text-indigo-700'}
                `}>
                    {data?.name}
                </h3>
            </div>
            
            {/* Description */}
            <div className={`
                text-sm leading-relaxed transition-colors duration-300
                ${isDark ? 'text-gray-300' : 'text-gray-600'}
            `}>
                <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    Description: 
                </span>
                <span className='ml-1'>{data?.description}</span>
            </div>
            
            {/* Decorative Divider */}
            <div className='relative my-2'>
                <div className={`
                    h-px w-full transition-all duration-300
                    ${isDark 
                        ? 'bg-gradient-to-r from-transparent via-gray-700 to-transparent' 
                        : 'bg-gradient-to-r from-transparent via-gray-300 to-transparent'
                    }
                `} />
                <div className={`
                    absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                    w-2 h-2 rounded-full transition-colors duration-300
                    ${isDark ? 'bg-indigo-400' : 'bg-indigo-600'}
                `} />
            </div>
            
            {/* Stats Grid */}
            <div className='grid grid-cols-2 gap-4'>
                <div className={`
                    flex items-center gap-3 p-3 rounded-xl transition-all duration-300
                    ${isDark 
                        ? 'bg-gray-900/50 hover:bg-gray-800/50' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }
                `}>
                    <Goal className={`
                        w-5 h-5 transition-colors duration-300
                        ${isDark ? 'text-indigo-400' : 'text-indigo-600'}
                    `} />
                    <div className='flex flex-col'>
                        <span className={`
                            text-xs font-medium transition-colors duration-300
                            ${isDark ? 'text-gray-400' : 'text-gray-500'}
                        `}>
                            Total Marks
                        </span>
                        <span className={`
                            font-bold transition-colors duration-300
                            ${isDark ? 'text-white' : 'text-gray-900'}
                        `}>
                            {data?.total_marks}
                        </span>
                    </div>
                </div>
                
                <div className={`
                    flex items-center gap-3 p-3 rounded-xl transition-all duration-300
                    ${isDark 
                        ? 'bg-gray-900/50 hover:bg-gray-800/50' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }
                `}>
                    <Clock className={`
                        w-5 h-5 transition-colors duration-300
                        ${isDark ? 'text-indigo-400' : 'text-indigo-600'}
                    `} />
                    <div className='flex flex-col'>
                        <span className={`
                            text-xs font-medium transition-colors duration-300
                            ${isDark ? 'text-gray-400' : 'text-gray-500'}
                        `}>
                            Duration
                        </span>
                        <span className={`
                            font-bold transition-colors duration-300
                            ${isDark ? 'text-white' : 'text-gray-900'}
                        `}>
                            {data?.duration} mins
                        </span>
                    </div>
                </div>
            </div>
            
            {/* Date Section */}
            <div className={`
                flex items-center gap-3 p-4 rounded-xl transition-all duration-300
                ${isDark 
                    ? 'bg-indigo-400/10 border border-indigo-400/20' 
                    : 'bg-indigo-50 border border-indigo-100'
                }
            `}>
                <CalendarDays className={`
                    w-5 h-5 transition-colors duration-300
                    ${isDark ? 'text-indigo-400' : 'text-indigo-600'}
                `} />
                <div className='flex flex-col'>
                    <span className={`
                        text-xs font-medium transition-colors duration-300
                        ${isDark ? 'text-indigo-300' : 'text-indigo-700'}
                    `}>
                        Exam Date
                    </span>
                    <span className={`
                        font-bold transition-colors duration-300
                        ${isDark ? 'text-indigo-200' : 'text-indigo-800'}
                    `}>
                        {dateFormatter(data?.date)}
                    </span>
                </div>
            </div>
            
            {/* Action Buttons */}
            <div className='grid grid-cols-2 gap-4 mt-4'>
                <button className={`
                    relative overflow-hidden group/btn
                    px-4 py-3 rounded-xl font-medium text-sm
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
                    px-4 py-3 rounded-xl font-medium text-sm
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
    )
}

export default UpcomingExamCard