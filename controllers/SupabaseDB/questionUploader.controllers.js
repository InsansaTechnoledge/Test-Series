import fs from 'fs';
import xlsx from 'xlsx';
import {
  insertBaseQuestion,
  insertMCQ,
  insertMSQ,
  insertFILL,
  insertTF,
  insertComprehension,
  insertMatch,
  insertCode,
  insertNumerical,
} from '../../SqlQueries/questionUpload.queries.js';
 
export const uploadByType = async (req, res) => {
  const { exam_id, organization_id, question_type, subject, chapter } = req.body;
  const filePath = req.file.path;
 
  try {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);
 
    for (const row of rows) {
      if (row.type !== question_type) {
        throw new Error(`Row type mismatch: Expected ${question_type} but got ${row.type}`);
      }
 
      const { data: base, error: baseErr } = await insertBaseQuestion({
        exam_id,
        organization_id,
        subject,
        chapter,
        question_type,
        difficulty: row.difficulty,
        explanation: row.explanation || null,
        marks: row.marks || 1
      });
      if (baseErr) throw baseErr;
 
      const id = base.id;
 
      switch (question_type) {
        case 'mcq':
          await insertMCQ(id, row);
          break;
        case 'msq':
          await insertMSQ(id, row);
          break;
        case 'fill':
          await insertFILL(id, row);
          break;
        case 'tf':
          await insertTF(id, row);
          break;
        default:
          throw new Error(`Unsupported question type: ${question_type}`);
      }
    }
 
    fs.unlinkSync(filePath);
    res.status(200).json({ message: "Upload successful" });
 
  } catch (e) {
    fs.unlinkSync(filePath);
    res.status(500).json({ message: e.message });
  }
};

export const uploadMixedExcel = async (req, res) => {
  const filePath = req.file.path;
  const { exam_id, organization_id } = req.body;

  const uploadedQuestions = [];

  try {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    for (const row of rows) {
      const { type, subject, chapter, difficulty, explanation, marks = 1 } = row;

      const { data: base, error: baseErr } = await insertBaseQuestion({
        exam_id,
        organization_id,
        subject,
        chapter,
        question_type: type,
        difficulty,
        explanation,
        marks
      });
      if (baseErr) throw baseErr;

      const id = base.id;

      switch (type) {
        case 'mcq':
          await insertMCQ(id, row);
          break;
        case 'msq':
          await insertMSQ(id, row);
          break;
        case 'fill':
          await insertFILL(id, row);
          break;
        case 'tf':
          await insertTF(id, row);
          break;
        case 'match':
          await insertMatch(id, row);
          break;
        case 'comprehension':
          await insertComprehension(id, row);
          break;
        case 'numerical':
          await insertNumerical(id, row);
          break;
        case 'code':
          await insertCode(id, row);
          break;
        default:
          throw new Error(`Unknown question type: ${type}`);
      }

      // Collect question data (you can customize what to include)
      uploadedQuestions.push({
        id,
        type,
        subject,
        chapter,
        difficulty,
        explanation,
        marks
      });
    }

    fs.unlinkSync(filePath);
    res.status(200).json({
      message: "Upload successful",
      uploadedQuestions
    });

  } catch (e) {
    fs.unlinkSync(filePath);
    res.status(500).json({ message: e.message });
  }
};


