import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useCachedUser } from '../../../../../hooks/useCachedUser';
import { useCachedRoleGroup } from '../../../../../hooks/useCachedRoleGroup';
import { useCachedBatches } from '../../../../../hooks/useCachedBatches';
import { UpdateUser } from '../../../../../utils/services/userService';
import BackButton from '../../../../constants/BackButton';

const EditUserPage = () => {
  const { id } = useParams();
  const { userMap } = useCachedUser();
  const { roleGroups, roleMap } = useCachedRoleGroup();
  const { batches, batchMap } = useCachedBatches();

  const userData = userMap[id];
  console.log(userData);

  const [name, setName] = useState(userData.name || '');
  const [email, setEmail] = useState(userData.email || '');
  const [userId, setUserId] = useState(userData.userId || '');
  const [gender, setGender] = useState(userData.gender || '');
  const [role, setRole] = useState(userData.roleId || '');
  const [batchArray, setBatchArray] = useState(userData.batch || []);

  const roleGroupsList = roleGroups.map(r => (
    <option key={r._id} value={r._id}>
      {r.name}
    </option>
  ));

  const handleBatchChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setBatchArray(selectedOptions);
  };

  const currRoleGroup = roleMap[userData.roleId]?.name || "No role assigned";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedUserData = {
      name,
      email,
      gender,
      roleId: role,
      batch: batchArray
    };
  
    console.log("Updated user data:", updatedUserData);
  
    try {
      const response = await UpdateUser({
        userId: id,         
        Data: updatedUserData
      });
      console.log("User updated:", response);
      alert("User updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    }
  };
  

  return (
    <>
         <BackButton />
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
 
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Edit User</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full"></div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                User's Name
              </label>
              <input
                type="text"
                placeholder="Enter user's name here"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none bg-white hover:border-gray-300"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                User's Email
              </label>
              <input
                type="email"
                placeholder="Enter user's email here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none bg-white hover:border-gray-300"
              />
            </div>

            {/* User ID Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Organization ID
              </label>
              <input
                type="text"
                placeholder="Enter organization ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none bg-white hover:border-gray-300"
              />
            </div>

            {/* Gender Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Select Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none bg-white hover:border-gray-300 cursor-pointer"
              >
                <option value={gender} className="text-gray-700">{gender}</option>
                {gender !== 'Male' && <option value="Male">Male</option>}
                {gender !== 'Female' && <option value="Female">Female</option>}
              </select>
            </div>

            {/* Role Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Role Group
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none bg-white hover:border-gray-300 cursor-pointer"
              >
                <option value="" disabled className="text-gray-700">Select a Role</option>
                {roleGroupsList}
              </select>
            </div>

            {/* Batch Assignment */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Assign Batches
              </label>
              <select
                multiple
                value={batchArray}
                onChange={handleBatchChange}
                className="w-full px-3 py-2 min-h-32 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none bg-white hover:border-gray-300"
              >
                {batches.map(batch => (
                  <option 
                    key={batch.id} 
                    value={batch.id}
                    className="py-2 px-2 hover:bg-blue-50 rounded m-1"
                  >
                    {batch.name} ({batch.year})
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 italic">Hold Ctrl/Cmd to select multiple batches</p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 uppercase tracking-wide"
              >
                Update User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
      </>
  );
};

export default EditUserPage;
