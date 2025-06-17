import Heading from './Heading';
import { Edit, Eye, LucidePlusSquare, NotepadText, PlusSquare, Search, Trash, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import HeadingUtil from '../../utility/HeadingUtil';
import { useNavigate } from 'react-router-dom';
import { useCachedBatches } from '../../../../hooks/useCachedBatches';
import RefreshButton from '../../utility/RefreshButton';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '../../../../contexts/currentUserContext';
import DeleteBatchModal from '../../utility/DeleteBatchModal';
import { useCachedUser } from '../../../../hooks/useCachedUser';
import { useCachedStudents } from '../../../../hooks/useCachedStudents';

const BatchList = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { batches, isloading, isError } = useCachedBatches();
  const { users } = useCachedUser();
  const { students } = useCachedStudents();

  const [selectedYear, setSelectedYear] = useState('');
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [batchId, setBatchId] = useState(null);

  const refreshFunction = async () => {
    await queryClient.invalidateQueries(['batches', user._id]);
  };

  const uniqueYears = [...new Set(batches.map(batch => batch.year))];

  const filteredBatches = selectedYear
    ? batches.filter(batch => batch.year === parseInt(selectedYear))
    : batches;


    const HeadingStyle = {
      h1: {
        WebkitTextStroke: '3px white',
        WebkitTextFillColor: 'transparent',
        backgroundColor: 'transparent',
      }
    };
    

  return (
    <div className="min-h-screen ">
      {/* Header Section */}
      <div className="w-full bg-gray-800 py-4 px-3 rounded-3xl ">
       
          <h1 style={HeadingStyle.h1} className='text-7xl font-bold text-center'> All Batches</h1>
        
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats and Controls Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Stats */}
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-50 p-3 rounded-xl">
                  <div className="text-2xl font-bold text-indigo-600">{filteredBatches?.length}</div>
                  <div className="text-sm text-gray-600">Total Batches</div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center gap-3">
                <RefreshButton refreshFunction={refreshFunction} />
                
                <button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center space-x-2"
                  onClick={() => navigate('/institute/create-batch')}
                >
                  <PlusSquare className="w-4 h-4" />
                  <span>Create Batch</span>
                </button>

                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  onChange={(e) => setSelectedYear(e.target.value)}
                  value={selectedYear}
                >
                  <option value="">All Years</option>
                  {uniqueYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Search batches..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Batches Grid/Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Batch Details
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Syllabus
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBatches?.map((batch, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                          <span className="text-indigo-600 font-semibold text-sm">
                            {batch.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{batch.name}</div>
                          <div className="text-sm text-gray-500">Batch ID: {batch.id}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {batch.year}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      {batch.syllabus_id ? (
                        <button
                          onClick={() => navigate(`/syllabus/${batch.syllabus_id}`)}
                          className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          <NotepadText className="w-4 h-4" />
                          <span className="text-sm font-medium">View Syllabus</span>
                        </button>
                      ) : (
                        <div className="inline-flex items-center space-x-2 text-amber-600">
                          <AlertTriangle className="w-4 h-4" />
                          <div>
                            <span className="text-sm font-medium text-red-500">Not applicable</span>
                            <p className="text-xs text-gray-400">batch type is only subject</p>
                          </div>
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex justify-center space-x-2">
                        <button
                          className="p-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 hover:scale-105"
                          onClick={() => navigate(`/institute/batch-details`, { state: { batchId: batch.id } })}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <button
                          className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors duration-200 hover:scale-105"
                          onClick={() => navigate(`/institute/edit-batch`, { state: { batchId: batch.id } })}
                          title="Edit Batch"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button
                          className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200 hover:scale-105"
                          onClick={() => {
                            setShowDeleteModal(true);
                            setBatchId(batch.id);
                          }}
                          title="Delete Batch"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredBatches?.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No batches found</h3>
              <p className="text-gray-500 mb-6">
                {selectedYear ? `No batches found for year ${selectedYear}` : 'Get started by creating your first batch'}
              </p>
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg inline-flex items-center space-x-2"
                onClick={() => navigate('/institute/create-batch')}
              >
                <PlusSquare className="w-4 h-4" />
                <span>Create First Batch</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteBatchModal
          batchId={batchId}
          faculties={users.filter(user => user.batch.includes(batchId)).map(f => f._id)}
          students={students.filter(student => student.batch.currentBatch === batchId).map(s => s._id)}
          setShowDeleteModal={setShowDeleteModal}
        />
      )}
    </div>
  );
};

export default BatchList;