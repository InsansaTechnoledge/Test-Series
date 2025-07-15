import React, { useState } from "react";
import { useUser } from "../../../../../../contexts/currentUserContext";
import { useNavigate } from "react-router-dom";
import logo from "../../../../../../assests/Footer/evalvo logo white 4.svg";
import {
  ArrowLeft,
  Building,
  Building2,
  FilesIcon,
  Locate,
  Mail,
  Phone,
  User,
  Users2Icon,
  Edit3,
  Save,
  X,
  Check,
} from "lucide-react";
import { UpdateOrganizationData } from "../../../../../../utils/services/organizationService";
import { useToast, ToastContainer } from "../../../../../../utils/Toaster";

const YourPlanPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toasts, showToast, removeToast } = useToast();
  const [editData, setEditData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  if (!user)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-gray-900 p-8 rounded-lg">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-2 py-1">
              <img src={logo} alt="" />
            </div>
          </div>
        </div>
      </div>
    );

  const features = user.planFeatures || {};
  const subscription = user.subscription || {};

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const data = await UpdateOrganizationData(user._id, editData);
      setIsEditing(false);
      showToast("Organization details updated successfully!");
      console.log(data);
    } catch (e) {
      showToast("Something went wrong. Please try again.", "error");
      console.log(e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <button
        onClick={() => navigate(-1)}
        className="group fixed z-30 mb-4 sm:mb-6 ml-4 sm:ml-6 mt-4 inline-flex items-center text-gray-300 hover:text-white bg-indigo-600 hover:bg-indigo-700 px-3 sm:px-4 py-2 rounded-lg transition duration-300 text-lg sm:text-base"
      >
        <ArrowLeft className="group-hover:-translate-x-1" />
        Back to Home
      </button>

      <div className="relative bg-gradient-to-b from-indigo-900 via-black to-black">
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
          <div className="flex flex-col sm:flex-row sm:items-center mt-22 sm:justify-between space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 text-white">
                Your Plan
              </h1>
              <p className="text-lg sm:text-xl text-gray-300">
                Manage your subscription and view usage statistics
              </p>
            </div>
            <div className="flex justify-center sm:justify-end">
              <span
                className={`inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold ${
                  subscription.status === "trialing"
                    ? "bg-yellow-600 text-black"
                    : "bg-indigo-600 text-white"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full mr-2 sm:mr-3 ${
                    subscription.status === "trialing"
                      ? "bg-yellow-900"
                      : "bg-white"
                  }`}
                ></div>
                {subscription.status === "trialing"
                  ? "FREE TRIAL"
                  : subscription.status === "active"
                  ? "ACTIVE PLAN"
                  : "INACTIVE PLAN"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-b-2 w-full border-indigo-400"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-12">
        {/* Usage Stats */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-white text-center sm:text-left">
            Your Stats
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-gray-900 rounded-lg p-6 sm:p-8 text-center hover:bg-gray-800 transition-all duration-300 border border-gray-800 hover:border-indigo-600">
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Users2Icon />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {user?.metaData?.totalStudents || 0}
              </div>
              <div className="text-base sm:text-lg font-medium text-gray-400">
                Total Students
              </div>
              <div className="text-sm sm:text-shadow-xs text-gray-500 mt-1">
                Available Students in your plan :{" "}
                {user?.planFeatures?.student_feature?.value -
                  user?.metaData?.totalStudents}
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 sm:p-8 text-center hover:bg-gray-800 transition-all duration-300 border border-gray-800 hover:border-indigo-600">
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Building2 />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {user?.metaData?.totalBatches || 0}
              </div>
              <div className="text-base sm:text-lg font-medium text-gray-400">
                Enrolled Batches
              </div>
              <div className="text-sm sm:text-shadow-xs text-gray-500 mt-1">
                Available Batches in your plan :{" "}
                {user?.planFeatures?.batch_feature?.value -
                  user?.metaData?.totalBatches}
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 sm:p-8 text-center hover:bg-gray-800 transition-all duration-300 border border-gray-800 hover:border-indigo-600">
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <FilesIcon />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {user?.metaData?.totalExams || 0}
              </div>
              <div className="text-base sm:text-lg font-medium text-gray-400">
                Exams conducted
              </div>
              <div className="text-sm sm:text-shadow-xs text-gray-500 mt-1">
                Available Exams in your plan :{" "}
                {user?.planFeatures?.exam_feature?.value -
                  user?.metaData?.totalExams}
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 sm:p-8 text-center hover:bg-gray-800 transition-all duration-300 border border-gray-800 hover:border-indigo-600">
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <User />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {user?.metaData?.totalUsers || 0}
              </div>
              <div className="text-base sm:text-lg font-medium text-gray-400">
                Created Users
              </div>
              <div className="text-sm sm:text-shadow-xs text-gray-500 mt-1">
                Available Users in your plan :{" "}
                {user?.planFeatures?.user_feature?.value -
                  user?.metaData?.totalUsers}
              </div>
            </div>
          </div>
        </div>

        {/* Plan Features */}
        <div className="bg-gray-900 rounded-lg p-6 sm:p-8 border border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center sm:text-left">
              Features included with existing plan
            </h2>
            <div className="flex items-center justify-center sm:justify-end space-x-4 sm:space-x-6 text-sm sm:text-lg">
              <div className="flex items-center">
                <div className="w-3 sm:w-4 h-3 sm:h-4 bg-indigo-100 rounded-full mr-2 sm:mr-3"></div>
                <span className="text-gray-300">Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 sm:w-4 h-3 sm:h-4 bg-gray-600 rounded-full mr-2 sm:mr-3"></div>
                <span className="text-gray-300">Upgrade Required</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {Object.entries(features).map(([key, value]) => {
              const isEnabled =
                typeof value === "object"
                  ? Object.values(value).some((v) => v === true)
                  : Boolean(value);
              return (
                <div
                  key={key}
                  className={`p-4 sm:p-6 rounded-lg border-2 transition-all duration-300 ${
                    isEnabled
                      ? "bg-indigo-900 bg-opacity-20 border-indigo-600 hover:bg-indigo-900 hover:bg-opacity-30"
                      : "bg-gray-800 border-gray-700 hover:bg-gray-750"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                      <div
                        className={`w-4 sm:w-5 h-4 sm:h-5 rounded-full flex-shrink-0 ${
                          isEnabled ? "bg-indigo-100" : "bg-gray-600"
                        }`}
                      ></div>
                      <span className="font-semibold text-white text-base sm:text-lg capitalize truncate">
                        {key.replace("_feature", "").replace("_", " ")}
                      </span>
                    </div>
                    <span
                      className={`text-lg sm:text-xl font-bold ml-2 ${
                        isEnabled ? "text-indigo-100" : "text-gray-500"
                      }`}
                    >
                      {isEnabled ? "✓" : "✗"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Organization Info */}
        <div className="bg-gray-900 rounded-lg p-6 sm:p-8 border border-gray-800">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Account Details
            </h2>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all duration-300 font-medium"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-6">
              {/* Edit Form */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">
                    Edit Organization Details
                  </h3>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                        isSaving
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Organization Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Building className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                          placeholder="Enter organization name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          disabled
                          type="email"
                          value={editData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          disabled
                          type="tel"
                          value={editData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preview Card */}
                  <div className="bg-gray-750 border border-gray-600 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Check className="w-5 h-5 text-green-400 mr-2" />
                      Preview Changes
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Building className="w-5 h-5 text-indigo-400" />
                        <div>
                          <p className="text-sm text-gray-400">Organization</p>
                          <p className="text-white font-medium">
                            {editData.name || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-indigo-400" />
                        <div>
                          <p className="text-sm text-gray-400">Email</p>
                          <p className="text-white font-medium break-all">
                            {editData.email || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-indigo-400" />
                        <div>
                          <p className="text-sm text-gray-400">Phone</p>
                          <p className="text-white font-medium">
                            {editData.phone || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-4 sm:space-x-6 p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-300">
                  <div className="w-12 sm:w-14 h-12 sm:h-14 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Building />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-400 text-base sm:text-lg">
                      Organization Name
                    </p>
                    <p className="font-semibold text-white text-lg sm:text-xl truncate">
                      {user.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 sm:space-x-6 p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-300">
                  <div className="w-12 sm:w-14 h-12 sm:h-14 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-400 text-base sm:text-lg">
                      Email Address
                    </p>
                    <p className="font-semibold text-white text-lg sm:text-xl break-all">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-4 sm:space-x-6 p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-300">
                  <div className="w-12 sm:w-14 h-12 sm:h-14 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-400 text-base sm:text-lg">
                      Phone Number
                    </p>
                    <p className="font-semibold text-white text-lg sm:text-xl">
                      {user.phone || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 sm:space-x-6 p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-300">
                  <div className="w-12 sm:w-14 h-12 sm:h-14 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Locate />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-400 text-base sm:text-lg">
                      Location
                    </p>
                    <p className="font-semibold text-white text-lg sm:text-xl">
                      {user.address?.city && user.address?.state
                        ? `${user.address.city}, ${user.address.state}`
                        : "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 rounded-lg p-6 sm:p-8 text-center border border-indigo-600">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
            Need More Features?
          </h3>
          <p className="text-indigo-100 mb-4 sm:mb-6 text-base sm:text-lg px-2">
            Upgrade your plan to unlock advanced capabilities and premium
            support.
          </p>
          <button className="bg-white text-indigo-600 px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-bold text-base sm:text-lg hover:bg-gray-100 transition-colors duration-300 w-full sm:w-auto">
            Upgrade Plan
          </button>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default YourPlanPage;
