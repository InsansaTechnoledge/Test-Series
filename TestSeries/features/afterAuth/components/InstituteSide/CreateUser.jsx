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
    const queryClient = useQueryClient();
    const { user, getFeatureKeyFromLocation } = useUser();
    const location = useLocation();


    const canAddMoreUsers = useLimitAccess(getFeatureKeyFromLocation(location.pathname) , "totalUsers")
    const Creation_limit = user?.planFeatures?.user_feature.value
    const Total_user = user?.metaData?.totalUsers

    const Available_limit = Creation_limit - Total_user
    console.log("ff", canAddMoreUsers , Creation_limit , Total_user)

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
            const response = await createUser(payload);
            console.log(response);
            if (response.status === 200) {
                console.log("User created successfully");
                alert("User created successfully!");
                
                // Reset form
                setSelectedBatches([]);
                setFormData({});
                setError({});
                setProfile(null);
                
                // Clear form inputs
                const form = document.querySelector('form');
                if (form) form.reset();
                
                await queryClient.invalidateQueries(["Users", user._id]);
            } else {
                console.log("Error creating user");
                setError(prev => ({ ...prev, form: "Error creating user" }));
            }
        } catch (error) {
            console.error("Error creating user:", error);
            const errorMessage = error?.response?.data?.errors?.[1] || 
                               error?.response?.data?.message || 
                               error?.message || 
                               "An unexpected error occurred";
            setError(prev => ({ ...prev, form: errorMessage }));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-xl h-80">
                <img 
                    src={Banner} 
                    alt="Upload Banner"
                    className="absolute w-full h-full object-cover"
                />
                
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
                       
                        <p className="mt-8 text-indigo-500 bg-gray-200 px-3 py-4 rounded-2xl text-2xl flex "> <AlertTriangle/>For current plan you have Available Limit of <span className={`${Available_limit > 0 ? "text-green-500" : "text-red-500"} mx-2`}>{Available_limit}</span> to Add more Users</p>
                    </div>
                </div>
            </div>

            {/* Main Form Container */}
            <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-20 pb-12">
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                    
                    {/* Profile Section */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 border-b border-gray-100">
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
                                <label className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-2xl cursor-pointer text-sm font-bold hover:shadow-xl transition-all duration-300 hover:scale-105 transform">
                                    {profile ? "Change Profile Photo" : "Upload Profile Photo"}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
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
                                <span className="text-sm text-gray-600 mt-2 text-center md:text-left">
                                    Add a profile photo for the user (optional)
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="p-8">
                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* First Name */}
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName || ""}
                                    onChange={onChangeHandler}
                                    className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 font-medium"
                                    placeholder="Enter first name"
                                />
                                {error.firstName && (
                                    <p className="text-red-500 text-sm mt-2 font-medium">{error.firstName}</p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName || ""}
                                    onChange={onChangeHandler}
                                    className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 font-medium"
                                    placeholder="Enter last name"
                                />
                                {error.lastName && (
                                    <p className="text-red-500 text-sm mt-2 font-medium">{error.lastName}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email || ""}
                                    onChange={onChangeHandler}
                                    className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 font-medium"
                                    placeholder="Enter email address"
                                />
                                {error.email && (
                                    <p className="text-red-500 text-sm mt-2 font-medium">{error.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
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
                                            className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 font-medium pr-12"
                                            placeholder="Enter password or generate"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={generateRandomPassword}
                                        className="bg-gradient-to-r from-indigo-100 to-purple-100 hover:from-indigo-200 hover:to-purple-200 p-4 rounded-2xl transition-all duration-300 hover:scale-105 transform"
                                        title="Generate Random Password"
                                    >
                                        <RefreshCcw className="w-5 h-5 text-indigo-600" />
                                    </button>
                                </div>
                                {error.password && (
                                    <p className="text-red-500 text-sm mt-2 font-medium">{error.password}</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirm_password"
                                        name="confirm_password"
                                        value={formData.confirm_password || ""}
                                        onChange={onChangeHandler}
                                        className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 font-medium pr-12"
                                        placeholder="Confirm password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    User ID <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="userId"
                                    name="userId"
                                    value={formData.userId || ""}
                                    onChange={onChangeHandler}
                                    className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 font-medium"
                                    placeholder="Enter User ID provided by institute"
                                />
                                {error.userId && (
                                    <p className="text-red-500 text-sm mt-2 font-medium">{error.userId}</p>
                                )}
                            </div>

                            {/* Gender */}
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Gender <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender || ""}
                                    onChange={onChangeHandler}
                                    className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 font-medium"
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
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Role Group <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="roleId"
                                    value={formData.roleId || ""}
                                    onChange={onChangeHandler}
                                    id="roleId"
                                    className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 font-medium"
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
                            <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-3xl p-8 border-2 border-gray-100">
                                <label className="block text-lg font-bold text-gray-800 mb-6">
                                    Assign Batches
                                </label>
                                
                                <button
                                    type="button"
                                    onClick={() => setBatchesVisible(!batchesVisible)}
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-2xl font-bold hover:shadow-xl transition-all duration-300 hover:scale-105 transform mb-6"
                                >
                                    {batchesVisible ? "Hide All Batches" : "Show All Batches"}
                                </button>

                                {batchesVisible && showBatches.length > 0 && (
                                    <div className="flex gap-3 flex-wrap mb-6">
                                        {showBatches.map((batch, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => toggleBatch(batch)}
                                                className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 hover:scale-105 transform ${
                                                    selectedBatches.some((b) => b.id === batch.id)
                                                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                                                        : "bg-white border-2 border-gray-200 text-gray-700 hover:border-indigo-300 hover:shadow-md"
                                                }`}
                                            >
                                                {batch.name} - {batch.year}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {selectedBatches.length > 0 && !batchesVisible && (
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-700 mb-3">Assigned Batches:</h4>
                                        <div className="flex gap-3 flex-wrap">
                                            {selectedBatches.map((batch, idx) => (
                                                <div
                                                    key={idx}
                                                    className="bg-gradient-to-r from-indigo-100 to-purple-100 border-2 border-indigo-200 text-indigo-800 px-4 py-2 rounded-2xl text-sm font-bold"
                                                >
                                                    {batch.name} - {batch.year}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-12 text-center">
                            <button
                                type="button"
                                onClick={onsubmitForm}
                                disabled={canAccessPage === false || canAddMoreUsers === false}
                                className={` text-white px-12 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 transform
                                    ${canAccessPage === false || canAddMoreUsers === false
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-105 hover:shadow-2xl'}
                                      `}
                            >
                                {/* <span className={`${!canAccessPage && "text-red-600 "}`}>{canAccessPage === false ? 'Access Denied' : 'Create User'}</span> */}
                                <span className={`${!canAccessPage || !canAddMoreUsers && "text-red-600 "}`}>{canAccessPage === false ? 'Access Denied' : (canAddMoreUsers ? 'Create Batch' : 'Limit Exceeded')}</span>

                            </button>
                            {error.form && (
                                <p className="text-red-500 text-sm mt-4 font-medium">{error.form}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateUser;