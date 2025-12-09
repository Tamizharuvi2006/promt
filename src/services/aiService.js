import { supabase } from '../supabaseClient';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_API_URL = import.meta.env.VITE_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions';
const AI_MODEL = import.meta.env.VITE_AI_MODEL || 'google/gemini-2.0-flash-exp:free';

/**
 * Sends a message to the OpenRouter API with project context.
 * Implements "Analyze -> Clarify -> Execute" logic.
 * 
 * @param {Array} history - Array of chat messages { role: 'user'|'assistant', content: string }
 * @param {Object} project - The project object containing name and description (blueprint)
 * @returns {Promise<string>} - The AI's response text
 */
export const sendMessageToOpenRouter = async (history, project) => {
    if (!OPENROUTER_API_KEY) {
        console.warn('VITE_OPENROUTER_API_KEY is missing. Falling back to simulation.');
        return "Error: OpenRouter API Key is missing. Please add VITE_OPENROUTER_API_KEY to your .env file.";
    }

    // Extract format preference from blueprint helper
    const getFormatPreference = (desc) => {
        if (/Format:\s*JSON/i.test(desc)) return 'JSON';
        if (/Format:\s*XML/i.test(desc)) return 'XML';
        return 'JSON'; // Default
    };

    const format = getFormatPreference(project.description);

    const systemPrompt = `
You are an expert AI Software Architect and Product Manager helping a user build a software project.

PROJECT CONTEXT:
Name: ${project.name}
Blueprint:
${project.description}

YOUR PROCESS (STRICTLY FOLLOW THIS):
1. **ANALYZE**: Deeply understand the user's request in the context of the Project Blueprint.
2. **CLARIFY**: If the user's request is vague, ambiguous, or missing critical details, DO NOT generate the final output yet. Instead, ask specific clarifying questions.
3. **EXECUTE**: Only when you have clear requirements or if the user explicitly confirms to proceed, generate the final response.

**CRITICAL OUTPUT RULES FOR 'EXECUTE' PHASE:**
- You must output ONLY valid ${format} code.
- DO NOT Include any conversational text, explanations, or markdown code blocks (e.g. no \`\`\`json wrappers).
- JUST THE RAW ${format} STRING.
- If you are asking clarifying questions (Phase 2), you may speak normally.
- If you are delivering the final result (Phase 3), SILENCE ALL CHATTER and output only ${format}.

TONE:
- Professional, insightful, and precise.
- Act like a senior partner in the project.
`.trim();

    const messages = [
        { role: 'system', content: systemPrompt },
        ...history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
        }))
    ];

    try {
        const response = await fetch(OPENROUTER_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': window.location.origin, // Required by OpenRouter
                'X-Title': 'Prompt Engine', // Optional
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: AI_MODEL,
                messages: messages,
                temperature: 0.7,
            })
        });

        if (!response.ok) {
            let detail = '';
            try {
                const errorData = await response.json();
                detail = errorData?.error?.message || JSON.stringify(errorData);
            } catch (e) {
                detail = await response.text();
            }
            const message = `API Error ${response.status}: ${detail || 'Unknown error from OpenRouter'}`;
            throw new Error(message);
        }

        const data = await response.json();
        return data.choices[0].message.content;

    } catch (error) {
        console.error('AI Service Error:', error);
        return `I encountered an error communicating with the AI: ${error.message}`;
    }
};
