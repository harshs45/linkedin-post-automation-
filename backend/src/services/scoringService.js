const calculateEngagementScore = (fullContent, hook) => {
    // This is a naive heuristic for MVP instead of hitting the LLM again, 
    // or it could be derived from the AI generation.
    // However, the prompt implies "Engagement scoring system".
    // I will build a heuristic based on text length, keywords, formatting.
    
    // Hook Strength (1-10)
    let hook_strength = 5;
    if (hook.includes('?') || hook.includes('!')) hook_strength += 2;
    if (hook.length < 50) hook_strength += 1;
    if (hook.match(/\d+/)) hook_strength += 2; // numbers in hook often increase engagement
    hook_strength = Math.min(10, hook_strength);

    // Readability
    let readability = 'medium';
    const numLines = fullContent.split('\n').length;
    const numWords = fullContent.split(' ').length;
    if (numLines > 5 && numWords < 150) {
        readability = 'high'; // good spacing
    } else if (numWords > 300 && numLines < 5) {
        readability = 'low'; // wall of text
    }

    // Engagement Potential (1-10)
    let engagement_potential = 5;
    if (fullContent.includes('💡') || fullContent.includes('🚀')) engagement_potential += 1;
    if (numWords > 100 && numWords < 200) engagement_potential += 2;
    engagement_potential = Math.min(10, Math.floor((hook_strength + engagement_potential) / 1.5));

    return {
        hook_strength,
        readability,
        engagement_potential
    };
};

module.exports = { calculateEngagementScore };
