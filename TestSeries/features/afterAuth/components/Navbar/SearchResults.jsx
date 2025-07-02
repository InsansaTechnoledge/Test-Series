import React from 'react'

const SearchResults = ({ 
  isMobile = false, 
  setShowSearchResults, 
  searchResults, 
  themeClasses, 
  showSearchResults, 
  searchResultsRef, 
  selectedResultIndex, 
  theme,
  handleResultClick // Add this missing prop
}) => {
  if (!showSearchResults || searchResults.length === 0) return null;

  return (
    <div 
      ref={searchResultsRef}
      className={`absolute rounded-lg shadow-xl z-[9999] ${themeClasses.searchResults} ${
        isMobile 
          ? 'top-full left-0 right-0 mt-2' 
          : 'top-full left-0 right-0 mt-1 max-w-2xl mx-auto'
      }`}
    >
      <div className="py-2 max-h-80 overflow-y-auto">
        {searchResults.map((result, index) => (
          <button
            key={`${result.type}-${result.name}-${index}`}
            onClick={() => handleResultClick(result)}
            className={`w-full px-4 py-3 text-left transition-colors ${themeClasses.searchResultItem} ${
              selectedResultIndex === index ? 'bg-indigo-50 border-l-2 border-indigo-500' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 flex items-center justify-center">
                <img 
                  src={result.icon} 
                  alt={result.name} 
                  className="w-5 h-5"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className={`font-medium truncate ${themeClasses.textPrimary}`}>
                    {result.name}
                  </span>
                  {result.type === 'feature' && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      theme === 'dark' 
                        ? 'bg-gray-700 text-gray-300' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {result.category}
                    </span>
                  )}
                </div>
                {result.type === 'category' && (
                  <p className={`text-sm mt-1 ${themeClasses.textSecondary}`}>
                    {result.features.length} features available
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchResults