import { useState, useEffect } from 'react';

import { useCachedResultExamData } from '../../../../../../hooks/useResultExamData';

export const useResultData = (examId, resultId) => {
  const [resultData, setResultData] = useState(null);
  const { data, isLoading, isError } = useCachedResultExamData(examId, false, resultId);

  useEffect(() => {
    if (!isLoading && !isError) {
      setResultData(data);
    }
  }, [data, isLoading, isError]);

  return { resultData, loading: isLoading, error: isError };
};

export default useResultData;
