import React from 'react'

const FallBackPageForOrg = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
     
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
            404 – Page Not Found
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            We do not have this page yet. Please check the URL or go back to the homepage.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-md transition duration-300"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}

export default FallBackPageForOrg


