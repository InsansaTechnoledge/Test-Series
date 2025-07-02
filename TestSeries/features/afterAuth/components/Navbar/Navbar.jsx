import React, { useState, useEffect, useRef } from 'react';
import { Search, Settings, ChevronDown, Menu, X, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../../contexts/currentUserContext';
// import logo from '../../../../assests/Landing/Navbar/evalvo logo blue 2.svg'
import logo from '../../../../assests/Logo/Frame 8.svg'
import logoDark from '../../../../assests/Logo/Frame 15.svg'
import { useTheme } from '../../../../hooks/useTheme.jsx';
import { getThemeClasses } from '../../../constants/Theme/ThemeClasses.js';
import SideBarDataHook from '../../data/SideBarDataHook.jsx';
import EpicThemeSlider from './ThemeSlide.jsx';
import SearchResults from './SearchResults.jsx';

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
  const { controls, categories } = SideBarDataHook();
 

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


  const rolePrefix = user.role === 'organization' ? '/institute' : '/student';


  const handleResultClick = (result) => {
    if (result.type === 'feature') {
      navigate(`${rolePrefix}/${result.path}`);
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
    const rolePrefix = user.role === 'organization' ? '/institute' : '/student';
    navigate(`${rolePrefix}/${path}`);
    setShowMobileMenu(false); 
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
                  <SearchResults 
                    setShowSearchResults={setShowSearchResults} 
                    searchResults={searchResults} 
                    theme={theme} 
                    themeClasses={themeClasses} 
                    showSearchResults={showSearchResults} 
                    searchResultsRef={searchResultsRef} 
                    selectedResultIndex={selectedResultIndex}
                    handleResultClick={handleResultClick} 
                  />                
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
                    {
                      (user?.role === 'user' || user?.role === 'student') && (
                        <button
                          onClick={() => {
                            if (user?._id) {
                              navigate(`/edit-profile/${user._id}`);
                            }
                          }}
                        className={`block w-full text-left px-4 py-2 text-sm ${themeClasses.dropdownItem}`}
                      >
                        Edit Profile
                      </button>
                      )
                    }
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
               <SearchResults 
                  isMobile={true} 
                  setShowSearchResults={setShowSearchResults} 
                  searchResults={searchResults} 
                  theme={theme} 
                  themeClasses={themeClasses} 
                  showSearchResults={showSearchResults} 
                  searchResultsRef={searchResultsRef} 
                  selectedResultIndex={selectedResultIndex}
                  handleResultClick={handleResultClick} 
                />
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

              {
                user?.role === 'organization' && (
                  <button
                  onClick={() => navigate('/institute-subscription')}
                  className={`block w-full text-left px-3 py-2 text-base font-medium rounded-md ${themeClasses.dropdownItem}`}
                >
                  Know Your Plan
                </button>
                )
              }
               
                {
                  (user?.role === 'user' || user?.role === 'student') && (
                    <button
                      onClick={() => {
                        if (user?._id) {
                          navigate(`/edit-profile/${user._id}`);
                        }
                      }}
                    
                      className={`block w-full text-left px-3 py-2 text-base font-medium rounded-md ${themeClasses.dropdownItem}`}
                      >
                      Edit Profile
                    </button>
                  )
                }
                
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