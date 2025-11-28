import Groq from 'groq-sdk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Verify API key exists
if (!process.env.GROQ_API_KEY) {
    console.error('⚠️ GROQ_API_KEY is not set in environment variables');
}

// Initialize Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Get AI-powered suggestions for a card using Groq
 * @param {Object} card - Card object with title and description
 * @param {Array} boardLists - All lists in the board
 * @param {Array} boardCards - All cards in the board
 * @returns {Object} - AI-generated suggestions
 */
export const getAISuggestions = async (card, boardLists = [], boardCards = []) => {
    try {
        // Check if API key is available
        if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'undefined') {
            console.error('Groq API key is missing');
            return null;
        }

        console.log('🤖 Calling Groq AI for card:', card.title);

        const listNames = boardLists.map(list => list.title).join(', ');
        const cardTitles = boardCards
            .filter(c => c._id.toString() !== card._id.toString())
            .slice(0, 10)
            .map(c => c.title)
            .join(', ');

        // Calculate suggested due date (7 days from now as default)
        const suggestedDueDate = new Date();
        suggestedDueDate.setDate(suggestedDueDate.getDate() + 7);
        const formattedDate = suggestedDueDate.toISOString().split('T')[0];

        const prompt = `You are a smart project management assistant. Analyze this task card and provide helpful suggestions.

Task Title: "${card.title}"
Task Description: "${card.description || 'No description'}"
Current Due Date: "${card.dueDate ? new Date(card.dueDate).toISOString().split('T')[0] : 'Not set'}"
Available Lists: ${listNames || 'To Do, In Progress, Done'}
Other Cards in Board: ${cardTitles || 'None'}

Please provide suggestions in the following JSON format only (no markdown, no extra text):
{
  "dueDateSuggestion": {
    "hasDate": ${!card.dueDate},
    "suggestedDate": "${formattedDate}",
    "reason": "Brief explanation for the suggested date"
  },
  "listMovement": {
    "shouldMove": false,
    "suggestedList": null,
    "reason": "Brief explanation"
  },
  "insights": {
    "priority": "high/medium/low",
    "estimatedEffort": "Brief estimate (e.g., '2-3 hours', '1 day')",
    "actionableSteps": ["step1", "step2", "step3"],
    "potentialBlockers": ["blocker1 if any"]
  }
}

IMPORTANT: 
- For dueDateSuggestion, suggest a realistic date based on task complexity
- If the task already has a due date, set hasDate to false
- Make actionableSteps specific and helpful
- Keep all responses concise`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful project management assistant. Always respond with valid JSON only, no markdown formatting.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 1000,
        });

        const text = chatCompletion.choices[0]?.message?.content || '';

        console.log('✅ Groq AI response received');

        // Try to parse JSON from response
        let jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const suggestions = JSON.parse(jsonMatch[0]);
            return suggestions;
        }

        console.warn('⚠️ Could not parse JSON from Groq response');
        return null;
    } catch (error) {
        console.error('❌ Groq AI error:', error.message);
        if (error.message?.includes('API key') || error.message?.includes('401')) {
            console.error('🔑 API Key issue detected. Please verify your Groq API key.');
        }
        return null;
    }
};

/**
 * Get AI-powered card analysis and recommendations
 * @param {Object} card - Card to analyze
 * @param {Array} boardCards - All cards in the board
 * @param {Array} boardLists - All lists in the board
 * @returns {Object} - AI insights
 */
export const getCardInsights = async (card, boardCards = [], boardLists = []) => {
    try {
        const aiSuggestions = await getAISuggestions(card, boardLists, boardCards);

        if (!aiSuggestions) {
            return null;
        }

        return {
            aiPowered: true,
            dueDateSuggestion: aiSuggestions.dueDateSuggestion,
            listMovement: aiSuggestions.listMovement,
            insights: aiSuggestions.insights
        };
    } catch (error) {
        console.error('Failed to get AI insights:', error);
        return null;
    }
};
