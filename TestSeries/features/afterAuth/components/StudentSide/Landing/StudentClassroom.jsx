import React, { useEffect, useState } from 'react'
import { useCachedBatches } from '../../../../../hooks/useCachedBatches'

const StudentClassroom = () => {

    const {batches} = useCachedBatches();
    const [videoIds , setVideoIds] = useState([])

    useEffect(() => {
        if(batches) {
            setVideoIds(batches?.video_ids || [])
        }
        else{
            setVideoIds([])
        }
    },[batches])

    console.log(batches)

  return (
    <div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videoIds.length > 0 ? (
          videoIds.map((videoId, index) => (
            <div
              key={index}
              className="rounded-lg overflow-hidden shadow-lg bg-white relative"
            >
              <iframe
                width="100%"
                height="200"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={`YouTube video ${index}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              
            </div>
          ))
        ) : (
          <p className="text-center col-spxan-full text-gray-500">
            No videos available for this batch.
          </p>
        )}
      </div>
    </div>
  )
}

export default StudentClassroom
