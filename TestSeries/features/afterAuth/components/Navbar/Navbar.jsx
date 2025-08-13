import React, { useState, useEffect, useRef } from 'react';
import { Search, Settings, ChevronDown, Menu, X, Sun, Moon, CreativeCommons, PaperclipIcon, Lock, LogsIcon, EyeIcon, User, Download, CreditCard, Eye, Palette, Monitor, LogOut, Home } from 'lucide-react';
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
import { getOrganizationById } from '../../../../utils/services/organizationService.js';
import EvalvoThemeToggle from './EvalvoThemeToggle.jsx';

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
  const {isDockToggled,toggleDock} = useDock();
  const [organizationName, setOrganizationName] = useState('');
  const [orgLogo , setOrgLogo] = useState('');

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
        setActiveCategory('');
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
    setActiveCategory('');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSearchResults(false);
        setSelectedResultIndex(-1);
      }
  
      const categoryDropdowns = document.querySelectorAll('[data-category-dropdown]');
      const categoryButtons = document.querySelectorAll('[data-category-button]');
  
      let clickedInsideCategory = false;
      categoryDropdowns.forEach(dropdown => {
        if (dropdown.contains(event.target)) clickedInsideCategory = true;
      });
      categoryButtons.forEach(button => {
        if (button.contains(event.target)) clickedInsideCategory = true;
      });
  
      if (!clickedInsideCategory && window.innerWidth >= 768) {
        setActiveCategory('');
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleCategoryClick = (categoryName) => {
    console.log(`Category clicked: ${categoryName}`);
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
    console.log(`Navigating to ${path}`);
    const rolePrefix = user.role === 'organization' || user.role === 'user' ? '/institute' : '/student';
    navigate(`${rolePrefix}/${path}`);
    setShowMobileMenu(false); 
    setActiveCategory('');
  };

  const handleProfileDropdownToggle = () => {
    setShowProfileDropdown(!showProfileDropdown);
    if (!showProfileDropdown) {
      setActiveCategory('');
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
  
  console.log("Gf", user);

  useEffect(() => {
    const fetchOrgName = async () => {
      if (user?.role !== 'organization' && user?.organizationId?._id) {
        try {
          const res = await getOrganizationById(user.organizationId._id);
          console.log('gd', res)
          setOrganizationName(res.data?.name || 'Unknown Org');
          setOrgLogo(res?.data?.logoUrl || '')
        } catch (err) {
          console.error('Failed to fetch organization name:', err);
          setOrganizationName('Unknown Org');
        }
      }
    };

    fetchOrgName();
  }, [user]);  
  
  return (
    <nav className={`z-50 ${themeClasses.nav}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo */}
          <button 
            onClick={() => helperFunctionToNavigateHome(user?.role)}
            className="flex items-center cursor-pointer">
            
            {
              user?.role === 'organization' ? (
                <img 
                src={ theme === 'light' ? logo : logoDark} 
                alt="Evalvo" 
                className="h-8 w-auto"
              />
              ) : (
                <div className="flex items-center gap-4 px-4 py-2 rounded-xl ">
                  <img
                    className="h-12 w-12 rounded-full object-cover border-2 shadow-sm"
                    src={orgLogo}
                    alt="Organization Logo"
                  />
                  <span
                    className={`text-xl font-bold tracking-wide ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}
                  >
                    {organizationName}
                  </span>
                </div>
              )
            }
           
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
                <div className={`absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl ring-1 ring-black ring-opacity-5 z-50 ${themeClasses.dropdown} overflow-hidden max-h-[80vh] overflow-y-auto`}>
                  
                  {/* Compact User Info Header */}
                  <div className={`px-4 py-3 border-b ${themeClasses.border} ${theme === 'light' ? 'bg-gradient-to-r from-indigo-50 to-blue-50' : 'bg-gray-800'}`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${theme === 'light' ? 'bg-indigo-600' : 'bg-indigo-400'}`}>
                        <span className={`font-semibold ${theme === 'light' ? 'text-white' : 'text-gray-950'}`}>
                          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold truncate ${themeClasses.textPrimary}`}>
                          {user?.name || 'User'}
                        </div>
                        <div className={`text-xs truncate ${themeClasses.textSecondary}`}>
                          {user?.email || 'user@example.com'}
                        </div>
                        {user?.role && (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize mt-1 ${
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
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions Grid */}
                  <div className="p-3">
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      
                      {/* Edit Profile (for student/user) */}
                      {(user?.role === 'student' || user.role === 'user') && (
                        <button
                          onClick={() => {
                            if (user?._id ) {
                              navigate(`/edit-profile/${user._id}`);
                              setShowProfileDropdown(false);
                              setActiveCategory('');
                            }
                          }}
                          className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 ${theme === 'light' ? 'hover:bg-blue-50 bg-blue-25' : 'hover:bg-blue-900/20 bg-blue-900/10'}`}
                        >
                          <User className={`w-5 h-5 mb-1 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
                          <span className={`text-xs font-medium ${themeClasses.textPrimary}`}>Profile</span>
                        </button>
                      )}

                      {/* Home button for students */}
                      {user?.role === 'student' && location.pathname !== '/student/student-landing' && (
                        <button
                          onClick={() => {
                            navigate('/student/student-landing');
                            setShowProfileDropdown(false);
                            setActiveCategory('');
                          }}
                          className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 ${theme === 'light' ? 'hover:bg-green-50 bg-green-25' : 'hover:bg-green-900/20 bg-green-900/10'}`}
                        >
                          <Home className={`w-5 h-5 mb-1 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`} />
                          <span className={`text-xs font-medium ${themeClasses.textPrimary}`}>Home</span>
                        </button>
                      )}

                      {/* Know Your Plan (for organization) */}
                      {user?.role === "organization" && (
                        <button
                          onClick={() => {
                            navigate('/institute/institute-subscription');
                            setShowProfileDropdown(false);
                            setActiveCategory('');
                          }}
                          className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 ${theme === 'light' ? 'hover:bg-purple-50 bg-purple-25' : 'hover:bg-purple-900/20 bg-purple-900/10'}`}
                        >
                          <CreditCard className={`w-5 h-5 mb-1 ${theme === 'light' ? 'text-purple-600' : 'text-purple-400'}`} />
                          <span className={`text-xs font-medium ${themeClasses.textPrimary}`}>Current Plan</span>
                        </button>
                      )}

                      {/* Check Who's Online (for organization) */}
                      {user?.role === "organization" && (
                        <button
                          onClick={() => {
                            navigate('check-logs');
                            setShowProfileDropdown(false);
                            setActiveCategory('');
                          }}
                          className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 ${theme === 'light' ? 'hover:bg-orange-50 bg-orange-25' : 'hover:bg-orange-900/20 bg-orange-900/10'}`}
                        >
                          <Eye className={`w-5 h-5 mb-1 ${theme === 'light' ? 'text-orange-600' : 'text-orange-400'}`} />
                          <span className={`text-xs font-medium ${themeClasses.textPrimary}`}>Online Activity</span>
                        </button>
                      )}

                      {/* Download App */}
                      <button 
                        onClick={() => {
                          navigate('/download-app');
                          setShowProfileDropdown(false);
                          setActiveCategory('');
                        }}
                        disabled={!user?.planFeatures?.proctore_feature?.isActive || !user?.planFeatures?.proctore_feature?.value}
                        className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 relative ${
                          user?.planFeatures?.proctore_feature?.isActive && user?.planFeatures?.proctore_feature?.value
                            ? theme === 'light' ? 'hover:bg-indigo-50 bg-indigo-25' : 'hover:bg-indigo-900/20 bg-indigo-900/10'
                            : 'opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <Download className={`w-5 h-5 mb-1 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}`} />
                        <span className={`text-xs font-medium ${themeClasses.textPrimary}`}>Download App</span>
                        {(!user?.planFeatures?.proctore_feature?.isActive || !user?.planFeatures?.proctore_feature?.value) && (
                          <Lock className="absolute top-1 right-1 w-3 h-3 text-red-500" />
                        )}
                      </button>
                    </div>

                    {/* Tools Section for non-students */}
                    {user?.role !== 'student' && (
                      <div className="mb-3">
                        <div className={`text-xs font-semibold uppercase tracking-wider mb-2 px-1 ${themeClasses.textSecondary}`}>
                          Tools
                        </div>
                        <div className="space-y-1">
                          
                          {/* QBMS Tool */}
                          <button
                            onClick={() => {
                              navigate(`/qbms/${user._id}`);
                              setShowProfileDropdown(false);
                              setActiveCategory('');
                            }}
                            disabled={!user?.planFeatures?.questionBank_feature?.isActive || !user?.planFeatures?.questionBank_feature?.value}
                            className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                              user?.planFeatures?.questionBank_feature?.isActive && user?.planFeatures?.questionBank_feature?.value
                                ? themeClasses.dropdownItem + (theme === 'light' ? ' hover:bg-green-50' : ' hover:bg-green-900/20')
                                : 'opacity-50 cursor-not-allowed ' + themeClasses.dropdownItem
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center mr-3 ${theme === 'light' ? 'bg-green-100' : 'bg-green-900'}`}>
                              <svg className={`w-3 h-3 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="flex-1 text-left">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">QBMS</span>
                                <div className="flex items-center gap-1">
                                  <span className="bg-green-100 text-green-800 text-[9px] font-semibold px-1.5 py-0.5 rounded-full">
                                    NEW
                                  </span>
                                  {(!user?.planFeatures?.questionBank_feature?.isActive || !user?.planFeatures?.questionBank_feature?.value) && (
                                    <Lock className="w-3 h-3 text-red-500" />
                                  )}
                                </div>
                              </div>
                              <div className={`text-xs ${themeClasses.textSecondary}`}>
                                Question Bank Management
                              </div>
                            </div>
                          </button>

                          {/* Certificate Tool */}
                          <button
                            onClick={() => {
                              navigate('/institute/certificate-assignment');
                              setShowProfileDropdown(false);
                              setActiveCategory('');
                            }}
                            disabled={!user?.planFeatures?.certification_feature?.isActive || !user?.planFeatures?.certification_feature?.value > 0}
                            className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                              user?.planFeatures?.certification_feature?.isActive && user?.planFeatures?.certification_feature?.value > 0
                                ? themeClasses.dropdownItem + (theme === 'light' ? ' hover:bg-yellow-50' : ' hover:bg-yellow-900/20')
                                : 'opacity-50 cursor-not-allowed ' + themeClasses.dropdownItem
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center mr-3 ${theme === 'light' ? 'bg-yellow-100' : 'bg-yellow-900'}`}>
                              <PaperclipIcon className={`w-3 h-3 ${theme === 'light' ? 'text-yellow-600' : 'text-yellow-400'}`}/>
                            </div>
                            <div className="flex-1 text-left">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">Certificates</span>
                                <div className="flex items-center gap-1">
                                  <span className="bg-yellow-100 text-yellow-800 text-[9px] font-semibold px-1.5 py-0.5 rounded-full">
                                    NEW
                                  </span>
                                  {(!user?.planFeatures?.certification_feature?.isActive || !user?.planFeatures?.certification_feature?.value > 0) && (
                                    <Lock className="w-3 h-3 text-red-500" />
                                  )}
                                </div>
                              </div>
                              <div className={`text-xs ${themeClasses.textSecondary}`}>
                                Choose Certificates
                              </div>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Settings Section for non-students */}
                   
                      <div className="mb-3">
                        <div className={`text-xs font-semibold uppercase tracking-wider mb-2 px-1 ${themeClasses.textSecondary}`}>
                          Settings
                        </div>
                        <div className="space-y-2">
                          
                       
                          {/* Dock Toggle */}
                          {user.role !== 'student' && (
                            <>
                           
                          <div className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg ${themeClasses.dropdownItem}`}>
                            
                            <div className="flex items-center">
                              <Monitor className={`w-4 h-4 mr-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} />
                              <span className="font-medium text-sm">Show Dock</span>
                            </div>
                            <div
                              onClick={() => toggleDock()}
                              className={`w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${
                                isDockToggled 
                                  ? theme === 'light' ? 'bg-indigo-600' : 'bg-indigo-400'
                                  : theme === 'light' ? 'bg-gray-300' : 'bg-gray-600'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                                  isDockToggled ? 'translate-x-5' : 'translate-x-0'
                                } ${theme === 'light' ? 'bg-white' : 'bg-gray-950'}`}
                              />
                            </div>
                          </div>

                           {/* System Theme */}
                           <div className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg ${themeClasses.dropdownItem}`}>
                           <div className="flex items-center">
                             <Settings className={`w-4 h-4 mr-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} />
                             <span className="font-medium text-sm">System Theme</span>
                           </div>
                           <EvalvoThemeToggle/>
                         </div>

                         </>
                            )}
                        
                          {/* Color Theme */}
                          <div className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg ${themeClasses.dropdownItem}`}>
                            <div className="flex items-center">
                              <Palette className={`w-4 h-4 mr-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} />
                              <span className="font-medium text-sm">Color Theme</span>
                            </div>
                            <EpicThemeSlider theme={theme} onToggle={handleTheme} />
                          </div>

                         
                        </div>
                      </div>
                   

                    {/* Divider */}
                    <div className={`border-t ${themeClasses.border} mb-3`}></div>

                    {/* Sign Out */}
                    <button
                      onClick={() => {
                        setShowLogoutModal(true);
                        setShowProfileDropdown(false);
                        setActiveCategory('');
                      }}
                      className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 ${theme === 'light' ? 'hover:bg-red-50 text-red-600' : 'hover:bg-red-900/20 text-red-400'}`}
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center mr-3 ${theme === 'light' ? 'bg-red-100' : 'bg-red-900'}`}>
                        <LogOut className={`w-3 h-3 ${theme === 'light' ? 'text-red-600' : 'text-red-400'}`} />
                      </div>
                      <span className="font-medium">Sign Out</span>
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
          handleCategoryClick={handleCategoryClick}
          handleFeatureClick={handleFeatureClick}
          setActiveCategory={setActiveCategory}
          setShowMobileMenu={setShowMobileMenu}
          setShowLogoutModal={setShowLogoutModal}
        />

      </div>
    </nav>
  );
};

export default Navbar;