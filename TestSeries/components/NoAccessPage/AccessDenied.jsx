import React from 'react'
import { useUser } from '../../contexts/currentUserContext';
import { useTheme } from '../../hooks/useTheme';

const AccessDenied = () => {
  const { user } = useUser();

  const isOrg = user?.role === 'organization';
  const {theme} = useTheme()

  return (
    <div className={`w-full h-screen flex flex-col items-center justify-center text-center px-6 transition-all duration-500 ${
      theme === 'light'
        ? 'bg-gradient-to-br from-slate-50 via-white to-blue-50'
        : 'bg-gradient-to-br from-gray-950 via-gray-900 to-slate-950'
    }`}>
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="space-y-4">
          <h1 className={`text-4xl font-bold tracking-tight ${
            theme === 'light' ? 'text-gray-800' : 'text-gray-100'
          }`}>
            Access Denied
          </h1>
          <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full"></div>
        </div>
    
        <div className={`space-y-6 ${
          theme === 'light' ? 'text-gray-600' : 'text-gray-300'
        }`}>
          {isOrg ? (
            <>
              <p className="text-lg leading-relaxed">
                Your organization has not been approved yet. Please contact the admin.
              </p>
              <div className={`border rounded-lg p-4 ${
                theme === 'light' 
                  ? 'bg-indigo-50 border-indigo-100' 
                  : 'bg-indigo-950 border-indigo-800'
              }`}>
                <p className={`font-medium ${
                  theme === 'light' ? 'text-indigo-700' : 'text-indigo-300'
                }`}>
                  This usually takes up to 24 hours.
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="text-lg leading-relaxed">
                You don't have access to this page. To operate on this page, please request permission from your admin.
              </p>
              <div className={`border rounded-lg p-4 ${
                theme === 'light' 
                  ? 'bg-red-50 border-red-100' 
                  : 'bg-red-950 border-red-800'
              }`}>
                <p className={`font-medium ${
                  theme === 'light' ? 'text-red-700' : 'text-red-300'
                }`}>
                  Access to this page requires additional privileges.
                </p>
              </div>
            </>
          )}
        </div>
    
        <div className={`space-y-4 pt-6 border-t ${
          theme === 'light' ? 'border-gray-200' : 'border-gray-700'
        }`}>
          <p className={`text-sm font-medium ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            Need help? Reach out to us:
          </p>
          <div className="space-y-2">
            <a
              href="mailto:queries@insansa.com"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors duration-200 font-medium"
            >
              queries@insansa.com
            </a>
          </div>
        </div>
      </div>
    
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
    
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );


}

export default AccessDenied