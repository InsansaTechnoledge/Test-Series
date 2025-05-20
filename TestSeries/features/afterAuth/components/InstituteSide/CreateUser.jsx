import React, { useEffect, useState } from 'react'
import Heading from './Heading'
import profileDefault from '../../../../assests/Institute/profile.png';

const CreateUser = () => {

    const batches = [
        {
            _id: 1,
            name: "BE-4",
            year: 2025
        },
        {
            _id: 2,
            name: "BE-4",
            year: 2025
        },
        {
            _id: 3,
            name: "BE-4",
            year: 2025
        },
        {
            _id: 4,
            name: "BE-4",
            year: 2025
        },
    ]

    const [batchesVisible, setBatchesVisible] = useState(false);
    const [formData, setFormData] = useState({});
    const [selectedBatches, setSelectedBatches] = useState([]);
    const [profile, setProfile] = useState(profileDefault);

    useEffect(() => {
        console.log(formData);
    }, [formData]);

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const toggleBatch = (batch) => {
        const key = batch._id;

        setSelectedBatches((prev) => {
            const exists = prev.some(
                (b) => b._id === key
            );
            if (exists) {
                return prev.filter(
                    (b) => b._id !== key
                );
            } else {
                return [...prev, batch];
            }
        });
    };

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            batches: selectedBatches.map(batch => batch._id)
        }));
    }, [selectedBatches])

    return (
        <div className='flex flex-col'>
            <div className='mb-5'>
                <Heading title={"Create User"} />
            </div>
            <div className='bg-gray-200 p-6 rounded-lg'>
                <div className='flex gap-8'>
                    <img
                        src={profile} // fallback image if nothing is selected
                        className='rounded-full w-20 h-20'
                        alt='Profile'
                    />

                    <label className='bg-blue-900 h-fit my-auto text-white py-2 px-4 rounded-md cursor-pointer'>
                        Upload profile photo
                        <input
                            type='file'
                            accept='image/*'
                            className='hidden'
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const imageUrl = URL.createObjectURL(file);
                                    setProfile(imageUrl); // show image
                                    setFormData(prev => ({
                                        ...prev,
                                        profilePhoto: file // store file for upload
                                    }));
                                }
                            }}
                        />
                    </label>

                </div>
                <div className='grid grid-cols-2 gap-x-26 mx-auto gap-y-8 mt-10 w-4/5'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='fname' className='text-lg font-semibold'>First name<span className='text-red-600'>*</span></label>
                        <input type='text'
                            id='fname'
                            name='fname'
                            onChange={(e) => onChangeHandler(e)}
                            className='p-2 bg-white rounded-md'
                            placeholder='Enter first name'
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='lname' className='text-lg font-semibold'>Last name<span className='text-red-600'>*</span></label>
                        <input type='text'
                            id='lname'
                            name='lname'
                            onChange={(e) => onChangeHandler(e)}
                            className='p-2 bg-white rounded-md'
                            placeholder='Enter last name'
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='email' className='text-lg font-semibold'>Email<span className='text-red-600'>*</span></label>
                        <input type='email'
                            id='email'
                            name='email'
                            onChange={(e) => onChangeHandler(e)}
                            className='p-2 bg-white rounded-md'
                            placeholder='Enter email'
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='password' className='text-lg font-semibold'>Password<span className='text-red-600'>*</span></label>
                        <input type='password'
                            id='password'
                            name='password'
                            onChange={(e) => onChangeHandler(e)}
                            className='p-2 bg-white rounded-md'
                            placeholder='Enter password'
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='cpassword' className='text-lg font-semibold'>Confirm Password<span className='text-red-600'>*</span></label>
                        <input type='password'
                            id='cpassword'
                            name='cpassword'
                            onChange={(e) => onChangeHandler(e)}
                            className='p-2 bg-white rounded-md'
                            placeholder='Enter password'
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='role' className='text-lg font-semibold'>Role group<span className='text-red-600'>*</span></label>
                        <select
                            name='role'
                            onChange={(e) => onChangeHandler(e)}
                            id='role' className='p-2 bg-white rounded-md'>
                            <option>--select role--</option>
                        </select>

                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='batch' className='text-lg font-semibold'>Assign batches</label>
                        <button
                            onClick={() => (setBatchesVisible(!batchesVisible))}
                            className='bg-blue-900 w-fit py-1 px-4 text-white rounded-md'>
                            {
                                batchesVisible
                                    ?
                                    "Hide all batches"
                                    :
                                    "Show all batches"

                            }
                        </button>
                        {
                            batchesVisible
                                ?
                                <div className='flex gap-2 flex-wrap'>
                                    {
                                        batches.map((batch, idx) => (
                                            <div
                                                onClick={() => toggleBatch(batch)}
                                                key={idx}
                                                className={`hover:cursor-pointer rounded-full ${selectedBatches.some(b => b._id === batch._id) ? 'bg-green-500' : 'bg-white'} py-1 px-4`}>
                                                {batch.name} - {batch.year}
                                            </div>
                                        ))
                                    }
                                </div>
                                :
                                <>
                                    <div className='flex gap-2'>
                                        <div className="text-nowrap">Assigned Batches</div>
                                        <div className='flex gap-2 flex-wrap'>
                                            {
                                                selectedBatches.map((batch, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`rounded-full bg-white py-1 px-4`}>
                                                        {batch.name} - {batch.year}
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </>
                        }
                    </div>
                    <div className='flex flex-col gap-2 mt-10'>
                        <button className='bg-blue-900 px-4 py-2 rounded-md w-fit text-white'>
                            Submit Form
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateUser