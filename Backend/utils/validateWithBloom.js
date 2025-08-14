// utils/ai/validateWithBloom.service.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // keep secret
});

// ---- helpers (same idea as yours) ----
const normalizeLevel = (level) => {
  const synonyms = {
    remember:  ['remember', 'remembering', 'recall', 'knowledge'],
    understand:['understand', 'understanding', 'comprehend', 'interpret'],
    apply:     ['apply', 'applying', 'application', 'use', 'execute', 'implement'],
    analyze:   ['analyze', 'analyzing', 'analysis', 'differentiate', 'compare', 'contrast'],
    evaluate:  ['evaluate', 'evaluating', 'evaluation', 'judge', 'critique', 'assess', 'justify'],
    create:    ['create', 'creating', 'creation', 'design', 'construct', 'compose', 'produce'],
  };
  const lower = String(level || '').toLowerCase().trim();
  for (const key in synonyms) if (synonyms[key].includes(lower)) return key;
  return lower || "unknown";
};

const buildMessages = (questionText, expectedLevel) => [
  {
    role: "system",
    content:
`You are a meticulous Bloom's Taxonomy classifier.
Task: Classify the question into EXACTLY ONE Bloom level: remember | understand | apply | analyze | evaluate | create.

Output FORMAT (single line only):
true|<level>   if your classified level exactly matches "${expectedLevel}"
false|<level>  if your classified level is different

Constraints:
- Output ONLY: true|<level> or false|<level>
- Use lowercase for <level>.
- If ambiguous, pick the most probable by verb + cognitive demand.
- No extra text or punctuation.`,
  },
  {
    role: "user",
    content:
`Bloom’s Levels:
1. remember — recall facts (list, define)
2. understand — explain ideas (summarize, describe)
3. apply — use knowledge in a new way (solve, use)
4. analyze — break into parts (compare, differentiate)
5. evaluate — judge using criteria (justify, critique, assess)
6. create — produce something new (design, construct)

Examples:
Q: "List the parts of a cell." → remember
Q: "Explain the function of mitochondria." → understand
Q: "Solve this physics problem using Newton's laws." → apply
Q: "Compare and contrast democracy and dictatorship." → analyze
Q: "Which method is best and why?" → evaluate
Q: "Design a machine to lift 100 kg." → create

Question:
${questionText}

Expected level (for true/false comparison): ${expectedLevel}`
  }
];

export async function validateWithBloomService(questionText, bloomLevel) {
  const normalizedInput = normalizeLevel(bloomLevel);

  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",      // ✅ valid model
    messages: buildMessages(questionText, normalizedInput),
    temperature: 0,
    max_tokens: 5,
  });

  const raw = resp?.choices?.[0]?.message?.content || "";
  const reply = String(raw).trim().toLowerCase();

  const match = reply.match(/\b(true|false)\s*\|\s*([a-z]+)\b/);
  if (!match) return { isValid: false, matchedLevel: "unknown", raw: reply };

  const [, tf, lvl] = match;
  const normalizedLevel = normalizeLevel(lvl);
  const isValid = normalizedLevel === normalizedInput;

  return { isValid, matchedLevel: normalizedLevel || "unknown", raw: reply };
}
