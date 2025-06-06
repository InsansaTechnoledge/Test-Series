import Heading from './Heading';
import { Edit, Eye, LucidePlusSquare, NotepadText, PlusSquare, Search, Trash, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import HeadingUtil from '../../utility/HeadingUtil';
import { useNavigate } from 'react-router-dom';
import { useCachedBatches } from '../../../../hooks/useCachedBatches';
import RefreshButton from '../../utility/RefreshButton';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '../../../../contexts/currentUserContext';
import BackButton from '../../../constants/BackButton';
import DeleteBatchModal from '../../utility/DeleteBatchModal';
import { useCachedUser } from '../../../../hooks/useCachedUser';
import { useCachedStudents } from '../../../../hooks/useCachedStudents';

const BatchList = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { batches, isloading, isError } = useCachedBatches();
  const { users } = useCachedUser();
  const { students } = useCachedStudents();

//   const [filteredBatches, setFilteredBatches] = useState(batches);
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

  return (
    <>
      <div className='h-full flex flex-col'>
        <HeadingUtil heading={selectedYear ? `Batch List for ${selectedYear}` : "All Batches"} description="you can view list of all batches in your institute" />

        <div className='rounded-xl p-5 bg-gray-200 inset-shadow-md flex-grow flex flex-col overflow-auto'>
          <div className='flex flex-col lg:flex-row justify-between gap-4 mb-5'>
            <h2 className='font-bold text-lg text-blue-900 my-auto'>Total Batches: {filteredBatches?.length}</h2>
            <div className='flex flex-col md:flex-row gap-4'>
              <RefreshButton refreshFunction={refreshFunction} />
              <button
                className='bg-blue-900 text-white py-2 px-4 rounded-md hover:scale-105 flex space-x-2 transition-all duration-300'
                onClick={() => navigate('/institute/create-batch')}
              >
                <span>Create Batch</span>
                <PlusSquare />
              </button>
              <select
                className='rounded-md bg-white py-2 px-4'
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value={""}>--select year--</option>
                {uniqueYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <label className='space-x-2 flex rounded-md bg-white py-2 px-4'>
                <Search />
                <input className='focus:outline-0' placeholder='search batch' />
              </label>
            </div>
          </div>

          {/* Batch list */}
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-blue-950">
              <thead className="text-xs text-center uppercase bg-gray-50">
                <tr>
                  <th className="w-2/10 px-6 py-3">Batch name</th>
                  <th className="w-1/10 px-6 py-3">Year</th>
                  <th className="w-2/10 px-6 py-3">Syllabus</th>
                  <th className="w-2/10 px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBatches?.map((batch, idx) => (
                  <tr key={idx} className="bg-white border-b hover:bg-gray-50 text-blue-600 text-lg">
                    <th className="px-6 py-4 font-medium whitespace-nowrap">{batch.name}</th>
                    <td className="px-6 py-4 text-center">{batch.year}</td>
                    <td className="px-6 py-4">
                      {batch.syllabus_id ? (
                        <button
                          onClick={() => navigate(`/institute/syllabus/${batch.syllabus_id}`)}
                          className="flex space-x-2 hover:underline"
                        >
                          <NotepadText />
                          <span>View Syllabus</span>
                        </button>
                      ) : (
                        <div className="flex space-x-2 text-yellow-500">
                          <AlertTriangle />
                          <div>
                            <span className='text-red-400'>Not applicable</span>
                            <p className='text-xs text-gray-400'>batch type is only subject</p>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="flex justify-center gap-4 px-6 py-4">
                      <button
                        className="text-black bg-gray-200 py-1 px-4 rounded-lg hover:underline"
                        onClick={() => navigate(`/institute/batch-details`, { state: { batchId: batch.id } })}
                      >
                        <Eye />
                      </button>
                      <button
                        className="text-blue-500 bg-gray-200 py-1 px-4 rounded-lg hover:underline"
                        onClick={() => navigate(`/institute/edit-batch`, { state: { batchId: batch.id } })}
                      >
                        <Edit />
                      </button>
                      <button
                        className="text-red-500 bg-gray-200 py-1 px-4 rounded-lg hover:underline"
                        onClick={() => {
                          setShowDeleteModal(true);
                          setBatchId(batch.id);
                        }}
                      >
                        <Trash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {showDeleteModal && (
              <DeleteBatchModal
                batchId={batchId}
                faculties={users.filter(user => user.batch.includes(batchId)).map(f => f._id)}
                students={students.filter(student => student.batch.currentBatch === batchId).map(s => s._id)}
                setShowDeleteModal={setShowDeleteModal}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BatchList;
