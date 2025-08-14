import React from "react";

/**
 * Reusable options component for MCQ/MSQ with unified indigo styling.
 *
 * Props:
 * - mode: "single" | "multi"         // default: "single"
 * - options: string[]                // list of option texts
 * - value: number | number[] | null  // single: index or null; multi: array of indices
 * - onChange: (newValue) => void     // single: number; multi: number[]
 * - theme: "light" | "dark"          // affects unselected styling
 * - questionId: string | number      // used to scope input ids/names
 * - optionLabels?: string[]          // default: ["A.", "B.", "C.", "D."] (auto-extends if needed)
 * - className?: string               // wrapper extra classes
 */
export default function QuestionOptions({
  mode = "single",
  options = [],
  value = mode === "single" ? null : [],
  onChange,
  theme = "light",
  questionId = "q",
  optionLabels,
  className = "",
}) {
  const labels =
    optionLabels && optionLabels.length
      ? optionLabels
      : Array.from({ length: Math.max(4, options.length || 0) }, (_, i) =>
          String.fromCharCode(65 + i) + "."
        );

  const isMulti = mode === "multi";

  const handleToggle = (idx) => {
    if (isMulti) {
      const arr = Array.isArray(value) ? [...value] : [];
      const i = arr.indexOf(idx);
      if (i >= 0) arr.splice(i, 1);
      else arr.push(idx);
      onChange?.(arr);
    } else {
      onChange?.(idx);
    }
  };

  if (!Array.isArray(options) || options.length === 0) {
    return (
      <div className={`text-red-500 font-bold ${className}`}>
        No options available for this question.
      </div>
    );
  }

  return (
    <div className={`mt-4 space-y-2 ${className}`}>
      {options.map((opt, idx) => {
        const checked = isMulti
          ? Array.isArray(value) && value.includes(idx)
          : value === idx;

        const base =
          "flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 group";

        // Unified indigo styling for both modes - no borders
        const selectedStyle = 
          "bg-indigo-100 text-indigo-700 font-semibold shadow-sm";
        
        const lightUnselected = 
          " hover:bg-indigo-50/50 text-gray-700";
        
        const darkUnselected = 
          "hover:bg-indigo-900/30 text-gray-300";

        const wrapperClass = [
          base,
          checked
            ? selectedStyle
            : theme === "light"
            ? lightUnselected
            : darkUnselected,
        ].join(" ");

        const inputType = isMulti ? "checkbox" : "radio";
        const name = `option-${questionId}`;
        const id = `option-${idx}-${questionId}`;

        return (
          <label key={idx} htmlFor={id} className={wrapperClass}>
            <input
              type={inputType}
              id={id}
              name={name}
              checked={checked}
              onChange={() => handleToggle(idx)}
              value={opt}
              className="w-5 h-5 accent-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
            />
            <span className={`font-bold text-sm w-8 ${
              checked 
                ? "text-indigo-600" 
                : theme === "light" 
                ? "text-gray-500 group-hover:text-indigo-400" 
                : "text-gray-400 group-hover:text-indigo-300"
            }`}>
              {labels[idx] ?? `${idx + 1}.`}
            </span>
            <span className={`flex-1 text-md leading-relaxed ${
              checked 
                ? "text-indigo-700 font-medium" 
                : ""
            }`}>
              {opt}
            </span>

            {checked && (
              <div className="ml-auto flex items-center justify-center w-6 h-6 bg-indigo-500 rounded-full">
                <svg
                  className="w-3.5 h-3.5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </label>
        );
      })}
    </div>
  );
}