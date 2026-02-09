import { describe, it, expect } from 'vitest';
import {
  toCoordinate,
  astronomicalToDisplay,
  format,
  formatRange,
  compare,
  parseYear,
} from './historicalDate';
import type { HistoricalDate, HistoricalDateRange } from '../../../shared/types';

describe('historicalDate utilities', () => {
  describe('astronomicalToDisplay', () => {
    it('converts 1 BCE (0) correctly', () => {
      expect(astronomicalToDisplay(0)).toEqual({ value: 1, era: 'BCE' });
    });

    it('converts 2 BCE (-1) correctly', () => {
      expect(astronomicalToDisplay(-1)).toEqual({ value: 2, era: 'BCE' });
    });

    it('converts 509 BCE (-508) correctly', () => {
      expect(astronomicalToDisplay(-508)).toEqual({ value: 509, era: 'BCE' });
    });

    it('converts 1 CE (1) correctly', () => {
      expect(astronomicalToDisplay(1)).toEqual({ value: 1, era: 'CE' });
    });

    it('converts 476 CE (476) correctly', () => {
      expect(astronomicalToDisplay(476)).toEqual({ value: 476, era: 'CE' });
    });

    it('never produces year 0', () => {
      // Test boundary: -1, 0, 1
      expect(astronomicalToDisplay(-1).value).toBe(2);  // 2 BCE
      expect(astronomicalToDisplay(0).value).toBe(1);   // 1 BCE
      expect(astronomicalToDisplay(1).value).toBe(1);   // 1 CE
    });
  });

  describe('toCoordinate', () => {
    it('returns exact year for year-only dates', () => {
      const date: HistoricalDate = { year: 44, precision: 'year', approximate: false };
      expect(toCoordinate(date)).toBe(44);
    });

    it('adds month fraction correctly', () => {
      const date: HistoricalDate = { year: 44, month: 3, precision: 'month', approximate: false };
      // March = month 3, so (3-1)/12 = 2/12 = 0.1666...
      expect(toCoordinate(date)).toBeCloseTo(44.1667, 3);
    });

    it('adds day fraction correctly', () => {
      const date: HistoricalDate = { year: 44, month: 3, day: 15, precision: 'exact', approximate: false };
      // Month fraction: 2/12, Day fraction: 14/365
      expect(toCoordinate(date)).toBeCloseTo(44.2050, 3);
    });

    it('handles BCE dates', () => {
      const date: HistoricalDate = { year: -508, precision: 'year', approximate: false };
      expect(toCoordinate(date)).toBe(-508);
    });
  });

  describe('format', () => {
    it('formats simple BCE year', () => {
      const date: HistoricalDate = { year: -508, precision: 'year', approximate: false };
      expect(format(date)).toBe('509 BCE');
    });

    it('formats simple CE year', () => {
      const date: HistoricalDate = { year: 79, precision: 'year', approximate: false };
      expect(format(date)).toBe('79 CE');
    });

    it('formats approximate dates with c. prefix', () => {
      const date: HistoricalDate = { year: -508, precision: 'year', approximate: true };
      expect(format(date)).toBe('c. 509 BCE');
    });

    it('formats full date with day and month', () => {
      const date: HistoricalDate = { 
        year: -43, 
        month: 3, 
        day: 15, 
        precision: 'exact', 
        approximate: false 
      };
      expect(format(date)).toBe('15 Mar 44 BCE');
    });

    it('formats month and year', () => {
      const date: HistoricalDate = { 
        year: -43, 
        month: 3, 
        precision: 'month', 
        approximate: false 
      };
      expect(format(date)).toBe('Mar 44 BCE');
    });

    it('formats decade', () => {
      const date: HistoricalDate = { year: -263, precision: 'decade', approximate: false };
      expect(format(date)).toBe('260s BCE');
    });

    it('formats century', () => {
      const date: HistoricalDate = { year: -208, precision: 'century', approximate: false };
      expect(format(date)).toBe('3rd century BCE');
    });

    it('handles 1st, 2nd, 3rd ordinals correctly', () => {
      const first: HistoricalDate = { year: 50, precision: 'century', approximate: false };
      expect(format(first)).toBe('1st century CE');

      const second: HistoricalDate = { year: 150, precision: 'century', approximate: false };
      expect(format(second)).toBe('2nd century CE');

      const third: HistoricalDate = { year: 250, precision: 'century', approximate: false };
      expect(format(third)).toBe('3rd century CE');
    });
  });

  describe('formatRange', () => {
    it('formats range within same BCE era', () => {
      const range: HistoricalDateRange = {
        start: { year: -263, precision: 'year', approximate: false },
        end: { year: -240, precision: 'year', approximate: false },
      };
      expect(formatRange(range)).toBe('264–241 BCE');
    });

    it('formats range within same CE era', () => {
      const range: HistoricalDateRange = {
        start: { year: 98, precision: 'year', approximate: false },
        end: { year: 117, precision: 'year', approximate: false },
      };
      expect(formatRange(range)).toBe('98–117 CE');
    });

    it('formats range crossing BCE to CE', () => {
      const range: HistoricalDateRange = {
        start: { year: -26, precision: 'year', approximate: false },
        end: { year: 14, precision: 'year', approximate: false },
      };
      expect(formatRange(range)).toBe('27 BCE – 14 CE');
    });
  });

  describe('compare', () => {
    it('sorts BCE before CE', () => {
      const bce: HistoricalDate = { year: -43, precision: 'year', approximate: false };
      const ce: HistoricalDate = { year: 79, precision: 'year', approximate: false };
      expect(compare(bce, ce)).toBeLessThan(0);
    });

    it('sorts earlier BCE before later BCE', () => {
      const early: HistoricalDate = { year: -508, precision: 'year', approximate: false };
      const late: HistoricalDate = { year: -43, precision: 'year', approximate: false };
      expect(compare(early, late)).toBeLessThan(0);
    });

    it('sorts dates with same year but different months', () => {
      const march: HistoricalDate = { year: 44, month: 3, precision: 'month', approximate: false };
      const august: HistoricalDate = { year: 44, month: 8, precision: 'month', approximate: false };
      expect(compare(march, august)).toBeLessThan(0);
    });

    it('returns 0 for identical dates', () => {
      const date1: HistoricalDate = { year: 79, month: 8, day: 24, precision: 'exact', approximate: false };
      const date2: HistoricalDate = { year: 79, month: 8, day: 24, precision: 'exact', approximate: false };
      expect(compare(date1, date2)).toBe(0);
    });
  });

  describe('parseYear', () => {
    it('parses BCE year', () => {
      expect(parseYear('509 BCE')).toBe(-508);
      expect(parseYear('44 BCE')).toBe(-43);
      expect(parseYear('1 BCE')).toBe(0);
    });

    it('parses BC year (alternate)', () => {
      expect(parseYear('509 BC')).toBe(-508);
    });

    it('parses CE year', () => {
      expect(parseYear('79 CE')).toBe(79);
      expect(parseYear('476 CE')).toBe(476);
    });

    it('parses year without era as CE', () => {
      expect(parseYear('79')).toBe(79);
      expect(parseYear('2024')).toBe(2024);
    });

    it('handles whitespace', () => {
      expect(parseYear('  509  BCE  ')).toBe(-508);
    });

    it('returns null for invalid input', () => {
      expect(parseYear('not a year')).toBeNull();
      expect(parseYear('')).toBeNull();
      expect(parseYear('12.5 BCE')).toBeNull();
    });
  });
});
