import { describe, it, expect } from 'vitest';
import stops from '../../src/data/stops.json';
import claims from '../../src/data/claims.json';
import evidence from '../../src/data/evidence.json';
import sources from '../../src/data/sources.json';
import metagames from '../../src/data/metagames.json';
import edition from '../../src/data/edition.json';

describe('Tour Data Integrity', () => {
  it('contains exactly 7 ordered stops with required fields', () => {
    expect(stops).toHaveLength(7);
    stops.forEach((stop, index) => {
      expect(stop.order).toBe(index + 1);
      expect(stop.id).toBeTruthy();
      expect(stop.title).toBeTruthy();
      expect(stop.blocks.intro.text).toBeTruthy();
      expect(stop.blocks.record.text).toBeTruthy();
      expect(stop.blocks.metagame.text).toBeTruthy();
    });
  });

  it('contains 30 claims with valid statuses and source associations', () => {
    expect(claims).toHaveLength(30);
    const sourceIds = new Set(sources.map(s => s.id));
    claims.forEach(c => {
      expect(['Supported', 'Unsubstantiated', 'Qualified', 'Disputed']).toContain(c.status);
      c.sourceIds.forEach(sid => {
        expect(sourceIds.has(sid)).toBe(true);
      });
    });
  });

  it('contains 14 evidence records all mapped to valid stops and claims', () => {
    expect(evidence).toHaveLength(14);
    const stopIds = new Set(stops.map(s => s.id));
    const claimIds = new Set(claims.map(c => c.id));

    evidence.forEach(e => {
      expect(stopIds.has(e.stopId)).toBe(true);
      e.claimIds.forEach(cid => {
        expect(claimIds.has(cid)).toBe(true);
      });
    });
  });

  it('contains 7 metagame analytical entries mapped to stops', () => {
    expect(metagames).toHaveLength(7);
    const stopIds = new Set(stops.map(s => s.id));
    metagames.forEach(m => {
      expect(stopIds.has(m.owningStop)).toBe(true);
      expect(m.aims).toBeTruthy();
      expect(m.mechanism).toBeTruthy();
      expect(m.bearingCosts).toBeTruthy();
    });
  });

  it('edition metadata is consistent with stop list', () => {
    expect(edition.stops).toEqual(stops.map(s => s.id));
    expect(edition.prologue.paragraphs.length).toBeGreaterThan(0);
    expect(edition.epilogue.paragraphs.length).toBeGreaterThan(0);
  });
});
