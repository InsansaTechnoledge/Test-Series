import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useCachedUser } from '../../../../../hooks/useCachedUser';
import { useCachedRoleGroup } from '../../../../../hooks/useCachedRoleGroup';
import { useCachedBatches } from '../../../../../hooks/useCachedBatches';
import { UpdateUser } from '../../../../../utils/services/userService';
import BackButton from '../../../../constants/BackButton';

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
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
    </div>
  );
  if (isError) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-red-500 text-lg">Error loading user data</div>
    </div>
  );



  return (
          <>
      {userData && (

        <div className="bg-gray-100 min-h-screen">
          <BackButton />
          <div className="min-h-screen p-6">

            <div className="max-w-2xl mx-auto">
              <div className="  rounded-2xl shadow-xl  p-1">
                {/* Header */}
                <div className="text-center mb-8 py-5  bg-gradient-to-r from-indigo-600 to-gray-600 text-white relative overflow-hidden rounded-t-2xl ">
                  <h1 className="text-3xl font-bold text-white mb-2">Edit User</h1>
                  {/* <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full"></div> */}
                </div>

                <form className="space-y-6 p-4" onSubmit={handleSubmit}>
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
                      className="w-full p-4  border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 group-hover:border-blue-300"
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
                      className="w-full p-4  border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 group-hover:border-blue-300"
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
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 group-hover:border-blue-300"
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
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 group-hover:border-blue-300"
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
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 group-hover:border-blue-300"
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
                      className="w-full p-4  border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 group-hover:border-blue-300"
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
                  <div className="pt-4 flex justify-center">
                    <button
                      type="submit"
                      className="group bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-12 py-4 rounded-3xl flex items-center gap-3 font-black text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl transform"
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
