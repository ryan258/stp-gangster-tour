import {getProgress,markEvidenceInspected,clearProgress,bookmarkURL,announce,EVIDENCE_IDS,STOP_IDS,STOP_LABELS,BLOCK_LABELS} from './storage';
import {base} from '../lib/base';
export function initEvidenceDisclosures(){
 const inspect=(details:HTMLDetailsElement)=>{const result=markEvidenceInspected(details.dataset.evidenceId||'');if(result.added)announce(result.saved?'Evidence marked inspected.':'Evidence inspected for this page only. Saving is unavailable.');};
 document.querySelectorAll<HTMLDetailsElement>('details[data-evidence-id]').forEach(details=>details.addEventListener('toggle',()=>{if(details.open)inspect(details);}));
 const openFragment=()=>{const match=/^#evidence-(E\d{2})$/.exec(location.hash);if(!match||!EVIDENCE_IDS.includes(match[1]))return;const el=document.getElementById(`evidence-${match[1]}`);if(el instanceof HTMLDetailsElement){el.open=true;inspect(el);}};
 openFragment();window.addEventListener('hashchange',openFragment);
 let filter='all';
 const refresh=()=>{
  const p=getProgress();let shown=0;
  document.querySelectorAll<HTMLElement>('[data-casebook-evidence]').forEach(el=>{const inspected=p.inspectedEvidence.includes(el.dataset.casebookEvidence||'');el.hidden=filter==='inspected'&&!inspected;if(!el.hidden)shown++;const status=el.querySelector('[data-inspected-status]');if(status)status.textContent=inspected?'Inspected':'Not inspected';});
  const empty=document.getElementById('casebook-empty');if(empty)empty.hidden=filter!=='inspected'||shown>0;
  const count=document.getElementById('evidence-count');if(count)count.textContent=`${p.inspectedEvidence.length} of ${EVIDENCE_IDS.length} evidence items inspected. This is a reading marker, not a history score.`;
  document.querySelectorAll<HTMLAnchorElement>('[data-resume]').forEach(a=>{a.href=bookmarkURL(p.bookmark);a.hidden=!p.bookmark;a.textContent=p.bookmark?`Resume reading: ${STOP_LABELS[p.bookmark.stopId]??p.bookmark.stopId} — ${BLOCK_LABELS[p.bookmark.blockId]??p.bookmark.blockId}`:'Resume reading';});
  document.querySelectorAll<HTMLElement>('[data-visited-stop]').forEach(el=>{el.textContent=p.visitedStops.includes(el.dataset.visitedStop||'')?'Visited':'Not yet visited';});
  const ending=document.getElementById('ending-status');if(ending)ending.textContent=p.endingReached?'Epilogue reached.':'Epilogue not yet reached.';
 };
 document.querySelectorAll<HTMLButtonElement>('[data-casebook-filter]').forEach(btn=>btn.addEventListener('click',()=>{filter=btn.dataset.casebookFilter||'all';document.querySelectorAll('[data-casebook-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));refresh();}));
 const trigger=document.getElementById('btn-reset-progress'),confirm=document.getElementById('reset-confirmation');
 trigger?.addEventListener('click',()=>{if(confirm){confirm.hidden=false;document.getElementById('btn-cancel-reset')?.focus();}});
 document.getElementById('btn-cancel-reset')?.addEventListener('click',()=>{if(confirm)confirm.hidden=true;trigger?.focus();});
 document.getElementById('btn-confirm-reset')?.addEventListener('click',()=>{const saved=clearProgress();if(confirm)confirm.hidden=true;trigger?.focus();announce(saved?'Reading progress reset. Preferences kept.':'Progress reset on this page only; saved data could not be changed.');refresh();});
 const from=new URLSearchParams(location.search).get('from');if(from&&STOP_IDS.includes(from)){document.querySelectorAll<HTMLAnchorElement>('[data-context-return]').forEach(a=>{a.href=`${base}stops/${from}/#record`;a.textContent=`Back to ${STOP_LABELS[from]??from}`;a.hidden=false;});}
 document.querySelectorAll<HTMLElement>('[data-js-control]').forEach(el=>el.hidden=false);
 window.addEventListener('stp:progress',refresh);window.addEventListener('storage',refresh);window.addEventListener('pageshow',refresh);refresh();
}
