import { supabase } from '../supabaseClient';

const OPENROUTER_API_URL = import.meta.env.VITE_OPENROUTER_API_URL || '/api/chat';
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
1) ANALYZE: Read the blueprint and user asks.
2) CLARIFY: BEFORE any build output, ask ONE high-impact question that unblocks delivery (e.g., "What is the most critical page or flow?" or "How many pages do you want and which ones?"). If user says "send prompt" or confirms, move to EXECUTE.
3) EXECUTE: Produce the requested artifact.

EXECUTE OUTPUT RULES:
- Output ONLY valid ${format} (no prose, no markdown fences).
- Include per-page detail: name, path, purpose, key sections/components, and any data needs. If e‑commerce, include checkout/cart behaviors. If palette is AI choice, pick a coherent palette.
- Keep within 600-700 chars when possible; stay concise.
- If clarifying (step 2) you may speak normally. In EXECUTE, output raw ${format} only.

TONE: Professional, concise, partner-like.
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
        return data.choices?.[0]?.message?.content || 'No content returned from AI.';

    } catch (error) {
        console.error('AI Service Error:', error);
        return `I encountered an error communicating with the AI: ${error.message}`;
    }
};
