// utils/ai/validateWithBloom.service.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // keep secret
});

// ---- Enhanced helpers ----
const normalizeLevel = (level) => {
  const synonyms = {
    remember:  ['remember', 'remembering', 'recall', 'knowledge', 'memorize', 'identify', 'list', 'name', 'define', 'state', 'recognize'],
    understand:['understand', 'understanding', 'comprehend', 'interpret', 'explain', 'describe', 'summarize', 'paraphrase', 'clarify', 'classify'],
    apply:     ['apply', 'applying', 'application', 'use', 'execute', 'implement', 'solve', 'demonstrate', 'operate', 'practice', 'employ'],
    analyze:   ['analyze', 'analyzing', 'analysis', 'differentiate', 'compare', 'contrast', 'examine', 'breakdown', 'distinguish', 'separate'],
    evaluate:  ['evaluate', 'evaluating', 'evaluation', 'judge', 'critique', 'assess', 'justify', 'argue', 'defend', 'support', 'conclude'],
    create:    ['create', 'creating', 'creation', 'design', 'construct', 'compose', 'produce', 'generate', 'develop', 'build', 'formulate'],
  };
  
  const lower = String(level || '').toLowerCase().trim();
  
  // Direct match first
  if (['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'].includes(lower)) {
    return lower;
  }
  
  // Synonym matching
  for (const [key, values] of Object.entries(synonyms)) {
    if (values.includes(lower)) return key;
  }
  
  return "unknown";
};

const buildMessages = (questionText, expectedLevel) => [
  {
    role: "system",
    content: `You are an expert Bloom's Taxonomy classifier. Your task is to classify educational questions into exactly one of the six Bloom's taxonomy levels.

CRITICAL INSTRUCTIONS:
1. You MUST respond with EXACTLY this format: "RESULT|<level>"
2. Replace <level> with one of: remember, understand, apply, analyze, evaluate, create
3. Use only lowercase letters for the level
4. No additional text, explanations, or punctuation
5. If uncertain between levels, choose the highest cognitive level that applies

BLOOM'S TAXONOMY LEVELS (ordered from lowest to highest cognitive complexity):

1. REMEMBER: Retrieving relevant knowledge from memory
   - Keywords: list, define, name, identify, recall, recognize, state, describe basic facts
   - Example: "List the capitals of European countries"

2. UNDERSTAND: Constructing meaning from instructional messages
   - Keywords: explain, summarize, paraphrase, interpret, describe processes, classify
   - Example: "Explain how photosynthesis works"

3. APPLY: Carrying out or using a procedure in a given situation
   - Keywords: solve, use, demonstrate, calculate, implement, execute, practice
   - Example: "Calculate the area of this triangle using the formula"

4. ANALYZE: Breaking material into constituent parts and determining relationships
   - Keywords: compare, contrast, differentiate, examine, distinguish, breakdown, categorize
   - Example: "Compare the themes in these two novels"

5. EVALUATE: Making judgments based on criteria and standards
   - Keywords: judge, critique, assess, argue, defend, justify, support, conclude, recommend
   - Example: "Evaluate which renewable energy source is most viable and justify your choice"

6. CREATE: Putting elements together to form a novel, coherent whole
   - Keywords: design, construct, produce, generate, develop, compose, plan, invent
   - Example: "Design a marketing campaign for a new product"

CLASSIFICATION RULES:
- Look for action verbs and cognitive demands in the question
- Consider what the student must actually DO to answer
- When multiple levels could apply, choose the highest one required
- Questions asking for original work = CREATE
- Questions asking for judgment/recommendation = EVALUATE
- Questions asking for comparison/breakdown = ANALYZE
- Questions asking to use knowledge in new situations = APPLY
- Questions asking to explain/interpret = UNDERSTAND  
- Questions asking to recall facts = REMEMBER

The expected level for comparison is: ${expectedLevel}

Respond with: RESULT|<classified_level>`
  },
  {
    role: "user",
    content: `Classify this question according to Bloom's Taxonomy:

"${questionText}"

Remember: Respond ONLY with "RESULT|<level>" where <level> is one of: remember, understand, apply, analyze, evaluate, create`
  }
];

// Enhanced validation with multiple fallback strategies
const parseAIResponse = (rawResponse) => {
  if (!rawResponse) return null;
  
  const cleaned = rawResponse.trim().toLowerCase();
  
  // Strategy 1: Look for RESULT|level format
  const resultMatch = cleaned.match(/result\s*\|\s*(remember|understand|apply|analyze|evaluate|create)/);
  if (resultMatch) return resultMatch[1];
  
  // Strategy 2: Look for true|level or false|level format (legacy support)
  const legacyMatch = cleaned.match(/(?:true|false)\s*\|\s*(remember|understand|apply|analyze|evaluate|create)/);
  if (legacyMatch) return legacyMatch[1];
  
  // Strategy 3: Look for any valid level word in the response
  const levelMatch = cleaned.match(/\b(remember|understand|apply|analyze|evaluate|create)\b/);
  if (levelMatch) return levelMatch[1];
  
  // Strategy 4: Check for common variations and synonyms
  const synonymMap = {
    'recall': 'remember',
    'comprehend': 'understand', 
    'interpret': 'understand',
    'use': 'apply',
    'implement': 'apply',
    'compare': 'analyze',
    'contrast': 'analyze',
    'judge': 'evaluate',
    'critique': 'evaluate',
    'design': 'create',
    'construct': 'create'
  };
  
  for (const [synonym, level] of Object.entries(synonymMap)) {
    if (cleaned.includes(synonym)) return level;
  }
  
  return null;
};

export async function validateWithBloomService(questionText, bloomLevel, maxRetries = 2) {
  const normalizedInput = normalizeLevel(bloomLevel);
  
  // Validate inputs
  if (!questionText || typeof questionText !== 'string' || !questionText.trim()) {
    return { 
      isValid: false, 
      matchedLevel: "unknown", 
      raw: "Invalid question text",
      error: "Question text is required and must be a non-empty string"
    };
  }
  
  if (normalizedInput === "unknown") {
    return { 
      isValid: false, 
      matchedLevel: "unknown", 
      raw: `Invalid bloom level: ${bloomLevel}`,
      error: `Invalid Bloom's level provided: ${bloomLevel}`
    };
  }

  let lastError = null;
  
  // Retry mechanism for better reliability
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const resp = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: buildMessages(questionText.trim(), normalizedInput),
        temperature: attempt === 0 ? 0 : 0.1, // Slightly increase temperature on retries
        max_tokens: 20, // Increased token limit for more reliable responses
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      });

      const rawContent = resp?.choices?.[0]?.message?.content;
      
      if (!rawContent) {
        throw new Error("Empty response from OpenAI");
      }

      const parsedLevel = parseAIResponse(rawContent);
      
      if (!parsedLevel) {
        // If parsing failed, try one more time with a simpler prompt on final attempt
        if (attempt === maxRetries) {
          const simpleResp = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system", 
                content: "Classify this question into ONE word only: remember, understand, apply, analyze, evaluate, or create. Respond with just the word."
              },
              {
                role: "user", 
                content: questionText.trim()
              }
            ],
            temperature: 0,
            max_tokens: 10
          });
          
          const simpleParsed = parseAIResponse(simpleResp?.choices?.[0]?.message?.content || "");
          if (simpleParsed) {
            const isValid = simpleParsed === normalizedInput;
            return { 
              isValid, 
              matchedLevel: simpleParsed, 
              raw: simpleResp.choices[0].message.content,
              fallbackUsed: true
            };
          }
        }
        
        throw new Error(`Could not parse AI response: "${rawContent}"`);
      }

      const isValid = parsedLevel === normalizedInput;
      
      return { 
        isValid, 
        matchedLevel: parsedLevel, 
        raw: rawContent,
        attempts: attempt + 1
      };

    } catch (error) {
      lastError = error;
      console.warn(`Bloom validation attempt ${attempt + 1} failed:`, error.message);
      
      // If this isn't the last attempt, wait briefly before retrying
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }
  
  // All attempts failed
  return { 
    isValid: false, 
    matchedLevel: "unknown", 
    raw: lastError?.message || "Unknown error",
    error: `Failed after ${maxRetries + 1} attempts: ${lastError?.message || "Unknown error"}`,
    attempts: maxRetries + 1
  };
}