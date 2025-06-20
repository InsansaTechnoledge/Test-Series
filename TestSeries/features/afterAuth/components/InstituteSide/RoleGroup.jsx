import { useState } from 'react';
import { Plus, X, Save, Edit, UserPlus, Users, Shield, Check, Trash, AlertTriangle } from 'lucide-react';
import HeadingUtil from '../../utility/HeadingUtil';
import { postRoleGroup, deleteRoleGroup, updateRoleGroup } from '../../../../utils/services/RoleGroupService';
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
import useLimitAccess from '../../../../hooks/useLimitAccess';
import { useLocation } from 'react-router-dom';
import { useCachedOrganization } from '../../../../hooks/useCachedOrganization';


export default function FeatureBasedRoleGroups() {
  const { user , getFeatureKeyFromLocation } = useUser();
  const { featuresData, isLoading } = useCachedFeatures();
  const [showDeleteRoleGroupModal, setShowDeleteRoleGroupModal] = useState(false);
  const [roleGroupToDelete, setRoleGroupToDelete] = useState();

  const canAccessPage = usePageAccess();
  const queryClient = useQueryClient();

  const { roleGroups, rolesLoading } = useCachedRoleGroup();
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [newGroup, setNewGroup] = useState({ name: '', description: '', features: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const features = Array.isArray(featuresData) ? featuresData : [];

  const categories = ['All', ...new Set(features.map(feature => feature.category))];

  const location = useLocation();

  const canAddMoreRoles = useLimitAccess(getFeatureKeyFromLocation(location.pathname) , "totalRoleGroups");

  const organization =
  user.role !== 'organization'
    ? useCachedOrganization({ userId: user._id, orgId: user.organizationId._id })?.organization
    : null;

  const Total_Role = user?.role === 'organization' 
    ? user.metaData?.totalBatches 
    :  (  
      organization?.metaData?.totalBatches
    );

  const Creation_limit = user?.planFeatures?.role_feature?.value
  const Available_limit = Creation_limit - Total_Role;

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

  const refreshFunction = async () => {
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


    const feature = features.find(f =>
      f && f._id && featureId && f._id.toString() === featureId.toString()
    );

    return feature ? feature.name : 'Unknown Feature';
  };

  const countFeaturesByCategory = (group, category) => {

    if (!group || !group.features || !Array.isArray(group.features)) {
      return 0;
    }


    const categoryFeatures = features.filter(f => f.category === category);

    const groupFeatureIds = new Set(
      group.features.map(f => {
        // Handle different formats of feature IDs
        if (typeof f === 'string') return f;
        if (f && f._id) return f._id.toString();
        if (f && f.id) return f.id.toString();
        return null;
      }).filter(Boolean)
    );

    const matchingCount = categoryFeatures.filter(feature =>
      feature && feature._id && groupFeatureIds.has(feature._id.toString())
    ).length;

    return matchingCount;
  };

  const question = "How To assign role groups to users ?"
  const answer = "Use the created role groups to assign permissions to users in your add user section."

  if (isLoading) return <div>Loading features...</div>;


  const renderEditForm = (group) => {
    return (
      <>
        <div className="rounded-2xl overflow-hidden bg-white/60 backdrop-blur-md border border-blue-200 shadow-xl mx-6 mt-12 mb-16">
          <div className="p-4 bg-blue-100/40 border-b flex justify-between items-center">
            <h3 className="font-semibold text-blue-900">
              Edit {newGroup.name}
            </h3>
            <button
              className="text-gray-500 hover:text-gray-700 transition"
              onClick={() => {
                setEditingGroupId(null);
                setNewGroup({ name: '', description: '', features: [] });
              }}
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Group Details */}
              <div className="md:col-span-1 space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Group Name *</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    placeholder="Enter group name"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                    placeholder="Enter group description"
                    rows={3}
                  />
                </div>

                {/* Selected Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Selected Features: {newGroup.features.length}/{features.length}
                  </label>
                  <div className="flex flex-wrap gap-1 bg-white border border-gray-300 rounded-md p-2 max-h-32 overflow-y-auto">
                    {newGroup.features.length === 0 ? (
                      <div className="text-sm text-gray-500 p-1">No features selected</div>
                    ) : (
                      newGroup.features.map((featureId) => (
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

                {/* Update Button */}
                <div className="pt-4 flex justify-end">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-md flex items-center gap-1 disabled:bg-gray-400"
                    onClick={handleUpdateGroup}
                    disabled={!newGroup.name.trim()}
                  >
                    <Save size={16} />
                    <span>Update Group</span>
                  </button>
                </div>
              </div>

              {/* Feature Selection */}
              <div className="md:col-span-2 bg-white/80 border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-blue-50/40">
                  {/* Controls */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <button className="text-xs px-3 py-1 rounded bg-blue-100 text-blue-800 hover:bg-blue-200" onClick={selectAllFeatures}>
                      Select All
                    </button>
                    <button className="text-xs px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200" onClick={deselectAllFeatures}>
                      Deselect All
                    </button>
                    {categories.filter(cat => cat !== 'All').map(category => (
                      <button
                        key={category}
                        className="text-xs px-3 py-1 rounded bg-green-100 text-green-800 hover:bg-green-200"
                        onClick={() => selectCategoryFeatures(category)}
                      >
                        Select {category}
                      </button>
                    ))}
                  </div>

                  {/* Search + Filter */}
                  <div className="flex gap-3">
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
                      placeholder="Search features..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                      className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Feature List */}
                <div className="p-4 max-h-96 overflow-y-auto">
                  {Object.keys(featuresByCategory).length === 0 ? (
                    <div className="text-center text-gray-500 py-4">No features match your search</div>
                  ) : (
                    Object.keys(featuresByCategory).map(category => (
                      <div key={category} className="mb-6">
                        <h4 className="font-medium text-gray-800 mb-2">{category}</h4>
                        <div className="space-y-1">
                          {featuresByCategory[category].map(feature => (
                            <div
                              key={feature._id}
                              className={`flex items-start gap-3 p-2 rounded-md cursor-pointer transition hover:bg-blue-50 ${newGroup.features.includes(feature._id) ? 'bg-blue-100/60' : ''
                                }`}
                              onClick={() => toggleFeatureInGroup(feature._id)}
                            >
                              <div className={`w-5 h-5 flex items-center justify-center rounded-md border text-white text-xs ${newGroup.features.includes(feature._id)
                                  ? 'bg-blue-600 border-blue-600'
                                  : 'border-gray-300 text-transparent'
                                }`}>
                                {newGroup.features.includes(feature._id) && <Check size={14} />}
                              </div>
                              <div className="text-sm">
                                <div className="text-gray-800">{feature.name}</div>
                                <div className="text-xs text-gray-500">{feature.description}</div>
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
          <DeleteRoleGroupModal setShowDeleteRoleGroupModal={setShowDeleteRoleGroupModal} role={roleGroupToDelete} />
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

            <div className="flex items-center justify-center">
  <p className="mt-8 text-indigo-700 bg-indigo-50 border border-indigo-100 px-5 py-4 rounded-2xl text-base flex items-center gap-3 shadow-sm backdrop-blur-sm">
    <AlertTriangle className="w-5 h-5 text-indigo-400" />
    <span>
      <span className="font-semibold">Note:</span> For your current plan, you have an available limit of
      <span className={`font-bold ${Available_limit > 0 ? "text-green-600" : "text-red-600"} mx-1`}>
        {Available_limit}
      </span>
      to add more users.
    </span>
  </p>
</div>

          </div>
        </div>
      </div>
      <div className=" flex flex-col  justify-center p-6 bg-white rounded-lg">

        <div className=' mx-auto  -mt-12 relative z-20 w-[90%]'>


          <NeedHelpComponent heading="creating Roles ?" about="roles help users to access systems fucntionality" question={question} answer={answer} />
          
        {!canAddMoreRoles && (
           <p className="mt-4 text-center text-sm text-red-600 bg-red-100 border border-red-200 px-4 py-2 rounded-xl shadow-sm backdrop-blur-sm">
          You've reached your batch creation limit. <br className="sm:hidden" />
           <span className="font-medium">Upgrade your plan</span> to continue.
         </p>
         
          )}
        </div>





        {/* Role Group Management */}
        <div className="my-5">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text drop-shadow-sm">
              Existing Role Groups
            </h2>
            <div className="flex gap-3">
              <RefreshButton refreshFunction={refreshFunction} />
              
              {!isAddingGroup && (
               <button
               disabled={canAccessPage === false || canAddMoreRoles === false}
               onClick={() => {
                 setIsAddingGroup(true);
                 setEditingGroupId(null);
                 setNewGroup({ name: '', description: '', features: [] });
               }}
               className={`inline-flex items-center gap-2 font-semibold px-4 py-2 rounded-xl shadow-md transition-transform duration-300
                 ${canAccessPage && canAddMoreRoles 
                   ? 'bg-green-500 text-white hover:scale-105' 
                   : 'bg-red-500 text-gray-100 cursor-not-allowed'}
               `}
             >
               {canAccessPage && canAddMoreRoles && <Plus size={16} />}
               <span>{!canAddMoreRoles ? "Limit Exceeded " : "Create Role Group"}</span>
             </button>
             
              )}
            </div>

          </div>
          {isAddingGroup && (
            <div className="rounded-2xl overflow-hidden bg-white/60 backdrop-blur-md border border-blue-200 shadow-xl mx-6 mb-10">
              <div className="p-4 bg-blue-100/40 border-b flex justify-between items-center">
                <h3 className="font-semibold text-blue-900">
                  Create New Role Group
                </h3>
                <button
                 className={`inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-4 py-2 rounded-xl shadow-md hover:scale-105 transition-transform duration-300
                  ${canAddMoreRoles === false && "bg-gray-500"}
                `}
                  disabled= {canAccessPage === false || canAddMoreRoles === false}
                  onClick={() => {
                    setIsAddingGroup(false);
                    setNewGroup({ name: '', description: '', features: [] });
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Group Details */}
                  <div className="md:col-span-1 space-y-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Group Name *</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={newGroup.name}
                        onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                        placeholder="Enter group name"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={newGroup.description}
                        onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                        placeholder="Enter group description"
                        rows={3}
                      />
                    </div>

                    {/* Selected Features */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Selected Features: {newGroup.features.length}/{features.length}
                      </label>
                      <div className="flex flex-wrap gap-1 bg-white border border-gray-300 rounded-md p-2 max-h-32 overflow-y-auto">
                        {newGroup.features.length === 0 ? (
                          <div className="text-sm text-gray-500 p-1">No features selected</div>
                        ) : (
                          newGroup.features.map((featureId) => (
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

                    {/* Create Button */}
                    <div className="pt-4 flex justify-end">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-md flex items-center gap-1 disabled:bg-gray-400"
                        onClick={handleAddGroup}
                        disabled={!newGroup.name.trim()}
                      >
                        <Save size={16} />
                        <span>Create Group</span>
                      </button>
                    </div>
                  </div>

                  {/* Feature Selection */}
                  <div className="md:col-span-2 bg-white/80 border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b bg-blue-50/40">
                      {/* Controls */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <button className="text-xs px-3 py-1 rounded bg-blue-100 text-blue-800 hover:bg-blue-200" onClick={selectAllFeatures}>
                          Select All
                        </button>
                        <button className="text-xs px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200" onClick={deselectAllFeatures}>
                          Deselect All
                        </button>
                        {categories.filter(cat => cat !== 'All').map(category => (
                          <button
                            key={category}
                            className="text-xs px-3 py-1 rounded bg-green-100 text-green-800 hover:bg-green-200"
                            onClick={() => selectCategoryFeatures(category)}
                          >
                            Select {category}
                          </button>
                        ))}
                      </div>

                      {/* Search + Filter */}
                      <div className="flex gap-3">
                        <input
                          type="text"
                          className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
                          placeholder="Search features..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                          className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
                          value={filterCategory}
                          onChange={(e) => setFilterCategory(e.target.value)}
                        >
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Feature List */}
                    <div className="p-4 max-h-96 overflow-y-auto">
                      {Object.keys(featuresByCategory).length === 0 ? (
                        <div className="text-center text-gray-500 py-4">No features match your search</div>
                      ) : (
                        Object.keys(featuresByCategory).map(category => (
                          <div key={category} className="mb-6">
                            <h4 className="font-medium text-gray-800 mb-2">{category}</h4>
                            <div className="space-y-1">
                              {featuresByCategory[category].map(feature => (
                                <div
                                  key={feature._id}
                                  className={`flex items-start gap-3 p-2 rounded-md cursor-pointer transition hover:bg-blue-50 ${newGroup.features.includes(feature._id) ? 'bg-blue-100/60' : ''
                                    }`}
                                  onClick={() => toggleFeatureInGroup(feature._id)}
                                >
                                  <div className={`w-5 h-5 flex items-center justify-center rounded-md border text-white text-xs ${newGroup.features.includes(feature._id)
                                      ? 'bg-blue-600 border-blue-600'
                                      : 'border-gray-300 text-transparent'
                                    }`}>
                                    {newGroup.features.includes(feature._id) && <Check size={14} />}
                                  </div>
                                  <div className="text-sm">
                                    <div className="text-gray-800">{feature.name}</div>
                                    <div className="text-xs text-gray-500">{feature.description}</div>
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
      

          {/* Group List */}
          <div className="w-full space-y-4">
            {roleGroups.length === 0 ? (
              <div className="p-10 text-center text-gray-500 text-base">
                No role groups defined yet. Create your first role group!
              </div>
            ) : (
              roleGroups.map((group) => (
                <div
                  key={group._id || group.id}
                  className="bg-white/50 backdrop-blur-md border border-gray-200 rounded-2xl shadow-md p-6 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg"
                >
                  {/* Title + Actions */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-blue-900">{group.name}</h3>
                      <p className="text-sm text-gray-500">{group.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="p-2 hover:bg-blue-100 rounded-full text-gray-600 hover:text-blue-700 transition"
                        onClick={() => handleEditGroup(group)}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="p-2 hover:bg-red-100 rounded-full text-gray-600 hover:text-red-600 transition"
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
                  <div className="mt-3 text-sm text-indigo-600 font-semibold">
                    {Array.isArray(group.features) ? group.features.length : 0} features assigned
                  </div>

                  {/* Inline Edit Form */}
                  {editingGroupId === (group._id || group.id) && renderEditForm(group)}
                </div>
              ))
            )}
          </div>

        </div>






      </div>
    </>
  );
}