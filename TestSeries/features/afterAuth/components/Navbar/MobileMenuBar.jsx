// MobileMenuBar.js
import React from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EpicThemeSlider from './ThemeSlide';
import SearchResults from './SearchResults';

const MobileMenuBar = ({
  showMobileMenu,
  categories,
  activeCategory,
  controls,
  themeClasses,
  user,
  searchQuery,
  handleSearchKeyDown,
  setSearchQuery,
  setShowSearchResults,
  theme,
  handleTheme,
  showSearchResults,
  searchResultsRef,
  selectedResultIndex,
  handleResultClick,
  searchResults
}) => {
  const navigate = useNavigate();

  return (
    showMobileMenu && (
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {/* Search bar */}
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

          {/* Category buttons */}
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

          {/* Profile & Theme */}
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

            <div className="px-3 py-2">
              <div className="flex items-center justify-between">
                <span className={`text-base font-medium ${themeClasses.textPrimary}`}>
                  Theme
                </span>
                <EpicThemeSlider theme={theme} onToggle={handleTheme} />
              </div>
            </div>

            {/* Conditional role-based button */}
            {user?.role === 'organization' && (
              <button
                onClick={() => {
                  navigate('/institute-subscription');
                  setShowMobileMenu(false);
                  setActiveCategory(''); // Close categories dropdown
                }}
                className={`block w-full text-left px-3 py-2 text-base font-medium rounded-md ${themeClasses.dropdownItem}`}
              >
                Know Your Plan
              </button>
            )}

            {(user?.role === 'user' || user?.role === 'student') && (
              <button
                onClick={() => {
                  if (user?._id) {
                    navigate(`/edit-profile/${user._id}`);
                    setShowMobileMenu(false);
                    setActiveCategory(''); // Close categories dropdown
                  }
                }}
                className={`block w-full text-left px-3 py-2 text-base font-medium rounded-md ${themeClasses.dropdownItem}`}
              >
                Edit Profile
              </button>
            )}

            <button
              onClick={() => {
                setShowLogoutModal(true);
                setShowMobileMenu(false);
                setActiveCategory(''); // Close categories dropdown
              }}
              className={`block w-full text-left px-3 py-2 text-base font-medium rounded-md ${themeClasses.dropdownItem}`}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default MobileMenuBar;
