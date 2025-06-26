import React, {useState} from 'react';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import { generateSampleExcel } from './SampleExcel';
import { Upload, FileSpreadsheet, Download, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useTheme } from '../../../../../hooks/useTheme';
const BulkUpload = ({ setQuestions, organizationId }) => {
  const [isUploading, setIsUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState(null);
    const {theme} = useTheme()
    
    // const handleFile = async (e) => {
    //   const file = e.target.files[0];
    //   if (!file) return;
      
    //   setIsUploading(true);
    //   setUploadResult(null);
      
    //   try {
    //     const data = await file.arrayBuffer();
    //     const workbook = XLSX.read(data);
    //     const sheet = workbook.Sheets[workbook.SheetNames[0]];
    //     const rows = XLSX.utils.sheet_to_json(sheet);
  
    //     if (rows.length === 0) {
    //       setUploadResult({ 
    //         success: false, 
    //         message: "No data found in the spreadsheet." 
    //       });
    //       setIsUploading(false);
    //       return;
    //     }
  
    //     const parsed = rows.map((row) => {
    //       // Handle parsing potential JSON strings
    //       const parseJsonField = (field) => {
    //         if (!field) return [];
    //         if (typeof field === 'string') {
    //           try {
    //             return JSON.parse(field);
    //           } catch (e) {
    //             return field;
    //           }
    //         }
    //         return field;
    //       };
  
    //       return {
    //         id: uuidv4(),
    //         ...row,
    //         options: parseJsonField(row.options),
    //         correct_options: parseJsonField(row.correct_options),
    //         test_cases: parseJsonField(row.test_cases),
    //         marks: Number(row.marks) || 1,
    //         correct_option: Number(row.correct_option) || 0,
    //       };
    //     });
  
    //     setQuestions((prev) => [...prev, ...parsed]);
    //     setUploadResult({ 
    //       success: true, 
    //       message: `Successfully imported ${parsed.length} questions.` 
    //     });
    //     e.target.value = null; // Reset file input
    //   } catch (error) {
    //     console.error("Error processing Excel file:", error);
    //     setUploadResult({ 
    //       success: false, 
    //       message: "Error processing Excel file. Please ensure it has the correct format." 
    //     });
    //   } finally {
    //     setIsUploading(false);
    //   }
    // };
  
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
            setUploadResult({ 
              success: false, 
              message: "No data found in the spreadsheet." 
            });
            setIsUploading(false);
            return;
          }
      
          const parseJsonField = (field) => {
            if (!field) return [];
            if (typeof field === 'string') {
              try {
                return JSON.parse(field);
              } catch (e) {
                return field;
              }
            }
            return field;
          };
      
          const parsed = rows.map((row) => {
            const base = {
              id: uuidv4(),
              organization_id: organizationId, // ✅ add this!
              type: row.type?.toLowerCase(),
              question_type: row.type?.toLowerCase(),
              question_text: row.question_text || '',
              explanation: row.explanation || '',
              difficulty: row.difficulty?.toLowerCase() || 'easy',
              positive_marks: Number(row.positive_marks) || 1,
              negative_marks: Number(row.negative_marks) || 0,
              subject: row.subject || '',
              chapter: row.chapter || ''
            };
         // not ideal for actual decimal data

      
            // Type-specific logic
            if (base.type === 'mcq' || base.type === 'msq') {
              base.options = parseJsonField(row.options);
            }
      
            if (base.type === 'mcq') {
              base.correct_option = Number(row.correct_option) || 0;
            }
      
            if (base.type === 'msq') {
              base.correct_options = parseJsonField(row.correct_options);
            }
      
            if (base.type === 'fill' || base.type === 'numerical') {
              base.correct_answer = row.correct_answer || '';
            }
      
            if (base.type === 'tf') {
              base.is_true = row.is_true === true || row.is_true === 'true';
            }
      
            if (base.type === 'code') {
              base.test_cases = parseJsonField(row.test_cases);
            }
      
            // if (base.type === 'match') {
            //   base.left_items = parseJsonField(row.left_items);
            //   base.right_items = parseJsonField(row.right_items);
            //   base.correct_pairs = typeof row.correct_pairs === 'string'
            //     ? JSON.parse(row.correct_pairs)
            //     : row.correct_pairs;
            // }

            if (base.type === 'match') {
                const leftItems = parseJsonField(row.left_items);
                const rightItems = parseJsonField(row.right_items);
                const correctPairs = typeof row.correct_pairs === 'string'
                  ? JSON.parse(row.correct_pairs)
                  : row.correct_pairs;
              
                base.left_items = leftItems;
                base.right_items = rightItems;
                base.correct_pairs = correctPairs || {};
              }
              
              
      

            if (base.type === 'comprehension') {
                base.passage = row.passage || '';
                base.sub_question_ids = parseJsonField(row.sub_question_ids);
            }
              
            return base;
          });
      
          setQuestions((prev) => [...prev, ...parsed]);
          setUploadResult({ 
            success: true, 
            message: `Successfully imported ${parsed.length} questions.` 
          });
          e.target.value = null;
        } catch (error) {
          console.error("Error processing Excel file:", error);
          setUploadResult({ 
            success: false, 
            message: "Error processing Excel file. Please ensure it has the correct format." 
          });
        } finally {
          setIsUploading(false);
        }
      };
      
    return (
  
      <div
      
      
      className={` shadow-md rounded-2xl p-6 space-y-6   ${theme == 'light' ?"bg-white/70 border border-gray-200" : "bg-gray-700 border border-gray-200"} `}
      >
  {/* Header with Icon */}
  <div className="flex items-start space-x-4">
    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
      <Upload className="w-6 h-6 text-white" />
    </div>
    <div>
      <h3   className={`font-semibold text-xl  ${theme == 'light' ?"text-gray-900" : "text-gray-300"} `}>Upload Excel File</h3>
      <p className={`font-semibold  ${theme == 'light' ?"text-gray-700" : "text-gray-300"} `}>
        Upload multiple questions at once using an Excel spreadsheet.
      </p>
    </div>
  </div>

  {/* File Upload */}
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

  {/* Uploading Indicator */}
  {isUploading && (
    <div className="text-sm text-blue-600">
      <p>Processing file...</p>
    </div>
  )}

  {/* Upload Result */}
  {uploadResult && (
    <div
      className={`mt-1 p-3 rounded-lg text-sm font-medium ${
        uploadResult.success
          ? 'bg-green-50 text-green-700 border border-green-200'
          : 'bg-red-50 text-red-700 border border-red-200'
      }`}
    >
      {uploadResult.message}
    </div>
  )}

  {/* Format Guidelines */}
  <div
  
  
  
  className={` rounded-lg p-4 text-sm space-y-2   ${theme == 'light' ?"bg-yellow-50 border border-yellow-300  text-gray-700" : "bg-gray-600 border text-gray-100 "} `}
  
  >
    <p className={`font-semibold  ${theme == 'light' ?"text-orange-600" : "text-orange-500"} `}
    
    
    
    
    
    
    
    
    
    >Excel File Format Requirements:</p>
    <ul className="list-disc list-inside space-y-1">
      <li>Required columns: <code>type</code>, <code>question_text</code></li>
      <li>For MCQs: options as JSON array <code>["Option 1", "Option 2", ...]</code></li>
      <li>Correct MCQ index: <code>correct_option</code> (0-based)</li>
      <li>Optional: <code>subject</code>, <code>chapter</code>, <code>difficulty</code>, <code>marks</code></li>
      <li>For Match the Following: use <code>left_items</code>, <code>right_items</code>, and <code>correct_pairs</code> (e.g., {"{\"1\":\"A\",\"2\":\"C\"}"})</li>
      <li>For Comprehension: add <code>passage</code> as text, and <code>sub_question_ids</code> as JSON array</li>
    </ul>
  </div>

  {/* Sample Download */}
  <div className="space-y-2">
    <p className={`font-semibold  ${theme == 'light' ?"text-gray-700" : "text-gray-300"} `}>Download the Excel file, fill in the questions, and upload it.</p>
    <button
      onClick={generateSampleExcel}
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
