import {describe,it,expect} from 'vitest';
import {decodeProgress,decodePreferences,STOP_IDS,bookmarkURL} from '../../src/scripts/storage';
const raw=(obj:unknown)=>JSON.stringify(obj);
describe('Stored data is untrusted',()=>{
 it('recovers independently, drops unknown IDs, and deduplicates',()=>{const p=decodeProgress(raw({schemaVersion:1,bookmark:{stopId:STOP_IDS[1],blockId:'bogus'},visitedStops:[STOP_IDS[0],STOP_IDS[0],'gone',null],inspectedEvidence:['E01','E01','E99',42],endingReached:'false'}));expect(p.visitedStops).toEqual([STOP_IDS[0]]);expect(p.inspectedEvidence).toEqual(['E01']);expect(p.endingReached).toBe(false);expect(p.bookmark?.blockId).toBe('intro');});
 it('replaces a removed bookmark with the first unvisited stop',()=>{const p=decodeProgress(raw({schemaVersion:1,bookmark:{stopId:'gone'},visitedStops:[STOP_IDS[0]]}));expect(p.bookmark).toEqual({stopId:STOP_IDS[1],blockId:'intro'});});
 it('uses the map when all stops visited and an old bookmark was removed',()=>{expect(bookmarkURL(decodeProgress(raw({schemaVersion:1,bookmark:{stopId:'gone'},visitedStops:STOP_IDS})).bookmark)).toBe('/map/');});
 it('constrains bookend blocks and ignores unsafe IDs',()=>{expect(decodeProgress(raw({schemaVersion:1,bookmark:{stopId:'epilogue',blockId:'record'}})).bookmark?.blockId).toBe('opening');expect(bookmarkURL(decodeProgress(raw({schemaVersion:1,bookmark:{stopId:'javascript:alert(1)'}})).bookmark)).toBe(`/stops/${STOP_IDS[0]}/#intro`);});
 it.each(['{',raw({schemaVersion:3,endingReached:true}),raw({schemaVersion:1,junk:'é'.repeat(20000),endingReached:true})])('resets malformed, unknown-version or oversized UTF-8 payloads',value=>{expect(decodeProgress(value).endingReached).toBe(false);});
 it('validates preferences by type without discarding other valid fields',()=>{const p=decodePreferences(raw({schemaVersion:1,calmView:'false',narrationVolume:0,ambienceVolume:2,playbackSpeed:1.25}));expect(p).toEqual({schemaVersion:1,calmView:false,narrationVolume:0,ambienceVolume:1,playbackSpeed:1.25});});
});
