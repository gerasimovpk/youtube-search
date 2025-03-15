import { describe, expect, it } from 'vitest';
import { sanitizeFootballScore } from '../spoilerUtils';

describe('sanitizeFootballScore', () => {
  const testCases = [
    {
      input: 'HIGHLIGHTS | Atlético de Madrid 1 (2) - 0 (4) Real Madrid | ⚽ Gallagher | 24/25 UCL, Round of 16',
      expected: 'HIGHLIGHTS | Atlético de Madrid *** - *** Real Madrid | ⚽ Gallagher | 24/25 UCL, Round of 16'
    },
    {
      input: 'Manchester United 2-1 Liverpool | Premier League Highlights',
      expected: 'Manchester United *** Liverpool | Premier League Highlights'
    },
    {
      input: 'Chelsea [2:1] Arsenal - All Goals & Extended Highlights',
      expected: 'Chelsea *** Arsenal - All Goals & Extended Highlights'
    },
    {
      input: 'Real Madrid 3 - 2 Barcelona | El Clasico Goals',
      expected: 'Real Madrid *** Barcelona | El Clasico Goals'
    },
    {
      input: 'PSG 2:2 (5:3) Bayern Munich | Champions League',
      expected: 'PSG *** *** Bayern Munich | Champions League'
    },
    {
      input: 'Milan 1 [2] Juventus | Serie A Highlights',
      expected: 'Milan *** Juventus | Serie A Highlights'
    },
    {
      input: 'Ajax 3 to 1 PSV | Eredivisie Classic',
      expected: 'Ajax *** PSV | Eredivisie Classic'
    },
    {
      input: 'Inter (2) Napoli (1) | Coppa Italia Semi-Final',
      expected: 'Inter *** Napoli *** | Coppa Italia Semi-Final'
    }
  ];

  testCases.forEach(({ input, expected }) => {
    it(`should sanitize: ${input}`, () => {
      expect(sanitizeFootballScore(input)).toBe(expected);
    });
  });

  // Additional edge cases
  it('should handle multiple scores in the same text', () => {
    expect(sanitizeFootballScore('First Leg: 2-1, Second Leg: 1-1 (3-2 agg.)'))
      .toBe('First Leg: ***, Second Leg: *** (*** agg.)');
  });

  it('should handle scores with extra spaces', () => {
    expect(sanitizeFootballScore('Team A 2  :  1 Team B'))
      .toBe('Team A *** Team B');
  });

  it('should not modify text without scores', () => {
    const text = 'Amazing football match between two great teams';
    expect(sanitizeFootballScore(text)).toBe(text);
  });

  it('should handle empty string', () => {
    expect(sanitizeFootballScore('')).toBe('');
  });
}); 