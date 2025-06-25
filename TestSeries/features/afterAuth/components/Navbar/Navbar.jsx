import React, { useState, useEffect, useRef } from 'react';
import { Search, Settings, ChevronDown, Menu, X, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../../data/SiddeBarData';
import { controls } from '../../data/SiddeBarData';
import { useUser } from '../../../../contexts/currentUserContext';
// import logo from '../../../../assests/Landing/Navbar/evalvo logo blue 2.svg'
import logo from '../../../../assests/Logo/Frame 8.svg'
import logoDark from '../../../../assests/Logo/Frame 15.svg'

import ThemeToggleButton from '../../../../components/ThemeToggleButton/ThemeToggleButton';
import { useTheme } from '../../../../hooks/useTheme.jsx';
import { getThemeClasses } from '../../../constants/Theme/ThemeClasses.js';

// Epic Theme Slider Component
const EpicThemeSlider = ({ theme, onToggle }) => {
  return (
    <div className="flex items-center space-x-3">
      <Sun className={`w-4 h-4 transition-colors ${theme === 'light' ? 'text-orange-500' : 'text-gray-400'}`} />
      <div 
        className="relative cursor-pointer"
        onClick={onToggle}
      >
        <div className={`w-14 h-7 rounded-full transition-all duration-300 ease-in-out shadow-inner ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg' 
            : 'bg-gradient-to-r from-orange-400 to-yellow-500 shadow-lg'
        }`}>
          <div className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full transition-all duration-300 ease-in-out transform shadow-lg ${
            theme === 'dark' 
              ? 'translate-x-7 bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-indigo-400' 
              : 'translate-x-0 bg-gradient-to-br from-white to-orange-50 border-2 border-orange-300'
          }`}>
            <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-purple-400/20 to-indigo-400/20 animate-pulse' 
                : 'bg-gradient-to-br from-yellow-300/30 to-orange-300/30 animate-pulse'
            }`} />
            {theme === 'dark' ? (
              <Moon className="w-3 h-3 text-indigo-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            ) : (
              <Sun className="w-3 h-3 text-orange-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            )}
          </div>
        </div>
        <div className={`absolute -inset-1 rounded-full opacity-30 transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 blur-sm' 
            : 'bg-gradient-to-r from-orange-400 to-yellow-400 blur-sm'
        }`} />
      </div>
      <Moon className={`w-4 h-4 transition-colors ${theme === 'dark' ? 'text-indigo-400' : 'text-gray-400'}`} />
    </div>
  );
};

const Navbar = ({setShowLogoutModal}) => {
  const [activeCategory, setActiveCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDesktopSearch, setShowDesktopSearch] = useState(false);

  const { theme, handleTheme } = useTheme();
  const themeClasses = getThemeClasses(theme);  

  console.log(theme)
  
  // New search-related states
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);

  const searchInputRef = useRef(null);
  const searchResultsRef = useRef(null);
  const { user } = useUser();
  const navigate = useNavigate();
 

  // Search functionality (unchanged)
  const performSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const results = [];
    const queryLower = query.toLowerCase();

    controls.forEach(control => {
      const nameMatch = control.name.toLowerCase().includes(queryLower);
      const pathMatch = control.path.toLowerCase().includes(queryLower);
      
      if (nameMatch || pathMatch) {
        const category = categories.find(cat => 
          cat.features.includes(control.name)
        );
        
        results.push({
          type: 'feature',
          name: control.name,
          path: control.path,
          icon: control.icon,
          category: category?.name || 'Other',
          matchType: nameMatch ? 'name' : 'path'
        });
      }
    });

    categories.forEach(category => {
      if (category.name.toLowerCase().includes(queryLower)) {
        results.push({
          type: 'category',
          name: category.name,
          icon: category.icon,
          features: category.features,
          matchType: 'category'
        });
      }
    });

    results.sort((a, b) => {
      const aExact = a.name.toLowerCase() === queryLower;
      const bExact = b.name.toLowerCase() === queryLower;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      if (a.type === 'feature' && b.type === 'category') return -1;
      if (a.type === 'category' && b.type === 'feature') return 1;
      
      return a.name.localeCompare(b.name);
    });

    setSearchResults(results.slice(0, 8));
    setShowSearchResults(true);
    setSelectedResultIndex(-1);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchKeyDown = (e) => {
    if (!showSearchResults || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedResultIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedResultIndex(prev => 
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedResultIndex >= 0 && searchResults[selectedResultIndex]) {
          handleResultClick(searchResults[selectedResultIndex]);
        }
        break;
      case 'Escape':
        setShowSearchResults(false);
        setSelectedResultIndex(-1);
        searchInputRef.current?.blur();
        break;
    }
  };

  const handleResultClick = (result) => {
    if (result.type === 'feature') {
      navigate(`/institute/${result.path}`);
    } else if (result.type === 'category') {
      setActiveCategory(result.name);
      setShowDesktopSearch(false);
    }
    
    setSearchQuery('');
    setShowSearchResults(false);
    setShowMobileMenu(false);
    setSelectedResultIndex(-1);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target) &&
          searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSearchResults(false);
        setSelectedResultIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(activeCategory === categoryName ? '' : categoryName);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    setActiveCategory('');
  };

  const toggleDesktopSearch = () => {
    setShowDesktopSearch(!showDesktopSearch);
    if (!showDesktopSearch) {
      setActiveCategory('');
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery('');
      setShowSearchResults(false);
    }
  };

  const handleFeatureClick = (path) => {
    navigate(`/institute/${path}`);
    setShowMobileMenu(false); 
  };

  // Search Results Component with theming
  const SearchResults = ({ isMobile = false }) => {
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
                    src= {result.icon} 
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

  return (
    <nav className={`z-50 ${themeClasses.nav}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <img 
              src={ theme === 'light' ? logo : logoDark} 
              alt="Evalvo" 
              className="h-8 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Categories Dropdown */}
            {!showDesktopSearch && (
              <div className="relative">
                {categories.map((category) => (
                  <div key={category.name} className="relative inline-block">
                    <button
                      onClick={() => handleCategoryClick(category.name)}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeCategory === category.name
                          ? themeClasses.activeButton
                          : themeClasses.button
                      }`}
                    >
                      <img 
                        src={category.icon} 
                        alt={category.name} 
                        className="w-4 h-4 mr-2"
                      />
                      {category.name}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>

                    {/* Category Dropdown */}
                    {activeCategory === category.name && (
                      <div className={`absolute top-full left-0 mt-1 w-56 rounded-md ring-1 ring-black ring-opacity-5 z-50 ${themeClasses.dropdown}`}>
                        <div className="py-1">
                          {category.features.map((featureName) => {
                            const control = controls.find(c => c.name === featureName);
                            return control ? (
                              <button
                                key={control.name}
                                onClick={() => handleFeatureClick(control.path)}
                                className={`flex items-center w-full px-4 py-2 text-sm ${themeClasses.dropdownItem}`}
                              >
                                <img 
                                  src={control.icon} 
                                  alt={control.name} 
                                  className="w-4 h-4 mr-3"
                                />
                                {control.name}
                              </button>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Desktop Search */}
            <div className="relative">
              {showDesktopSearch ? (
                <div className="relative">
                  <div className="flex items-center">
                    <div className="relative flex-1">
                      <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${themeClasses.textSecondary}`} />
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search features..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        onFocus={() => searchQuery && setShowSearchResults(true)}
                        className={`w-96 pl-10 pr-4 py-2 border rounded-lg focus:ring-2 transition-all duration-300 ${themeClasses.input}`}
                      />
                    </div>
                    <button
                      onClick={toggleDesktopSearch}
                      className={`ml-2 p-2 rounded-md ${themeClasses.button}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <SearchResults />
                </div>
              ) : (
                <button
                  onClick={toggleDesktopSearch}
                  className={`p-2 rounded-md ${themeClasses.button}`}
                >
                  <Search className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Epic Theme Slider */}
            <EpicThemeSlider theme={theme} onToggle={handleTheme} />

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <ChevronDown className={`ml-1 h-4 w-4 ${themeClasses.textSecondary}`} />
              </button>

              {showProfileDropdown && (
                <div className={`absolute right-0 mt-2 w-48 rounded-md ring-1 ring-black ring-opacity-5 z-50 ${themeClasses.dropdown}`}>
                  <div className="py-1">
                    <div className={`px-4 py-2 text-sm border-b ${themeClasses.border}`}>
                      <div className={`font-medium ${themeClasses.textPrimary}`}>{user?.name || 'User'}</div>
                      <div className={themeClasses.textSecondary}>{user?.email || 'user@example.com'}</div>
                    </div>
                    {user?.role === "organization" && (
                      <button
                        onClick={() => navigate('/institute-subscription')}
                        className={`block w-full text-left px-4 py-2 text-sm ${themeClasses.dropdownItem}`}
                      >
                        Know Your Plan
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setShowLogoutModal(true);
                        setShowProfileDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${themeClasses.dropdownItem}`}
                    >
                      Sign out
                    </button>
                    
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className={`p-2 rounded-md ${themeClasses.button}`}
            >
              {showMobileMenu ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${themeClasses.textSecondary}`} />
                <input
                  type="text"
                  placeholder="Search features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${themeClasses.input}`}
                />
                <SearchResults isMobile={true} />
              </div>

              {/* Mobile Categories */}
              {categories.map((category) => (
                <div key={category.name}>
                  <button
                    onClick={() => handleCategoryClick(category.name)}
                    className={`flex items-center justify-between w-full px-3 py-2 text-base font-medium rounded-md ${
                      activeCategory === category.name
                        ? themeClasses.activeButton
                        : themeClasses.button
                    }`}
                  >
                    <div className="flex items-center">
                      <img 
                        src={category.icon} 
                        alt={category.name} 
                        className="w-5 h-5 mr-3"
                      />
                      {category.name}
                    </div>
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform ${
                        activeCategory === category.name ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>

                  {/* Mobile Category Features */}
                  {activeCategory === category.name && (
                    <div className="mt-1 ml-8 space-y-1">
                      {category.features.map((featureName) => {
                        const control = controls.find(c => c.name === featureName);
                        return control ? (
                          <button
                            key={control.name}
                            onClick={() => handleFeatureClick(control.path)}
                            className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${themeClasses.dropdownItem}`}
                          >
                            <img 
                              src={control.icon} 
                              alt={control.name} 
                              className="w-4 h-4 mr-3"
                            />
                            {control.name}
                          </button>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile Profile Section */}
              <div className={`border-t pt-4 mt-4 ${themeClasses.border}`}>
                <div className="flex items-center px-3 py-2">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <div className="ml-3">
                    <div className={`text-base font-medium ${themeClasses.profileName}`}>
                      {user?.name || 'User'}
                    </div>
                    <div className={`text-sm ${themeClasses.textSecondary}`}>
                      {user?.email || 'user@example.com'}
                    </div>
                  </div>
                </div>
                
                {/* Mobile Epic Theme Slider */}
                <div className="px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-base font-medium ${themeClasses.textPrimary}`}>
                      Theme
                    </span>
                    <EpicThemeSlider theme={theme} onToggle={handleTheme} />
                  </div>
                </div>

                <button
                  onClick={() => navigate('/institute-subscription')}
                  className={`block w-full text-left px-3 py-2 text-base font-medium rounded-md ${themeClasses.dropdownItem}`}
                >
                  Know Your Plan
                </button>
                
                <button
                  onClick={() => {
                    setShowLogoutModal(true);
                    setShowMobileMenu(false);
                  }}
                  className={`block w-full text-left px-3 py-2 text-base font-medium rounded-md ${themeClasses.dropdownItem}`}
                >
                  Sign out
                </button>
                
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;