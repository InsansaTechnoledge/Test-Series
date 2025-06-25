export const getThemeClasses = (theme) => ({
    nav: theme === 'dark'
      ? 'bg-gray-950 shadow-sm border-b border-gray-700'
      : 'bg-white shadow-sm border-b border-gray-200',
  
    button: theme === 'dark'
      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
      : 'text-gray-700 hover:bg-gray-50',
  
    activeButton: theme === 'dark'
      ? 'bg-gray-700 text-white'
      : 'bg-indigo-50 text-indigo-700',
  
    dropdown: theme === 'dark'
      ? 'bg-gray-800 border-gray-700 shadow-lg'
      : 'bg-white border-gray-200 shadow-lg',
  
    dropdownItem: theme === 'dark'
      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
      : 'text-gray-700 hover:bg-gray-50',
  
    input: theme === 'dark'
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-indigo-500 focus:border-transparent',
  
    searchResults: theme === 'dark'
      ? 'bg-gray-800 border-gray-700'
      : 'bg-white border-gray-200',
  
    searchResultItem: theme === 'dark'
      ? 'hover:bg-gray-700 text-gray-300'
      : 'hover:bg-gray-50 text-gray-900',
  
    text: theme === 'dark' ? 'text-gray-300' : 'text-gray-700',
    textSecondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    textPrimary: theme === 'dark' ? 'text-white' : 'text-gray-900',
  
    border: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
  
    profileSection: theme === 'dark' ? 'text-gray-300' : 'text-gray-700',
    profileName: theme === 'dark' ? 'text-white' : 'text-gray-800',
  });
  