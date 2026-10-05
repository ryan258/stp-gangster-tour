import {getPreferences,savePreferences,announce} from './storage';
export function initCalmView(){
 const button=document.getElementById('btn-toggle-calm');
 const render=()=>{const calm=getPreferences().calmView;document.documentElement.classList.toggle('calm-mode',calm);button?.setAttribute('aria-pressed',String(calm));};
 button?.addEventListener('click',()=>{const calmView=!getPreferences().calmView;const saved=savePreferences({calmView});render();announce(`Calm view ${calmView?'on. Ambience paused.':'off.'}${saved?'':' Preference is temporary on this page.'}`);});
 window.addEventListener('storage',render);window.addEventListener('pageshow',render);render();
}
