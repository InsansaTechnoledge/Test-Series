
import React, { useState, useRef } from 'react';
import { Building, Mail, Phone, Image, Globe, MapPin, Check, Loader, Lock, Upload, X, RefreshCcw, Eye, EyeOff } from 'lucide-react';
import { Country, State, City } from 'country-state-city';
import { useEffect } from 'react';
import { createOrganization } from '../../../utils/services/organizationService';
import { generatePassword } from '../../afterAuth/utility/GenerateRandomPassword';

import { useNavigate } from 'react-router-dom';
import logo from '../../../assests/Landing/Navbar/evalvo logo blue 2.svg'

const OrganizationRegistrationForm = () => {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone: '',
    website: '',
    logoUrl: '', 
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
    },
    subscription: {
      status: 'trialing',
    },
    active: true
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedCountryCode, setSelectedCountryCode] = useState('');
  const [selectedStateCode, setSelectedStateCode] = useState('');
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);


  const countries = Country.getAllCountries();
  useEffect(() => {
    if(selectedCountryCode){
      setStates(State.getStatesOfCountry(selectedCountryCode));
    }
  },[selectedCountryCode]);

  useEffect(() => {
    if(selectedStateCode && selectedCountryCode){
      setCities(City.getCitiesOfState(selectedCountryCode, selectedStateCode));
    }
  },[selectedStateCode, selectedCountryCode]);


  // New state for logo file handling
  const [logoFile, setLogoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
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
      case 'phone':
        return /^(\+\d{1,3}[- ]?)?\d{10}$/.test(value) ? '' : 'Please enter a valid phone number';
      case 'pincode':
        return /^[0-9]{5,6}$/.test(value) ? '' : 'Please enter a valid postal/ZIP code (5-6 digits)';
      default:
        return '';
    }
  };

    const generateRandomPasswordForOrg = () => {
      const password = generatePassword();
      setFormData((prev) => ({
        ...prev,
        password: password,
        confirm_password: password
      }));
      
    }

  const handleChange = (e, field, nested = null) => {

    const value = field==='country' ?
    countries.find(country => country.isoCode === e.target.value).name :
    field==='state' ?
    states.find(state => state.isoCode === e.target.value).name :
    e.target.value;

    if (nested) {
      setFormData((prev) => ({
        ...prev,
        [nested]: {
          ...prev[nested],
          [field]: value,
        },
      }));

      if (field === 'pincode') {
        const error = validateField(field, value);
        setErrors(prev => ({
          ...prev,
          [nested]: {
            ...prev[nested],
            [field]: error
          }
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));

      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }

  };

  // Logo file handling functions
  const handleLogoChange = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      setErrors(prev => ({ ...prev, logo: 'Please upload a valid image file (JPEG, PNG)' }));
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, logo: 'Image size should be less than 5MB' }));
      return;
    }

    // Clear any previous errors
    setErrors(prev => ({ ...prev, logo: '' }));

    // Set the file in state
    setLogoFile(file);

    // Create a preview URL
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleLogoChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleLogoChange(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const removeLogo = () => {
    setLogoFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    // Validate all fields
    const newErrors = {};
    let hasErrors = false;

    // Validate direct fields
    ['name', 'email', 'password', 'confirm_password', 'phone'].forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        hasErrors = true;
      }
    });

    // Validate address fields
    const addressErrors = {};
    if (!formData.address.line1) {
      addressErrors.line1 = 'Address line 1 is required';
      hasErrors = true;
    }
    if (!formData.address.city) {
      addressErrors.city = 'City is required';
      hasErrors = true;
    }
    if (!formData.address.state) {
      addressErrors.state = 'State is required';
      hasErrors = true;
    }
    if (!formData.address.country) {
      addressErrors.country = 'Country is required';
      hasErrors = true;
    }
    if (!formData.address.pincode || !/^[0-9]{5,6}$/.test(formData.address.pincode)) {
      addressErrors.pincode = 'Please enter a valid postal/ZIP code (5-6 digits)';
      hasErrors = true;
    }

    if (Object.keys(addressErrors).length > 0) {
      newErrors.address = addressErrors;
    }

    setErrors(newErrors);

    if (hasErrors) {
      setLoading(false);
      setMsg('❌ Please fix the errors in the form');
      return;
    }

    try {
        
        const form = new FormData();

        for(let key in formData) { 
            if(key === 'address' || key === 'subscription') {
                form.append(key, JSON.stringify(formData[key]))
            } else if(key !== 'logoUrl') {
                form.append(key, formData[key])
            }
        }

        if(logoFile) {
            form.append('logoUrl' , logoFile)
        }

        const response = await createOrganization(form);; 


      setMsg(`✅ Institute created successfully by the name ${response.data.name}!`);
      setFormData({
        name: '',
        email: '',
        password: '',
        confirm_password: '',
        phone: '',
        website: '',
        logoUrl: response.data.logoUrl || '',
        address: {
          line1: '',
          line2: '',
          city: '',
          state: '',
          country: '',
          pincode: '',
        },
      });
      navigate('/login?role=Institute');
      // Reset form or redirect
    } catch (err) {
      setMsg('❌ Error creating organization: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center  mb-8">
            {/* <Building className="w-10 h-10 text-white" /> */}
            <img src={logo} alt="evalvo_logo" className='h-full w-full ' />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
            Register Your Organization
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Join our platform and start managing your institute with powerful tools and features
          </p>
        </div>

        {/* Main Form Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 lg:p-10">
            
            {/* Basic Information Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-lg mr-3">
                  <Building className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              </div>

              <div className="space-y-6">
                {/* Institute Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institute Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className={`w-full pl-12 pr-4 py-3 border ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} rounded-lg focus:ring-2 focus:ring-opacity-50 transition-all duration-200`}
                      required
                      value={formData.name}
                      onChange={(e) => handleChange(e, 'name')}
                      placeholder="Enter your Institute name"
                      minLength={3}
                      maxLength={32}
                    />
                    <Building className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  </div>
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  <p className="text-gray-500 text-sm mt-1">Name must be between 3-32 characters</p>
                </div>

                {/* Phone and Website */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className={`w-full pl-12 pr-4 py-3 border ${errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} rounded-lg focus:ring-2 focus:ring-opacity-50 transition-all duration-200`}
                        required
                        value={formData.phone}
                        onChange={(e) => handleChange(e, 'phone')}
                        placeholder="+91 9876543210"
                      />
                      <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    </div>
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    <p className="text-gray-500 text-sm mt-1">Format: +91-9876543210 or 9876543210</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website (optional)
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                        value={formData.website}
                        onChange={(e) => handleChange(e, 'website')}
                        placeholder="https://yoursite.com"
                      />
                      <Globe className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institute Logo
                  </label>
                  <div
                    className={`border-2 border-dashed ${isDragging ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300'} 
                    rounded-xl p-6 transition-all duration-200 cursor-pointer ${previewUrl ? 'h-64' : 'h-48'}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileInputChange}
                      className="hidden"
                      accept="image/jpeg,image/png,image/gif,image/svg+xml"
                    />

                    {previewUrl ? (
                      <div className="relative h-full flex items-center justify-center">
                        <img
                          src={previewUrl}
                          alt="Logo preview"
                          className="max-h-48 max-w-full object-contain rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeLogo();
                          }}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors duration-200 shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                          <Upload className="w-6 h-6 text-indigo-600" />
                        </div>
                        <p className="text-lg font-medium text-gray-900 mb-1">Click or drag file to upload</p>
                        <p className="text-sm text-gray-500">
                          Supports JPG, PNG • Max file size: 5MB
                        </p>
                      </div>
                    )}
                  </div>
                  {errors.logo && <p className="text-red-500 text-sm mt-1">{errors.logo}</p>}
                  <p className="text-gray-500 text-sm mt-1">
                    If no logo is provided, a default logo will be generated based on your organization name
                  </p>
                </div>
              </div>
            </div>

            {/* Login Information Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-lg mr-3">
                  <Mail className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Login Information</h2>
              </div>

              <div className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      className={`w-full pl-12 pr-4 py-3 border ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} rounded-lg focus:ring-2 focus:ring-opacity-50 transition-all duration-200`}
                      required
                      value={formData.email}
                      onChange={(e) => handleChange(e, 'email')}
                      placeholder="email@example.com"
                      minLength={10}
                      maxLength={60}
                    />
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  <p className="text-gray-500 text-sm mt-1">Must be a valid email between 10-60 characters</p>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={passwordVisible ? "text" : "password"}
                        className={`w-full pl-12 pr-20 py-3 border ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} rounded-lg focus:ring-2 focus:ring-opacity-50 transition-all duration-200`}
                        required
                        value={formData.password}
                        onChange={(e) => handleChange(e, 'password')}
                        placeholder="Create a secure password"
                        minLength="8"
                      />
                      <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                      <div className="absolute right-3 top-3 flex space-x-1">
                        <button
                          type="button"
                          onClick={() => setPasswordVisible(!passwordVisible)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                          {passwordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={generateRandomPasswordForOrg}
                          className="p-1 text-gray-400 hover:text-indigo-600 transition-colors duration-200"
                          title="Generate random password"
                        >
                          <RefreshCcw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    <p className="text-gray-500 text-sm mt-1">
                      Must include uppercase, lowercase, number, and special character
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={confirmPasswordVisible ? "text" : "password"}
                        className={`w-full pl-12 pr-12 py-3 border ${errors.confirm_password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} rounded-lg focus:ring-2 focus:ring-opacity-50 transition-all duration-200`}
                        required
                        value={formData.confirm_password}
                        onChange={(e) => handleChange(e, 'confirm_password')}
                        placeholder="Re-enter password"
                      />
                      <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                        className="absolute right-3 top-3.5 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        {confirmPasswordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirm_password && <p className="text-red-500 text-sm mt-1">{errors.confirm_password}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-lg mr-3">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Address Information</h2>
              </div>

              <div className="space-y-6">
                {/* Address Lines */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      className={`w-full px-4 py-3 border ${errors.address?.line1 ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} rounded-lg focus:ring-2 focus:ring-opacity-50 transition-all duration-200`}
                      required
                      value={formData.address.line1}
                      onChange={(e) => handleChange(e, 'line1', 'address')}
                      placeholder="Street address"
                    />
                    {errors.address?.line1 && <p className="text-red-500 text-sm mt-1">{errors.address.line1}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                      value={formData.address.line2}
                      onChange={(e) => handleChange(e, 'line2', 'address')}
                      placeholder="Apt, suite, building (optional)"
                    />
                  </div>
                </div>

                {/* Country and State */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <select 
                      onChange={(e) => {
                        setSelectedCountryCode(e.target.value);
                        handleChange(e, 'country', 'address');
                      }}
                      className={`w-full px-4 py-3 border ${errors.address?.country ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} rounded-lg focus:ring-2 focus:ring-opacity-50 transition-all duration-200 bg-white`}
                      value={selectedCountryCode}
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country.isoCode} value={country.isoCode}>
                          {country.name}
                        </option>
                      ))} 
                    </select>
                    {errors.address?.country && <p className="text-red-500 text-sm mt-1">{errors.address.country}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State/Province *
                    </label>
                    <select 
                      onChange={(e) => {
                        setSelectedStateCode(e.target.value);
                        handleChange(e, 'state', 'address');
                      }}
                      className={`w-full px-4 py-3 border ${errors.address?.state ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} rounded-lg focus:ring-2 focus:ring-opacity-50 transition-all duration-200 bg-white`}
                      value={selectedStateCode}
                      disabled={!selectedCountryCode}
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </option>
                      ))} 
                    </select>
                    {errors.address?.state && <p className="text-red-500 text-sm mt-1">{errors.address.state}</p>}
                  </div>
                </div>

                {/* City and Postal Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <select 
                      onChange={(e) => handleChange(e, 'city', 'address')}
                      className={`w-full px-4 py-3 border ${errors.address?.city ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} rounded-lg focus:ring-2 focus:ring-opacity-50 transition-all duration-200 bg-white`}
                      disabled={!selectedStateCode}
                    >
                      <option value="">Select City</option>
                      {cities.map((city, index) => (
                        <option key={index} value={city.name}>
                          {city.name}
                        </option>
                      ))} 
                    </select>
                    {errors.address?.city && <p className="text-red-500 text-sm mt-1">{errors.address.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal/ZIP Code *
                    </label>
                    <input
                      type="text"
                      className={`w-full px-4 py-3 border ${errors.address?.pincode ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} rounded-lg focus:ring-2 focus:ring-opacity-50 transition-all duration-200`}
                      required
                      value={formData.address.pincode}
                      onChange={(e) => handleChange(e, 'pincode', 'address')}
                      placeholder="Postal or ZIP code"
                      pattern="[0-9]{5,6}"
                    />
                    {errors.address?.pincode && <p className="text-red-500 text-sm mt-1">{errors.address.pincode}</p>}
                    <p className="text-gray-500 text-sm mt-1">5-6 digit code</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col items-center space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:shadow-md transition-all duration-200 flex items-center justify-center min-w-[200px]"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin mr-3 w-5 h-5" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Building className="mr-3 w-5 h-5" />
                    Register Organization
                  </>
                )}
              </button>

              {msg && (
                <div className={`w-full max-w-md p-4 rounded-xl border ${msg.startsWith('✅') 
                  ? 'bg-green-50 text-green-800 border-green-200' 
                  : 'bg-red-50 text-red-800 border-red-200'
                } text-center font-medium`}>
                  {msg}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p className="text-sm">
            Already have an account? 
            <button onClick={() => navigate('/login?role=Institute')} className="ml-1 cursor-pointer  text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200">
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrganizationRegistrationForm;

