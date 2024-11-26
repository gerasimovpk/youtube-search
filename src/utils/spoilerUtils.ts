export const sanitizeFootballScore = (text: string): string => {
    // Hide common score patterns like "2-1", "2:1", "(2-1)", "[2-1]", etc.
    const scorePatterns = [
      /\b\d{1,2}[-:]\d{1,2}\b/g,           // Basic score format: 2-1, 2:1
      /\(\d{1,2}[-:]\d{1,2}\)/g,           // Parentheses: (2-1)
      /\[\d{1,2}[-:]\d{1,2}\]/g,           // Square brackets: [2-1]
      /\b\d{1,2}\s*[-:]\s*\d{1,2}\b/g,     // Scores with spaces: 2 - 1
      /\b\d{1,2}\s*to\s*\d{1,2}\b/gi,      // Written format: 2 to 1
    ];
  
    let sanitized = text;
    scorePatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '***');
    });
    return sanitized;
  };
  