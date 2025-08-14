import React, { useMemo, useState } from "react";

/**
 * Generic input for text / numeric answers with theme-aware styles.
 *
 * Props:
 * - value: string
 * - onChange: (val: string) => void
 * - questionId: string | number   // required to scope id/for
 * - label?: string                // default: "Your Answer"
 * - placeholder?: string
 * - theme?: "light" | "dark"      // controls styles
 * - variant?: "text" | "numeric"  // default: "text"
 * - className?: string            // wrapper classes
 * - inputClassName?: string       // input element classes
 * - maxLength?: number
 * - allowClear?: boolean          // default: true
 * - validate?: (val: string) => string | null // return error msg or null
 */
export default function AnswerInput({
  value = "",
  onChange,
  questionId,
  label = "Your Answer",
  placeholder = "Type your answer here...",
  theme = "light",
  variant = "text",
  className = "",
  inputClassName = "",
  maxLength,
  allowClear = true,
  validate,
}) {
  const [touched, setTouched] = useState(false);

  const error = useMemo(() => {
    if (!validate) return null;
    return validate(value || "");
  }, [validate, value]);

  const handleChange = (e) => {
    let next = e.target.value;

    if (variant === "numeric") {
      // Allow empty, "-", "-.", ".", digits with optional leading "-",
      // optional single decimal point. Keep user typing friendly.
      const ok =
        /^-?$/.test(next) ||
        /^-?\.$/.test(next) ||
        /^-?\d*\.?\d*$/.test(next);

      if (!ok) return; // ignore invalid keystroke
    }

    if (maxLength && next.length > maxLength) next = next.slice(0, maxLength);
    onChange?.(next);
  };

  const commonLabelClass =
    theme === "light" ? "text-gray-700" : "text-gray-300";

  const commonInputClass =
    theme === "light"
      ? "bg-white text-gray-900 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400"
      : "bg-gray-800 text-white border-indigo-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500";

  const errorClass =
    theme === "light"
      ? "text-red-600"
      : "text-red-400";

  const borderErrorClass =
    theme === "light"
      ? "border-red-400 focus:border-red-500 focus:ring-red-400"
      : "border-red-500 focus:border-red-500 focus:ring-red-500";

  const id = `${variant}-answer-${questionId}`;

  return (
    <div className={`mt-6 ${className}`}>
      <label
        htmlFor={id}
        className={`block text-lg font-semibold mb-2 ${commonLabelClass}`}
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode={variant === "numeric" ? "decimal" : "text"}
          pattern={variant === "numeric" ? "-?\\d*\\.?\\d*" : undefined}
          value={value || ""}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
          placeholder={placeholder}
          className={[
            "w-full px-5 py-2 rounded-lg border-2 shadow-sm text-md transition-all duration-200 outline-none",
            commonInputClass,
            touched && error ? borderErrorClass : "",
            inputClassName,
          ].join(" ")}
          aria-invalid={Boolean(touched && error)}
          aria-describedby={touched && error ? `${id}-error` : undefined}
        />

        {allowClear && value && (
          <button
            type="button"
            onClick={() => onChange?.("")}
            aria-label="Clear input"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm px-2 py-0.5 rounded-md border hover:opacity-90"
          >
            ×
          </button>
        )}
      </div>

      {touched && error && (
        <p id={`${id}-error`} className={`mt-2 text-sm ${errorClass}`}>
          {error}
        </p>
      )}
    </div>
  );
}
