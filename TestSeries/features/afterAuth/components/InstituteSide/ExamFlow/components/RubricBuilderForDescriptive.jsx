import React, { useMemo, useState } from "react";
import { Plus, X, Info, ChevronDown, ChevronUp } from "lucide-react";

// Mock UUID function for demo
const generateId = () => Math.random().toString(36).substr(2, 9);

export default function RubricBuilder({
  value,
  onChange,
  inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors",
  labelClass = "text-lg font-semibold text-gray-900",
  cardClass = "bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
}) {
  const rubric = value || { criteria: [], total_marks: 0 };

  const total = useMemo(
    () => (rubric.criteria || []).reduce((a, c) => a + (Number(c.max_marks) || 0), 0),
    [rubric.criteria]
  );

  const [showInfo, setShowInfo] = useState(false);

  const update = (next) => onChange?.(next);

  const recalc = (criteria) => ({
    criteria,
    total_marks: (criteria || []).reduce((a, c) => a + (Number(c.max_marks) || 0), 0),
  });

  const addCriterion = () => {
    const nextCriteria = [
      ...(rubric.criteria || []),
      { id: generateId(), name: "", max_marks: 1, description: "" }
    ];
    update(recalc(nextCriteria));
  };

  const updateCriterion = (id, patch) => {
    const nextCriteria = (rubric.criteria || []).map(c => c.id === id ? { ...c, ...patch } : c);
    update(recalc(nextCriteria));
  };

  const removeCriterion = (id) => {
    const nextCriteria = (rubric.criteria || []).filter(c => c.id !== id);
    update(recalc(nextCriteria));
  };

  const applyTemplate = (tpl) => {
    const templates = {
      shortAnswer: [
        { name: "Concept explained", max_marks: 5, description: "Correct definition / core idea" },
        { name: "Example/reasoning", max_marks: 3, description: "Relevant example or reasoning" },
        { name: "Clarity & structure", max_marks: 2, description: "Well-organized, concise" },
      ],
      essay: [
        { name: "Introduction & thesis", max_marks: 4, description: "Clear stance and scope" },
        { name: "Depth & analysis", max_marks: 8, description: "Accurate, insightful arguments" },
        { name: "Evidence/examples", max_marks: 6, description: "Relevant support, citations" },
        { name: "Organization & style", max_marks: 2, description: "Flow, transitions, tone" },
      ],
    };
    const chosen = templates[tpl].map(c => ({ id: generateId(), ...c }));
    update(recalc(chosen));
  };

  return (
    <div className={cardClass}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className={labelClass}>Rubric Builder</h2>
          <button
            type="button"
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            aria-expanded={showInfo}
          >
            <Info size={16} />
            {showInfo ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
          <span className="text-sm text-gray-600">Total:</span>
          <span className="font-semibold text-indigo-600">{total} marks</span>
        </div>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">What is a rubric?</h3>
          <p className="text-sm text-blue-800 mb-3">
            A rubric is a scoring guide that breaks down assessment criteria into specific, 
            measurable components. This ensures consistent and transparent grading.
          </p>
          <div className="grid md:grid-cols-3 gap-3 text-xs text-blue-700">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
              <span>Define clear criteria for evaluation</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
              <span>Assign marks to each criterion</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
              <span>Guide consistent grading practices</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Templates */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-4 mb-3">
          <span className="text-sm font-medium text-gray-700">Quick Start Templates:</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => applyTemplate("shortAnswer")}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Short Answer
            <span className="px-2 py-0.5 bg-indigo-500 rounded text-xs">10 marks</span>
          </button>
          <button
            type="button"
            onClick={() => applyTemplate("essay")}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Essay Format
            <span className="px-2 py-0.5 bg-indigo-500 rounded text-xs">20 marks</span>
          </button>
        </div>
      </div>

      {/* Criteria List */}
      <div className="space-y-4 mb-6">
        {(rubric.criteria || []).map((criterion, idx) => (
          <div
            key={criterion.id}
            className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all duration-200 hover:shadow-sm"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              {/* Criterion Name */}
              <div className="lg:col-span-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Criterion Name
                </label>
                <input
                  className={inputClass}
                  placeholder={`e.g., Content Knowledge`}
                  value={criterion.name}
                  onChange={(e) => updateCriterion(criterion.id, { name: e.target.value })}
                />
              </div>

              {/* Max Marks */}
              <div className="lg:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Max Marks
                </label>
                <input
                  type="number"
                  min={0}
                  className={inputClass}
                  placeholder="0"
                  value={criterion.max_marks}
                  onChange={(e) => updateCriterion(criterion.id, { max_marks: Number(e.target.value) })}
                />
              </div>

              {/* Description */}
              <div className="lg:col-span-5">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  className={inputClass}
                  placeholder="What should graders look for?"
                  value={criterion.description || ""}
                  onChange={(e) => updateCriterion(criterion.id, { description: e.target.value })}
                />
              </div>

              {/* Remove Button */}
              <div className="lg:col-span-1 flex lg:justify-end">
                <button
                  type="button"
                  className="flex items-center justify-center w-9 h-9 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 group-hover:opacity-100 lg:opacity-0"
                  onClick={() => removeCriterion(criterion.id)}
                  aria-label={`Remove criterion ${idx + 1}`}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {(rubric.criteria || []).length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus size={20} className="text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No criteria yet</h3>
            <p className="text-gray-600 mb-4">Start building your rubric by adding evaluation criteria.</p>
            <button
              type="button"
              onClick={addCriterion}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus size={16} />
              Add Your First Criterion
            </button>
          </div>
        )}

        {/* Add Criterion Button */}
        {(rubric.criteria || []).length > 0 && (
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={addCriterion}
              className="flex items-center gap-2 px-4 py-2 text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-all duration-200"
            >
              <Plus size={16} />
              Add Criterion
            </button>
            <div className="text-sm text-gray-500">
              {(rubric.criteria || []).length} criterion • {total} total marks
            </div>
          </div>
        )}
      </div>

      {/* Preview */}
      {(rubric.criteria || []).length > 0 && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Grading Preview</h3>
            <p className="text-sm text-gray-600 mt-1">How graders will see this rubric</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Criterion
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Max Marks
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(rubric.criteria || []).map((criterion) => (
                  <tr key={criterion.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {criterion.name || <span className="text-gray-400 italic">Unnamed</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {criterion.description || <span className="text-gray-400 italic">No description</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium">
                      {Number(criterion.max_marks) || 0}
                    </td>
                  </tr>
                ))}
                <tr className="bg-indigo-50 border-t-2 border-indigo-200">
                  <td className="px-4 py-3 text-sm font-semibold text-indigo-900">
                    Total Marks
                  </td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 text-sm text-right font-bold text-indigo-900">
                    {total}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}