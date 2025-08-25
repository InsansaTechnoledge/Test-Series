import React, { useEffect, useMemo } from "react";
import { Codeish, EmptyLine, SummaryPill } from "./UI/UiComponents";
import { formatDateIST, toNumber } from "./utils/utils";

const StudentDetailModal = ({ onClose, row, questionMap }) => {
  const wrongAnswers = Array.isArray(row?.wrongAnswers) ? row.wrongAnswers : [];
  const unattempted = Array.isArray(row?.unattempted) ? row.unattempted : [];

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Normalize answers for comparison (handles strings, numbers, arrays, JSON, CSV)
  const normalizeAnswer = (val) => {
    if (val === null || val === undefined) return null;

    // If it's already an array/object, normalize
    const normalizeObj = (obj) =>
      JSON.stringify(
        Object.keys(obj)
          .sort()
          .reduce((acc, k) => {
            acc[k] = obj[k];
            return acc;
          }, {})
      ).toLowerCase();

    const normalizeArr = (arr) =>
      arr.map((x) => String(x).trim().toLowerCase()).sort().join("||");

    // Try to coerce from string
    if (typeof val === "string") {
      const trimmed = val.trim();
      // Attempt JSON first
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return normalizeArr(parsed);
        if (parsed && typeof parsed === "object") return normalizeObj(parsed);
      } catch {
        /* not JSON */
      }
      // CSV fallback
      if (trimmed.includes(",")) {
        return normalizeArr(trimmed.split(","));
      }
      return trimmed.toLowerCase();
    }

    if (Array.isArray(val)) return normalizeArr(val);
    if (typeof val === "object") return normalizeObj(val);
    return String(val).trim().toLowerCase();
  };

  const actuallyWrong = useMemo(() => {
    return wrongAnswers.filter((w) => {
      const q = questionMap?.[w?.questionId] || null;
      const correct = q?.correct_answer ?? q?.answer ?? q?.correct ?? null;
      return normalizeAnswer(w?.response) !== normalizeAnswer(correct);
    });
  }, [wrongAnswers, questionMap]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <button
        aria-label="Close"
        onClick={onClose}
        className="fixed inset-0 bg-gradient-to-br from-indigo-900/30 via-black/40 to-purple-900/30"
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-4xl max-h-[85vh] overflow-auto rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl shadow-indigo-900/20 border border-indigo-100">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-indigo-100 p-6 bg-gradient-to-r from-white via-indigo-50/30 to-white backdrop-blur-sm">
          <div className="space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600/70">
              Student Details
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700 text-sm font-bold shadow-md shadow-indigo-100/50">
                {(row?.studentName || "?").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-indigo-900">
                  {row?.studentName}
                </h3>
                <p className="text-sm text-indigo-600/70 font-medium">
                  {row?.studentEmail}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-indigo-100 px-4 py-2.5 text-sm font-semibold text-indigo-700 shadow-md shadow-indigo-100/50 hover:from-indigo-100 hover:to-indigo-200 hover:shadow-lg hover:shadow-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close
            </div>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-8 bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/10">
          {/* Top summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryPill label="Marks" value={toNumber(row?.marks)} />
            <SummaryPill
              label="Status"
              value={row?.evaluated ? "Evaluated" : row?.status || "-"}
            />
            <SummaryPill label="Wrong Answers" value={actuallyWrong.length} />
            <SummaryPill label="Unattempted" value={unattempted.length} />
          </div>

          {/* Wrong answers list */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-100 to-rose-100 flex items-center justify-center">
                <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-800">Wrong Answers</h4>
              {actuallyWrong.length > 0 && (
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                  {actuallyWrong.length} {actuallyWrong.length === 1 ? "question" : "questions"}
                </span>
              )}
            </div>

            {!actuallyWrong.length ? (
              <EmptyLine text={`${!unattempted.length ? 'No wrong answers - Perfect score!' : 'No wrong answers - look below for unattempted!' } `} />
            ) : (
              <div className="space-y-4">
                {actuallyWrong.map((w, idx) => {
                  const q = questionMap?.[w?.questionId] || null;
                  const title =
                    q?.question_text || q?.text || q?.title || `Question ${idx + 1}`;
                  const correct = q?.correct_answer ?? q?.answer ?? q?.correct ?? null;

                  return (
                    <div
                      key={`${w?.questionId}-${idx}`}
                      className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-red-50/50 p-5 shadow-md shadow-rose-100/50"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-rose-600">{idx + 1}</span>
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="text-sm font-semibold text-rose-900 leading-relaxed">
                            {title}
                          </div>
                          <div className="space-y-2">
                            <div className="text-xs text-rose-800/90">
                              <span className="font-bold text-rose-700">{row?.studentName}'s Response:</span>{" "}
                              <Codeish value={w?.response} />
                            </div>
                            {correct !== null && (
                              <div className="text-xs text-emerald-800/90">
                                <span className="font-bold text-emerald-700">Correct Answer:</span>{" "}
                                <Codeish value={correct} />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Unattempted list */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-slate-100 to-gray-100 flex items-center justify-center">
                <svg className="w-3 h-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-800">Unattempted Questions</h4>
              {unattempted.length > 0 && (
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  {unattempted.length} {unattempted.length === 1 ? "question" : "questions"}
                </span>
              )}
            </div>

            {!unattempted.length ? (
              <EmptyLine text="All questions were attempted!" />
            ) : (
              <div className="grid gap-3">
                {unattempted.map((qid, i) => {
                  const q = questionMap?.[qid] || null;
                  const title = q?.question_text || q?.text || q?.title || qid;
                  return (
                    <div
                      key={`${qid}-${i}`}
                      className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-gray-50/50 px-4 py-3 shadow-sm shadow-slate-100/50 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-slate-600">{i + 1}</span>
                        </div>
                        <div className="text-sm font-medium text-slate-800 leading-relaxed">
                          {title}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Footer */}
          <div className="pt-4 border-t border-indigo-100">
            <div className="flex items-center gap-2 text-xs text-gray-600/70">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Result recorded:</span>
              <span className="font-semibold">
                {formatDateIST(row?.resultDate || row?.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;
