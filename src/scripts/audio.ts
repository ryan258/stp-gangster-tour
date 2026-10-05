import {getPreferences,savePreferences,type Preferences} from './storage';
type Phase='idle'|'loading'|'playing'|'paused'|'ended'|'error';
export class TourAudioController {
 private narration:HTMLAudioElement|null=null;
 private ambience:HTMLAudioElement|null=null;
 private phase:Phase='idle';
 private narrationRequest=0;
 private ambienceRequest=0;
 private ambienceOn=false;
 private mixerSupported=true;
 private prefs:Preferences=getPreferences();
 constructor(private root:HTMLElement){}
 private button(id:string){return this.root.querySelector<HTMLButtonElement>(`#${id}`);}
 private status(message:string){const el=this.root.querySelector('[data-audio-status]');if(el)el.textContent=message;}
 private render(){
  const play=this.button('btn-audio-play'),pause=this.button('btn-audio-pause');
  if(play){play.hidden=this.phase==='playing'||this.phase==='loading';play.textContent=this.phase==='ended'?'Replay narration':this.phase==='error'?'Retry narration':this.phase==='paused'?'Resume narration':'Play narration';}
  if(pause){pause.hidden=!['playing','loading'].includes(this.phase);pause.textContent=this.phase==='loading'?'Cancel loading':'Pause narration';}
  this.button('btn-toggle-ambience')?.setAttribute('aria-pressed',String(this.ambienceOn));
  this.root.querySelectorAll<HTMLElement>('[data-mixer-control]').forEach(el=>el.hidden=!this.mixerSupported);
  const notice=this.root.querySelector<HTMLElement>('[data-mixer-notice]');if(notice)notice.hidden=this.mixerSupported;
  const volume=this.root.querySelector('[data-volume-status]');if(volume)volume.textContent=`Narration ${Math.round(this.prefs.narrationVolume*100)}%; ambience ${Math.round(this.prefs.ambienceVolume*100)}%.`;
 }
 private applyVolumes(){
  if(this.narration&&this.mixerSupported){try{this.narration.volume=this.prefs.narrationVolume;if(Math.abs(this.narration.volume-this.prefs.narrationVolume)>.01)this.mixerSupported=false;}catch{this.mixerSupported=false;}}
  if(!this.mixerSupported){this.stopAmbience();return;}
  if(this.ambience)this.ambience.volume=this.prefs.ambienceVolume*(this.phase==='playing'?.25:1);
 }
 private getNarration(){
  if(this.narration)return this.narration;
  const audio=new Audio();audio.preload='none';audio.src=this.root.dataset.narrationSrc!;audio.playbackRate=this.prefs.playbackSpeed;
  audio.addEventListener('ended',()=>{this.phase='ended';this.applyVolumes();this.status('Narration ended. Replay is available.');this.render();});
  audio.addEventListener('error',()=>{this.narrationRequest++;this.phase='error';this.applyVolumes();this.status('Narration could not load. Retry or read the introduction below.');this.render();});
  this.narration=audio;this.applyVolumes();return audio;
 }
 async play(restart=false){
  if(this.phase==='loading'||this.phase==='playing')return;
  this.prefs=getPreferences();if(this.prefs.narrationVolume===0){this.prefs.narrationVolume=.7;savePreferences({narrationVolume:.7});}
  const audio=this.getNarration();audio.muted=false;this.button('btn-mute-all')?.setAttribute('aria-pressed','false');
  if(restart||this.phase==='ended')audio.currentTime=0;
  if(this.phase==='error')audio.load();
  const request=++this.narrationRequest;this.phase='loading';this.status('Loading narration…');this.render();this.applyVolumes();
  try{await audio.play();if(request!==this.narrationRequest)return;this.phase='playing';this.applyVolumes();this.status('Narration playing.');}
  catch{if(request!==this.narrationRequest)return;this.phase='error';this.status('Playback did not start. Retry narration or read the text below.');}
  this.render();
 }
 pause(){this.narrationRequest++;this.narration?.pause();if(['loading','playing'].includes(this.phase))this.phase='paused';this.applyVolumes();this.render();}
 private stopAmbience(){this.ambienceRequest++;this.ambience?.pause();this.ambienceOn=false;}
 private stopAll(){this.pause();this.stopAmbience();this.render();}
 async toggleAmbience(){
  if(this.ambienceOn){this.stopAmbience();this.status('Ambience paused.');this.render();return;}
  if(getPreferences().calmView){this.status('Calm view keeps ambience off. Turn Calm view off before enabling ambience.');return;}
  if(!this.mixerSupported){this.status('Use device volume for narration. Ambience is unavailable on this browser.');return;}
  if(!this.ambience){this.ambience=new Audio();this.ambience.preload='none';this.ambience.src=this.root.dataset.ambienceSrc!;this.ambience.loop=true;this.ambience.addEventListener('error',()=>{this.stopAmbience();this.status('Ambience could not load. Toggle ambience to retry.');this.render();});}
  this.ambience.muted=false;this.button('btn-mute-all')?.setAttribute('aria-pressed','false');this.ambienceOn=true;const request=++this.ambienceRequest;this.applyVolumes();this.render();
  try{await this.ambience.play();if(request!==this.ambienceRequest)return;this.status('Ambience playing.');}catch{if(request!==this.ambienceRequest)return;this.stopAmbience();this.status('Ambience did not start. Toggle ambience to retry.');}this.render();
 }
 initUI(){
  this.button('btn-audio-play')?.addEventListener('click',()=>void this.play());
  this.button('btn-audio-pause')?.addEventListener('click',()=>{this.pause();this.status('Narration paused. Resume is available.');});
  this.button('btn-audio-restart')?.addEventListener('click',()=>{this.pause();void this.play(true);});
  this.button('btn-toggle-ambience')?.addEventListener('click',()=>void this.toggleAmbience());
  this.button('btn-mute-all')?.addEventListener('click',()=>{this.stopAll();if(this.narration)this.narration.muted=true;if(this.ambience)this.ambience.muted=true;this.button('btn-mute-all')?.setAttribute('aria-pressed','true');this.status('All sound stopped. Play narration or toggle ambience to start again.');});
  this.root.querySelectorAll<HTMLButtonElement>('[data-volume-channel]').forEach(btn=>btn.addEventListener('click',()=>{const key=btn.dataset.volumeChannel as 'narrationVolume'|'ambienceVolume';const delta=Number(btn.dataset.volumeDelta);this.prefs[key]=Math.min(1,Math.max(0,Math.round((this.prefs[key]+delta)*10)/10));savePreferences({[key]:this.prefs[key]});this.applyVolumes();this.render();}));
  const speed=this.root.querySelector<HTMLSelectElement>('#audio-speed-select');if(speed){speed.value=String(this.prefs.playbackSpeed);speed.addEventListener('change',()=>{const value=Number(speed.value);if(![.75,1,1.25,1.5].includes(value))return;this.prefs.playbackSpeed=value;savePreferences({playbackSpeed:value});if(this.narration)this.narration.playbackRate=value;});}
  const preferences=()=>{this.prefs=getPreferences();if(this.prefs.calmView)this.stopAmbience();if(this.narration)this.narration.playbackRate=this.prefs.playbackSpeed;if(speed)speed.value=String(this.prefs.playbackSpeed);this.applyVolumes();this.render();};
  window.addEventListener('stp:preferences',preferences);window.addEventListener('storage',preferences);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){this.stopAll();this.status('Sound paused while the page is hidden. Start playback when ready.');}});
  window.addEventListener('pagehide',()=>this.stopAll());window.addEventListener('pageshow',event=>{if(event.persisted){this.stopAll();preferences();this.status('Sound is paused after returning to this page.');}});
  const controls=this.root.querySelector<HTMLElement>('[data-audio-controls]');if(controls)controls.hidden=false;this.render();
 }
}
