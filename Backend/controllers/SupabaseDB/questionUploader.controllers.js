import fs from "fs";
import { insertBaseQuestion, insertCode, insertComprehension, insertFILL, insertMatch, insertMCQ, insertMSQ, insertNumerical, insertTF } from "../../utils/SqlQueries/questionUpload.queries.js";
import { mapQuestionData } from "../../utils/questionUtils/questionMapping.js";
import parseExcel from "../../utils/questionUtils/readExcelFile.js";
import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js";
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";

//uploading the questions foe all types
const uploadedQuestions = async (questionTypeData) => {

  const insertPromises = [];

  const insertFunctions = {
    mcq: insertMCQ,
    msq: insertMSQ,
    fill: insertFILL,
    tf: insertTF,
    match: insertMatch,
    comprehension: insertComprehension,
    numerical: insertNumerical,
    code: insertCode
  };

  for (const [type, questions] of Object.entries(questionTypeData)) {
    if (questions.length && insertFunctions[type]) {
      insertPromises.push(insertFunctions[type](questions));
    }
  }

  const questions = await Promise.all(insertPromises);
  return questions;
}

export const uploadMixedExcel = async (req, res) => {
  const filePath = req.file.path;
  const { exam_id, organization_id } = req.body;

  try {
    const rows = parseExcel(filePath);
    const baseQuestions = [];
    let questionTypeData = {
      mcq: [],
      msq: [],
      fill: [],
      tf: [],
      match: [],
      comprehension: [],
      numerical: [],
      code: []
    };

    rows.forEach((row) => {
      const { type, subject, chapter, difficulty, explanation, marks } = row;
      baseQuestions.push({
        exam_id,
        organization_id,
        subject,
        chapter,
        question_type: type,
        difficulty,
        explanation,
        marks
      });

    });
    const insertedBases = await insertBaseQuestion(baseQuestions);

    insertedBases.forEach((base, index) => {
      const baseId = base.id;
      questionTypeData[base.question_type] = mapQuestionData(rows[index], rows[index].type, baseId);

    });

    const questions = await uploadedQuestions(questionTypeData);

    fs.unlinkSync(filePath); // Delete the file after processing

    new APIResponse(200, { insertedBases, questions }, "Questions uploaded successfully").send(res);



  } catch (err) {
    console.log("something went wrong", err);
    new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while uploading the excel by question types", err.message || ""]).send(res);
  }
};


export const uploadByType = async (req, res) => {
  const filePath = req.file.path;
  const { exam_id, organization_id, type } = req.body;

  try {
    const rows = parseExcel(filePath);

    const baseQuestions = [];
    let questionTypeData = {
      mcq: [],
      msq: [],
      fill: [],
      tf: [],
      match: [],
      comprehension: [],
      numerical: [],
      code: []
    };

    rows.forEach((row) => {
      const { subject, chapter, difficulty, explanation, marks } = row;

      // Add base question row
      baseQuestions.push({
        exam_id,
        organization_id,
        subject,
        chapter,
        question_type: type,
        difficulty,
        explanation,
        marks
      });

      // Map to type-specific array
      questionTypeData = mapQuestionData(row, type, questionTypeData);
    });

    const insertedBases = await insertBaseQuestion(baseQuestions);
    insertedBases.forEach((base, index) => {
      const baseId = base.id;
      questionTypeData[type][index].id = baseId;
    }
    );

    const questions = await uploadedQuestions(questionTypeData);

    fs.unlinkSync(filePath); // Delete the file after use
    new APIResponse(200, { insertedBases, questions }, "Questions uploaded successfully").send(res);
  } catch (err) {
    console.error("Something went wrong:", err);
    new APIError(
      err?.response?.status || err?.status || 500,
      ["Something went wrong while uploading the Excel file by type", err.message || ""]
    ).send(res);
  }
};

