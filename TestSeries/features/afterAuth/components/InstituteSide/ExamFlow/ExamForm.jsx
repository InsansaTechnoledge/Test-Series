import React, { useState } from 'react';
import { addExamAPI } from '../../../../../utils/services/questionUploadService';
import { useUser } from '../../../../../contexts/currentUserContext';
import { useCachedBatches } from '../../../../../hooks/useCachedBatches';

const ExamForm = ({ onSubmit }) => {
  const { user } = useUser();
  const { batches = [] } = useCachedBatches();

  const [form, setForm] = useState({
    name: '',
    date: '',
    total_marks: '',
    duration: '',
    batch_id: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      organization_id: user?.user?._id   // ✅ Inject orgId here reliably
    };

    if (!payload.organization_id) {
      alert("Missing organization ID. Please try again.");
      return;
    }

    try {
      const response = await addExamAPI(payload);
      onSubmit(response.data);
    } catch (error) {
      console.error('Error creating exam:', error);
      alert('Failed to create exam.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <label className="block text-gray-800 font-semibold mb-1">Choose a name for your exam</label>
      <input
        name="name"
        placeholder="Exam Name"
        className="input w-full p-2 border rounded"
        value={form.name}
        onChange={handleChange}
        required
      />

      <label className="block text-gray-800 font-semibold mb-1">Schedule your exam</label>
      <input
        type="datetime-local"
        name="date"
        className="input w-full p-2 border rounded"
        value={form.date}
        onChange={handleChange}
        required
      />

      <label className="block text-gray-800 font-semibold mb-1">Total Marks</label>
      <input
        name="total_marks"
        placeholder="Total Marks"
        type="number"
        className="input w-full p-2 border rounded"
        value={form.total_marks}
        onChange={handleChange}
      />

      <label className="block text-gray-800 font-semibold mb-1">Duration (minutes)</label>
      <input
        name="duration"
        placeholder="Duration"
        type="number"
        className="input w-full p-2 border rounded"
        value={form.duration}
        onChange={handleChange}
      />

      <label className="block text-gray-800 font-semibold mb-1">Select Batch</label>
      <select
        name="batch_id"
        className="input w-full p-2 border rounded"
        value={form.batch_id}
        onChange={handleChange}
        required
      >
        <option value="">-- Select Batch --</option>
        {batches.map(batch => (
          <option key={batch.id} value={batch.id}>
            {batch.name} - {batch.year}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Save Exam Info
      </button>
    </form>
  );
};

export default ExamForm;
