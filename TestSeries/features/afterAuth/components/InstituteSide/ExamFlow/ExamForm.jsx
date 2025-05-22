import React, { useState } from 'react';

const ExamForm = ({ onSubmit }) => {
  const [form, setForm] = useState({ name: '', date: '', total_marks: 100, duration: 60 });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4 mb-6">
      <input name="name" placeholder="Exam Name" className="input" onChange={handleChange} required />
      <input type="date" name="date" className="input" onChange={handleChange} required />
      <input name="total_marks" placeholder="Total Marks" type="number" className="input" onChange={handleChange} />
      <input name="duration" placeholder="Duration (mins)" type="number" className="input" onChange={handleChange} />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Save Exam Info</button>
    </form>
  );
};

export default ExamForm;
