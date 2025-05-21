import { BookOpen, Info, LogOut, ChevronRight, ChevronLeft, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { controls } from '../features/afterAuth/data/SiddeBarData';
import { Lock, LockOpen } from 'lucide-react';
import Navbar from '../features/afterAuth/components/Navbar/Navbar';
import LogoutModal from '../components/Logout/LogoutModal';

export default function OrganizationLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPinned, setIsPinned] = useState(() => {
    // Load pinned state from localStorage if available
    const savedState = localStorage.getItem('sidebarPinned');
    return savedState ? JSON.parse(savedState) : false;
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Save pinned state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sidebarPinned', JSON.stringify(isPinned));
  }, [isPinned]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  // Determine if text labels should be visible
  const showLabels = isPinned || isMobile || isHovering;

  return (
    <>
      {
        showLogoutModal
          ?
          <LogoutModal setShowLogoutModal={setShowLogoutModal} />
          :
          null
      }

      <div className="flex h-screen w-screen overflow-hidden">

        {/* Mobile Overlay */}
        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-10"
            onClick={toggleMobileSidebar}
          />
        )}


        {/* Sidebar */}
        <aside
          className={`
            h-full bg-indigo-950 transition-all duration-300 ease-in-out z-20
            flex flex-col justify-between shadow-lg
            ${isMobile
              ? `fixed ${isSidebarOpen ? 'left-0' : '-left-64'} w-64`
              : `${isPinned || isHovering ? 'w-64' : 'w-20'}`
            }
        `}
          onMouseEnter={() => !isMobile && !isPinned && setIsHovering(true)}
          onMouseLeave={() => !isMobile && !isPinned && setIsHovering(false)}
        >

          {/* Toggle Pin Button (desktop only) */}
          {!isMobile && (isPinned || isHovering) && (
            <div className='relative'>
              <button
                className="absolute right-2 top-3 text-white bg-blue-900/50 rounded-full p-2 w-10 h-10 flex items-center justify-center"
                onClick={() => setIsPinned(!isPinned)}
              >
                {isPinned ? <Lock size={20} /> : <LockOpen size={20} />}
              </button>
            </div>
          )}

          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center p-4 border-b border-indigo-900">
              <BookOpen className="text-white w-8 h-8 flex-shrink-0" />
              <div className={`ml-2 text-white font-bold text-lg transition-opacity duration-200 ${showLabels ? 'opacity-100' : 'opacity-0'} overflow-hidden`} style={{ width: showLabels ? 'auto' : 0 }}>
                Test-Series
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-grow py-4 px-2 overflow-y-auto">
              <div className="space-y-1">
                {controls.map((control, idx) => {
                  const isActive = location.pathname.includes(control.path);
                  return (
                    <button
                      key={idx}
                      onClick={() => navigate(control.path)}
                      className={`
                      flex items-center w-full p-3 rounded-lg transition-all duration-200
                      ${isActive
                          ? 'bg-indigo-100/20 text-white font-medium'
                          : 'text-gray-300 hover:bg-indigo-800 hover:text-white'}
                    `}
                    >
                      <div className="w-6 flex-shrink-0 flex justify-center">
                        <control.icon className={`w-6 h-6 ${isActive ? 'text-indigo-300' : ''}`} />
                      </div>

                      {/* Label container with fixed width that changes opacity */}
                      <div className={`
                      ml-3 overflow-hidden transition-all duration-200
                      ${showLabels ? 'w-40' : 'w-0'}
                    `}>
                        <span className="whitespace-nowrap">{control.name}</span>
                      </div>

                      {/* Active indicator */}
                      {isActive && (
                        <div className={`
                        ml-auto h-2 w-2 rounded-full bg-indigo-400 transition-opacity duration-200
                        ${showLabels ? 'opacity-100' : 'opacity-0'}
                      `} />
                      )}
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Footer Actions */}
            <div className="p-2 border-t border-indigo-900">
            
              {/* About Organization Button */}
              <button onClick={() => {navigate('/institute/institute-landing')}} className="flex items-center w-full text-gray-300 p-3 hover:bg-indigo-800 hover:text-white rounded-lg transition-colors duration-200">
                <div className="w-6 flex-shrink-0 flex justify-center">
                  <Info className="w-6 h-6" />
                </div>
                <div className={`
                ml-3 overflow-hidden transition-all duration-200
                ${showLabels ? 'w-40' : 'w-0'}
              `}>
                  <span className="whitespace-nowrap">About Organization</span>
                </div>
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className='flex flex-col flex-1'>

          <Navbar />
          <main className="flex-1 flex-col overflow-y-auto relative">
            {/* Mobile menu toggle button */}
            {isMobile && (
              <button
                onClick={toggleMobileSidebar}
                className="fixed top-4 left-4 z-30 bg-indigo-950 text-white p-2 rounded-lg shadow-md"
              >
                {isSidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
              </button>
            )}

            <div className="mt-12 p-6 md:p-10 max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>

      </div>

    </>

  );
}