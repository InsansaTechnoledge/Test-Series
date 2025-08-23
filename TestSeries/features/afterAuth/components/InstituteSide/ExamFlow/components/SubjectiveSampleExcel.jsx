import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export const SubjectiveSampleExcel = () => {
  const sampleData = [
    {
      type: "fill",
      question_text: "______ is the chemical symbol for water.",
      correct_answer: "H2O",
      bloom_level: "remember",
    },
    {
      type: "numerical",
      question_text: "What is 5 + 3?",
      correct_answer: "8",
      bloom_level: "apply",
    },
    {
      type: "descriptive",
      question_text: "Explain the theory of relativity.",
      min_words: 0,
      max_words: 200,    
      bloom_level: "understand",
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sample Questions");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, "sample_questions_template.xlsx");
};
