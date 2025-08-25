import React, { useEffect, useMemo, useState } from "react";
import { getAllStudentData } from "../../../../../utils/services/resultPage";
import { useExams } from "../../../../../hooks/UseExam";
import { SkeletonTable, StatCard, Td, Th, TrHead } from "./UI/UiComponents";
import StudentDetailModal from "./StudentDetailModal";
import { formatDateIST, toNumber } from "./utils/utils";

// --------- main component ----------
const ResultListPage = () => {
  const Exams = useExams(); // expects Exams.data to be an array
  const [selectedExamId, setSelectedExamId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [results, setResults] = useState([]); // array of student result rows
  const [questionMap, setQuestionMap] = useState({}); // id -> question meta
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("studentName");
  const [sortDir, setSortDir] = useState("asc");
  const [detail, setDetail] = useState(null); // student detail modal data

  console.log('dd', results);
  
  const examList = Array.isArray(Exams?.data)
    ? Exams.data.map((e) => ({ id: e.id, name: e.name }))
    : [];

  // initial-select first exam if present
  useEffect(() => {
    if (!selectedExamId && examList.length) {
      setSelectedExamId(examList[0].id);
    }
  }, [examList, selectedExamId]);

  const fetchResults = async (examId) => {
    if (!examId) return;
    setLoading(true);
    setLoadError("");
    try {
      const payload = await getAllStudentData(examId);
      // Support both {data:{...}} and plain {...}
      const bag = payload?.data ?? payload ?? {};
      const enriched = Array.isArray(bag.enrichedResults) ? bag.enrichedResults : [];
      setResults(enriched);
      setQuestionMap(bag.questionMap || {});
    } catch (err) {
      console.error("Failed to load results:", err);
      setLoadError(err?.message || "Failed to fetch results.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults(selectedExamId);
  }, [selectedExamId]);

  const stats = useMemo(() => {
    const total = results.length;
    const attempted = results.filter((r) => r?.status === "attempted" || r?.evaluated).length;
    const evaluated = results.filter((r) => r?.evaluated).length;
    const totalMarks = results.reduce((acc, r) => acc + toNumber(r?.marks), 0);
    const avgMarks = total ? (totalMarks / total).toFixed(2) : 0;
    const maxMarks = results.reduce((m, r) => Math.max(m, toNumber(r?.marks)), 0);
    return { total, attempted, evaluated, avgMarks, maxMarks };
  }, [results]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const base = q
      ? results.filter((r) => {
          const s = `${r?.studentName || ""} ${r?.studentEmail || ""}`.toLowerCase();
          return s.includes(q);
        })
      : results.slice();

    base.sort((a, b) => {
      const get = (obj) => {
        switch (sortKey) {
          case "studentName": return (obj?.studentName || "").toLowerCase();
          case "email": return (obj?.studentEmail || "").toLowerCase();
          case "marks": return toNumber(obj?.marks);
          case "status": return (obj?.status || "").toLowerCase();
          case "date": return new Date(obj?.resultDate || obj?.createdAt || 0).getTime();
          default: return (obj?.studentName || "").toLowerCase();
        }
      };
      const va = get(a);
      const vb = get(b);
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return base;
  }, [results, search, sortKey, sortDir]);

  const onSort = (key) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const badge = (label, tone = "slate") => {
    const toneStyles = {
      slate: "bg-slate-100 text-slate-700 border-slate-200",
      orange: "bg-orange-100 text-orange-700 border-orange-200",
      green: "bg-emerald-100 text-emerald-700 border-emerald-200",
      blue: "bg-indigo-100 text-indigo-700 border-indigo-200",
      indigo: "bg-indigo-100 text-indigo-700 border-indigo-200",
      red: "bg-red-100 text-red-600 border-red-200"
    };
    
    return (
      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border transition-all duration-200 ${toneStyles[tone] || toneStyles.slate}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight bg-indigo-600 bg-clip-text text-transparent">
              Results Dashboard
            </h1>
            <p className="text-sm text-gray-600/70">Review student performance for your exams.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <select
              className="rounded-xl border border-indigo-200 bg-white px-4 py-3 text-sm shadow-lg shadow-indigo-100/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 transition-all duration-200 hover:border-indigo-300"
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
            >
              {examList.map((x) => (
                <option key={x.id} value={x.id}>{x.name}</option>
              ))}
            </select>

            <div className="relative">
              <div className="absolute left-3 top-3.5 text-indigo-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-72 pl-10 pr-12 rounded-xl border border-indigo-200 bg-white py-3 text-sm shadow-lg shadow-indigo-100/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 transition-all duration-200 hover:border-indigo-300"
              />
              <span className="pointer-events-none absolute right-3 top-3.5 text-indigo-300 text-xs font-medium">⌘K</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Students" value={stats.total} />
          <StatCard title="Average Marks" value={stats.avgMarks} />
          <StatCard title="Highest Marks" value={stats.maxMarks} />
        </div>

        {/* Error / Loading / Empty */}
        {loadError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-red-100/50 p-4 shadow-lg shadow-red-100/50">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 text-red-500">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-red-700">{loadError}</span>
            </div>
          </div>
        )}
        
        {loading && <SkeletonTable />}

        {!loading && !results.length && !loadError && (
          <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-gradient-to-br from-indigo-50/30 to-purple-50/20 p-12 text-center shadow-lg shadow-indigo-100/30">
            <div className="w-16 h-16 mx-auto mb-4 text-indigo-300">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm text-indigo-600/70 font-medium">No results found for this exam.</p>
          </div>
        )}

        {/* Table */}
        {!loading && !!results.length && (
          <div className="overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-xl shadow-indigo-100/50">
            <table className="min-w-full divide-y divide-indigo-100">
              <thead>
                <TrHead>
                  <Th onClick={() => onSort("studentName")} active={sortKey === "studentName"} dir={sortDir}>Student</Th>
                  <Th onClick={() => onSort("email")} active={sortKey === "email"} dir={sortDir} className="hidden md:table-cell">Email</Th>
                  <Th onClick={() => onSort("marks")} active={sortKey === "marks"} dir={sortDir}>Marks</Th>
                  {/* <Th onClick={() => onSort("status")} active={sortKey === "status"} dir={sortDir}>Status</Th> */}
                  <Th onClick={() => onSort("date")} active={sortKey === "date"} dir={sortDir} className="hidden lg:table-cell">Result Date</Th>
                  <Th>Details</Th>
                </TrHead>
              </thead>
              <tbody className="divide-y divide-indigo-50 bg-white">
                {filtered.map((r) => {
                  const wrongCount = Array.isArray(r?.wrongAnswers) ? r.wrongAnswers.length : 0;
                  const unattemptedCount = Array.isArray(r?.unattempted) ? r.unattempted.length : 0;

                  return (
                    <tr key={r?._id || r?.studentId} className="hover:bg-gradient-to-r hover:from-indigo-50/40 hover:to-purple-50/20 transition-all duration-200">
                      <Td>
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-300 text-gray-700 text-sm font-bold shadow-md shadow-indigo-100/50">
                            {(r?.studentName || "?").slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{r?.studentName || "-"}</div>
                            {/* <div className="text-xs text-gray-600/70 md:hidden">{r?.studentEmail}</div> */}
                          </div>
                        </div>
                      </Td>

                      <Td className="hidden md:table-cell text-gray-600/80 font-medium">{r?.studentEmail || "-"}</Td>

                      <Td>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-lg text-indigo-700">{toNumber(r?.marks)}</span>
                          <div className="flex gap-2">
                            {wrongCount > 0 && badge(`Wrong: ${wrongCount}`, "red")}
                            {unattemptedCount > 0 && badge(`Unattempted: ${unattemptedCount}`, "slate")}
                          </div>
                        </div>
                      </Td>

                      {/* <Td>
                        {r?.evaluated
                          ? badge("Evaluated", "indigo")
                          : r?.status === "attempted"
                          ? badge("Attempted", "blue")
                          : badge(r?.status || "—", "slate")}
                      </Td> */}

                      <Td className="hidden lg:table-cell text-gray-600/70 font-medium">{formatDateIST(r?.resultDate || r?.createdAt)}</Td>

                      <Td>
                        <button
                          onClick={() => setDetail({ row: r })}
                          className="rounded-xl border border-indigo-200 bg-indigo-400 px-4 py-2 text-sm font-semibold text-gray-100 shadow-md shadow-indigo-100/50 hover:from-indigo-100 hover:to-indigo-200 hover:shadow-lg hover:shadow-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                        >
                          View
                        </button>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Detail Modal */}
        {detail?.row && (
          <StudentDetailModal
            onClose={() => setDetail(null)}
            row={detail.row}
            questionMap={questionMap}
          />
        )}
      </div>
    </div>
  );
};

export default ResultListPage;