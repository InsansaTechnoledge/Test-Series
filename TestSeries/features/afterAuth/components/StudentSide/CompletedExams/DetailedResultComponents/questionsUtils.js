export const getQuestionTypeLabel = (type) => {
  const types = {
    mcq: "Multiple Choice",
    msq: "Multiple Select",
    fill: "Fill in the Blank",
    tf: "True/False",
    numerical: "Numerical",
    code: "Coding",
    match: "Match the Following",
    comprehension: "Comprehension",
    descriptive: "Descriptive", // Added descriptive type
  };
  return types[type] || type.toUpperCase();
};

export const getDifficultyBadgeClass = (difficulty, theme) => {
  if (theme === "dark") {
    switch (difficulty) {
      case "easy":
        return "bg-green-900 text-green-300 border-green-700";
      case "medium":
        return "bg-yellow-900 text-yellow-300 border-yellow-700";
      case "hard":
        return "bg-red-900 text-red-300 border-red-700";
      default:
        return "bg-gray-800 text-gray-300 border-gray-600";
    }
  } else {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }
};