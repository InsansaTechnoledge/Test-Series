import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteBatch } from '../../../utils/services/batchService';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '../../../contexts/currentUserContext';

const DeleteBatchModal = ({ batchId, faculties,students, setShowDeleteModal }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient=useQueryClient();
  const {user}=useUser();

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response= await deleteBatch(batchId, faculties,students);
      if (response.status === 200) {
        alert('Batch deleted successfully.');
        setShowDeleteModal(false);
        await queryClient.invalidateQueries(['batches',user._id]); 
        await queryClient.invalidateQueries(['Students',user._id]);
        await queryClient.invalidateQueries(['Users',user._id]);
        navigate(-1); 
      }
    } catch (error) {
      console.error('Error deleting batch:', error);
      alert('Failed to delete batch.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 text-center">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Delete Batch</h2>
        <p className="text-gray-600 mb-6">Are you sure you want to delete this batch?</p>
        <p className="text-sm text-gray-500 mb-4">
          This will remove the batch and all associated data, including students.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBatchModal;
