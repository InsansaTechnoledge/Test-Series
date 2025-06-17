import React, { useState } from 'react';
import { Search, Settings, ChevronDown, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { categories } from '../../data/SiddeBarData';
import { controls } from '../../data/SiddeBarData'; // Assuming controls is imported from the correct path
import { useUser } from '../../../../contexts/currentUserContext';

const Navbar = ({setShowLogoutModal}) => {
  const [activeCategory, setActiveCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate(); // Initialize the navigate function

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(activeCategory === categoryName ? '' : categoryName);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    setActiveCategory('');
  };

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  const handleFeatureClick = (path) => {
    // Navigate to the selected feature path
    navigate(`/institute/${path}`);
    setShowMobileMenu(false); 
  };

  return (
    <div className="w-full relative">
      {/* Main Navigation */}
      <div className="bg-indigo-600 py-1">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-200"
            >
              {showMobileMenu ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
            </button>

            {/* Logo Pill */}
            <div className="bg-indigo-800 rounded-full px-3 sm:px-6 py-2 border border-white/20">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="sm:h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                  <img src={user.logoUrl} alt="Logo" className="w-full h-full rounded-full" />
                </div>
                <span className="text-white font-semibold text-sm md:text-lg xs:hidden">{user.name}</span>
              </div>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-300" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-indigo-500 border border-indigo-800/20 rounded-full text-gray-100 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="Search features, settings, or content..."
                />
              </div>
            </div>

            {/* Mobile Search Button */}
            <button
              onClick={toggleMobileSearch}
              className="md:hidden w-10 h-10 bg-white/10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-200"
            >
              <Search className="h-5 w-5 text-gray-600" />
            </button>

            {/* Profile & Settings */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-800 rounded-full border border-white/20 flex items-center justify-center hover:bg-indigo-900">
                <Settings className="h-5 w-5 text-white hover:rotate-90 transition-transform" />
              </button>

              {/* Profile */}
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
                    <div className="bg-indigo-800 px-4 py-3">
                      <div className="text-white font-semibold">{user.name}</div>
                      <div className="text-gray-100 text-sm">{user.email}</div>
                    </div>
                    <div className="py-2">
                      <button className="w-full px-4 py-2 text-left text-gray-600 hover:bg-gray-50">Profile Settings</button>
                      <button className="w-full px-4 py-2 text-left text-gray-600 hover:bg-gray-50">Account</button>
                      <button className="w-full px-4 py-2 text-left text-gray-600 hover:bg-gray-50">Preferences</button>
                      <hr className="my-2" />
                      <button onClick={() => setShowLogoutModal(true)} className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-50">Sign Out</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Categories Desktop */}
          <div className="hidden md:block mt-4 ">
            <div className="w-full flex justify-center px-6">
              <div className="max-w-4xl bg-gray-50 px-4 py-3 rounded-2xl">
                <div className="flex items-center justify-center space-x-1">
                  {categories.map((category) => {
                    
                    const isActive = activeCategory === category.name;
                    return (
                      <div key={category.name} className="relative">
                        <button
                          onClick={() => handleCategoryClick(category.name)}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                            isActive ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                         <img 
                src={ category.icon} 
                alt={category.name}  className='h-4 w-4'></img>
                          <span className="font-medium text-sm">{category.name}</span>
                          <ChevronDown className={`h-4 w-4 transition-transform ${isActive ? 'rotate-180' : ''}`} />
                        </button>
                        {isActive && (
                          <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-[9999]">
                            <div className="py-2">
                              {category.features.map((feature, i) => {
                                const control = controls.find(
                                  (control) => control.name === feature
                                ); // Find the control that matches the feature
                                return (
                                  <button
                                    key={i}
                                    onClick={() => handleFeatureClick(control.path)} // Navigate to the path
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
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden fixed inset-0 top-[72px] bg-white z-[9999] overflow-y-auto">
              <div className="px-4 py-6">
                <div className="space-y-1">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    {
                      typeof Icon === 'string' ? (
                        <img src={category.icon} alt={category.name} className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )
                    }
                    const isActive = activeCategory === category.name;
                    return (
                      <div key={category.name}>
                        <button
                          onClick={() => handleCategoryClick(category.name)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg ${
                            isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Icon className="h-5 w-5" />
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
                                  className="w-full text-left px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-md"
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
