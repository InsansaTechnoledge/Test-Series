import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../../../hooks/useTheme';
import { BookOpen, Clock, Goal, Radio,  Zap } from 'lucide-react'
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
                group relative overflow-hidden w-full h-full min-h-[400px]
                hover:scale-[1.01] duration-500 transition-all ease-out
                ${theme === 'light' 
                    ? 'bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 border border-gray-200/50' 
                    : 'bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900/20 border border-gray-700/50'
                }
                rounded-3xl shadow-2xl hover:shadow-3xl
                before:absolute before:inset-0 before:bg-gradient-to-br 
                ${theme === 'light' 
                    ? 'before:from-indigo-500/5 before:via-purple-500/5 before:to-pink-500/5' 
                    : 'before:from-indigo-400/10 before:via-purple-400/10 before:to-pink-400/10'
                }
                before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-500
            `}>
                
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                    <div className={`
                        absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-20 animate-pulse
                        ${theme === 'light' ? 'bg-gradient-to-br  from-red-600 to-red-400' : 'bg-gradient-to-br from-red-600 to-red-400'}
                    `} />
                    <div className={`
                        absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-20 animate-pulse delay-1000
                        ${theme === 'light' ? 'bg-gradient-to-br from-red-600 to-red-400' : 'bg-gradient-to-br from-red-600 to-red-400'}
                    `} />
                </div>
    
                {/* Content Container */}
                <div className="relative z-10 h-full flex flex-col justify-between p-8">
                    
                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4 flex-1">
                            <div className={`
                                p-4 rounded-2xl transition-all duration-300 shrink-0
                                ${theme === 'light' 
                                    ? 'bg-gradient-to-br from-indigo-100 to-purple-100 group-hover:from-indigo-200 group-hover:to-purple-200' 
                                    : 'bg-gradient-to-br from-indigo-400/20 to-purple-400/20 group-hover:from-indigo-400/30 group-hover:to-purple-400/30'
                                }
                            `}>
                                <BookOpen className={`
                                    w-8 h-8 transition-all duration-300 group-hover:scale-110
                                    ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}
                                `} />
                            </div>
                            <div className="flex-1">
                                <h1 className={`
                                    text-3xl font-bold transition-colors duration-300 mb-2
                                    ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                                `}>
                                    {data.name}
                                </h1>
                                <p className={`
                                    text-sm opacity-75
                                    ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}
                                `}>
                                    Live Examination
                                </p>
                            </div>
                        </div>
                        
                        {/* Enhanced Live Badge */}
                        <div className={`
                            relative flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm
                            transition-all duration-300 shrink-0
                            ${theme === 'light' 
                                ? 'bg-gradient-to-r from-red-500 to-red-400 text-white shadow-lg shadow-red-500/30' 
                                : 'bg-gradient-to-r from-red-600 to-red-400 text-white shadow-lg shadow-red-600/30'
                            }
                            group-hover:scale-105 group-hover:shadow-xl
                        `}>
                            <Radio className="w-4 h-4 animate-pulse" />
                            <span>LIVE NOW</span>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping opacity-75" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full" />
                        </div>
                    </div>
    
                    {/* Description Section */}
                    <div className={`
                        mb-8 p-4 rounded-xl backdrop-blur-sm
                        ${theme === 'light' 
                            ? 'bg-white/50 border border-gray-200/50' 
                            : 'bg-gray-800/50 border border-gray-700/50'
                        }
                    `}>
                        <p className={`
                            text-sm leading-relaxed
                            ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}
                        `}>
                            <span className="font-semibold">Description:</span> {data.description}
                        </p>
                    </div>
    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className={`
                            flex items-center gap-3 p-4 rounded-xl transition-all duration-300
                            ${theme === 'light' 
                                ? 'bg-gradient-to-br from-white/80 to-indigo-50/80 border border-indigo-200/50 hover:from-indigo-50 hover:to-indigo-100' 
                                : 'bg-gradient-to-br from-gray-800/80 to-indigo-900/20 border border-indigo-500/20 hover:from-gray-700/80 hover:to-indigo-800/30'
                            }
                            group-hover:scale-105
                        `}>
                            <div className={`
                                p-3 rounded-xl
                                ${theme === 'light' ? 'bg-indigo-100' : 'bg-indigo-400/20'}
                            `}>
                                <Goal className={`
                                    w-5 h-5
                                    ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}
                                `} />
                            </div>
                            <div>
                                <p className={`
                                    text-xs font-medium opacity-75
                                    ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                                `}>
                                    Total Marks
                                </p>
                                <p className={`
                                    text-xl font-bold
                                    ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                                `}>
                                    {data.total_marks}
                                </p>
                            </div>
                        </div>
                        
                        <div className={`
                            flex items-center gap-3 p-4 rounded-xl transition-all duration-300
                            ${theme === 'light' 
                                ? 'bg-gradient-to-br from-white/80 to-purple-50/80 border border-purple-200/50 hover:from-purple-50 hover:to-purple-100' 
                                : 'bg-gradient-to-br from-gray-800/80 to-purple-900/20 border border-purple-500/20 hover:from-gray-700/80 hover:to-purple-800/30'
                            }
                            group-hover:scale-105
                        `}>
                            <div className={`
                                p-3 rounded-xl
                                ${theme === 'light' ? 'bg-purple-100' : 'bg-purple-400/20'}
                            `}>
                                <Clock className={`
                                    w-5 h-5
                                    ${theme === 'light' ? 'text-purple-600' : 'text-purple-400'}
                                `} />
                            </div>
                            <div>
                                <p className={`
                                    text-xs font-medium opacity-75
                                    ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                                `}>
                                    Duration
                                </p>
                                <p className={`
                                    text-xl font-bold
                                    ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                                `}>
                                    {data.duration} mins
                                </p>
                            </div>
                        </div>
                    </div>
    
                    {/* Action Buttons */}
                    <div className="flex flex-col gap-4">
                        {/* Info Buttons */}
                        <div className="flex gap-3">
                            <button className={`
                                relative overflow-hidden group/btn flex-1
                                px-4 py-3 rounded-xl font-medium text-sm
                                transition-all duration-300 transform
                                hover:scale-105 active:scale-95
                                ${theme === 'light' 
                                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200/50 hover:from-indigo-100 hover:to-purple-100' 
                                    : 'bg-gradient-to-r from-gray-800 to-indigo-900/30 text-indigo-300 border border-indigo-400/30 hover:from-gray-700 hover:to-indigo-800/50'
                                }
                                before:absolute before:inset-0 before:bg-gradient-to-r 
                                ${theme === 'light' 
                                    ? 'before:from-indigo-100/0 before:to-purple-200/50' 
                                    : 'before:from-indigo-400/0 before:to-purple-400/10'
                                }
                                before:translate-x-full group-hover/btn:before:translate-x-0 before:transition-transform before:duration-300
                            `}>
                                <span className="relative z-10">Syllabus</span>
                            </button>
                            
                            <button className={`
                                relative overflow-hidden group/btn flex-1
                                px-4 py-3 rounded-xl font-medium text-sm
                                transition-all duration-300 transform
                                hover:scale-105 active:scale-95
                                ${theme === 'light' 
                                    ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border border-purple-200/50 hover:from-purple-100 hover:to-pink-100' 
                                    : 'bg-gradient-to-r from-gray-800 to-purple-900/30 text-purple-300 border border-purple-400/30 hover:from-gray-700 hover:to-purple-800/50'
                                }
                                before:absolute before:inset-0 before:bg-gradient-to-r 
                                ${theme === 'light' 
                                    ? 'before:from-purple-100/0 before:to-pink-200/50' 
                                    : 'before:from-purple-400/0 before:to-pink-400/10'
                                }
                                before:translate-x-full group-hover/btn:before:translate-x-0 before:transition-transform before:duration-300
                            `}>
                                <span className="relative z-10">Guidelines</span>
                            </button>
                        </div>
    
                        {/* Main CTA Button */}
                        <button 
                            onClick={onClick}
                            className={`
                                relative overflow-hidden group/cta
                                w-full px-6 py-4 rounded-xl font-bold text-lg
                                transition-all duration-300 transform
                                hover:scale-105 active:scale-95
                                ${theme === 'light' 
                                    ? 'bg-gradient-to-r from-indigo-600 via-indigo-400 to-indigo-500 text-white shadow-lg shadow-indigo-500/30' 
                                    : 'bg-gradient-to-r  from-indigo-600 via-indigo-400 to-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                                }
                                hover:shadow-xl hover:shadow-indigo-500/40
                                before:absolute before:inset-0 before:bg-gradient-to-r 
                                before:from-white/0 before:via-white/10 before:to-white/0
                                before:translate-x-full group-hover/cta:before:translate-x-0 before:transition-transform before:duration-500
                            `}>
                            <div className="relative z-10 flex items-center justify-center gap-3">
                                <span>{label}</span>
                                <Zap className="w-5 h-5 animate-pulse" />
                            </div>
                        </button>
                    </div>
                </div>
    
                {/* Animated Border */}
                <div className={`
                    absolute inset-0 rounded-3xl pointer-events-none
                    bg-gradient-to-r from-transparent via-red-500/20 to-transparent
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500
                    before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-r 
                    before:from-red-500/10 before:via-transparent before:to-red-500/10
                    before:animate-pulse
                `} />
            </div>
        );
    };
    
   

export default LiveExamCard