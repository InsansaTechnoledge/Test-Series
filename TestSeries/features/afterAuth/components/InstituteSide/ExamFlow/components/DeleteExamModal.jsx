import React, { useState } from 'react';
import { deleteExam } from '../../../../../../utils/services/examService';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '../../../../../../contexts/currentUserContext';
import { useNavigate } from 'react-router-dom';

const DeleteExamModal = ({ examId, setShowDeleteModal }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const orgId = user?.role === 'organization'
    ? user?._id
    : (user?.organizationId?._id || user?.organizationId); 

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Normalize the incoming examId so it works for both string and object
  const normalizedExamId = React.useMemo(() => {
    if (!examId) return null;
    if (typeof examId === 'string') return examId;
    if (typeof examId === 'object') {
      return examId.id || examId.exam_id || examId._id || null;
    }
    return null;
  }, [examId]);

  const handleDelete = async () => {
    if (!normalizedExamId) {
      console.error('❌ Missing exam id');
      return;
    }
    try {
      setLoading(true);
      await deleteExam(normalizedExamId);
      setShowDeleteModal(false);
      if (orgId) queryClient.invalidateQueries(['pendingExams', orgId]);
      navigate('/institute/exam-list');
    } catch (error) {
      console.error('Error deleting exam:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 text-center">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Delete Exam</h2>
        <p className="text-gray-600 mb-6">Are you sure you want to delete this exam?</p>
        <p className="text-sm text-gray-500 mb-4">
          This will remove the exam and all associated data.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setShowDeleteModal(false)}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded transition-colors"
            disabled={loading || !normalizedExamId}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteExamModal;
