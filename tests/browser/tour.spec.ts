import {test,expect} from '@playwright/test';
import fs from 'node:fs';
const edition = JSON.parse(fs.readFileSync(new URL('../../src/data/edition.json', import.meta.url), 'utf8'));
const stop=`/stops/${edition.stops[0]}/`,key='stp-after-dark:progress:v1';
test('every route, local link and fragment resolves; illustrations load',async({page,request})=>{
 const routes=['/','/prologue/','/map/','/casebook/','/sources/','/method/','/epilogue/',...edition.stops.map((id:string)=>`/stops/${id}/`)];
 const documents=new Map<string,string>();for(const path of routes){const res=await request.get(path);expect(res.status(),path).toBe(200);documents.set(path,await res.text());}
 for(const path of routes){await page.goto(path);await expect(page.locator('h1')).toHaveCount(1);
  // Below-the-fold images are lazy-loaded; force them so completeness can be asserted.
  await page.evaluate(()=>Promise.all([...document.images].map(async i=>{i.loading='eager';try{await i.decode();}catch{/* broken images are reported by the completeness assertion below */}})));const links=await page.locator('a[href]').evaluateAll(as=>as.map(a=>(a as HTMLAnchorElement).getAttribute('href')!).filter(h=>h.startsWith('/')||h.startsWith('#')));
  for(const href of links){const target=new URL(href,`http://localhost${path}`);
   if(target.pathname.startsWith('/data/')){expect((await request.get(target.pathname)).status(),`${path} → ${href}`).toBe(200);continue;}
   const html=documents.get(target.pathname);expect(html,`${path} → ${href}`).toBeTruthy();if(target.hash)expect(html,`${path} → ${href}`).toContain(`id="${decodeURIComponent(target.hash.slice(1))}"`);}
  const bad=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>!(i as HTMLImageElement).complete||(i as HTMLImageElement).naturalWidth===0).map(i=>i.getAttribute('src')));expect(bad).toEqual([]);
 }
 await page.goto('/not-a-stop/');await expect(page.getByRole('heading',{name:'This page is not in the casebook'})).toBeVisible();
});
test('320px reflow, skip link, selection focus and silent fresh entry',async({page})=>{
 await page.setViewportSize({width:320,height:844});const audio:string[]=[];page.on('request',r=>{if(/\.(mp3|aiff)/.test(r.url()))audio.push(r.url());});
 for(const path of ['/',stop,'/casebook/','/sources/','/map/']){await page.goto(path);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 await page.goto(stop);await page.keyboard.press('Tab');await expect(page.getByRole('link',{name:'Skip to main content'})).toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('#main-content')).toBeFocused();
 const button=page.getByRole('button',{name:'Pay',exact:true});await button.click();await expect(button).toBeFocused();await expect(button).toHaveAttribute('aria-pressed','true');await expect(page.locator('[data-target-key="pay"]')).toHaveClass(/selected-highlight/);expect(audio).toEqual([]);
});
test('evidence fragments, casebook filters, profiles, resume and reset preserve preferences',async({page})=>{
 await page.goto(stop);await page.getByRole('button',{name:'Calm view',exact:true}).click();await page.goto(`${stop}#evidence-E02`);await expect(page.locator('#evidence-E02')).toHaveAttribute('open','');
 await page.goto('/casebook/');await page.getByRole('button',{name:'Inspected evidence',exact:true}).click();await expect(page.locator('[data-casebook-evidence]:visible')).toHaveCount(1);await expect(page.locator('#person-bernard-fuchs')).toContainText('does not establish a separate conviction');
 await page.getByRole('button',{name:'Start over',exact:true}).click();await page.getByRole('button',{name:'Reset reading progress',exact:true}).click();await expect(page.getByRole('button',{name:'Start over',exact:true})).toBeFocused();await expect(page.locator('#casebook-empty')).toBeVisible();expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('stp-after-dark:preferences:v1')!).calmView)).toBe(true);
});
test('bookmark tracks reading blocks and source visits do not replace it',async({page})=>{
 await page.goto(stop);await page.getByRole('link',{name:'The underlying bargain',exact:true}).click();await expect.poll(async()=>page.evaluate(k=>JSON.parse(localStorage.getItem(k)!).bookmark.blockId,key)).toBe('metagame');
 await page.goto('/sources/?from=the-arrangement#claim-C01');await expect(page.locator('[data-context-return]')).toHaveAttribute('href',`${stop}#record`);expect(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)!).bookmark.blockId,key)).toBe('metagame');await page.goto('/');await expect(page.locator('[data-resume]')).toHaveAttribute('href',`${stop}#metagame`);
});
test('storage failure is visible and never claims persistent inspection or reset',async({page})=>{
 await page.addInitScript(()=>{Storage.prototype.setItem=function(){throw new DOMException('Quota exceeded','QuotaExceededError');};});await page.goto(`${stop}#evidence-E01`);await expect(page.locator('#storage-notice')).toBeVisible();await expect(page.locator('#storage-notice')).toContainText('temporary on this page');await page.goto('/casebook/');await page.getByRole('button',{name:'Start over',exact:true}).click();await page.getByRole('button',{name:'Reset reading progress',exact:true}).click();await expect(page.locator('#live-announcer')).toContainText('saved data could not be changed');
});
test('no-JavaScript reading and evidence work without inert controls',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:844}});const page=await context.newPage();await page.goto(stop);await expect(page.getByRole('heading',{name:'The record',exact:true})).toBeVisible();await expect(page.getByRole('button')).toHaveCount(0);await page.locator('#evidence-E01 summary').click();await expect(page.locator('#evidence-E01 .evidence-content')).toBeVisible();await expect(page.getByRole('link',{name:/Next: A Suite/}).first()).toBeVisible();await context.close();
});
// Controllable media elements verify UI state transitions, not audible quality.
test('audio completion, retry, ducking, Calm view, zero volume and page return',async({page})=>{
 await page.addInitScript(()=>{
  const tracks:HTMLAudioElement[]=[];(window as any).__tracks=tracks;
  class FakeAudio extends EventTarget {src='';preload='';loop=false;muted=false;volume=1;playbackRate=1;currentTime=0;paused=true;fail=false;pending=false;resolve:()=>void=()=>{};constructor(){super();tracks.push(this as any);}play(){if(this.fail)return Promise.reject(new Error('blocked'));if(this.pending)return new Promise<void>(resolve=>{this.resolve=()=>{this.paused=false;resolve();};});this.paused=false;return Promise.resolve();}pause(){this.paused=true;}load(){}}
  (window as any).Audio=FakeAudio;
  localStorage.setItem('stp-after-dark:preferences:v1',JSON.stringify({schemaVersion:1,narrationVolume:0,ambienceVolume:.2,calmView:false,playbackSpeed:1}));
 });
 await page.goto(stop);expect(await page.evaluate(()=>(window as any).__tracks.length)).toBe(0);await page.getByRole('button',{name:'Play narration',exact:true}).click();await expect(page.getByRole('button',{name:'Pause narration',exact:true})).toBeVisible();expect(await page.evaluate(()=>(window as any).__tracks[0].volume)).toBe(.7);
 await page.getByRole('button',{name:'Toggle ambience',exact:true}).click();expect(await page.evaluate(()=>(window as any).__tracks[1].volume)).toBe(.05);
 await page.getByRole('button',{name:'Calm view',exact:true}).click();expect(await page.evaluate(()=>(window as any).__tracks[1].paused)).toBe(true);expect(await page.evaluate(()=>(window as any).__tracks[0].paused)).toBe(false);await expect(page.getByRole('button',{name:'Toggle ambience',exact:true})).toHaveAttribute('aria-pressed','false');
 await page.evaluate(()=>(window as any).__tracks[0].dispatchEvent(new Event('ended')));await expect(page.getByRole('button',{name:'Replay narration',exact:true})).toBeVisible();await page.evaluate(()=>(window as any).__tracks[0].fail=true);await page.getByRole('button',{name:'Replay narration',exact:true}).click();await expect(page.getByRole('button',{name:'Retry narration',exact:true})).toBeVisible();await page.evaluate(()=>(window as any).__tracks[0].fail=false);await page.getByRole('button',{name:'Retry narration',exact:true}).click();await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pagehide')));await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true})));await expect(page.getByRole('button',{name:'Resume narration',exact:true})).toBeVisible();expect(await page.evaluate(()=>(window as any).__tracks[0].paused)).toBe(true);
 await page.evaluate(()=>(window as any).__tracks[0].pending=true);await page.getByRole('button',{name:'Resume narration',exact:true}).click();await page.getByRole('button',{name:'Cancel loading',exact:true}).click();await page.evaluate(()=>(window as any).__tracks[0].resolve());await expect(page.getByRole('button',{name:'Resume narration',exact:true})).toBeVisible();expect(await page.evaluate(()=>(window as any).__tracks[0].paused)).toBe(true);
});

test('unsupported audio mixing falls back to device narration volume',async({page})=>{
 await page.addInitScript(()=>{class FixedVolumeAudio extends EventTarget {src='';preload='';currentTime=0;playbackRate=1;muted=false;get volume(){return 1;}set volume(_v:number){}play(){return Promise.resolve();}pause(){}load(){}}(window as any).Audio=FixedVolumeAudio;});
 await page.goto(stop);await page.getByRole('button',{name:'Play narration',exact:true}).click();await expect(page.locator('[data-mixer-notice]')).toBeVisible();await expect(page.getByRole('button',{name:'Toggle ambience',exact:true})).toBeHidden();await expect(page.getByRole('button',{name:'Pause narration',exact:true})).toBeVisible();
});
