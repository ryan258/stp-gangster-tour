import {describe,it,expect} from 'vitest';
import {loadCatalog,validateCatalog} from '../../scripts/validate-content.mjs';
const baseline=loadCatalog();
const check=(data:typeof baseline)=>validateCatalog(data,{assets:false});
describe('Content boundary regressions',()=>{
 it('accepts the corrected structural catalog while retaining release gates',()=>{const r=check(baseline);expect(r.errors).toEqual([]);expect(r.gates.length).toBeGreaterThan(0);});
 it.each([
  ['unknown claim status',(d:any)=>d.claims[0].status='Definitely true'],
  ['dangling narrative claim',(d:any)=>d.stops[0].blocks.record.claimIds=['C404']],
  ['wrong evidence owner',(d:any)=>d.evidence[0].stopId=d.stops[1].id],
  ['missing claim source',(d:any)=>d.claims[0].sourceIds=[]],
  ['unsafe source URL',(d:any)=>d.sources[0].url='javascript:alert(1)'],
  ['dangling person stop',(d:any)=>d.people[0].relatedStopIds=['missing']],
  ['wrong metagame owner',(d:any)=>d.metagames[0].owningStop=d.stops[1].id],
  ['invented canvas coordinates',(d:any)=>{d.locations[0].coordinates={x:20,y:30};d.locations[0].precision='exact';}],
  ['unclosed map polygon',(d:any)=>d['map-river'].rings[0].pop()],
  ['map point outside recorded bounds',(d:any)=>d['map-river'].rings[0][1][0]=-180],
  ['unsupported access claim',(d:any)=>d.locations[0].access='public'],
  ['duplicate record ID',(d:any)=>d.sources[1].id=d.sources[0].id],
  ['duplicate selection',(d:any)=>d.presenters[0].items[1].key=d.presenters[0].items[0].key],
  ['stale transcript',(d:any)=>d.stops[0].blocks.intro.text+=' A new sentence.'],
  ['stale review digest',(d:any)=>d['narration-reviews'].narration[0].audioDigest='0'.repeat(64)],
  ['wrong edition order',(d:any)=>d.edition.stops.reverse()],
  ['missing nested block',(d:any)=>delete d.stops[0].blocks.intro],
  ['invalid date',(d:any)=>d.claims[0].passageCheckDate='2026-02-30'],
  ['duplicate reference',(d:any)=>d.claims[0].sourceIds.push(d.claims[0].sourceIds[0])],
  ['AI tool recorded as reviewer',(d:any)=>{d.geography.status='reviewed';d.geography.reviewer='Codex — source review';}],
  ['claim cited by nothing',(d:any)=>d.claims.push({...d.claims[0],id:'C99'})],
  ['source cited by nothing',(d:any)=>d.sources.push({...d.sources[0],id:'S99'})],
  ['evidence manifest drift',(d:any)=>d.edition.evidenceIds.reverse()],
  ['stop label drift',(d:any)=>{d.edition.stopLabels[d.stops[0].id]='Another title';}],
  ['unknown ambience bed',(d:any)=>{d.stops[0].ambienceId='ambience-missing';}],
  ['image without catalog record fields',(d:any)=>{delete d.media.images[0].provenanceNote;}]
 ])('rejects %s',(_,mutate)=>{const d=structuredClone(baseline);mutate(d);expect(check(d).errors.length).toBeGreaterThan(0);});
 it('does not accept an automatic pass without reviewer/date/revision',()=>{const d=structuredClone(baseline);d['narration-reviews'].narration[0].listeningReviewStatus='passed';expect(check(d).gates.join('\n')).toContain('narr-the-arrangement: listening review pending/stale');});
 it('fails production on unresolved review obligations',()=>{expect(validateCatalog(baseline,{assets:false,production:true}).errors.some((e:string)=>e.startsWith('Release gate:'))).toBe(true);});
 it('keeps image provenance and rights as release gates',()=>{const g=check(baseline).gates.join('\n');expect(g).toContain('image provenance review pending');expect(g).toContain('image-hero-skyline: distribution rights review pending');});
 it('rejects missing and altered assets',()=>{const d=structuredClone(baseline);d.media.scenes[0].fileDigest='0'.repeat(64);d.media.ambience[0].file='/media/audio/missing.mp3';const errors=validateCatalog(d).errors.join('\n');expect(errors).toContain('file digest mismatch');expect(errors).toContain('missing/unreadable media');});
});
