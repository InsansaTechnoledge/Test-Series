import React, { useEffect, useState } from 'react';
import { fetchEventsAnomaly } from '../../../../../../utils/services/proctorService';

const ExamAnomalyControlSection = () => {
  const [anomalies, setAnomalies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchEventsAnomaly();
        setAnomalies(result?.data || []); // Adjust based on your API structure
      } catch (error) {
        console.error("Error fetching anomalies:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Proctor Anomalies</h2>
      {anomalies.length === 0 ? (
        <p className="text-gray-500">No anomalies flagged for review.</p>
      ) : (
        <ul className="space-y-3">
          {anomalies.map((event, index) => (
            <li key={index} className="bg-red-50 p-4 rounded border border-red-200">
              <p><strong>Student ID:</strong> {event.studentId}</p>
              <p><strong>Exam ID:</strong> {event.examId}</p>
              <p><strong>Details:</strong> {event.details}</p>
              <p><strong>Time:</strong> {event.timestamp}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExamAnomalyControlSection;
