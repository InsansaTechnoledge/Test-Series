import React, { useEffect, useState } from 'react'
import { Edit, Eye, PlusSquare, Search, Trash, Users, UserCheck, Shield, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import RefreshButton from '../../utility/RefreshButton'
import { useCachedUser } from '../../../../hooks/useCachedUser'
import { useCachedBatches } from '../../../../hooks/useCachedBatches'
import { useCachedRoleGroup } from '../../../../hooks/useCachedRoleGroup'
import { useQueryClient } from '@tanstack/react-query'
import { useUser } from '../../../../contexts/currentUserContext'
import DeleteUserModal from '../../utility/DeleteUserModal'
import Banner  from "../../../../assests/Institute/User.svg"
import { usePageAccess } from '../../../../contexts/PageAccessContext'
import { useTheme } from '../../../../hooks/useTheme'

const UserList = () => {

    const canAccessPage  = usePageAccess();

          
            if (!canAccessPage) {
              return (
                <div className="flex items-center justify-center ">
                  <div className="text-center bg-red-100 px-4 py-3 my-auto">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
                    <p className="text-gray-600">You do not have permission to view this page.</p>
                  </div>
                </div>
              );
            }

    const { user ,hasRoleAccess} = useUser();
    const { users, isLoading, isError } = useCachedUser();
    const { batches, batchMap } = useCachedBatches();
    const { roleMap, hasActiveFeatureInRole } = useCachedRoleGroup();
    const [filteredUsers, setFilteredUsers] = useState(users);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const queryClient = useQueryClient();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);
    const [expandedUsers, setExpandedUsers] = useState({});
    const navigate = useNavigate();
    const { theme } = useTheme();

      const canCreateUser=hasRoleAccess({
            keyFromPageOrAction: "actions.createUser",
            location: location.pathname
        });
    
        const canEditUser=hasRoleAccess({
            keyFromPageOrAction: "actions.editUser",
            location: location.pathname
        });
    
        const canDeleteUser=hasRoleAccess({
            keyFromPageOrAction: "actions.deleteUser",
            location: location.pathname
        });
    
        const canViewUser=hasRoleAccess({
            keyFromPageOrAction: "actions.viewUser",
            location: location.pathname
        });


    const refreshFunction = async () => {
        await queryClient.invalidateQueries(['Users', user._id]);
        await queryClient.invalidateQueries(['roleGroups', user._id]);
        await queryClient.invalidateQueries(['batches', user._id]);
    }

    useEffect(() => {
        if (users) {
            setFilteredUsers(users);
           
        }
    }, [users])

    useEffect(() => {
        let filtered = users || [];
        
        // Filter by batch if selected
        if (selectedBatch) {
            filtered = filtered.filter(user => user.batch?.includes(selectedBatch));
        }
        
        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(user => 
                user.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        setFilteredUsers(filtered);
    }, [selectedBatch, searchTerm, users]);

    const handleExpandedUsers = (id) => {
        setExpandedUsers(prev => ({
            ...prev,
            [id]: prev[id] ? !prev[id] : true
        }));
    }

    const uniqueRoles = [...new Set(users?.map(user => roleMap[user?.roleId]?.name).filter(Boolean))];

    return (
        <div className={`min-h-screen`}>
            
            {/* Hero Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 "></div>
                <div className="absolute inset-0"></div>
                <div
          className="relative z-10 px-6 py-24 text-center bg-cover bg-center bg-no-repeat rounded-xl"
          style={{ backgroundImage: `url(${Banner})` }}
        >
            <div className={`absolute inset-0 ${
            theme === 'dark' 
                ? 'bg-gray-900/60' 
                : 'bg-black/20'
            }`}>

            </div>
                
                <div className="inline-flex items-center space-x-3 mb-4">
            <h1 className="text-6xl z-10 md:text-7xl font-black text-white tracking-tight">
            All Users
            </h1>
         
          </div>  
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-medium">
          Manage all users of your institute and filter them based on batches roles
          </p>
                </div>
            </div>

        {/* Stats Dashboard */}
            <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} rounded-3xl p-6 shadow-xl border-l-4 border-blue-600 transform hover:scale-105 transition-all duration-300`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-600' : 'text-gray-200'} uppercase tracking-wide`}>Total Users</p>
                                <p className={`text-4xl font-black ${theme === 'light' ? 'text-blue-600' : 'text-blue-200'}`}>{filteredUsers?.length || 0}</p>
                            </div>
                            <div className={`${theme === 'light' ? 'bg-blue-100' : 'bg-blue-400'} p-3 rounded-2xl`}>
                                <Users className={`w-8 h-8 ${theme === 'light' ? 'text-blue-600' : 'text-blue-800'}`} />
                            </div>
                        </div>
                    </div>
                    
                    <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} rounded-3xl p-6 shadow-xl border-l-4 border-green-600 transform hover:scale-105 transition-all duration-300`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-600' : 'text-gray-200'} uppercase tracking-wide`}>Active Roles</p>
                                <p className={`text-4xl font-black ${theme === 'light' ? 'text-green-600' : 'text-green-200'}`}>{uniqueRoles.length}</p>
                            </div>
                            <div className={`${theme === 'light' ? 'bg-green-100' : 'bg-green-400'} p-3 rounded-2xl`}>
                                <Shield className={`w-8 h-8 ${theme === 'light' ? 'text-green-600' : 'text-green-800'}`} />
                            </div>
                        </div>
                    </div>
                    
                    <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} rounded-3xl p-6 shadow-xl border-l-4 border-purple-600 transform hover:scale-105 transition-all duration-300`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-600' : 'text-gray-200'} uppercase tracking-wide`}>Search Results</p>
                                <p className={`text-4xl font-black ${theme === 'light' ? 'text-purple-600' : 'text-purple-200'}`}>{filteredUsers?.length || 0}</p>
                            </div>
                            <div className={`${theme === 'light' ? 'bg-purple-100' : 'bg-purple-400'} p-3 rounded-2xl`}>
                                <Search className={`w-8 h-8 ${theme === 'light' ? 'text-purple-600' : 'text-purple-800'}`} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Control Panel */}
                <div className={`${theme === 'light' ? 'bg-white border border-gray-100' : 'bg-gray-800 border border-gray-700'} rounded-3xl shadow-xl p-6 mb-8`}>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
                            <div className="relative">
                                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme === 'light' ? 'text-gray-400' : 'text-gray-300'} w-5 h-5`} />
                                <input 
                                    className={`${theme === 'light' ? 'bg-gray-50 border-2 border-gray-200 text-gray-900 focus:ring-4 focus:ring-blue-200 focus:border-blue-400' : 'bg-gray-700 border-2 border-gray-600 text-gray-100 focus:ring-4 focus:ring-blue-400 focus:border-blue-400'} rounded-2xl pl-12 pr-6 py-3 transition-all duration-300 w-80`}
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            
                            <select
                                className={`${theme === 'light' ? 'bg-gray-50 border-2 border-gray-200 text-gray-900 focus:ring-4 focus:ring-blue-200 focus:border-blue-400' : 'bg-gray-700 border-2 border-gray-600 text-gray-100 focus:ring-4 focus:ring-blue-400 focus:border-blue-400'} rounded-2xl px-6 py-3 transition-all duration-300 font-medium`}
                                onChange={(e) => setSelectedBatch(e.target.value)}
                                value={selectedBatch}
                            >
                                <option value="">All Batches</option>
                                {batches?.map(batch => (
                                    <option key={batch.id} value={batch.id}>{batch.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center space-x-4">
                            <RefreshButton refreshFunction={refreshFunction} />
                           {canCreateUser &&( <button
                           disabled={!canCreateUser}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center space-x-3 transform"
                                onClick={() => navigate('/institute/create-user')}
                            >
                                <PlusSquare className="w-5 h-5" />
                                <span>Add User</span>
                            </button>)}
                        </div>
                    </div>
                </div>

                {/* User Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {filteredUsers?.map((userItem, idx) => (
                        <div 
                            key={userItem._id || idx} 
                            className={`group relative ${theme === 'light' ? 'bg-white border-gray-100' : 'bg-gray-800 border-gray-700'} rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border overflow-hidden`}
                            style={{
                                animationDelay: `${idx * 100}ms`,
                                animation: 'fadeInUp 0.6s ease-out forwards'
                            }}
                        >
                          
                            <div className={`h-16 ${theme === 'light' ? 'bg-gradient-to-r from-indigo-500 to-indigo-400' : 'bg-gradient-to-r from-indigo-600 to-indigo-700'} rounded-t-2xl relative overflow-hidden shadow-md`}>

  <div className={`inset-0 ${theme === 'light' ? 'bg-indigo-100' : 'bg-gray-800'} bg-opacity-5 backdrop-blur-sm`}></div>
<div className='flex justify-between items-center p-6 '>
<div className="">
    <h3 className="text-white font-bold text-xl leading-snug line-clamp-2">
      {userItem.name}
    </h3>
  </div>

  <div className="">
    <div className="bg-white text-indigo-700 text-xs font-bold px-3 py-1 rounded-full shadow backdrop-blur-md border border-white border-opacity-30 flex items-center gap-1">
      <UserCheck className="w-4 h-4" />
      faculty
    </div>
  </div>

  
  


</div>



</div>


                            {/* Card Content */}
                            <div className="p-6">
                                {/* Role Badge */}
                                <div className="flex items-center justify-center mb-4">
                                    <div className={`${theme === 'light' ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200' : 'bg-gradient-to-r from-blue-900 to-blue-800 border-blue-700'} px-4 py-2 rounded-full border`}>
                                        {roleMap[userItem?.roleId] ? (
                                            <span className={`text-sm font-bold ${theme === 'light' ? 'text-blue-700' : 'text-blue-200'} flex items-center`}>
                                              
                                                <Shield className="w-4 h-4 mr-2" />
                                                {roleMap[userItem.roleId].name}
                                            </span>
                                        ) : (
                                            <span className={`text-sm font-bold ${theme === 'light' ? 'text-red-500' : 'text-red-400'} flex items-center`}>
                                                <AlertTriangle className="w-4 h-4 mr-2" />
                                                No role assigned
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Batches Section */}
                                <div className="mb-6">
                                    <p className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} mb-3`}>Assigned Batches:</p>
                                    <div className="flex justify-center flex-wrap gap-2">
                                        {userItem.batch?.length > 0 ? (
                                            <>
                                                {expandedUsers[userItem._id] ? (
                                                    <>
                                                        {userItem.batch.map((batch, batchIdx) => (
                                                            <div key={batchIdx} className={`${theme === 'light' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-blue-900 text-blue-200 border-blue-700'} px-3 py-1 rounded-full text-xs font-medium border`}>
                                                                {batchMap[batch]?.name} - {batchMap[batch]?.year}
                                                            </div>
                                                        ))}
                                                        {userItem.batch.length > 2 && (
                                                            <button
                                                                className={`text-xs ${theme === 'light' ? 'text-blue-600 hover:text-blue-800' : 'text-blue-400 hover:text-blue-200'} font-medium underline`}
                                                                onClick={() => handleExpandedUsers(userItem._id)}
                                                            >
                                                                Show less
                                                            </button>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        {userItem.batch.slice(0, 2).map((batch, batchIdx) => (
                                                            <div key={batchIdx} className={`${theme === 'light' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-blue-900 text-blue-200 border-blue-700'} px-3 py-1 rounded-full text-xs font-medium border`}>
                                                                {batchMap[batch]?.name} - {batchMap[batch]?.year}
                                                            </div>
                                                        ))}
                                                        {userItem.batch.length > 2 && (
                                                            <button
                                                                className={`text-xs ${theme === 'light' ? 'text-blue-600 hover:text-blue-800' : 'text-blue-400 hover:text-blue-200'} font-medium underline`}
                                                                onClick={() => handleExpandedUsers(userItem._id)}
                                                            >
                                                                +{userItem.batch.length - 2} more
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            <div className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} text-sm italic`}>No batches assigned</div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-center space-x-3">
                                   {canViewUser && ( <button
                                    disabled={!canViewUser}
                                        className={`flex-1 z-10 cursor-pointer ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'} p-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2`}
                                        onClick={() => navigate('/institute/user-detail', { state: { userId: userItem._id } })}
                                        title="View Details"
                                    >
                                        <Eye className="w-4 h-4" />
                                        <span className="font-medium text-sm">View</span>
                                    </button>)}
                                    
                                   {canEditUser &&( <button
                                        disabled={!canEditUser}
                                        className={`flex-1 z-10 cursor-pointer ${theme === 'light' ? 'bg-blue-100 hover:bg-blue-200 text-blue-700' : 'bg-blue-800 hover:bg-blue-700 text-blue-200'} p-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2`}
                                        onClick={() => navigate(`/institute/user-edit/${userItem._id}`)}
                                        title="Edit User"
                                    >
                                        <Edit className="w-4 h-4" />
                                        <span className="font-medium text-sm">Edit</span>
                                    </button>)}
                                    
                                   {canDeleteUser && ( <button
                                        className={`${theme === 'light' ? 'bg-red-100 hover:bg-red-200 text-red-700' : 'bg-red-800 hover:bg-red-700 text-red-200'} z-10 cursor-pointer p-3 rounded-xl transition-all duration-300 hover:scale-105`}
                                        onClick={() => {
                                            setShowDeleteModal(true);
                                            setUserIdToDelete(userItem._id);
                                        }}
                                        title="Delete User"
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>)}
                                </div>
                            </div>

                            {/* Hover Effect Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl"></div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredUsers?.length === 0 && (
                    <div className="text-center py-20">
                        <div className={`w-32 h-32 mx-auto ${theme === 'light' ? 'bg-gradient-to-r from-blue-100 to-blue-200' : 'bg-gradient-to-r from-blue-800 to-blue-700'} rounded-full flex items-center justify-center mb-8 animate-bounce`}>
                            <Users className={`w-12 h-12 ${theme === 'light' ? 'text-blue-400' : 'text-blue-300'}`} />
                        </div>
                        <h3 className={`text-3xl font-black ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'} mb-4`}>No users found</h3>
                        <p className={`text-xl ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mb-8 max-w-md mx-auto`}>
                            {selectedBatch ? "No users found for selected batch" : searchTerm ? `No users match "${searchTerm}"` : 'Get started by adding your first user'}
                        </p>
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold transition-all duration-300 hover:shadow-2xl hover:scale-105 inline-flex items-center space-x-3"
                            onClick={() => navigate('/institute/create-user')}
                        >
                            <PlusSquare className="w-5 h-5" />
                            <span>Add First User</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            {showDeleteModal && userIdToDelete && (
                <DeleteUserModal
                    userId={userIdToDelete}
                    setShowDeleteModal={setShowDeleteModal}
                />
            )}

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    )
}

export default UserList