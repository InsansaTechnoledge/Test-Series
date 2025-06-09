import React, { useState } from 'react'
import { uploadVideo } from '../../../utils/services/videoService';

const UploadVideo = () => {
    const [video, setVideo] = useState();
    const [formData, setFormData] = useState({});
    const onChangeHandler = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async () => {
        console.log(formData);
        const response = await uploadVideo(formData);
        if(response.status==200){
            console.log(response.data);
            alert("Video uploaded successfully");
        }
    }

    return (
        <>

            <div className='text-xl font-bold'>uploadVideo</div>
            <div className='flex flex-col gap-4'>

                <div className='flex gap-2'>
                    <div>
                        Title:
                    </div>
                    <input
                        name='title'
                        onChange={(e) => onChangeHandler(e.target.name, e.target.value)}
                        className='border'
                        value={formData?.title || ''}
                        type='text'
                    />
                </div>
                <div className='flex gap-2'>
                    <div>
                        Description:
                    </div>
                    <textarea
                        name='description'
                        onChange={(e) => onChangeHandler(e.target.name, e.target.value)}
                        className='border'
                        value={formData?.description || ''}
                    />
                </div>
                <div className='flex gap-2'>
                    <div>Upload video</div>
                    <input
                        name='video'
                        onChange={(e) => onChangeHandler(e.target.name, e.target.files[0])}
                        className='border'
                        type='file' accept='.mp4, .mov' />
                </div>
            </div>
            <button
            className='bg-blue-500 px-4 py-2 text-white'
            onClick={handleSubmit}
            >Submit</button>
        </>
    )
}

export default UploadVideo;