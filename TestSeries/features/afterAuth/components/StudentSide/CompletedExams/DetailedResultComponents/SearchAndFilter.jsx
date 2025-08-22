import React from 'react';

export const SearchAndFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  filterType, 
  setFilterType, 
  filterResult, 
  setFilterResult, 
  viewMode, 
  setViewMode, 
  theme 
}) => (
  <div className={`${theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} rounded-2xl border p-6 mb-8 shadow-sm`}>
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      {/* Search Input */}
      <div className="flex-1 min-w-0">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className={`h-5 w-5 ${theme === "dark" ? "text-gray-400" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search questions, subjects, or chapters..."
            className={`block w-full pl-10 pr-3 py-3 border ${theme === "dark" ? "border-gray-700 bg-gray-800 text-white placeholder-gray-400" : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <FilterSelect
          label="Type:"
          value={filterType}
          onChange={setFilterType}
          options={[
            { value: "all", label: "All Types" },
            { value: "mcq", label: "Multiple Choice" },
            { value: "msq", label: "Multiple Select" },
            { value: "fill", label: "Fill in the Blank" },
            { value: "tf", label: "True/False" },
            { value: "numerical", label: "Numerical" },
            { value: "code", label: "Coding" },
            { value: "match", label: "Match the Following" },
            { value: "comprehension", label: "Comprehension" },
            { value: "descriptive", label: "Descriptive" }
          ]}
          theme={theme}
        />
        
        <FilterSelect
          label="Result:"
          value={filterResult}
          onChange={setFilterResult}
          options={[
            { value: "all", label: "All Results" },
            { value: "correct", label: "Correct" },
            { value: "incorrect", label: "Incorrect" },
            { value: "unanswered", label: "Unanswered" },
            { value: "descriptive", label: "Descriptive" }
          ]}
          theme={theme}
        />
        
        <FilterSelect
          label="View:"
          value={viewMode}
          onChange={setViewMode}
          options={[
            { value: "detailed", label: "Detailed" },
            { value: "compact", label: "Compact" }
          ]}
          theme={theme}
        />
      </div>
    </div>
  </div>
);

const FilterSelect = ({ label, value, onChange, options, theme }) => (
  <div className="flex items-center gap-2">
    <label className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
      {label}
    </label>
    <select
      className={`px-3 py-2 border ${theme === "dark" ? "border-gray-700 bg-gray-800 text-white" : "border-gray-300 bg-white text-gray-900"} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);