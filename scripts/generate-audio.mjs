import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {execFileSync} from 'node:child_process';
import {sha256,normalizeTranscript} from './validate-content.mjs';
const root=process.cwd(),data=n=>JSON.parse(fs.readFileSync(`src/data/${n}.json`,'utf8'));
const stops=data('stops'),media=data('media'),reviews=data('narration-reviews');
const selected=process.argv.slice(2);
if(!selected.length||selected.some(id=>id!=='--ambience'&&!stops.some(s=>s.id===id)))throw new Error('Pass one or more known stop IDs. No files are generated implicitly.');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'stp-audio-'));
try{
 for(const stop of stops.filter(s=>selected.includes(s.id))){
  const text=normalizeTranscript(stop.blocks.intro.text),n=media.narration.find(n=>n.id===stop.narrationId);
  const transcript=path.join(temp,'intro.txt'),master=path.join(temp,'master.aiff'),encoded=path.join(temp,'audio.mp3');
  fs.writeFileSync(transcript,text);
  execFileSync('say',['-v','Samantha','-r','175','-f',transcript,'-o',master],{stdio:'pipe'});
  execFileSync('ffmpeg',['-y','-i',master,'-af','loudnorm=I=-16:TP=-1.5:LRA=11','-ar','44100','-ac','1','-c:a','libmp3lame','-b:a','128k',encoded],{stdio:'pipe'});
  const duration=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',encoded],{encoding:'utf8'}).trim());
  if(!Number.isFinite(duration)||duration<=0)throw new Error('Invalid generated duration');
  const masterFile=`/media/masters/${n.id}.aiff`;fs.mkdirSync(path.join(root,'public/media/masters'),{recursive:true});
  fs.copyFileSync(master,path.join(root,'public',masterFile));fs.copyFileSync(encoded,path.join(root,'public',n.file));
  Object.assign(n,{masterDigest:sha256(fs.readFileSync(master)),durationSeconds:duration,transcriptDigest:sha256(text),audioDigest:sha256(fs.readFileSync(encoded)),masterFile,voice:'macOS Samantha (synthesized narration)'});
  const review=reviews.narration.find(r=>r.id===n.id);Object.assign(review,{audioDigest:n.audioDigest,transcriptDigest:n.transcriptDigest,listeningReviewStatus:'pending',reviewDate:null,reviewedRevision:null,reviewer:null,reviewNotes:'Regenerated locally. Listening, pronunciation, and distribution-rights review required; no automatic approval.'});
  // Commit catalog updates after each completed track so a later failure cannot orphan successful output.
  fs.writeFileSync('src/data/media.json',JSON.stringify(media,null,2)+'\n');fs.writeFileSync('src/data/narration-reviews.json',JSON.stringify(reviews,null,2)+'\n');
  console.log(`${stop.id}: generated ${Math.round(duration)}s; listening review pending.`);
 }
 if(selected.includes('--ambience'))for(const [index,n]of media.ambience.entries()){
  const master=path.join(temp,'ambience.wav'),encoded=path.join(temp,'ambience.mp3');
  const filter=index===0?'lowpass=f=1200,highpass=f=200':'lowpass=f=450,highpass=f=60';
  execFileSync('ffmpeg',['-y','-f','lavfi','-i',`anoisesrc=d=30:c=${index===0?'pink':'brown'}:r=44100:a=0.04:s=${7301+index}`,'-af',`${filter},afade=t=in:d=1,afade=t=out:st=29:d=1`,'-c:a','pcm_s16le',master],{stdio:'pipe'});
  execFileSync('ffmpeg',['-y','-i',master,'-c:a','libmp3lame','-b:a','128k',encoded],{stdio:'pipe'});
  const masterFile=`/media/masters/${n.id}.wav`;fs.mkdirSync(path.join(root,'public/media/masters'),{recursive:true});fs.copyFileSync(master,path.join(root,'public',masterFile));fs.copyFileSync(encoded,path.join(root,'public',n.file));
  Object.assign(n,{masterFile,masterDigest:sha256(fs.readFileSync(master)),audioDigest:sha256(fs.readFileSync(encoded)),description:'Deterministic synthesized noise texture with a one-second fade at each end; not a field recording. Listening review pending.'});
  Object.assign(reviews.ambience.find(r=>r.id===n.id),{audioDigest:n.audioDigest,listeningReviewStatus:'pending',reviewDate:null,reviewedRevision:null,reviewer:null,reviewNotes:'Regenerated with a retained WAV master. Listening review remains pending.'});
  fs.writeFileSync('src/data/media.json',JSON.stringify(media,null,2)+'\n');fs.writeFileSync('src/data/narration-reviews.json',JSON.stringify(reviews,null,2)+'\n');console.log(`${n.id}: generated with WAV master; review pending.`);
 }
}finally{fs.rmSync(temp,{recursive:true,force:true});}
