import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js";
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";
import { fetchContestQuestions, saveContestQuestion } from "../../utils/SqlQueries/contestQuestion.queries.js";

export const addContestQuestion = async (req, res) => {
    try {
        const questionData = req.body;
        if (!questionData.contest_id) {
            return new APIError(400, ["Contest ID and question data are required"]).send(res);
        }
        questionData.created_at = new Date();

        const contestQuestion = await saveContestQuestion(questionData);

        return new APIResponse(200, contestQuestion, "Contest question added successfully!").send(res);



    } catch (error) {
        console.log("❌ Error adding contest question:", error);
        return new APIError(500, ["Failed to add contest question", error.message]).send(res);
    }
};

export const getContestQuestions = async (req, res) => {
    try {
        const { contest_id } = req.query;

        if (!contest_id) {
            return new APIError(400, ["Contest ID is required"]).send(res);
        }

        const questions = await fetchContestQuestions(contest_id);

        if (!questions || questions.length === 0) {
            return new APIResponse(404, [], "No questions found for this contest").send(res);
        }

        return new APIResponse(200, questions, "Contest questions retrieved successfully").send(res);
    } catch (error) {
        console.error("❌ Error retrieving contest questions:", error);
        return new APIError(500, ["Failed to retrieve contest questions", error.message]).send(res);
    }
}

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
        console.log("Running contest code with:", { code, problem, currentLang });

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