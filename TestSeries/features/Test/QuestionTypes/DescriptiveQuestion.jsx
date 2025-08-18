import React from 'react'

const DescriptiveQuestion = ({ selectedQuestion, option, setOption }) => {
    const min = selectedQuestion?.min_words ?? null;
    const max = selectedQuestion?.max_words ?? null;
    const words = (option || "").trim().split(/\s+/).filter(Boolean).length;
  
    const withinMin = min == null || words >= min;
    const withinMax = max == null || words <= max;
  
    return (
      <div className="p-4 space-y-3">
        <p className="text-sm opacity-70">
          {min && max && `Write between ${min}–${max} words.`}
          {!min && max && `Write up to ${max} words.`}
          {min && !max && `Write at least ${min} words.`}
        </p>
  
        <textarea
          className="w-full p-3 rounded border"
          rows={8}
          placeholder="Type your answer here..."
          value={option || ""}
          onChange={(e) => setOption(e.target.value)}
        />
  
        <div className="text-sm">
          Word count:{" "}
          <span className={`${withinMin && withinMax ? "text-green-600" : "text-red-600"}`}>
            {words}
          </span>
          {max != null && words > max && (
            <span className="ml-2 text-red-600">({words - max} over)</span>
          )}
        </div>
      </div>
    );
  };
  
  export default DescriptiveQuestion;
  
