import React, { useEffect, useState } from 'react'
import { useCachedBatches } from '../../../../../hooks/useCachedBatches'
import { useTheme } from '../../../../../hooks/useTheme';

const StudentClassroom = () => {
    const {batches} = useCachedBatches();
    const [videoIds, setVideoIds] = useState([])
    const {theme} = useTheme();
    useEffect(() => {
        if(batches) {
            setVideoIds(batches[0]?.video_ids || [])
        }
        else{
            setVideoIds([])
        }
    },[batches])

    const isDarkMode = theme === 'dark';
   
    const themeClasses = isDarkMode 
        ? 'bg-gray-950 text-white' 
        : 'bg-white text-gray-900'

    const cardClasses = isDarkMode 
        ? 'bg-gray-900 border-gray-800' 
        : 'bg-white border-gray-200'

    const accentColor = isDarkMode ? 'indigo-400' : 'indigo-600'

    return (
        <div className={`min-h-screen transition-all duration-300 ${themeClasses}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Header Section */}
                <div className="relative overflow-hidden">
                    <div className={`rounded-3xl p-8 mb-8 backdrop-blur-sm border ${cardClasses} shadow-2xl`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between flex-wrap gap-6">
                                <div className="flex items-center space-x-6">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-${accentColor} to-purple-500 flex items-center justify-center shadow-lg`}>
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                            {batches[0]?.name || 'Learning Center'}
                                        </h1>
                                        <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                                            <span className="flex items-center space-x-2">
                                                <div className={`w-2 h-2 rounded-full bg-${accentColor}`}></div>
                                                <span>{videoIds.length} videos available</span>
                                            </span>
                                            <span className="text-sm">•</span>
                                            <span>Interactive Learning</span>
                                        </div>
                                    </div>
                                </div>
                               
                            </div>
                        </div>
                    </div>
                </div>

                {/* Video Grid Section */}
                <div className={`rounded-3xl p-8 backdrop-blur-sm border ${cardClasses} shadow-2xl`}>
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${accentColor} to-purple-500 flex items-center justify-center`}>
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a1.5 1.5 0 011.5 1.5v1a1.5 1.5 0 01-1.5 1.5H9m4.5-5H15a1.5 1.5 0 011.5 1.5v1a1.5 1.5 0 01-1.5 1.5h-1.5m-4.5 0h7.5" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-bold">Course Videos</h2>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {videoIds.length} items
                            </div>
                        </div>
                        
                        {videoIds.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {videoIds.map((videoId, index) => (
                                    <div
                                        key={index}
                                        className={`group relative rounded-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 ${cardClasses} shadow-lg hover:shadow-2xl`}
                                    >
                                        <div className="relative">
                                            <div className="aspect-video overflow-hidden">
                                                <iframe
                                                    width="100%"
                                                    height="100%"
                                                    src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`}
                                                    title={`Course Video ${index + 1}`}
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                    allowFullScreen
                                                    referrerPolicy="strict-origin-when-cross-origin"
                                                    className="rounded-t-2xl"
                                                ></iframe>
                                            </div>
                                            
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none rounded-t-2xl"></div>
                                            
                                            <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-${accentColor} text-white backdrop-blur-sm`}>
                                                Video {index + 1}
                                            </div>
                                        </div>
                                        
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    Lesson {index + 1}
                                                </h3>
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">Available</span>
                                                </div>
                                            </div>
                                            
                                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                                Part of {batches[0]?.name} curriculum
                                            </p>
                                            
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                                    <div className={`h-full bg-gradient-to-r from-${accentColor} to-purple-500 rounded-full transition-all duration-1000 group-hover:w-full`} style={{width: `${Math.random() * 60 + 20}%`}}></div>
                                                </div>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {Math.floor(Math.random() * 40 + 10)}min
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className={`absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-${accentColor} transition-all duration-300 pointer-events-none`}></div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {videoIds.length === 0 && (
                            <div className="text-center py-20">
                                <div className="relative mb-8">
                                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-3xl flex items-center justify-center shadow-inner">
                                        <svg className="w-16 h-16 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3" />
                                        </svg>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl w-32 h-32 mx-auto animate-pulse"></div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Videos Available</h3>
                                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-lg">
                                    Videos will appear here once they're added to your batch. Check back soon or contact your instructor.
                                </p>
                                <div className="mt-8">
                                    <button className={`px-6 py-3 bg-gradient-to-r from-${accentColor} to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
                                        Refresh Content
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentClassroom