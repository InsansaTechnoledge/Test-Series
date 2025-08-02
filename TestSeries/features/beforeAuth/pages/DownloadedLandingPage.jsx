import React, { useState } from "react";
import { Eye, EyeOff, Monitor, Moon, Sun } from "lucide-react";
import LogoLight from '../../../assests/Logo/Frame 8.svg'
import LogoDark from '../../../assests/Logo/Frame 15.svg'
import { useUser } from "../../../contexts/currentUserContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../hooks/useTheme";
import { useToast } from "../../../utils/Toaster";
import {
  checkAuth,
  orgLogin,
  studentLogin,
} from "../../../utils/services/authService";

const DesktopSignInPage = () => {
  const { theme , handleTheme } = useTheme();
  const { setUser } = useUser();
  const navigate = useNavigate();

  const [loginEntity, setLoginEntity] = useState("institute");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toasts, showToast, removeToast } = useToast();
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const EntityChangeHandler = () =>
    setLoginEntity((prev) => (prev === "institute" ? "student" : "institute"));

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "Please enter a valid email address";
      case "password":
        const hasUpper = /[A-Z]/.test(value);
        const hasLower = /[a-z]/.test(value);
        const hasDigit = /\d/.test(value);
        const hasSpecial = /[!@#$%^&*]/.test(value);
        const longEnough = value.length >= 8;
        return hasUpper && hasLower && hasDigit && hasSpecial && longEnough
          ? ""
          : "Password must contain upper, lower, digit, special char, and be at least 8 characters";
      default:
        return "";
    }
  };

  const handleChange = (e, field) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    Object.entries(formData).forEach(([field, value]) => {
      const error = validateField(field, value);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      let response;

      if (loginEntity === "institute") {
        response = await orgLogin(formData);
      } else {
        response = await studentLogin(formData);
      }

      if (response?.status === 200) {
        const waitForUser = async (retries = 10) => {
          for (let i = 0; i < retries; i++) {
            const userResponse = await checkAuth();
            if (userResponse?.status === 200) {
              setUser(userResponse.data.user);
              localStorage.setItem("hasLoggedIn", "true");
              navigate(
                loginEntity === "institute"
                  ? "/institute/institute-landing"
                  : "/student/student-landing"
              );
              return;
            }
            await new Promise((res) => setTimeout(res, 2000));
          }
          showToast(
            "Login session expired or not set. Please try again.",
            "error"
          );
        };

        await waitForUser();
      }

      setFormData({ email: "", password: "" });
      setErrors({});
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.errors || "Something went wrong";
      setErrors({ global: errorMessage });
      showToast(`${errorMessage}`, "error");
      console.error("Login error:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const backgroundStyle = theme === 'light'
    ? {
        background: "#ffffff",
      }
    : {
        background: "#121212",
      };

  return (
    <div
      className="min-h-screen flex"
      style={backgroundStyle}
    >
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative">
        <div className={`text-center ${theme === "light" ? "text-gray-800" : "text-white"}`}>
          {/* Logo */}
          <div className="mb-8">
            <img src={theme === 'light' ? LogoLight : LogoDark} alt="" />
            <p className={`text-xl ${theme === "light" ? "text-gray-600" : "opacity-90"}`}>Evalvo's Desktop Application</p>
          </div>
          
          {/* Features */}
          <div className="space-y-4 text-left max-w-md">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 ${theme === "light" ? "bg-indigo-100" : "bg-white/20"} rounded-full flex items-center justify-center`}>
                <div className={`w-2 h-2 ${theme === "light" ? "bg-indigo-600" : "bg-white"} rounded-full`}></div>
              </div>
              <span className="text-lg">Secure Authentication</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 ${theme === "light" ? "bg-indigo-100" : "bg-white/20"} rounded-full flex items-center justify-center`}>
                <div className={`w-2 h-2 ${theme === "light" ? "bg-indigo-600" : "bg-white"} rounded-full`}></div>
              </div>
              <span className="text-lg">Multi-Platform Support</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 ${theme === "light" ? "bg-indigo-100" : "bg-white/20"} rounded-full flex items-center justify-center`}>
                <div className={`w-2 h-2 ${theme === "light" ? "bg-indigo-600" : "bg-white"} rounded-full`}></div>
              </div>
              <span className="text-lg">Advanced Exam Management</span>
            </div>
          </div>
        </div>
        
      </div>

      {/* Right Panel - Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div
          className={`w-full max-w-md ${
            theme === "light" ? "bg-white" : "bg-gray-950"
          } rounded-3xl shadow-2xl p-8 backdrop-blur-sm border ${
            theme === "light" ? "border-gray-200" : "border-gray-700"
          }`}
        >
          {/* Theme Toggle */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => handleTheme(theme === "light" ? "dark" : "light")}
              className={`p-2 rounded-full transition-all duration-300 ${
                theme === "light"
                  ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2
              className={`text-3xl font-bold mb-2 ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}
            >
              Welcome Back
            </h2>
            <p
              className={`${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Sign in to your account to continue
            </p>
          </div>

          {/* Entity Toggle */}
          <div
            className={`relative grid grid-cols-2 gap-1 mb-8 ${
              theme === "light" ? "bg-gray-100" : "bg-gray-800"
            } p-1 rounded-2xl`}
          >
            <div
              className={`absolute top-1 bottom-1 w-1/2 ${
                theme === "light" ? "bg-white" : "bg-gray-700"
              } rounded-xl shadow-md transition-transform duration-300 ease-out ${
                loginEntity === "student" ? "transform translate-x-full" : ""
              }`}
            ></div>

            <button
              onClick={
                loginEntity === "student" ? EntityChangeHandler : undefined
              }
              className={`relative z-10 px-4 py-3 font-semibold rounded-xl transition-all duration-300 ${
                loginEntity === "institute"
                  ? `${
                      theme === "light"
                        ? "text-indigo-600"
                        : "text-indigo-400"
                    }`
                  : `${
                      theme === "light"
                        ? "text-gray-600"
                        : "text-gray-400"
                    }`
              }`}
            >
              Institute
            </button>
            <button
              onClick={
                loginEntity === "institute" ? EntityChangeHandler : undefined
              }
              className={`relative z-10 px-4 py-3 font-semibold rounded-xl transition-all duration-300 ${
                loginEntity === "student"
                  ? `${
                      theme === "light"
                        ? "text-indigo-600"
                        : "text-indigo-400"
                    }`
                  : `${
                      theme === "light"
                        ? "text-gray-600"
                        : "text-gray-400"
                    }`
              }`}
            >
              Student
            </button>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Email */}
            <div>
              <label
                className={`block mb-2 text-sm font-medium ${
                  theme === "light" ? "text-gray-700" : "text-gray-300"
                }`}
              >
                {loginEntity === "institute"
                  ? "Institute Email"
                  : "Student Email"}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange(e, "email")}
                placeholder="you@example.com"
                className={`w-full py-3 px-4 rounded-xl border-2 focus:outline-none focus:ring-0 transition-all duration-200 ${
                  theme === "light"
                    ? "bg-gray-50 text-gray-900 border-gray-200 focus:border-indigo-500"
                    : "bg-gray-800 text-white border-gray-700 focus:border-indigo-400"
                } ${errors.email ? "border-red-500" : ""}`}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <label
                className={`block mb-2 text-sm font-medium ${
                  theme === "light" ? "text-gray-700" : "text-gray-300"
                }`}
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleChange(e, "password")}
                placeholder="Enter your password"
                className={`w-full py-3 px-4 pr-12 rounded-xl border-2 focus:outline-none focus:ring-0 transition-all duration-200 ${
                  theme === "light"
                    ? "bg-gray-50 text-gray-900 border-gray-200 focus:border-indigo-500"
                    : "bg-gray-800 text-white border-gray-700 focus:border-indigo-400"
                } ${errors.password ? "border-red-500" : ""}`}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={`absolute right-3 top-[43px] ${
                  theme === "light" ? "text-gray-400 hover:text-gray-600" : "text-gray-500 hover:text-gray-300"
                } transition-colors`}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span
                  className={`ml-2 text-sm ${
                    theme === "light" ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className={`text-sm font-medium ${
                  theme === "light"
                    ? "text-indigo-600 hover:text-indigo-500"
                    : "text-indigo-400 hover:text-indigo-300"
                } transition-colors`}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
                theme === "light"
                  ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl"
              } disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Global error */}
            {errors.global && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm text-center">
                  {errors.global}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={`text-center mt-8 pt-6 border-t ${theme === "light" ? "border-gray-200" : "border-gray-700"}`}>
            <button
              onClick={EntityChangeHandler}
              className={`text-sm font-medium ${
                theme === "light"
                  ? "text-indigo-600 hover:text-indigo-500"
                  : "text-indigo-400 hover:text-indigo-300"
              } transition-colors`}
            >
              {loginEntity === "institute"
                ? "Switch to Student Login"
                : "Switch to Institute Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopSignInPage;