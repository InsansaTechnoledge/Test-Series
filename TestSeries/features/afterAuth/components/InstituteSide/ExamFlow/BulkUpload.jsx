import React from 'react';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';

const BulkUpload = ({ setQuestions }) => {
  const handleFile = async (e) => {
    const file = e.target.files[0];
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    const parsed = rows.map((row) => ({
      id: uuidv4(),
      ...row,
      options: typeof row.options === 'string' ? JSON.parse(row.options) : row.options,
      correct_options: typeof row.correct_options === 'string' ? JSON.parse(row.correct_options) : row.correct_options,
      test_cases: typeof row.test_cases === 'string' ? JSON.parse(row.test_cases) : row.test_cases,
    }));

    setQuestions((prev) => [...prev, ...parsed]);
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Upload Questions via Excel</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFile} className="input" />
    </div>
  );
};

export default BulkUpload;
