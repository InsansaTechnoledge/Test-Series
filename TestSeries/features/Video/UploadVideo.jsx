import React, { useEffect, useState } from "react";
import { uploadVideo } from "../../utils/services/videoService";
import { useCachedBatches } from "../../hooks/useCachedBatches";
import { useNavigate } from "react-router-dom";
import { usePageAccess } from "../../contexts/PageAccessContext";
import { useTheme } from "../../hooks/useTheme";
import { useToast, ToastContainer } from "../../utils/Toaster";

const UploadVideo = () => {
  const [video, setVideo] = useState();
  const [formData, setFormData] = useState({});
  const { batches } = useCachedBatches();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { toasts, showToast, removeToast } = useToast();

  const onChangeHandler = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const canAccessPage = usePageAccess();

  const handleSubmit = async () => {
    const response = await uploadVideo(formData);
    if (response.status == 200) {
      showToast("Video uploaded successfully", "success");
      navigate("/institute/institute-landing");
    }
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-gray-900"
          : "bg-gradient-to-br from-blue-50 to-white"
      } p-6`}
    >
      <div className="max-w-4xl mx-auto">
        <div
          className={`rounded-2xl shadow-xl border overflow-hidden ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-blue-100"
          }`}
        >
          {/* Header */}
          <div
            className={`px-8 py-6 ${
              theme === "dark"
                ? "bg-blue-600"
                : "bg-gradient-to-r from-blue-600 to-blue-700"
            }`}
          >
            <h1 className="text-3xl font-bold text-white mb-2">Upload Video</h1>
            <p className="text-blue-100">Share your content with the world</p>
          </div>

          {/* Content */}
          <div className={`px-8 py-8 ${theme === "dark" ? "bg-gray-800" : ""}`}>
            <div className="space-y-8">
              <div className="space-y-2">
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Select Batch
                </label>
                <select
                  name="batchId"
                  onChange={(e) =>
                    onChangeHandler(e.target.name, e.target.value)
                  }
                  value={formData?.batchId || ""}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300 ${
                    theme === "dark"
                      ? "border-gray-600 bg-gray-700 text-gray-200"
                      : "border-blue-200 bg-blue-50/30"
                  }`}
                >
                  <option value="" disabled>
                    Select a batch
                  </option>
                  {batches.map((batch, idx) => (
                    <option key={idx} value={batch.id}>
                      {batch.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title Input */}
              <div className="space-y-2">
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Video Title
                </label>
                <input
                  name="title"
                  onChange={(e) =>
                    onChangeHandler(e.target.name, e.target.value)
                  }
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300 ${
                    theme === "dark"
                      ? "border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400"
                      : "border-blue-200 bg-blue-50/30"
                  }`}
                  value={formData?.title || ""}
                  type="text"
                  placeholder="Enter a compelling title for your video"
                />
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Video Description
                </label>
                <textarea
                  name="description"
                  onChange={(e) =>
                    onChangeHandler(e.target.name, e.target.value)
                  }
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300 resize-y min-h-[120px] ${
                    theme === "dark"
                      ? "border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400"
                      : "border-blue-200 bg-blue-50/30"
                  }`}
                  value={formData?.description || ""}
                  placeholder="Describe your video content, include relevant keywords and tags"
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Upload Video File
                </label>
                <div className="relative">
                  <input
                    name="video"
                    onChange={(e) =>
                      onChangeHandler(e.target.name, e.target.files[0])
                    }
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer ${
                      theme === "dark"
                        ? "border-gray-600 bg-gray-700 text-gray-200"
                        : "border-blue-200 bg-blue-50/30"
                    }`}
                    type="file"
                    accept=".mp4, .mov"
                  />
                  <p
                    className={`text-xs mt-2 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Supported formats: MP4, MOV • Max file size: 2GB
                  </p>
                </div>
              </div>

              {/* Upload Guidelines */}
              <div
                className={`p-6 rounded-xl border ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gradient-to-r from-blue-50 to-white border-blue-200"
                }`}
              >
                <h3
                  className={`font-semibold mb-3 ${
                    theme === "dark" ? "text-blue-400" : "text-blue-700"
                  }`}
                >
                  Upload Guidelines
                </h3>
                <ul
                  className={`text-sm space-y-1 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  <li>
                    • Ensure your video content follows community guidelines
                  </li>
                  <li>• Use clear, descriptive titles and descriptions</li>
                  <li>• Choose appropriate tags for better discoverability</li>
                  <li>
                    • Upload high-quality content for the best viewer experience
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-4">
                <button
                  disabled={canAccessPage === false}
                  onClick={handleSubmit}
                  className={`font-semibold px-8 py-4 rounded-xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-4
                                    ${
                                      canAccessPage === false
                                        ? theme === "dark"
                                          ? "bg-gray-700 cursor-not-allowed text-red-400 focus:ring-0"
                                          : "bg-gray-300 cursor-not-allowed text-gray-600 focus:ring-0"
                                        : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-105 hover:shadow-2xl text-white focus:ring-blue-300"
                                    }
                                    `}
                >
                  <svg
                    className="w-5 h-5 inline-block mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  {canAccessPage === false ? "Access Denied" : "Upload Video"}
                </button>
                <p
                  className={`text-sm mt-3 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Your video will be processed and made available shortly
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default UploadVideo;
