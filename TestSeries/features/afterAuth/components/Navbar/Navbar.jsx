import React, { useState } from 'react';
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
  const { user } = useUser();
  const navigate = useNavigate();

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
    }
  };

  const handleFeatureClick = (path) => {
    navigate(`/institute/${path}`);
    setShowMobileMenu(false); 
  };

  return (
    <div className="w-full relative bg-transparent">
      {/* Main Navigation - Single Line */}
      <div className="py-1">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden w-10 h-10 bg-gray-100 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-200 transition-all duration-200 flex-shrink-0"
            >
              {showMobileMenu ? <X className="h-5 w-5 text-gray-800" /> : <Menu className="h-5 w-5 text-gray-800" />}
            </button>

          
           
              <div className="flex items-center space-x-2 sm:space-x-3">

                  <img src={logo} alt="Logo" className="w-40 h-full  rounded-full" />

                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center">
                  {/* <img src={user.logoUrl} alt="Logo" className="w-full h-full rounded-full" /> */}
                </div>
                {/* <span className="text-gray-800 font-semibold text-sm md:text-lg hidden sm:block">{user.name}</span> */}
              </div>
            

            {/* Desktop Categories and Search */}
            {!showDesktopSearch ? (
              // Show Categories
              <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
                {categories.map((category) => {
                  const isActive = activeCategory === category.name;
                  return (
                    <div key={category.name} className="relative">
                      <button
                        onClick={() => handleCategoryClick(category.name)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                          isActive ? 'bg-gray-100 text-gray-800 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                        }`}
                      >
                        <img 
                          src={category.icon} 
                          alt={category.name}  
                          className='h-4 w-4'
                        />
                        <span className="font-medium text-sm whitespace-nowrap">{category.name}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isActive ? 'rotate-180' : ''}`} />
                      </button>
                      {isActive && (
                        <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-[9999]">
                          <div className="py-2">
                            {category.features.map((feature, i) => {
                              const control = controls.find(
                                (control) => control.name === feature
                              );
                              return (
                                <button
                                  key={i}
                                  onClick={() => handleFeatureClick(control.path)}
                                  className="w-full px-4 py-2 text-left text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
                                >
                                  {feature}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              // Show Search Bar
              <div className="hidden lg:flex flex-1 mx-4">
                <div className="relative w-full max-w-2xl mx-auto">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Search features, settings, or content..."
                    autoFocus
                  />
                </div>
              </div>
            )}

            {/* Desktop Search Button */}
            <button
              onClick={toggleDesktopSearch}
              className="hidden lg:flex w-10 h-10 bg-gray-100 rounded-full border border-gray-200 items-center justify-center hover:bg-gray-200 transition-all duration-200 flex-shrink-0"
            >
              {showDesktopSearch ? (
                <X className="h-5 w-5 text-gray-800" />
              ) : (
                <Search className="h-5 w-5 text-gray-800" />
              )}
            </button>

            {/* Mobile Search Button */}
            <button
              onClick={toggleDesktopSearch}
              className="md:lg:hidden w-10 h-10 bg-gray-100 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-200 transition-all duration-200 flex-shrink-0"
            >
              <Search className="h-5 w-5 text-gray-800" />
            </button>

            {/* Profile */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:scale-105 transition-all"
                >
                  <img src={user.logoUrl} alt="User" className="w-full h-full rounded-full" />
                </button>

                {/* Profile Dropdown */}
                {showProfileDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-[9999]">
                    <div className="bg-indigo-800 px-4 py-3 rounded-t-xl">
                      <div className="text-white font-semibold">{user.name}</div>
                      <div className="text-gray-100 text-sm">{user.email}</div>
                    </div>
                    <div className="py-2">
                      <button className="w-full px-4 py-2 text-left text-gray-600 hover:bg-gray-50 transition-colors">Profile Settings</button>
                      <button className="w-full px-4 py-2 text-left text-gray-600 hover:bg-gray-50 transition-colors">Account</button>
                      <button className="w-full px-4 py-2 text-left text-gray-600 hover:bg-gray-50 transition-colors">Preferences</button>
                      <hr className="my-2" />
                      <button onClick={() => setShowLogoutModal(true)} className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-50 transition-colors">Sign Out</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {showDesktopSearch && (
            <div className="lg:hidden mt-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Search features, settings, or content..."
                />
              </div>
            </div>
          )}

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden fixed inset-0 top-[72px] bg-white z-[9999] overflow-y-auto">
              <div className="px-4 py-6">
                <div className="space-y-1">
                  {categories.map((category) => {
                    const isActive = activeCategory === category.name;
                    return (
                      <div key={category.name}>
                        <button
                          onClick={() => handleCategoryClick(category.name)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                            isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <img src={category.icon} alt={category.name} className="w-5 h-5" />
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <ChevronDown className={`h-5 w-5 transition-transform ${isActive ? 'rotate-180' : ''}`} />
                        </button>
                        {isActive && (
                          <div className="mt-2 ml-8 space-y-1">
                            {category.features.map((feature, i) => {
                              const control = controls.find(
                                (control) => control.name === feature
                              );
                              return (
                                <button
                                  key={i}
                                  onClick={() => handleFeatureClick(control.path)}
                                  className="w-full text-left px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-md transition-colors"
                                >
                                  {feature}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;