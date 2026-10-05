// Optional owner-run cold-entry laboratory check. Requires a running local preview.
import fs from 'node:fs';
import {chromium} from '@playwright/test';
const base=process.env.STP_PREVIEW_URL||'http://127.0.0.1:4321';
const paths=process.argv.slice(2);if(!paths.length)paths.push('/','/stops/the-arrangement/','/map/','/sources/');
const browser=await chromium.launch({headless:true});const result=[];
try{for(const route of paths){const runs=[];for(let i=0;i<3;i++){
 const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});const page=await context.newPage();const cdp=await context.newCDPSession(page);
 await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:93750});await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 let bytes=0;cdp.on('Network.dataReceived',e=>{bytes+=e.dataLength;});
 await page.addInitScript(()=>{window.__stpMetrics={lcp:0,cls:0};let session=0,first=0,last=0;new PerformanceObserver(list=>{for(const e of list.getEntries())window.__stpMetrics.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput){if(e.startTime-last>1000||e.startTime-first>5000){session=0;first=e.startTime;}session+=e.value;last=e.startTime;window.__stpMetrics.cls=Math.max(window.__stpMetrics.cls,session);}}).observe({type:'layout-shift',buffered:true});});
 await page.goto(new URL(route,base).href,{waitUntil:'commit'});await page.waitForTimeout(Math.max(0,5000-await page.evaluate(()=>performance.now())));
 const metrics=await page.evaluate(()=>window.__stpMetrics);runs.push({...metrics,bodyBytesAt5s:bytes});await context.close();
 }
 const median=k=>runs.map(r=>r[k]).sort((a,b)=>a-b)[1];const summary={route,runs,median:{lcpMs:median('lcp'),cls:median('cls'),bodyBytesAt5s:median('bodyBytesAt5s')}};result.push(summary);console.log(JSON.stringify(summary));
}}finally{await browser.close();}
fs.mkdirSync('test-results',{recursive:true});fs.writeFileSync('test-results/performance.json',JSON.stringify({date:new Date().toISOString(),base,conditions:'390x844; 1.6Mbps; 150ms RTT; 4x CPU; 3 cold runs; decoded response-body bytes through 5s',result},null,2)+'\n');
if(result.some(r=>r.median.lcpMs===0||r.median.lcpMs>2500||r.median.cls>.1||r.median.bodyBytesAt5s>1500000))process.exitCode=1;
