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

  // Load saved layout preference on mount
  useEffect(() => {
    const savedLayout = localStorage.getItem('navigationLayout');
    if (savedLayout && ['left', 'right', 'bottom'].includes(savedLayout)) {
      setLayoutPosition(savedLayout);
    }
  }, []);

  const handleLayoutChange = (position) => {
    setLayoutPosition(position);
    setShowLayoutOptions(false);
    
    // Save preference to localStorage
    localStorage.setItem('navigationLayout', position);
  };

  // Close settings when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLayoutOptions && !event.target.closest('.settings-container')) {
        setShowLayoutOptions(false);
      }
    };

    if (showLayoutOptions) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showLayoutOptions]);

  const getNavigatorClasses = () => {
    switch (layoutPosition) {
      case 'left':
        return "fixed left-0 top-1/2 transform -translate-y-1/2 z-50 pl-4";
      case 'right':
        return "fixed right-0 top-1/2 transform -translate-y-1/2 z-50 pr-4";
      case 'bottom':
      default:
        return "fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-4";
    }
  };

  const getContainerClasses = () => {
    const baseClasses = "bg-gray-700/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl";
    
    switch (layoutPosition) {
      case 'left':
      case 'right':
        return `${baseClasses} px-3 py-4 max-h-96 overflow-y-auto`; 
      case 'bottom':
      default:
        return `${baseClasses} px-4 py-3`;
    }
  };

  const getFlexClasses = () => {
    switch (layoutPosition) {
      case 'left':
      case 'right':
        return "flex flex-col items-center space-y-3";
      case 'bottom':
      default:
        return "flex items-center space-x-2";
    }
  };

  const getSeparatorClasses = () => {
    switch (layoutPosition) {
      case 'left':
      case 'right':
        return "h-px w-8 bg-gray-300/50 my-2";
      case 'bottom':
      default:
        return "w-px h-8 bg-gray-300/50 mx-1";
    }
  };

  const getLayoutOptionsPosition = () => {
    switch (layoutPosition) {
      case 'left':
        // When nav is on left, dropdown appears on right
        return "absolute left-full top-0 ml-4 min-w-max";
      case 'right':
        // When nav is on right, dropdown appears on left  
        return "absolute right-full top-0 mr-4 min-w-max";
      case 'bottom':
      default:
        return "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 min-w-max";
    }
  };

  // Fixed tooltip positioning - tooltips appear on opposite side of nav
  const getTooltipPosition = (isSettings = false) => {
    switch (layoutPosition) {
      case 'left':
        // Nav on left, tooltip on right
        return 'left-full top-1/2 transform -translate-y-1/2 ml-3';
      case 'right':
        // Nav on right, tooltip on left
        return 'right-full top-1/2 transform -translate-y-1/2 mr-3';
      case 'bottom':
      default:
        // Nav on bottom, tooltip above
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  // Arrow positioning - arrows point towards the nav button
  const getTooltipArrow = (isSettings = false) => {
    switch (layoutPosition) {
      case 'left':
        // Tooltip is on right, arrow points left towards nav
        return 'top-1/2 left-0 transform -translate-y-1/2 -translate-x-full w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-900';
      case 'right':
        // Tooltip is on left, arrow points right towards nav
        return 'top-1/2 right-0 transform -translate-y-1/2 translate-x-full w-0 h-0 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-gray-900';
      case 'bottom':
      default:
        // Tooltip is above, arrow points down towards nav
        return 'top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900';
    }
  };

  const getDropdownArrow = () => {
    switch (layoutPosition) {
      case 'left':
        // Dropdown is on right, arrow points left towards nav
        return 'top-4 left-0 transform -translate-x-full w-0 h-0 border-t-6 border-b-6 border-r-6 border-t-transparent border-b-transparent border-r-gray-900';
      case 'right':
        // Dropdown is on left, arrow points right towards nav
        return 'top-4 right-0 transform translate-x-full w-0 h-0 border-t-6 border-b-6 border-l-6 border-t-transparent border-b-transparent border-l-gray-900';
      case 'bottom':
      default:
        // Dropdown is above, arrow points down towards nav
        return 'top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-gray-900';
    }
  };

  return (
    <div className={getNavigatorClasses()}>
      <div className={getContainerClasses()}>
        <div className={getFlexClasses()}>
          {/* Main navigation items */}
          {controls.map((control, idx) => {
  const isActive = location.pathname.includes(control.path); // Check if the control is active
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
                if (location.pathname.includes(control.path)) {
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
                ${isHovered ? 'scale-110' : 'scale-100'}
                ${layoutPosition === 'left' || layoutPosition === 'right' ? 
                    (isHovered ? (layoutPosition === 'left' ? 'translate-x-1' : '-translate-x-1') : '') : 
                    (isHovered ? '-translate-y-1' : '')}
                `}
                style={{
                width: isHovered ? '60px' : '52px',
                height: isHovered ? '60px' : '52px',
                }}
            >
                {/* Conditionally render icon or activeIcon */}
                <img 
                src={isActive || isHovered ? control.activeIcon : control.icon} 
                alt={control.name} 
                className={`transition-all duration-300 ${
                    isHovered ? 'w-7 h-7' : 'w-6 h-6'
                }`} 
                />

                {isActive && (
                <div className={`absolute bg-white rounded-full ${
                    layoutPosition === 'left' 
                    ? '-right-1 top-1/2 transform -translate-y-1/2 w-1 h-1'
                    : layoutPosition === 'right'
                    ? '-left-1 top-1/2 transform -translate-y-1/2 w-1 h-1'
                    : '-bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1'
                }`} />
                )}
            </button>

            {isHovered && (
                <div className={`absolute px-3 py-2 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-95 z-[60] ${getTooltipPosition()}`}>
                {control.name}
                <div className={`absolute ${getTooltipArrow()}`} />
                </div>
            )}
            </div>
        );
        })}

          {/* Separator */}
          <div className={getSeparatorClasses()} />

          {/* About Organization */}
          <NavIcon
            icon={Info}
            label="About Organization"
            hovered={hoveredIndex === 'about'}
            onMouseEnter={() => setHoveredIndex('about')}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => navigate('/institute/institute-landing')}
            layoutPosition={layoutPosition}
            getTooltipPosition={getTooltipPosition}
            getTooltipArrow={getTooltipArrow}
          />

          {/* Settings with Layout Options */}
          <div
            className="relative settings-container"
            onMouseEnter={() => setHoveredIndex('settings')}
            onMouseLeave={() => {
              if (!showLayoutOptions) {
                setHoveredIndex(null);
              }
            }}
          >
            <button
              onClick={() => setShowLayoutOptions(!showLayoutOptions)}
              className={`
                relative flex items-center justify-center rounded-xl transition-all duration-300 ease-out
                text-gray-600 hover:bg-white/40 hover:text-gray-800
                ${hoveredIndex === 'settings' ? 'scale-110' : 'scale-100'}
                ${layoutPosition === 'left' || layoutPosition === 'right' ? 
                  (hoveredIndex === 'settings' ? (layoutPosition === 'left' ? 'translate-x-1' : '-translate-x-1') : '') : 
                  (hoveredIndex === 'settings' ? '-translate-y-1' : '')}
                ${showLayoutOptions ? 'bg-white/40 text-gray-800' : ''}
              `}
              style={{
                width: hoveredIndex === 'settings' ? '60px' : '52px',
                height: hoveredIndex === 'settings' ? '60px' : '52px',
              }}
            >
              <Settings className={`transition-all duration-300 ${
                hoveredIndex === 'settings' ? 'w-7 h-7' : 'w-6 h-6'
              }`} />
            </button>

            {/* Settings Tooltip - only show when not showing layout options */}
            {hoveredIndex === 'settings' && !showLayoutOptions && (
              <div className={`absolute px-3 py-2 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-95 z-[60] ${getTooltipPosition(true)}`}>
                Settings
                <div className={`absolute ${getTooltipArrow(true)}`} />
              </div>
            )}

            {/* Layout Options Dropdown */}
            {showLayoutOptions && (
              <div className={`${getLayoutOptionsPosition()} bg-gray-900 text-white rounded-lg shadow-xl p-4 whitespace-nowrap opacity-95 transition-all duration-200 z-[70]`}>
                <div className="text-xs font-medium mb-3 px-1 text-gray-300">Navigation Layout</div>
                <div className="flex flex-col space-y-2 min-w-[160px]">
                  <button
                    onClick={() => handleLayoutChange('bottom')}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors ${
                      layoutPosition === 'bottom' 
                        ? 'bg-indigo-600 text-white shadow-sm' 
                        : 'hover:bg-gray-700 text-gray-300 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 flex-shrink-0" />
                    <span>Bottom Bar</span>
                  </button>
                  <button
                    onClick={() => handleLayoutChange('left')}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors ${
                      layoutPosition === 'left' 
                        ? 'bg-indigo-600 text-white shadow-sm' 
                        : 'hover:bg-gray-700 text-gray-300 hover:text-white'
                    }`}
                  >
                    <Monitor className="w-4 h-4 flex-shrink-0" />
                    <span>Left Sidebar</span>
                  </button>
                  <button
                    onClick={() => handleLayoutChange('right')}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors ${
                      layoutPosition === 'right' 
                        ? 'bg-indigo-600 text-white shadow-sm' 
                        : 'hover:bg-gray-700 text-gray-300 hover:text-white'
                    }`}
                  >
                    <Tablet className="w-4 h-4 flex-shrink-0" />
                    <span>Right Sidebar</span>
                  </button>
                </div>
                
                {/* Dropdown arrow */}
                <div className={`absolute ${getDropdownArrow()}`} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NavIcon({ icon: Icon, label, hovered, onMouseEnter, onMouseLeave, onClick, layoutPosition, getTooltipPosition, getTooltipArrow }) {
  return (
    <div
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        onClick={onClick}
        className={`
          relative flex items-center justify-center rounded-xl transition-all duration-300 ease-out
          text-gray-600 hover:bg-white/40 hover:text-gray-800
          ${hovered ? 'scale-110' : 'scale-100'}
          ${layoutPosition === 'left' || layoutPosition === 'right' ? 
            (hovered ? (layoutPosition === 'left' ? 'translate-x-1' : '-translate-x-1') : '') : 
            (hovered ? '-translate-y-1' : '')}
        `}
        style={{
          width: hovered ? '60px' : '52px',
          height: hovered ? '60px' : '52px',
        }}
      >
        <Icon className={`transition-all duration-300 ${hovered ? 'w-7 h-7' : 'w-6 h-6'}`} />
      </button>

      {hovered && (
        <div className={`absolute px-3 py-2 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-95 z-[60] ${getTooltipPosition()}`}>
          {label}
          <div className={`absolute ${getTooltipArrow()}`} />
        </div>
      )}
    </div>
  );
}