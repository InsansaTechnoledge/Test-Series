import React, { useState } from 'react';
import HeadingUtil from '../../utility/HeadingUtil';
import NeedHelpComponent from './components/NeedHelpComponent';
import { useCachedBatches } from '../../../../hooks/useCachedBatches';
import { Calendar, Users, Trophy, FileText, Clock, Play, CheckCircle } from 'lucide-react';
import Select from 'react-select';
import { useUser } from '../../../../contexts/currentUserContext';
import { createContest } from '../../../../utils/services/contestService';
import { useNavigate } from 'react-router-dom';
import { usePageAccess } from '../../../../contexts/PageAccessContext';
import Banner from "../../../../assests/Institute/create contest.svg"
import { useTheme } from '../../../../hooks/useTheme';

const CreateContest = () => {
  const [ContestType, setContestType] = useState('participation_based');
  const [name, setName] = useState('');
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [schedule, setSchedule] = useState(null); // for scheduled type
  const [validity, setValidity] = useState({
    start: '',
    end: '',
  });
 
  const [error, setError] = useState({});
  
  const navigate = useNavigate();

  const canAccessPage = usePageAccess();
  const { theme } = useTheme()

  const { batches } = useCachedBatches();
  const user = useUser();

  const batchOptions = batches.map(b => ({
    value: b.id,
    label: b.name,
  }));

 
  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return value.trim().length >= 3 && value.trim().length <= 100
          ? ""
          : "Contest name must be between 3-100 characters";
      case "description":
        return value.trim().length >= 10 && value.trim().length <= 500
          ? ""
          : "Description must be between 10-500 characters";
      case "duration":
        const durationNum = parseInt(value);
        return durationNum >= 1 && durationNum <= 1440
          ? ""
          : "Duration must be between 1-1440 minutes";
      case "selectedBatches":
        return value.length > 0
          ? ""
          : "Please select at least one batch";
      case "validity.start":
        return value ? "" : "Start date is required";
      case "validity.end":
        return value ? "" : "End date is required";
      case "schedule":
        return value ? "" : "Schedule date and time is required";
      default:
        return "";
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    const fieldError = validateField("name", value);
    setError(prev => ({ ...prev, name: fieldError }));
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);
    const fieldError = validateField("description", value);
    setError(prev => ({ ...prev, description: fieldError }));
  };

  const handleDurationChange = (e) => {
    const value = e.target.value;
    setDuration(value);
    const fieldError = validateField("duration", value);
    setError(prev => ({ ...prev, duration: fieldError }));
  };

  const handleBatchChange = (selected) => {
    const batchIds = selected.map(opt => opt.value);
    setSelectedBatches(batchIds);
    const fieldError = validateField("selectedBatches", batchIds);
    setError(prev => ({ ...prev, selectedBatches: fieldError }));
  };

  const handleValidityChange = (field, value) => {
    setValidity(prev => ({ ...prev, [field]: value }));
    const fieldError = validateField(`validity.${field}`, value);
    setError(prev => ({ ...prev, [`validity.${field}`]: fieldError }));
   
    if (field === 'start' && validity.end) {
      if (new Date(value) >= new Date(validity.end)) {
        setError(prev => ({ ...prev, 'validity.start': 'Start date must be before end date' }));
      }
    }
    if (field === 'end' && validity.start) {
      if (new Date(validity.start) >= new Date(value)) {
        setError(prev => ({ ...prev, 'validity.end': 'End date must be after start date' }));
      }
    }
  };

  const handleScheduleChange = (e) => {
    const value = e.target.value;
    setSchedule(value);
    const fieldError = validateField("schedule", value);
    setError(prev => ({ ...prev, schedule: fieldError }));
  };

  const handleSubmit = async () => {
    console.log("Submitting form with data:", { ContestType, name, selectedBatches, description, duration, schedule, validity });
    
    const validationErrors = {};
    
  
    const nameError = validateField("name", name);
    if (nameError) validationErrors.name = nameError;
    
    const descriptionError = validateField("description", description);
    if (descriptionError) validationErrors.description = descriptionError;
    
    const durationError = validateField("duration", duration);
    if (durationError) validationErrors.duration = durationError;
    
    const batchError = validateField("selectedBatches", selectedBatches);
    if (batchError) validationErrors.selectedBatches = batchError;
    
    
    if (ContestType === 'participation_based') {
      const startError = validateField("validity.start", validity.start);
      if (startError) validationErrors['validity.start'] = startError;
      
      const endError = validateField("validity.end", validity.end);
      if (endError) validationErrors['validity.end'] = endError;
    
      if (validity.start && validity.end && new Date(validity.start) >= new Date(validity.end)) {
        validationErrors['validity.start'] = 'Start date must be before end date';
      }
    } else {
      const scheduleError = validateField("schedule", schedule);
      if (scheduleError) validationErrors.schedule = scheduleError;
    }

    // If there are validation errors, set them and return early
    if (Object.keys(validationErrors).length > 0) {
      setError(prev => ({ ...prev, ...validationErrors }));
      return;
    }

    const formData = {
      type: ContestType,
      name,
      selectedBatches,
      description,
      duration,
      schedule,
      validity,
    }

    try {
      const response = await createContest(formData);
      if (response.status === 200) {
        navigate('/institute/code-create/?contestId=' + response.data.id);
      }
    } catch (error) {
      console.error('Error creating contest:', error);
      const errorMessage = error?.response?.data?.errors?.[0] || 
                          error?.response?.data?.message || 
                          error?.message || 
                          "An unexpected error occurred";
      setError(prev => ({ ...prev, form: errorMessage }));
    }
  };

  const inputCommon = `p-4 rounded-2xl transition-all duration-300 text-lg w-full pr-14 ${theme === 'light'
    ? 'bg-white text-gray-900 border-2 border-gray-200 focus:ring-indigo-200 focus:border-indigo-400 placeholder-gray-400'
    : 'bg-gray-800 text-indigo-100 border-2 border-gray-600 focus:ring-indigo-500 focus:border-indigo-300 placeholder-indigo-300'
    }`;
  const LabelCommon = `text-lg font-bold ${theme === 'light' ? 'text-gray-700' : 'text-indigo-200'
    }`

  return (

    <div className={`min-h-scree}`}>
      <div className="mx-auto px-6 py-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-xl h-80 mt-3">
          <img
            src={Banner}
            alt="Upload Banner"
            className="absolute w-full h-full object-cover"
          />
          <div className={`absolute inset-0 ${theme === 'dark'
            ? 'bg-gray-900/60'
            : 'bg-black/20'
            }`}></div>

          <div className="relative z-10 flex items-center justify-center h-full px-6 text-center w-full">
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
                Design a contest
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
                Design your perfect contest experience
              </p>
            </div>
          </div>
        </div>

        {/* Help Component */}
        <div className='mx-auto -mt-10 relative z-20 w-[90%]'>
          <NeedHelpComponent
            heading="What does a contest do?"
            about="contest lets you conduct any coding event or fest"
            question="would it display ranking?"
            answer="yes, after the contest ranking/leaderboard would be declared disclosing the winners. Also, selected batch can be added in a contest, and students of respective batches can participate"
          />
        </div>

        {/* Form */}
        <div className="min-h-screen p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className={`text-4xl font-bold bg-gradient-to-r ${theme === 'light'
                ? 'from-indigo-600 to-purple-600'
                : 'from-indigo-400 to-purple-400'
                } bg-clip-text text-transparent mb-4`}>
                Create New Contest
              </h1>
            </div>

            {/* Main Form Card */}
            <div className={`rounded-3xl shadow-xl border p-10 relative overflow-hidden ${theme === 'light'
              ? 'bg-white/70 backdrop-blur-sm border-indigo-100'
              : 'bg-gray-800/70 backdrop-blur-sm border-gray-700'
              }`}>
              <div className="rounded-2xl p-8 space-y-10">

                {/* Contest Type */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Play className={`w-5 h-5 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'
                      }`} />
                    <label className={LabelCommon}>Contest Type</label>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <select
                      value={ContestType}
                      onChange={(e) => setContestType(e.target.value)}
                      className={inputCommon}
                    >
                      <option value="participation_based">Registered Type</option>
                      <option value="scheduled">Scheduled Type</option>
                    </select>

                    {ContestType && (
                    <span
                    className={`inline-block w-1/2 p-4 border rounded-2xl text-center 
                      ${theme === 'light'
                        ? 'text-indigo-700 bg-indigo-100 border-indigo-200'
                        : 'text-indigo-300 bg-indigo-900 border-indigo-600'
                      }`}
                  >
                    {ContestType === 'participation_based' ? 'Registered Type' : 'Scheduled Type'}
                  </span>
                  
                    )}
                  </div>
                </div>

                {/* Name & Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FileText className={`w-5 h-5 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'
                        }`} />
                      <label className={LabelCommon}>Contest Name <span className="text-red-500">*</span></label>
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={handleNameChange}
                      placeholder="Enter contest name"
                      className={inputCommon}
                    />
               
                    {error.name && (
                      <p className="text-red-500 text-sm mt-2 font-medium">{error.name}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FileText className={`w-5 h-5 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'
                        }`} />
                      <label className={LabelCommon}>Description <span className="text-red-500">*</span></label>
                    </div>
                    <textarea
                      value={description}
                      onChange={handleDescriptionChange}
                      placeholder="Enter description"
                      rows="4"
                      className={inputCommon}
                    />
                    
                    {error.description && (
                      <p className="text-red-500 text-sm mt-2 font-medium">{error.description}</p>
                    )}
                  </div>
                </div>

                {/* Batch Selection */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Users className={`w-5 h-5 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}`} />
                    <label className={LabelCommon}>Choose Batches <span className="text-red-500">*</span></label>
                  </div>

                  <div className="max-w-md space-y-3">
                    <Select
                      isMulti
                      options={batchOptions}
                      value={batchOptions.filter(opt => selectedBatches.includes(opt.value))}
                      onChange={handleBatchChange}
                      placeholder="Select batches"
                      styles={{
                        control: (provided, state) => ({
                          ...provided,
                          backgroundColor: theme === 'light' ? 'white' : '#1f2937',
                          borderColor: theme === 'light' ? '#e5e7eb' : '#4b5563',
                          borderWidth: '2px',
                          borderRadius: '1rem',
                          padding: '0.5rem',
                          fontSize: '1.125rem',
                          minHeight: '3rem',
                          boxShadow: state.isFocused
                            ? theme === 'light'
                              ? '0 0 0 3px rgba(199, 210, 254, 0.5)'
                              : '0 0 0 3px rgba(99, 102, 241, 0.5)'
                            : 'none',
                          borderColor: state.isFocused
                            ? theme === 'light' ? '#818cf8' : '#a5b4fc'
                            : theme === 'light' ? '#e5e7eb' : '#4b5563',
                          '&:hover': {
                            borderColor: theme === 'light' ? '#d1d5db' : '#6b7280'
                          }
                        }),
                        menu: (provided) => ({
                          ...provided,
                          backgroundColor: theme === 'light' ? 'white' : '#1f2937',
                          border: theme === 'light' ? '1px solid #e5e7eb' : '1px solid #4b5563',
                          borderRadius: '0.5rem',
                          zIndex: 20
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isSelected
                            ? theme === 'light' ? '#818cf8' : '#6366f1'
                            : state.isFocused
                              ? theme === 'light' ? '#f3f4f6' : '#374151'
                              : theme === 'light' ? 'white' : '#1f2937',
                          color: state.isSelected
                            ? 'white'
                            : theme === 'light' ? '#1f2937' : '#f9fafb',
                          '&:hover': {
                            backgroundColor: state.isSelected
                              ? theme === 'light' ? '#818cf8' : '#6366f1'
                              : theme === 'light' ? '#f3f4f6' : '#374151'
                          }
                        }),
                        multiValue: (provided) => ({
                          ...provided,
                          backgroundColor: theme === 'light' ? '#f3f4f6' : '#374151',
                          borderRadius: '0.375rem'
                        }),
                        multiValueLabel: (provided) => ({
                          ...provided,
                          color: theme === 'light' ? '#1f2937' : '#f9fafb'
                        }),
                        multiValueRemove: (provided) => ({
                          ...provided,
                          color: theme === 'light' ? '#6b7280' : '#9ca3af',
                          '&:hover': {
                            backgroundColor: theme === 'light' ? '#ef4444' : '#dc2626',
                            color: 'white'
                          }
                        }),
                        placeholder: (provided) => ({
                          ...provided,
                          color: theme === 'light' ? '#9ca3af' : '#6b7280'
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          color: theme === 'light' ? '#1f2937' : '#f9fafb'
                        }),
                        input: (provided) => ({
                          ...provided,
                          color: theme === 'light' ? '#1f2937' : '#f9fafb'
                        }),
                        indicatorSeparator: (provided) => ({
                          ...provided,
                          backgroundColor: theme === 'light' ? '#e5e7eb' : '#4b5563'
                        }),
                        dropdownIndicator: (provided) => ({
                          ...provided,
                          color: theme === 'light' ? '#6b7280' : '#9ca3af'
                        }),
                        clearIndicator: (provided) => ({
                          ...provided,
                          color: theme === 'light' ? '#6b7280' : '#9ca3af'
                        })
                      }}
                    />
                    
                    {error.selectedBatches && (
                      <p className="text-red-500 text-sm mt-2 font-medium">{error.selectedBatches}</p>
                    )}

                    {selectedBatches.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedBatches.map(batchId => {
                          const batch = batchOptions.find(opt => opt.value === batchId);
                          return batch ? (
                            <span
                              key={batchId}
                              className={`inline-block px-4 py-1.5 text-sm border rounded-full ${theme === 'light'
                                  ? 'bg-gray-100 text-gray-800 border-gray-200'
                                  : 'bg-gray-700 text-gray-300 border-gray-600'
                                }`}
                            >
                              {batch.label}
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Date Selection */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {ContestType === 'participation_based' ? (
                      <Calendar className={`w-5 h-5 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'
                        }`} />
                    ) : (
                      <Clock className={`w-5 h-5 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'
                        }`} />
                    )}
                    <label className={LabelCommon}>
                      {ContestType === 'participation_based' ? 'Contest Duration' : 'Schedule Contest'} <span className="text-red-500">*</span>
                    </label>
                  </div>

                  {ContestType === 'participation_based' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className={`block text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                          }`}>Start Date</label>
                        <input
                          type="date"
                          value={validity.start}
                          onChange={(e) => handleValidityChange('start', e.target.value)}
                          className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:outline-none ${theme === 'light'
                            ? 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                            : 'bg-gray-800 border-gray-600 text-indigo-100 focus:ring-indigo-500 focus:border-indigo-300'
                            }`}
                        />
                        {/* NEW: Error display */}
                        {error['validity.start'] && (
                          <p className="text-red-500 text-sm mt-1 font-medium">{error['validity.start']}</p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <label className={`block text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                          }`}>End Date</label>
                        <input
                          type="date"
                          value={validity.end}
                          onChange={(e) => handleValidityChange('end', e.target.value)}
                          className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:outline-none ${theme === 'light'
                            ? 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                            : 'bg-gray-800 border-gray-600 text-indigo-100 focus:ring-indigo-500 focus:border-indigo-300'
                            }`}
                        />
                 
                        {error['validity.end'] && (
                          <p className="text-red-500 text-sm mt-1 font-medium">{error['validity.end']}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-md space-y-1">
                      <label className={`block text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                        }`}>Event Date & Time</label>
                      <input
                        type="datetime-local"
                        value={schedule}
                        onChange={handleScheduleChange}
                        className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:outline-none ${theme === 'light'
                          ? 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                          : 'bg-gray-800 border-gray-600 text-indigo-100 focus:ring-indigo-500 focus:border-indigo-300'
                          }`}
                      />
               
                      {error.schedule && (
                        <p className="text-red-500 text-sm mt-1 font-medium">{error.schedule}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Duration */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock className={`w-5 h-5 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'
                      }`} />
                    <label className={LabelCommon}>Event Duration (minutes) <span className="text-red-500">*</span></label>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="1440"
                    value={duration}
                    onChange={handleDurationChange}
                    placeholder="Enter duration (1-1440 minutes)"
                    className={`w-full max-w-md border rounded-lg px-4 py-3 focus:ring-2 focus:outline-none ${theme === 'light'
                      ? 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400'
                      : 'bg-gray-800 border-gray-600 text-indigo-100 focus:ring-indigo-500 focus:border-indigo-300 placeholder-indigo-300'
                      }`}
                  />
            
                  {error.duration && (
                    <p className="text-red-500 text-sm mt-2 font-medium">{error.duration}</p>
                  )}
                </div>

          
                {error.form && (
                  <div className="mt-6">
                    <p className="text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl text-center font-medium">
                      {error.form}
                    </p>
                  </div>
                )}

                {/* Submit */}
                <div className="flex justify-center pt-8">
                  <button
                    onClick={handleSubmit}
                    disabled={canAccessPage === false}
                    className={`group relative inline-flex items-center justify-center px-12 py-5 text-lg font-bold rounded-2xl shadow-xl transition-all duration-300 focus:ring-4 overflow-hidden
                  ${canAccessPage === false
                        ? (theme === 'light'
                          ? 'bg-gray-300 cursor-not-allowed text-red-600'
                          : 'bg-gray-700 cursor-not-allowed text-red-400')
                        : (theme === 'light'
                          ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 hover:shadow-2xl active:scale-95 focus:ring-indigo-200'
                          : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white hover:from-indigo-600 hover:via-purple-600 hover:to-indigo-700 hover:shadow-2xl active:scale-95 focus:ring-indigo-400')}
                `}
                  >
                    {canAccessPage !== false && (
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${theme === 'light'
                        ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600'
                        : 'bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400'
                        }`}></div>
                    )}
                    <span className="relative flex items-center gap-3">
                      {canAccessPage !== false && <CheckCircle className="w-6 h-6 group-hover:animate-pulse" />}
                      <span>{canAccessPage === false ? 'Access Denied' : 'Create Contest'}</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContest;