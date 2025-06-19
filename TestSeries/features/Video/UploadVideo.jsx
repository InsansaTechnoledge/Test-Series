import React, { useEffect, useState } from 'react'
import { uploadVideo } from '../../utils/services/videoService';
import { useCachedBatches } from '../../hooks/useCachedBatches';
import {useNavigate} from 'react-router-dom'
import { usePageAccess } from '../../contexts/PageAccessContext';

const UploadVideo = () => {
    const [video, setVideo] = useState();
    const [formData, setFormData] = useState({});
    const { batches } = useCachedBatches();
    const navigate=useNavigate();

    const onChangeHandler = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const canAccessPage = usePageAccess();

    useEffect(() => {  
        console.log("sdf",canAccessPage)
    },[])

    const handleSubmit = async () => {
        console.log(formData);
        const response = await uploadVideo(formData);
        if (response.status == 200) {
            console.log(response.data);
            alert("Video uploaded successfully");
            navigate('/institute/institute-landing');
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                        <h1 className="text-3xl font-bold text-white mb-2">Upload Video</h1>
                        <p className="text-blue-100">Share your content with the world</p>
                    </div>

                    {/* Content */}
                    <div className="px-8 py-8">
                        <div className="space-y-8">

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Select Batch
                                </label>
                                <select
                                    name="batchId"
                                    onChange={(e) => onChangeHandler(e.target.name, e.target.value)}
                                    value={formData?.batchId || ''}
                                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300 bg-blue-50/30"
                                >
                                    <option value="" disabled>Select a batch</option>
                                    {
                                        batches.map((batch, idx) => (
                                            <option key={idx} value={batch.id}>{batch.name}</option>
                                        ))
                                    }
                                </select>
                            </div>


                            {/* Title Input */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Video Title
                                </label>
                                <input
                                    name='title'
                                    onChange={(e) => onChangeHandler(e.target.name, e.target.value)}
                                    className='w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300 bg-blue-50/30'
                                    value={formData?.title || ''}
                                    type='text'
                                    placeholder="Enter a compelling title for your video"
                                />
                            </div>

                            {/* Description Input */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Video Description
                                </label>
                                <textarea
                                    name='description'
                                    onChange={(e) => onChangeHandler(e.target.name, e.target.value)}
                                    className='w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300 bg-blue-50/30 resize-y min-h-[120px]'
                                    value={formData?.description || ''}
                                    placeholder="Describe your video content, include relevant keywords and tags"
                                />
                            </div>

                            {/* File Upload */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Upload Video File
                                </label>
                                <div className="relative">
                                    <input
                                        name='video'
                                        onChange={(e) => onChangeHandler(e.target.name, e.target.files[0])}
                                        className='w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300 bg-blue-50/30 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer'
                                        type='file'
                                        accept='.mp4, .mov'
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        Supported formats: MP4, MOV • Max file size: 2GB
                                    </p>
                                </div>
                            </div>

                            {/* Upload Guidelines */}
                            <div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl border border-blue-200">
                                <h3 className="font-semibold text-blue-700 mb-3">Upload Guidelines</h3>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Ensure your video content follows community guidelines</li>
                                    <li>• Use clear, descriptive titles and descriptions</li>
                                    <li>• Choose appropriate tags for better discoverability</li>
                                    <li>• Upload high-quality content for the best viewer experience</li>
                                </ul>
                            </div>

                            {/* Submit Button */}
                            <div className="text-center pt-4">
                                <button
                                    disabled={canAccessPage === false}
                                    onClick={handleSubmit}
                                    className={`font-semibold px-8 py-4 rounded-xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-4
                                    ${canAccessPage === false
                                        ? 'bg-gray-300 cursor-not-allowed text-gray-600 focus:ring-0'
                                        : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-105 hover:shadow-2xl text-white focus:ring-blue-300'}
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
                                    {canAccessPage === false ? 'Access Denied' : 'Upload Video'}
                                </button>
                                <p className="text-sm text-gray-500 mt-3">
                                    Your video will be processed and made available shortly
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UploadVideo;