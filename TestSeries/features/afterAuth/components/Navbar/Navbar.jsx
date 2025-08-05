import React, { useState, useEffect, useRef } from 'react';
import { Search, Settings, ChevronDown, Menu, X, Sun, Moon, CreativeCommons, PaperclipIcon, Lock } from 'lucide-react';
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

  console.log("check ", user)

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


  const rolePrefix = user.role === ('organization' || 'user') ? '/institute' : '/student';


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
    const rolePrefix = user.role === 'organization' || user.role === 'user' ? '/institute' : '/student';
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

  const helperFunctionToNavigateHome = (role) => {
      if(role === 'student') return navigate('/student/student-landing')
      
      if(role === 'organization' || role === 'user') return navigate('/institute/institute-landing')

      else {
        navigate('/')
      }
  }
  
  return (
    <nav className={`z-50 ${themeClasses.nav}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo */}
          <button 
            onClick={() => helperFunctionToNavigateHome(user?.role)}
            className="flex items-center cursor-pointer">
            
            <img 
              src={ theme === 'light' ? logo : logoDark} 
              alt="Evalvo" 
              className="h-8 w-auto"
            />
          </button>

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
                <div className={`absolute right-0 mt-2 w-72 rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 z-50 ${themeClasses.dropdown} overflow-hidden`}>
                  
                  {/* User Info Header */}
                  <div className={`px-6 py-4 border-b ${themeClasses.border} ${theme === 'light' ? 'bg-gradient-to-r from-indigo-50 to-blue-50' : 'bg-gray-800'}`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${theme === 'light' ? 'bg-indigo-600' : 'bg-indigo-400'}`}>
                        <span className={`font-semibold text-lg ${theme === 'light' ? 'text-white' : 'text-gray-950'}`}>
                          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold text-lg truncate ${themeClasses.textPrimary}`}>
                          {user?.name || 'User'}
                        </div>
                        <div className={`text-sm truncate ${themeClasses.textSecondary}`}>
                          {user?.email || 'user@example.com'}
                        </div>
                        {user?.role && (
                          <div className="mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                              user.role === 'organization' 
                                ? theme === 'light' 
                                  ? 'bg-purple-100 text-purple-800' 
                                  : 'bg-purple-900 text-purple-200'
                                : theme === 'light'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-green-900 text-green-200'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    
                    {/* Account Section */}
                    <div className="px-3 py-2">
                      <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${themeClasses.textSecondary}`}>
                        Account
                      </div>
                      
                      {(user?.role === 'user' || user?.role === 'student') && (
                        <button
                          onClick={() => {
                            if (user?._id ) {
                              navigate(`/edit-profile/${user._id}`);
                              setShowProfileDropdown(false);
                              setActiveCategory('');
                            }
                          }}
                          className={`w-full flex items-center px-3 py-3 text-sm rounded-lg transition-all duration-200 ${themeClasses.dropdownItem} ${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${theme === 'light' ? 'bg-blue-100' : 'bg-blue-900'}`}>
                            <svg className={`w-4 h-4 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <span className="font-medium">Edit Profile</span>
                        </button>
                      )}

                      {user?.role === "organization" && (
                        <button
                          onClick={() => {
                            navigate('/institute-subscription');
                            setShowProfileDropdown(false);
                            setActiveCategory('');
                          }}
                          className={`w-full flex items-center px-3 py-3 text-sm rounded-lg transition-all duration-200 ${themeClasses.dropdownItem} ${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${theme === 'light' ? 'bg-purple-100' : 'bg-purple-900'}`}>
                            <svg className={`w-4 h-4 ${theme === 'light' ? 'text-purple-600' : 'text-purple-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <span className="font-medium">Know Your Plan</span>
                        </button>
                      )}
                    </div>

                    {/* Divider */}
                    <div className={`mx-3 border-t ${themeClasses.border}`}></div>

                    {/* Tools Section */}
                    <div className="px-3 py-2">
                      <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${themeClasses.textSecondary}`}>
                        Tools & Products
                      </div>
                      
                     

                      {
                        user?.role !== 'student' && (
                          <div className="relative group">
                          {/** QBMS TOOL */}
                      
                          <button

                            onClick={() => {
                              navigate(`/qbms/${user._id}`);
                              setShowProfileDropdown(false);
                              setActiveCategory('');
                            }}
                            disabled={!user?.planFeatures?.questionBank_feature?.isActive || !user?.planFeatures?.questionBank_feature?.value}
                            className={`w-full flex items-center px-3 py-3 text-sm rounded-lg transition-all duration-200 ${themeClasses.dropdownItem} ${theme === 'light' ? 'hover:bg-gray-50 group-hover:shadow-md' : 'hover:bg-gray-700 group-hover:shadow-md'}`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${theme === 'light' ? 'bg-gradient-to-br from-green-100 to-emerald-100' : 'bg-gradient-to-br from-green-900 to-emerald-900'}`}>
                              <svg className={`w-4 h-4 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="flex-1 text-left">
                              <div className="flex items-center">
                                {
                                  user?.planFeatures?.questionBank_feature?.isActive && user?.planFeatures?.questionBank_feature?.value ? (
                                      <div>
                                         <span className="font-medium">QBMS</span>
                                          <span className="ml-2 bg-green-100 text-green-800 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-green-300 shadow-sm">
                                            NEW
                                          </span>
                                        
                                        <div className={`text-xs mt-0.5 ${themeClasses.textSecondary}`}>
                                          Question Bank Management
                                        </div>
                                      </div>
                                  ) : (
                                    <div className='cursor-not-allowed'>
                                      <span className="font-medium flex gap-6">QBMS <Lock className={`${theme === 'light' ? 'text-red-600' : 'text-red-400'} w-4 h-4`}/></span>
                                      <div className={`text-xs mt-0.5 ${themeClasses.textSecondary}`}>
                                          Question Bank Management
                                        </div>
                                    </div>
                                  )
                                }
                               </div>
                            </div>
                          </button>

                           {/** Certificate TOOL */}

                          <button
                            onClick={() => navigate('/certificate-assignment')}
                            disabled={!user?.planFeatures?.certification_feature?.isActive || !user?.planFeatures?.certification_feature?.value > 0}
                            className={`w-full flex items-center px-3 py-3 text-sm rounded-lg transition-all duration-200 ${themeClasses.dropdownItem} ${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}`}
                          >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${theme === 'light' ? 'bg-indigo-100' : 'bg-indigo-900'}`}>
                            <PaperclipIcon className={`w-4 h-4 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}`}/>
                          </div>
                          <div className="flex-1 text-left">
                             <div className="flex items-center">
                              {
                                user?.planFeatures?.certification_feature?.isActive && user?.planFeatures?.certification_feature?.value > 0 ? (
                                  <div>
                                    <span className="font-medium"> Certificates</span>
                                    <span className="ml-2 bg-yellow-100 text-yellow-800 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-yellow-300 shadow-sm">
                                      NEW
                                    </span>
                                  
                                    <div className={`text-xs mt-0.5 ${themeClasses.textSecondary}`}>
                                      Choose Cerificates 
                                    </div>
                                  </div>
                                ) : (
                                  <div className='cursor-not-allowed' >
                                   <span className="font-medium flex gap-6"> Certificates <Lock className={`${theme === 'light' ? 'text-red-600' : 'text-red-400'} w-4 h-4`}/></span>
                                    <div className={`text-xs mt-0.5  ${themeClasses.textSecondary}`}>
                                      Choose Cerificates 
                                    </div>
                                  </div>
                                )
                              }
                            </div>
                           </div>
                          </button>
                        </div>
                        )
                      }

                       {/** Application TOOL */}
                      <button 
                        onClick={() => navigate('/download-app')}
                        disabled={!user?.planFeatures?.proctore_feature?.isActive || !user?.planFeatures?.proctore_feature?.value}
                        className={`w-full flex items-center px-3 py-3 text-sm rounded-lg transition-all duration-200 ${themeClasses.dropdownItem} ${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'}`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${theme === 'light' ? 'bg-indigo-100' : 'bg-indigo-900'}`}>
                          <svg className={`w-4 h-4 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        {
                          user?.planFeatures?.proctore_feature?.isActive && user?.planFeatures?.proctore_feature?.value ? (
                            <span className="font-medium">Download Application</span>
                          ) : (
                            <span className="font-medium flex gap-6 cursor-not-allowed">Download Application <Lock className={`${theme === 'light' ? 'text-red-600' : 'text-red-400'} w-4 h-4`}/></span>
                          )
                        }
                      </button>

                     
                    </div>

                    {/* Divider */}
                    <div className={`mx-3 border-t ${themeClasses.border}`}></div>

                    {/* Settings Section */}
                    <div className="px-3 py-2">
                      <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${themeClasses.textSecondary}`}>
                        Preferences
                      </div>
                      
                      <div className={`flex items-center justify-between px-3 py-3 text-sm rounded-lg ${themeClasses.dropdownItem}`}>
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
                            <svg className={`w-4 h-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="font-medium">Show Dock</span>
                        </div>
                        <div
                          onClick={() => toggleDock()}
                          className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                            isDockToggled 
                              ? theme === 'light' ? 'bg-indigo-600' : 'bg-indigo-400'
                              : theme === 'light' ? 'bg-gray-300' : 'bg-gray-600'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                              isDockToggled ? 'translate-x-6' : 'translate-x-0'
                            } ${theme === 'light' ? 'bg-white' : 'bg-gray-950'}`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className={`mx-3 border-t ${themeClasses.border}`}></div>

                    {/* Sign Out */}
                    <div className="px-3 py-2">
                      <button
                        onClick={() => {
                          setShowLogoutModal(true);
                          setShowProfileDropdown(false);
                          setActiveCategory('');
                        }}
                        className={`w-full flex items-center px-3 py-3 text-sm rounded-lg transition-all duration-200 ${theme === 'light' ? 'hover:bg-red-50 text-red-600' : 'hover:bg-red-900/20 text-red-400'}`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${theme === 'light' ? 'bg-red-100' : 'bg-red-900'}`}>
                          <svg className={`w-4 h-4 ${theme === 'light' ? 'text-red-600' : 'text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </div>
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
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