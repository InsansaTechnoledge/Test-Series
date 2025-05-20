import React, { useEffect, useState } from 'react'
import profileDefault from '../../../../assests/Institute/profile.png';
import HeadingUtil from '../../utility/HeadingUtil';
import { Eye, EyeOff, RefreshCcw } from 'lucide-react';
import { generatePassword } from '../../utility/GenerateRandomPassword';

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
    const [profile, setProfile] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


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

    function generateRandomPassword() {
        const password = generatePassword();
        document.getElementById("password").value = password;
        document.getElementById("cpassword").value = password;
    }

    return (
        <div className='flex flex-col'>
            <div className=''>
                <HeadingUtil heading="Add User" description="you can add users to your institute and assign them specific roles" />

            </div>
            <div className='bg-gray-200 p-6 rounded-lg'>
                <div className='flex flex-col md:flex-row gap-8'>
                    <div className='w-fit mx-auto md:mx-0'>
                        <img

                            src={profile || profileDefault} // fallback image if nothing is selected
                            className='rounded-full w-20 h-20'
                            alt='Profile'
                        />
                    </div>

                    <label className='text-center bg-blue-900 h-fit my-auto text-white py-2 px-4 rounded-md cursor-pointer'>
                        {
                            profile
                                ?
                                "Change profile photo"
                                :
                                "Upload profile photo"

                        }

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
                <div className='grid lg:grid-cols-2 gap-x-26 mx-auto gap-y-8 mt-10 w-4/5'>
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
                        <div className='flex gap-2'>
                            <div className='relative w-full'>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id='password'
                                    name='password'
                                    onChange={(e) => onChangeHandler(e)}
                                    className='p-2 bg-white rounded-md w-full pr-10'
                                    placeholder='Enter password'
                                />
                                <div
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
                                    onClick={() => setShowPassword(prev => !prev)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </div>
                            </div>
                            <button
                                onClick={generateRandomPassword}
                                className='bg-white hover:cursor-pointer rounded-md px-2'>
                                <RefreshCcw className='w-6 h-6' />
                            </button>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='cpassword' className='text-lg font-semibold'>Confirm Password<span className='text-red-600'>*</span></label>
                        <div className='relative w-full'>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id='cpassword'
                                name='cpassword'
                                onChange={(e) => onChangeHandler(e)}
                                className='p-2 bg-white rounded-md w-full pr-10'
                                placeholder='Confirm password'
                            />
                            <div
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
                                onClick={() => setShowConfirmPassword(prev => !prev)}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='userid' className='text-lg font-semibold'>User ID</label>
                        <input type='test'
                            id='userid'
                            name='userid'
                            onChange={(e) => onChangeHandler(e)}
                            className='p-2 bg-white rounded-md'
                            placeholder='Enter User ID provided by institute'
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='gender' className='text-lg font-semibold'>Gender<span className='text-red-600'>*</span></label>
                        <select
                            id='gender'
                            name='gender'
                            className='p-2 bg-white rounded-md'
                            onChange={(e) => onChangeHandler(e)}
                        >
                            <option value={''}>--Select Gender--</option>
                            <option value={"Male"}>Male</option>
                            <option value={"Female"}>Female</option>
                            <option value={"Others"}>Others</option>
                        </select>

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
                                        {
                                            selectedBatches.length > 0
                                                ?
                                                <div className="text-nowrap">Assigned Batches</div>
                                                :
                                                null
                                        }
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
            </div >
        </div >
    )
}

export default CreateUser