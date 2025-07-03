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
                    group relative overflow-hidden max-w-md mx-auto
                    hover:scale-[1.02] hover:-translate-y-1 
                    duration-300 transition-all ease-out
                    flex flex-col gap-5 
                    shadow-lg hover:shadow-2xl w-[100%]
                    ${theme === 'light' 
                        ? 'bg-white border border-gray-200 hover:border-indigo-300 shadow-gray-200/50 hover:shadow-indigo-200/30' 
                        : 'bg-gray-800 border border-gray-700 hover:border-indigo-500/40 shadow-black/20 hover:shadow-indigo-500/20'
                    }
                    p-6 rounded-2xl
                    before:absolute before:inset-0 before:bg-gradient-to-br 
                    ${theme === 'light' 
                        ? 'before:from-indigo-50/80 before:to-blue-50/80' 
                        : 'before:from-indigo-400/5 before:to-purple-400/5'
                    }
                    before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300
                `}>
                    {/* Header Section with Live Badge */}
                    <div className='relative z-10 flex justify-between items-start'>
                        <div className='flex gap-4 items-center flex-1 min-w-0'>
                            <div className={`
                                p-3 rounded-xl transition-all duration-300 shrink-0
                                ${theme === 'light' 
                                    ? 'bg-indigo-100 group-hover:bg-indigo-200' 
                                    : 'bg-indigo-400/10 group-hover:bg-indigo-400/20'
                                }
                            `}>
                                <BookOpen className={`
                                    w-6 h-6 transition-colors duration-300
                                    ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}
                                `} />
                            </div>
                            <h3 className={`
                                text-lg font-bold transition-colors duration-300 truncate
                                ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                                group-hover:${theme === 'light' ? 'text-indigo-700' : 'text-indigo-300'}
                            `}>
                                {data.name}
                            </h3>
                        </div>
                        
                        {/* Live Badge with Animation */}
                        <div className={`
                            relative flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold text-xs
                            transition-all duration-300 ml-3 shrink-0
                            ${theme === 'light' 
                                ? 'bg-red-100 text-red-700 border border-red-200' 
                                : 'bg-red-900/30 text-red-400 border border-red-500/30'
                            }
                            group-hover:scale-105
                        `}>
                            <Radio className={`
                                w-4 h-4 animate-pulse
                                ${theme === 'light' ? 'text-red-600' : 'text-red-400'}
                            `} />
                            <span>Live</span>
                            {/* Pulsing dot animation */}
                            <div className={`
                                absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-ping
                                ${theme === 'light' ? 'bg-red-500' : 'bg-red-400'}
                            `} />
                            <div className={`
                                absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full
                                ${theme === 'light' ? 'bg-red-500' : 'bg-red-400'}
                            `} />
                        </div>
                    </div>
                    
                    {/* Description */}
                    <div className={`
                        text-sm leading-relaxed transition-colors duration-300 relative z-10
                        ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}
                    `}>
                        <span className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>
                            Description: 
                        </span>
                        <span className='ml-1 line-clamp-2'>{data.description}</span>
                    </div>
                    
                    {/* Stats Section */}
                    <div className='space-y-3 relative z-10'>
                        {/* Marks and Duration Row */}
                        <div className='grid grid-cols-2 gap-3'>
                            <div className={`
                                flex items-center gap-2 p-3 rounded-xl transition-all duration-300
                                ${theme === 'light' 
                                    ? 'bg-gray-50 hover:bg-gray-100' 
                                    : 'bg-gray-900/50 hover:bg-gray-800/50'
                                }
                            `}>
                                <Goal className={`
                                    w-4 h-4 transition-colors duration-300
                                    ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}
                                `} />
                                <div className='flex flex-col min-w-0'>
                                    <span className={`
                                        text-xs font-medium transition-colors duration-300
                                        ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}
                                    `}>
                                        Total Marks
                                    </span>
                                    <span className={`
                                        font-bold transition-colors duration-300 truncate
                                        ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                                    `}>
                                        {data.total_marks}
                                    </span>
                                </div>
                            </div>
                            
                            <div className={`
                                flex items-center gap-2 p-3 rounded-xl transition-all duration-300
                                ${theme === 'light' 
                                    ? 'bg-gray-50 hover:bg-gray-100' 
                                    : 'bg-gray-900/50 hover:bg-gray-800/50'
                                }
                            `}>
                                <Clock className={`
                                    w-4 h-4 transition-colors duration-300
                                    ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}
                                `} />
                                <div className='flex flex-col min-w-0'>
                                    <span className={`
                                        text-xs font-medium transition-colors duration-300
                                        ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}
                                    `}>
                                        Duration
                                    </span>
                                    <span className={`
                                        font-bold transition-colors duration-300 truncate
                                        ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                                    `}>
                                        {data.duration} mins
                                    </span>
                                </div>
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
                                ${theme === 'light' 
                                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300' 
                                    : 'bg-gray-800 text-indigo-300 border border-indigo-400/30 hover:bg-gray-700 hover:border-indigo-400/50'
                                }
                                before:absolute before:inset-0 before:bg-gradient-to-r 
                                ${theme === 'light' 
                                    ? 'before:from-indigo-100/0 before:to-indigo-200/50' 
                                    : 'before:from-indigo-400/0 before:to-indigo-400/10'
                                }
                                before:translate-x-full group-hover/btn:before:translate-x-0 before:transition-transform before:duration-300
                            `}>
                                <span className='relative z-10'>Syllabus</span>
                            </button>
                            
                            <button className={`
                                relative overflow-hidden group/btn
                                px-3 py-2 rounded-lg font-medium text-xs flex-1
                                transition-all duration-300 transform
                                hover:scale-[1.02] active:scale-[0.98]
                                ${theme === 'light' 
                                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300' 
                                    : 'bg-gray-800 text-indigo-300 border border-indigo-400/30 hover:bg-gray-700 hover:border-indigo-400/50'
                                }
                                before:absolute before:inset-0 before:bg-gradient-to-r 
                                ${theme === 'light' 
                                    ? 'before:from-indigo-100/0 before:to-indigo-200/50' 
                                    : 'before:from-indigo-400/0 before:to-indigo-400/10'
                                }
                                before:translate-x-full group-hover/btn:before:translate-x-0 before:transition-transform before:duration-300
                            `}>
                                <span className='relative z-10'>Guidelines</span>
                            </button>
                        </div>
                    </div>
                    
                    {/* Live Indicator Border Animation */}
                    <div className={`
                        absolute inset-0 rounded-2xl pointer-events-none
                        ${theme === 'light' ? 'bg-gradient-to-r from-red-500/10 via-transparent to-red-500/10' : 'bg-gradient-to-r from-red-400/20 via-transparent to-red-400/20'}
                        opacity-0 group-hover:opacity-100 transition-opacity duration-500
                        animate-pulse
                    `} />
                </div>
            );
        };
   

export default LiveExamCard