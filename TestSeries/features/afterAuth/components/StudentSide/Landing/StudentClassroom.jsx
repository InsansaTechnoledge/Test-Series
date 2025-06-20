import React, { useEffect, useState } from 'react'
import { useCachedBatches } from '../../../../../hooks/useCachedBatches'
import { Play, BookOpen, Users  } from 'lucide-react'


const StudentClassroom = () => {

    const {batches} = useCachedBatches();
    const [videoIds , setVideoIds] = useState([])

    useEffect(() => {
        if(batches) {
            setVideoIds(batches[0]?.video_ids || [])
        }
        else{
            setVideoIds([])
        }
    },[batches])

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
           
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Educational Videos for {batches[0]?.name}
                    </h1>
                    <p className="text-gray-600 flex items-center space-x-2">
                      <span>{videoIds.length} videos available</span>
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg">
                  Active Batch
                </div>
              </div>
            </div>
    
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <Play className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900">Course Videos</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videoIds.length > 0 ? (
                  videoIds.map((videoId, index) => (
                    <div
                      key={index}
                      className="group relative bg-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200"
                    >
                      <div className="relative overflow-hidden">
                        <iframe
                          key={index}
                          width="100%"
                          height="200"
                          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`}
                          title={`YouTube video ${index + 1}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          referrerPolicy="strict-origin-when-cross-origin"
                        ></iframe>
                                                
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                              Video {index + 1}
                            </div>
                            <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                              Available
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mt-6 text-sm">
                          Part of {batches[0]?.name} curriculum
                        </p>
                      </div>
                      
                      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400 rounded-2xl transition-colors duration-300 pointer-events-none"></div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full">
                    <div className="text-center py-16">
                      <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                        <Play className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Videos Available</h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        No videos are currently available for this batch. Check back later or contact your instructor.
                      </p>
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