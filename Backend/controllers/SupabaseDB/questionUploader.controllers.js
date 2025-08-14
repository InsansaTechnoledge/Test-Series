import fs from "fs";
import {
  insertBaseQuestion,
  insertCode,
  insertComprehension,
  insertFILL,
  insertMatch,
  insertMCQ,
  insertMSQ,
  insertNumerical,
  insertTF,
  // ✅ NEW
  insertDescriptive
} from "../../utils/SqlQueries/questionUpload.queries.js";
import { mapQuestionData } from "../../utils/questionUtils/questionMapping.js";
import parseExcel from "../../utils/questionUtils/readExcelFile.js";
import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js";
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";
import { Organization } from "../../models/FirstDB/organization.model.js";

// -----------------------------------------
// Helper: bulk insert into specialized tables
// -----------------------------------------
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
    code: insertCode,
    // ✅ NEW
    descriptive: insertDescriptive
  };

  for (const [type, arr] of Object.entries(questionTypeData)) {
    if (Array.isArray(arr) && arr.length && insertFunctions[type]) {
      insertPromises.push(insertFunctions[type](arr));
    }
  }

  const questions = await Promise.all(insertPromises);
  return questions;
};

// -----------------------------------------
// Excel: mixed types in one file
// -----------------------------------------
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
      code: [],
      // ✅ NEW
      descriptive: []
    };

    // Build base records
    rows.forEach((row) => {
      const {
        type,
        subject,
        chapter,
        difficulty,
        explanation,
        // 🛠️ Excel may have `marks`; map to positive/negative
        marks,
        positive_marks,
        negative_marks,
        bloom_level
      } = row;

      baseQuestions.push({
        exam_id,
        organization_id,
        subject,
        chapter,
        question_type: type,
        difficulty,
        explanation,
        positive_marks: Number(positive_marks ?? marks ?? 1),
        negative_marks: Number(negative_marks ?? 0),
        bloom_level
      });
    });

    const insertedBases = await insertBaseQuestion(baseQuestions);

    // Map each row to its specialized table payload
    insertedBases.forEach((base, index) => {
      const row = rows[index];
      const type = String(row.type).toLowerCase();
      const baseId = base.id;

      const mapped = mapQuestionData(row, type, baseId);
      if (Array.isArray(mapped)) {
        questionTypeData[type].push(...mapped);
      } else if (mapped && typeof mapped === "object") {
        questionTypeData[type].push(mapped);
      }
    });

    const questions = await uploadedQuestions(questionTypeData);

    fs.unlinkSync(filePath); // cleanup

    new APIResponse(200, { insertedBases, questions }, "Questions uploaded successfully").send(res);
  } catch (err) {
    console.log("something went wrong", err);
    new APIError(
      err?.response?.status || err?.status || 500,
      ["Something went wrong while uploading the excel by question types", err.message || ""]
    ).send(res);
  }
};

// -----------------------------------------
// Excel: single type for the whole file
// -----------------------------------------
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
      code: [],
      // ✅ NEW
      descriptive: []
    };

    // Build base + type-specific arrays
    rows.forEach((row) => {
      const {
        subject,
        chapter,
        difficulty,
        explanation,
        marks,
        positive_marks,
        negative_marks,
        bloom_level
      } = row;

      baseQuestions.push({
        exam_id,
        organization_id,
        subject,
        chapter,
        question_type: type,
        difficulty,
        explanation,
        positive_marks: Number(positive_marks ?? marks ?? 1),
        negative_marks: Number(negative_marks ?? 0),
        bloom_level
      });

      // add to specialized payload (no id yet)
      questionTypeData = mapQuestionData(row, type, questionTypeData);
    });

    const insertedBases = await insertBaseQuestion(baseQuestions);

    // Attach ids to each already-prepared specialized record
    insertedBases.forEach((base, index) => {
      const baseId = base.id;
      if (questionTypeData[type] && questionTypeData[type][index]) {
        questionTypeData[type][index].id = baseId;
      }
    });

    const questions = await uploadedQuestions(questionTypeData);

    fs.unlinkSync(filePath); // cleanup
    new APIResponse(200, { insertedBases, questions }, "Questions uploaded successfully").send(res);
  } catch (err) {
    console.error("Something went wrong:", err);
    new APIError(
      err?.response?.status || err?.status || 500,
      ["Something went wrong while uploading the Excel file by type", err.message || ""]
    ).send(res);
  }
};

// -----------------------------------------
// JSON upload: supports comprehension + all types
// -----------------------------------------
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
      code: [],
      // ✅ NEW
      descriptive: []
    };

    const comprehensionQueue = [];

    // Step 1: Separate normal and comprehension questions
    for (const q of questions) {
      if (q.type === "comprehension") {
        comprehensionQueue.push(q);
      } else {
        const {
          type,
          subject,
          chapter,
          difficulty,
          explanation,
          positive_marks,
          negative_marks,
          bloom_level
        } = q;

        baseQuestions.push({
          exam_id,
          organization_id,
          subject,
          chapter,
          question_type: type,
          difficulty,
          explanation,
          positive_marks: Number(positive_marks) || 1,
          negative_marks: Number(negative_marks) || 0,
          bloom_level
        });
      }
    }

    // Step 2: Insert normal questions to base table
    const insertedBases = await insertBaseQuestion(baseQuestions);

    // Step 3: Map normals → specialized
    insertedBases.forEach((base, i) => {
      const q = questions[i]; // indexes align because we excluded comprehension earlier
      const type = q.type;
      const baseId = base.id;

      const mapped = mapQuestionData(q, type, baseId);
      if (Array.isArray(mapped)) {
        questionTypeData[type].push(...mapped);
      } else if (mapped && typeof mapped === "object") {
        questionTypeData[type].push(mapped);
      }
    });

    // Step 4: Handle comprehension + its sub-questions
    for (const compQ of comprehensionQueue) {
      const subIds = [];

      for (const sub of compQ.sub_question_ids || []) {
        const base = {
          exam_id,
          organization_id,
          subject: sub.subject || "",
          chapter: sub.chapter || "",
          question_type: sub.type,
          difficulty: sub.difficulty,
          explanation: sub.explanation,
          positive_marks: Number(sub.positive_marks) || 1,
          negative_marks: Number(sub.negative_marks) || 0,
          bloom_level: sub.bloom_level
        };

        const insertedBase = await insertBaseQuestion([base]);

        if (!Array.isArray(insertedBase) || !insertedBase[0]?.id) {
          console.error("❌ Sub-question insert returned empty:", insertedBase);
          throw new Error(
            `Sub-question insert failed for type "${sub.type}" with data: ${JSON.stringify(base)}`
          );
        }

        const baseId = insertedBase[0].id;

        const mapped = mapQuestionData(sub, sub.type, baseId);
        if (Array.isArray(mapped)) {
          questionTypeData[sub.type].push(...mapped);
        } else if (mapped && typeof mapped === "object") {
          questionTypeData[sub.type].push(mapped);
        }

        subIds.push(baseId);
      }

      // Insert base for comprehension question itself
      const baseComp = {
        exam_id,
        organization_id,
        subject: compQ.subject || "",
        chapter: compQ.chapter || "",
        question_type: "comprehension",
        difficulty: compQ.difficulty,
        explanation: compQ.explanation,
        positive_marks: subIds.length, // or a provided value
        negative_marks: 0,
        bloom_level: compQ.bloom_level
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

    // Step 5: Flush all specialized payloads
    const result = await uploadedQuestions(questionTypeData);

    // (Optional) bump org counter as you had
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
