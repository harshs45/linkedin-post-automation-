const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// Fallback logic for MVP testing without a key yet
const generateFallback = (topic, style) => {
    return {
        style,
        hook: `[Mock ${style} hook] Want to know a secret about ${topic}?`,
        body: `[Mock ${style} body] Here are three things I learned...\n1. Point one\n2. Point two\n3. Point three`,
        cta: `[Mock ${style} cta] What do you think? Let me know below!`,
        hashtags: `#${topic.replace(/\s+/g, '')} #${style} #linkedin`,
        fullContent: `[Mock ${style} hook] Want to know a secret about ${topic}?\n\n[Mock ${style} body] Here are three things I learned...\n1. Point one\n2. Point two\n3. Point three\n\n[Mock ${style} cta] What do you think? Let me know below!\n\n#${topic.replace(/\s+/g, '')} #${style} #linkedin`
    };
};

const styles = ['story', 'achievement', 'educational', 'motivational', 'viral'];

const generatePosts = async (topic, context) => {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
        console.log("No Gemini API key, using mock response.");
        return styles.map(style => generateFallback(topic, style));
    }

    const prompt = `
    You are an expert LinkedIn copywriter. 
    User context:
    - Experience level: ${context.experience}
    - Achievements: ${context.achievements}
    - Goal: ${context.goal}
    
    Topic: ${topic}
    
    Generate 5 distinct LinkedIn posts in the following styles: ${styles.join(', ')}.
    For each post, structure as a JSON object with these exact keys: "style", "hook", "body", "cta", "hashtags", and "fullContent".
    Return ONLY a JSON array of 5 objects matching the styles.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        
        let rawText = response.text();
        return JSON.parse(rawText);
    } catch (error) {
        console.error("Gemini API error:", error);
        throw error;
    }
};

const regenerateSection = async (postData, sectionToRegenerate) => {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
        return `[Mock new ${sectionToRegenerate} Generated]`;
    }

    const prompt = `
    You are an expert LinkedIn copywriter.
    Here is a drafted post:
    Hook: ${postData.hook}
    Body: ${postData.body}
    CTA: ${postData.cta}
    Hashtags: ${postData.hashtags}

    Please write a completely new, better version ONLY for the "${sectionToRegenerate}" section. 
    Keep the same tone but try to make it more engaging.
    Return ONLY the new text for this section, without labels or markdown.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text().trim();
    } catch (error) {
        console.error(`Gemini API error regenerating ${sectionToRegenerate}:`, error);
        throw error;
    }
};

module.exports = { generatePosts, regenerateSection };
