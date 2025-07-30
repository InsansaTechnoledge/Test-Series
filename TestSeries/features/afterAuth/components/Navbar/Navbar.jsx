import React, { useState, useEffect, useRef } from 'react';
import { Search, Settings, ChevronDown, Menu, X, Sun, Moon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../../../contexts/currentUserContext';
// import logo from '../../../../assests/Landing/Navbar/evalvo logo blue 2.svg'
import logo from '../../../../assests/Logo/Frame 8.svg'
import logoDark from '../../../../assests/Logo/Frame 15.svg'
import { useTheme } from '../../../../hooks/useTheme.jsx';
import { getThemeClasses } from '../../../constants/Theme/ThemeClasses.js';
import SideBarDataHook from '../../data/SideBarDataHook.jsx';
import EpicThemeSlider from './ThemeSlide.jsx';
import SearchResults from './SearchResults.jsx';
import MobileMenuBar from './MobileMenuBar.jsx';
import { useDock } from './context/DockContext.jsx';

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
  // const [isDockToggled, setDockIsToggled] = useState(false);
  const {isDockToggled,toggleDock} = useDock();

 

  console.log("check", user)

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
        setActiveCategory(''); // Close categories dropdown on escape
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
    // Close categories dropdown after clicking a search result
    setActiveCategory('');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target) &&
          searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSearchResults(false);
        setSelectedResultIndex(-1);
      }
      
      // Close categories dropdown when clicking outside
      const categoryDropdowns = document.querySelectorAll('[data-category-dropdown]');
      const categoryButtons = document.querySelectorAll('[data-category-button]');
      
      let clickedInsideCategory = false;
      categoryDropdowns.forEach(dropdown => {
        if (dropdown.contains(event.target)) {
          clickedInsideCategory = true;
        }
      });
      
      categoryButtons.forEach(button => {
        if (button.contains(event.target)) {
          clickedInsideCategory = true;
        }
      });
      
      if (!clickedInsideCategory) {
        setActiveCategory('');
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
      setActiveCategory(''); // Close categories dropdown when opening search
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
    setActiveCategory(''); // Close categories dropdown after navigation
  };

  // Close categories dropdown when profile dropdown is opened
  const handleProfileDropdownToggle = () => {
    setShowProfileDropdown(!showProfileDropdown);
    if (!showProfileDropdown) {
      setActiveCategory(''); // Close categories dropdown when opening profile
    }
  };

  const location = useLocation();
  console.log(location)
  
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


            {
              user?.role === 'student' && location.pathname != '/student/student-landing' && (
                <button onClick={() => navigate('/student/student-landing')} className={`${theme === 'light' ? 'bg-indigo-600 text-indigo-100' : 'bg-indigo-400 text-white'} text-xs px-3 py-2 rounded-3xl hover:translate-x-0.5`}>Home</button>
                )
            }

            {/* Categories Dropdown */}
            {!showDesktopSearch && (
              <div className="relative">
                {categories.map((category) => (
                  <div key={category.name} className="relative inline-block">
                    <button
                      data-category-button
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
                      <div 
                        data-category-dropdown
                        className={`absolute top-full left-0 mt-1 w-56 rounded-md ring-1 ring-black ring-opacity-5 z-50 ${themeClasses.dropdown}`}
                      >
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
                onClick={handleProfileDropdownToggle}
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
                        onClick={() => {
                          navigate('/institute-subscription');
                          setShowProfileDropdown(false);
                          setActiveCategory(''); // Close categories dropdown
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${themeClasses.dropdownItem}`}
                      >
                        Know Your Plan
                      </button>
                    )}
                    <button 
                      onClick={() => navigate('/download-app')}
                      className={`block w-full text-left px-4 py-2 text-sm ${themeClasses.dropdownItem}`}>
                      Download Application
                    </button>
                    {
                      (user?.role === 'user' || user?.role === 'student') && (
                        <button
                          onClick={() => {
                            if (user?._id) {
                              navigate(`/edit-profile/${user._id}`);
                              setShowProfileDropdown(false);
                              setActiveCategory(''); // Close categories dropdown
                            }
                          }}
                        className={`block w-full text-left px-4 py-2 text-sm ${themeClasses.dropdownItem}`}
                      >
                        Edit Profile
                      </button>
                      )
                    }

                    <div className={`w-full text-left px-4 py-2 text-sm flex gap-4 ${themeClasses.dropdownItem}`}>
                      show Dock
                      <div
                        onClick={() => toggleDock()}
                        className={`w-14 h-7 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                          isDockToggled ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                      <div
                        className={`w-5 h-5 bg-indigo-400 rounded-full shadow-md transform transition-transform duration-300 ${
                          isDockToggled ? 'translate-x-7' : 'translate-x-0'
                      }`}
                      />
                      </div>
                    </div>
                            


                    <div className="relative group w-full">
                      <button
                        onClick={() => {
                          navigate(`/qbms/${user._id}`);
                          setShowProfileDropdown(false);
                          setActiveCategory('');
                        }}
                        title="you can manage your entire set of questions here"
                        className={`block w-full text-left px-4 py-2 text-sm transition-all duration-200 ease-in-out hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-l-4 hover:border-blue-500 hover:shadow-md hover:transform hover:scale-[1.02] rounded-lg ${themeClasses.dropdownItem}`}
                      >
                        <span className="relative z-10 font-medium group-hover:text-blue-700 transition-colors duration-200 flex items-center gap-2">
                          QBMS
                          <span className="bg-green-100 text-green-800 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-green-300 shadow-sm">
                            NEW
                          </span>
                        </span>
                      </button>

                      <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 bg-gradient-to-r from-gray-900 to-black text-white text-xs rounded-lg px-3 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out whitespace-nowrap z-20 shadow-lg border border-gray-700 backdrop-blur-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                          <span className="font-medium">Question Bank Management System</span>
                        </div>

                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-gradient-to-tl from-gray-900 to-black border-r border-t border-gray-700 transform rotate-45"></div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setShowLogoutModal(true);
                        setShowProfileDropdown(false);
                        setActiveCategory(''); // Close categories dropdown
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

        <MobileMenuBar
          showMobileMenu={showMobileMenu}
          categories={categories}
          activeCategory={activeCategory}
          controls={controls}
          themeClasses={themeClasses}
          user={user}
          searchQuery={searchQuery}
          handleSearchKeyDown={handleSearchKeyDown}
          setSearchQuery={setSearchQuery}
          setShowSearchResults={setShowSearchResults}
          theme={theme}
          handleTheme={handleTheme}
          showSearchResults={showSearchResults}
          searchResultsRef={searchResultsRef}
          selectedResultIndex={selectedResultIndex}
          handleResultClick={handleResultClick}
          searchResults={searchResults}
        />

      </div>
    </nav>
  );
};

export default Navbar;