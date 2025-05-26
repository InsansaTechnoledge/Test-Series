import { useEffect, useState } from 'react'
import profileDefault from '../../../../assests/Institute/profile.png';
import HeadingUtil from '../../utility/HeadingUtil';
import { Eye, EyeOff, RefreshCcw } from 'lucide-react';
import { generatePassword } from '../../utility/GenerateRandomPassword';
import { createUser } from '../../../../utils/services/userService';
import { useCachedBatches } from '../../../../hooks/useCachedBatches';
import { useCachedRoleGroup } from '../../../../hooks/useCachedRoleGroup';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '../../../../contexts/currentUserContext';

const CreateUser = () => {
    const { batches, isLoading, isError } = useCachedBatches();
    const { roleGroups, rolesLoading } = useCachedRoleGroup();
    const [batchesVisible, setBatchesVisible] = useState(false);
    const [formData, setFormData] = useState({});
    const [selectedBatches, setSelectedBatches] = useState([]);
    const [profile, setProfile] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showBatches,setShowBatches]=useState(batches);
    const [error, setError] = useState({});
    const queryClient = useQueryClient();
    const {user} = useUser();    

    useEffect(()=>{
        setShowBatches(batches);
    },[batches]);

    const validateField = (name, value) => {
        switch (name) {
            case 'firstName':
                return value.length >= 3 && value.length <= 32 ? '' : 'Name must be between 3-32 characters';
            case 'lastName':
                return value.length >= 3 && value.length <= 32 ? '' : 'Name must be between 3-32 characters';
            case 'email':
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) &&
                    value.length >= 10 && value.length <= 60 ? '' : 'Please enter a valid email address';
            case 'password':
                const hasUpperCase = /[A-Z]/.test(value);
                const hasLowerCase = /[a-z]/.test(value);
                const hasNumbers = /\d/.test(value);
                const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
                const isLongEnough = value.length >= 8;

                if (!isLongEnough || !hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
                    return 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
                }
                return '';
            case 'confirm_password':
                return value === formData?.password ? '' : 'Passwords do not match';
            case 'userId':
                return value === '' ? 'userId of institute is required' : '';
            case 'gender':
                return value ? '' : 'Please select the gender';
            default:
                return '';
        }
    };

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        setError((prev) => ({
            ...prev,
            [name]: error
        }));
    }

    const toggleBatch = (batch) => {
        const key = batch.id;

        setSelectedBatches((prev) => {
            const exists = prev.some(
                (b) => b.id === key
            );
            if (exists) {
                return prev.filter(
                    (b) => b.id !== key
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
        setFormData(prev => ({
            ...prev,
            password: password,
            confirm_password: password
        }));
        document.getElementById("password").value = password;
        document.getElementById("confirm_password").value = password;

        setError(prev => ({
            ...prev,
            password: '',
            confirm_password: ''
        }));
    }

    const onsubmitForm = async () => {

        const payload = new FormData();
        payload.append("name", `${formData.firstName} ${formData.lastName}`);
        selectedBatches.forEach(batch => {
            payload.append('batch[]', batch.id);
        });

        for (let key in formData) {
            if (!["profilePhoto", "firstName", "lastName", "batches"].includes(key)) {
                payload.append(key, formData[key]);
            }

        }
        if (profile) {
            payload.append('profilePhoto', profile);
        }
        try {

            const response = await createUser(payload);
            console.log(response);
            if (response.status === 200) {
                console.log("User created successfully");
                alert("successful!!")
                queryClient.invalidateQueries(['Users', user._id]);
            } else {
                console.log("Error creating user");
            }
        } catch (error) {
            console.error("Error creating user:", error);
            setError({
                ...error,
                form: error.response.data.errors[1] || error.message
            });
            setFormData({});
            
        }

    };

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

                    <div className='flex flex-col justify-center'>
                        <label className='text-center bg-blue-900 h-fit text-white py-2 px-3 rounded-md cursor-pointer'>
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
                        <span className='text-sm text-gray-600'>you may add the profile photo of the user.</span>
                    </div>

                </div>
                <div className='grid lg:grid-cols-2 gap-x-26 mx-auto gap-y-8 mt-10 w-4/5'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='firstName' className='text-lg font-semibold'>First name<span className='text-red-600'>*</span></label>
                        <input type='text'
                            id='firstName'
                            name='firstName'
                            onChange={(e) => onChangeHandler(e)}
                            className='p-2 bg-white rounded-md'
                            placeholder='Enter first name'
                        />
                        {error.firstName && <p className='text-red-500 text-sm'>{error.firstName}</p>}

                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='lastName' className='text-lg font-semibold'>Last name<span className='text-red-600'>*</span></label>
                        <input type='text'
                            id='lastName'
                            name='lastName'
                            onChange={(e) => onChangeHandler(e)}
                            className='p-2 bg-white rounded-md'
                            placeholder='Enter last name'
                        />
                        {error.lastName && <p className='text-red-500 text-sm'>{error.lastName}</p>}
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
                        {error.email && <p className='text-red-500 text-sm'>{error.email}</p>}
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
                                    placeholder='Enter password or Generate the password on click'
                                />
                                <div
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
                                    onClick={() => setShowPassword(prev => !prev)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </div>
                                {error.password && <p className='text-red-500 text-sm'>{error.password}</p>}
                            </div>
                            <button
                                onClick={generateRandomPassword}
                                className='bg-white hover:cursor-pointer rounded-md px-2'>
                                <RefreshCcw className='w-6 h-6' />
                            </button>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='confirm_password' className='text-lg font-semibold'>Confirm Password<span className='text-red-600'>*</span></label>
                        <div className='relative w-full'>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id='confirm_password'
                                name='confirm_password'
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
                            {error.confirm_password && <p className='text-red-500 text-sm'>{error.confirm_password}</p>}
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='userId' className='text-lg font-semibold'>User ID <span className='text-red-600'>*</span></label>
                        <input type='test'
                            id='userId'
                            name='userId'
                            onChange={(e) => onChangeHandler(e)}
                            className='p-2 bg-white rounded-md'
                            placeholder='Enter User ID provided by institute'
                        />
                        {error.confirm_password && <p className='text-red-500 text-sm'>{error.confirm_password}</p>}
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
                        <label htmlFor='roleId' className='text-lg font-semibold'>Role group<span className='text-red-600'>*</span></label>
                        <select
                            name='roleId'
                            onChange={(e) => onChangeHandler(e)}
                            id='roleId' className='p-2 bg-white rounded-md'>
                            <option value=''>--select role--</option>
                            {
                                roleGroups.map((role, idx) => (
                                    <option key={idx} value={role._id}>{role.name} - {role.description}</option>
                                ))
                            }

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
                                        showBatches.map((batch, idx) => (
                                            <div
                                                onClick={() => toggleBatch(batch)}
                                                key={idx}
                                                className={`hover:cursor-pointer rounded-full ${selectedBatches.some(b => b.id === batch.id) ? 'bg-green-500' : 'bg-white'} py-1 px-4`}>
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
                        <button className='bg-blue-900 px-4 py-2 rounded-md w-fit text-white'
                            onClick={(e) => {
                                onsubmitForm();
                            }}>
                            Submit Form
                        </button>
                        {error.form && <p className='text-red-500 text-sm'>{error.form}</p>}
                    </div>
                </div>
            </div >
        </div >
    )
}

export default CreateUser