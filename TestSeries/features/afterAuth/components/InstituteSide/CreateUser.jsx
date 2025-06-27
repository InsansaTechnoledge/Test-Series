import { useEffect, useState, useMemo } from "react";
import profileDefault from "../../../../assests/Institute/profile.png";
import HeadingUtil from "../../utility/HeadingUtil";
import { AlertTriangle, Eye, EyeOff, RefreshCcw } from "lucide-react";
import { generatePassword } from "../../utility/GenerateRandomPassword";
import { createUser } from "../../../../utils/services/userService";
import { useCachedBatches } from "../../../../hooks/useCachedBatches";
import { useCachedRoleGroup } from "../../../../hooks/useCachedRoleGroup";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "../../../../contexts/currentUserContext";
import Banner from "../../../../assests/Institute/add user.svg"
import { usePageAccess } from "../../../../contexts/PageAccessContext";
import useLimitAccess from "../../../../hooks/useLimitAccess";
import { useLocation } from "react-router-dom";
import { useCachedOrganization } from "../../../../hooks/useCachedOrganization";
import {useTheme} from "../../../../hooks/useTheme"

const CreateUser = () => {
    const { batches, isLoading, isError } = useCachedBatches();
    const { roleGroups, rolesLoading } = useCachedRoleGroup();
    const [batchesVisible, setBatchesVisible] = useState(false);
    const [formData, setFormData] = useState({});
    const [selectedBatches, setSelectedBatches] = useState([]);
    const [profile, setProfile] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showBatches, setShowBatches] = useState([]);
    const [error, setError] = useState({});
    const {theme} = useTheme()
    
    // Add state for dynamic user count tracking
    const [createdUsersCount, setCreatedUsersCount] = useState(0);
    
    const queryClient = useQueryClient();
   
    const { user, getFeatureKeyFromLocation } = useUser();
    const location = useLocation();

    const canAddMoreUsers = useLimitAccess(getFeatureKeyFromLocation(location.pathname), "totalUsers");
    const Creation_limit = user?.planFeatures?.user_feature.value;

    const organization = user.role !== 'organization'
        ? useCachedOrganization({ userId: user._id, orgId: user.organizationId._id })?.organization
        : null;

    // Get current total users from the actual source (user or organization metadata)
    const currentTotalUsers = user?.role === 'organization' 
        ? user.metaData?.totalUsers || 0 
        : organization?.metaData?.totalUsers || 0;

    // Dynamic calculation that includes newly created users in current session
    const Available_limit = Math.max(0, Creation_limit - (currentTotalUsers + createdUsersCount));

    // Check if limit is exceeded dynamically
    const isLimitExceeded = (currentTotalUsers + createdUsersCount) >= Creation_limit;

    const canAccessPage = usePageAccess();

    // Memoize batches to prevent unnecessary re-renders
    const memoizedBatches = useMemo(() => {
        return Array.isArray(batches) ? batches : [];
    }, [batches]);

    // Fix the infinite loop by using memoized batches and proper dependency
    useEffect(() => {
        if (memoizedBatches.length > 0) {
            setShowBatches(memoizedBatches);
        }
    }, [memoizedBatches]);

    const validateField = (name, value, currentErrors) => {
        const newErrors = { ...currentErrors };
        
        switch (name) {
            case "firstName":
                return value.length >= 3 && value.length <= 32
                    ? ""
                    : "Name must be between 3-32 characters";
            case "lastName":
                return value.length >= 3 && value.length <= 32
                    ? ""
                    : "Name must be between 3-32 characters";
            case "email":
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) &&
                    value.length >= 10 &&
                    value.length <= 60
                    ? ""
                    : "Please enter a valid email address";
            case "password":
                const hasUpperCase = /[A-Z]/.test(value);
                const hasLowerCase = /[a-z]/.test(value);
                const hasNumbers = /\d/.test(value);
                const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
                const isLongEnough = value.length >= 8;

                if (
                    !isLongEnough ||
                    !hasUpperCase ||
                    !hasLowerCase ||
                    !hasNumbers ||
                    !hasSpecialChar
                ) {
                    return "Password must be at least 8 characters with uppercase, lowercase, number, and special character";
                }
                // Clear confirm password error if passwords now match
                if (formData?.confirm_password && formData.confirm_password === value) {
                    return "";
                }
                return "";
            case "confirm_password":
                return value === formData?.password ? "" : "Passwords do not match";
            case "userId":
                return value === "" ? "userId of institute is required" : "";
            case "gender":
                return value ? "" : "Please select the gender";
            default:
                return "";
        }
    };

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        const fieldError = validateField(name, value, error);

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError((prev) => {
            const newErrors = { ...prev, [name]: fieldError };
            
            // Handle password confirmation cross-validation
            if (name === "password" && prev.confirm_password) {
                const confirmError = validateField("confirm_password", prev.confirm_password || "", newErrors);
                newErrors.confirm_password = confirmError;
            } else if (name === "confirm_password" && prev.password) {
                const passwordError = validateField("password", prev.password || "", newErrors);
                if (value === formData.password) {
                    newErrors.password = passwordError;
                }
            }
            
            return newErrors;
        });
    };

    const toggleBatch = (batch) => {
        const key = batch.id;

        setSelectedBatches((prev) => {
            const exists = prev.some((b) => b.id === key);
            if (exists) {
                return prev.filter((b) => b.id !== key);
            } else {
                return [...prev, batch];
            }
        });
    };
    const inputCommon = `p-4 rounded-2xl transition-all duration-300 text-lg w-full pr-14 ${
        theme === 'light'
          ? 'bg-white text-gray-900 border-2 border-gray-200 focus:ring-indigo-200 focus:border-indigo-400 placeholder-gray-400'
          : 'bg-gray-800 text-indigo-100 border-2 border-gray-600 focus:ring-indigo-500 focus:border-indigo-300 placeholder-indigo-300'
      }`;
    // Separate useEffect for batch selection
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            batches: selectedBatches.map((batch) => batch._id),
        }));
    }, [selectedBatches]);

    function generateRandomPassword() {
        const password = generatePassword();
        setFormData((prev) => ({
            ...prev,
            password: password,
            confirm_password: password,
        }));
        
        // Safely update DOM elements
        const passwordInput = document.getElementById("password");
        const confirmPasswordInput = document.getElementById("confirm_password");
        
        if (passwordInput) passwordInput.value = password;
        if (confirmPasswordInput) confirmPasswordInput.value = password;

        setError((prev) => ({
            ...prev,
            password: "",
            confirm_password: "",
        }));
    }

    const onsubmitForm = async () => {
        console.log("Submitting form with data:", formData); 
        // Check if limit is exceeded before processing
        if (isLimitExceeded) {
            setError(prev => ({ ...prev, form: "User creation limit exceeded. Please upgrade your plan." }));
            return;
        }

        // Validate all required fields before submission
        const requiredFields = ['firstName', 'lastName', 'email', 'password', 'confirm_password', 'userId', 'gender'];
        const validationErrors = {};
        
        requiredFields.forEach(field => {
            const fieldValue = formData[field] || '';
            const fieldError = validateField(field, fieldValue, error);
            if (fieldError) {
                validationErrors[field] = fieldError;
            }
        });

        if (Object.keys(validationErrors).length > 0) {
            setError(prev => ({ ...prev, ...validationErrors }));
            return;
        }

        const payload = new FormData();
        payload.append("name", `${formData.firstName} ${formData.lastName}`);
        
        selectedBatches.forEach((batch) => {
            payload.append("batch[]", batch.id);
        });

        for (let key in formData) {
            if (!["profilePhoto", "firstName", "lastName", "batches"].includes(key)) {
                payload.append(key, formData[key]);
            }
        }
        
        if (profile) {
            payload.append("profilePhoto", profile);
        }
        
        try {
            console.log("Creating user with payload:", payload);
            const response = await createUser(payload);

            if (response.status === 200) {
               
                alert("User created successfully!");
                
                // Increment the created users count for dynamic limit calculation
                setCreatedUsersCount(prev => prev + 1);
                
                // Reset form
                setSelectedBatches([]);
                setFormData({});
                setError({});
                setProfile(null);
                
                // Clear form inputs
                const form = document.querySelector('form');
                if (form) form.reset();
                
                // Invalidate queries to refresh the data from server
                await queryClient.invalidateQueries(["Users", user._id]);
                
                // If using organization context, also invalidate organization data
                if (user.role !== 'organization') {
                    await queryClient.invalidateQueries(["organization", user.organizationId._id]);
                } else {
                    await queryClient.invalidateQueries(["user", user._id]);
                }
            } else {
                console.log("Error creating user");
                setError(prev => ({ ...prev, form: "Error creating user" }));
            }
        } catch (error) {
            console.error("Error creating user:", error);
            const errorMessage = error?.response?.data?.errors?.[0] || 
                               error?.response?.data?.message || 
                               error?.message || 
                               "An unexpected error occurred";
            setError(prev => ({ ...prev, form: errorMessage }));
        }
    };

    return (
        <div className={`${theme === 'light' ? 'bg-gradient-to-br from-gray-50 via-white to-indigo-50' : ''} min-h-screen `}>
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-xl h-80">
                <img 
                    src={Banner} 
                    alt="Upload Banner"
                    className="absolute w-full h-full object-cover"
                />
                
                <div className={`absolute inset-0 ${
                theme === 'dark' 
                    ? 'bg-gray-900/60' 
                    : 'bg-black/20'
                }`}/>
        
                <div className="absolute"></div>
                
                {/* Content */}
                <div className="relative z-10 flex items-center justify-center h-full px-6 text-center">
                    <div>
                        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
                            Add User
                        </h1>
                        <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
                            Create new users and assign them specific roles in your institute
                        </p>
         
                        <div className="flex items-center justify-center">
                            <p className="mt-8 text-indigo-700 bg-indigo-50 border border-indigo-100 px-5 py-4 rounded-2xl text-base flex items-center gap-3 shadow-sm backdrop-blur-sm">
                                <AlertTriangle className="w-5 h-5 text-indigo-400" />
                                <span>
                                    <span className="font-semibold">Note:</span> For your current plan, you have an available limit of
                                    <span className={`font-bold ${Available_limit > 0 ? "text-green-600" : "text-red-600"} mx-1`}>
                                        {Available_limit}
                                    </span>
                                    users.
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Form Container */}
            <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-20 pb-12">
                <div className={` rounded-3xl shadow-2xl  overflow-hidden  ${theme === 'light' ? '  bg-gray-100' : 'bg-gray-800 text-gray-100'} `}>
           
                    {/* Profile Section */}
                    <div className={` p-8  {theme === 'light' ? '  border-gray-100' : 'bg-gray-800'} `}>
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="relative group">
                                <img
                                    src={profile || profileDefault}
                                    className="rounded-full w-24 h-24 border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-300"
                                    alt="Profile"
                                />
                                <div className="absolute inset-0 rounded-full bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>

                            <div className="flex flex-col items-center md:items-start">
                                <label className={`py-3 px-6 rounded-2xl cursor-pointer text-sm font-bold transition-all duration-300 ${
                                    isLimitExceeded 
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                        :
                                         'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl hover:scale-105 transform'
                                }`}>
                                    {profile ? "Change Profile Photo" : "Upload Profile Photo"}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        disabled={isLimitExceeded}
                                        onChange={(e) => {
                                            if (isLimitExceeded) return;
                                            const file = e.target.files[0];
                                            if (file) {
                                                const imageUrl = URL.createObjectURL(file);
                                                setProfile(imageUrl);
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    profilePhoto: file,
                                                }));
                                            }
                                        }}
                                    />
                                </label>
                                <span className={`text-sm text-gray-600 mt-2 text-center md:text-left ${theme === 'light' ? ' text-gray-700' : 'text-white'}`}>
                                    Add a profile photo for the user (optional)
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {isLimitExceeded && (
                        <div className="mx-8 mt-6">
                            <p className={`text-center text-sm  px-4 py-2 rounded-xl shadow-sm backdrop-blur-sm  ${theme === 'light' ? 'bg-red-100 border text-red-600 border-red-200' : 'bg-red-600 text-gray-100'}`}>
                                You've reached your user creation limit. <br className="sm:hidden" />
                                <span className="font-medium">Upgrade your plan</span> to continue.
                            </p>
                        </div>
                    )}

                    {/* Form Fields */}
                    <div className="p-8 ">
                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* First Name */}
                            <div className="group">
                                <label className={`block text-sm font-bold  mb-2 ${theme === 'light' ? ' text-gray-700' : 'text-gray-100'}`}>
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName || ""}
                                    onChange={onChangeHandler}
                                    disabled={isLimitExceeded}
                                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 font-medium ${
                                        isLimitExceeded 
                                            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                                            : 'bg-gray-50 border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400'
                                    } ${inputCommon}`}
                                    placeholder="Enter first name"
                                />
                                {error.firstName && (
                                    <p className="text-red-500 text-sm mt-2 font-medium">{error.firstName}</p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div className="group">
                                <label className={`block text-sm font-bold  mb-2 ${theme === 'light' ? ' text-gray-700' : 'text-gray-100'}`}>
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName || ""}
                                    onChange={onChangeHandler}
                                    disabled={isLimitExceeded}
                                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 font-medium ${
                                        isLimitExceeded 
                                            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                                            : 'bg-gray-50 border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400'
                                    } ${inputCommon}`}
                                    placeholder="Enter last name"
                                />
                                {error.lastName && (
                                    <p className="text-red-500 text-sm mt-2 font-medium">{error.lastName}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="group">
                                <label className={`block text-sm font-bold  mb-2  ${theme === 'light' ? ' text-gray-700' : 'text-gray-100'}`}>
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email || ""}
                                    onChange={onChangeHandler}
                                    disabled={isLimitExceeded}
                                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 font-medium ${
                                        isLimitExceeded 
                                            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                                            : 'bg-gray-50 border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400'
                                    } ${inputCommon}`}
                                    placeholder="Enter email address"
                                />
                                {error.email && (
                                    <p className="text-red-500 text-sm mt-2 font-medium">{error.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="group">
                                <label className={`block text-sm font-bold  mb-2  ${theme === 'light' ? ' text-gray-700' : 'text-gray-100'}`}>
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-3">
                                    <div className="relative flex-1">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            value={formData.password || ""}
                                            onChange={onChangeHandler}
                                            disabled={isLimitExceeded}
                                            className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 font-medium pr-12 ${
                                                isLimitExceeded 
                                                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                                                    : 'bg-gray-50 border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400'
                                            }   ${inputCommon}'} rounded-2xl  text-lg font-medium`}
                                            placeholder="Enter password or generate"
                                        />
                                        <button
                                            type="button"
                                            className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                                                isLimitExceeded 
                                                    ? 'text-gray-400 cursor-not-allowed' 
                                                    : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                            disabled={isLimitExceeded}
                                            onClick={() => !isLimitExceeded && setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={generateRandomPassword}
                                        disabled={isLimitExceeded}
                                        className={`p-4 rounded-2xl transition-all duration-300 ${
                                            isLimitExceeded 
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                : 'bg-gradient-to-r from-indigo-100 to-purple-100 hover:from-indigo-200 hover:to-purple-200 hover:scale-105 transform'
                                        }`}
                                        title="Generate Random Password"
                                    >
                                        <RefreshCcw className={`w-5 h-5 ${isLimitExceeded ? 'text-gray-400' : 'text-indigo-600'}`} />
                                    </button>
                                </div>
                                {error.password && (
                                    <p className="text-red-500 text-sm mt-2 font-medium">{error.password}</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="group">
                                <label className={`block text-sm font-bold  mb-2  ${theme === 'light' ? ' text-gray-700' : 'text-gray-100'}`}>
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirm_password"
                                        name="confirm_password"
                                        value={formData.confirm_password || ""}
                                        onChange={onChangeHandler}
                                        disabled={isLimitExceeded}
                                        className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 font-medium pr-12 ${
                                            isLimitExceeded 
                                                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                                                : 'bg-gray-50 border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400'
                                        } ${inputCommon}`}
                                        placeholder="Confirm password"
                                    />
                                    <button
                                        type="button"
                                        className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                                            isLimitExceeded 
                                                ? 'text-gray-400 cursor-not-allowed' 
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                        disabled={isLimitExceeded}
                                        onClick={() => !isLimitExceeded && setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {error.confirm_password && (
                                    <p className="text-red-500 text-sm mt-2 font-medium">{error.confirm_password}</p>
                                )}
                            </div>

                            {/* User ID */}
                            <div className="group">
                                <label className={`block text-sm font-bold  mb-2  ${theme === 'light' ? ' text-gray-700' : 'text-gray-100'}`}>
                                    User ID <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="userId"
                                    name="userId"
                                    value={formData.userId || ""}
                                    onChange={onChangeHandler}
                                    disabled={isLimitExceeded}
                                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 font-medium ${
                                        isLimitExceeded 
                                            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                                            : 'bg-gray-50 border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400'
                                    } ${inputCommon}`}
                                    placeholder="Enter User ID provided by institute"
                                />
                                {error.userId && (
                                    <p className="text-red-500 text-sm mt-2 font-medium">{error.userId}</p>
                                )}
                            </div>

                            {/* Gender */}
                            <div className="group">
                                <label className={`block text-sm font-bold mb-2  ${theme === 'light' ? ' text-gray-700' : 'text-gray-100'}`}>
                                    Gender <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender || ""}
                                    onChange={onChangeHandler}
                                    disabled={isLimitExceeded}
                                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 font-medium ${
                                        isLimitExceeded 
                                            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                                            : 'bg-gray-50 border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400'
                                    } ${inputCommon}`}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Others">Others</option>
                                </select>
                                {error.gender && (
                                    <p className="text-red-500 text-sm mt-2 font-medium">{error.gender}</p>
                                )}
                            </div>

                            {/* Role Group */}
                            <div className="group">
                                <label className={ `block text-sm font-bold  mb-2  ${theme === 'light' ? ' text-gray-700' : 'text-gray-100'}`}>
                                    Role Group <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="roleId"
                                    value={formData.roleId || ""}
                                    onChange={onChangeHandler}
                                    id="roleId"
                                    disabled={isLimitExceeded}
                                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 font-medium ${
                                        isLimitExceeded 
                                            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                                            : 'bg-gray-50 border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400'
                                    } ${inputCommon}`}
                                >
                                    <option value="">Select Role</option>
                                    {roleGroups && roleGroups.map((role, idx) => (
                                        <option key={idx} value={role._id}>
                                            {role.name} - {role.description}
                                        </option>
                                    ))}
                                </select>
                                {error.roleId && (
                                    <p className="text-red-500 text-sm mt-2 font-medium">{error.roleId}</p>
                                )}
                            </div>
                        </div>

                        {/* Batch Assignment */}
                        <div className="mt-12">
                            <div className={` rounded-3xl p-8   ${theme === 'light' ? 'bg-gradient-to-r from-gray-50 to-indigo-50 border-gray-100  border-2 shadow-2xl' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'} `}>
                                <label className={`block text-lg font-bold  mb-6  ${theme === 'light' ? 'text-gray-800' : ' text-gray-200'} `}>
                                    Assign Batches
                                </label>
                                
                                <button
                                    type="button"
                                    onClick={() => !isLimitExceeded && setBatchesVisible(!batchesVisible)}
                                    disabled={isLimitExceeded}
                                    className={`py-3 px-8 rounded-2xl font-bold transition-all duration-300 mb-6 ${
                                        isLimitExceeded 
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl hover:scale-105 transform'
                                    } ${theme === 'light' ? 'border-2 border-gray-200 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300  bg-gray-50 group-hover:bg-white' : 'border-2 border-indigo-400 transition-all duration-300  bg-indigo-100 group-hover:bg-indigo-50 text-gray-800'} rounded-2xl  text-lg font-medium`}
                                >
                                    {batchesVisible ? "Hide All Batches" : "Show All Batches"}
                                </button>

                                {batchesVisible && showBatches.length > 0 && (
                                    <div className="flex gap-3 flex-wrap mb-6">
                                        {showBatches.map((batch, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => !isLimitExceeded && toggleBatch(batch)}
                                                disabled={isLimitExceeded}
                                                className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300  ${
                                                    selectedBatches.some((b) => b.id === batch.id)
                                                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                                                        : isLimitExceeded
                                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                        : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-indigo-300 hover:shadow-md'
                                                }  ${theme === 'light' ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white'}`}
                                            >
                                                {batch.name}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Selected Batches Display */}
                                {selectedBatches.length > 0 && (
                                    <div className="bg-white rounded-2xl p-6 border-2 border-green-200">
                                        <h4 className="text-sm font-bold text-gray-700 mb-4">
                                            Selected Batches ({selectedBatches.length})
                                        </h4>
                                        <div className="flex gap-2 flex-wrap">
                                            {selectedBatches.map((batch, idx) => (
                                                <span
                                                    key={idx}
                                                    className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 px-4 py-2 rounded-xl text-sm font-medium border border-green-300"
                                                >
                                                    {batch.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Form Error Display */}
                        {error.form && (
                            <div className="mt-6">
                                <p className="text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl text-center font-medium">
                                    {error.form}
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="mt-12 text-center">
                            <button
                                type="button"
                                onClick={onsubmitForm}
                                disabled={isLimitExceeded}
                                className={`py-4 px-12 rounded-2xl font-black text-lg transition-all duration-300 ${
                                    isLimitExceeded 
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                        : 
                                        'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-2xl hover:scale-105 transform'
                                }`}
                            >
                                {isLimitExceeded ? 'Limit Exceeded' : 'Create User'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateUser;