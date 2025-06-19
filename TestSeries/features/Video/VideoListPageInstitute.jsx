import React, { useEffect, useState } from 'react';
import { useCachedBatches } from '../../hooks/useCachedBatches';
import { DeleteVideoFromBatch } from '../../utils/services/batchService';

const VideoListPageInstitute = () => {
  const { batches } = useCachedBatches();
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [videoIds, setVideoIds] = useState([]);

  useEffect(() => {
    if (selectedBatchId) {
      const selectedBatch = batches.find(b => b.id === selectedBatchId);
      setVideoIds(selectedBatch?.video_ids || []);
    } else {
      setVideoIds([]);
    }
  }, [selectedBatchId, batches]);

  const handleDelete = async (videoId) => {
    try {
      console.log('Deleting video:', videoId, 'from batch:', selectedBatchId);
  
      await DeleteVideoFromBatch(selectedBatchId, videoId);
  
      setVideoIds((prev) => prev.filter(id => id !== videoId));
  
      // Optional: Show toast or alert
      alert('Video deleted successfully');
    } catch (err) {
      console.error('Failed to delete video:', err);
      alert('Error deleting video. Please try again.');
    }
  };
  

  return (
    <div className="p-6">
      <h1 className='text-center mb-8 text-4xl font-bold'>
        Videos for Selected Batch
      </h1>

      <div className="max-w-md mx-auto mb-10">
        <label htmlFor="batchSelect" className="block font-semibold mb-2">
          Choose a batch to view its videos
        </label>

        <select
          id="batchSelect"
          value={selectedBatchId}
          onChange={(e) => setSelectedBatchId(e.target.value)}
          className='border-2 border-gray-400 w-full py-3 px-2 rounded-md focus:outline-none focus:border-black'
        >
          <option value="">Select Batch </option>
          {batches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

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
              <div className="p-3 flex justify-between items-center">
                <span className="text-sm text-gray-700">ID: {videoId}</span>
                <button
                  onClick={() => handleDelete(videoId)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No videos available for this batch.
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoListPageInstitute;
