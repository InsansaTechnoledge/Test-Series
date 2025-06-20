import Heading from './Heading';
import { Edit, Eye, PlusSquare, NotepadText, Search, Trash, AlertTriangle, Calendar, Users, BookOpen, Sparkles, Zap, Target } from 'lucide-react';
import { useEffect, useState } from 'react';
import HeadingUtil from '../../utility/HeadingUtil';
import { useCachedBatches } from '../../../../hooks/useCachedBatches';
import RefreshButton from '../../utility/RefreshButton';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '../../../../contexts/currentUserContext';
import DeleteBatchModal from '../../utility/DeleteBatchModal';
import { useCachedUser } from '../../../../hooks/useCachedUser';
import { useCachedStudents } from '../../../../hooks/useCachedStudents';
import BatchBanner from '../../../../assests/Institute/Banner 1 1.svg'
import { useNavigate } from 'react-router-dom';
import { usePageAccess } from '../../../../contexts/PageAccessContext';


const BatchList = () => {
  const canAccessPage = usePageAccess();

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

  const navigate = useNavigate();
  const { user } = useUser();
  const { batches, isloading, isError } = useCachedBatches();
  const { users } = useCachedUser();
  const { students } = useCachedStudents();


  const [selectedYear, setSelectedYear] = useState('');
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [batchId, setBatchId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const refreshFunction = async () => {
    await queryClient.invalidateQueries(['batches', user._id]);
  };

  const uniqueYears = [...new Set(batches.map(batch => batch.year))];

  // Handle View Button Click
  const handleViewBatch = (batchId) => {
    navigate(`/institute/batch-details`, { state: { batchId: batchId } });
  };

  // Handle Edit Button Click
  const handleEditBatch = (batchId) => {
    console.log("edit clicked")
    navigate(`/institute/edit-batch`, { state: { batchId: batchId } });
  };

  // Handle Delete Button Click
  const handleDeleteBatch = (batchId) => {
    setShowDeleteModal(true);
    setBatchId(batchId);
  };

  // Handle Delete Confirmation
  const confirmDeleteBatch = async () => {
    try {
      // Add your delete API call here
      // await deleteBatch(batchId);
      console.log('Deleting batch:', batchId);
      
      // Refresh data after deletion
      await refreshFunction();
      
      // Close modal
      setShowDeleteModal(false);
      setBatchId(null);
    } catch (error) {
      console.error('Error deleting batch:', error);
    }
  };

  const HeadingStyle = {
    h1: {
      WebkitTextStroke: '3px white',
      WebkitTextFillColor: 'transparent',
      backgroundColor: 'transparent',
    }
  };
  
  const filteredBatches = batches.filter(batch => {
    const yearMatch = selectedYear ? batch.year === parseInt(selectedYear) : true;
    const searchMatch = batch.name.toLowerCase().includes(searchTerm.toLowerCase());
    return yearMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
    
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 "></div>
        <div className="absolute inset-0  opacity-20"></div>
        
        
        <div
          className="relative z-10 px-6 py-24 text-center bg-cover bg-center bg-no-repeat rounded-xl"
          style={{ backgroundImage: `url(${BatchBanner})` }}
        >
          <div className="inline-flex items-center space-x-3 mb-4">
            <h1 className="text-6xl md:text-7xl font-black text-white tracking-tight">
              All Batches
            </h1>
         
          </div>  
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-medium">
            View details of all batches
          </p>
        </div>

      </div>

      {/* Stats Dashboard */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-xl border-l-4 border-indigo-600 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Batches</p>
                <p className="text-4xl font-black text-indigo-600">{filteredBatches?.length}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-2xl">
                {/* <Target className="w-8 h-8 text-indigo-600" /> */}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 shadow-xl border-l-4 border-gray-600 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Active Years</p>
                <p className="text-4xl font-black text-gray-600">{uniqueYears.length}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-2xl">
                {/* <Calendar className="w-8 h-8 text-gray-600" /> */}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 shadow-xl border-l-4 border-indigo-600 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Search Results</p>
                <p className="text-4xl font-black text-indigo-600">{filteredBatches.length}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-2xl">
                {/* <Search className="w-8 h-8 text-indigo-600" /> */}
              </div>
            </div>
          </div>
          
         
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  className="bg-gray-50 border-2 border-gray-200 text-gray-900 rounded-2xl pl-12 pr-6 py-3 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 w-80"
                  placeholder="Search batches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select
                className="bg-gray-50 border-2 border-gray-200 text-gray-900 rounded-2xl px-6 py-3 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 font-medium"
                onChange={(e) => setSelectedYear(e.target.value)}
                value={selectedYear}
              >
                <option value="">All Years</option>
                {uniqueYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-bold transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center space-x-3 transform"
              onClick={() => navigate('/institute/create-batch')}
            >
              <PlusSquare className="w-5 h-5" />
              <span>Create Batch</span>
            </button>
          </div>
        </div>

        {/* Batch Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredBatches?.map((batch, idx) => (
            <div 
              key={batch.id || idx} 
              className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden"
              style={{
                animationDelay: `${idx * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              {/* Gradient Header */}
             
              <div className="h-16 bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-t-2xl relative overflow-hidden shadow-md">

  <div className="inset-0 bg-indigo-100 bg-opacity-5 backdrop-blur-sm"></div>
<div className='flex justify-between items-center p-6 '>
<div className="">
    <h3 className="text-white font-bold text-xl leading-snug line-clamp-2">
    {batch.name}
    </h3>
  </div>

  <div className="">
    <div className="bg-white text-indigo-700 text-xs font-bold px-3 py-1 rounded-full shadow backdrop-blur-md border border-white border-opacity-30 flex items-center gap-1">
      {batch.year}
    </div>
  </div>

  
  


</div>



</div>

              {/* Card Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="bg-gray-100 px-3 py-1 rounded-full">
                      <span className="text-xs font-bold text-gray-600">Batch-ID: {batch.id}</span>
                    </div>
                  </div>
                </div>

                {/* Syllabus Status */}
                <div className="mb-6">
                  {batch.syllabus_id ? (
                    <button 
                      onClick={() => navigate(`/syllabus/${batch.syllabus_id}`)}
                      className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100"
                    >
                      <NotepadText className="w-4 h-4" />
                      <span className="text-sm font-bold">View Syllabus</span>
                    </button>
                  ) : (
                    <div className="inline-flex items-center space-x-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-xl">
                      <AlertTriangle className="w-4 h-4" />
                      <div>
                        <span className="text-sm font-bold"> Syllabus Not applicable</span>
                        <p className="text-xs text-gray-400">batch type is only subject</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-3">
                  <button
                    className="flex-1 z-10 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                    onClick={() => handleViewBatch(batch.id)}
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="font-medium text-sm">View</span>
                  </button>
                  
                  <button
                    className="flex-1 z-10 cursor-pointer bg-indigo-100 hover:bg-indigo-200 text-indigo-700 p-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                    onClick={() => handleEditBatch(batch.id)}
                    title="Edit Batch"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="font-medium text-sm">Edit</span>
                  </button>
                  
                  <button
                    className="bg-red-100 z-10 cursor-pointer hover:bg-red-200 text-red-700 p-3 rounded-xl transition-all duration-300 hover:scale-105"
                    onClick={() => handleDeleteBatch(batch.id)}
                    title="Delete Batch"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-gray-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl"></div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBatches?.length === 0 && (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto bg-gradient-to-r from-indigo-100 to-gray-100 rounded-full flex items-center justify-center mb-8 animate-bounce">
              <Search className="w-12 h-12 text-indigo-400" />
            </div>
            <h3 className="text-3xl font-black text-gray-800 mb-4">No batches found</h3>
            <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
              {selectedYear ? `No batches found for year ${selectedYear}` : searchTerm ? `No batches match "${searchTerm}"` : 'Get started by creating your first batch'}
            </p>
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-bold transition-all duration-300 hover:shadow-2xl hover:scale-105 inline-flex items-center space-x-3"
              onClick={() => navigate('/institute/create-batch')}
            >
              <PlusSquare className="w-5 h-5" />
              <span>Create First Batch</span>
            </button>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteBatchModal
          batchId={batchId}
          faculties={users?.filter(user => user.batch?.includes(batchId)).map(f => f._id) || []}
          students={students?.filter(student => student.batch?.currentBatch === batchId).map(s => s._id) || []}
          setShowDeleteModal={setShowDeleteModal}
          onDeleteConfirm={confirmDeleteBatch}
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
  );
};

export default BatchList;