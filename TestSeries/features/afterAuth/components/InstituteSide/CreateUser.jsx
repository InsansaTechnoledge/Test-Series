import React from 'react'
import Heading from './Heading'
import profile from '../../../../assests/Institute/profile.png';

const CreateUser = () => {
    return (
        <div className='flex flex-col'>
            <div className='mb-5'>
                <Heading title={"Create User"} />
            </div>
            <div className='bg-gray-200 p-6 rounded-lg'>
                <div className='flex gap-8'>
                    <img src={profile}
                        className='rounded-full w-20 h-20'
                    />
                    <button className='text-white rounded-md my-auto bg-blue-900 py-2 px-4'>
                        Upload profile photo
                    </button>

                </div>
                <div className='grid grid-cols-2 gap-x-32 mx-auto gap-y-8 mt-10 w-4/5'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='fname' className='text-lg font-semibold'>First name<span className='text-red-600'>*</span></label>
                        <input type='text'
                        id='fname' 
                        className='p-2 bg-white rounded-md'
                        placeholder='Enter first name'
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='fname' className='text-lg font-semibold'>First name<span className='text-red-600'>*</span></label>
                        <input type='text'
                        id='fname' 
                        className='p-2 bg-white rounded-md'
                        placeholder='Enter first name'
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='fname' className='text-lg font-semibold'>First name<span className='text-red-600'>*</span></label>
                        <input type='text'
                        id='fname' 
                        className='p-2 bg-white rounded-md'
                        placeholder='Enter first name'
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='fname' className='text-lg font-semibold'>First name<span className='text-red-600'>*</span></label>
                        <input type='text'
                        id='fname' 
                        className='p-2 bg-white rounded-md'
                        placeholder='Enter first name'
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateUser