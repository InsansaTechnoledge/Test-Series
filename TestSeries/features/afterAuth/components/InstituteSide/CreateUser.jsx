import { useEffect, useState } from "react";
import profileDefault from "../../../../assests/Institute/profile.png";
import HeadingUtil from "../../utility/HeadingUtil";
import { Eye, EyeOff, RefreshCcw } from "lucide-react";
import { generatePassword } from "../../utility/GenerateRandomPassword";
import { createUser } from "../../../../utils/services/userService";
import { useCachedBatches } from "../../../../hooks/useCachedBatches";
import { useCachedRoleGroup } from "../../../../hooks/useCachedRoleGroup";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "../../../../contexts/currentUserContext";

const CreateUser = () => {
    const { batches, isLoading, isError } = useCachedBatches();
    const { roleGroups, rolesLoading } = useCachedRoleGroup();
    const [batchesVisible, setBatchesVisible] = useState(false);
    const [formData, setFormData] = useState({});
    const [selectedBatches, setSelectedBatches] = useState([]);
    const [profile, setProfile] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showBatches, setShowBatches] = useState(batches);
    const [error, setError] = useState({});
    const queryClient = useQueryClient();
    const { user } = useUser();

    useEffect(() => {
        setShowBatches(batches);
    }, [batches]);

    const validateField = (name, value, error) => {
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
                if (
                    formData?.confirm_password &&
                    formData?.confirm_password !== value
                ) {
                    return "Passwords do not match";
                }

                error.confirm_password = "";
                return "";
            case "confirm_password":
                if (value === formData?.password) {
                    error.password = "";
                    return "";
                } else {
                    return "Passwords do not match";
                }
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
        const error2 = validateField(name, value, error);

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError((prev) => ({
            ...prev,
            [name]: error2,
        }));
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
        document.getElementById("password").value = password;
        document.getElementById("confirm_password").value = password;

        setError((prev) => ({
            ...prev,
            password: "",
            confirm_password: "",
        }));
    }

    const onsubmitForm = async () => {
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
                alert("successful!!");
                setSelectedBatches([]);
                setFormData({});
                setError({});
                await queryClient.invalidateQueries(["Users", user._id]);
            } else {
                console.log("Error creating user");
            }
        } catch (error) {
            console.error("Error creating user:", error);
            setError({
                ...error,
                form: error.response.data.errors[1] || error.message,
            });
        }
    };

    return (


        <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
            <div>
                <HeadingUtil
                    heading="Add User"
                    description="you can add users to your institute and assign them specific roles"
                />
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl space-y-10">
                <div className="flex flex-col md:flex-row gap-8  items-center">
                    <div className="">
                        <img
                            src={profile || profileDefault} // fallback image if nothing is selected
                            className="rounded-full w-20 h-20 border-blue-100 shadow-sm"
                            alt="Profile"
                        />
                    </div>

                    <div className="flex flex-col items-center md:items-start">
                        <label className="bg-blue-900 text-white py-2 px-4 rounded-md cursor-pointer text-sm font-medium hover:bg-blue-800 transition">
                            {profile ? "Change profile photo" : "Upload profile photo"}

                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const imageUrl = URL.createObjectURL(file);
                                        setProfile(imageUrl); // show image
                                        setFormData((prev) => ({
                                            ...prev,
                                            profilePhoto: file, // store file for upload
                                        }));
                                    }
                                }}
                            />
                        </label>
                        <span className="text-sm text-gray-500 mt-2">
                            you may add the profile photo of the user.
                        </span>
                    </div>
                </div>
                <div className="grid lg:grid-cols-2 gap-x-10 mx-auto gap-y-8 mt-10 w-4/5 ">
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="firstName"
                            className="text-sm font-semibold text-gray-700 "
                        >
                            First name<span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName || ""}
                            onChange={(e) => onChangeHandler(e)}
                            className="p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter first name"
                        />
                        {error.firstName && (
                            <p className="text-red-500 text-sm">{error.firstName}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="lastName" className=" text-sm font-semibold text-gray-700">
                            Last name<span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName || ""}
                            onChange={(e) => onChangeHandler(e)}
                            className="p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter last name"
                        />
                        {error.lastName && (
                            <p className="text-red-500 text-sm">{error.lastName}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                            Email<span className="text-red-600">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email || ""}
                            onChange={(e) => onChangeHandler(e)}
                            className="p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter email"
                        />
                        {error.email && (
                            <p className="text-red-500 text-sm">{error.email}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="password"
                            className="text-sm font-semibold text-gray-700"
                        >
                            Password<span className="text-red-600">*</span>
                        </label>
                        <div className="flex gap-2">
                            <div className="relative w-full">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password || ""}
                                    onChange={(e) => onChangeHandler(e)}
                                    className="p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full pr-10"
                                    placeholder="Enter password or Generate the password on click"
                                />
                                <div
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </div>
                            </div>
                            <button
                                onClick={generateRandomPassword}
                                className="bg-white hover:cursor-pointer rounded-md px-2"
                            >
                                <RefreshCcw className="w-6 h-6" />
                            </button>
                        </div>
                        {error.password && (
                            <p className="text-red-500 text-sm">{error.password}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="confirm_password" className="text-sm font-semibold text-gray-700">
                            Confirm Password<span className="text-red-600">*</span>
                        </label>
                        <div className="relative w-full">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirm_password"
                                name="confirm_password"
                                value={formData.confirm_password || ""}
                                onChange={(e) => onChangeHandler(e)}
                                className="p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md w-full pr-10"
                                placeholder="Confirm password"
                            />
                            <div
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </div>
                        </div>
                        {error.confirm_password && (
                            <p className="text-red-500 text-sm">{error.confirm_password}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="userId" className="text-sm font-semibold text-gray-700">
                            User ID <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="test"
                            id="userId"
                            name="userId"
                            value={formData.userId || ""}
                            onChange={(e) => onChangeHandler(e)}
                            className="p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter User ID provided by institute"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="gender" className="text-sm font-semibold text-gray-700">
                            Gender<span className="text-red-600">*</span>
                        </label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender || ""}
                            className="p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => onChangeHandler(e)}
                        >
                            <option value={""}>--Select Gender--</option>
                            <option value={"Male"}>Male</option>
                            <option value={"Female"}>Female</option>
                            <option value={"Others"}>Others</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="roleId" className="text-sm font-semibold text-gray-700">
                            Role group<span className="text-red-600">*</span>
                        </label>
                        <select
                            name="roleId"
                            value={formData.roleId || ""}
                            onChange={(e) => onChangeHandler(e)}
                            id="roleId"
                            className="p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">--select role--</option>
                            {roleGroups.map((role, idx) => (
                                <option key={idx} value={role._id}>
                                    {role.name} - {role.description}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-5  ">


                        <div className="flex flex-col gap-2">
                            <label htmlFor="batch" className="text-sm font-semibold text=gray-700">
                                Assign batches
                            </label>
                            <button
                                onClick={() => setBatchesVisible(!batchesVisible)}
                                className="bg-blue-900 text-white px-4 py-2 rounded-md w-fit hover:bg-blue-800 transition cursor-pointer"
                            >
                                {batchesVisible ? "Hide all batches" : "Show all batches"}
                            </button>

                            {batchesVisible ? (
                                <div className="flex gap-2 flex-wrap mt-2">
                                    {showBatches.map((batch, idx) => (
                                        <div
                                            onClick={() => toggleBatch(batch)}
                                            key={idx}
                                            className={`hover:cursor-pointer rounded-full px-3 py-1 text-sm border ${selectedBatches.some((b) => b.id === batch.id)
                                                    ? "bg-green-500 border-green-400"
                                                    : "bg-gray-100 border-gray-300"
                                                } py-1 px-4`}
                                        >
                                            {batch.name} - {batch.year}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <div className="flex gap-2 mt-3  flex-col">
                                        {selectedBatches.length > 0 ? (
                                            <div className="text-nowrap text-gray-800 text-sm font-semibold ">Assigned Batches</div>
                                        ) : null}
                                        <div className="flex gap-2 flex-wrap">
                                            {selectedBatches.map((batch, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`rounded-full  className="rounded-full bg-blue-50 border border-blue-200 text-blue-900 font-medium shadow-sm py-1.5 px-4 text-sm hover:bg-blue-100 transition duration-200"
                        >`}
                                                >
                                                    {batch.name} - {batch.year}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 pt-4 cols-span-full justify-center w-fit ">
                            <button
                                className="bg-blue-900 text-white px-6 py-3 rounded-lg  hover:bg-blue-800 transition cursor-pointer"
                                onClick={(e) => {
                                    onsubmitForm();
                                }}
                            >
                                Submit Form
                            </button>
                            {error.form && <p className="text-red-500 text-sm">{error.form}</p>}
                        </div>

                    </div>
                </div>
            </div>

        </div>


    );
};

export default CreateUser;
