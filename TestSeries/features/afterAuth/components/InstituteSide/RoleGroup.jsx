import { useState } from 'react';
import { Plus, X, Save, Edit, UserPlus, Users, Shield, Check, Trash } from 'lucide-react';
import HeadingUtil from '../../utility/HeadingUtil';
import { postRoleGroup ,  deleteRoleGroup, updateRoleGroup } from '../../../../utils/services/RoleGroupService';
import { useQueryClient } from '@tanstack/react-query';
import { useCachedRoleGroup } from '../../../../hooks/useCachedRoleGroup';
import GuiderComponent from './components/GuiderComponent';
import NeedHelpComponent from './components/NeedHelpComponent';
import RefreshButton from '../../utility/RefreshButton';
import { useUser } from '../../../../contexts/currentUserContext';
import { useCachedFeatures } from '../../../../hooks/useCachedFeatures';
import DeleteRoleGroupModal from '../../../../components/roleGroup/deleteRolegroupModal';
import Banner from "../../../../assests/Institute/create role.svg"
import { usePageAccess } from '../../../../contexts/PageAccessContext';


export default function FeatureBasedRoleGroups() {
  const {user} = useUser();
  const {featuresData, isLoading} = useCachedFeatures();
  const [showDeleteRoleGroupModal,setShowDeleteRoleGroupModal]=useState(false);
  const [roleGroupToDelete,setRoleGroupToDelete]=useState();

  const canAccessPage = usePageAccess();
  const queryClient = useQueryClient();

  const{roleGroups,rolesLoading}=useCachedRoleGroup();
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [newGroup, setNewGroup] = useState({ name: '', description: '', features: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  
  const features = Array.isArray(featuresData) ? featuresData : [];

  const categories = ['All', ...new Set(features.map(feature => feature.category))];
    
  const filteredFeatures = features.filter(feature => {
    const matchesSearch = feature.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || feature.category === filterCategory;
    return matchesSearch && matchesCategory;
  });
  
  const featuresByCategory = {};
  filteredFeatures.forEach(feature => {
    if (!featuresByCategory[feature.category]) {
      featuresByCategory[feature.category] = [];
    }
    featuresByCategory[feature.category].push(feature);
  });

  const handleAddGroup = async () => {
    if (newGroup.name.trim() === '') return;

    try {
      const response = await postRoleGroup(newGroup);
      await queryClient.invalidateQueries(['roleGroups', user._id]);
      setNewGroup({ name: '', description: '', features: [] });
      setIsAddingGroup(false);
    } catch (error) {
      console.error("Error posting role group:", error);
    }
  };

  const refreshFunction = async() => {
    await queryClient.invalidateQueries(['roleGroups', user._id]);
    await queryClient.invalidateQueries(['features', user._id]);
  }
  
  const handleEditGroup = (group) => {
    // Extract feature IDs consistently
    const normalizedFeatureIds = Array.isArray(group.features) 
      ? group.features.map(f => typeof f === 'string' ? f : f._id ? f._id : f.id)
      : [];

    setNewGroup({ 
      name: group.name, 
      description: group.description, 
      features: normalizedFeatureIds,
    });

    setEditingGroupId(group._id || group.id);
  };
  
  const handleUpdateGroup = async () => {
    if (newGroup.name.trim() === '') return;
  
    try {
      await updateRoleGroup(editingGroupId, newGroup);
      await queryClient.invalidateQueries(['roleGroups', user._id]);
      setNewGroup({ name: '', description: '', features: [] });
      setEditingGroupId(null);
    } catch (error) {
      console.error("Error updating role group:", error);
    }
  };
  
  // const handleDeleteGroup = async (group) => {
  //   try {
  //     // await deleteRoleGroup(groupId);

  //     // 

  //     setDeleteRoleGroupModal(true);
  //   } catch (error) {
  //     console.error("Error deleting role group:", error);
  //   }
  // };
  
  const toggleFeatureInGroup = (featureId) => {
    const updatedFeatures = newGroup.features.includes(featureId)
      ? newGroup.features.filter(id => id !== featureId)
      : [...newGroup.features, featureId];
    
    setNewGroup({ ...newGroup, features: updatedFeatures });
  };
  
  const selectAllFeatures = () => {
    setNewGroup({ ...newGroup, features: features.map(f => f._id) });
  };
  
  const deselectAllFeatures = () => {
    setNewGroup({ ...newGroup, features: [] });
  };
  
  const selectCategoryFeatures = (category) => {
    const categoryFeatureIds = features
      .filter(f => f.category === category)
      .map(f => f._id);
    
    const currentFeatures = new Set(newGroup.features);
    categoryFeatureIds.forEach(id => currentFeatures.add(id));
    
    setNewGroup({ ...newGroup, features: Array.from(currentFeatures) });
  };
  
  const getFeatureName = (featureId) => {
    if (!featureId) return 'Unknown Feature';
    
    // Find the feature by comparing string representations of IDs
    const feature = features.find(f => 
      f && f._id && featureId && f._id.toString() === featureId.toString()
    );
    
    return feature ? feature.name : 'Unknown Feature';
  };
  
  const countFeaturesByCategory = (group, category) => {
    // If group or features array is missing, return 0
    if (!group || !group.features || !Array.isArray(group.features)) {
      return 0;
    }

    // Get all features in this category
    const categoryFeatures = features.filter(f => f.category === category);
    
    // Normalize all feature IDs in the group to strings
    const groupFeatureIds = new Set(
      group.features.map(f => {
        // Handle different formats of feature IDs
        if (typeof f === 'string') return f;
        if (f && f._id) return f._id.toString();
        if (f && f.id) return f.id.toString();
        return null;
      }).filter(Boolean) // Remove any null values
    );

    // Count how many features from this category are in the group
    const matchingCount = categoryFeatures.filter(feature => 
      feature && feature._id && groupFeatureIds.has(feature._id.toString())
    ).length;
    
    return matchingCount;
  };

  const question = "How To assign role groups to users ?"
  const answer = "Use the created role groups to assign permissions to users in your add user section."
 
  if (isLoading) return <div>Loading features...</div>;

  // Function to render the edit form for a specific role group
  const renderEditForm = (group) => {
    return (
      <>
     
      
<div className="border-3 rounded-lg overflow-hidden bg-blue-50/40 mb-13 m-20 mt-12">
        <div className="p-4 bg-blue-100/40 border-b flex justify-between items-center">
          <h3 className="font-medium text-blue-800">
            Edit {newGroup.name}
          </h3>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={() => {
              setEditingGroupId(null);
              setNewGroup({ name: '', description: '', features: [] });
            }}
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Group Details */}
            <div className="md:col-span-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Name *</label>
                <input 
                  type="text" 
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                  placeholder="Enter group name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                  placeholder="Enter group description"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selected Features: {newGroup.features.length}/{features.length}
                </label>
                
                <div className="flex flex-wrap gap-1 bg-white border rounded-md p-2 max-h-32 overflow-y-auto">
                  {newGroup.features.length === 0 ? (
                    <div className="text-sm text-gray-500 p-1">No features selected</div>
                  ) : (
                    newGroup.features.map(featureId => (
                      <div key={featureId} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex items-center gap-1">
                        <span>{getFeatureName(featureId)}</span>
                        <button 
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => toggleFeatureInGroup(featureId)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <div className="pt-2 flex justify-end">
                <button 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-1 disabled:bg-gray-400"
                  onClick={handleUpdateGroup}
                  disabled={!newGroup.name.trim()}
                >
                  <Save size={16} />
                  <span>Update Group</span>
                </button>
              </div>
            </div>
            
            {/* Feature Selection */}
            <div className="md:col-span-2 border rounded-md bg-white">
              <div className="p-3 border-b bg-gray-50">
                <div className="flex flex-wrap gap-2 mb-2">
                  <button 
                    className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 hover:bg-blue-200"
                    onClick={selectAllFeatures}
                  >
                    Select All
                  </button>
                  <button 
                    className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200"
                    onClick={deselectAllFeatures}
                  >
                    Deselect All
                  </button>
                  {categories.filter(cat => cat !== 'All').map(category => (
                    <button 
                      key={category}
                      className="text-xs px-2 py-1 rounded bg-green-100 text-green-800 hover:bg-green-200"
                      onClick={() => selectCategoryFeatures(category)}
                    >
                      Select {category}
                    </button>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search features..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  
                  <select
                    className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="p-3 max-h-96 overflow-y-auto">
                {Object.keys(featuresByCategory).length === 0 ? (
                  <div className="text-center text-gray-500 py-4">No features match your search</div>
                ) : (
                  Object.keys(featuresByCategory).map(category => (
                    <div key={category} className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">{category}</h4>
                      <div className="space-y-1">
                        {featuresByCategory[category].map(feature => (
                          <div 
                            key={feature._id} 
                            className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-50 ${
                              newGroup.features.includes(feature._id) ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => toggleFeatureInGroup(feature._id)}
                          >
                            <div className={`w-5 h-5 flex items-center justify-center rounded-md border ${
                              newGroup.features.includes(feature._id) 
                                ? 'bg-blue-600 border-blue-600 text-white' 
                                : 'border-gray-300'
                            }`}>
                              {newGroup.features.includes(feature._id) && <Check size={14} />}
                            </div>
                            <span className="text-sm">{feature.name}</span>
                            
                            <div>
                              <span className="text-xs text-gray-500">({feature.description})</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      </>
   
    );
  };

  return (
    <>
    {
      showDeleteRoleGroupModal
      ?
      <DeleteRoleGroupModal setShowDeleteRoleGroupModal={setShowDeleteRoleGroupModal} role={roleGroupToDelete}/>
      :
      null

    }
     
     <div className="relative overflow-hidden rounded-xl h-80">
    {/* // Background Image */}
    <img 
        src={Banner} 
        alt="Upload Banner"
        className="absolute  w-full h-full object-cover"
    />
    
  
    <div className="absolute "></div>
    
    {/* Content */}
    <div className="relative z-10 flex items-center justify-center h-full px-6 text-center w-full">
        <div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
            Create Role Group
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
            you can assing all the required roles into a single group
            </p>
        </div>
    </div>
</div>
    <div className=" flex flex-col  justify-center p-6 bg-white rounded-lg">
    
    <div  className=' mx-auto  -mt-12 relative z-20 w-[90%]'>

 
      <NeedHelpComponent heading="creating Roles ?" about="roles help users to access systems fucntionality" question={question} answer={answer}/>
      </div>
      {/* Group List and Management */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Existing Role Groups</h2>
            <div className='flex gap-4'>
              <RefreshButton refreshFunction={refreshFunction}/>
            {!isAddingGroup && (
              <button 
                className={`bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 flex items-center gap-1
                   ${canAccessPage === false
                                        ? 'cursor-not-allowed'
                                        : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-105 hover:shadow-2xl'}
                                      
                  `}
                disabled={canAccessPage === false}
                onClick={() => {
                  setIsAddingGroup(true);
                  setEditingGroupId(null);
                  setNewGroup({ name: '', description: '', features: [] });
                }}
              >
                <Plus size={16} />
                <span>Create Role Group</span>
              </button>
          )}
          </div>
        </div>
        
        {/* Role Groups List */}
        <div className="bg-white rounded-md border mb-6 overflow-auto">
          {roleGroups.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No role groups defined yet. Create your first role group!</div>
          ) : (
            <div className="divide-y">
              {roleGroups.map(group => (
                <div key={group._id || group.id}>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="font-medium text-blue-800">{group.name}</h3>
                        <p className="text-sm text-gray-500">{group.description}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          className="p-1 text-gray-500 hover:text-blue-600"
                          onClick={() => handleEditGroup(group)}
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          className="p-1 text-gray-500 hover:text-red-600 flex items-center gap-1"
                          onClick={() =>{
                            setRoleGroupToDelete(group);
                            setShowDeleteRoleGroupModal(true);
                          }}
                        >
                          <Trash size={18}/>
                        </button>
                      </div>
                    </div>
                    
                    {/* Feature Categories Summary */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {categories.filter(cat => cat !== 'All').map(category => {
                        const count = countFeaturesByCategory(group, category);
                        const total = features.filter(f => f.category === category).length;
                        
                        return (
                          <span key={category} className="bg-green-100 text-blue-700 text-xs px-2 py-1 rounded">
                            {category}: {count}/{total}
                          </span>
                        );
                      })}
                    </div>
                    
                    {/* Features Count */}
                    <div className="mt-2 text-sm text-blue-600">
                      {Array.isArray(group.features) ? group.features.length : 0} features assigned
                    </div>
                  </div>
                  
                  {/* Render edit form directly under this role group if it's being edited */}
                  {editingGroupId === (group._id || group.id) && renderEditForm(group)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      
      {/* Role Group Management */}
<div className="mb-12">
  {/* Header */}
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text drop-shadow-sm">
      Role Groups
    </h2>
    <div className="flex gap-3">
      <RefreshButton refreshFunction={refreshFunction} />
      {!isAddingGroup && (
        <button
          onClick={() => {
            setIsAddingGroup(true);
            setEditingGroupId(null);
            setNewGroup({ name: '', description: '', features: [] });
          }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-4 py-2 rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
        >
          <Plus size={16} />
          <span>Create Role Group</span>
        </button>
      )}
    </div>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {roleGroups.map(group => (
    <div
      key={group._id || group.id}
      className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 transition hover:shadow-2xl"
    >
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="text-lg font-bold text-blue-700">{group.name}</h3>
          <p className="text-sm text-gray-500">{group.description}</p>
        </div>
        <div className="flex gap-2">
          <button
            className="p-2 rounded hover:bg-gray-100 text-gray-600"
            onClick={() => handleEditGroup(group)}
          >
            <Edit size={18} />
          </button>
          <button
            className="p-2 rounded hover:bg-red-100 text-red-500"
            onClick={() => {
              setRoleGroupToDelete(group);
              setShowDeleteRoleGroupModal(true);
            }}
          >
            <Trash size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 my-4">
        {categories.filter(cat => cat !== 'All').map(category => {
          const count = countFeaturesByCategory(group, category);
          const total = features.filter(f => f.category === category).length;

          return (
            <span key={category} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full shadow-sm">
              {category}: {count}/{total}
            </span>
          );
        })}
      </div>

      <div className="text-sm font-medium text-indigo-600">
        {Array.isArray(group.features) ? group.features.length : 0} features assigned
      </div>

      {editingGroupId === (group._id || group.id) && (
        <div className="mt-4">{renderEditForm(group)}</div>
      )}
    </div>
  ))}
</div>

  {/* Group List */}
  <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg gap-2 flex">
    {roleGroups.length === 0 ? (
      <div className="p-8 text-center text-gray-500 text-base">
        No role groups defined yet. Create your first role group!
      </div>
    ) : (
      <div className="divide-y divide-gray-100">
        {roleGroups.map((group) => (
          <div
            key={group._id || group.id}
            className="p-6 transition-all duration-300 hover:bg-white/90"
          >
            {/* Title + Actions */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-bold text-blue-800">{group.name}</h3>
                <p className="text-sm text-gray-500">{group.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="p-2 hover:bg-blue-100 rounded-md text-gray-600 hover:text-blue-700 transition"
                  onClick={() => handleEditGroup(group)}
                >
                  <Edit size={18} />
                </button>
                <button
                  className="p-2 hover:bg-red-100 rounded-md text-gray-600 hover:text-red-600 transition"
                  onClick={() => {
                    setRoleGroupToDelete(group);
                    setShowDeleteRoleGroupModal(true);
                  }}
                >
                  <Trash size={18} />
                </button>
              </div>
            </div>

            {/* Category Badges */}
            <div className="flex flex-wrap gap-2 mt-3">
              {categories
                .filter((cat) => cat !== 'All')
                .map((category) => {
                  const count = countFeaturesByCategory(group, category);
                  const total = features.filter((f) => f.category === category).length;

                  return (
                    <span
                      key={category}
                      className="text-xs px-3 py-1 rounded-full font-medium bg-blue-100 text-blue-800 shadow-sm"
                    >
                      {category}: {count}/{total}
                    </span>
                  );
                })}
            </div>

            {/* Features Count */}
            <div className="mt-2 text-sm text-indigo-600 font-medium">
              {Array.isArray(group.features) ? group.features.length : 0} features assigned
            </div>

            {/* Inline Edit Form */}
            {editingGroupId === (group._id || group.id) && renderEditForm(group)}
          </div>
        ))}
      </div>
    )}
  </div>
</div>

      
      {/* Add New Role Group Form */}
      {isAddingGroup && (
        <div className="border-3 rounded-lg overflow-hidden bg-blue-50/40 mb-6">
          <div className="p-4 bg-blue-100/40 border-b flex justify-between items-center">
            <h3 className="font-medium text-blue-800">
              Create New Role Group
            </h3>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => {
                setIsAddingGroup(false);
                setNewGroup({ name: '', description: '', features: [] });
              }}
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Group Details */}
              <div className="md:col-span-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Group Name *</label>
                  <input 
                    type="text" 
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                    placeholder="Enter group name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                    placeholder="Enter group description"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Selected Features: {newGroup.features.length}/{features.length}
                  </label>
                  
                  <div className="flex flex-wrap gap-1 bg-white border rounded-md p-2 max-h-32 overflow-y-auto">
                    {newGroup.features.length === 0 ? (
                      <div className="text-sm text-gray-500 p-1">No features selected</div>
                    ) : (
                      newGroup.features.map(featureId => (
                        <div key={featureId} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex items-center gap-1">
                          <span>{getFeatureName(featureId)}</span>
                          <button 
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => toggleFeatureInGroup(featureId)}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                <div className="pt-2 flex justify-end">
                  <button 
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-1 disabled:bg-gray-400"
                    onClick={handleAddGroup}
                    disabled={!newGroup.name.trim()}
                  >
                    <Save size={16} />
                    <span>Create Group</span>
                  </button>
                </div>
              </div>
              
              {/* Feature Selection */}
              <div className="md:col-span-2 border rounded-md bg-white">
                <div className="p-3 border-b bg-gray-50">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <button 
                      className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 hover:bg-blue-200"
                      onClick={selectAllFeatures}
                    >
                      Select All
                    </button>
                    <button 
                      className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200"
                      onClick={deselectAllFeatures}
                    >
                      Deselect All
                    </button>
                    {categories.filter(cat => cat !== 'All').map(category => (
                      <button 
                        key={category}
                        className="text-xs px-2 py-1 rounded bg-green-100 text-green-800 hover:bg-green-200"
                        onClick={() => selectCategoryFeatures(category)}
                      >
                        Select {category}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Search features..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    <select
                      className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="p-3 max-h-96 overflow-y-auto">
                  {Object.keys(featuresByCategory).length === 0 ? (
                    <div className="text-center text-gray-500 py-4">No features match your search</div>
                  ) : (
                    Object.keys(featuresByCategory).map(category => (
                      <div key={category} className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">{category}</h4>
                        <div className="space-y-1">
                          {featuresByCategory[category].map(feature => (
                            <div 
                              key={feature._id} 
                              className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-50 ${
                                newGroup.features.includes(feature._id) ? 'bg-blue-50' : ''
                              }`}
                              onClick={() => toggleFeatureInGroup(feature._id)}
                            >
                              <div className={`w-5 h-5 flex items-center justify-center rounded-md border ${
                                newGroup.features.includes(feature._id) 
                                  ? 'bg-blue-600 border-blue-600 text-white' 
                                  : 'border-gray-300'
                              }`}>
                                {newGroup.features.includes(feature._id) && <Check size={14} />}
                              </div>
                              <span className="text-sm">{feature.name}</span>
                              
                              <div>
                                <span className="text-xs text-gray-500">({feature.description})</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
     
    </div>
    </>
  );
}