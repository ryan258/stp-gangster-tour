/** Optional Web Audio study. Source URLs are rendered from the validated media catalog. */
export function initStudyAudio(root: HTMLElement, selectedFrame: () => HTMLElement) {
  const host = root.querySelector<HTMLElement>('[data-study-audio]')!;
  const status = host.querySelector<HTMLElement>('[data-sound-status]')!;
  const play = host.querySelector<HTMLButtonElement>('[data-sound-play]')!;
  const pause = host.querySelector<HTMLButtonElement>('[data-sound-pause]')!;
  let context: AudioContext | null = null;
  let narration: HTMLAudioElement | null = null;
  let ambience: HTMLAudioElement | null = null;
  let voiceGain: GainNode | null = null;
  let bedGain: GainNode | null = null;
  let filter: BiquadFilterNode | null = null;
  let master: GainNode | null = null;
  let volume = .65;
  let generation = 0;
  let playing = false;
  const calm = () => document.documentElement.classList.contains('calm-mode');

  const stop = (message = 'Sound paused. Start sound continues the introduction.') => {
    generation++;
    playing = false;
    narration?.pause();
    ambience?.pause();
    if (context?.state === 'running') void context.suspend().catch(() => {});
    play.disabled = false;
    pause.disabled = true;
    status.textContent = message;
  };

  const initialize = () => {
    if (context) return;
    // Construct elements and assign sources only inside the explicit start action.
    context = new AudioContext();
    narration = new Audio();
    ambience = new Audio();
    narration.preload = ambience.preload = 'none';
    narration.src = host.dataset.narrationSrc!;
    ambience.loop = true;
    voiceGain = context.createGain();
    bedGain = context.createGain();
    filter = context.createBiquadFilter();
    master = context.createGain();
    master.gain.value = volume;
    context.createMediaElementSource(narration).connect(voiceGain).connect(master);
    context.createMediaElementSource(ambience).connect(filter).connect(bedGain).connect(master);
    master.connect(context.destination);
    narration.addEventListener('ended', () => stop('Introduction ended. Start sound replays it.'));
    narration.addEventListener('error', () => stop('Narration could not load. Read the transcript, or start sound to retry.'));
    ambience.addEventListener('error', () => stop('The atmosphere could not load. Choose The account to hear narration alone.'));
  };

  const start = async () => {
    const token = ++generation;
    play.disabled = true;
    pause.disabled = false;
    status.textContent = 'Starting sound…';
    try {
      initialize();
      if (narration!.ended) narration!.currentTime = 0;
      if (narration!.error) narration!.load();
      const frame = selectedFrame();
      const profile = frame.dataset.audioPerspective;
      const withBed = !calm() && profile !== 'account';
      voiceGain!.gain.value = 1;
      bedGain!.gain.value = profile === 'room' ? .12 : .2;
      filter!.type = 'lowpass';
      filter!.frequency.value = profile === 'room' ? 700 : 9000;
      if (withBed) {
        const src = frame.dataset.ambienceSrc!;
        if (ambience!.getAttribute('src') !== src) ambience!.src = src;
        if (ambience!.error) ambience!.load();
      }
      await context!.resume();
      if (token !== generation) return;
      await Promise.all([narration!.play(), ...(withBed ? [ambience!.play()] : [])]);
      if (token !== generation) return;
      playing = true;
      play.disabled = true;
      status.textContent = `${frame.dataset.label}. ${withBed ? 'Narration with designed atmosphere.' : 'Narration only.'} Volume ${Math.round(volume*100)}%.`;
    } catch {
      if (token === generation) stop('Sound could not start. Use Start sound to retry, or read the transcript.');
    }
  };

  const adjust = (delta: number) => {
    volume = Math.max(0, Math.min(1, Math.round((volume + delta)*100)/100));
    if (master) master.gain.value = volume;
    status.textContent = `Volume ${Math.round(volume*100)}%. ${playing ? 'Sound is playing.' : 'Sound is paused.'}`;
  };

  if (typeof AudioContext === 'undefined') {
    status.textContent = 'This browser cannot play the sound study. The complete transcript and all perspectives remain available.';
    return {stop, destroy: () => {}};
  }
  play.addEventListener('click', () => void start());
  pause.addEventListener('click', () => stop());
  host.querySelector('[data-sound-softer]')!.addEventListener('click', () => adjust(-.1));
  host.querySelector('[data-sound-louder]')!.addEventListener('click', () => adjust(.1));
  host.querySelector<HTMLElement>('[data-sound-controls]')!.hidden = false;
  pause.disabled = true;
  const visibility = () => { if (document.hidden) stop('Sound paused when you left the tab. Start sound when ready.'); };
  const preferences = () => {
    // A new preference never silently starts/resumes any sound, including a pending start.
    if (calm()) stop('Calm view is on. Start sound plays narration without ambience.');
  };
  document.addEventListener('visibilitychange', visibility);
  window.addEventListener('stp:preferences', preferences);
  const classObserver = new MutationObserver(preferences);
  classObserver.observe(document.documentElement, {attributes: true, attributeFilter: ['class']});
  return {
    stop,
    destroy() {
      stop('Sound is paused.');
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('stp:preferences', preferences);
      classObserver.disconnect();
      if (context) void context.close().catch(() => {});
    }
  };
}
