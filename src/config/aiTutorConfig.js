/**
 * AI Tutor Configuration
 *
 * Provider-agnostic configuration for AI tutor service.
 * Supports Groq, Together, OpenRouter, DeepInfra.
 */

// Available AI providers
export const AI_PROVIDERS = {
    groq: {
        id: 'groq',
        name: 'Groq',
        baseUrl: 'https://api.groq.com/openai/v1/chat/completions',
        envKey: 'REACT_APP_GROQ_API_KEY',
        defaultModel: 'llama-3.3-70b-versatile',
        models: [
            { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', costPer1kInput: 0.00005, costPer1kOutput: 0.00008 },
            { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', costPer1kInput: 0.00002, costPer1kOutput: 0.00003 },
            { id: 'llama3-8b-8192', name: 'Llama 3 8B', costPer1kInput: 0.00001, costPer1kOutput: 0.00001 },
        ],
    },
    together: {
        id: 'together',
        name: 'Together AI',
        baseUrl: 'https://api.together.xyz/v1/chat/completions',
        envKey: 'REACT_APP_TOGETHER_API_KEY',
        defaultModel: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
        models: [
            { id: 'meta-llama/Llama-3.3-70B-Instruct-Turbo', name: 'Llama 3.3 70B Turbo', costPer1kInput: 0.00008, costPer1kOutput: 0.00008 },
            { id: 'mistralai/Mixtral-8x7B-Instruct-v0.1', name: 'Mixtral 8x7B', costPer1kInput: 0.00006, costPer1kOutput: 0.00006 },
        ],
    },
    openrouter: {
        id: 'openrouter',
        name: 'OpenRouter',
        baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
        envKey: 'REACT_APP_OPENROUTER_API_KEY',
        defaultModel: 'meta-llama/llama-3.3-70b-instruct',
        models: [
            { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B', costPer1kInput: 0.0001, costPer1kOutput: 0.0001 },
            { id: 'mistralai/mixtral-8x7b-instruct', name: 'Mixtral 8x7B', costPer1kInput: 0.00005, costPer1kOutput: 0.00005 },
        ],
    },
    deepinfra: {
        id: 'deepinfra',
        name: 'DeepInfra',
        baseUrl: 'https://api.deepinfra.com/v1/openai/chat/completions',
        envKey: 'REACT_APP_DEEPINFRA_API_KEY',
        defaultModel: 'meta-llama/Llama-3.3-70B-Instruct',
        models: [
            { id: 'meta-llama/Llama-3.3-70B-Instruct', name: 'Llama 3.3 70B', costPer1kInput: 0.00005, costPer1kOutput: 0.00008 },
        ],
    },
};

// Default provider (can be overridden by app_config in DB)
export const DEFAULT_PROVIDER = 'groq';

// Default monthly message cap
export const DEFAULT_MESSAGE_CAP = 100;

// System prompts for AI tutor
export const SYSTEM_PROMPTS = {
    en: `You are a friendly and patient maths and science tutor for South African Grade 10-12 students following the CAPS curriculum.

GUIDELINES:
- Give step-by-step explanations, not just answers
- Use simple language appropriate for high school students
- Reference CAPS curriculum topics when relevant
- Encourage students and build their confidence
- If asked about exam tips, focus on NSC matric exam strategies
- Use examples relevant to South African context where appropriate
- Be encouraging but honest about mistakes
- Ask clarifying questions if the student's query is unclear

SUBJECTS YOU HELP WITH:
- Mathematics (Algebra, Calculus, Trigonometry, Geometry, Statistics, Financial Maths)
- Physical Sciences (Physics: Mechanics, Waves, Electricity, Magnetism; Chemistry: Organic, Electrochemistry)

Always be supportive and remember that your goal is to help students understand concepts, not just get answers.`,

    af: `Jy is 'n vriendelike en geduldige wiskunde en wetenskap tutor vir Suid-Afrikaanse Graad 10-12 studente wat die CAPS kurrikulum volg.

RIGLYNE:
- Gee stap-vir-stap verduidelikings, nie net antwoorde nie
- Gebruik eenvoudige taal wat gepas is vir hoërskool studente
- Verwys na CAPS kurrikulum onderwerpe waar relevant
- Moedig studente aan en bou hul selfvertroue
- As gevra word oor eksamenwenke, fokus op NSC matriek eksamen strategieë
- Gebruik voorbeelde relevant tot die Suid-Afrikaanse konteks waar gepas
- Wees bemoedigend maar eerlik oor foute
- Vra opklarende vrae as die student se navraag onduidelik is

VAKKE WAARMEE JY HELP:
- Wiskunde (Algebra, Calculus, Trigonometrie, Meetkunde, Statistiek, Finansiële Wiskunde)
- Fisiese Wetenskappe (Fisika: Meganika, Golwe, Elektrisiteit, Magnetisme; Chemie: Organies, Elektrochemie)

Wees altyd ondersteunend en onthou dat jou doel is om studente te help om konsepte te verstaan, nie net antwoorde te kry nie.`,
};

// Messages for AI tutor UI
export const AI_TUTOR_MESSAGES = {
    en: {
        title: 'AI Tutor',
        subtitle: 'Get help with Maths & Science',
        placeholder: 'Ask me anything about Maths or Science...',
        send: 'Send',
        thinking: 'Thinking...',
        capReached: "You've reached your monthly AI tutor limit",
        capInfo: (used, cap) => `${used}/${cap} messages used this month`,
        resetDate: (date) => `Resets on ${date}`,
        feedbackPrompt: 'Was this helpful?',
        feedbackYes: 'Yes',
        feedbackNo: 'No',
        reportError: 'Report wrong answer',
        errorReported: 'Thanks for the feedback!',
        subscriptionRequired: 'Subscribe to use AI Tutor',
        networkError: 'Connection error. Please try again.',
        newChat: 'New Chat',
    },
    af: {
        title: 'KI Tutor',
        subtitle: 'Kry hulp met Wiskunde & Wetenskap',
        placeholder: 'Vra my enigiets oor Wiskunde of Wetenskap...',
        send: 'Stuur',
        thinking: 'Dink...',
        capReached: 'Jy het jou maandelikse KI tutor limiet bereik',
        capInfo: (used, cap) => `${used}/${cap} boodskappe gebruik hierdie maand`,
        resetDate: (date) => `Herstel op ${date}`,
        feedbackPrompt: 'Was dit nuttig?',
        feedbackYes: 'Ja',
        feedbackNo: 'Nee',
        reportError: 'Rapporteer verkeerde antwoord',
        errorReported: 'Dankie vir die terugvoer!',
        subscriptionRequired: 'Teken in om KI Tutor te gebruik',
        networkError: 'Verbindingsfout. Probeer asseblief weer.',
        newChat: 'Nuwe Gesels',
    },
};

/**
 * Get provider config
 */
export function getProvider(providerId) {
    return AI_PROVIDERS[providerId] || AI_PROVIDERS[DEFAULT_PROVIDER];
}

/**
 * Get API key for provider
 */
export function getApiKey(providerId) {
    const provider = getProvider(providerId);
    return process.env[provider.envKey] || '';
}

/**
 * Get model config
 */
export function getModel(providerId, modelId) {
    const provider = getProvider(providerId);
    return provider.models.find(m => m.id === modelId) || provider.models[0];
}

/**
 * Estimate cost for tokens
 */
export function estimateCost(providerId, modelId, inputTokens, outputTokens) {
    const model = getModel(providerId, modelId);
    return (inputTokens / 1000 * model.costPer1kInput) + (outputTokens / 1000 * model.costPer1kOutput);
}

/**
 * Get system prompt for language
 */
export function getSystemPrompt(language = 'en') {
    return SYSTEM_PROMPTS[language] || SYSTEM_PROMPTS.en;
}

/**
 * Get first day of next month (for cap reset display)
 */
export function getCapResetDate() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 1);
}

export default {
    AI_PROVIDERS,
    DEFAULT_PROVIDER,
    DEFAULT_MESSAGE_CAP,
    SYSTEM_PROMPTS,
    AI_TUTOR_MESSAGES,
    getProvider,
    getApiKey,
    getModel,
    estimateCost,
    getSystemPrompt,
    getCapResetDate,
};
