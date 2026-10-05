import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
const edition=JSON.parse(fs.readFileSync(new URL('../../src/data/edition.json',import.meta.url),'utf8'));
const routes=['/','/prologue/','/map/','/casebook/','/sources/','/method/','/epilogue/',...edition.stops.map((id:string)=>`/stops/${id}/`)];
for(const path of routes){
 test(`axe: no WCAG 2.x A/AA violations on ${path}`,async({page})=>{
  await page.goto(path);
  const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  expect(results.violations.map(v=>`${v.id}: ${v.nodes.slice(0,3).map(n=>n.target.join(' ')).join(' | ')}`)).toEqual([]);
 });
}
// Project spec R3/R7: readable metadata and 44px targets, measured on a phone-width page.
test('type floor (16px) and 44px targets on every route',async({page})=>{
 await page.setViewportSize({width:375,height:812});
 const problems:string[]=[];
 for(const path of routes){
  await page.goto(path);
  problems.push(...await page.evaluate((route)=>{
   const out:string[]=[];
   const visible=(e:Element)=>{const r=e.getBoundingClientRect();const s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&!e.closest('[aria-hidden="true"],.sr-only,[hidden],svg');};
   for(const e of document.querySelectorAll('body *')){
    if(![...e.childNodes].some(n=>n.nodeType===3&&n.textContent!.trim().length>1)||!visible(e))continue;
    const px=parseFloat(getComputedStyle(e).fontSize);if(px<15.99)out.push(`${route} font ${px.toFixed(1)}px: ${e.textContent!.trim().slice(0,30)}`);
   }
   for(const e of document.querySelectorAll('button,select,summary,.site-nav a,.claim-links a,.btn,.stop-nav a')){
    if(!visible(e))continue;const r=e.getBoundingClientRect();if(r.height<43.5||r.width<43.5)out.push(`${route} target ${Math.round(r.width)}x${Math.round(r.height)}: ${(e.textContent||'').trim().slice(0,30)}`);
   }
   return out;
  },path));
 }
 expect(problems).toEqual([]);
});
