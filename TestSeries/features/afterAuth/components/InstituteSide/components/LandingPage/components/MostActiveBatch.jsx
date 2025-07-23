import { Award, Calendar } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const MostActiveBatch = ({ theme, examBatchAnalytics, batchMap }) => {
  const isDark = theme === 'dark';
  const [groupedByBatch, setGroupedByBatch] = useState({});

  useEffect(() => {
  const grouped = Object.values(
    examBatchAnalytics.reduce((acc, item) => {
      if (!acc[item.batch_id]) {
        acc[item.batch_id] = { batch_id: item.batch_id, exams: 0 };
      }
      acc[item.batch_id].exams += item.exams;
      return acc;
    }, {})
  );

  const maxBatch = grouped.reduce(
    (max, batch) => (batch.exams > max.exams ? batch : max),
    { batch_id: null, exams: -Infinity }
  );

  setGroupedByBatch(maxBatch);
}, [examBatchAnalytics]);

console.log('Grouped By Batch:', groupedByBatch);


  return (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-indigo-100'} rounded-2xl p-6 border`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-gray-100' : 'text-indigo-600'}`}>
          <Award className="w-5 h-5" />
          Most Active Batch
        </h3>
        <Calendar className="w-5 h-5 text-indigo-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className={`${isDark ? 'bg-gray-700' : 'bg-white'} rounded-xl p-4 text-center shadow-sm`}>
          <div className={`text-xl font-bold ${isDark ? 'text-indigo-100' : 'text-indigo-600'} `}>{batchMap?.[groupedByBatch?.batch_id]?.name}</div>
          <div className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Most Active Batch
          </div>
        </div>

        {/* Card 2 */}
        <div className={`${isDark ? 'bg-gray-700' : 'bg-white'} rounded-xl p-4 text-center shadow-sm`}>
          <div className="text-2xl font-bold text-green-600">94%</div>
          <div className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Attendance Rate
          </div>
        </div>

        {/* Card 3 */}
        <div className={`${isDark ? 'bg-gray-700' : 'bg-white'} rounded-xl p-4 text-center shadow-sm`}>
          <div className="text-2xl font-bold text-blue-600">{groupedByBatch.exams}</div>
          <div className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Exams Completed
          </div>
        </div>
      </div>
    </div>
  );
};

export default MostActiveBatch;
