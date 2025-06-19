import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/currentUserContext";
import { useEffect, useState } from "react";
import { usePageAccess } from "../contexts/PageAccessContext";

const InstituteRoutes = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const [isAccessDenied, setIsAccessDenied] = useState(false);
    const [showBar, setShowBar] = useState(false);
    const canAccessPage = usePageAccess();

    useEffect(() => {
        if (!user || user.role === 'student') {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (canAccessPage === false) {
            if (location.pathname === '/institute/institute-landing') {
                setIsAccessDenied(false);
                setShowBar(false);
            } else {
                setIsAccessDenied(true);
                setShowBar(true);
            }
        } else if (canAccessPage === true) {
            setIsAccessDenied(false);
            setShowBar(false);
        }
        // Don't change state if canAccessPage is undefined/loading
    }, [canAccessPage, location.pathname]);
    
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600 font-medium">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 relative">
          {/* Access Denied Notification Bar */}
          {showBar && (
            <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 border-b border-orange-200/60 shadow-lg relative z-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between py-4">
                  {/* Icon and message */}
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-5 h-5 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="absolute inset-0 w-10 h-10 rounded-full border-2 border-orange-400 animate-ping opacity-20"></div>
                      </div>
                    </div>
    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900">Access Restricted</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                          Plan Limitation
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">
                        Your current subscription doesn't include access to this feature.
                        <span className="font-medium text-gray-900"> Upgrade your plan</span> or
                        <span className="font-medium text-gray-900"> contact our support team</span> for assistance.
                      </p>
                    </div>
                  </div>
    
                  {/* Action buttons */}
                  <div className="flex items-center space-x-3 ml-4">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Upgrade Plan
                    </button>
    
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Contact Support
                    </button>
    
                    <button
                      onClick={() => setShowBar(false)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
    
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent"></div>
            </div>
          )}
    
          {/* Main Page Content */}
          <div className={`relative z-10 transition-all duration-300 ${showBar ? 'pt-0' : ''}`}>
            <Outlet />
          </div>
    
          {/* Optional: overlay for blocked content */}
          {isAccessDenied && location.pathname !== '/institute/institute-landing' && (
            <div className="fixed inset-0 bg-gray-900/5 z-10 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/30"></div>
            </div>
          )}
        </div>
      );
};

export default InstituteRoutes;