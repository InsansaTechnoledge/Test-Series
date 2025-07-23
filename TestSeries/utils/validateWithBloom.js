export const validateWithBloom = async (questionText, bloomLevel) => {
  const API_KEY = "AIzaSyCdc78DcT5WR8NoFb51RyJJjm0PS4-vMeM";

  const prompt = `
Check the Bloom's Taxonomy level of the following question. Respond only with:
"true" if it matches level "${bloomLevel}", followed by the actual Bloom level.
"false" if it doesn't match, followed by the actual Bloom level.
Format: true|<actual_level> or false|<actual_level>

Question: "${questionText}"`;

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

    return {
      isValid: validity === "true",
      matchedLevel: matchedLevel || "unknown",
    };
  } catch (err) {
    console.error("Bloom validation error:", err);
    return { isValid: false, matchedLevel: "error" };
  }
};
