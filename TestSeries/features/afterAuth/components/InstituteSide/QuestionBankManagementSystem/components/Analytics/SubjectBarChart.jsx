import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartContainer from './constants/ChartContainer';

const SubjectBarChart = ({ data }) => {
  const subjectData = React.useMemo(() => {
    const counts = {};
    data.forEach(q => {
      const subject = q.subject || 'Unknown';
      counts[subject] = (counts[subject] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([subject, count]) => ({ subject, count }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  return (
    <ChartContainer title="Questions by Subject">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={subjectData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="subject" 
            angle={-45}
            textAnchor="end"
            height={100}
            fontSize={12}
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default SubjectBarChart
