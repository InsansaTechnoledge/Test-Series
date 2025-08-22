import { useState } from 'react';

export const useQuestionFilters = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterResult, setFilterResult] = useState("all");
  const [viewMode, setViewMode] = useState("detailed");

  return {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterResult,
    setFilterResult,
    viewMode,
    setViewMode,
  };
};

export default useQuestionFilters;
