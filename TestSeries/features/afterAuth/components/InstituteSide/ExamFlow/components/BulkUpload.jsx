import React, { useState } from "react";
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";
import { generateSampleExcel } from "./SampleExcel";
import { ObjectiveSampleExcel } from "./ObjectiveSampleExcel";
import { SubjectiveSampleExcel } from "./SubjectiveSampleExcel";
import { BothObjectiveAndSubjectiveSampleExcel } from "./BothObjectiveAndSubjectiveSampleExcel";
import { Upload, Download } from "lucide-react";
import { useTheme } from "../../../../../../hooks/useTheme";
import { validateBloom } from "../../../../../../utils/services/bloomClient";

const BulkUpload = ({ setQuestions, organizationId, examType }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const { theme } = useTheme();

  const handleDownloadSample = () => {
    switch (examType?.toLowerCase()) {
      case "objective":
        ObjectiveSampleExcel();
        break;
      case "subjective":
        SubjectiveSampleExcel();
        break;
      case "semi_subjective":
        BothObjectiveAndSubjectiveSampleExcel();
        break;
      default:
        generateSampleExcel();
    }
  };

  // single helper (no duplicates)
  const parseJsonField = (field) => {
    if (field == null || field === "") return [];
    if (typeof field === "string") {
      try { return JSON.parse(field); } catch { return field; }
    }
    return field;
  };

  // normalize descriptive limits to ALWAYS satisfy DB CHECK
  const normalizeDescriptiveLimits = (row) => {
    // accept several possible column names from Excel
    const rawMin =
      row.min_words ??
      row.minWords ??
      null;

    const rawMax =
      row.max_words ??
      row.maxWords ??
      row.word_limits ??   // allow legacy/single column
      row.wordLimit ??
      null;

    const parsedMin = Number(rawMin);
    const parsedMax = Number(rawMax);

    let min_words =
      Number.isFinite(parsedMin) && parsedMin >= 0 ? parsedMin : 0;

    let max_words;
    if (Number.isFinite(parsedMax) && parsedMax > 0) {
      max_words = parsedMax;
    } else {
      // hard default to pass the constraint
      max_words = 200;
    }

    // ensure min <= max
    if (min_words > max_words) {
      // prefer keep max, reset min to 0
      min_words = 0;
    }

    return { min_words, max_words };
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadResult(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      if (rows.length === 0) {
        setUploadResult({ success: false, message: "No data found in the spreadsheet." });
        setIsUploading(false);
        return;
      }

      const parsed = await Promise.all(
        rows.map(async (row) => {
          const qtype = row.type?.toLowerCase();
          const base = {
            id: uuidv4(),
            organization_id: organizationId,
            type: qtype,
            question_type: qtype,
            question_text: row.question_text || "",
            explanation: row.explanation || "",
            difficulty: row.difficulty?.toLowerCase() || "easy",
            positive_marks: Number(row.positive_marks) || 1,
            negative_marks: Number(row.negative_marks) || 0,
            subject: row.subject || "",
            chapter: row.chapter || "",
            bloom_level: row.bloom_level?.toLowerCase() || "",
          };

          // Bloom validation (best-effort)
          if (base.bloom_level && base.question_text) {
            try {
              const { isValid, matchedLevel } = await validateBloom(base.question_text, base.bloom_level);
              base.bloom_match = isValid;
              base.detected_level = matchedLevel;
            } catch {
              base.bloom_match = null;
              base.detected_level = "error";
            }
          } else {
            base.bloom_match = null;
            base.detected_level = "missing";
          }

          // Type-specific mapping
          if (qtype === "mcq" || qtype === "msq") {
            base.options = parseJsonField(row.options);
          }
          if (qtype === "mcq") {
            base.correct_option = Number(row.correct_option) || 0;
          }
          if (qtype === "msq") {
            base.correct_options = parseJsonField(row.correct_options);
          }
          if (qtype === "fill" || qtype === "numerical") {
            base.correct_answer = row.correct_answer || "";
          }
          if (qtype === "tf") {
            base.is_true = row.is_true === true || row.is_true === "true";
          }
          if (qtype === "code") {
            base.test_cases = parseJsonField(row.test_cases);
          }
          if (qtype === "match") {
            base.left_items = parseJsonField(row.left_items);
            base.right_items = parseJsonField(row.right_items);
            base.correct_pairs =
              typeof row.correct_pairs === "string" ? JSON.parse(row.correct_pairs) : (row.correct_pairs || {});
          }
          if (qtype === "comprehension") {
            base.passage = row.passage || "";
            base.sub_question_ids = parseJsonField(row.sub_question_ids);
          }
          if (qtype === "descriptive") {
            const { min_words, max_words } = normalizeDescriptiveLimits(row);
            base.min_words = min_words;
            base.max_words = max_words;
          }

          return base;
        })
      );

      setQuestions((prev) => [...prev, ...parsed]);

      const mismatches = parsed
        .filter((q) => q.bloom_match === false)
        .map((q, idx) => ({
          index: idx + 1,
          question: q.question_text,
          expected: q.bloom_level,
          detected: q.detected_level,
        }));

      setUploadResult({
        success: true,
        message: `✅ Imported ${parsed.length} questions. ❌ ${mismatches.length} did not match Bloom level.`,
        mismatches,
      });

      e.target.value = null;
    } catch (error) {
      console.error("Error processing Excel file:", error);
      setUploadResult({
        success: false,
        message: "Error processing Excel file. Please ensure it has the correct format.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className={` shadow-md rounded-2xl p-6 space-y-6 ${
        theme == "light" ? "bg-white/70 border border-gray-200" : "bg-gray-700 border border-gray-200"
      } `}
    >
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
          <Upload className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className={`font-semibold text-xl ${theme == "light" ? "text-gray-900" : "text-gray-300"}`}>
            Upload Excel File
          </h3>
          <p className={`font-semibold ${theme == "light" ? "text-gray-700" : "text-gray-300"}`}>
            Upload multiple questions at once using an Excel spreadsheet.
          </p>
        </div>
      </div>

      <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-400 transition">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFile}
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <p className="text-gray-500 text-sm">Click to select a file or drag it here</p>
      </div>

      {isUploading && <div className="text-sm text-blue-600"><p>Processing file...</p></div>}

      {uploadResult && (
        <div
          className={`mt-1 p-3 rounded-lg text-sm font-medium ${
            uploadResult.success ? "bg-green-50 text-green-700 border border-green-200"
                                 : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {uploadResult.message}
        </div>
      )}

      {uploadResult?.mismatches?.length > 0 && (
        <div className="mt-4 bg-red-50 border border-red-200 p-4 rounded-lg text-sm text-red-700 space-y-2">
          <p className="font-semibold">⚠️ Bloom Level Mismatches:</p>
          <ul className="list-disc list-inside space-y-1">
            {uploadResult.mismatches.map((item, idx) => (
              <li key={idx}>
                <span className="font-semibold">Q{item.index}:</span> {item.question}
                <br />
                <span className="ml-4">
                  Expected: <strong>{item.expected}</strong> | Detected: <strong>{item.detected}</strong>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div
        className={` rounded-lg p-4 text-sm space-y-2 ${
          theme == "light" ? "bg-yellow-50 border border-yellow-300 text-gray-700"
                           : "bg-gray-600 border text-gray-100"
        } `}
      >
        <p className={`font-semibold ${theme == "light" ? "text-orange-600" : "text-orange-500"}`}>
          Excel File Format Requirements:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Required columns: <code>type</code>, <code>question_text</code></li>
          <li>For MCQs: options as JSON array <code>["Option 1", "Option 2", ...]</code></li>
          <li>Correct MCQ index: <code>correct_option</code> (0-based)</li>
          <li>Optional: <code>subject</code>, <code>chapter</code>, <code>difficulty</code>, <code>marks</code></li>
          <li>For Match: <code>left_items</code>, <code>right_items</code>, <code>correct_pairs</code> (e.g., {'{"1":"A","2":"C"}'})</li>
          <li>For Comprehension: add <code>passage</code> and <code>sub_question_ids</code> as JSON array</li>
          <li>For Descriptive: provide <code>min_words</code> and <code>max_words</code> (or a single <code>word_limits</code> number)</li>
        </ul>
      </div>

      <div className="space-y-2">
        <p className={`font-semibold ${theme == "light" ? "text-gray-700" : "text-gray-300"}`}>
          Download the Excel file, fill in the questions, and upload it.
        </p>
        <button
          onClick={handleDownloadSample}
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
        >
          <Download className="w-4 h-4" />
          <span>Download Sample Excel</span>
        </button>
      </div>
    </div>
  );
};

export default BulkUpload;
