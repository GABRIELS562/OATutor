/**
 * SolutionGeneratorService - Generate step-by-step solutions using Groq AI
 *
 * FREE: Uses Groq's llama-3.3-70b-versatile (500K tokens/day)
 * Generates JSDT-style detailed solutions for SA CAPS curriculum
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;

// Fallback to Gemini if Groq unavailable
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

/**
 * System prompt for SA CAPS solution generation
 */
const SOLUTION_SYSTEM_PROMPT = `You are an expert South African mathematics tutor helping Grade 10-12 learners prepare for the NSC examinations.

Your task is to provide a detailed, step-by-step solution that a learner can follow and understand.

RULES:
1. Use South African terminology (learners, maths, Grade, etc.)
2. Reference relevant CAPS curriculum concepts
3. Show ALL working - examiners award marks for method
4. Use proper mathematical notation (LaTeX where helpful)
5. Explain WHY each step is taken, not just WHAT
6. Highlight common mistakes to avoid
7. End with a "Check your answer" section where applicable
8. Be encouraging but educational

FORMAT your response as JSON:
{
    "title": "Brief problem description",
    "difficulty": "easy" | "medium" | "hard",
    "topic": "CAPS topic name",
    "estimatedMarks": 4,
    "solution": {
        "steps": [
            {
                "number": 1,
                "title": "Step title",
                "explanation": "Why we do this",
                "working": "Mathematical working (can include LaTeX)",
                "tip": "Optional exam tip or common mistake"
            }
        ],
        "finalAnswer": "The final answer clearly stated",
        "checkMethod": "How to verify the answer"
    },
    "relatedTopics": ["Topic 1", "Topic 2"],
    "practiceProblems": ["similar-problem-id-1", "similar-problem-id-2"],
    "examTips": ["Tip 1 for NSC exam", "Tip 2"]
}`;

/**
 * Generate a step-by-step solution from OCR result
 * @param {Object} ocrResult - Result from MathOCRService
 * @param {Object} options - Generation options
 * @returns {Promise<Object>} - Structured solution
 */
async function generateSolution(ocrResult, options = {}) {
    const {
        showFullWorking = true,
        targetGrade = null,
        style = 'detailed' // 'detailed', 'concise', 'exam'
    } = options;

    // Build prompt from OCR result
    const userPrompt = buildSolutionPrompt(ocrResult, { showFullWorking, targetGrade, style });

    console.debug('[SolutionGenerator] Generating solution...', {
        type: ocrResult.type,
        subject: ocrResult.subject
    });

    try {
        // Try Groq first (500K tokens/day FREE)
        if (GROQ_API_KEY && !GROQ_API_KEY.includes('[YOUR_')) {
            return await generateWithGroq(userPrompt);
        }

        // Fallback to Gemini (1000 requests/day FREE)
        if (GEMINI_API_KEY && !GEMINI_API_KEY.includes('[YOUR_')) {
            console.debug('[SolutionGenerator] Falling back to Gemini...');
            return await generateWithGemini(userPrompt);
        }

        // No API keys - return placeholder
        console.warn('[SolutionGenerator] No API keys configured');
        return generateFallbackSolution(ocrResult);

    } catch (error) {
        console.error('[SolutionGenerator] Error:', error);
        throw error;
    }
}

/**
 * Build prompt from OCR result
 */
function buildSolutionPrompt(ocrResult, options) {
    const parts = [];

    parts.push(`Solve this ${ocrResult.subject || 'mathematics'} problem step by step:`);
    parts.push('');

    if (ocrResult.latex) {
        parts.push(`LaTeX: ${ocrResult.latex}`);
    }

    if (ocrResult.plainText) {
        parts.push(`Problem: ${ocrResult.plainText}`);
    }

    if (ocrResult.diagrams && ocrResult.diagrams.length > 0) {
        parts.push('');
        parts.push('Diagram information:');
        ocrResult.diagrams.forEach((d, i) => {
            parts.push(`- ${d.description}`);
            if (d.labels) parts.push(`  Labels: ${d.labels.join(', ')}`);
            if (d.relationships) parts.push(`  Relationships: ${d.relationships.join('; ')}`);
        });
    }

    if (ocrResult.topic) {
        parts.push(`\nCAPS Topic: ${ocrResult.topic}`);
    }

    if (ocrResult.grade) {
        parts.push(`Grade Level: ${ocrResult.grade}`);
    }

    parts.push('');

    if (options.style === 'exam') {
        parts.push('Format as an NSC exam answer with proper method marks shown.');
    } else if (options.style === 'concise') {
        parts.push('Provide a concise solution with key steps only.');
    } else {
        parts.push('Provide a detailed, learner-friendly solution with explanations.');
    }

    return parts.join('\n');
}

/**
 * Generate solution using Groq API
 */
async function generateWithGroq(userPrompt) {
    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: SOLUTION_SYSTEM_PROMPT },
                { role: 'user', content: userPrompt }
            ],
            max_tokens: 2000,
            temperature: 0.3, // Lower for more consistent solutions
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Groq API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    return parseJsonResponse(text);
}

/**
 * Generate solution using Gemini API
 */
async function generateWithGemini(userPrompt) {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: `${SOLUTION_SYSTEM_PROMPT}\n\n${userPrompt}`
                }]
            }],
            generationConfig: {
                maxOutputTokens: 2000,
                temperature: 0.3,
            },
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return parseJsonResponse(text);
}

/**
 * Parse JSON response from AI
 */
function parseJsonResponse(text) {
    if (!text) {
        throw new Error('Empty response from AI');
    }

    try {
        // Extract JSON from markdown code blocks if present
        const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) ||
                          text.match(/```\n?([\s\S]*?)\n?```/) ||
                          [null, text];

        const jsonStr = jsonMatch[1] || text;
        return JSON.parse(jsonStr.trim());

    } catch (parseError) {
        console.warn('[SolutionGenerator] JSON parse failed, creating structured response');

        // Create structured response from raw text
        return {
            title: 'Solution',
            difficulty: 'medium',
            topic: 'Mathematics',
            solution: {
                steps: [{
                    number: 1,
                    title: 'Solution',
                    explanation: '',
                    working: text,
                    tip: null
                }],
                finalAnswer: 'See working above',
                checkMethod: null
            },
            raw: text,
            parseError: true
        };
    }
}

/**
 * Generate fallback solution when no AI is available
 */
function generateFallbackSolution(ocrResult) {
    return {
        title: 'Solution Guide',
        difficulty: 'unknown',
        topic: ocrResult.topic || ocrResult.subject || 'Mathematics',
        estimatedMarks: null,
        solution: {
            steps: [
                {
                    number: 1,
                    title: 'Identify the problem type',
                    explanation: `This appears to be a ${ocrResult.subject || 'mathematics'} problem.`,
                    working: ocrResult.plainText || ocrResult.latex || 'Problem recognized',
                    tip: 'AI solution generation requires API keys. Add REACT_APP_GROQ_API_KEY or REACT_APP_GEMINI_API_KEY to your environment.'
                },
                {
                    number: 2,
                    title: 'Apply relevant concepts',
                    explanation: 'Use the appropriate formulas and theorems for this problem type.',
                    working: '',
                    tip: null
                }
            ],
            finalAnswer: 'Please configure AI API keys for full solutions',
            checkMethod: 'Substitute your answer back into the original equation'
        },
        relatedTopics: ocrResult.hints || [],
        examTips: [
            'Show all your working for method marks',
            'State the theorem or formula you are using'
        ],
        isPlaceholder: true
    };
}

/**
 * Generate solution with streaming (for real-time display)
 * @param {Object} ocrResult - OCR result
 * @param {Function} onChunk - Callback for each text chunk
 * @param {Function} onComplete - Callback when done
 */
async function generateSolutionStream(ocrResult, onChunk, onComplete, onError) {
    const userPrompt = buildSolutionPrompt(ocrResult, { style: 'detailed' });

    if (!GROQ_API_KEY || GROQ_API_KEY.includes('[YOUR_')) {
        onError(new Error('Groq API key not configured for streaming'));
        return;
    }

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: SOLUTION_SYSTEM_PROMPT },
                    { role: 'user', content: userPrompt }
                ],
                max_tokens: 2000,
                temperature: 0.3,
                stream: true,
            }),
        });

        if (!response.ok) {
            throw new Error(`Groq API error: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

            for (const line of lines) {
                const data = line.replace('data: ', '').trim();
                if (data === '[DONE]') continue;

                try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices?.[0]?.delta?.content;
                    if (content) {
                        fullText += content;
                        onChunk(fullText);
                    }
                } catch (e) {
                    // Skip malformed chunks
                }
            }
        }

        // Parse final result
        const finalResult = parseJsonResponse(fullText);
        onComplete(finalResult);

    } catch (error) {
        onError(error);
    }
}

/**
 * Find similar practice problems based on topic
 */
async function findSimilarProblems(solution, limit = 3) {
    // This would integrate with the problem database
    // For now, return placeholder
    return {
        problems: [],
        topic: solution.topic,
        note: 'Similar problem matching will be implemented with problem database integration'
    };
}

/**
 * Get API status
 */
function getApiStatus() {
    const hasGroq = GROQ_API_KEY && !GROQ_API_KEY.includes('[YOUR_');
    const hasGemini = GEMINI_API_KEY && !GEMINI_API_KEY.includes('[YOUR_');

    return {
        groq: {
            configured: hasGroq,
            model: 'llama-3.3-70b-versatile',
            dailyLimit: 500000, // tokens
        },
        gemini: {
            configured: hasGemini,
            model: 'gemini-1.5-flash',
            dailyLimit: 1000, // requests
        },
        primary: hasGroq ? 'groq' : hasGemini ? 'gemini' : 'none',
        ready: hasGroq || hasGemini
    };
}

const SolutionGeneratorService = {
    generateSolution,
    generateSolutionStream,
    findSimilarProblems,
    getApiStatus,
};

export default SolutionGeneratorService;
