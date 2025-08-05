import { Info, Settings, Monitor, Smartphone, Tablet, ArrowDownWideNarrow, ArrowDown, ArrowUp } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SideBarDataHook from '../../data/SideBarDataHook';
import dockLight from '../../../../assests/Institute/dockLight.svg'
import dockDark from '../../../../assests/Institute/dockDark.svg'

import { useTheme } from '../../../../hooks/useTheme';
import { useDock } from '../Navbar/context/DockContext';

export default function BottomNavigator({ setShowLogoutModal }) {
  const {isDockToggled} = useDock();


  if (!isDockToggled) return null;

  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showLayoutOptions, setShowLayoutOptions] = useState(false);
  const [layoutPosition, setLayoutPosition] = useState('collapse');
  const [isMobile, setIsMobile] = useState(false);
  const { controls } = SideBarDataHook();
  const {theme} = useTheme();

  

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      const savedLayout = localStorage.getItem('navigationLayout');
      if (savedLayout && ['left', 'right', 'bottom', 'collapse'].includes(savedLayout)) {
        setLayoutPosition(savedLayout);
      }
    }
  }, [isMobile]);

  const handleLayoutChange = (position) => {
    setLayoutPosition(position);
    setShowLayoutOptions(false);
    localStorage.setItem('navigationLayout', position);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLayoutOptions && !event.target.closest('.settings-dropdown')) {
        setShowLayoutOptions(false);
      }
    };

    if (showLayoutOptions) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showLayoutOptions]);

  // Mobile Navigation Component
  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-white border-t border-gray-200 shadow-lg">
        <div className="safe-area-inset-bottom">
          {/* Scrollable Navigation Container */}
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex items-center px-2 py-2 min-w-max">
              {/* Main Navigation Items */}
              {controls.map((control, idx) => {
                const isActive = location.pathname.includes(control.path);
                const isHovered = hoveredIndex === idx;

                return (
                  <div key={idx} className="relative flex-shrink-0 mx-1">
                    <button
                      onTouchStart={() => setHoveredIndex(idx)}
                      onTouchEnd={() => setHoveredIndex(null)}
                      onClick={() => {
                        if (location.pathname.includes(control.path)) {
                          navigate('/', { replace: true });
                          setTimeout(() => navigate(control.path), 0);
                        } else {
                          navigate(control.path);
                        }
                      }}
                      className={`
                        relative flex flex-col items-center justify-center py-2 px-2 rounded-lg
                        transition-all duration-200 ease-out min-h-[60px] w-[60px]
                        ${isActive 
                          ? 'text-blue-600' 
                          : 'text-gray-500 active:bg-gray-100'
                        }
                      `}
                    >
                      <div className={`
                        flex items-center justify-center w-7 h-7 rounded-lg mb-1
                        transition-all duration-200
                        ${isActive 
                          ? 'bg-blue-100 scale-110' 
                          : 'hover:bg-gray-100'
                        }
                      `}>
                        <img 
                          src={isActive || isHovered ? control.activeIcon : control.icon} 
                          alt={control.name} 
                          className="w-4 h-4 transition-all duration-200" 
                        />
                      </div>
                      
                      {/* Label */}
                      <span className={`
                        text-[10px] font-medium leading-tight text-center truncate w-full
                        ${isActive ? 'text-blue-600' : 'text-gray-500'}
                      `}>
                        {control.name.length > 6 ? control.name.substring(0, 6) + '...' : control.name}
                      </span>
                      
                      {/* Active Indicator */}
                      {isActive && (
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                      )}
                    </button>
                  </div>
                );
              })}

              {/* Separator */}
              <div className="flex-shrink-0 w-px h-8 bg-gray-200 mx-2" />

              {/* About Button */}
              <div className="relative flex-shrink-0 mx-1">
                <button
                  onTouchStart={() => setHoveredIndex('about')}
                  onTouchEnd={() => setHoveredIndex(null)}
                  onClick={() => navigate('/institute/institute-landing')}
                  className="
                    flex flex-col items-center justify-center py-2 px-2 rounded-lg
                    text-gray-500 active:bg-gray-100 transition-all duration-200 
                    min-h-[60px] w-[60px]
                  "
                >
                  <div className="flex items-center justify-center w-7 h-7 rounded-lg mb-1 hover:bg-gray-100 transition-all duration-200">
                    <Info className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-medium leading-tight text-center text-gray-500">
                    About
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Scroll Indicator Dots */}
          <div className="flex justify-center pb-1">
            <div className="flex space-x-1">
              {Array.from({ length: Math.ceil((controls.length + 1) / 4) }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-1 h-1 rounded-full bg-gray-300"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Custom styles for hiding scrollbar */}
        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    );
  }

 
  if (layoutPosition === 'collapse') {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-[9999] flex py-6">
        <button
          onClick={() => setLayoutPosition('bottom')}
          className=" text-white rounded-full px-8 py-4 flex items-center space-x-4 transform transition-all duration-500 ease-in-out hover:scale-110 hover:shadow-3xl relative overflow-hidden"
        >   
          <img src={theme === 'light' ? dockLight : dockDark} className= {`w-15 h-15 cursor-pointer hover:translate-[-0.5px] `} alt='dock-img' />
          {/* <span className={`font-semibold ${theme === 'light' ? 'text-gray-600' : 'text-gray-100'}  text-lg tracking-wider transition-all duration-500 transform group-hover:translate-x-3`}>
            Show Menu
          </span> */}
        </button>
      </div>
    );
  }
  
  // Desktop Navigation Component
  const isVertical = layoutPosition === 'left' || layoutPosition === 'right';
  return (
    
    <div>
      <div 
        className={`fixed z-[9999] ${
          layoutPosition === 'bottom' 
            ? 'bottom-4 left-1/2 transform -translate-x-1/2' 
            : layoutPosition === 'left'
            ? 'left-4 top-1/2 transform -translate-y-1/2'
            : 'right-4 top-1/2 transform -translate-y-1/2'
        }`}
      >
        <div className="bg-gray-200 border-3 border-gray-500/50 rounded-2xl shadow-2xl px-4 py-3">
          <div className={`flex ${isVertical ? 'flex-col space-y-2' : 'space-x-2'} items-center`}>
            {/* Main Navigation Items */}
            {controls.map((control, idx) => {
              const isActive = location.pathname.includes(control.path);
              const isHovered = hoveredIndex === idx;

              return (
                <div key={idx} className="relative">
                  <button
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => {
                      if (location.pathname.includes(control.path)) {
                        navigate('/', { replace: true });
                        setTimeout(() => navigate(control.path), 0);
                      } else {
                        navigate(control.path);
                      }
                    }}
                    className={`
                      relative flex items-center justify-center w-12 h-12 rounded-xl
                      transition-all duration-200 ease-out group
                      ${isActive 
                        ? 'bg-blue-400 text-white shadow-lg scale-105' 
                        : 'text-gray-600 hover:bg-blue-400 hover:text-gray-800 hover:scale-105'
                      }
                    `}
                  >
                    <img 
                      src={isActive || isHovered ? control.activeIcon : control.icon} 
                      alt={control.name} 
                      className="w-6 h-6 transition-all duration-200" 
                    />
                    
                    {/* Active Dot */}
                    {isActive && (
                      <div className={`absolute w-2 h-2 bg-white rounded-full ${
                        layoutPosition === 'bottom' 
                          ? '-bottom-1 left-1/2 transform -translate-x-1/2'
                          : layoutPosition === 'left'
                          ? '-right-1 top-1/2 transform -translate-y-1/2'
                          : '-left-1 top-1/2 transform -translate-y-1/2'
                      }`} />
                    )}
                  </button>

                  {/* Tooltip */}
                  {isHovered && (
                    <div className={`
                      absolute z-[10001] px-2 py-1 bg-gray-900 text-white text-xs 
                      rounded-md whitespace-nowrap pointer-events-none
                      ${layoutPosition === 'bottom' 
                        ? 'bottom-full mb-2 left-1/2 transform -translate-x-1/2'
                        : layoutPosition === 'left'
                        ? 'left-full ml-2 top-1/2 transform -translate-y-1/2'
                        : 'right-full mr-2 top-1/2 transform -translate-y-1/2'
                      }
                    `}>
                      {control.name}
                      
                      {/* Tooltip Arrow */}
                      <div className={`absolute ${
                        layoutPosition === 'bottom'
                          ? 'top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900'
                          : layoutPosition === 'left'
                          ? 'right-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900'
                          : 'left-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-900'
                      }`} />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Separator */}
            <div className={`bg-gray-100 ${
              isVertical ? 'h-2px w-8 my-2' : 'w-px h-6 mx-1'
            }`} />

            {/* About Button */}
            <div className="relative">
              <button
                onMouseEnter={() => setHoveredIndex('about')}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => navigate('/institute/institute-landing')}
                className="
                  flex items-center justify-center w-12 h-12 rounded-xl
                  text-gray-600 hover:bg-gray-100 hover:text-gray-800 
                  hover:scale-105 transition-all duration-200
                "
              >
                <Info className="w-6 h-6" />
              </button>

              {/* About Tooltip */}
              {hoveredIndex === 'about' && (
                <div className={`
                  absolute z-[10001] px-2 py-1 bg-gray-900 text-white text-xs 
                  rounded-md whitespace-nowrap pointer-events-none
                  ${layoutPosition === 'bottom' 
                    ? 'bottom-full mb-2 left-1/2 transform -translate-x-1/2'
                    : layoutPosition === 'left'
                    ? 'left-full ml-2 top-1/2 transform -translate-y-1/2'
                    : 'right-full mr-2 top-1/2 transform -translate-y-1/2'
                  }
                `}>
                  About Organization
                  
                  <div className={`absolute ${
                    layoutPosition === 'bottom'
                      ? 'top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900'
                      : layoutPosition === 'left'
                      ? 'right-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900'
                      : 'left-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-900'
                  }`} />
                </div>
              )}
            </div>

            {/* Settings Button */}
            <div className="relative settings-dropdown">
              <button
                onMouseEnter={() => setHoveredIndex('settings')}
                onMouseLeave={() => {
                  if (!showLayoutOptions) setHoveredIndex(null);
                }}
                onClick={() => setShowLayoutOptions(!showLayoutOptions)}
                className={`
                  flex items-center justify-center w-12 h-12 rounded-xl
                  text-gray-600 hover:bg-gray-100 hover:text-gray-800 
                  hover:scale-105 transition-all duration-200
                  ${showLayoutOptions ? 'bg-gray-100 text-gray-800 scale-105' : ''}
                `}
              >
                <Settings className="w-6 h-6" />
              </button>

              {/* Settings Tooltip - only when dropdown is closed */}
              {hoveredIndex === 'settings' && !showLayoutOptions && (
                <div className={`
                  absolute z-[10001] px-2 py-1 bg-gray-900 text-white text-xs 
                  rounded-md whitespace-nowrap pointer-events-none
                  ${layoutPosition === 'bottom' 
                    ? 'bottom-full mb-2 left-1/2 transform -translate-x-1/2'
                    : layoutPosition === 'left'
                    ? 'left-full ml-2 top-1/2 transform -translate-y-1/2'
                    : 'right-full mr-2 top-1/2 transform -translate-y-1/2'
                  }
                `}>
                  Settings
                  
                  <div className={`absolute ${
                    layoutPosition === 'bottom'
                      ? 'top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-white'
                      : layoutPosition === 'left'
                      ? 'right-full top-4 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-white'
                      : 'left-full top-4 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-white'
                  }`} />
                </div>
              )}

              {/* Layout Options Dropdown */}
              {showLayoutOptions && (
                <div className={`
                  absolute z-[10002] bg-white border border-gray-200 rounded-lg shadow-xl p-3 min-w-[180px]
                  ${layoutPosition === 'bottom'
                    ? 'bottom-full mb-2 left-1/2 transform -translate-x-1/2'
                    : layoutPosition === 'left'
                    ? 'left-full ml-2 top-0'
                    : 'right-full mr-2 top-0'
                  }
                `}>
                  <div className="text-xs font-medium text-gray-600 mb-2">Navigation Layout</div>
                  
                  <div className="space-y-1">
                    <button
                      onClick={() => handleLayoutChange('collapse')}
                      className={`
                        w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm
                        transition-colors duration-150
                        ${layoutPosition === 'collapse' 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                          : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      <ArrowDown className="w-4 h-4" />
                      <span>Collapse bar</span>
                    </button>

                    <button
                      onClick={() => handleLayoutChange('bottom')}
                      className={`
                        w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm
                        transition-colors duration-150
                        ${layoutPosition === 'bottom' 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                          : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Bottom Bar</span>
                    </button>
                    
                    <button
                      onClick={() => handleLayoutChange('left')}
                      className={`
                        w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm
                        transition-colors duration-150
                        ${layoutPosition === 'left' 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                          : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      <Monitor className="w-4 h-4" />
                      <span>Left Sidebar</span>
                    </button>
                    
                    <button
                      onClick={() => handleLayoutChange('right')}
                      className={`
                        w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm
                        transition-colors duration-150
                        ${layoutPosition === 'right' 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                          : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      <Tablet className="w-4 h-4" />
                      <span>Right Sidebar</span>
                    </button>
                  </div>

                  {/* Dropdown Arrow */}
                  <div className={`absolute ${
                    layoutPosition === 'bottom'
                      ? 'top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-white'
                      : layoutPosition === 'left'
                      ? 'right-full top-4 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-white'
                      : 'left-full top-4 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-white'
                  }`} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
