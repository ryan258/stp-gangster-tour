import {getProgress,saveProgress,saveBookmark,STOP_IDS,type Bookmark} from './storage';
export function initReading(){
 const root=document.querySelector<HTMLElement>('[data-reading-page]');if(!root)return;
 const stopId=root.dataset.readingPage!;if(!STOP_IDS.includes(stopId)&&!['prologue','epilogue'].includes(stopId))return;
 const blocks=Array.from(root.querySelectorAll<HTMLElement>('[data-reading-block]'));
 const p=getProgress();const fragment=location.hash.slice(1),explicit=blocks.find(b=>b.id===fragment);
 let current:Bookmark['blockId']=(explicit?.id||blocks[0]?.id||'intro') as Bookmark['blockId'];
 const evidenceVisit=location.hash.startsWith('#evidence-')&&p.bookmark?.stopId===stopId;
 saveProgress({...(evidenceVisit?{}:{bookmark:{stopId,blockId:current}}),visitedStops:STOP_IDS.includes(stopId)?[...new Set([...p.visitedStops,stopId])]:p.visitedStops,endingReached:p.endingReached||stopId==='epilogue'});
 let touched=false,pending=false,active=true,timer:ReturnType<typeof setTimeout>|undefined;
 const flush=()=>{clearTimeout(timer);if(pending&&active){saveBookmark({stopId,blockId:current});pending=false;}};
 const touch=()=>{touched=true;};for(const ev of ['wheel','pointerdown','keydown','touchstart'])window.addEventListener(ev,touch,{passive:true});
 window.addEventListener('scroll',()=>{if(!touched||!active)return;let visible=blocks[0];for(const b of blocks){if(b.getBoundingClientRect().top<innerHeight*.5)visible=b;}
 if(visible&&visible.id!==current){current=visible.id as Bookmark['blockId'];pending=true;clearTimeout(timer);timer=setTimeout(flush,200);}},{passive:true});
 window.addEventListener('pagehide',()=>{flush();active=false;});
 window.addEventListener('pageshow',event=>{if(event.persisted){active=true;touched=false;pending=false;}});
 document.addEventListener('click',event=>{if((event.target as Element)?.closest('a[href]'))flush();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)flush();});
}
