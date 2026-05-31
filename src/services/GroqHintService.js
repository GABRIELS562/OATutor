/**
 * Groq AI Hint Service for SA CAPS Tutor
 * FREE: 500,000 tokens/day with llama-3.3-70b-versatile
 *
 * Get your free API key at: https://console.groq.com/keys
 */

import { renderGPTText } from "../platform-logic/renderText.js";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;

// Gemini as backup (1000 free requests/day)
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

// SA CAPS-specific system prompt
const SA_CAPS_SYSTEM_PROMPT = `You are a patient, encouraging mathematics tutor helping South African Grade 10-12 students prepare for the NSC (National Senior Certificate) Mathematics Paper 2 exam.

Your role:
- Provide clear, step-by-step hints without giving away the full answer
- Use South African terminology (e.g., "learners" not "students")
- Reference CAPS curriculum concepts when relevant
- Be encouraging and supportive - many students find Paper 2 challenging
- Use simple language appropriate for learners who may have English as a second language
- Focus on building understanding, not just getting the right answer

Topics you cover:
- Euclidean Geometry (circle theorems, tangent properties, cyclic quadrilaterals)
- Trigonometry (compound angles, general solutions, 2D/3D problems)
- Analytical Geometry (distance, midpoint, gradient, circle equations)
- Statistics (regression, correlation, interpretation)

When giving hints:
1. First identify what concept the learner is struggling with
2. Remind them of the relevant theorem or formula
3. Give a small nudge in the right direction
4. Encourage them to try again`;

/**
 * Generate an AI hint using Groq's free API
 * Falls back to Gemini if Groq fails
 */
export async function fetchDynamicHint(
    DYNAMIC_HINT_URL, // Ignored, we use Groq
    promptParameters,
    onChunkReceived,
    onSuccessfulCompletion,
    onError,
    problemID,
    variabilization,
    context
) {
    // Build the prompt from parameters
    const userPrompt = buildPromptFromParameters(promptParameters);

    console.debug("Generating AI hint with Groq...", { problemID });

    try {
        // Try Groq first (500K tokens/day FREE)
        if (GROQ_API_KEY && !GROQ_API_KEY.includes('[YOUR_')) {
            const hint = await fetchGroqHint(userPrompt, onChunkReceived);
            const finalHint = renderGPTText(hint, problemID, variabilization, context);
            onChunkReceived(finalHint);
            onSuccessfulCompletion();
            return;
        }

        // Fallback to Gemini (1000 requests/day FREE)
        if (GEMINI_API_KEY && !GEMINI_API_KEY.includes('[YOUR_')) {
            console.debug("Falling back to Gemini...");
            const hint = await fetchGeminiHint(userPrompt);
            const finalHint = renderGPTText(hint, problemID, variabilization, context);
            onChunkReceived(finalHint);
            onSuccessfulCompletion();
            return;
        }

        // No API keys configured - use local fallback hint
        console.warn("No AI API keys configured. Using fallback hints.");
        const fallbackHint = generateFallbackHint(promptParameters);
        onChunkReceived(fallbackHint);
        onSuccessfulCompletion();

    } catch (error) {
        console.error("Error generating AI hint:", error);

        // Try fallback on error
        try {
            const fallbackHint = generateFallbackHint(promptParameters);
            onChunkReceived(fallbackHint);
            onSuccessfulCompletion();
        } catch (fallbackError) {
            onError(error);
        }
    }
}

/**
 * Fetch hint from Groq API (FREE - 500K tokens/day)
 * Uses llama-3.3-70b-versatile for best quality
 */
async function fetchGroqHint(userPrompt, onChunkReceived) {
    const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile", // Best free model
            messages: [
                { role: "system", content: SA_CAPS_SYSTEM_PROMPT },
                { role: "user", content: userPrompt }
            ],
            max_tokens: 300, // Keep hints concise
            temperature: 0.7,
            stream: true,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Groq API error: ${response.status} - ${error}`);
    }

    // Handle streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullHint = "";

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter(line => line.startsWith("data: "));

        for (const line of lines) {
            const data = line.replace("data: ", "").trim();
            if (data === "[DONE]") continue;

            try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                    fullHint += content;
                    onChunkReceived(fullHint);
                }
            } catch (e) {
                // Skip malformed JSON chunks
            }
        }
    }

    return fullHint;
}

/**
 * Fetch hint from Google Gemini API (FREE - 1000 requests/day)
 * Used as fallback when Groq is unavailable
 */
async function fetchGeminiHint(userPrompt) {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: `${SA_CAPS_SYSTEM_PROMPT}\n\n${userPrompt}`
                }]
            }],
            generationConfig: {
                maxOutputTokens: 300,
                temperature: 0.7,
            },
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Please try again.";
}

/**
 * Build a prompt from the OATutor prompt parameters
 */
function buildPromptFromParameters(params) {
    const parts = [];

    if (params.problem_title) {
        parts.push(`Problem: ${params.problem_title}`);
    }
    if (params.problem_subtitle) {
        parts.push(params.problem_subtitle);
    }
    if (params.question_title) {
        parts.push(`Question: ${params.question_title}`);
    }
    if (params.question_subtitle) {
        parts.push(params.question_subtitle);
    }
    if (params.student_answer) {
        parts.push(`The learner answered: ${params.student_answer}`);
    }
    if (params.correct_answer) {
        parts.push(`The correct answer is: ${params.correct_answer}`);
    }

    parts.push("\nPlease provide a helpful hint to guide the learner towards the correct answer without giving it away directly.");

    return parts.join("\n");
}

/**
 * Generate a fallback hint when AI APIs are unavailable
 * Uses knowledge component to provide topic-specific guidance
 */
function generateFallbackHint(params) {
    const hints = {
        // Geometry fallbacks
        "geo-tangent-theorem": "Remember: A tangent to a circle is perpendicular to the radius at the point of tangency. This means the angle between them is always 90°.",
        "geo-cyclic-quad": "In a cyclic quadrilateral, opposite angles are supplementary (they add up to 180°). Also, an exterior angle equals the interior opposite angle.",
        "geo-proof-writing": "Start by stating what you need to prove. Then list the given information. Connect them step by step using theorems you know.",

        // Trigonometry fallbacks
        "trig-compound-add": "For compound angles, remember: sin(A+B) = sinA·cosB + cosA·sinB, and cos(A+B) = cosA·cosB - sinA·sinB",
        "trig-general-solution": "For general solutions, find the reference angle first, then add the period (360°n or 2πn for sin/cos, 180°n or πn for tan)",
        "trig-special-angles": "Remember your special triangles: 30-60-90 (sides 1:√3:2) and 45-45-90 (sides 1:1:√2)",

        // Analytical Geometry fallbacks
        "anl-distance-formula": "The distance formula is: d = √[(x₂-x₁)² + (y₂-y₁)²]. Make sure to subtract coordinates in the same order.",
        "anl-circle-center-form": "The standard form of a circle is (x-a)² + (y-b)² = r², where (a,b) is the centre and r is the radius.",

        // Statistics fallbacks
        "stats-regression-line": "The least squares regression line is ŷ = a + bx, where b = r(sy/sx) and a = ȳ - bx̄",
        "stats-correlation": "The correlation coefficient r tells you the strength and direction of a linear relationship. It ranges from -1 to 1.",
    };

    // Try to match a hint based on keywords in the problem
    const problemText = JSON.stringify(params).toLowerCase();

    for (const [kc, hint] of Object.entries(hints)) {
        const keywords = kc.replace(/-/g, " ").split(" ");
        if (keywords.some(kw => problemText.includes(kw))) {
            return hint;
        }
    }

    // Default fallback
    return "Take a moment to review the question carefully. Identify what information is given and what you need to find. Think about which formulas or theorems might apply here.";
}

const GroqHintService = {
    fetchDynamicHint,
};

export default GroqHintService;
