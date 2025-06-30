import React from 'react'
import { useUser } from '../../contexts/currentUserContext';

const AccessDenied = () => {
  const { user } = useUser();

  const isOrg = user?.role === 'organization';

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
            Access Denied
          </h1>
          <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full"></div>
        </div>

        <div className="space-y-6 text-gray-600">
          {isOrg ? (
            <>
              <p className="text-lg leading-relaxed">
                Your organization has not been approved yet. Please contact the admin.
              </p>
              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                <p className="text-indigo-700 font-medium">
                  This usually takes up to 24 hours.
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="text-lg leading-relaxed">
                You don’t have access to this page. To operate on this page, please request permission from your admin.
              </p>
              <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                <p className="text-red-700 font-medium">
                  Access to this page requires additional privileges.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="space-y-4 pt-6 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700">
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