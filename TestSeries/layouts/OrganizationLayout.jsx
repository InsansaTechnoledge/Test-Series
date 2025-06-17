import { BookOpen, Info, LogOut, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { controls } from '../features/afterAuth/data/SiddeBarData';
import Navbar from '../features/afterAuth/components/Navbar/Navbar';
import LogoutModal from '../components/Logout/LogoutModal';

export default function OrganizationLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Debug current location
  useEffect(() => {
    console.log('Current location changed:', location.pathname);
  }, [location.pathname]);

  return (
    <>
      {showLogoutModal && (
        <LogoutModal setShowLogoutModal={setShowLogoutModal} />
      )}

      <div className="flex flex-col h-screen w-screen overflow-hidden">
        {/* Top Navbar */}
        <Navbar />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto pb-24">
          <div className="p-6 md:p-10 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Bottom Navigation - macOS Dock Style */}
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-4">
          <div className="bg-gray-700/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl px-4 py-3">
            <div className="flex items-center space-x-2">
              {/* Main navigation items */}
              {controls.map((control, idx) => {
                const isActive = location.pathname.includes(control.path);
                const isHovered = hoveredIndex === idx;
                
                return (
                  <div
                    key={idx}
                    className="relative"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <button
                      onClick={() => {
                        console.log('Navigating to:', control.path);
                        console.log('Current location:', location.pathname);
                        // Try different navigation approaches
                        if (location.pathname.includes(control.path)) {
                          // Force re-navigation if already on the same path
                          navigate('/', { replace: true });
                          setTimeout(() => navigate(control.path), 0);
                        } else {
                          navigate(control.path);
                        }
                      }}
                      className={`
                        relative flex items-center justify-center rounded-xl transition-all duration-300 ease-out
                        ${isActive 
                          ? 'bg-indigo-600 text-white shadow-lg' 
                          : 'text-gray-600 hover:bg-white/40 hover:text-gray-800'}
                        ${isHovered ? 'scale-110 -translate-y-1' : 'scale-100'}
                      `}
                      style={{
                        width: isHovered ? '60px' : '52px',
                        height: isHovered ? '60px' : '52px',
                      }}
                    >
                      <control.icon 
                        className={`transition-all duration-300 ${
                          isHovered ? 'w-7 h-7' : 'w-6 h-6'
                        }`} 
                      />
                      
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                      )}
                    </button>

                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-90">
                        {control.name}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Separator */}
              <div className="w-px h-8 bg-gray-300/50 mx-1" />

              {/* About Organization */}
              <div
                className="relative"
                onMouseEnter={() => setHoveredIndex('about')}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <button
                  onClick={() => navigate('/institute/institute-landing')}
                  className={`
                    relative flex items-center justify-center rounded-xl transition-all duration-300 ease-out
                    text-gray-600 hover:bg-white/40 hover:text-gray-800
                    ${hoveredIndex === 'about' ? 'scale-110 -translate-y-1' : 'scale-100'}
                  `}
                  style={{
                    width: hoveredIndex === 'about' ? '60px' : '52px',
                    height: hoveredIndex === 'about' ? '60px' : '52px',
                  }}
                >
                  <Info 
                    className={`transition-all duration-300 ${
                      hoveredIndex === 'about' ? 'w-7 h-7' : 'w-6 h-6'
                    }`} 
                  />
                </button>

                {/* Tooltip */}
                {hoveredIndex === 'about' && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-90">
                    About Organization
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900" />
                  </div>
                )}
              </div>

              {/* Settings (optional) */}
              <div
                className="relative"
                onMouseEnter={() => setHoveredIndex('settings')}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <button
                  onClick={() => {/* Add settings navigation */}}
                  className={`
                    relative flex items-center justify-center rounded-xl transition-all duration-300 ease-out
                    text-gray-600 hover:bg-white/40 hover:text-gray-800
                    ${hoveredIndex === 'settings' ? 'scale-110 -translate-y-1' : 'scale-100'}
                  `}
                  style={{
                    width: hoveredIndex === 'settings' ? '60px' : '52px',
                    height: hoveredIndex === 'settings' ? '60px' : '52px',
                  }}
                >
                  <Settings 
                    className={`transition-all duration-300 ${
                      hoveredIndex === 'settings' ? 'w-7 h-7' : 'w-6 h-6'
                    }`} 
                  />
                </button>

                {/* Tooltip */}
                {hoveredIndex === 'settings' && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-90">
                    Settings
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}