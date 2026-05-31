/**
 * Hint Service Wrapper
 * Routes hint requests to the appropriate service:
 * - Groq AI (FREE, 500K tokens/day) - default
 * - Google Gemini (FREE, 1000 requests/day) - fallback
 * - AWS Lambda (legacy, requires credentials) - only loaded if needed
 */

import { fetchDynamicHint as fetchGroqHint } from "../../services/GroqHintService";

// Configuration - prefer FREE services
const USE_FREE_AI = true; // Set to false to use AWS Lambda instead

// Lazy-load AWS helper only when needed (saves ~100MB from bundle)
let fetchAWSHint = null;
const loadAWSHint = async () => {
    if (!fetchAWSHint) {
        const module = await import("./DynamicHintHelper");
        fetchAWSHint = module.fetchDynamicHint;
    }
    return fetchAWSHint;
};

/**
 * Fetch a dynamic AI-generated hint
 * Automatically uses the best available free service
 */
export async function fetchDynamicHint(
    DYNAMIC_HINT_URL,
    promptParameters,
    onChunkReceived,
    onSuccessfulCompletion,
    onError,
    problemID,
    variabilization,
    context
) {
    if (USE_FREE_AI) {
        // Use FREE Groq/Gemini service
        return fetchGroqHint(
            DYNAMIC_HINT_URL,
            promptParameters,
            onChunkReceived,
            onSuccessfulCompletion,
            onError,
            problemID,
            variabilization,
            context
        );
    } else {
        // Use legacy AWS Lambda service (dynamically loaded)
        const awsHint = await loadAWSHint();
        return awsHint(
            DYNAMIC_HINT_URL,
            promptParameters,
            onChunkReceived,
            onSuccessfulCompletion,
            onError,
            problemID,
            variabilization,
            context
        );
    }
}

const HintService = {
    fetchDynamicHint,
};

export default HintService;
