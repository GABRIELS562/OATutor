/**
 * SlideGeneratorService - AI-powered presentation slide generation
 *
 * Uses Groq AI (FREE 500K tokens/day) to generate:
 * - Lesson presentations
 * - Topic summaries
 * - Exam preparation slides
 * - Formula sheets
 *
 * Exports to PDF using jsPDF
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;

/**
 * System prompt for generating educational slides
 */
const SLIDE_SYSTEM_PROMPT = `You are an expert South African mathematics educator creating presentation slides for Grade 10-12 CAPS curriculum.

Generate slides that are:
- Clear and visually structured
- Appropriate for the grade level
- Include worked examples
- Follow NSC exam format where applicable
- Use proper mathematical notation

Format your response as JSON:
{
    "title": "Presentation title",
    "subtitle": "Subtitle or topic",
    "grade": 10|11|12,
    "topic": "CAPS topic name",
    "duration": "Estimated lesson duration",
    "slides": [
        {
            "type": "title|content|example|formula|summary|practice",
            "title": "Slide title",
            "content": ["Bullet point 1", "Bullet point 2"],
            "notes": "Teacher notes (optional)",
            "image": "Description of suggested diagram/image (optional)"
        }
    ],
    "worksheetQuestions": [
        {
            "question": "Practice question text",
            "marks": 4,
            "solution": "Brief solution"
        }
    ]
}`;

/**
 * Slide templates for different topics
 */
const SLIDE_TEMPLATES = {
    'euclidean-geometry': {
        sections: ['Theorems', 'Properties', 'Worked Examples', 'Practice Problems'],
        examTips: true,
    },
    'trigonometry': {
        sections: ['Identities', 'Special Angles', 'Compound Angles', 'General Solutions'],
        examTips: true,
    },
    'calculus': {
        sections: ['Rules', 'First Principles', 'Applications', 'Optimization'],
        examTips: true,
    },
    'statistics': {
        sections: ['Data Types', 'Measures', 'Regression', 'Interpretation'],
        examTips: true,
    },
    'analytical-geometry': {
        sections: ['Formulas', 'Circle Equations', 'Tangent Lines', 'Applications'],
        examTips: true,
    },
};

/**
 * Generate slides for a topic
 * @param {Object} options - Generation options
 * @returns {Promise<Object>} - Generated slide deck
 */
async function generateSlides(options) {
    if (!GROQ_API_KEY || GROQ_API_KEY.includes('[YOUR_')) {
        console.warn('[SlideGenerator] No API key, using template');
        return generateTemplateSlides(options);
    }

    const userPrompt = buildSlidePrompt(options);

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
                    { role: 'system', content: SLIDE_SYSTEM_PROMPT },
                    { role: 'user', content: userPrompt }
                ],
                max_tokens: 3000,
                temperature: 0.5,
            }),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;

        return parseSlideResponse(text);

    } catch (error) {
        console.error('[SlideGenerator] Error:', error);
        return generateTemplateSlides(options);
    }
}

/**
 * Build prompt for slide generation
 */
function buildSlidePrompt(options) {
    const { topic, grade, duration, includeWorksheet, includeExamTips, customPrompt } = options;

    const parts = [
        `Create a ${duration}-minute lesson presentation on "${topic}" for Grade ${grade} Mathematics.`,
        '',
        'Requirements:',
        '- Title slide with topic and grade',
        '- Learning objectives slide',
        '- 4-6 content slides with key concepts',
        '- 2-3 worked example slides',
        '- Summary slide with key takeaways',
    ];

    if (includeExamTips) {
        parts.push('- Include NSC exam tips and common mistakes');
    }

    if (includeWorksheet) {
        parts.push('- Generate 3-5 practice questions with solutions');
    }

    if (customPrompt) {
        parts.push('', 'Additional requirements:', customPrompt);
    }

    return parts.join('\n');
}

/**
 * Parse JSON response from AI
 */
function parseSlideResponse(text) {
    if (!text) {
        throw new Error('Empty response');
    }

    try {
        const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) ||
                          text.match(/```\n?([\s\S]*?)\n?```/) ||
                          [null, text];

        const jsonStr = jsonMatch[1] || text;
        return JSON.parse(jsonStr.trim());

    } catch (error) {
        console.warn('[SlideGenerator] Parse error, creating basic structure');
        return {
            title: 'Generated Presentation',
            slides: [{
                type: 'content',
                title: 'Content',
                content: text.split('\n').filter(l => l.trim()),
            }],
            raw: text,
            parseError: true,
        };
    }
}

/**
 * Generate template-based slides when AI is unavailable
 */
function generateTemplateSlides(options) {
    const { topic, grade, duration } = options;

    return {
        title: topic,
        subtitle: `Grade ${grade} Mathematics`,
        grade: grade,
        topic: topic,
        duration: `${duration} minutes`,
        slides: [
            {
                type: 'title',
                title: topic,
                content: [`Grade ${grade} Mathematics`, 'SA CAPS Curriculum'],
            },
            {
                type: 'content',
                title: 'Learning Objectives',
                content: [
                    'Understand key concepts',
                    'Apply formulas correctly',
                    'Solve exam-style problems',
                    'Identify common mistakes',
                ],
            },
            {
                type: 'content',
                title: 'Key Concepts',
                content: [
                    'Add your key concepts here',
                    'Include relevant formulas',
                    'Explain important definitions',
                ],
                notes: 'Customize this slide with topic-specific content',
            },
            {
                type: 'example',
                title: 'Worked Example',
                content: [
                    'Add a worked example here',
                    'Show step-by-step solution',
                    'Highlight key steps',
                ],
            },
            {
                type: 'practice',
                title: 'Practice Problems',
                content: [
                    'Question 1: ...',
                    'Question 2: ...',
                    'Question 3: ...',
                ],
            },
            {
                type: 'summary',
                title: 'Summary',
                content: [
                    'Recap key points',
                    'Remember important formulas',
                    'Practice regularly',
                ],
            },
        ],
        worksheetQuestions: [
            {
                question: 'Practice question 1',
                marks: 4,
                solution: 'Solution to be added',
            },
        ],
        isTemplate: true,
    };
}

/**
 * Generate exam-style question paper
 */
async function generateQuestionPaper(options) {
    const {
        topic,
        grade,
        questionCount = 5,
        totalMarks = 50,
        difficulty = 'mixed', // easy, medium, hard, mixed
    } = options;

    if (!GROQ_API_KEY || GROQ_API_KEY.includes('[YOUR_')) {
        return generateTemplateQuestions(options);
    }

    const prompt = `Generate ${questionCount} NSC-style exam questions on "${topic}" for Grade ${grade}.

Requirements:
- Total marks: ${totalMarks}
- Difficulty: ${difficulty}
- Include mark allocations
- Provide full solutions
- Follow NSC format

Format as JSON:
{
    "title": "Question Paper Title",
    "instructions": ["Instruction 1", "Instruction 2"],
    "questions": [
        {
            "number": 1,
            "text": "Question text",
            "subQuestions": [
                {"label": "1.1", "text": "Sub-question", "marks": 2}
            ],
            "totalMarks": 4,
            "solution": "Full worked solution",
            "difficulty": "easy|medium|hard"
        }
    ],
    "totalMarks": ${totalMarks}
}`;

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
                    { role: 'system', content: 'You are an expert NSC Mathematics examiner.' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 2500,
                temperature: 0.6,
            }),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;

        return parseSlideResponse(text);

    } catch (error) {
        console.error('[SlideGenerator] Question paper error:', error);
        return generateTemplateQuestions(options);
    }
}

/**
 * Generate template questions when AI is unavailable
 */
function generateTemplateQuestions(options) {
    const { topic, grade, questionCount, totalMarks } = options;

    const marksPerQuestion = Math.floor(totalMarks / questionCount);
    const questions = [];

    for (let i = 1; i <= questionCount; i++) {
        questions.push({
            number: i,
            text: `Question ${i} placeholder`,
            subQuestions: [
                { label: `${i}.1`, text: 'Sub-question placeholder', marks: Math.floor(marksPerQuestion / 2) },
                { label: `${i}.2`, text: 'Sub-question placeholder', marks: Math.ceil(marksPerQuestion / 2) },
            ],
            totalMarks: marksPerQuestion,
            solution: 'Solution to be added',
            difficulty: 'medium',
        });
    }

    return {
        title: `${topic} - Grade ${grade} Assessment`,
        instructions: [
            'Answer ALL questions',
            'Show ALL working',
            'Calculators may be used',
        ],
        questions,
        totalMarks,
        isTemplate: true,
    };
}

/**
 * Get available topics
 */
function getAvailableTopics() {
    return Object.keys(SLIDE_TEMPLATES);
}

/**
 * Get API status
 */
function getApiStatus() {
    const hasKey = GROQ_API_KEY && !GROQ_API_KEY.includes('[YOUR_');
    return {
        configured: hasKey,
        provider: 'groq',
        model: 'llama-3.3-70b-versatile',
    };
}

const SlideGeneratorService = {
    generateSlides,
    generateQuestionPaper,
    getAvailableTopics,
    getApiStatus,
    SLIDE_TEMPLATES,
};

export default SlideGeneratorService;
