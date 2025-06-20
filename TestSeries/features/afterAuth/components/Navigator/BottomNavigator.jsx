import { Info, Settings, Monitor, Smartphone, Tablet } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { controls } from '../../data/SiddeBarData';

export default function BottomNavigator({ setShowLogoutModal }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showLayoutOptions, setShowLayoutOptions] = useState(false);
  const [layoutPosition, setLayoutPosition] = useState('bottom');

  useEffect(() => {
    const savedLayout = localStorage.getItem('navigationLayout');
    if (savedLayout && ['left', 'right', 'bottom'].includes(savedLayout)) {
      setLayoutPosition(savedLayout);
    }
  }, []);

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

  const isVertical = layoutPosition === 'left' || layoutPosition === 'right';

  return (
    <div 
      className={`fixed z-[9999] ${
        layoutPosition === 'bottom' 
          ? 'bottom-4 left-1/2 transform -translate-x-1/2' 
          : layoutPosition === 'left'
          ? 'left-4 top-1/2 transform -translate-y-1/2'
          : 'right-4 top-1/2 transform -translate-y-1/2'
      }`}
    >
      <div className="bg-gray-300 border-3 border-gray-500/50 rounded-2xl shadow-2xl px-4 py-3">
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
                    ? 'top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900'
                    : layoutPosition === 'left'
                    ? 'right-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900'
                    : 'left-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-900'
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
  );
}