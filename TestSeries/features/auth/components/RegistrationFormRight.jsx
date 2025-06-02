
import React, { useState, useRef } from 'react';
import { Building, Mail, Phone, Image, Globe, MapPin, Check, Loader, Lock, Upload, X, RefreshCcw } from 'lucide-react';
import { Country, State, City } from 'country-state-city';
import { useEffect } from 'react';
import { createOrganization } from '../../../utils/services/organizationService';
import { generatePassword } from '../../afterAuth/utility/GenerateRandomPassword';

const OrganizationRegistrationForm = () => {
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
    if (!file.type.match(/image\/(jpeg|jpg|png|gif|svg\+xml)/)) {
      setErrors(prev => ({ ...prev, logo: 'Please upload a valid image file (JPEG, PNG, GIF, SVG)' }));
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
    //   console.log('Form data:', formData);
    //   formData.logoUrl = logoFile ? previewUrl : '';
    //   const response=await createOrganization(formData);
        
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

        const response = await createOrganization(form);

        console.log("✅ Server response:", response); 
        console.log("✅ Uploaded logo URL:", response?.data?.logoUrl); 


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
      // Reset form or redirect
    } catch (err) {
      setMsg('❌ Error creating organization: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:w-2/3 bg-white rounded-xl shadow-md p-8 border border-blue-100">
      <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="mt-2">
          <h3 className="font-semibold text-blue-800 flex items-center text-lg pb-2 border-b border-blue-100">
            <Building className="mr-2" size={20} />
            Basic Information
          </h3>
        </div>
        <div className="grid md:grid-cols-1 gap-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Institute Name*</label>
            <div className="relative">
              <input
                type="text"
                className={`w-full pl-10 pr-4 py-3 border ${errors.name ? 'border-red-500' : 'border-blue-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                required
                value={formData.name}
                onChange={(e) => handleChange(e, 'name')}
                placeholder="Enter your Institute name"
                minLength={3}
                maxLength={32}
              />
              <Building className="absolute left-3 top-3.5 text-blue-500" size={18} />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            <p className="text-xs text-gray-500 mt-1">Name must be between 3-32 characters</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Phone Number*</label>
            <div className="relative">
              <input
                type="text"
                className={`w-full pl-10 pr-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-blue-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                required
                value={formData.phone}
                onChange={(e) => handleChange(e, 'phone')}
                placeholder="+91 9876543210"
              />
              <Phone className="absolute left-3 top-3.5 text-blue-500" size={18} />
            </div>
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            <p className="text-xs text-gray-500 mt-1">Format: +91-9876543210 or 9876543210</p>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Website (optional)</label>
            <div className="relative">
              <input
                type="url"
                className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={formData.website}
                onChange={(e) => handleChange(e, 'website')}
                placeholder="https://yoursite.com"
              />
              <Globe className="absolute left-3 top-3.5 text-blue-500" size={18} />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Institute Logo</label>

          {/* File upload area with drag and drop */}
          <div
            className={`border-2 border-dashed ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-blue-200'} 
            rounded-lg p-6 transition-all cursor-pointer text-center relative ${previewUrl ? 'h-64' : ''}`}
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
                  className="max-h-48 max-w-full object-contain rounded"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeLogo();
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4">
                <Upload className="text-blue-500 mb-2" size={36} />
                <p className="font-medium text-blue-600">Click or drag file to upload</p>
                <p className="text-sm text-gray-500 mt-1">
                  Supports JPG, PNG, GIF and SVG (max 5MB)
                </p>
              </div>
            )}
          </div>

          {errors.logo && <p className="text-red-500 text-xs mt-1">{errors.logo}</p>}
          <p className="text-xs text-gray-500 mt-1">
            If no logo is provided, a default logo will be generated based on your organization name
          </p>
        </div>

        <div className="mt-2">
          <h3 className="font-semibold text-blue-800 flex items-center text-lg pb-2 border-b border-blue-100">
            <Mail className="mr-2" size={20} />
            Login Information
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Email*</label>
            <div className="relative">
              <input
                type="email"
                className={`w-full pl-10 pr-4 py-3 border ${errors.email ? 'border-red-500' : 'border-blue-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                required
                value={formData.email}
                onChange={(e) => handleChange(e, 'email')}
                placeholder="email@example.com"
                minLength={10}
                maxLength={60}
              />
              <Mail className="absolute left-3 top-3.5 text-blue-500" size={18} />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            <p className="text-xs text-gray-500 mt-1">Must be a valid email between 10-60 characters</p>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Password*</label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                className={`w-full pl-10 pr-12 py-3 border ${errors.password ? 'border-red-500' : 'border-blue-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                required
                value={formData.password}
                onChange={(e) => handleChange(e, 'password')}
                placeholder="Create a secure password"
                minLength="8"
              />
              <Lock className="absolute left-3 top-3.5 text-blue-500" size={18} />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3.5 text-gray-500 hover:text-blue-700"
              >
                {passwordVisible ? "Hide" : "Show"}
              </button>
              <button
                                          onClick={() => generateRandomPasswordForOrg()}
                                          className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg flex items-center justify-center transition"
                                          title="Generate random password"
                                        >
                                          <RefreshCcw size={18} />
                                        </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-1 gap-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Confirm Password*</label>
            <div className="relative">
              <input
                type="password"
                className={`w-full pl-10 pr-4 py-3 border ${errors.confirm_password ? 'border-red-500' : 'border-blue-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                required
                value={formData.confirm_password}
                onChange={(e) => handleChange(e, 'confirm_password')}
                placeholder="Re-enter password"
              />
              <Lock className="absolute left-3 top-3.5 text-blue-500" size={18} />
            </div>
            {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password}</p>}
          </div>
        </div>

        <div className="mt-2">
          <h3 className="font-semibold text-blue-800 flex items-center text-lg pb-2 border-b border-blue-100">
            <MapPin className="mr-2" size={20} />
            Address Information
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Address Line 1*</label>
            <input
              type="text"
              className={`w-full px-4 py-3 border ${errors.address?.line1 ? 'border-red-500' : 'border-blue-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
              required
              value={formData.address.line1}
              onChange={(e) => handleChange(e, 'line1', 'address')}
              placeholder="Street address"
            />
            {errors.address?.line1 && <p className="text-red-500 text-xs mt-1">{errors.address.line1}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Address Line 2</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={formData.address.line2}
              onChange={(e) => handleChange(e, 'line2', 'address')}
              placeholder="Apt, suite, building (optional)"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Country*</label>
            <select 
            onChange={(e) => {
              setSelectedCountryCode(e.target.value);
              console.log(e.target);
              handleChange(e, 'country', 'address');
            }}
            className='w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'>
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.isoCode} value={country.isoCode}
                >
                  {country.name}
                </option>
              ))} 
            </select>
            {errors.address?.country && <p className="text-red-500 text-xs mt-1">{errors.address.country}</p>}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">State/Province*</label>
             <select 
            onChange={(e) =>{setSelectedStateCode(e.target.value)
              console.log(e.target.key);  
              handleChange(e, 'state', 'address');
            }}
            className='w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'>
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))} 
            </select>
            {errors.address?.state && <p className="text-red-500 text-xs mt-1">{errors.address.state}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">City*</label>
             <select 
            onChange={(e) => handleChange(e, 'city', 'address')}
            className='w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'>
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.isoCode} value={city.name }>
                  {city.name}
                </option>
              ))} 
            </select>
            {errors.address?.city && <p className="text-red-500 text-xs mt-1">{errors.address.city}</p>}
          </div>
          <div>

            <label className="block text-gray-700 text-sm font-medium mb-1">Postal/ZIP Code*</label>
            <input
              type="text"
              className={`w-full px-4 py-3 border ${errors.address?.pincode ? 'border-red-500' : 'border-blue-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
              required
              value={formData.address.pincode}
              onChange={(e) => handleChange(e, 'pincode', 'address')}
              placeholder="Postal or ZIP code"
              pattern="[0-9]{5,6}"
            />
            {errors.address?.pincode && <p className="text-red-500 text-xs mt-1">{errors.address.pincode}</p>}
            <p className="text-xs text-gray-500 mt-1">5-6 digit code</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-lg font-medium transition-all disabled:opacity-70 shadow-lg flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader className="animate-spin mr-2" size={20} />
              Processing...
            </>
          ) : (
            'Register Organization'
          )}
        </button>

        {msg && (
          <div className={`mt-4 p-4 rounded-lg ${msg.startsWith('✅') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {msg}
          </div>
        )}
      </form>
    </div>
  );
};

export default OrganizationRegistrationForm;

