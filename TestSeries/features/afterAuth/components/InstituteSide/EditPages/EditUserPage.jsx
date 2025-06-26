import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useCachedUser } from '../../../../../hooks/useCachedUser';
import { useCachedRoleGroup } from '../../../../../hooks/useCachedRoleGroup';
import { useCachedBatches } from '../../../../../hooks/useCachedBatches';
import { UpdateUser } from '../../../../../utils/services/userService';
import BackButton from '../../../../constants/BackButton';
import { useTheme } from '../../../../../hooks/useTheme';

const EditUserPage = () => {
  const { id } = useParams();
  const { userMap, isLoading, isError } = useCachedUser();
  const { roleGroups, roleMap } = useCachedRoleGroup();
  const { batches, batchMap } = useCachedBatches();
  const userData = userMap?.[id];
  const [name, setName] = useState(userData?.name || '');
  const [email, setEmail] = useState(userData?.email || '');
  const [userId, setUserId] = useState(userData?.userId || '');
  const [gender, setGender] = useState(userData?.gender || '');
  const [role, setRole] = useState(userData?.roleId || '');
  const [batchArray, setBatchArray] = useState(userData?.batch || []);

  const roleGroupsList = roleGroups.map(r => (
    <option key={r._id} value={r._id}>
      {r.name}
    </option>
  ));

  const handleBatchChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setBatchArray(selectedOptions);
  };

  const currRoleGroup = roleMap[userData?.roleId]?.name || "No role assigned";

  const {theme } = useTheme();

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedUserData = {
      name,
      email,
      gender,
      roleId: role,
      batch: batchArray
    };

    try {
      const response = await UpdateUser({
        userId: id,
        Data: updatedUserData
      });

      alert("User updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    }
  };

  if (isLoading || !userData) return (
    <div className={`flex items-center justify-center min-h-screen ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
      <div className={`animate-spin rounded-full h-16 w-16 border-b-2 ${theme === 'light' ? 'border-blue-500' : 'border-blue-400'}`}></div>
    </div>
  );
  if (isError) return (
    <div className={`flex items-center justify-center min-h-screen ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
      <div className={`text-lg ${theme === 'light' ? 'text-red-500' : 'text-red-400'}`}>Error loading user data</div>
    </div>
  );



  return (
          <>
      {userData && (

        <div className={`min-h-screen`}>
          <BackButton />
          <div className="min-h-screen p-6">

            <div className="max-w-2xl mx-auto">
              <div className={`rounded-2xl shadow-xl p-1 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                {/* Header */}
                <div className={`text-center mb-8 py-5 ${theme === 'light' ? 'bg-gradient-to-r from-indigo-600 to-gray-600' : 'bg-gradient-to-r from-indigo-700 to-gray-800'} text-white relative overflow-hidden rounded-t-2xl`}>
                  <h1 className="text-3xl font-bold text-white mb-2">Edit User</h1>
                  {/* <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full"></div> */}
                </div>

                <form className="space-y-6 p-4" onSubmit={handleSubmit}>
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label className={`block text-sm font-semibold uppercase tracking-wide ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      User's Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter user's name here"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full p-4 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                        theme === 'light' 
                          ? 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 group-hover:border-blue-300' 
                          : 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-900 group-hover:border-blue-400'
                      }`}
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className={`block text-sm font-semibold uppercase tracking-wide ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      User's Email
                    </label>
                    <input
                      type="email"
                      placeholder="Enter user's email here"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full p-4 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                        theme === 'light' 
                          ? 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 group-hover:border-blue-300' 
                          : 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-900 group-hover:border-blue-400'
                      }`}
                    />
                  </div>

                  {/* User ID Field */}
                  <div className="space-y-2">
                    <label className={`block text-sm font-semibold uppercase tracking-wide ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Organization ID
                    </label>
                    <input
                      type="text"
                      placeholder="Enter organization ID"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      className={`w-full p-4 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                        theme === 'light' 
                          ? 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 group-hover:border-blue-300' 
                          : 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-900 group-hover:border-blue-400'
                      }`}
                    />
                  </div>

                  {/* Gender Field */}
                  <div className="space-y-2">
                    <label className={`block text-sm font-semibold uppercase tracking-wide ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Select Gender
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className={`w-full p-4 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                        theme === 'light' 
                          ? 'bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 group-hover:border-blue-300' 
                          : 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-4 focus:ring-blue-900 group-hover:border-blue-400'
                      }`}
                    >
                      <option value={gender} className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>{gender}</option>
                      {gender !== 'Male' && <option value="Male">Male</option>}
                      {gender !== 'Female' && <option value="Female">Female</option>}
                    </select>
                  </div>

                  {/* Role Field */}
                  <div className="space-y-2">
                    <label className={`block text-sm font-semibold uppercase tracking-wide ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Role Group
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className={`w-full p-4 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                        theme === 'light' 
                          ? 'bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 group-hover:border-blue-300' 
                          : 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-4 focus:ring-blue-900 group-hover:border-blue-400'
                      }`}
                    >
                      <option value="" disabled className={theme === 'light' ? 'text-gray-700' : 'text-gray-400'}>Select a Role</option>
                      {roleGroupsList}
                    </select>
                  </div>

                  {/* Batch Assignment */}
                  <div className="space-y-2">
                    <label className={`block text-sm font-semibold uppercase tracking-wide ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Assign Batches
                    </label>
                    <select
                      multiple
                      value={batchArray}
                      onChange={handleBatchChange}
                      className={`w-full p-4 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                        theme === 'light' 
                          ? 'bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 group-hover:border-blue-300' 
                          : 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-4 focus:ring-blue-900 group-hover:border-blue-400'
                      }`}
                    >
                      {batches.map(batch => (
                        <option
                          key={batch.id}
                          value={batch.id}
                          className={`py-2 px-2 rounded m-1 ${theme === 'light' ? 'hover:bg-blue-50' : 'hover:bg-gray-600'}`}
                        >
                          {batch.name} ({batch.year})
                        </option>
                      ))}
                    </select>
                    <p className={`text-xs italic ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Hold Ctrl/Cmd to select multiple batches</p>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 flex justify-center">
                    <button
                      type="submit"
                      className={`group px-12 py-4 rounded-3xl flex items-center gap-3 font-black text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl transform ${
                        theme === 'light' 
                          ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white' 
                          : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                      }`}
                    >
                      Update User
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          </div>
          )
              }
        </>
      );
};

      export default EditUserPage;