import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../contexts/currentUserContext';
import { useTheme } from '../../../hooks/useTheme';
import logoDark from '../../../assests/Logo/Frame 8.svg';
import logolight from '../../../assests/Logo/Frame 15.svg';
import { checkAuth, orgLogin, studentLogin } from '../../../utils/services/authService';

const DownloadedLandingPage = () => {
  const { theme , handleTheme } = useTheme();
  const { setUser } = useUser();
  const navigate = useNavigate();

  const [loginEntity, setLoginEntity] = useState('institute');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);
  const EntityChangeHandler = () => setLoginEntity(prev => (prev === 'institute' ? 'student' : 'institute'));

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid email address';
      case 'password':
        const hasUpper = /[A-Z]/.test(value);
        const hasLower = /[a-z]/.test(value);
        const hasDigit = /\d/.test(value);
        const hasSpecial = /[!@#$%^&*]/.test(value);
        const longEnough = value.length >= 8;
        return hasUpper && hasLower && hasDigit && hasSpecial && longEnough
          ? ''
          : 'Password must contain upper, lower, digit, special char, and be at least 8 characters';
      default:
        return '';
    }
  };

  const handleChange = (e, field) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
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

      if (loginEntity === 'institute') {
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
              localStorage.setItem('hasLoggedIn', 'true');
              navigate(loginEntity === 'institute' ? '/institute/institute-landing' : '/student/student-landing');
              return;
            }
            await new Promise(res => setTimeout(res, 2000));
          }
          alert("Login session expired or not set. Please try again.");
        };

        await waitForUser();
      }

      setFormData({ email: '', password: '' });
      setErrors({});
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.errors || 'Something went wrong';
      setErrors({ global: errorMessage });
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-950'} min-h-screen flex items-center justify-center px-4`}>
      <div className="w-full max-w-md bg-opacity-10 backdrop-blur-md border border-gray-300 dark:border-gray-700 rounded-2xl p-8 shadow-xl">
        <div className="flex justify-center mb-8">
          <img src={theme === 'light' ? logoDark : logolight} alt="Evalvo Logo" className="h-16" />
        </div>

        <h2 className={`text-2xl font-bold text-center mb-6 ${theme === 'light' ? 'text-gray-800' : 'text-indigo-100'}`}>
          {loginEntity === 'institute' ? 'Institute Login' : 'Student Login'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className={`block mb-2 text-sm font-medium ${theme === 'light' ? 'text-gray-800' : 'text-indigo-100'}`}>
              {loginEntity === 'institute' ? 'Institute Email' : 'Student Email'}
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange(e, 'email')}
              placeholder="you@example.com"
              className={`w-full py-3 px-4 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200 
                ${theme === 'light' ? 'bg-gray-100 text-gray-900 focus:ring-blue-500' : 'bg-gray-800 text-indigo-100 focus:ring-indigo-400'} 
                ${errors.email ? 'border-red-500' : 'border-blue-200'}`}
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <label className={`block mb-2 text-sm font-medium ${theme === 'light' ? 'text-gray-800' : 'text-indigo-100'}`}>
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleChange(e, 'password')}
              placeholder="Enter your password"
              className={`w-full py-3 px-4 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200 
                ${theme === 'light' ? 'bg-gray-100 text-gray-900 focus:ring-blue-500' : 'bg-gray-800 text-indigo-100 focus:ring-indigo-400'} 
                ${errors.password ? 'border-red-500' : 'border-blue-200'}`}
              required
            />
            <div
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-[43px] cursor-pointer text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-4 rounded-xl font-semibold transition-all duration-200 shadow-lg 
              ${theme === 'light' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'} 
              disabled:opacity-70`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          {/* Global error */}
          {errors.global && <p className="text-red-500 text-sm mt-3 text-center">{errors.global}</p>}
        </form>

        <div className="text-center mt-6">
          <button
            onClick={EntityChangeHandler}
            className={`text-sm font-medium underline hover:no-underline transition-colors duration-200 
              ${theme === 'light' ? 'text-blue-600 hover:text-blue-800' : 'text-indigo-300 hover:text-indigo-500'}`}
          >
            {loginEntity === 'institute' ? 'Switch to Student Login' : 'Switch to Institute Login'}
          </button>

        
        </div>
        <div className="text-center mt-4 relative z-10">
          <button
            onClick={() => handleTheme(prev => prev === 'light' ? 'dark' : 'light')}
            className={`text-xs px-4 py-2 rounded-full transition-all duration-300 ${
              theme === 'light' 
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadedLandingPage;
