export const validateWithBloom = async (questionText, bloomLevel) => {
  const API_KEY = "AIzaSyB_n2E0sL6iLbpRpz852LVX-LHBp24YK8w";
  const prompt = `
You are a Bloom's Taxonomy classification expert. Your task is to classify the following question into one of Bloom's levels.

Bloom’s Taxonomy Levels:
1. Remember – recall facts (e.g., list, define)
2. Understand – explain ideas (e.g., summarize, describe)
3. Apply – use knowledge in a new way (e.g., solve, use)
4. Analyze – break information into parts (e.g., compare, differentiate)
5. Evaluate – make judgments based on criteria (e.g., justify, critique, assess)
6. Create – produce new/original work (e.g., design, construct)

Examples:
Q: "List the parts of a cell." → remember
Q: "Explain the function of mitochondria." → understand
Q: "Solve this physics problem using Newton's laws." → apply
Q: "Compare and contrast democracy and dictatorship." → analyze
Q: "Which method is best and why?" → evaluate
Q: "Design a machine to lift 100 kg." → create

Now, classify the following question:
"${questionText}"

Respond strictly in this format:
"true|<level>" if the question matches level "${bloomLevel}"
"false|<level>" if the question matches a different level

Only reply with 'true|<level>' or 'false|<level>' — no explanations.
`;
  const normalizeLevel = (level) => {
    const synonyms = {
      remember: ['remember', 'remembering'],
      understand: ['understand', 'understanding'],
      apply: ['apply', 'applying', 'application'],
      analyze: ['analyze', 'analyzing', 'analysis'],
      evaluate: ['evaluate', 'evaluating', 'evaluation'],
      create: ['create', 'creating', 'creation'],
    };

    const lower = level.toLowerCase();
    for (const key in synonyms) {
      if (synonyms[key].includes(lower)) {
        return key;
      }
    }

    return lower;
  };

  const normalizedInput = normalizeLevel(bloomLevel);



  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("[DEBUG] Gemini Full Response:", data);

    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase();
    console.log("[DEBUG] Model Reply Text:", replyText); // e.g., "true|application"

    if (!replyText) return { isValid: false, matchedLevel: "unknown" };


    const [validity, matchedLevel] = replyText.split("|").map((s) => s.trim());

    const normalizedLevel = normalizeLevel(matchedLevel);
    const isValid = normalizedLevel === normalizedInput;
    return {
      isValid,
      matchedLevel: normalizedLevel || "unknown",
    };
  } catch (err) {
    console.error("Bloom validation error:", err);
    return { isValid: false, matchedLevel: "error" };
  }
};
