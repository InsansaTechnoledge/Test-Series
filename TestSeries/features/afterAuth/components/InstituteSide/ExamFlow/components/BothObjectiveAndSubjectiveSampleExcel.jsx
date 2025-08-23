import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export const BothObjectiveAndSubjectiveSampleExcel = () => {
  const sampleData = [
    {
      type: "mcq",
      question_text: "What is the capital of France?",
      options: JSON.stringify(["Paris", "Berlin", "Madrid", "Rome"]),
      correct_option: 0,
      subject: "Geography",
      chapter: "Europe",
      difficulty: "easy",
      positive_marks: 1,
      negative_marks: 0,
      bloom_level: "remember",
    },
    {
      type: "msq",
      question_text: "Which of the following are fruits?",
      options: JSON.stringify(["Apple", "Potato", "Banana", "Tomato"]),
      correct_options: JSON.stringify([0, 2, 3]),
      bloom_level: "understand",
    },
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
      type: "tf",
      question_text: "The earth is flat.",
      is_true: false,
      bloom_level: "understand",
    },
    {
      type: "match",
      question_text: "Match the countries with their capitals.",
      left_items: JSON.stringify(["India", "Germany", "Japan"]),
      right_items: JSON.stringify(["New Delhi", "Berlin", "Tokyo"]),
      correct_pairs: JSON.stringify({
        India: "New Delhi",
        Germany: "Berlin",
        Japan: "Tokyo",
      }),
      bloom_level: "analyze",
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
