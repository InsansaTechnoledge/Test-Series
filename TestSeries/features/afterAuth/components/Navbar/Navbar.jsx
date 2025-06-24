import React, { useState, useEffect, useRef } from 'react';
import { Search, Settings, ChevronDown, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../../data/SiddeBarData';
import { controls } from '../../data/SiddeBarData';
import { useUser } from '../../../../contexts/currentUserContext';
import logo from '../../../../assests/Landing/Navbar/evalvo logo blue 2.svg'

const Navbar = ({setShowLogoutModal}) => {
  const [activeCategory, setActiveCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDesktopSearch, setShowDesktopSearch] = useState(false);
  
  // New search-related states
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);

  const [theme , setTheme] = useState('light')

  const handleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  }
  
  console.log(theme)

  const searchInputRef = useRef(null);
  const searchResultsRef = useRef(null);
  const { user } = useUser();
  const navigate = useNavigate();

  // Search functionality
  const performSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const results = [];
    const queryLower = query.toLowerCase();

    // Search through all features/controls
    controls.forEach(control => {
      const nameMatch = control.name.toLowerCase().includes(queryLower);
      const pathMatch = control.path.toLowerCase().includes(queryLower);
      
      if (nameMatch || pathMatch) {
        // Find which category this feature belongs to
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

    // Search through categories
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

    // Sort results by relevance
    results.sort((a, b) => {
      // Exact matches first
      const aExact = a.name.toLowerCase() === queryLower;
      const bExact = b.name.toLowerCase() === queryLower;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      // Features before categories
      if (a.type === 'feature' && b.type === 'category') return -1;
      if (a.type === 'category' && b.type === 'feature') return 1;
      
      // Alphabetical order
      return a.name.localeCompare(b.name);
    });

    setSearchResults(results.slice(0, 8)); // Limit to 8 results
    setShowSearchResults(true);
    setSelectedResultIndex(-1);
  };

  // Handle search input change with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 150); // Debounce search by 150ms

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle keyboard navigation in search results
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

  // Handle result click
  const handleResultClick = (result) => {
    if (result.type === 'feature') {
      navigate(`/institute/${result.path}`);
    } else if (result.type === 'category') {
      // Open category dropdown
      setActiveCategory(result.name);
      setShowDesktopSearch(false);
    }
    
    setSearchQuery('');
    setShowSearchResults(false);
    setShowMobileMenu(false);
    setSelectedResultIndex(-1);
  };

  // Close search results when clicking outside
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
      setActiveCategory(''); // Close any open dropdowns when opening search
      // Focus search input after state update
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

  // Search Results Component
  const SearchResults = ({ isMobile = false }) => {
    if (!showSearchResults || searchResults.length === 0) return null;

    return (
      <div 
        ref={searchResultsRef}
        className={`absolute bg-white rounded-lg shadow-xl border border-gray-200 z-[9999] ${
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
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                selectedResultIndex === index ? 'bg-indigo-50 border-l-2 border-indigo-500' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 flex items-center justify-center">
                  {result.type === 'feature' ? (
                    <img 
                      src={result.icon} 
                      alt={result.name} 
                      className="w-5 h-5"
                    />
                  ) : (
                    <img 
                      src={result.icon} 
                      alt={result.name} 
                      className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 truncate">
                        {result.name}
                      </span>
                      {result.type === 'feature' && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          {result.category}
                        </span>
                      )}
                    </div>
                    {result.type === 'category' && (
                      <p className="text-sm text-gray-500 mt-1">
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
      <nav className="bg-white shadow-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side - Logo */}
            <div className="flex items-center">
              <img 
                src={logo} 
                alt="Evalvo" 
                className="h-8 w-auto"
                // onClick={() => navigate('/institute')}
              />
            </div>
  
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Categories Dropdown - Hidden when search is active */}
              {!showDesktopSearch && (
                <div className="relative">
                  {categories.map((category) => (
                    <div key={category.name} className="relative inline-block">
                      <button
                        onClick={() => handleCategoryClick(category.name)}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          activeCategory === category.name
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'text-gray-700 hover:bg-gray-50'
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
                        <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                          <div className="py-1">
                            {category.features.map((featureName) => {
                              const control = controls.find(c => c.name === featureName);
                              return control ? (
                                <button
                                  key={control.name}
                                  onClick={() => handleFeatureClick(control.path)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
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
  
              {/* Desktop Search - Expanded when active */}
              <div className="relative">
                {showDesktopSearch ? (
                  <div className="relative">
                    <div className="flex items-center">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Search features..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={handleSearchKeyDown}
                          onFocus={() => searchQuery && setShowSearchResults(true)}
                          className="w-96 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                      <button
                        onClick={toggleDesktopSearch}
                        className="ml-2 p-2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <SearchResults />
                  </div>
                ) : (
                  <button
                    onClick={toggleDesktopSearch}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                )}
              </div>
  
             
  
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
                  <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
                </button>
  
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <div className="font-medium">{user?.name || 'User'}</div>
                        <div className="text-gray-500">{user?.email || 'user@example.com'}</div>
                      </div>
                      <button
                        onClick={() => {
                          setShowLogoutModal(true);
                          setShowProfileDropdown(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Sign out
                      </button>
                      {
                        user?.role === "organization" &&
                          <button
                            onClick={() => {
                              navigate('/institute-subscription')
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            Know Your Plan
                          </button>
                      }

                      <button
                            onClick={() => {
                              handleTheme();
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            Toggle Dark
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
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
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
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search features..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    onFocus={() => searchQuery && setShowSearchResults(true)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-700 hover:bg-gray-50'
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
                              className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
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
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center px-3 py-2">
                    <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {user?.name || 'User'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user?.email || 'user@example.com'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowLogoutModal(true);
                      setShowMobileMenu(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    Sign out
                  </button>

                  <button
                        onClick={() => {
                          navigate('/institute-subscription')
                        }}
                        className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                        >
                        Know Your Plan
                  </button>

                  <button
                            onClick={() => {
                              handleTheme();
                            }}
                            className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                            >
                            Toggle Dark
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