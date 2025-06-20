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
            Design your perfect contest experience
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
          {/* <p className="text-gray-600 text-lg">Design your perfect contest experience</p> */}
        </div>

        {/* Main Form Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-indigo-100 p-10 relative overflow-hidden">
  

  <div className=" rounded-2xl   p-8 space-y-10">
  {/* Contest Type */}
  <div className="space-y-3">
    <div className="flex items-center gap-3">
      <Play className="w-5 h-5 text-indigo-600" />
      <label className="text-lg font-semibold text-gray-800">Contest Type</label>
    </div>
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <select
        value={ContestType}
        onChange={(e) => setContestType(e.target.value)}
        className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-700 transition"
      >
        <option value="participation_based">Registered Type</option>
        <option value="scheduled">Scheduled Type</option>
      </select>

      {ContestType && (
        <span className="inline-block px-4 py-2 text-sm text-indigo-700 bg-indigo-100 border border-indigo-200 rounded-full">
          {ContestType === 'participation_based' ? 'Registered Type' : 'Scheduled Type'}
        </span>
      )}
    </div>
  </div>

  {/* Name & Description */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <FileText className="w-5 h-5 text-indigo-600" />
        <label className="text-lg font-semibold text-gray-800">Contest Name</label>
      </div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter contest name"
        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none placeholder-gray-400"
      />
    </div>

    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <FileText className="w-5 h-5 text-indigo-600" />
        <label className="text-lg font-semibold text-gray-800">Description</label>
      </div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter description"
        rows="4"
        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none placeholder-gray-400"
      />
    </div>
  </div>

  {/* Batch Selection */}
  <div className="space-y-3">
    <div className="flex items-center gap-3">
      <Users className="w-5 h-5 text-indigo-600" />
      <label className="text-lg font-semibold text-gray-800">Choose Batches</label>
    </div>
    <div className="max-w-md space-y-3">
      <Select
        isMulti
        options={batchOptions}
        value={batchOptions.filter(opt => selectedBatches.includes(opt.value))}
        onChange={(selected) => setSelectedBatches(selected.map(opt => opt.value))}
        placeholder="Select batches"
      />
      {selectedBatches.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedBatches.map(batchId => {
            const batch = batchOptions.find(opt => opt.value === batchId);
            return batch ? (
              <span key={batchId} className="inline-block px-4 py-1.5 text-sm bg-gray-100 text-gray-800 border border-gray-200 rounded-full">
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
        <Calendar className="w-5 h-5 text-indigo-600" />
      ) : (
        <Clock className="w-5 h-5 text-indigo-600" />
      )}
      <label className="text-lg font-semibold text-gray-800">
        {ContestType === 'participation_based' ? 'Contest Duration' : 'Schedule Contest'}
      </label>
    </div>

    {ContestType === 'participation_based' ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="block text-sm text-gray-600">Start Date</label>
          <input
            type="date"
            value={validity.start}
            onChange={(e) => setValidity({ ...validity, start: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm text-gray-600">End Date</label>
          <input
            type="date"
            value={validity.end}
            onChange={(e) => setValidity({ ...validity, end: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>
      </div>
    ) : (
      <div className="max-w-md space-y-1">
        <label className="block text-sm text-gray-600">Event Date & Time</label>
        <input
          type="datetime-local"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
      </div>
    )}
  </div>

  {/* Duration */}
  <div className="space-y-3">
    <div className="flex items-center gap-3">
      <Clock className="w-5 h-5 text-indigo-600" />
      <label className="text-lg font-semibold text-gray-800">Event Duration (minutes)</label>
    </div>
    <input
      type="number"
      min="1"
      value={duration}
      onChange={(e) => setDuration(e.target.value)}
      placeholder="Enter duration"
      className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none placeholder-gray-400"
    />
  </div>

    {/* Submit */}
    <div className="flex justify-center pt-8">
      <button
        onClick={handleSubmit}
        disabled={canAccessPage === false}
        className={`group relative inline-flex items-center justify-center px-12 py-5 text-lg font-bold rounded-2xl shadow-xl transition-all duration-300 focus:ring-4 focus:ring-indigo-200 overflow-hidden
          ${canAccessPage === false
            ? 'bg-gray-300 cursor-not-allowed text-red-600'
            : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 hover:shadow-2xl active:scale-95'}
        `}
      >
        {canAccessPage !== false && (
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
