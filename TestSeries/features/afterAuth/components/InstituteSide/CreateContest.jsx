import React, { useState } from 'react';
import HeadingUtil from '../../utility/HeadingUtil';
import NeedHelpComponent from './components/NeedHelpComponent';
import { useCachedBatches } from '../../../../hooks/useCachedBatches';
import { Calendar, Users, Trophy, FileText, Clock, Play } from 'lucide-react';
import Select from 'react-select';
import { useUser } from '../../../../contexts/currentUserContext';

const CreateContest = () => {
  const [ContestType, setContestType] = useState('participation_based');
  const [name, setName] = useState('');
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [description, setDescription] = useState('');
  const [duration , setDuration] = useState('')

  const { batches } = useCachedBatches();
  const user = useUser();

//   console.log("sd",user)

  const organizationId = user.user?._id || user.user.organizationId

    // console.log('rsf', organizationId)

  const batchOptions = batches.map(b => ({
    value: b.id,
    label: b.name,
  }));

  const handleSubmit = () => {
    console.log('Form submitted:', {
      type:ContestType,
      name,
      selectedBatches,
      description,
      duration,
      organizationId
    });
    // TODO: handle form submission
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto px-6 py-8">

        <HeadingUtil
          heading="Design a contest"
          description="contest can be an event or tech fest 😊"
        />

        <NeedHelpComponent
          heading="What does a contest do?"
          about="contest lets you conduct any coding event or fest"
          question="would it display ranking?"
          answer="yes, after the contest ranking/leaderboard would be declared disclosing the winners. Also, selected batch can be added in a contest, and students of respective batches can participate"
        />

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="space-y-8">
            {/* Contest Type */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Play className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <label className="text-lg font-semibold text-gray-800">
                    Select the type of contest you want to create
                  </label>
                  {ContestType && (
                    <span className="ml-3 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full border border-green-200">
                      {ContestType === 'participation_based' ? 'Registered Type' : 'Scheduled Type'}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-red-500 ml-13">it can be registered or scheduled</p>
              <select
                value={ContestType}
                onChange={(e) => setContestType(e.target.value)}
                className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                <option value="participation_based">Registered Type</option>
                <option value="scheduled">Scheduled Type</option>
              </select>
            </div>

            {/* Name & Description */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <label className="text-lg font-semibold text-gray-800">Contest Name</label>
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter contest name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-orange-600" />
                  </div>
                  <label className="text-lg font-semibold text-gray-800">Describe your event</label>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
              </div>
            </div>

            {/* Batch Selection */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <label className="text-lg font-semibold text-gray-800">Choose batches</label>
              </div>
              <p className="text-sm text-red-500 ml-13">select one or multiple batches</p>
              <Select
                isMulti
                options={batchOptions}
                className="ml-13"
                value={batchOptions.filter(opt => selectedBatches.includes(opt.value))}
                onChange={(selected) => setSelectedBatches(selected.map(opt => opt.value))}
                placeholder="Select batches"
              />
              {selectedBatches.length > 0 && (
                <div className="ml-13 flex flex-wrap gap-2">
                  {selectedBatches.map(batchId => {
                    const batch = batchOptions.find(opt => opt.value === batchId);
                    return batch ? (
                      <span key={batchId} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full border border-blue-200">
                        {batch.label}
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </div>

            {/* Date Selection */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  {ContestType === 'participation_based' ? (
                    <Calendar className="w-5 h-5 text-red-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <label className="text-lg font-semibold text-gray-800">
                  {ContestType === 'participation_based'
                    ? 'Choose start and end date of event'
                    : 'Choose date and time to start event'}
                </label>
              </div>

              {ContestType === 'participation_based' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-13">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="ml-13 max-w-md">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Date & Time</label>
                  <input
                    type="datetime-local"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              )}
            </div>

            {/* Duration Field */}
            <div className="space-y-4">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <label className="text-lg font-semibold text-gray-800">Duration of Event (in minutes)</label>
            </div>
            <p className="text-sm text-red-500 ml-13">Events auto submits and end after below specified time</p>
            <input
                type="number"
                min="1"
                placeholder="Enter duration in minutes"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className=" ml-13 w-1/2 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white font-semibold py-4 px-12 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 focus:ring-4 focus:ring-blue-200 outline-none"
              >
                Create Contest
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContest;
