import React, { useState } from "react";

export default function KeywordsChips({
  value,
  onChange,
  inputClass,
  labelClass
}) {
  const [draft, setDraft] = useState("");
  const keywords = Array.isArray(value) ? value : [];

  const commit = () => {
    const v = draft.trim();
    if (!v) return;
    const next = Array.from(new Set([...(keywords || []), v]));
    onChange?.(next);
    setDraft("");
  };

  const remove = (k) => {
    onChange?.((keywords || []).filter(x => x !== k));
  };

  return (
    <div>
      <label className={labelClass}>Keywords</label>
      <div className="flex gap-2 mt-2">
        <input
          className={inputClass}
          placeholder="Type keyword and press Enter"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" ? (e.preventDefault(), commit()) : null}
        />
        <button
          type="button"
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700"
          onClick={commit}
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {(keywords || []).map(k => (
          <span
            key={k}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border"
          >
            {k}
            <button
              type="button"
              className="text-red-600 hover:text-red-700"
              onClick={() => remove(k)}
              aria-label={`Remove ${k}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
