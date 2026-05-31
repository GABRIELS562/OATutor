/**
 * MathOCRService - Extract math from photos using Gemini Vision API
 *
 * FREE: Uses Google Gemini 1.5 Flash Vision (1000 requests/day)
 * Perfect for JSDT-style "Mathie AI" photo-to-solution feature
 *
 * Recognizes:
 * - Handwritten math problems
 * - Printed textbook problems
 * - Geometry diagrams
 * - Graphs and tables
 */

const GEMINI_VISION_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

/**
 * System prompt for math OCR - optimized for SA CAPS curriculum
 */
const MATH_OCR_PROMPT = `You are a math OCR system specialized in South African CAPS curriculum (Grade 10-12).

Analyze this image and extract all mathematical content.

Your response MUST be valid JSON with this structure:
{
    "type": "problem" | "diagram" | "graph" | "table" | "mixed",
    "subject": "algebra" | "trigonometry" | "geometry" | "calculus" | "statistics" | "analytical_geometry",
    "grade": 10 | 11 | 12 | null,
    "latex": "The problem in LaTeX format",
    "plainText": "The problem in plain text",
    "diagrams": [
        {
            "description": "Description of any geometry diagram",
            "labels": ["A", "B", "C"],
            "relationships": ["AB parallel to CD", "angle ABC = 90°"]
        }
    ],
    "variables": {
        "x": "unknown to solve for",
        "θ": "angle measure"
    },
    "hints": ["Key concept 1", "Key concept 2"],
    "topic": "Specific CAPS topic e.g. 'Euclidean Geometry: Circle Theorems'"
}

IMPORTANT:
- For handwritten content, do your best to interpret
- Convert all math to proper LaTeX
- Identify the specific CAPS topic if possible
- If uncertain about any part, include a "confidence" field (0-1)
- For geometry, describe ALL labeled points, lines, and angles`;

/**
 * Recognize math from an image
 * @param {string} imageBase64 - Base64 encoded image (with or without data URI prefix)
 * @param {string} mimeType - Image MIME type (default: image/jpeg)
 * @returns {Promise<Object>} - Parsed math content
 */
async function recognizeMath(imageBase64, mimeType = 'image/jpeg') {
    if (!GEMINI_API_KEY || GEMINI_API_KEY.includes('[YOUR_')) {
        throw new Error('Gemini API key not configured. Add REACT_APP_GEMINI_API_KEY to your .env file.');
    }

    // Remove data URI prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    console.debug('[MathOCR] Processing image...');

    const response = await fetch(`${GEMINI_VISION_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [
                    {
                        text: MATH_OCR_PROMPT
                    },
                    {
                        inline_data: {
                            mime_type: mimeType,
                            data: base64Data
                        }
                    }
                ]
            }],
            generationConfig: {
                maxOutputTokens: 1024,
                temperature: 0.2, // Low temperature for accuracy
            },
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        console.error('[MathOCR] API error:', error);
        throw new Error(`Gemini Vision API error: ${response.status}`);
    }

    const data = await response.json();
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
        throw new Error('No response from Gemini Vision');
    }

    // Parse JSON response
    try {
        // Extract JSON from markdown code blocks if present
        const jsonMatch = textContent.match(/```json\n?([\s\S]*?)\n?```/) ||
                          textContent.match(/```\n?([\s\S]*?)\n?```/) ||
                          [null, textContent];

        const jsonStr = jsonMatch[1] || textContent;
        const parsed = JSON.parse(jsonStr.trim());

        console.debug('[MathOCR] Successfully parsed:', parsed.type, parsed.subject);
        return parsed;

    } catch (parseError) {
        console.warn('[MathOCR] JSON parse failed, returning raw text');
        return {
            type: 'unknown',
            subject: 'unknown',
            latex: '',
            plainText: textContent,
            raw: textContent,
            parseError: true
        };
    }
}

/**
 * Recognize math from a File object
 * @param {File} file - Image file
 * @returns {Promise<Object>} - Parsed math content
 */
async function recognizeMathFromFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const base64 = e.target.result;
                const result = await recognizeMath(base64, file.type);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => reject(new Error('Failed to read image file'));
        reader.readAsDataURL(file);
    });
}

/**
 * Quick validation that an image contains math
 * Uses a simpler prompt for faster response
 */
async function validateMathImage(imageBase64, mimeType = 'image/jpeg') {
    if (!GEMINI_API_KEY || GEMINI_API_KEY.includes('[YOUR_')) {
        return { valid: true, confidence: 0.5, reason: 'API not configured, skipping validation' };
    }

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const response = await fetch(`${GEMINI_VISION_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [
                    {
                        text: 'Does this image contain a math problem, equation, or geometry diagram? Reply with JSON: {"valid": true/false, "confidence": 0-1, "reason": "brief explanation"}'
                    },
                    {
                        inline_data: {
                            mime_type: mimeType,
                            data: base64Data
                        }
                    }
                ]
            }],
            generationConfig: {
                maxOutputTokens: 100,
                temperature: 0.1,
            },
        }),
    });

    if (!response.ok) {
        return { valid: true, confidence: 0.5, reason: 'Validation failed, proceeding anyway' };
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : { valid: true, confidence: 0.5 };
    } catch {
        return { valid: true, confidence: 0.5, reason: 'Parse error, proceeding anyway' };
    }
}

/**
 * Get API usage status
 */
function getApiStatus() {
    const hasKey = GEMINI_API_KEY && !GEMINI_API_KEY.includes('[YOUR_');
    return {
        configured: hasKey,
        provider: 'gemini',
        model: 'gemini-1.5-flash',
        dailyLimit: 1000,
        note: hasKey ? 'Ready to use' : 'Add REACT_APP_GEMINI_API_KEY to enable'
    };
}

const MathOCRService = {
    recognizeMath,
    recognizeMathFromFile,
    validateMathImage,
    getApiStatus,
};

export default MathOCRService;
