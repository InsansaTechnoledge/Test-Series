import { useState, useEffect } from 'react';
import { getResultDetail } from '../../../../../../utils/services/resultPage';

export const useResultData = (examId, resultId) => {
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResultData = async () => {
      try {
        setLoading(true);
        const data = await getResultDetail(examId, false, resultId);
        console.log("Fetched Result Data:", data);
        setResultData(data.data);
      } catch (err) {
        setError(err.message || "Failed to fetch result data");
      } finally {
        setLoading(false);
      }
    };

    if (examId) {
      fetchResultData();
    }
  }, [examId, resultId]);

  return { resultData, loading, error };
};

export default useResultData;
