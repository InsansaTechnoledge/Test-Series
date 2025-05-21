import React, { useEffect, useState } from 'react'
import HeadingUtil from '../../utility/HeadingUtil'
import { RefreshCcw } from 'lucide-react';
import { Eye, EyeOff } from 'lucide-react';
import { generatePassword } from '../../utility/GenerateRandomPassword';
import { useQuery } from '@tanstack/react-query';
import { fetchBatchList } from '../../../../utils/services/batchService';
import { useUser } from '../../../../contexts/currentUserContext';
import { useNavigate } from 'react-router-dom';
import SessionExpireError from '../../../../components/Error/SessionExpireError';


const AddStudent = () => {

  const {user} = useUser();
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [batch, setBatch] = useState();

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

  function generateRandomPassword() {
    const password = generatePassword();
    document.getElementById("password").value = password;
    document.getElementById("cpassword").value = password;
  }

  const fetchBatchListFunction = async () => {
    const response = await fetchBatchList();
    if (response.status !== 200) {
      throw new Error('Network response was not ok');
    }
    console.log(response.data);
    return response.data;
  }

  const { data: batches = [], isLoading, isError } = useQuery({
    queryKey: ['batches', user._id],
    queryFn: () => fetchBatchListFunction(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
    cacheTime: 24 * 60 * 60 * 1000,
    retry: 0,
  });


  return (
    <div className='flex flex-col'>
      <div className=''>
        <HeadingUtil heading="Add Student" description="you can add new students to any batch" />
      </div>
      <div className='mb-5 flex justify-center'>
        {console.log("DD",batches)}
        <select 
        onChange={(e)=>setBatch(e.target.value)}
        className='bg-gray-200 rounded-md px-4 py-2 mx-auto'>
          {
            batches.map((batch, idx) => (
              <option key={idx} value={batch.name}>{batch.name}</option>
            ))
          }
        </select>
      </div>
      <div className='bg-gray-200 p-6 rounded-lg'>
        <div className='grid lg:grid-cols-2 gap-x-26 mx-auto gap-y-8 w-4/5'>
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
              placeholder='Enter first name'
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='number' className='text-lg font-semibold'>Phone number<span className='text-red-600'>*</span></label>
            <input type='number'
              id='number'
              name='number'
              onChange={(e) => onChangeHandler(e)}
              className='p-2 bg-white rounded-md'
              placeholder='Enter phone number'
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
              <div className="relative w-full">
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
            <label htmlFor='cpassword' className='text-lg font-semibold'>Confirm password<span className='text-red-600'>*</span></label>
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
            <label htmlFor='pnumber' className='text-lg font-semibold'>Parent's phone number<span className='text-red-600'>*</span></label>
            <input type='number'
              id='pnumber'
              name='pnumber'
              onChange={(e) => onChangeHandler(e)}
              className='p-2 bg-white rounded-md'
              placeholder='confirm password'
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='pemail' className='text-lg font-semibold'>Parent's Email<span className='text-red-600'>*</span></label>
            <input type='email'
              id='pemail'
              name='pemail'
              onChange={(e) => onChangeHandler(e)}
              className='p-2 bg-white rounded-md'
              placeholder='confirm password'
            />
          </div>
        </div>
        <div className='flex justify-center'>
          <button className='bg-blue-900 rounded-md text-white py-2 px-4 mt-10 mx-auto'>
            Submit
          </button>
        </div>
      </div>

    </div>
  )
}

export default AddStudent