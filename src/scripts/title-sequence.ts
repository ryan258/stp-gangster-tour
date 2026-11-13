import {getPreferences, saveBookmark} from './storage';
import type {TitleBlock} from '../lib/title-sequence';

const openingCuts: Record<string, readonly [string, string, string]> = {
  threshold: ['translateX(-32%)', 'translateY(26%)', 'translateX(36%)'],
  ledger: ['translateY(24%)', 'translateX(-26%)', 'translateX(29%)'],
  chair: ['translate(-21%, -19%)', 'translate(10%, 24%)', 'translate(34%, -5%)'],
  letter: ['translateX(-34%)', 'translateY(-23%)', 'translateX(24%)'],
  telephone: ['translateY(-29%)', 'translateX(28%)', 'translateY(24%)'],
  doorway: ['translateX(-32%)', 'translateX(32%)', 'translateY(28%)'],
  docket: ['translateY(27%)', 'translateX(-27%)', 'translateX(31%)'],
};

interface Track {
  audio: HTMLAudioElement;
  button: HTMLButtonElement;
  status: HTMLElement;
  calmNotice: HTMLElement;
  source: string;
}

export function initTitleSequences() {
  const sequences = document.querySelectorAll<HTMLElement>('[data-title-sequence]');
  if (!sequences.length) return;
  const inTour = !!document.querySelector('[data-story-root]');
  const chapterAudio = document.querySelector('[data-audio-player]');
  const motion = matchMedia('screen and (prefers-reduced-motion: no-preference) and (forced-colors: none)');
  const tracks = new Map<Element, Track>();
  const animations = new Set<Animation>();
  let calm = false;
  let active: Track | undefined;
  let request = 0;

  function stopSound(message = 'Scene sound is off.') {
    if (!active) return;
    const track = active;
    active = undefined;
    request++;
    track.audio.pause();
    track.button.textContent = 'Play scene sound';
    track.status.textContent = message;
  }

  async function toggleSound(track: Track) {
    if (calm || document.hidden) return;
    const wasActive = active === track;
    stopSound();
    if (wasActive) return;
    chapterAudio?.dispatchEvent(new Event('stp:pause-audio'));
    active = track;
    const ticket = ++request;
    track.button.textContent = 'Stop scene sound';
    track.status.textContent = 'Starting scene sound…';
    try {
      if (!track.audio.hasAttribute('src')) track.audio.src = track.source;
      else if (track.audio.error) track.audio.load();
      await track.audio.play();
      if (ticket === request) track.status.textContent = 'Synthesized atmosphere is playing.';
      else if (active !== track) track.audio.pause();
    } catch {
      if (ticket === request) stopSound('Scene sound could not start. Try Play scene sound again.');
    }
  }

  function cancelMotion() {
    for (const animation of animations) animation.cancel();
    animations.clear();
  }

  function animateCut(piece: HTMLElement, from: string, delay = 0) {
    const animation = piece.animate?.([{transform: from}, {transform: 'none'}], {
      duration: 225,
      delay,
      fill: 'backwards',
      easing: 'cubic-bezier(.21, .84, .28, 1)',
    });
    if (!animation) return;
    animations.add(animation);
    animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
  }

  const entranceThreshold = .25;
  const observer = typeof IntersectionObserver === 'undefined' ? undefined : new IntersectionObserver(entries => {
    for (const {target, isIntersecting, intersectionRatio} of entries) {
      if (!isIntersecting) {
        if (active && tracks.get(target) === active) stopSound();
        continue;
      }
      if (intersectionRatio < entranceThreshold || target.hasAttribute('data-title-entered')) continue;
      target.setAttribute('data-title-entered', '');
      if (calm || !motion.matches || document.hidden) continue;

      const symbol = target.querySelector<HTMLElement>('[data-title-symbol]');
      const cuts = symbol && openingCuts[symbol.dataset.titleSymbol!];
      if (symbol && cuts) {
        symbol.querySelectorAll<HTMLElement>('[data-title-piece]').forEach((piece, index) => {
          animateCut(piece, cuts[index], index * 35);
        });
      }
      const rule = target.querySelector<HTMLElement>('[data-title-cut]');
      if (rule) animateCut(rule, 'translateX(-55%)');
    }
  }, {threshold: [0, entranceThreshold]});

  function syncPreferences() {
    const prefs = getPreferences();
    calm = prefs.calmView;
    if (calm) {
      stopSound('');
      cancelMotion();
    }
    for (const track of tracks.values()) {
      track.audio.volume = prefs.ambienceVolume;
      track.button.setAttribute('aria-disabled', String(calm));
      track.button.setAttribute('aria-describedby', calm ? track.calmNotice.id : track.status.id);
      track.calmNotice.hidden = !calm;
      if (calm) track.status.textContent = '';
    }
  }

  for (const sequence of sequences) {
    const opening = sequence.querySelector<HTMLElement>('[data-title-beat="opening"]')!;
    const record = sequence.querySelector<HTMLElement>('[data-title-beat="record"]')!;
    const track: Track = {
      audio: opening.querySelector('[data-title-audio]')!,
      button: opening.querySelector('[data-title-sound]')!,
      status: opening.querySelector('[data-title-sound-status]')!,
      calmNotice: opening.querySelector('[data-title-calm-notice]')!,
      source: sequence.dataset.titleSoundSrc!,
    };
    tracks.set(opening, track);
    track.button.addEventListener('click', () => void toggleSound(track));
    track.audio.addEventListener('playing', () => { if (active !== track) track.audio.pause(); });
    track.audio.addEventListener('pause', () => { if (active === track && track.audio.paused) stopSound(); });
    track.audio.addEventListener('error', () => {
      if (active === track) stopSound('Scene sound could not load. Try Play scene sound again.');
    });
    observer?.observe(opening);
    observer?.observe(record);
  }

  function rememberTourBeat() {
    if (!inTour) return;
    const fragment = location.hash.slice(1);
    const beat = fragment === 'story-opening'
      ? document.querySelector<HTMLElement>('#story-opening [data-title-beat="opening"]')
      : document.getElementById(fragment);
    const stopId = beat?.closest<HTMLElement>('[data-title-sequence]')?.dataset.titleSequence;
    const blockId = beat?.dataset.titleBookmark as TitleBlock | undefined;
    if (stopId && blockId) saveBookmark({stopId, blockId});
  }

  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    if (event.target.closest('#btn-mute-all')) { stopSound(''); return; }
    if (event.target.closest('[data-title-sequence] a[href], #btn-audio-play, #btn-audio-restart, #btn-toggle-ambience')) stopSound();
  }, true);
  window.addEventListener('hashchange', () => { stopSound(); rememberTourBeat(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { stopSound(); cancelMotion(); }
  });
  const exit = () => { stopSound(); cancelMotion(); };
  window.addEventListener('pagehide', exit);
  window.addEventListener('beforeprint', exit);
  window.addEventListener('pageshow', syncPreferences);
  window.addEventListener('stp:preferences', syncPreferences);
  window.addEventListener('storage', syncPreferences);
  motion.addEventListener('change', () => { if (!motion.matches) cancelMotion(); });
  syncPreferences();
  rememberTourBeat();
  for (const track of tracks.values()) track.button.hidden = false;
}
