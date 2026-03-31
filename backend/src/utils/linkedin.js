const generateLinkedinShareUrl = (text) => {
    // LinkedIn share article endpoint
    // https://www.linkedin.com/feed/?shareActive=true&text=...
    const encodedText = encodeURIComponent(text);
    return `https://www.linkedin.com/feed/?shareActive=true&text=${encodedText}`;
};

module.exports = { generateLinkedinShareUrl };
