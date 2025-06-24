import React from 'react'
import { useUser } from '../../../../../../contexts/currentUserContext'

const YourPlanPage = () => {
  const { user } = useUser();
  
  if (!user) return <div className="p-6">Loading...</div>;

  const features = user.planFeatures || {};
  const subscription = user.subscription || {};
  
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Current Plan</h1>
        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            subscription.status === 'trialing' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
          }`}>
            {subscription.status === 'trialing' ? 'Trial Period' : 'Active'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{user.totalStudents || 0}</div>
          <div className="text-sm text-gray-600">Students</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{user.totalBatches || 0}</div>
          <div className="text-sm text-gray-600">Batches</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{user.totalExams || 0}</div>
          <div className="text-sm text-gray-600">Exams</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{user.totalUsers || 0}</div>
          <div className="text-sm text-gray-600">Users</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Plan Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(features).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700 capitalize">
                {key.replace('_', ' ').replace('feature', '')}
              </span>
              <span className="text-green-600 font-medium">✓ Enabled</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Organization Details</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Organization:</span>
            <span className="font-medium">{user.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Phone:</span>
            <span className="font-medium">{user.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Location:</span>
            <span className="font-medium">{user.address?.city}, {user.address?.state}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default YourPlanPage