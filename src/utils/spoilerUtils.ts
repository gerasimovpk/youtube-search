export const sanitizeFootballScore = (text: string): string => {
    // Hide common score patterns like "2-1", "2:1", "(2-1)", "[2-1]", "1 (2)", etc.
    const scorePatterns = [
      // Basic score formats
      /\b\d{1,2}[-:]\d{1,2}\b/g,           // 2-1, 2:1
      /\b\d{1,2}\s*[-:]\s*\d{1,2}\b/g,     // 2 - 1
      /\b\d{1,2}\s*to\s*\d{1,2}\b/gi,      // 2 to 1
      
      // Scores in brackets/parentheses
      /\[\d{1,2}[-:]\d{1,2}\]/g,           // [2-1]
      /\(\d{1,2}[-:]\d{1,2}\)/g,           // (2-1)
      
      // Aggregate scores
      /\b\d{1,2}\s*\(\d{1,2}\)/g,          // 1 (2)
      /\b\d{1,2}\s*\[\d{1,2}\]/g,          // 1 [2]
      
      // Single numbers in brackets/parentheses
      /\(\d{1,2}\)/g,                       // (2)
      /\[\d{1,2}\]/g,                       // [2]
    ];
  
    let sanitized = text;
    
    // First pass: replace scores with placeholders
    scorePatterns.forEach((pattern, index) => {
      sanitized = sanitized.replace(pattern, `__SCORE_${index}__`);
    });
    
    // Second pass: clean up any remaining brackets/parentheses around placeholders
    sanitized = sanitized.replace(/[\[\(]__SCORE_\d+__[\]\)]/g, '***');
    
    // Final pass: replace all placeholders with ***
    sanitized = sanitized.replace(/__SCORE_\d+__/g, '***');
    
    return sanitized;
  };
  