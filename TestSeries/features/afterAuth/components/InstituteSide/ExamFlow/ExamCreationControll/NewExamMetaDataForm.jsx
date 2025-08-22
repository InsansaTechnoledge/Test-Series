import React, { useEffect, useMemo, useState } from 'react'
import { Settings } from 'lucide-react';
import ExamControllSettings from '../ExamControll/ExamControllSettings'
import { useUser } from '../../../../../../contexts/currentUserContext';

const NewExamMetaDataForm = ({handleSubmit , theme , form, setForm , handleChange , batches , isExamControllOpen , setIsExamControllOpen , canAccessPage , canCreateMoreExams}) => {
    console.log("check" , form)
    const {user} = useUser();
    
    const [selectedExamType, setSelectedExamType] = useState('semi-subjective');
    const [autoSchedule, setAutoSchedule] = useState(true); 

    const visibleBatches = useMemo(() => {
        const list = Array.isArray(batches) ? batches : [];
        if (user?.role === "user") {
          const allowed = new Set(Array.isArray(user?.batch) ? user.batch : []);
          return list.filter(b => b?.id && allowed.has(b.id));
        }
        return list; // org. see it all
      }, [batches, user?.role, user?.batch]);

      useEffect(() => {
        if (user?.role === "user") {
          const allowed = new Set(Array.isArray(user?.batch) ? user.batch : []);
          if (form.batch_id && !allowed.has(form.batch_id)) {
            setForm(prev => ({ ...prev, batch_id: "", subjects: [] }));
          }
        }
      }, [user?.role, user?.batch, form.batch_id, setForm]);
      
    
    const examTypes = [
        { 
            id: 'semi-subjective', 
            label: 'Hybrid (Objective + Subjective)', 
            hint: 'Mix of auto-graded and manual', 
            value: 'semi_subjective',
            is_subjective: true 
        },
        { 
            id: 'objective', 
            label: 'Objective Only', 
            hint: 'MCQ/MSQ/TF/Numerical', 
            value: 'objective',
            is_subjective: false 
        },
        { 
            id: 'subjective', 
            label: 'Subjective Only', 
            hint: 'Essay/Comprehension/Fill', 
            value: 'subjective',
            is_subjective: true 
        }
    ];

    // Function to handle separate date and time changes
    const handleDateTimeChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'date' || name === 'exam_time') {
            // Get current date and time values
            const currentDate = name === 'date' ? value : (form.date || '');
            const currentTime = name === 'exam_time' ? value : (form.exam_time || '');
            
            // Update the form with the individual field
            setForm(prev => ({
                ...prev,
                [name]: value
            }));
        } else {
            handleChange(e);
        }
    };

    // Handle auto-schedule toggle
    const handleAutoScheduleToggle = () => {
        const newAutoSchedule = !autoSchedule;
        setAutoSchedule(newAutoSchedule);
        
        // If auto-schedule is disabled, set exam_time to null
        if (!newAutoSchedule) {
            setForm(prev => ({
                ...prev,
                exam_time: null
            }));
        }
    };

    // Initialize separate time from existing datetime value
    useEffect(() => {
        if (form.date && !form.exam_time && autoSchedule) {
            // If date field contains a full datetime, extract the time part
            if (form.date.includes('T')) {
                const timeStr = form.date.split('T')[1]?.slice(0, 5);
                if (timeStr) {
                    setForm(prev => ({
                        ...prev,
                        exam_time: timeStr
                    }));
                }
            }
        }
    }, [form.date, autoSchedule]);

    // Initialize autoSchedule based on existing exam_time value
    useEffect(() => {
        if (form.exam_time !== undefined) {
            setAutoSchedule(form.exam_time !== null);
        }
    }, []);

    // Sync selectedExamType with form.exam_type and ensure is_subjective is correct
    useEffect(() => {
        if (form.exam_type) {
            // Find the exam type that matches the form's exam_type
            const examType = examTypes.find(type => type.value === form.exam_type);
            if (examType) {
                // Update selectedExamType if it doesn't match
                if (examType.id !== selectedExamType) {
                    setSelectedExamType(examType.id);
                }
                
                // Ensure is_subjective is correct for the current exam_type
                if (form.is_subjective !== examType.is_subjective) {
                    setForm(prev => ({
                        ...prev,
                        is_subjective: examType.is_subjective
                    }));
                }
            }
        } else {
            // If no exam_type is set, set default values
            const defaultExamType = examTypes.find(type => type.id === selectedExamType);
            if (defaultExamType) {
                setForm(prev => ({
                    ...prev,
                    exam_type: defaultExamType.value,
                    is_subjective: defaultExamType.is_subjective
                }));
            }
        }
    }, [form.exam_type, selectedExamType]); // Dependencies: run when either changes

    const handleExamTypeChange = (examType) => {
        setSelectedExamType(examType.id);
        
        setForm((prev) => ({
            ...prev,
            exam_type: examType.value,
            is_subjective: examType.is_subjective, // Use predefined value
        }));
    };
      
    
  return (
    <div className=" mx-auto">
       
       <div className="overflow-hidden mb-8 rounded-3xl shadow-2xl mx-auto transform transition-all duration-500 ease-in-out">
        
        <div className="bg-gradient-to-r from-[#4c51bf] to-indigo-600 px-8 py-10 relative overflow-hidden">
          <h1 className="text-3xl font-black text-white relative z-10 tracking-tight">
            Create New Exam
          </h1>
          <p className="text-indigo-100 mt-2 text-lg font-medium relative z-10">Design and configure your examination</p>
        </div>
        
        <div className="space-y-2 mt-8 mb-8 max-w-7xl mx-auto">
            <label
                className={`block text-sm font-semibold ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                }`}
            >
                Choose exam type
            </label>

        <div
            role="tablist"
            aria-label="Exam type"
            className={`w-full rounded-xl border shadow-sm p-1 ${
            theme === 'light'
                ? 'bg-white border-gray-200'
                : 'bg-gray-800/70 border-gray-700'
            } flex`}
        >
            {examTypes.map((examType, idx) => {
            const selected = selectedExamType === examType.id;
            return (
                <button
                key={examType.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => handleExamTypeChange(examType)}
                className={[
                    'flex-1 relative px-4 py-2.5 text-sm font-semibold rounded-lg transition-all',
                    'outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
                    selected
                    ? theme === 'light'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'bg-indigo-500 text-white shadow'
                    : theme === 'light'
                    ? 'text-gray-600 hover:bg-gray-50'
                    : 'text-gray-300 hover:bg-gray-700/60',
                    idx === 0 ? 'ml-0' : 'ml-1',
                ].join(' ')}
                >
                {examType.label}
                {selected && (
                    <span
                    aria-hidden="true"
                    className="absolute inset-x-3 -bottom-1 h-[2px] rounded-full bg-white/70"
                    />
                )}
                </button>
            );
            })}
        </div>

        <p
            className={`text-xs ${
            theme === 'light' ? 'text-gray-500' : 'text-gray-400'
            }`}
        >
            Tip: You can change this later before adding questions (in pending state).
        </p>
        </div>


        <form onSubmit={handleSubmit} className={`p-8 space-y-8 relative ${
          theme === 'light' 
              ? 'backdrop-blur-md bg-white/30 border border-white/40' 
              : 'bg-gray-800 border border-gray-700'
        }`}>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Exam Name */}
            <div className="lg:col-span-2">
              <div className="group">
                <label className={`font-semibold mb-4 flex items-center space-x-3 text-base ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                }`}>
                  <span>Choose a name for your exam</span>
                </label>
                <div className="relative">
                  <input
                      name="name"
                      placeholder="Enter exam name..."
                      className={`p-5 rounded-2xl transition-all duration-300 text-lg w-full shadow-lg border-2 focus:ring-2 ${
                      theme === 'light'
                          ? 'bg-white text-gray-900 border-gray-200 focus:ring-indigo-200 focus:border-indigo-400 placeholder-gray-400'
                          : 'bg-gray-800 text-indigo-100 border-gray-600 focus:ring-indigo-500 focus:border-indigo-300 placeholder-indigo-300'
                      }`}
                      value={form.name}
                      onChange={handleChange}
                      required
                  />
                </div>
              </div>
            </div>

            {/* Date */}
            <div className="group">
              <label className={`font-semibold mb-4 flex items-center space-x-3 text-base ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-200'
              }`}>
                <span>Select exam date</span>
              </label>
              <input
                  type="date"
                  name="date"
                  className={`p-5 rounded-2xl transition-all duration-300 text-lg w-full shadow-lg border-2 focus:ring-2 ${
                  theme === 'light'
                      ? 'bg-white text-gray-900 border-gray-200 focus:ring-indigo-200 focus:border-indigo-400'
                      : 'bg-gray-800 text-indigo-100 border-gray-600 focus:ring-indigo-500 focus:border-indigo-300'
                  }`}
                  value={form.date ? (form.date.includes('T') ? form.date.split('T')[0] : form.date) : ''}
                  onChange={handleDateTimeChange}
                  required
              />
            </div>

            {/* Auto Schedule Toggle */}
            <div className="group">
              <label className={`font-semibold mb-4 flex items-center space-x-3 text-base ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-200'
              }`}>
                <span>Exam Scheduling</span>
              </label>
              <div className={`p-4 rounded-2xl border-2 ${
                theme === 'light'
                  ? 'bg-white border-gray-200'
                  : 'bg-gray-800 border-gray-600'
              }`}>
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={autoSchedule}
                      onChange={handleAutoScheduleToggle}
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                      autoSchedule 
                        ? 'bg-indigo-600' 
                        : theme === 'light' ? 'bg-gray-300' : 'bg-gray-600'
                    }`}>
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                        autoSchedule ? 'translate-x-6' : 'translate-x-0'
                      }`}></div>
                    </div>
                  </div>
                  <span className={`ml-3 text-sm font-medium ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                  }`}>
                    Auto-schedule exam to go live
                  </span>
                </label>
                <p className={`mt-2 text-xs ${
                  theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {autoSchedule 
                    ? 'Exam will automatically go live at the specified time'
                    : 'Exam will remain in draft mode and must be manually started'
                  }
                </p>
              </div>
            </div>

            {/* Time - Only show when auto-schedule is enabled */}
            {autoSchedule && (
              <div className="group lg:col-start-1">
                <label className={`font-semibold mb-4 flex items-center space-x-3 text-base ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                }`}>
                  <span>Select exam time <span className={`${theme === 'light' ? 'text-gray-500' : ''} text-sm`}>(exam will automatically go live at selected time)</span></span>
                </label>
                <input
                    type="time"
                    name="exam_time"
                    className={`p-5 rounded-2xl transition-all duration-300 text-lg w-full shadow-lg border-2 focus:ring-2 ${
                    theme === 'light'
                        ? 'bg-white text-gray-900 border-gray-200 focus:ring-indigo-200 focus:border-indigo-400'
                        : 'bg-gray-800 text-indigo-100 border-gray-600 focus:ring-indigo-500 focus:border-indigo-300'
                    }`}
                    value={form.exam_time || ''}
                    onChange={handleDateTimeChange}
                    required={autoSchedule}
                />
              </div>
            )}

            {/* Total Marks */}
            <div className="group">
              <label className={`font-semibold mb-4 flex items-center space-x-3 text-base ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-200'
              }`}>
                <span>Total Marks</span>
              </label>
              <input
                  name="total_marks"
                  type="number"
                  placeholder="Enter total marks..."
                  className={`p-5 rounded-2xl transition-all duration-300 text-lg w-full shadow-lg border-2 focus:ring-2 ${
                  theme === 'light'
                      ? 'bg-white text-gray-900 border-gray-200 focus:ring-indigo-200 focus:border-indigo-400 placeholder-gray-400'
                      : 'bg-gray-800 text-indigo-100 border-gray-600 focus:ring-indigo-500 focus:border-indigo-300 placeholder-indigo-300'
                  }`}
                  value={form.total_marks}
                  onChange={handleChange}
              />
            </div>

            {/* Duration */}
            <div className="group">
              <label className={`font-semibold mb-4 flex items-center space-x-3 text-base ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-200'
              }`}>
                <span>Duration (minutes)</span>
              </label>
              <input
                  name="duration"
                  type="number"
                  placeholder="Enter duration in minutes..."
                  className={`p-5 rounded-2xl transition-all duration-300 text-lg w-full shadow-lg border-2 focus:ring-2 ${
                  theme === 'light'
                      ? 'bg-white text-gray-900 border-gray-200 focus:ring-indigo-200 focus:border-indigo-400 placeholder-gray-400'
                      : 'bg-gray-800 text-indigo-100 border-gray-600 focus:ring-indigo-500 focus:border-indigo-300 placeholder-indigo-300'
                  }`}
                  value={form.duration}
                  onChange={handleChange}
              />
            </div>

            {/* Batch Selection */}
            <div className="group">
              <label className={`font-semibold mb-4 flex items-center space-x-3 text-base ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-200'
              }`}>
                <span>Select Batch</span>
              </label>
              {/* Batch Selection */}
                <select
                name="batch_id"
                className={`p-5 rounded-2xl transition-all duration-300 text-lg w-full shadow-lg border-2 focus:ring-2 ${
                    theme === 'light'
                    ? 'bg-white text-gray-900 border-gray-200 focus:ring-indigo-200 focus:border-indigo-400'
                    : 'bg-gray-800 text-indigo-100 border-gray-600 focus:ring-indigo-500 focus:border-indigo-300'
                }`}
                value={form.batch_id}
                onChange={handleChange}
                required
                >
                <option value="">-- Select Batch --</option>
                    {visibleBatches.map((batch) => (
                        <option key={batch.id} value={batch.id}>
                        {batch.name || 'Unnamed Batch'} - {batch.year || 'No Year'}
                        </option>
                    ))}
                </select>


            </div>

            {/* Select Subject */}
            <div className={`lg:col-span-2 rounded-xl border p-4 shadow-sm ${
              theme === "light" 
                ? "border-gray-200 bg-white" 
                : "border-gray-700 bg-gray-900"
            }`}>
              <label
                htmlFor="subjects"
                className={`mb-4 flex items-center gap-3 text-base font-semibold ${
                  theme === "light" ? "text-gray-700" : "text-gray-200"
                }`}
              >
                <span>Select subjects to include in exam</span>
              </label>

              <div className="relative">
                <select
                  multiple
                  name="subjects"
                  id="subjects"
                  className={`h-44 w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 ${
                    theme === "light"
                      ? "border-gray-300 bg-white text-gray-900"
                      : "border-gray-600 bg-gray-800 text-gray-100"
                  }`}
                  value={form.subjects}
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions).map((o) => o.value);
                    setForm((prev) => ({ ...prev, subjects: selectedOptions }));
                  }}
                >
                  <option disabled value="">
                    Select Subjects
                  </option>
                  {batches.find((batch) => batch.id === form.batch_id)?.subjects?.map((subject, idx) => (
                    <option key={idx} value={subject} className="py-2">
                      {subject}
                    </option>
                  ))}
                </select>
                <div
                  className={`mt-2 text-xs ${
                    theme === "light" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Hold <span className="font-semibold">Ctrl/Cmd</span> to select multiple
                </div>
              </div>

              {Array.isArray(form?.subjects) && form.subjects.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {form.subjects.map((subj, index) => (
                    <span
                      key={`${subj}-${index}`}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                        theme === "light"
                          ? "bg-indigo-50 text-indigo-700 ring-indigo-200"
                          : "bg-indigo-900/30 text-indigo-200 ring-indigo-800/60"
                      }`}
                    >
                      {subj}
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            subjects: (prev.subjects || []).filter((s) => s !== subj),
                          }))
                        }
                        className={`ml-1 rounded-full p-0.5 transition ${
                          theme === "light" ? "hover:bg-indigo-100" : "hover:bg-indigo-800/60"
                        }`}
                        aria-label={`Remove ${subj}`}
                        title="Remove"
                      >
                        <svg
                          className="h-3.5 w-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/*Exam controll section */}
          <div>
              <button
              type="button"
              className={`flex items-center mb-4 gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md border 
                  ${theme === 'light'
                  ? 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                  : 'bg-indigo-800 text-white border-indigo-600 hover:bg-indigo-700'}
              `}
              onClick={() => setIsExamControllOpen(prev => !prev)}
              >
              <Settings className="w-5 h-5" />
              {!isExamControllOpen ? 'Advance Examination Control' : 'Close Examination Control'}
              </button>
              {
              isExamControllOpen && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    <ExamControllSettings user={user} handleChange={handleChange} form={form} theme={theme} selectedExamType={selectedExamType}/>
                  </div>
              )
              }
          </div>
          

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
          <button
                type="submit"
                disabled={canAccessPage === false || canCreateMoreExams === false}
                className={`group text-white px-12 py-4 rounded-3xl flex items-center gap-3 font-bold text-lg transition-all duration-300 transform
            ${canAccessPage === false || canCreateMoreExams === false
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : (theme === 'light' ? 'bg-amber-600 hover:scale-105 hover:shadow-2xl' : 'bg-amber-500') }
            `}
            >
                <span className={`text-center ${canAccessPage === false || canCreateMoreExams === false ? "text-red-600" : ""}`}>
                {!canAccessPage
                    ? 'Access Denied'
                    : !canCreateMoreExams
                    ? 'Limit Exceeded'
                    : (form.id ? 'Update Exam' : 'Create Exam')
                }
                </span>
            </button>
          </div>
        </form>
        </div>
    </div>
  )
}

export default NewExamMetaDataForm