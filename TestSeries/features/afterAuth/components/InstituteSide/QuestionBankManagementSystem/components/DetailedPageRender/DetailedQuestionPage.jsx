import React, { useState } from 'react';
import { renderQuestions } from './QuestionRenderFunction';
import Sidebar from './components/Sidebar';
import { ArrowLeft, Filter, Plus, Search, ChevronDown, Grid, List, SortAsc, Trash2Icon } from 'lucide-react';

const DetailedQuestionPage = ({ 
  setSelectedQuestionType, 
  selectedQuestionType, 
  filteredQuestionsByType, 
  categories 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Handle search logic here
  };

  return (
    <div className="h-screen bg-slate-50">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="h-full flex-shrink-0 shadow-sm">
          <Sidebar 
            categories={categories} 
            setSelectedQuestionType={setSelectedQuestionType} 
            selectedQuestionType={selectedQuestionType} 
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 h-full overflow-hidden flex flex-col">
          {/* Enhanced Header */}
          <div className="bg-white border-b border-slate-200 px-8 py-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">  
                <button 
                  // onClick={() => setSelectedQuestionType(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                >
                  {/* <ArrowLeft className="w-5 h-5 text-slate-600" /> */}
                  <Trash2Icon className="w-5 h-5 text-red-600"/>
                </button>
                <div className="h-8 w-px bg-slate-200"></div>       
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                    Questions Library
                  </h1>
                  <p className="text-slate-600 mt-1 text-sm">
                    Viewing <span className="font-semibold capitalize text-slate-800">{selectedQuestionType}</span> questions
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="flex bg-slate-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-white shadow-sm text-slate-800' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-white shadow-sm text-slate-800' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Results Count */}
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium text-sm border border-blue-100">
                  {filteredQuestionsByType.length} questions
                </div>
              </div>
            </div>

            {/* Enhanced Action Bar */}
            <div className="flex items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="bg-slate-50 border border-slate-200 flex items-center px-4 py-3 rounded-lg flex-1 max-w-md hover:border-slate-300 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200">
                <Search className="text-slate-400 mr-3 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  className="bg-transparent outline-none w-full text-sm text-slate-700 placeholder-slate-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="ml-2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Sort Button */}
                <button className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg hover:bg-slate-100 hover:border-slate-300 transition-all duration-200 text-sm font-medium text-slate-700">
                  <SortAsc className="w-4 h-4" />
                  <span>Sort</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Filter Button */}
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium border ${
                    showFilters 
                      ? 'bg-blue-50 border-blue-200 text-blue-700' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                  {showFilters && <div className="w-2 h-2 bg-blue-500 rounded-full ml-1"></div>}
                </button>

                {/* Add Questions Button */}
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md">
                  <Plus className="w-4 h-4" />
                  <span>Add Questions</span>
                </button>
              </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 animate-in slide-in-from-top duration-200">
                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium text-slate-700">Quick Filters:</div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-white border border-slate-200 rounded-md text-xs text-slate-600 hover:bg-slate-50 transition-colors duration-200">
                      Recent
                    </button>
                    <button className="px-3 py-1 bg-white border border-slate-200 rounded-md text-xs text-slate-600 hover:bg-slate-50 transition-colors duration-200">
                      Difficulty
                    </button>
                    <button className="px-3 py-1 bg-white border border-slate-200 rounded-md text-xs text-slate-600 hover:bg-slate-50 transition-colors duration-200">
                      Subject
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Content Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-8">
              {filteredQuestionsByType.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-800 mb-2">No questions found</h3>
                  <p className="text-slate-600 mb-6">Try adjusting your search or filters</p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium">
                    Create New Question
                  </button>
                </div>
              ) : (
                <div className={`transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                    : 'space-y-4'
                }`}>
                  {renderQuestions(filteredQuestionsByType, selectedQuestionType)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedQuestionPage;