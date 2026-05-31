/**
 * AudioExplanationService - Generate and speak AI explanations
 *
 * Uses:
 * - Groq API (FREE 500K tokens/day) for generating explanations
 * - Gemini as backup (FREE 1000 requests/day)
 * - Web Speech API (FREE, built into browsers) for text-to-speech
 *
 * Designed for SA CAPS Mathematics curriculum
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

/**
 * System prompt for generating audio-friendly explanations
 * Optimized for spoken delivery (shorter sentences, natural pauses)
 */
const AUDIO_EXPLANATION_PROMPT = `You are a friendly South African mathematics tutor creating an audio explanation for a Grade 10-12 learner preparing for the NSC exam.

Your explanation will be READ ALOUD, so:
- Use SHORT, clear sentences (max 15-20 words each)
- Add natural pauses by using periods instead of commas
- Avoid complex symbols - say "squared" not "²", "times" not "×"
- Speak directly to the learner using "you" and "we"
- Use South African terminology (learner, maths, Grade)
- Break the solution into numbered steps
- Be encouraging but concise

Format your response as:
Step 1: [First part of explanation]
Step 2: [Second part]
...

Keep the total response under 200 words for comfortable listening.`;

/**
 * Generate an audio-friendly explanation using Groq or Gemini
 */
async function generateExplanation(context) {
    const {
        problemText,
        questionText,
        hintText,
        solutionText,
        problemId,
        stepId,
    } = context;

    // Build the prompt
    const userPrompt = buildExplanationPrompt({
        problemText,
        questionText,
        hintText,
        solutionText,
    });

    console.debug("Generating audio explanation...", { problemId, stepId });

    try {
        // Try Groq first (500K tokens/day FREE)
        if (GROQ_API_KEY && !GROQ_API_KEY.includes('[YOUR_')) {
            return await fetchGroqExplanation(userPrompt);
        }

        // Fallback to Gemini (1000 requests/day FREE)
        if (GEMINI_API_KEY && !GEMINI_API_KEY.includes('[YOUR_')) {
            console.debug("Using Gemini for explanation...");
            return await fetchGeminiExplanation(userPrompt);
        }

        // No API keys - return a generic fallback
        console.warn("No AI API keys configured for audio explanations");
        return generateFallbackExplanation(context);

    } catch (error) {
        console.error("Error generating audio explanation:", error);
        return generateFallbackExplanation(context);
    }
}

/**
 * Build prompt from context
 */
function buildExplanationPrompt(context) {
    const parts = [];

    if (context.problemText) {
        parts.push(`Problem: ${context.problemText}`);
    }
    if (context.questionText) {
        parts.push(`Question: ${context.questionText}`);
    }
    if (context.solutionText) {
        parts.push(`Solution to explain: ${context.solutionText}`);
    }
    if (context.hintText) {
        parts.push(`Hint context: ${context.hintText}`);
    }

    parts.push("\nCreate a clear, step-by-step audio explanation that a learner can listen to and follow along.");

    return parts.join("\n");
}

/**
 * Fetch explanation from Groq API
 */
async function fetchGroqExplanation(userPrompt) {
    const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: AUDIO_EXPLANATION_PROMPT },
                { role: "user", content: userPrompt }
            ],
            max_tokens: 400,
            temperature: 0.6, // Slightly lower for more consistent explanations
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Groq API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Please try again.";
}

/**
 * Fetch explanation from Gemini API
 */
async function fetchGeminiExplanation(userPrompt) {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: `${AUDIO_EXPLANATION_PROMPT}\n\n${userPrompt}`
                }]
            }],
            generationConfig: {
                maxOutputTokens: 400,
                temperature: 0.6,
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
 * Generate fallback explanation when no AI is available
 */
function generateFallbackExplanation(context) {
    const { questionText, solutionText, hintText } = context;

    let explanation = "Let me walk you through this problem.\n\n";

    if (questionText) {
        explanation += `Step 1: First, let's understand what we need to find. The question asks: ${questionText}\n\n`;
    }

    if (hintText) {
        explanation += `Step 2: Here's a helpful hint to guide you: ${hintText}\n\n`;
    }

    if (solutionText) {
        explanation += `Step 3: To solve this, we need to: ${solutionText}\n\n`;
    }

    explanation += "Step 4: Take your time to work through each step. You can do this!";

    return explanation;
}

/**
 * Get available speech synthesis voices
 * Filters for English voices, with preference for South African
 */
function getAvailableVoices() {
    if (!('speechSynthesis' in window)) {
        console.warn("Speech synthesis not supported");
        return [];
    }

    const allVoices = speechSynthesis.getVoices();

    // Filter for English voices
    const englishVoices = allVoices.filter(voice =>
        voice.lang.startsWith('en')
    );

    // Sort: SA English first, then British, then others
    return englishVoices.sort((a, b) => {
        const aScore = a.lang.includes('ZA') ? 0 : a.lang.includes('GB') ? 1 : 2;
        const bScore = b.lang.includes('ZA') ? 0 : b.lang.includes('GB') ? 1 : 2;
        return aScore - bScore;
    });
}

/**
 * Check if Web Speech API is supported
 */
function isSupported() {
    return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

/**
 * Speak text using Web Speech API
 * @param {string} text - Text to speak
 * @param {object} options - Speech options (rate, volume, voice)
 * @returns {Promise} - Resolves when speech completes
 */
function speak(text, options = {}) {
    return new Promise((resolve, reject) => {
        if (!isSupported()) {
            reject(new Error("Speech synthesis not supported"));
            return;
        }

        // Cancel any ongoing speech
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Apply options
        utterance.rate = options.rate || 1;
        utterance.volume = options.volume || 1;
        utterance.pitch = options.pitch || 1;

        // Set voice if specified
        if (options.voiceName) {
            const voices = speechSynthesis.getVoices();
            const voice = voices.find(v => v.name === options.voiceName);
            if (voice) {
                utterance.voice = voice;
            }
        }

        // Event handlers
        utterance.onend = () => resolve();
        utterance.onerror = (event) => reject(event);

        // Optional callbacks
        if (options.onBoundary) {
            utterance.onboundary = options.onBoundary;
        }
        if (options.onStart) {
            utterance.onstart = options.onStart;
        }

        // Speak
        speechSynthesis.speak(utterance);
    });
}

/**
 * Stop any ongoing speech
 */
function stop() {
    if (isSupported()) {
        speechSynthesis.cancel();
    }
}

/**
 * Pause speech
 */
function pause() {
    if (isSupported()) {
        speechSynthesis.pause();
    }
}

/**
 * Resume paused speech
 */
function resume() {
    if (isSupported()) {
        speechSynthesis.resume();
    }
}

/**
 * Check if currently speaking
 */
function isSpeaking() {
    return isSupported() && speechSynthesis.speaking;
}

/**
 * Check if speech is paused
 */
function isPaused() {
    return isSupported() && speechSynthesis.paused;
}

const AudioExplanationService = {
    generateExplanation,
    getAvailableVoices,
    isSupported,
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
};

export default AudioExplanationService;
