import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { schemas } from './content-schema.mjs';
export const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');
export const normalizeTranscript=value=>value.normalize('NFC').replace(/\r\n?/g,'\n').trim();
export function loadCatalog(root=process.cwd()) {
 return Object.fromEntries(Object.keys(schemas).map(k=>[k,JSON.parse(fs.readFileSync(path.join(root,'src/data',`${k}.json`),'utf8'))]));
}
export function validateCatalog(input,{root=process.cwd(),production=false,assets=true}={}) {
 const errors=[], gates=[], data={};
 for(const [key,schema] of Object.entries(schemas)) {
  const result=schema.safeParse(input[key]);
  if(!result.success) errors.push(...result.error.issues.map(i=>`${key}.${i.path.join('.')}: ${i.message}`));
  else data[key]=result.data;
 }
 if(errors.length) return {errors,gates};
 const maps={};
 const uniqueArrays=(v,trail='catalog')=>{if(Array.isArray(v)){if(v.every(x=>typeof x==='string')&&new Set(v).size!==v.length)errors.push(`${trail}: duplicate values`);v.forEach((x,i)=>uniqueArrays(x,`${trail}.${i}`));}else if(v&&typeof v==='object')for(const [k,x]of Object.entries(v))uniqueArrays(x,`${trail}.${k}`);};
 uniqueArrays(data);
 for(const name of ['stops','claims','sources','evidence','people','metagames','locations']) {
  maps[name]=new Map();
  for(const record of data[name]) { if(maps[name].has(record.id)) errors.push(`${name}: duplicate ${record.id}`);maps[name].set(record.id,record); }
 }
 for(const name of ['images','scenes','narration','ambience']) {
  maps[name]=new Map();for(const r of data.media[name]) {if(maps[name].has(r.id)) errors.push(`${name}: duplicate ${r.id}`);maps[name].set(r.id,r);}
 }
 const refs=(owner,field,values,target)=>{for(const id of values) if(!maps[target].has(id)) errors.push(`${owner}.${field}: unknown ${target} ID ${id}`);};
 refs('edition','stops',data.edition.stops,'stops');
 if(JSON.stringify(data.edition.stops)!==JSON.stringify([...data.stops].sort((a,b)=>a.order-b.order).map(s=>s.id))) errors.push('edition.stops: order differs from stop catalog');
 refs('edition','evidenceIds',data.edition.evidenceIds,'evidence');
 if(JSON.stringify(data.edition.evidenceIds)!==JSON.stringify(data.evidence.map(e=>e.id))) errors.push('edition.evidenceIds: differs from evidence catalog');
 if(Object.keys(data.edition.stopLabels).length!==data.stops.length||data.stops.some(s=>data.edition.stopLabels[s.id]!==s.title)) errors.push('edition.stopLabels: differs from stop titles');
 const orders=new Set();
 for(const s of data.stops) {
  if(orders.has(s.order)) errors.push(`${s.id}: duplicate order`);orders.add(s.order);
  for(const [field,target] of [['locationId','locations'],['sceneId','scenes'],['narrationId','narration']]) refs(s.id,field,[s[field]],target);
  refs(s.id,'ambienceId',[s.ambienceId],'ambience');
  refs(s.id,'evidenceIds',s.evidenceIds,'evidence');refs(s.id,'relatedPersonIds',s.relatedPersonIds,'people');refs(s.id,'relatedStopIds',s.relatedStopIds,'stops');
  for(const [key,b] of Object.entries(s.blocks)) {if(b.id!==key) errors.push(`${s.id}.${key}: block ID mismatch`);refs(s.id,key,b.claimIds,'claims');}
  if(s.blocks.intro.role!=='factual'||s.blocks.record.role!=='factual'||s.blocks.metagame.role!=='interpretive') errors.push(`${s.id}: block role mismatch`);
  refs(s.id,'metagameId',[s.blocks.metagame.metagameId],'metagames');
  if(maps.metagames.get(s.blocks.metagame.metagameId)?.owningStop!==s.id) errors.push(`${s.id}: metagame owner mismatch`);
  if(maps.locations.get(s.locationId)?.stopId!==s.id) errors.push(`${s.id}: location owner mismatch`);
  for(const eid of s.evidenceIds) if(maps.evidence.get(eid)?.stopId!==s.id) errors.push(`${s.id}: evidence ${eid} belongs to another stop`);
  const narr=maps.narration.get(s.narrationId);
  if(narr?.stopId!==s.id) errors.push(`${s.id}: narration owner mismatch`);
  if(narr?.transcriptDigest!==sha256(normalizeTranscript(s.blocks.intro.text))) errors.push(`${s.id}: stale narration transcript digest`);
  const words=t=>t.trim().split(/\s+/u).length;
  const intro=words(s.blocks.intro.text),total=words(Object.values(s.blocks).map(b=>b.text).join(' '));
  if(intro<120||intro>180) errors.push(`${s.id}: intro ${intro} words; expected 120–180`);
  if(total<300||total>450) errors.push(`${s.id}: narrative ${total} words; expected 300–450`);
  const prs=data.presenters.filter(p=>p.stopId===s.id);
  if(prs.length!==1) errors.push(`${s.id}: needs exactly one presenter`);
  else if(prs[0].kind!==s.presenterType||JSON.stringify(prs[0].items.map(x=>x.key))!==JSON.stringify(s.namedSelections)) errors.push(`${s.id}: presenter kind or selections mismatch`);
 }
 for(const key of ['prologue','epilogue']) refs(key,'premiseClaimIds',data.edition[key].premiseClaimIds,'claims');
 for(const c of data.claims) {refs(c.id,'sourceIds',c.sourceIds,'sources');if(c.evidenceBasis==='cross-source'&&c.sourceIds.length<2) errors.push(`${c.id}: cross-source requires multiple sources`);}
 for(const e of data.evidence) {refs(e.id,'stopId',[e.stopId],'stops');refs(e.id,'claimIds',e.claimIds,'claims');refs(e.id,'sourceLocators',e.sourceLocators.map(r=>r.sourceId),'sources');if(!maps.stops.get(e.stopId)?.evidenceIds.includes(e.id)) errors.push(`${e.id}: not owned by its stop`);}
 for(const p of data.people) {refs(p.id,'supportingClaimIds',p.supportingClaimIds,'claims');refs(p.id,'relatedStopIds',p.relatedStopIds,'stops');}
 for(const r of data.relationships) {refs('relationship','people',[r.fromId,r.toId],'people');refs('relationship','premiseClaims',r.premiseClaims,'claims');if(r.fromId===r.toId) errors.push('relationship: self edge');}
 for(const m of data.metagames) {refs(m.id,'owningStop',[m.owningStop],'stops');refs(m.id,'premiseClaims',m.premiseClaims,'claims');}
 for(const p of data.presenters) for(const x of p.items) {refs(p.stopId,'claimIds',x.claimIds,'claims');refs(p.stopId,'evidenceId',[x.evidenceId],'evidence');if(maps.evidence.get(x.evidenceId)?.stopId!==p.stopId) errors.push(`${p.stopId}: presenter evidence owner mismatch`);}
 for(const l of data.locations) {
  refs(l.id,'stopId',[l.stopId],'stops');refs(l.id,'supportingSourceId',[l.supportingSourceId],'sources');refs(l.id,'leadSourceIds',l.leadSourceIds??[],'sources');
  if((l.precision==='unknown')!==(l.coordinates===null)) errors.push(`${l.id}: precision and coordinates disagree`);
  if(l.access!=='unknown'&&!l.currentCheck) errors.push(`${l.id}: access claim requires dated current check`);
 }
 for(const c of data.corrections) refs(c.id,'claimIds',c.claimIds,'claims');
 // Every claim and source must be reachable from visitor-facing content; unused records rot silently.
 const usedClaims=new Set([...data.stops.flatMap(s=>Object.values(s.blocks).flatMap(b=>b.claimIds)),...data.evidence.flatMap(e=>e.claimIds),...data.presenters.flatMap(p=>p.items.flatMap(i=>i.claimIds)),...data.people.flatMap(p=>p.supportingClaimIds),...data.relationships.flatMap(r=>r.premiseClaims),...data.metagames.flatMap(m=>m.premiseClaims),...data.edition.prologue.premiseClaimIds,...data.edition.epilogue.premiseClaimIds]);
 for(const c of data.claims) if(!usedClaims.has(c.id)) errors.push(`${c.id}: claim is not cited by any visitor-facing content`);
 const usedSources=new Set([...data.claims.flatMap(c=>c.sourceIds),...data.evidence.flatMap(e=>e.sourceLocators.map(r=>r.sourceId)),...data.locations.flatMap(l=>[l.supportingSourceId,...(l.leadSourceIds??[])]),...data.media.scenes.flatMap(s=>s.referenceSourceIds)]);
 for(const s of data.sources) if(!usedSources.has(s.id)) errors.push(`${s.id}: source is not cited by any claim, evidence item, location or scene`);
 for(const id of ['loc-hotel','loc-castle-royal','loc-courthouse']) if(!maps.locations.get(id)?.coordinates) gates.push(`${id}: checked venue coordinates pending`);
 const reviewMaps={};
 for(const kind of ['narration','ambience']) {
  reviewMaps[kind]=new Map();
  for(const r of data['narration-reviews'][kind]) {
   if(reviewMaps[kind].has(r.id)) errors.push(`${r.id}: duplicate listening review`);reviewMaps[kind].set(r.id,r);
   refs(r.id,'review ID',[r.id],kind);
  }
  for(const n of data.media[kind]) {
   const r=reviewMaps[kind].get(n.id);
   if(!r) errors.push(`${n.id}: missing review record`);
   else if(r.audioDigest!==n.audioDigest||r.transcriptDigest!==(n.transcriptDigest??null)) errors.push(`${n.id}: review digest mismatch`);
   if(r?.listeningReviewStatus!=='passed'||!r.reviewer||!r.reviewDate||r.reviewedRevision!==data.edition.contentRevision) gates.push(`${n.id}: listening review pending/stale`);
   if(n.rightsStatus!=='approved') gates.push(`${n.id}: distribution rights review pending`);
   if(!n.masterFile) gates.push(`${n.id}: original lossless master missing`);
  }
 }
 for(const i of data.media.images) {
  if(i.provenanceStatus!=='confirmed'||!i.reviewer||!i.reviewDate||i.reviewedRevision!==data.edition.contentRevision) gates.push(`${i.id}: image provenance review pending`);
  if(i.rightsStatus!=='approved') gates.push(`${i.id}: distribution rights review pending`);
 }
 for(const s of data.media.scenes) {
  refs(s.id,'referenceSourceIds',s.referenceSourceIds,'sources');
  if(s.reviewStatus!=='reviewed'||!s.reviewer||!s.reviewDate||s.reviewedRevision!==data.edition.contentRevision||!s.referenceSourceIds.length) gates.push(`${s.id}: reference/render review pending`);
  if(s.rightsStatus!=='approved') gates.push(`${s.id}: distribution rights review pending`);
 }
 if(assets) {
  for(const [file,expected]of [[data.geography.sourceFile,data.geography.sourceDigest],[data.geography.baseFile,data.geography.baseDigest]]){try{if(sha256(fs.readFileSync(path.join(root,file)))!==expected)errors.push(`${file}: geography digest mismatch`);}catch{errors.push(`${file}: geography file missing`);}}
  const svgPaths=[];
  for(const a of [...data.media.images,...data.media.scenes,...data.media.narration,...data.media.ambience]) {
   const p=path.join(root,'public',a.file);
   try { const buf=fs.readFileSync(p);if(sha256(buf)!==(a.fileDigest??a.audioDigest)) errors.push(`${a.id}: file digest mismatch`);
    for(const v of a.variants??[]) if(!fs.existsSync(path.join(root,'public',v.file))) errors.push(`${a.id}: missing image variant ${v.file}`);
    if(a.file.endsWith('.svg')) svgPaths.push({path:p,width:a.width,height:a.height});
    if(a.masterFile){const master=path.join(root,a.masterFile);if(!fs.existsSync(master))errors.push(`${a.id}: missing lossless master`);else if(sha256(fs.readFileSync(master))!==a.masterDigest)errors.push(`${a.id}: master digest mismatch`);}
    if(a.file.endsWith('.mp3')){const probe=spawnSync('ffprobe',['-v','error','-show_entries','format=duration:stream=codec_name','-of','json',p],{encoding:'utf8'});if(probe.status!==0)errors.push(`${a.id}: audio decoding failed`);else {const info=JSON.parse(probe.stdout);if(!info.streams.some(s=>s.codec_name==='mp3')||Math.abs(Number(info.format.duration)-a.durationSeconds)>.6)errors.push(`${a.id}: audio format/duration differs from catalog`);}}
   } catch {errors.push(`${a.id}: missing/unreadable media file`);}
  }
  const xml=spawnSync('python3',[path.join(root,'scripts/check-svg.py')],{input:JSON.stringify(svgPaths),encoding:'utf8'});
  if(xml.status!==0) errors.push(`SVG validation: ${xml.stdout||xml.stderr||xml.error?.message}`);
 }
 if(data.geography.status!=='reviewed'||!data.geography.reviewer||!data.geography.reviewDate||!data.geography.baseSourceUrl||!data.geography.reuseBasis)gates.push('map: river/base geography reference and reuse review pending');
 if(data.edition.releaseStatus!=='reviewed') gates.push('edition: editorial release review pending');
 if(production) errors.push(...gates.map(g=>`Release gate: ${g}`));
 return {errors,gates};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {
 try {const result=validateCatalog(loadCatalog(),{production:process.argv.includes('--production')});
 if(result.errors.length) {console.error(result.errors.join('\n'));process.exitCode=1;}
 else console.log(`Structural content and asset checks passed. ${result.gates.length} release obligations remain; this is not listening or historical certification.`);
 } catch(e) {console.error(`Content validation could not complete: ${e.message}`);process.exitCode=1;}
}
