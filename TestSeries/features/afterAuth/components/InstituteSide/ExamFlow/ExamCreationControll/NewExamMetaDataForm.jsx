import React from 'react'
import { Settings } from 'lucide-react';
import ExamControllSettings from '../ExamControll/ExamControllSettings'

const NewExamMetaDataForm = ({handleSubmit , theme , form , handleChange , batches , isExamControllOpen , setIsExamControllOpen , canAccessPage , canCreateMoreExams}) => {
  return (
    <div>
       <div className="borderoverflow-hidden mb-8  rounded-3xl p-6 transform hover:scale-105 transition-all duration-300 ">
        
        <div className="bg-gradient-to-r from-[#4c51bf] to-indigo-600 px-8 py-8 rounded-t-2xl  shadow-xl  ">
        <h1 className="text-2xl font-extrabold text-white flex items-center space-x-3">
            <span>Create New Exam</span>
        </h1>
        </div>
        <form onSubmit={handleSubmit} className={`p-8 space-y-8 rounded-b-3xl shadow-2xl ${
        theme === 'light' 
            ? 'backdrop-blur-md bg-white/30 border border-white/40' 
            : 'bg-gray-800 border border-gray-700'
        }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Exam Name */}
            <div className="md:col-span-2">

            <label className={`font-bold mb-3 flex items-center space-x-2 text-sm ${
                theme === 'light' ? 'text-gray-800' : 'text-gray-100'
            }`}>
                <span>Choose a name for your exam</span>
            </label>
            <input
                name="name"
                placeholder="Enter exam name..."
                className={`p-4 rounded-2xl transition-all duration-300 text-lg w-full pr-14 ${
                theme === 'light'
                    ? 'bg-white text-gray-900 border-2 border-gray-200 focus:ring-indigo-200 focus:border-indigo-400 placeholder-gray-400'
                    : 'bg-gray-800 text-indigo-100 border-2 border-gray-600 focus:ring-indigo-500 focus:border-indigo-300 placeholder-indigo-300'
                }`}
                value={form.name}
                onChange={handleChange}
                required
            />
            </div>

            {/* Date */}
            <div>
            <label className={`font-bold mb-3 flex items-center space-x-2 text-sm ${
                theme === 'light' ? 'text-gray-800' : 'text-gray-100'
            }`}>

                <span>Schedule your exam</span>
            </label>
            <input
                type="datetime-local"
                name="date"
                className={`p-4 rounded-2xl transition-all duration-300 text-lg w-full  ${
                theme === 'light'
                    ? 'bg-white text-gray-900 border-2 border-gray-200 focus:ring-indigo-200 focus:border-indigo-400 placeholder-gray-400'
                    : 'bg-gray-800 text-indigo-100 border-2 border-gray-600 focus:ring-indigo-500 focus:border-indigo-300 placeholder-indigo-300'
                }`}
                value={form.date}
                onChange={handleChange}
                required
            />
            </div>

            {/* Total Marks */}
            <div>
            <label className={`font-bold mb-3 flex items-center space-x-2 text-sm ${
                theme === 'light' ? 'text-gray-800' : 'text-gray-100'
            }`}>

                <span>Total Marks</span>
            </label>
            <input
                name="total_marks"
                type="number"
                placeholder="Enter total marks..."
                className={`p-4 rounded-2xl transition-all duration-300 text-lg w-full  ${
                theme === 'light'
                    ? 'bg-white text-gray-900 border-2 border-gray-200 focus:ring-indigo-200 focus:border-indigo-400 placeholder-gray-400'
                    : 'bg-gray-800 text-indigo-100 border-2 border-gray-600 focus:ring-indigo-500 focus:border-indigo-300 placeholder-indigo-300'
                }`}
                value={form.total_marks}
                onChange={handleChange}
            />
            </div>

            {/* Duration */}
            <div>
            <label className={`font-bold mb-3 flex items-center space-x-2 text-sm ${
                theme === 'light' ? 'text-gray-800' : 'text-gray-100'
            }`}>

                <span>Duration (minutes)</span>
            </label>
            <input
                name="duration"
                type="number"
                placeholder="Enter duration in minutes..."
                className={`p-4 rounded-2xl transition-all duration-300 text-lg w-full pr-14 ${
                theme === 'light'
                    ? 'bg-white text-gray-900 border-2 border-gray-200 focus:ring-indigo-200 focus:border-indigo-400 placeholder-gray-400'
                    : 'bg-gray-800 text-indigo-100 border-2 border-gray-600 focus:ring-indigo-500 focus:border-indigo-300 placeholder-indigo-300'
                }`}
                value={form.duration}
                onChange={handleChange}
            />
            </div>

            {/* Batch Selection */}
            <div>
            <label className={`font-bold mb-3 flex items-center space-x-2 text-sm ${
                theme === 'light' ? 'text-gray-800' : 'text-gray-100'
            }`}>

                <span>Select Batch</span>
            </label>
            <select
                name="batch_id"
                className={`p-4 rounded-2xl transition-all duration-300 text-lg w-full pr-14 ${
                theme === 'light'
                    ? 'bg-white text-gray-900 border-2 border-gray-200 focus:ring-indigo-200 focus:border-indigo-400 placeholder-gray-400'
                    : 'bg-gray-800 text-indigo-100 border-2 border-gray-600 focus:ring-indigo-500 focus:border-indigo-300 placeholder-indigo-300'
                }`}
                value={form.batch_id}
                onChange={handleChange}
                required
            >
                <option value="">-- Select Batch --</option>
                {Array.isArray(batches) && batches.map((batch, index) => (
                <option key={batch?.id || index} value={batch?.id || ''}>
                    {batch?.name || 'Unnamed Batch'} - {batch?.year || 'No Year'}
                </option>
                ))}
            </select>
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
            {!isExamControllOpen ? 'Exam Controller' : 'Close Exam Controller'}
            </button>
            {
            isExamControllOpen && (
                <ExamControllSettings handleChange={handleChange} form={form} theme={theme}/>
            )
            }
        </div>
        

        {/* Submit Button */}
        <button
            type="submit"
            disabled={canAccessPage === false || canCreateMoreExams === false}
            className={`group text-white px-12 py-4 rounded-3xl flex items-center gap-3 font-bold text-lg transition-all duration-300 transform
        ${canAccessPage === false || canCreateMoreExams === false
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-105 hover:shadow-2xl'}
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
        </form>
        </div>
    </div>
  )
}

export default NewExamMetaDataForm
