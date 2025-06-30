import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js";
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";
import { getCodingQuestions } from "../../utils/SqlQueries/codingQuestion.queries.js";


const getFileName = (lang) => {
    const files = { javascript: 'main.js', python: 'main.py', java: 'main.java', cpp: 'main.cpp' };
    return files[lang] || 'main.txt';
};

export const testContestQuestion = async (req, res) => {
    try {
        const { code, testCases, currentLang } = req.body;
        const results = [];
        const errors = [];
        if (!code || !testCases || !currentLang) {
            return new APIError(400, ["Code, test cases, and language are required"]).send(res);
        }

        for (const testCase of testCases) {
            const response = await fetch('https://emkc.org/api/v2/piston/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: currentLang.pistonLang,
                    version: currentLang.version,
                    files: [{ name: getFileName(currentLang.pistonLang), content: code }],
                    stdin: testCase.input
                })
            });

            const result = await response.json();

            const runOutput = result.run?.stdout?.trim() || '';
            const compileError = result.compile?.stderr || '';
            const runtimeError = result.run?.stderr || '';

            if (compileError) {
                errors.push(compileError);
            }
            if (runtimeError) {
                errors.push(runtimeError);
            }

            const passed = runOutput === testCase.expected_output;
            results.push({
                passed,
                expected: testCase.expected_output,
                actual: runOutput,
                explanation: testCase.explanation
            });
        }

        return new APIResponse(200, { results, errors }, "Contest question tested successfully").send(res);
    } catch (error) {
        console.log("❌ Error testing contest question:", error);
        return new APIError(500, ["Failed to test contest question", error.message]).send(res);
    }
};

export const runContestCode = async (req, res) => {
    try {
        const { code, problem, currentLang } = req.body;

        const response = await fetch('https://emkc.org/api/v2/piston/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                language: currentLang.pistonLang,
                version: currentLang.version,
                files: [{ name: getFileName(currentLang.pistonLang), content: code }],
                stdin: problem.sample_input
            })
        });

        const result = await response.json();

        return new APIResponse(200, result, "Contest code executed successfully").send(res);
    } catch (error) {
        console.log("❌ Error running contest code:", error);
        return new APIError(500, ["Failed to run contest code", error.message]).send(res);
    }
};

export const fetchCodingQuestions= async (req, res) => {
    const {page=1,limit=10,difficulty='Easy'} = req.query;
    console.log("Fetching coding questions with params:", { difficulty, page, limit });

    try{
        const questions = await getCodingQuestions(difficulty, page, limit);

        if (!questions || questions.length === 0) {
            return new APIError(404, [], "No coding questions found").send(res);
        }

        return new APIResponse(200, questions, "Coding questions fetched successfully").send(res);
    }catch (error) {
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
        const questions = await getCodingQuestions(null, null, null, ids);

        if (!questions || questions.length === 0) {
            return new APIError(404, [], "No questions found for this contest").send(res);
        }

        return new APIResponse(200, questions.data, "Contest questions fetched successfully").send(res);
    } catch (error) {
        console.error("❌ Error fetching contest questions:", error);
        return new APIError(500, ["Failed to fetch contest questions", error.message]).send(res);
    }

};


