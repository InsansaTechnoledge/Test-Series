import React, { useState } from 'react';
import HeadingUtil from '../../utility/HeadingUtil';
import NeedHelpComponent from './components/NeedHelpComponent';
import { useCachedBatches } from '../../../../hooks/useCachedBatches';
import { Calendar, Users, Trophy, FileText, Clock, Play , CheckCircle } from 'lucide-react';
import Select from 'react-select';
import { useUser } from '../../../../contexts/currentUserContext';
import { createContest } from '../../../../utils/services/contestService';
import { useNavigate } from 'react-router-dom';
import { usePageAccess } from '../../../../contexts/PageAccessContext';
import Banner from "../../../../assests/Institute/create contest.svg"

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
  const navigate=useNavigate();

  const canAccessPage = usePageAccess();
  

  const { batches } = useCachedBatches();
  const user = useUser();

  const batchOptions = batches.map(b => ({
    value: b.id,
    label: b.name,
  }));

  const handleSubmit = async() => {
    const formData={
      type: ContestType,
      name,
      selectedBatches,
      description,
      duration,
      schedule,
      validity,
    }
    console.log('Form submitted:', formData);

    try{
      const response=await createContest(formData);
      if(response.status === 200){
        console.log('Contest created successfully:', response.data);
        navigate('/institute/code-create/?contestId=' + response.data.id);
      }
    } catch (error) {
      console.error('Error creating contest:', error);
      alert('Failed to create contest. Please try again.');
    }


    
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto px-6 py-8">
      <div className="relative overflow-hidden rounded-xl h-80 mt-3">
        {/* // Background Image */}
        <img
          src={Banner}
          alt="Upload Banner"
          className="absolute  w-full h-full object-cover"
        />
        <div className="absolute "></div>

        <div className="relative z-10 flex items-center justify-center h-full px-6 text-center w-full">
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
            Design a contest
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
            contest can be an event or tech fest 😊
            </p>
          </div>
        </div>
      </div>
      
 <div className=' mx-auto  -mt-10 relative z-20 w-[90%]'>
        
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Create New Contest
          </h1>
          <p className="text-gray-600 text-lg">Design your perfect contest experience</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-indigo-100 p-10 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full -translate-y-32 translate-x-32 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full translate-y-24 -translate-x-24 opacity-50"></div>
          
          <div className="relative space-y-10">
            {/* Contest Type */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <label className="text-xl font-bold text-gray-800 block">
                    Contest Type
                  </label>
                  <p className="text-gray-500 mt-1">Choose between registered or scheduled contest</p>
                  {ContestType && (
                    <span className="inline-flex items-center mt-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 text-sm rounded-full border border-emerald-200 font-medium">
                      {ContestType === 'participation_based' ? '📝 Registered Type' : '⏰ Scheduled Type'}
                    </span>
                  )}
                </div>
              </div>
              <select
                value={ContestType}
                onChange={(e) => setContestType(e.target.value)}
                className="w-full max-w-md ml-16 border border-indigo-200 rounded-xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white/80 backdrop-blur-sm text-gray-700 font-medium transition-all duration-200 hover:border-indigo-300"
              >
                <option value="participation_based">📝 Registered Type</option>
                <option value="scheduled">⏰ Scheduled Type</option>
              </select>
            </div>

            {/* Name & Description */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <label className="text-xl font-bold text-gray-800">Contest Name</label>
                    <p className="text-gray-500 mt-1">Give your contest a catchy name</p>
                  </div>
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter contest name"
                  className="w-full border border-indigo-200 rounded-xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-indigo-300 placeholder-gray-400"
                />
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <label className="text-xl font-bold text-gray-800">Description</label>
                    <p className="text-gray-500 mt-1">Describe what your contest is about</p>
                  </div>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                  rows="4"
                  className="w-full border border-indigo-200 rounded-xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-indigo-300 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Batch Selection */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <label className="text-xl font-bold text-gray-800">Choose Batches</label>
                  <p className="text-gray-500 mt-1">Select one or multiple batches for participation</p>
                </div>
              </div>
              <div className="ml-16 space-y-4">
                <Select
                  isMulti
                  options={batchOptions}
                  value={batchOptions.filter(opt => selectedBatches.includes(opt.value))}
                  onChange={(selected) => setSelectedBatches(selected.map(opt => opt.value))}
                  placeholder="Select batches"
                  className="max-w-md"
                />
                {selectedBatches.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {selectedBatches.map(batchId => {
                      const batch = batchOptions.find(opt => opt.value === batchId);
                      return batch ? (
                        <span key={batchId} className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-sm rounded-full border border-indigo-200 font-medium">
                          👥 {batch.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Date Selection */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
                  {ContestType === 'participation_based' ? (
                    <Calendar className="w-6 h-6 text-white" />
                  ) : (
                    <Clock className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <label className="text-xl font-bold text-gray-800">
                    {ContestType === 'participation_based'
                      ? 'Contest Duration'
                      : 'Schedule Contest'}
                  </label>
                  <p className="text-gray-500 mt-1">
                    {ContestType === 'participation_based'
                      ? 'Set start and end dates for registration period'
                      : 'Choose when your contest should begin'}
                  </p>
                </div>
              </div>

              {ContestType === 'participation_based' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-16">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">Start Date</label>
                    <input
                      type="date"
                      value={validity.start}
                      onChange={(e) => setValidity({ ...validity, start: e.target.value })}
                      className="w-full border border-indigo-200 rounded-xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-indigo-300"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">End Date</label>
                    <input
                      type="date"
                      value={validity.end}
                      onChange={(e) => setValidity({ ...validity, end: e.target.value })}
                      className="w-full border border-indigo-200 rounded-xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-indigo-300"
                    />
                  </div>
                </div>
              ) : (
                <div className="ml-16 max-w-md space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">Event Date & Time</label>
                  <input
                    type="datetime-local"
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    className="w-full border border-indigo-200 rounded-xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-indigo-300"
                  />
                </div>
              )}
            </div>

            {/* Duration Field */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <label className="text-xl font-bold text-gray-800">Event Duration</label>
                  <p className="text-gray-500 mt-1">Auto-submit and end after specified time (in minutes)</p>
                </div>
              </div>
              <input
                type="number"
                min="1"
                placeholder="Enter duration in minutes"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="ml-16 w-full max-w-md border border-indigo-200 rounded-xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-indigo-300 placeholder-gray-400"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-8">
              <button
                onClick={handleSubmit}
                disabled={canAccessPage === false}
                className={`group relative inline-flex items-center justify-center px-12 py-5 text-lg font-bold rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 focus:ring-4 focus:ring-indigo-200 outline-none overflow-hidden
                  ${canAccessPage === false
                    ? 'bg-gray-300 cursor-not-allowed text-red-600'
                    : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 hover:shadow-2xl active:scale-95'}
                `}
              >
                {/* Animated background */}
                {canAccessPage !== false && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
                
                <span className="relative flex items-center space-x-3">
                  {canAccessPage !== false && <CheckCircle className="w-6 h-6 group-hover:animate-pulse" />}
                  <span>{canAccessPage === false ? '🚫 Access Denied' : '🚀 Create Contest'}</span>
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
