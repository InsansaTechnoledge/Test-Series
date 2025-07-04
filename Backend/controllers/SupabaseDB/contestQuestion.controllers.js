import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js";
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";
import { getCodingQuestions, getContestQuetionsQuery } from "../../utils/SqlQueries/codingQuestion.queries.js";
import { getFinalCodeForSubmission, getFinalCodeForTestRun } from '../../utils/starterCode.js'


const getFileName = (lang) => {
    const files = { javascript: 'main.js', python: 'main.py', java: 'main.java', cpp: 'main.cpp', c: 'main.c', python3: 'main.py' };
    return files[lang] || 'main.txt';
};

export const testContestQuestion = async (req, res) => {
    try {
        const { code, problem, currentLang } = req.body;

        const final = await getFinalCodeForSubmission(currentLang.langSlug, code, problem);
        const { finalCode, output, testInput } = final;
        
        if (!final || !final.finalCode) {
            return new APIError(400, ["Failed to generate final code for submission"]).send(res);
        }

        const results = [];
        const errors = [];
        if (!finalCode || !output || !currentLang) {
            return new APIError(400, ["Code, test cases, and language are required"]).send(res);
        }
        const response = await fetch('https://emkc.org/api/v2/piston/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                language: currentLang.pistonLang,
                version: currentLang.version,
                files: [{ name: getFileName(currentLang.pistonLang), content: finalCode }],
                stdin: ''
            })
        });

        const result = await response.json();
        console.log(result);
        const runOutput = typeof result.run.stdout === "string"
            ? (() => { try { return JSON.parse(result.run.stdout); } catch { return result.run.stdout; } })()
            : result.run.stdout
        const compileError = result.compile?.stderr || '';
        const runtimeError = result.run?.stderr || '';

        if (compileError) {
            errors.push(compileError);
        }
        if (runtimeError) {
            errors.push(runtimeError);
        }



        const actualTestOutputs = runOutput.slice(-output.length);

        const detailedResults = [];
        let passedCount = 0;

        for (let i = 0; i < output.length; i++) {
            const expected = output[i];
            const actual = actualTestOutputs[i];

            const passed = JSON.stringify(actual) === JSON.stringify(expected);

            if (passed) passedCount++;

            detailedResults.push({
                index: i + 1,
                passed,
                expected,
                actual,
            });
        }

        const fullResult = {
            results: detailedResults,
            passedCount,
            total: output.length,
            fullOutput: runOutput,
        };


        return new APIResponse(200, { results: fullResult, errors, testInput }, "Contest question tested successfully").send(res);
    } catch (error) {
        console.log("❌ Error testing contest question:", error);
        return new APIError(500, ["Failed to test contest question", error.message]).send(res);
    }
};

export const runContestCode = async (req, res) => {
    try {
        const { code, problem, currentLang } = req.body;

        const { finalCode, testInput } = await getFinalCodeForTestRun(currentLang.langSlug, code, problem);

        const response = await fetch('https://emkc.org/api/v2/piston/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                language: currentLang.pistonLang,
                version: currentLang.version,
                files: [{ name: getFileName(currentLang.pistonLang), content: finalCode }],
                stdin: ''
            })
        });


        const result = await response.json();

        console.log(result);

        return new APIResponse(200, { result, testInput }, "Contest code executed successfully").send(res);
    } catch (error) {
        console.log("❌ Error running contest code:", error);
        return new APIError(500, ["Failed to run contest code", error.message]).send(res);
    }
};

export const fetchCodingQuestions = async (req, res) => {
    const { page = 1, limit = 10, difficulty = 'Easy' } = req.query;
    console.log("Fetching coding questions with params:", { difficulty, page, limit });

    try {
        const questions = await getCodingQuestions(difficulty, page, limit);

        if (!questions || questions.length === 0) {
            return new APIError(404, [], "No coding questions found").send(res);
        }

        return new APIResponse(200, questions, "Coding questions fetched successfully").send(res);
    } catch (error) {
        console.error("❌ Error fetching coding questions:", error);
        return new APIError(500, ["Failed to fetch coding questions", error.message]).send(res);
    }
};

export const fetchCodingQuestion = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return new APIError(400, ["Question ID is required"]).send(res);
    }

    try {
        const question = await getCodingQuestions(null, null, null, id);

        if (!question || question.length === 0) {
            return new APIError(404, [], "Coding question not found").send(res);
        }

        return new APIResponse(200, question.data, "Coding question fetched successfully").send(res);
    } catch (error) {
        console.error("❌ Error fetching coding question:", error);
        return new APIError(500, ["Failed to fetch coding question", error.message]).send(res);
    }
};

export const getContestQuestions = async (req, res) => {
    const { contest_id } = req.query;

    if (!contest_id) {
        return new APIError(400, ["Contest ID is required"]).send(res);
    }

    try {
        const questions = await getContestQuetionsQuery(contest_id);

        if (!questions || questions.length === 0) {
            return new APIError(404, [], "No questions found for this contest").send(res);
        }

        return new APIResponse(200, questions, "Contest questions fetched successfully").send(res);
    } catch (error) {
        console.error("❌ Error fetching contest questions:", error);
        return new APIError(500, ["Failed to fetch contest questions", error.message]).send(res);
    }

};


