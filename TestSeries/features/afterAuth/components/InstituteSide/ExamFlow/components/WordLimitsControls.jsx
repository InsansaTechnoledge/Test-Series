import React from "react";

export default function WordLimitsControls({
  minWords,
  maxWords,
  onChange,
  inputClass,
  labelClass,
  hintClass
}) {
  const set = (patch) => onChange?.(patch);

  const invalid =
    (minWords != null && maxWords != null && Number(minWords) > Number(maxWords)) ||
    (maxWords != null && Number(maxWords) <= 0) ||
    (minWords != null && Number(minWords) < 0) ||
    (minWords == null && maxWords == null);

  return (
    <div>
      <label className={labelClass}>Word Limits</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <input
          type="number"
          min={0}
          className={inputClass}
          placeholder="Min words (optional)"
          value={minWords ?? ""}
          onChange={(e) => set({ min_words: e.target.value === "" ? null : Number(e.target.value) })}
        />
        <input
          type="number"
          min={1}
          className={inputClass}
          placeholder="Max words (optional)"
          value={maxWords ?? ""}
          onChange={(e) => set({ max_words: e.target.value === "" ? null : Number(e.target.value) })}
        />
      </div>
      <p className={hintClass || "text-sm mt-2"}>
        {invalid
          ? "Provide at least one limit. Min ≤ Max; Max must be > 0."
          : (minWords && maxWords)
              ? `Answer must be between ${minWords}–${maxWords} words.`
              : (minWords != null)
                ? `Answer must be at least ${minWords} words.`
                : `Answer must be up to ${maxWords} words.`}
      </p>
    </div>
  );
}
