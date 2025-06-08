import { describe, it, expect } from 'vitest';
import { formatPublishedDate } from '../dateUtils';

describe('formatPublishedDate', () => {
  it('formats dates less than 24 hours as hours ago', () => {
    const now = new Date();
    const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString();
    expect(formatPublishedDate(twelveHoursAgo)).toBe('12 hours ago');
  });

  it('formats dates less than 7 days as days ago', () => {
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatPublishedDate(twoDaysAgo)).toBe('2 days ago');
  });

  it('formats dates less than 30 days as weeks ago', () => {
    const now = new Date();
    const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatPublishedDate(fifteenDaysAgo)).toBe('2 weeks ago');
  });

  it('formats older dates with locale string', () => {
    const now = new Date();
    const oldDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString();
    const expected = new Date(oldDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    expect(formatPublishedDate(oldDate)).toBe(expected);
  });
});
