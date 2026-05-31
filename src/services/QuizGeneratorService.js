/**
 * QuizGeneratorService - AI-powered quiz generation
 *
 * Features:
 * - Topic-based multiple choice quizzes
 * - Difficulty levels (easy, medium, hard)
 * - Instant feedback with explanations
 * - CAPS curriculum aligned
 *
 * Uses Groq AI (FREE 500K tokens/day)
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;

/**
 * System prompt for quiz generation
 */
const QUIZ_SYSTEM_PROMPT = `You are an expert South African mathematics educator creating quiz questions for Grade 10-12 CAPS curriculum.

Generate multiple-choice questions that:
- Are appropriate for the specified grade level
- Follow NSC exam format and style
- Include clear, unambiguous options
- Have one definitively correct answer
- Include common misconceptions as distractors

Format your response as JSON:
{
    "quiz": {
        "title": "Quiz title",
        "topic": "Topic name",
        "grade": 10|11|12,
        "difficulty": "easy|medium|hard",
        "questions": [
            {
                "id": 1,
                "question": "Question text (can include LaTeX)",
                "options": [
                    {"id": "A", "text": "Option A"},
                    {"id": "B", "text": "Option B"},
                    {"id": "C", "text": "Option C"},
                    {"id": "D", "text": "Option D"}
                ],
                "correctAnswer": "A",
                "explanation": "Why this answer is correct",
                "hint": "Optional hint for struggling learners",
                "marks": 2
            }
        ],
        "totalMarks": 20,
        "timeLimit": 15
    }
}`;

/**
 * Generate a quiz for a topic
 */
async function generateQuiz(options) {
    if (!GROQ_API_KEY || GROQ_API_KEY.includes('[YOUR_')) {
        console.warn('[QuizGenerator] No API key, using template');
        return generateTemplateQuiz(options);
    }

    const prompt = buildQuizPrompt(options);

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
                    { role: 'system', content: QUIZ_SYSTEM_PROMPT },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 3000,
                temperature: 0.6,
            }),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;

        return parseQuizResponse(text);

    } catch (error) {
        console.error('[QuizGenerator] Error:', error);
        return generateTemplateQuiz(options);
    }
}

/**
 * Build prompt for quiz generation
 */
function buildQuizPrompt(options) {
    const { topic, grade, difficulty, questionCount, includeHints } = options;

    return `Generate a ${questionCount}-question multiple choice quiz on "${topic}" for Grade ${grade} Mathematics.

Requirements:
- Difficulty: ${difficulty}
- Each question has 4 options (A, B, C, D)
- Include explanations for correct answers
${includeHints ? '- Include hints for each question' : ''}
- Mix conceptual and calculation questions
- Follow CAPS curriculum standards
- Use NSC exam-style formatting`;
}

/**
 * Parse JSON response from AI
 */
function parseQuizResponse(text) {
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
        console.warn('[QuizGenerator] Parse error');
        return {
            quiz: {
                title: 'Generated Quiz',
                questions: [],
                parseError: true,
                raw: text,
            }
        };
    }
}

/**
 * Generate template quiz when AI unavailable
 */
function generateTemplateQuiz(options) {
    const { topic, grade, difficulty, questionCount } = options;

    const questions = [];
    for (let i = 1; i <= questionCount; i++) {
        questions.push({
            id: i,
            question: `Sample question ${i} about ${topic}`,
            options: [
                { id: 'A', text: 'Option A' },
                { id: 'B', text: 'Option B' },
                { id: 'C', text: 'Option C' },
                { id: 'D', text: 'Option D' },
            ],
            correctAnswer: 'A',
            explanation: 'Add Groq API key for AI-generated quizzes',
            hint: 'Configure REACT_APP_GROQ_API_KEY',
            marks: 2,
        });
    }

    return {
        quiz: {
            title: `${topic} Quiz - Grade ${grade}`,
            topic,
            grade,
            difficulty,
            questions,
            totalMarks: questionCount * 2,
            timeLimit: questionCount * 1.5,
            isTemplate: true,
        }
    };
}

/**
 * Grade a completed quiz
 */
function gradeQuiz(quiz, answers) {
    const results = {
        totalQuestions: quiz.questions.length,
        correct: 0,
        incorrect: 0,
        unanswered: 0,
        score: 0,
        totalMarks: quiz.totalMarks || quiz.questions.length * 2,
        percentage: 0,
        questionResults: [],
    };

    quiz.questions.forEach((question, index) => {
        const userAnswer = answers[question.id];
        const isCorrect = userAnswer === question.correctAnswer;

        if (!userAnswer) {
            results.unanswered++;
        } else if (isCorrect) {
            results.correct++;
            results.score += question.marks || 2;
        } else {
            results.incorrect++;
        }

        results.questionResults.push({
            questionId: question.id,
            userAnswer,
            correctAnswer: question.correctAnswer,
            isCorrect,
            explanation: question.explanation,
            marks: isCorrect ? (question.marks || 2) : 0,
        });
    });

    results.percentage = Math.round((results.score / results.totalMarks) * 100);

    return results;
}

/**
 * Get performance feedback based on score
 */
function getPerformanceFeedback(percentage) {
    if (percentage >= 80) {
        return {
            level: 'excellent',
            message: 'Outstanding! You have mastered this topic.',
            emoji: '🌟',
            suggestion: 'Try more challenging problems or help a classmate.',
        };
    } else if (percentage >= 60) {
        return {
            level: 'good',
            message: 'Well done! You have a good understanding.',
            emoji: '👍',
            suggestion: 'Review the questions you got wrong and try again.',
        };
    } else if (percentage >= 40) {
        return {
            level: 'fair',
            message: 'Good effort! Keep practicing.',
            emoji: '💪',
            suggestion: 'Focus on the concepts you struggled with.',
        };
    } else {
        return {
            level: 'needsWork',
            message: 'Don\'t give up! Practice makes perfect.',
            emoji: '📚',
            suggestion: 'Review the theory and try easier questions first.',
        };
    }
}

/**
 * Available quiz topics by grade
 */
const QUIZ_TOPICS = {
    10: [
        'Algebraic Expressions',
        'Exponents',
        'Number Patterns',
        'Equations & Inequalities',
        'Trigonometry',
        'Functions',
        'Euclidean Geometry',
        'Analytical Geometry',
        'Finance',
        'Statistics',
        'Measurement',
        'Probability',
    ],
    11: [
        'Exponents & Surds',
        'Equations & Inequalities',
        'Number Patterns',
        'Functions & Graphs',
        'Trigonometry',
        'Trigonometric Graphs',
        'Euclidean Geometry',
        'Measurement',
        'Analytical Geometry',
        'Finance',
        'Statistics',
        'Probability',
    ],
    12: [
        'Algebra & Equations',
        'Number Patterns & Sequences',
        'Functions & Inverse Functions',
        'Finance',
        'Calculus - Differentiation',
        'Calculus - Integration',
        'Trigonometry',
        'Euclidean Geometry',
        'Analytical Geometry',
        'Statistics',
        'Counting & Probability',
    ],
};

function getTopicsForGrade(grade) {
    return QUIZ_TOPICS[grade] || QUIZ_TOPICS[12];
}

const QuizGeneratorService = {
    generateQuiz,
    gradeQuiz,
    getPerformanceFeedback,
    getTopicsForGrade,
    QUIZ_TOPICS,
};

export default QuizGeneratorService;
