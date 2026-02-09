import type { HistoricalDate, HistoricalDateRange } from '../../../shared/types';

/**
 * Convert a HistoricalDate to a numeric coordinate for timeline positioning.
 * Uses astronomical year numbering with fractional precision for month/day.
 * 
 * @param date - The date to convert
 * @returns Numeric coordinate (year + fractional month/day)
 */
export function toCoordinate(date: HistoricalDate): number {
  const monthFraction = date.month ? (date.month - 1) / 12 : 0;
  const dayFraction = date.day && date.month ? (date.day - 1) / 365 : 0;
  return date.year + monthFraction + dayFraction;
}

/**
 * Convert astronomical year to display year and era.
 * Astronomical: 1 BCE = 0, 2 BCE = -1, 1 CE = 1
 * Display: No year zero - goes from 1 BCE directly to 1 CE
 * 
 * @param year - Astronomical year number
 * @returns Object with display value and era
 */
export function astronomicalToDisplay(year: number): { value: number; era: 'BCE' | 'CE' } {
  if (year <= 0) {
    return { value: Math.abs(year) + 1, era: 'BCE' };
  }
  return { value: year, era: 'CE' };
}

/**
 * Format a month number to its abbreviated name.
 */
function formatMonth(month: number): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[month - 1] || '';
}

/**
 * Format a HistoricalDate as a human-readable string.
 * Handles BCE/CE, approximate dates, and varying precision levels.
 * 
 * @param date - The date to format
 * @returns Formatted date string
 */
export function format(date: HistoricalDate): string {
  const { value, era } = astronomicalToDisplay(date.year);
  const prefix = date.approximate ? 'c. ' : '';

  switch (date.precision) {
    case 'exact':
      if (date.month && date.day) {
        return `${prefix}${date.day} ${formatMonth(date.month)} ${value} ${era}`;
      }
      // Fall through to month or year precision
    case 'month':
      if (date.month) {
        return `${prefix}${formatMonth(date.month)} ${value} ${era}`;
      }
      // Fall through to year precision
    case 'year':
      return `${prefix}${value} ${era}`;
    
    case 'decade': {
      // Display decade as "260s BCE", "50s CE", etc.
      const decade = Math.floor(value / 10) * 10;
      return `${prefix}${decade}s ${era}`;
    }
    
    case 'century': {
      // Display century as "3rd century BCE", "1st century CE"
      const century = Math.ceil(value / 100);
      const ordinal = getOrdinal(century);
      return `${prefix}${ordinal} century ${era}`;
    }
  }
}

/**
 * Get ordinal suffix for a number (1st, 2nd, 3rd, etc.)
 */
function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  const suffix = s[(v - 20) % 10] || s[v] || s[0] || 'th';
  return n + suffix;
}

/**
 * Format a date range as a human-readable string.
 * 
 * @param range - The date range to format
 * @returns Formatted range string like "264–241 BCE" or "27 BCE – 14 CE"
 */
export function formatRange(range: HistoricalDateRange): string {
  const startDisplay = astronomicalToDisplay(range.start.year);
  const endDisplay = astronomicalToDisplay(range.end.year);

  // If same era, format as "264–241 BCE"
  if (startDisplay.era === endDisplay.era) {
    const startStr = format(range.start).replace(` ${startDisplay.era}`, '');
    const endStr = format(range.end);
    return `${startStr}–${endStr}`;
  }

  // Different eras: "27 BCE – 14 CE"
  return `${format(range.start)} – ${format(range.end)}`;
}

/**
 * Compare two HistoricalDates for sorting.
 * 
 * @param a - First date
 * @param b - Second date
 * @returns Negative if a < b, positive if a > b, 0 if equal
 */
export function compare(a: HistoricalDate, b: HistoricalDate): number {
  return toCoordinate(a) - toCoordinate(b);
}

/**
 * Parse a year string (with optional BCE/CE) to astronomical year number.
 * For use with year input field.
 * 
 * @param yearStr - Year string like "509 BCE", "44", "79 CE"
 * @returns Astronomical year number, or null if invalid
 */
export function parseYear(yearStr: string): number | null {
  const match = yearStr.trim().match(/^(\d+)\s*(BCE|BC|CE|AD)?$/i);
  if (!match || !match[1]) return null;

  const value = parseInt(match[1], 10);
  const era = match[2]?.toUpperCase();

  if (era === 'BCE' || era === 'BC') {
    const result = -(value - 1);  // 1 BCE = 0, 2 BCE = -1
    // Avoid -0 (negative zero) edge case
    return result === 0 ? 0 : result;
  }
  return value;  // CE or no era specified = positive
}
