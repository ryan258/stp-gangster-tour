import {describe, expect, it} from 'vitest';
import {decodeStudyMessage, decodeStudySelection, validStudyRoom} from '../../src/lib/study-state';
import {loadCatalog, validateCatalog} from '../../scripts/validate-content.mjs';

describe('Study browser input boundaries', () => {
  const allowed = ['opening', 'consequence', 'return'];
  it('restores only a bounded, versioned selection from this study', () => {
    expect(decodeStudySelection('{"version":1,"frame":"return"}', allowed)).toBe('return');
    for (const value of [null, 'bad JSON', '[]', '{"version":2,"frame":"return"}', '{"version":1,"frame":"tax"}', 'x'.repeat(513)]) {
      expect(decodeStudySelection(value, allowed)).toBeNull();
    }
  });
  it('accepts a known selection or handshake without propagating other fields', () => {
    expect(decodeStudyMessage({type: 'select', frame: 'return', html: '<script>bad</script>'}, allowed)).toEqual({type: 'select', frame: 'return'});
    expect(decodeStudyMessage({type: 'request'}, allowed)).toEqual({type: 'request'});
    for (const value of [null, [], 'return', {type: 'navigate', frame: 'return'}, {type: 'select', frame: '__proto__'}, {type: 'state', frame: 'tax'}]) {
      expect(decodeStudyMessage(value, allowed)).toBeNull();
    }
  });
  it('keeps pairing room IDs bounded and opaque', () => {
    expect(validStudyRoom('0123456789abcdef0123456789abcdef')).toBe(true);
    for (const value of [null, '', '../another-room', 'a'.repeat(33), 'A'.repeat(32)]) expect(validStudyRoom(value)).toBe(false);
  });
});

describe('Study content references', () => {
  const baseline = loadCatalog();
  const check = (data: typeof baseline) => validateCatalog(data, {assets: false});
  it('retains six forms and the unresolved human release gates', () => {
    expect(baseline.studies).toHaveLength(6);
    expect(check(baseline).errors).toEqual([]);
    expect(check(baseline).gates.length).toBeGreaterThan(0);
  });
  it.each([
    ['missing source claim', (d: any) => d.studies[0].frames[0].claimIds = ['C404']],
    ['uncatalogued image', (d: any) => d.studies[0].image = 'card-missing'],
    ['unknown actor', (d: any) => d.studies[0].frames[0].focusIds = ['invented']],
    ['stale highlighted text', (d: any) => d.studies[1].frames[0].highlight = 'This sentence does not exist.'],
    ['missing counterpart', (d: any) => delete d.studies[2].frames[0].pair],
    ['uncatalogued sound', (d: any) => d.studies[3].frames[0].ambienceId = 'missing'],
    ['wrong narration transcript', (d: any) => d.studies[3].passage.block = 'record'],
    ['duplicate view IDs', (d: any) => d.studies[4].frames[1].id = d.studies[4].frames[0].id],
    ['missing time sequence', (d: any) => delete d.studies[5].frames[0].timeline]
  ])('rejects %s', (_, mutate) => {
    const data = structuredClone(baseline);
    mutate(data);
    expect(check(data).errors.length).toBeGreaterThan(0);
  });
});
