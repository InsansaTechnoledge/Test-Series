import React, { useEffect, useState, useMemo } from "react";
import { useCachedBatches } from "../../hooks/useCachedBatches";
import { DeleteVideoFromBatch } from "../../utils/services/batchService";
import Banner from "../../assests/Institute/uploaded videos.svg";
import { usePageAccess } from "../../contexts/PageAccessContext";
import { useTheme } from "../../hooks/useTheme";
import { useToast, ToastContainer } from "../../utils/Toaster";

const VideoListPageInstitute = () => {
  const { batches } = useCachedBatches();
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [videoIds, setVideoIds] = useState([]);
  const { theme } = useTheme();
  const { toasts, showToast, removeToast } = useToast();

  const canAccessPage = usePageAccess();

  // Memoize the selected batch to prevent unnecessary re-renders
  const selectedBatch = useMemo(() => {
    if (!selectedBatchId || !batches) return null;
    return batches.find((b) => b.id === selectedBatchId);
  }, [selectedBatchId, batches]);

  // Memoize video IDs to prevent infinite loops
  const currentVideoIds = useMemo(() => {
    return selectedBatch?.video_ids || [];
  }, [selectedBatch]);

  useEffect(() => {
    setVideoIds(currentVideoIds);
  }, [currentVideoIds]);

  const handleDelete = async (videoId) => {
    try {
      await DeleteVideoFromBatch(selectedBatchId, videoId);
      setVideoIds((prev) => prev.filter((id) => id !== videoId));
      showToast("Video deleted successfully", "error");
    } catch (err) {
      console.error("Failed to delete video:", err);
      showToast("Error deleting video. Please try again.", "error");
    }
  };

  if (!canAccessPage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You do not have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Banner */}
      <div className="relative overflow-hidden rounded-xl h-80">
        <img
          src={Banner}
          alt="Upload Banner"
          className="absolute w-full h-full object-cover"
        />
        <div
          className={`absolute inset-0 ${
            theme === "dark" ? "bg-gray-900/60" : "bg-black/20"
          }`}
        ></div>
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

      {/* Main Card */}
      <div
        className={`relative z-10 max-w-5xl mx-auto -mt-12 rounded-3xl shadow-xl overflow-hidden p-10 ${
          theme === "dark"
            ? "bg-gray-900 border border-gray-700"
            : "bg-white border border-gray-100"
        }`}
      >
        {/* Heading */}
        <h1
          className={`text-center mb-12 text-4xl font-extrabold ${
            theme === "dark"
              ? "text-indigo-400"
              : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
          }`}
        >
          Videos for Selected Batch
        </h1>

        {/* Batch Select */}
        <div className="max-w-md mx-auto mb-14">
          <label
            htmlFor="batchSelect"
            className={`block text-lg font-semibold mb-3 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Choose a batch to view its videos
          </label>
          <select
            id="batchSelect"
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className={`w-full py-3 px-4 rounded-xl border shadow-sm transition-all focus:outline-none focus:ring-2 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-600 text-white focus:ring-indigo-500"
                : "bg-white border-gray-300 text-gray-800 focus:ring-indigo-500"
            }`}
          >
            <option value="">Select Batch</option>
            {batches?.map((b) => (
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
                className={`rounded-2xl overflow-hidden border transition-all hover:shadow-2xl ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-600"
                    : "bg-white border-gray-200"
                }`}
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

                <div
                  className={`p-4 flex justify-center items-center ${
                    theme === "dark"
                      ? "bg-gray-900 border-t border-gray-700"
                      : "bg-gray-50 border-t"
                  }`}
                >
                  <button
                    onClick={() => handleDelete(videoId)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 text-sm font-semibold rounded-lg shadow hover:scale-105 transition-transform"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p
              className={`text-center col-span-full text-lg mt-6 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No videos available for this batch.
            </p>
          )}
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
};

export default VideoListPageInstitute;
