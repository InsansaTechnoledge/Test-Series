import { useState } from "react";
import {
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Save,
  UserCheck,
  Users,
} from "lucide-react";
import { useUser } from "../../contexts/currentUserContext";
import lighLogo from "../../assests/Logo/Frame 8.svg";
import DarkLogo from "../../assests/Logo/Frame 15.svg";
import { useToast, ToastContainer } from "../../utils/Toaster";

import { useNavigate, useParams } from "react-router-dom";
import { updateStudentById } from "../../utils/services/studentService";
import { useTheme } from "../../hooks/useTheme";

const ProfilePage = () => {
  const { user } = useUser();
  const { id } = useParams();
  const { theme } = useTheme();
  const { toasts, showToast, removeToast } = useToast();

  const [profile, setProfile] = useState({
    name: user.name,
    phone: user.phone,
    email: user.email,
    role: user.role,
    parentEmail: user.parentEmail,
    parentPhone: user.parentPhone,
    gender: user.gender,
  });

  const [avatar, setAvatar] = useState(user.profilePhoto);

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    console.log("Saving profile:", profile);
    try {
      await updateStudentById(id, profile);

      showToast("student updated successfully");
    } catch (e) {
      showToast("there was some error", "error");
    }
  };

  const handleAvatarUpload = () => {
    // This would typically open a file picker
    console.log("Upload avatar");
  };

  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div
      className={`min-h-screen py-8  ${
        theme === "light" ? "bg-gray-100" : "bg-gray-950"
      }`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-12 grid grid-cols-2 mb-8 gap-8 items-center">
          {/* Left Side */}
          <div>
            <h1
              className={` ${
                theme === "light" ? " text-indigo-900 " : " text-indigo-100 "
              } text-3xl font-bold mb-2`}
            >
              Profile Settings
            </h1>
            <p
              className={` ${
                theme === "light" ? "text-indigo-600" : "text-gray-400"
              }`}
            >
              Manage your account information and preferences
            </p>
          </div>

          {/* Right Side - Logo placeholder */}
          <div className="flex justify-end">
            <img
              src={theme === "light" ? lighLogo : DarkLogo}
              alt="evalvo logo"
            />
          </div>
        </div>

        <div className="px-12 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div
                className={`${
                  theme === "light"
                    ? "bg-white border border-indigo-200 "
                    : "bg-gray-800 border border-gray-700"
                } rounded-lg shadow-lg overflow-hidden`}
              >
                {/* Profile Header */}
                <div
                  className={`${
                    theme === "light" ? "bg-indigo-600" : "bg-indigo-400"
                  }  text-white p-6 text-center`}
                >
                  <div className="relative inline-block">
                    {/* Avatar */}
                    <div
                      className={`w-24 h-24 mx-auto border-4 border-white rounded-full overflow-hidden shadow-lg ${
                        theme === "light" ? "bg-indigo-100" : "bg-gray-700"
                      }`}
                    >
                      {avatar ? (
                        <img
                          src={avatar}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className={`w-full h-full flex items-center justify-center ${
                            theme === "light"
                              ? "text-indigo-600"
                              : "text-indigo-300"
                          }`}
                        >
                          <User className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    {/* Camera Button */}
                    <button
                      onClick={handleAvatarUpload}
                      className="absolute -bottom-2 -right-2 w-8 h-8 bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-200 rounded-full shadow-lg flex items-center justify-center transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <h2 className="mt-4 text-xl font-semibold">{profile.name}</h2>
                  <p className="text-indigo-100 text-sm">{profile.role}</p>
                </div>

                {/* Profile Details */}
                <div className="p-6">
                  <div className="space-y-4">
                    <div
                      className={`flex items-center space-x-3 text-sm ${
                        theme === "light" ? "text-gray-600" : "text-gray-300"
                      } `}
                    >
                      <Mail
                        className={`w-4 h-4 ${
                          theme === "light"
                            ? "text-indigo-600"
                            : "text-indigo-400"
                        }  flex-shrink-0`}
                      />
                      <span className="break-all">{profile.email}</span>
                    </div>
                    <div
                      className={`flex items-center space-x-3 text-sm ${
                        theme === "light" ? "text-gray-600" : "text-gray-300"
                      } `}
                    >
                      <Phone
                        className={`w-4 h-4 ${
                          theme === "light"
                            ? "text-indigo-600"
                            : "text-indigo-400"
                        }  flex-shrink-0`}
                      />
                      <span>{profile.phone}</span>
                    </div>
                    <div
                      className={`flex items-center space-x-3 text-sm ${
                        theme === "light" ? "text-gray-600" : "text-gray-300"
                      } `}
                    >
                      <UserCheck
                        className={`w-4 h-4 ${
                          theme === "light"
                            ? "text-indigo-600"
                            : "text-indigo-400"
                        }  flex-shrink-0`}
                      />
                      <span>{profile.role}</span>
                    </div>
                    <div
                      className={`flex items-center space-x-3 text-sm ${
                        theme === "light" ? "text-gray-600" : "text-gray-300"
                      } `}
                    >
                      <Users
                        className={`w-4 h-4 ${
                          theme === "light"
                            ? "text-indigo-600"
                            : "text-indigo-400"
                        }  flex-shrink-0`}
                      />
                      <span>{profile.gender}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <div className="lg:col-span-2">
              <div
                className={` ${
                  theme === "light"
                    ? "bg-white border-indigo-200"
                    : "bg-gray-800 border-gray-700"
                } border rounded-lg shadow-lg overflow-hidden`}
              >
                {/* Form Header */}
                <div
                  className={` ${
                    theme === "light"
                      ? "bg-white border-indigo-100"
                      : "bg-indigo-400 border-gray-700"
                  }  border-b p-6`}
                >
                  <h2
                    className={`text-xl font-semibold ${
                      theme === "light" ? "text-indigo-900" : "text-gray-100"
                    }`}
                  >
                    Edit Profile
                  </h2>
                  <p
                    className={`text-sm mt-1 ${
                      theme === "light" ? "text-indigo-600" : "text-gray-100"
                    }`}
                  >
                    Update your personal information and settings
                  </p>
                </div>

                {/* Form Content */}
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Name Field */}
                    <div>
                      <label
                        htmlFor="name"
                        className={`block text-sm font-medium mb-2 ${
                          theme === "light"
                            ? "text-indigo-900"
                            : "text-gray-200"
                        }`}
                      >
                        Full Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={profile.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors ${
                          theme === "light"
                            ? "border-indigo-200 bg-white text-gray-900"
                            : "border-gray-600 bg-gray-700 text-gray-100"
                        }`}
                      />
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="email"
                          className={`block text-sm font-medium mb-2 ${
                            theme === "light"
                              ? "text-indigo-900"
                              : "text-gray-200"
                          }`}
                        >
                          Email Address
                        </label>
                        <input
                          id="email"
                          type="email"
                          disabled
                          value={profile.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors ${
                            theme === "light"
                              ? "border-indigo-200 bg-white text-gray-900"
                              : "border-gray-600 bg-gray-700 text-gray-100"
                          }`}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="phone"
                          className={`block text-sm font-medium mb-2 ${
                            theme === "light"
                              ? "text-indigo-900"
                              : "text-gray-200"
                          }`}
                        >
                          Phone Number
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          value={profile.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors ${
                            theme === "light"
                              ? "border-indigo-200 bg-white text-gray-900"
                              : "border-gray-600 bg-gray-700 text-gray-100"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Role and Gender */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="role"
                          className={`block text-sm font-medium mb-2 ${
                            theme === "light"
                              ? "text-indigo-900"
                              : "text-gray-200"
                          }`}
                        >
                          Role
                        </label>
                        <select
                          id="role"
                          value={profile.role}
                          disabled
                          onChange={(e) =>
                            handleInputChange("role", e.target.value)
                          }
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors ${
                            theme === "light"
                              ? "border-indigo-200 bg-white text-gray-900"
                              : "border-gray-600 bg-gray-700 text-gray-100"
                          }`}
                        >
                          <option value="Student">Student</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="gender"
                          className={`block text-sm font-medium mb-2 ${
                            theme === "light"
                              ? "text-indigo-900"
                              : "text-gray-200"
                          }`}
                        >
                          Gender
                        </label>
                        <select
                          id="gender"
                          value={profile.gender}
                          onChange={(e) =>
                            handleInputChange("gender", e.target.value)
                          }
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors ${
                            theme === "light"
                              ? "border-indigo-200 bg-white text-gray-900"
                              : "border-gray-600 bg-gray-700 text-gray-100"
                          }`}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Parent Information */}
                    <div
                      className={`border-t pt-6 ${
                        theme === "light"
                          ? "border-indigo-100"
                          : "border-gray-700"
                      }`}
                    >
                      <h3
                        className={`text-lg font-medium mb-4 ${
                          theme === "light"
                            ? "text-indigo-900"
                            : "text-gray-100"
                        }`}
                      >
                        Parent/Guardian Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="parentEmail"
                            className={`block text-sm font-medium mb-2 ${
                              theme === "light"
                                ? "text-indigo-900"
                                : "text-gray-200"
                            }`}
                          >
                            Parent Email
                          </label>
                          <input
                            id="parentEmail"
                            type="email"
                            disabled
                            value={profile.parentEmail}
                            onChange={(e) =>
                              handleInputChange("parentEmail", e.target.value)
                            }
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors ${
                              theme === "light"
                                ? "border-indigo-200 bg-white text-gray-900"
                                : "border-gray-600 bg-gray-700 text-gray-100"
                            }`}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="parentPhone"
                            className={`block text-sm font-medium mb-2 ${
                              theme === "light"
                                ? "text-indigo-900"
                                : "text-gray-200"
                            }`}
                          >
                            Parent Phone
                          </label>
                          <input
                            id="parentPhone"
                            type="tel"
                            value={profile.parentPhone}
                            onChange={(e) =>
                              handleInputChange("parentPhone", e.target.value)
                            }
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors ${
                              theme === "light"
                                ? "border-indigo-200 bg-white text-gray-900"
                                : "border-gray-600 bg-gray-700 text-gray-100"
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div
                      className={`flex justify-end space-x-4 pt-6 border-t ${
                        theme === "light"
                          ? "border-indigo-100"
                          : "border-gray-700"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={handleCancel}
                        className={`px-4 py-2 border rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
                          theme === "light"
                            ? "border-indigo-200 text-indigo-600 bg-white hover:bg-indigo-50"
                            : "border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600"
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSave}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 flex items-center"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default ProfilePage;
