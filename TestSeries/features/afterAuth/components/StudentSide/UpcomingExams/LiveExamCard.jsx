import { BookOpen, CalendarDays, Clock, Goal, Radio } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../../../hooks/useTheme';

const LiveExamCard = ({ data, onStartTest }) => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    
    const isDark = theme === 'dark';

    const getButtonProps = () => {
        if (data.reapplicable) {
            if (data.hasAttempted) {
                return { label: 'Start Test Again', onClick: () => onStartTest(data.id) };
            }
            return { label: 'Start Test', onClick: () => onStartTest(data.id) };
        } else {
            if (data.hasAttempted) {
                return { label: 'View Result', onClick: () => navigate('/student/completed-exams') };
            }
            return { label: 'Start Test', onClick: () => onStartTest(data.id) };
        }
    };

    const { label, onClick } = getButtonProps();

    return (
        <div className={`
            group relative overflow-hidden
            hover:scale-[1.02] hover:-translate-y-1 
            duration-300 transition-all ease-out
            flex flex-col gap-5 
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
            {/* Header Section with Live Badge */}
            <div className='relative z-10 flex justify-between items-start'>
                <div className='flex gap-5 items-center flex-1'>
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
                        text-2xl font-bold transition-colors duration-300 flex-1
                        ${isDark ? 'text-white' : 'text-gray-900'}
                        group-hover:${isDark ? 'text-indigo-300' : 'text-indigo-700'}
                    `}>
                        {data.name}
                    </h3>
                </div>
                
                {/* Live Badge with Animation */}
                <div className={`
                    relative flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm
                    transition-all duration-300 ml-4
                    ${isDark 
                        ? 'bg-red-900/20 text-red-400 border border-red-500/30' 
                        : 'bg-red-50 text-red-600 border border-red-200'
                    }
                    group-hover:scale-105
                `}>
                    <Radio className={`
                        w-5 h-5 animate-pulse
                        ${isDark ? 'text-red-400' : 'text-red-600'}
                    `} />
                    <span>Live Now</span>
                    {/* Pulsing dot animation */}
                    <div className={`
                        absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping
                        ${isDark ? 'bg-red-400' : 'bg-red-500'}
                    `} />
                    <div className={`
                        absolute -top-1 -right-1 w-3 h-3 rounded-full
                        ${isDark ? 'bg-red-400' : 'bg-red-500'}
                    `} />
                </div>
            </div>
            
            {/* Description */}
            <div className={`
                text-sm leading-relaxed transition-colors duration-300
                ${isDark ? 'text-gray-300' : 'text-gray-600'}
            `}>
                <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    Description: 
                </span>
                <span className='ml-1'>{data.description}</span>
            </div>
            
            {/* Stats Section */}
            <div className='space-y-4'>
                {/* Marks and Duration Row */}
                <div className='grid grid-cols-2 gap-4'>
                    <div className={`
                        flex items-center gap-3 p-4 rounded-xl transition-all duration-300
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
                                {data.total_marks}
                            </span>
                        </div>
                    </div>
                    
                    <div className={`
                        flex items-center gap-3 p-4 rounded-xl transition-all duration-300
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
                                {data.duration} mins
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Action Buttons Section */}
            <div className='flex flex-col gap-4 mt-6'>
                {/* Info Buttons */}
                <div className='flex gap-3'>
                    <button className={`
                        relative overflow-hidden group/btn
                        px-4 py-3 rounded-xl font-medium text-sm flex-1
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
                        px-4 py-3 rounded-xl font-medium text-sm flex-1
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
                        <span className='relative z-10'>View Guidelines</span>
                    </button>
                </div>
                
                {/* Primary Action Button - Uncomment when needed */}
                {/* <button
                    onClick={onClick}
                    className={`
                        relative overflow-hidden group/btn
                        px-6 py-4 rounded-xl font-semibold text-base
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
                        ${data.hasAttempted && !data.reapplicable ? 
                            (isDark ? 'bg-green-400 hover:bg-green-300 text-gray-900' : 'bg-green-600 hover:bg-green-700 text-white') : ''
                        }
                    `}
                >
                    <span className='relative z-10 flex items-center gap-2'>
                        {label}
                        {data.hasAttempted && !data.reapplicable && (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                    </span>
                </button> */}
            </div>
            
            {/* Live Indicator Border Animation */}
            <div className={`
                absolute inset-0 rounded-2xl pointer-events-none
                ${isDark ? 'bg-gradient-to-r from-red-400/20 via-transparent to-red-400/20' : 'bg-gradient-to-r from-red-500/20 via-transparent to-red-500/20'}
                opacity-0 group-hover:opacity-100 transition-opacity duration-500
                animate-pulse
            `} />
        </div>
    )
}

export default LiveExamCard