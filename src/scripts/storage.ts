import edition from '../data/edition.json';
// The small manifest is the only content needed by browser state validation.
export const STOP_IDS: string[] = edition.stops;
export const EVIDENCE_IDS = Array.from({length:14},(_,i)=>`E${String(i+1).padStart(2,'0')}`);
export const PROGRESS_KEY='stp-after-dark:progress:v1';
export const PREFS_KEY='stp-after-dark:preferences:v1';
export type Bookmark={stopId:string;blockId:'intro'|'record'|'metagame'|'opening'};
export interface Progress {schemaVersion:1;contentRevision:string;bookmark:Bookmark|null;visitedStops:string[];inspectedEvidence:string[];endingReached:boolean}
export interface Preferences {schemaVersion:1;calmView:boolean;narrationVolume:number;ambienceVolume:number;playbackSpeed:number}
export const defaultProgress=():Progress=>({schemaVersion:1,contentRevision:edition.contentRevision,bookmark:null,visitedStops:[],inspectedEvidence:[],endingReached:false});
export const defaultPreferences=():Preferences=>({schemaVersion:1,calmView:false,narrationVolume:.7,ambienceVolume:.2,playbackSpeed:1});
const object=(v:unknown):v is Record<string,unknown>=>typeof v==='object'&&v!==null&&!Array.isArray(v);
const known=(v:unknown,allowed:string[])=>Array.isArray(v)?[...new Set(v.filter((s):s is string=>typeof s==='string'&&allowed.includes(s)))]:[];
function parse(raw:string|null):Record<string,unknown> {
 if(!raw||new TextEncoder().encode(raw).byteLength>32768)return {};
 try {const data:unknown=JSON.parse(raw);return object(data)&&data.schemaVersion===1?data:{};}catch{return {};}
}
export function decodeProgress(raw:string|null):Progress {
 const data=parse(raw),p=defaultProgress();
 p.visitedStops=known(data.visitedStops,STOP_IDS);p.inspectedEvidence=known(data.inspectedEvidence,EVIDENCE_IDS);p.endingReached=data.endingReached===true;
 if(object(data.bookmark)&&typeof data.bookmark.stopId==='string') {
  const stopId=data.bookmark.stopId,valid=STOP_IDS.includes(stopId),bookend=['prologue','epilogue'].includes(stopId);
  if(valid||bookend) p.bookmark={stopId,blockId:bookend?'opening':(['intro','record','metagame'].includes(String(data.bookmark.blockId))?data.bookmark.blockId as Bookmark['blockId']:'intro')};
  else {const next=STOP_IDS.find(id=>!p.visitedStops.includes(id));if(next)p.bookmark={stopId:next,blockId:'intro'};}
 }
 return p;
}
export function decodePreferences(raw:string|null):Preferences {
 const data=parse(raw),p=defaultPreferences();p.calmView=data.calmView===true;
 for(const key of ['narrationVolume','ambienceVolume'] as const) if(typeof data[key]==='number'&&Number.isFinite(data[key]))p[key]=Math.min(1,Math.max(0,data[key]));
 if(typeof data.playbackSpeed==='number'&&[.75,1,1.25,1.5].includes(data.playbackSpeed))p.playbackSpeed=data.playbackSpeed;
 return p;
}
let progressMemory=defaultProgress(),preferencesMemory=defaultPreferences();
const unavailable=new Set<string>();
export function storageNotice() {
 const notice=document.getElementById('storage-notice');if(notice){notice.hidden=false;notice.textContent='Saving is unavailable. Changes are temporary on this page and may be lost when you leave. Existing saved data could not be changed.';}
}
function failed(key:string){unavailable.add(key);if(typeof document!=='undefined')storageNotice();}
export function getProgress():Progress {if(!unavailable.has(PROGRESS_KEY))try{progressMemory=decodeProgress(localStorage.getItem(PROGRESS_KEY));}catch{failed(PROGRESS_KEY);}return structuredClone(progressMemory);}
export function getPreferences():Preferences {if(!unavailable.has(PREFS_KEY))try{preferencesMemory=decodePreferences(localStorage.getItem(PREFS_KEY));}catch{failed(PREFS_KEY);}return {...preferencesMemory};}
function write(key:string,value:unknown):boolean {
 if(unavailable.has(key)){storageNotice();return false;}
 try {const raw=JSON.stringify(value);if(new TextEncoder().encode(raw).byteLength>32768)throw new Error('State too large');localStorage.setItem(key,raw);return true;}catch{failed(key);return false;}
}
export function saveProgress(patch:Partial<Progress>):boolean {progressMemory=decodeProgress(JSON.stringify({...getProgress(),...patch,schemaVersion:1}));const saved=write(PROGRESS_KEY,progressMemory);window.dispatchEvent(new Event('stp:progress'));return saved;}
export function savePreferences(patch:Partial<Preferences>):boolean {preferencesMemory=decodePreferences(JSON.stringify({...getPreferences(),...patch,schemaVersion:1}));const saved=write(PREFS_KEY,preferencesMemory);window.dispatchEvent(new CustomEvent('stp:preferences',{detail:{...preferencesMemory}}));return saved;}
export function saveBookmark(bookmarkOrStopId: Bookmark | string, blockId?: Bookmark['blockId']): boolean {
 if (typeof bookmarkOrStopId === 'string') {
  return saveProgress({ bookmark: { stopId: bookmarkOrStopId, blockId: blockId || 'intro' } });
 }
 return saveProgress({ bookmark: bookmarkOrStopId });
}
export function markStopVisited(stopId: string): boolean {
 const p = getProgress();
 if (!STOP_IDS.includes(stopId) || p.visitedStops.includes(stopId)) return false;
 return saveProgress({ visitedStops: [...p.visitedStops, stopId] });
}
export function markEvidenceInspected(id:string):{added:boolean;saved:boolean} {
 const p=getProgress();if(!EVIDENCE_IDS.includes(id)||p.inspectedEvidence.includes(id))return {added:false,saved:!unavailable.has(PROGRESS_KEY)};
 return {added:true,saved:saveProgress({inspectedEvidence:[...p.inspectedEvidence,id]})};
}
export function clearProgress():boolean {progressMemory=defaultProgress();const saved=write(PROGRESS_KEY,progressMemory);window.dispatchEvent(new Event('stp:progress'));return saved;}
export function bookmarkURL(bookmark:Bookmark|null):string {if(!bookmark)return '/map/';return `${STOP_IDS.includes(bookmark.stopId)?'/stops/':'/'}${bookmark.stopId}/#${bookmark.blockId}`;}
export function announce(message:string){const el=document.getElementById('live-announcer');if(el)el.textContent=message;}
