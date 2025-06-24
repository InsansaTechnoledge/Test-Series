import fs from "fs";
import { insertBaseQuestion, insertCode, insertComprehension, insertFILL, insertMatch, insertMCQ, insertMSQ, insertNumerical, insertTF } from "../../utils/SqlQueries/questionUpload.queries.js";
import { mapQuestionData } from "../../utils/questionUtils/questionMapping.js";
import parseExcel from "../../utils/questionUtils/readExcelFile.js";
import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js";
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";
import { Organization } from "../../models/FirstDB/organization.model.js";

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



//   const { exam_id, organization_id, questions } = req.body;

//   try {
//     const baseQuestions = [];
//     const questionTypeData = {
//       mcq: [],
//       msq: [],
//       fill: [],
//       tf: [],
//       match: [],
//       comprehension: [],
//       numerical: [],
//       code: []
//     };

//     for (const q of questions) {
//       const {
//         type, subject, chapter, difficulty, explanation,
//         positive_marks, negative_marks, passage, sub_question_ids
//       } = q;

//       if (type === 'comprehension') {
//         // ✅ Step 1: Insert sub-questions first
//         const subBases = [];
//         const subTypeData = [];

//         for (const sub of sub_question_ids || []) {
//           const { type: subType, ...rest } = sub;

//           subBases.push({
//             exam_id,
//             organization_id,
//             subject: rest.subject || subject,
//             chapter: rest.chapter || chapter,
//             question_type: subType,
//             difficulty: rest.difficulty || 'easy',
//             explanation: rest.explanation || '',
//             positive_marks: rest.positive_marks || 1,
//             negative_marks: rest.negative_marks || 0
//           });
//         }

//         const insertedSubQuestions = await insertBaseQuestion(subBases);
//         const subQuestionIds = insertedSubQuestions.map((s) => s.id);

//         // ✅ Push mapped sub-questions into correct typeData
//         insertedSubQuestions.forEach((base, idx) => {
//           const subQ = sub_question_ids[idx];
//           const mapped = mapQuestionData(subQ, subQ.type, base.id);
//           questionTypeData[subQ.type].push(...mapped);
//         });

//         // ✅ Step 2: Insert main comprehension question
//         baseQuestions.push({
//           exam_id,
//           organization_id,
//           subject,
//           chapter,
//           question_type: 'comprehension',
//           difficulty,
//           explanation,
//           passage: passage || '',
//           positive_marks: sub_question_ids.reduce((acc, q) => acc + (q.positive_marks || 0), 0),
//           negative_marks: 0,
//           sub_question_ids: subQuestionIds
//         });
//       } else {
//         baseQuestions.push({
//           exam_id,
//           organization_id,
//           subject,
//           chapter,
//           question_type: type,
//           difficulty,
//           explanation,
//           positive_marks: positive_marks || 1,
//           negative_marks: negative_marks || 0
//         });
//       }
//     }

//     const insertedBases = await insertBaseQuestion(baseQuestions);

//     insertedBases.forEach((base, i) => {
//       const q = questions[i];
//       if (q.type !== 'comprehension') {
//         const mapped = mapQuestionData(q, q.type, base.id);
//         questionTypeData[q.type].push(...mapped);
//       }
//     });

//     const result = await uploadedQuestions(questionTypeData);

//     new APIResponse(200, { insertedBases, result }, "Questions uploaded successfully").send(res);
//   } catch (err) {
//     console.error("❌ JSON upload failed:", err);
//     new APIError(500, ["Something went wrong", err.message || ""]).send(res);
//   }
// };

// export const uploadFromJSON = async (req, res) => {
//   const { exam_id, organization_id, questions } = req.body;

//   try {
//     const baseQuestions = [];
//     const questionTypeData = {
//       mcq: [],
//       msq: [],
//       fill: [],
//       tf: [],
//       match: [],
//       comprehension: [],
//       numerical: [],
//       code: []
//     };

//     // Step 1: Prepare rows for `questions` table
//     for (const q of questions) {
//       const {
//         type,
//         subject,
//         chapter,
//         difficulty,
//         explanation,
//         positive_marks,
//         negative_marks = 0
//       } = q;

//       baseQuestions.push({
//         exam_id,
//         organization_id,
//         subject,
//         chapter,
//         question_type: type,
//         difficulty,
//         explanation,
//         positive_marks,
//         negative_marks
//       });
//     }

//     // Step 2: Insert base question entries into `questions` table
//     const insertedBases = await insertBaseQuestion(baseQuestions); // returns [{ id, ... }]

//     // Step 3: Map and prepare for specialized tables
//     insertedBases.forEach((base, i) => {
//       const q = questions[i];
//       const type = q.type;
//       const baseId = base.id;

//       const mapped = mapQuestionData(q, type, baseId);
//       if (Array.isArray(mapped)) {
//         questionTypeData[type].push(...mapped);
//       } else {
//         questionTypeData[type].push(mapped);
//       }
//     });


//     // Step 4: Insert into specialized tables (question_mcq, question_fill, etc.)
//     const result = await uploadedQuestions(questionTypeData);

//     return new APIResponse(200, { insertedBases, result }, "Questions uploaded successfully").send(res);
//   } catch (err) {
//     console.error("❌ JSON upload failed:", err);
//     return new APIError(500, ["Something went wrong", err.message || ""]).send(res);
//   }
// };

export const uploadFromJSON = async (req, res) => {
  const { exam_id, organization_id, questions } = req.body;

  try {
    const baseQuestions = [];
    const questionTypeData = {
      mcq: [],
      msq: [],
      fill: [],
      tf: [],
      match: [],
      comprehension: [],
      numerical: [],
      code: []
    };

    const comprehensionQueue = [];

    // Step 1: Separate normal and comprehension questions
    for (const q of questions) {
      if (q.type === 'comprehension') {
        comprehensionQueue.push(q); // Defer handling
      } else {
        const { type, subject, chapter, difficulty, explanation, positive_marks, negative_marks } = q;
        baseQuestions.push({
          exam_id,
          organization_id,
          subject,
          chapter,
          question_type: type,
          difficulty,
          explanation,
          positive_marks: Number(positive_marks) || 1,
          negative_marks: Number(negative_marks) || 0
        });
      }
    }

    // Step 2: Insert normal questions to base `questions` table
    const insertedBases = await insertBaseQuestion(baseQuestions);

    // Step 3: Insert into specialized tables
    insertedBases.forEach((base, i) => {
      const q = questions[i];
      const type = q.type;
      const baseId = base.id;

      const mapped = mapQuestionData(q, type, baseId);
      if (Array.isArray(mapped)) {
        questionTypeData[type].push(...mapped);
      } else if (mapped && typeof mapped === 'object') {
        questionTypeData[type].push(mapped);
      }
    });

    // Step 4: Handle comprehension + sub-questions
    for (const compQ of comprehensionQueue) {
      const subIds = [];

      for (const sub of compQ.sub_question_ids || []) {
        const base = {
          exam_id,
          organization_id,
          subject: sub.subject || '',
          chapter: sub.chapter || '',
          question_type: sub.type,
          difficulty: sub.difficulty,
          explanation: sub.explanation,
          positive_marks: Number(sub.positive_marks) || 1,
          negative_marks: Number(sub.negative_marks) || 0
        };

        const insertedBase = await insertBaseQuestion([base]);

        if (!Array.isArray(insertedBase) || !insertedBase[0]?.id) {
          console.error("❌ Sub-question insert returned empty:", insertedBase);
          throw new Error(`Sub-question insert failed for type "${sub.type}" with data: ${JSON.stringify(base)}`);
        }

        const baseId = insertedBase[0].id;

        const mapped = mapQuestionData(sub, sub.type, baseId);
        if (Array.isArray(mapped)) {
          questionTypeData[sub.type].push(...mapped);
        } else if (mapped && typeof mapped === 'object') {
          questionTypeData[sub.type].push(mapped);
        }

        subIds.push(baseId);
      }

      // Insert comprehension base now
      const baseComp = {
        exam_id,
        organization_id,
        subject: compQ.subject || '',
        chapter: compQ.chapter || '',
        question_type: 'comprehension',
        difficulty: compQ.difficulty,
        explanation: compQ.explanation,
        positive_marks: subIds.length,
        negative_marks: 0
      };

      const compInsert = await insertBaseQuestion([baseComp]);

      if (!Array.isArray(compInsert) || !compInsert[0]?.id) {
        console.error("❌ Comprehension base insert failed or returned empty:", compInsert);
        throw new Error("Comprehension insert failed");
      }

      const baseId = compInsert[0].id;

      questionTypeData.comprehension.push({
        id: baseId,
        passage: compQ.passage,
        sub_question_ids: subIds
      });
    }

    // Step 5: Insert into all specialized tables
    const result = await uploadedQuestions(questionTypeData);

    const updatedOrg = await Organization.findByIdAndUpdate(
      organization_id,
      { $inc: { totalExams: 1 } },
      { new: true }
    );
    if (!updatedOrg) {
      throw new Error("Organization not found or update failed");
    }

    return new APIResponse(200, { insertedBases, result }, "Questions uploaded successfully").send(res);
  } catch (err) {
    console.error("❌ JSON upload failed:", err);
    return new APIError(500, ["Something went wrong", err.message || ""]).send(res);
  }
};
