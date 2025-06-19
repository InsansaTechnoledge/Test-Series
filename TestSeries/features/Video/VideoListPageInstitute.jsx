import React, { useEffect, useState } from 'react';
import { useCachedBatches } from '../../hooks/useCachedBatches';
import { DeleteVideoFromBatch } from '../../utils/services/batchService';
import Banner from "../../assests/Institute/uploaded videos.svg"
import { usePageAccess } from '../../contexts/PageAccessContext';


const VideoListPageInstitute = () => {
  const { batches } = useCachedBatches();
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [videoIds, setVideoIds] = useState([]);

  const canAccessPage = usePageAccess();



  useEffect(() => {
    if (selectedBatchId && batches) {
      const selectedBatch = batches.find(b => b.id === selectedBatchId);
      setVideoIds(selectedBatch?.video_ids || []);
    } else {
      setVideoIds([]);
    }
  }, [selectedBatchId, batches]);
  const handleDelete = async (videoId) => {
    try {
      await DeleteVideoFromBatch(selectedBatchId, videoId);
      setVideoIds((prev) => prev.filter(id => id !== videoId));
      alert('Video deleted successfully');
    } catch (err) {
      console.error('Failed to delete video:', err);
      alert('Error deleting video. Please try again.');
    }
  };
  if (!canAccessPage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
  
    <>

      <div className="relative overflow-hidden rounded-xl h-80 bg-gradient-to-b from-indigo-600 to-indigo-300 pb-32">
        {/* // Background Image */}
        <img
          src={Banner}
          alt="Upload Banner"
          className="absolute  w-full h-full object-cover"
        />


        <div className="absolute "></div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center h-full px-6 text-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
              Uploaded Video
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Upload and share educational videos with your institute community.
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto -mt-12 rounded-3xl shadow-2xl overflow-hidden bg-white/80 backdrop-blur-md ring-1 ring-white/10 p-10">
        <h1 className="text-center mb-12 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Videos for Selected Batch
        </h1>

        {/* Select Dropdown */}
        <div className="max-w-md mx-auto mb-14">
          <label htmlFor="batchSelect" className="block text-lg font-semibold mb-3 text-gray-700">
            Choose a batch to view its videos
          </label>
          <select
            id="batchSelect"
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="w-full py-3 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-800 shadow-sm"
          >
            <option value="">Select Batch</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videoIds.length > 0 ? (
            videoIds.map((videoId, index) => (
              <div
                key={index}
                className="bg-white/90 rounded-2xl overflow-hidden shadow-lg border border-gray-200 transition-all hover:shadow-2xl"
              >
                <iframe
                  width="100%"
                  height="220"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={`YouTube video ${index}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-t-2xl"
                ></iframe>

                <div className="p-4 flex justify-center items-center bg-gray-50 border-t">
                  {/* <span className="text-sm text-gray-600 font-medium">ID: {videoId}</span> */}
                  <button
                    onClick={() => handleDelete(videoId)}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-1.5 text-sm font-semibold rounded-lg shadow hover:scale-105 transition-transform"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500 text-lg mt-6">
              No videos available for this batch.
            </p>
          )}
        </div>
      </div>

    </>
  );
};

export default VideoListPageInstitute;
