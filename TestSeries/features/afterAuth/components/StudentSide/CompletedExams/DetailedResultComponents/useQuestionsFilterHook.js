import { useState } from 'react';

export const useQuestionFilters = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterResult, setFilterResult] = useState("all");

  return {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterResult,
    setFilterResult,
  };
};

export default useQuestionFilters;
