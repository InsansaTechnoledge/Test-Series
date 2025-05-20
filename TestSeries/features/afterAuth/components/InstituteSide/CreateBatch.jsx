import React, { useEffect, useState } from 'react'
import Heading from './Heading'
import { X } from 'lucide-react';

const CreateBatch = () => {
    const [formData, setFormData] = useState({});
    useEffect(() => {
        console.log(formData);
    }, [formData]);

    const [selectedFaculties, setSelectedFaculties] = useState([]);

    const [users, setUsers] = useState([
        {
            _id: 1,
            name: "Dasgupta"
        },
        {
            _id: 2,
            name: "Chaterjee"
        },
        {
            _id: 3,
            name: "Tarafdar"
        }
    ]);


    const onChangeHandler = (name, value) => {

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const deleteSubject = (indexToDelete) => {
        setFormData(prev => ({
            ...prev,
            subjects: prev.subjects.filter((_, index) => index !== indexToDelete)
        }));
    };

    const addSubject = () => {
        const newSubject = document.getElementById('subjects').value;
        setFormData(prev => ({
            ...prev,
            subjects: [
                ...(prev.subjects || []),  // ✅ safely spread or fallback to empty array
                newSubject
            ]
        }));

        document.getElementById('subjects').value = "";
        document.getElementById('subjects').focus();
    }

    const handleFacultySelect = (e) => {
        const selectedName = e.target.value;
        if (!selectedName) return;

        // Find the selected user object
        const selectedUser = users.find(user => user.name === selectedName);
        if (!selectedUser) return;

        // Add to selectedFaculties
        setSelectedFaculties(prev => [...prev, selectedUser]);

        // Remove from users list
        setUsers(prev => prev.filter(user => user.name !== selectedName));

        // Reset the dropdown
        e.target.value = '';
    };

    const handleFacultyRemove = (facultyId) => {
        // Find the faculty to re-add
        const facultyToRemove = selectedFaculties.find(fac => fac._id === facultyId);
        if (!facultyToRemove) return;

        // Remove from selectedFaculties
        setSelectedFaculties(prev => prev.filter(fac => fac._id !== facultyId));

        // Add back to users array
        setUsers(prev => [...prev, facultyToRemove]);
    };



    return (
        <div className='flex flex-col'>
            <div className='mb-5'>
                <Heading title={"Create Batch"} />
            </div>
            <div className='flex justify-end mb-5'>
                <button className='bg-blue-900 hover:cursor-pointer hover:scale-105 duration-300 transition-all text-white px-4 py-2 rounded-md'>
                    Download sample syllabus
                </button>
            </div>
            <div className='bg-gray-200 p-6 rounded-lg'>
                <div className='grid lg:grid-cols-2 gap-x-26 mx-auto gap-y-8 w-4/5'>
                    {/* left side */}
                    <div className='flex flex-col gap-8'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='name' className='text-lg font-semibold'>Batch name<span className='text-red-600'>*</span></label>
                            <input type='text'
                                id='name'
                                name='name'
                                onChange={(e) => onChangeHandler('name', e.target.value)}
                                className='p-2 bg-white rounded-md'
                                placeholder='Enter batch name'
                            />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='year' className='text-lg font-semibold'>Year<span className='text-red-600'>*</span></label>
                            <select type='text'
                                id='year'
                                name='year'
                                onChange={(e) => onChangeHandler('year', parseInt(e.target.value))}
                                className='p-2 bg-white rounded-md'
                            >
                                <option value={''}>--Select year--</option>
                                <option>2024</option>
                                <option>2025</option>
                                <option>2026</option>
                                <option>2027</option>
                                <option>2028</option>
                            </select>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='syllabus' className='text-lg font-semibold'>Syllabus<span className='text-red-600'>*</span></label>

                            <div class="flex items-center justify-center w-full">
                                <label for="dropzone-file" class="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                    <div class="flex flex-col items-center justify-center p-3">
                                        {/* <svg class="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                        </svg> */}
                                        <p class="text-sm text-gray-500">
                                            {
                                                formData.syllabus
                                                    ?
                                                    <span>{formData.syllabus.name}</span>
                                                    :
                                                    <>
                                                        <span class="font-semibold">Click to upload </span>
                                                        or drag and drop
                                                        <span class="font-semibold"> .csv file</span>
                                                    </>
                                            }

                                        </p>
                                    </div>
                                    <input id="dropzone-file"
                                        type="file"
                                        onChange={(e) => onChangeHandler("syllabus", e.target.files[0])}
                                        class="hidden" />
                                </label>
                            </div>
                            <span className='text-sm text-gray-600'>Download template for the .CSV file and upload the same file after filling specific details.</span>

                        </div>
                    </div>

                    {/* right side */}
                    <div className='flex flex-col gap-8'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='subjects' className='text-lg font-semibold'>Subjects<span className='text-red-600'>*</span></label>
                            <div className='flex gap-2'>
                                <input type='text'
                                    id='subjects'
                                    name='subjects'
                                    className='p-2 grow bg-white rounded-md'
                                    placeholder='Enter subject name'
                                />
                                <button
                                    onClick={addSubject}
                                    className='bg-blue-900 rounded-md px-4 py-2 text-white'>
                                    Add subject
                                </button>
                            </div>
                            <div className=''>
                                {
                                    formData.subjects && formData.subjects.length > 0
                                        ?
                                        <>
                                            <div className='mb-2'>Your subjects:</div>
                                            <div className='flex gap-2'>
                                                {
                                                    formData.subjects.map((subject, idx) => (
                                                        <div
                                                            className='flex gap-2 bg-blue-500/30 rounded-full w-fit px-4 py-2'
                                                            key={idx}>
                                                            <span className='my-auto'>
                                                                {subject}
                                                            </span>
                                                            <button className="hover:cursor-pointer "
                                                                onClick={() => deleteSubject(idx)}
                                                            >
                                                                <X className='w-5 h-5' />
                                                            </button>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </>
                                        :
                                        null
                                }
                            </div>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='faculties' className='text-lg font-semibold'>Faculties<span className='text-red-600'>*</span></label>
                            <select
                                id="faculties"
                                name="faculties"
                                className="p-2 bg-white rounded-md"
                                onChange={handleFacultySelect}
                            >
                                <option value="">--Select faculty--</option>
                                {users.map((user, idx) => (
                                    <option key={idx} value={user.name}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>

                            {
                                selectedFaculties && selectedFaculties.length > 0
                                    ?
                                    <>
                                        <div className=''>Faculties:</div>
                                        <div className='flex gap-2'>
                                            {
                                                selectedFaculties.map((user, idx) => (
                                                    <div
                                                        className='flex gap-2 bg-blue-500/30 rounded-full w-fit px-4 py-2'
                                                        key={idx}>
                                                        <span className='my-auto'>
                                                            {user.name}
                                                        </span>
                                                        <button className="hover:cursor-pointer "
                                                            onClick={() => handleFacultyRemove(user._id)}
                                                        >
                                                            <X className='w-5 h-5' />
                                                        </button>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </>
                                    :
                                    null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateBatch