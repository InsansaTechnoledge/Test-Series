import React, {useState} from 'react';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import { generateSampleExcel } from './SampleExcel';
const BulkUpload = ({ setQuestions }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState(null);
    
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
              type: row.type?.toLowerCase(),
              question_text: row.question_text || '',
              explanation: row.explanation || '',
              difficulty: row.difficulty || 'easy',
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
      <div className="space-y-4">
        <input 
          type="file" 
          accept=".xlsx, .xls" 
          onChange={handleFile} 
          disabled={isUploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        
        {isUploading && (
          <div className="mt-2 text-blue-600">
            <p>Processing file...</p>
          </div>
        )}
        
        {uploadResult && (
          <div className={`mt-2 p-2 rounded ${uploadResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {uploadResult.message}
          </div>
        )}
        
        <div className="mt-4 bg-yellow-50 p-3 rounded text-sm">
          <p className="font-medium">Excel File Format Requirements:</p>
          <ul className="list-disc list-inside mt-1 space-y-1 text-gray-700">
            <li>Required columns: type, question_text</li>
            <li>For MCQs: Add options as JSON array ["Option 1", "Option 2", ...]</li>
            <li>Add correct_option index (0-based) for MCQs</li>
            <li>Optional: subject, chapter, difficulty, marks</li>
            <li>For Match the Following: add left_items and right_items as JSON arrays, and correct_pairs as JSON object (e.g., ("1": "A", "2": "C"))</li>
            <li>For Comprehension: add <code>passage</code> as text, and <code>sub_question_ids</code> as JSON array of sub-questions</li>



          </ul>

        </div>
          <div>Sample Excel format Dwonload </div>
          <p>Download the excel , fill the questions in it and then upload it </p>

          <button
            onClick={generateSampleExcel}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
            Download Sample Excel
          </button>

      </div>
    );
  };
  
export default BulkUpload;
