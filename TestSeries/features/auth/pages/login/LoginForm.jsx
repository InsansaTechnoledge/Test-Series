import { Eye, EyeOff, KeyRound, LogIn, Mail } from 'lucide-react';
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { checkAuth, orgLogin, studentLogin } from '../../../../utils/services/authService';
import { useUser } from '../../../../contexts/currentUserContext';

const LoginForm = () => {
  const { user, setUser } = useUser();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ Added loading state
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) &&
          value.length >= 10 &&
          value.length <= 60
          ? ''
          : 'Please enter a valid email address';
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
      default:
        return '';
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

    // Validate the form data
    Object.entries(formData).forEach(([field, value]) => {
      const error = validateField(field, value);
      if (error) newErrors[field] = error;
    });

    // If there are errors, do not submit the form
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true); // Start loading state
    try {
      let response;

      // Login based on role
      if (role === 'Institute') {
        response = await orgLogin(formData);
      } else if (role === 'Student') {
        response = await studentLogin(formData);
      }

      if (response?.status === 200) {
        const waitForUser = async (retries = 10) => {
          for (let i = 0; i < retries; i++) {
            const userResponse = await checkAuth();
            if (userResponse?.status === 200) {
              setUser(userResponse.data.user);
              // Navigate based on role
              if (role === 'Institute') {
                navigate('/institute/institute-landing');
              } else {
                navigate('/student/student-landing');
              }
              return;
            }
            await new Promise((resolve) => setTimeout(resolve, 500)); // wait 500ms between retries
          }
          alert("Login session expired or not set. Please try again.");
        };

        await waitForUser();
      }

      // Reset form and errors on success
      setFormData({ email: '', password: '' });
      setErrors({});
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.errors || "Something went wrong";
      setErrors({ global: errorMessage }); // Set a global error message
      alert(errorMessage); // Show alert on error
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8 border border-blue-100">
      <form onSubmit={handleSubmit}>
        <div className="mt-2">
          <h3 className="font-semibold text-blue-800 flex items-center text-lg pb-2 border-b border-blue-100">
            <LogIn className="mr-2" size={20} />
            Login Information
          </h3>
        </div>

        {/* Email Input */}
        <div className="grid md:grid-cols-1 gap-6 mt-5">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              {role === 'Institute' ? 'Institute Email' : 'Student Email'}
            </label>
            <div className="relative">
              <input
                type="email"
                className={`w-full pl-10 pr-4 py-3 border ${errors.email ? 'border-red-500' : 'border-blue-200'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                value={formData.email}
                onChange={(e) => handleChange(e, 'email')}
                placeholder="Enter your registered e-mail"
              />
              <Mail className="absolute left-3 top-3.5 text-blue-500" size={18} />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
        </div>

        {/* Password Input */}
        <div className="grid md:grid-cols-1 gap-6 mt-5">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Password
            </label>
            <div className="relative flex-grow">
              <input
                type={showPassword ? 'text' : 'password'}
                className={`w-full pl-10 pr-4 py-3 border ${errors.password ? 'border-red-500' : 'border-blue-200'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                value={formData.password}
                onChange={(e) => handleChange(e, 'password')}
                placeholder="Enter your password"
              />
              <KeyRound className="absolute left-3 top-3.5 text-blue-500" size={18} />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
        </div>

        {/* Global Error Message */}
        {errors.global && <p className="text-red-500 text-sm mt-1">{errors.global}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-all disabled:opacity-70 shadow-lg flex items-center justify-center"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
