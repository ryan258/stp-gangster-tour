import {base} from '../lib/base';
import {decodeStudySelection, decodeStudyMessage, validStudyRoom} from '../lib/study-state';

const selectionKey = (revision: string, id: string) => `stp-after-dark:study:v1:${base}:${revision}:${id}`;

export function initStudyIndex() {
  const root = document.querySelector<HTMLElement>('[data-study-index]');
  if (!root) return;
  const render = () => {
    for (const card of root.querySelectorAll<HTMLElement>('[data-study-card]')) {
      const label = card.querySelector<HTMLElement>('[data-study-resume]')!;
      try {
        const frames = JSON.parse(card.querySelector('[data-study-frames]')!.textContent!) as {id: string; label: string}[];
        const selected = decodeStudySelection(localStorage.getItem(selectionKey(root.dataset.revision!, card.dataset.studyCard!)), frames.map(f => f.id));
        label.textContent = selected ? `Continue: ${frames.find(f => f.id === selected)!.label}` : '';
        label.hidden = !selected;
      } catch { label.hidden = true; }
    }
  };
  render();
  window.addEventListener('pageshow', render);
  window.addEventListener('storage', render);
}

type Transition = {skipTransition(): void; updateCallbackDone: Promise<void>; finished: Promise<void>};
type TransitionDocument = {startViewTransition?: (update: () => void) => Transition};
type Highlights = {Highlight?: new (...ranges: Range[]) => unknown; CSS?: {highlights?: {set(key: string, value: unknown): void; delete(key: string): void}}};

export function initStudy() {
  const root = document.querySelector<HTMLElement>('[data-study]');
  if (!root || root.dataset.enhanced) return;
  const frames = Array.from(root.querySelectorAll<HTMLElement>('[data-study-frame]'));
  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-study-select]'));
  if (!frames.length || frames.length !== buttons.length) return;
  const ids = frames.map(f => f.dataset.studyFrame!);
  const key = selectionKey(root.dataset.revision!, root.dataset.study!);
  const status = root.querySelector<HTMLElement>('[data-study-status]')!;
  const saving = root.querySelector<HTMLElement>('[data-study-saving]')!;
  const allButton = root.querySelector<HTMLButtonElement>('[data-study-all]')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const forced = matchMedia('(forced-colors: active)');
  const printing = matchMedia('print');
  const highlightAPI = globalThis as unknown as Highlights;
  const transitionDocument = document as unknown as TransitionDocument;
  let selected = ids[0];
  let showAll = false;
  let saved = false;
  let active = true;
  let requestNumber = 0;
  let transition: Transition | undefined;
  let animations: Animation[] = [];
  let channel: BroadcastChannel | null = null;
  let audio: {stop(message?: string): void; destroy(): void} | undefined;
  const still = () => reduced.matches || forced.matches || printing.matches || document.hidden || document.documentElement.classList.contains('calm-mode');
  const clearMotion = () => { transition?.skipTransition(); animations.forEach(a => a.cancel()); animations = []; };
  const temporary = () => { saving.hidden = false; saving.textContent = 'Saving is unavailable. Your selected view is temporary on this page.'; };
  const persist = () => {
    try { localStorage.setItem(key, JSON.stringify({version: 1, frame: selected})); saved = true; }
    catch { saved = false; temporary(); }
  };

  const highlight = () => {
    highlightAPI.CSS?.highlights?.delete('stp-study-passage');
    if (root.dataset.kind !== 'palimpsest' || showAll) return;
    const passage = root.querySelector<HTMLElement>('[data-study-passage]')!;
    const phrase = frames.find(f => f.dataset.studyFrame === selected)!.dataset.highlight!;
    const notice = root.querySelector<HTMLElement>('[data-highlight-notice]')!;
    if (!highlightAPI.Highlight || !highlightAPI.CSS?.highlights) {
      notice.hidden = false;
      notice.textContent = 'Text highlighting is unavailable here. The passage under examination is repeated with its note below.';
      return;
    }
    const start = passage.textContent!.indexOf(phrase);
    if (start < 0) return; // A stale page must stay readable if its text no longer matches.
    const range = document.createRange();
    const walker = document.createTreeWalker(passage, NodeFilter.SHOW_TEXT);
    let offset = 0;
    let node: Node | null;
    let began = false;
    while ((node = walker.nextNode())) {
      const end = offset + (node.textContent?.length ?? 0);
      if (!began && start < end) { range.setStart(node, start - offset); began = true; }
      if (began && start + phrase.length <= end) { range.setEnd(node, start + phrase.length - offset); break; }
      offset = end;
    }
    highlightAPI.CSS.highlights.set('stp-study-passage', new highlightAPI.Highlight(range));
  };

  const render = (announce = true) => {
    const current = frames.find(f => f.dataset.studyFrame === selected)!;
    for (const frame of frames) frame.hidden = !showAll && frame !== current;
    for (const button of buttons) button.setAttribute('aria-pressed', String(!showAll && button.dataset.studySelect === selected));
    allButton.setAttribute('aria-pressed', String(showAll));
    const focuses = (current.dataset.focusIds ?? '').split(' ');
    for (const actor of root.querySelectorAll<HTMLElement>('[data-study-actor]')) {
      const emphasized = !showAll && focuses.includes(actor.dataset.studyActor!);
      actor.dataset.active = String(emphasized);
      actor.querySelector('[data-actor-state]')!.textContent = emphasized ? 'In focus' : '';
    }
    highlight();
    if (announce) status.textContent = showAll ? 'All views are visible below.' : `${current.dataset.label}.${saved ? ' Selected view saved on this device.' : ''}`;
  };

  const choose = (id: string, remote = false, animate = true) => {
    if (!ids.includes(id) || !active) return;
    selected = id;
    showAll = false;
    const sequence = ++requestNumber;
    audio?.stop('Perspective selected. Start sound continues the introduction in this perspective.');
    persist();
    // Replace, rather than push, so a sequence of study choices does not trap Back.
    try { const url = new URL(location.href); url.hash = `frame-${selected}`; history.replaceState(null, '', url); } catch { /* Storage/URL restrictions do not block reading. */ }
    clearMotion();
    const update = () => { if (active && sequence === requestNumber) render(); };
    if (root.dataset.kind === 'return' && !still() && animate && transitionDocument.startViewTransition) {
      try {
        transition = transitionDocument.startViewTransition(update);
        void transition.updateCallbackDone.catch(update);
        void transition.finished.catch(() => {});
      } catch { update(); }
    } else {
      update();
      if (!still() && animate && ['question', 'time'].includes(root.dataset.kind!)) {
        const target = root.dataset.kind === 'question' ? root.querySelector<HTMLElement>('[data-study-actor][data-active="true"]') : frames.find(f => f.dataset.studyFrame === selected)?.querySelector<HTMLElement>('.study-timeline');
        if (target?.animate) {
          try { animations.push(target.animate([{transform: 'translateY(8px)'}, {transform: 'translateY(0)'}], {duration: 220, easing: 'ease-out'})); } catch { /* Static emphasis is complete. */ }
        }
      }
    }
    if (!remote) { try { channel?.postMessage({type: 'select', frame: selected}); } catch { /* Both views remain on this page. */ } }
    else status.textContent = `Other window selected ${frames.find(f => f.dataset.studyFrame === selected)!.dataset.label}.`;
  };

  try {
    const stored = decodeStudySelection(localStorage.getItem(key), ids);
    if (stored) { selected = stored; saved = true; }
  } catch { temporary(); }
  const fragment = location.hash.slice(1);
  if (fragment.startsWith('frame-') && ids.includes(fragment.slice(6))) {
    if (selected !== fragment.slice(6)) saved = false;
    selected = fragment.slice(6);
  }

  const connectWindows = () => {
    if (root.dataset.kind !== 'windows') return;
    const windowStatus = root.querySelector<HTMLElement>('[data-window-status]')!;
    const tools = root.querySelector<HTMLElement>('[data-window-tools]')!;
    const link = root.querySelector<HTMLAnchorElement>('[data-study-companion]')!;
    const picker = root.querySelector<HTMLSelectElement>('[data-window-view]')!;
    const url = new URL(location.href);
    const requestedView = url.searchParams.get('view');
    if (requestedView === 'place' || requestedView === 'record') picker.value = requestedView;
    const setView = () => {
      root.dataset.windowView = showAll ? 'both' : picker.value;
      const next = new URL(location.href);
      next.searchParams.set('view', picker.value);
      try { history.replaceState(null, '', next); } catch { /* Keep the in-page view. */ }
    };
    picker.addEventListener('change', setView);
    tools.hidden = false;
    setView();
    if (typeof BroadcastChannel === 'undefined' || !globalThis.crypto?.getRandomValues) {
      link.hidden = true;
      windowStatus.textContent = 'Window linking is unavailable. Read both viewpoints together here.';
      picker.value = 'both'; setView(); return;
    }
    let room = url.searchParams.get('room');
    if (!validStudyRoom(room)) {
      room = Array.from(crypto.getRandomValues(new Uint8Array(16)), n => n.toString(16).padStart(2, '0')).join('');
      url.searchParams.set('room', room);
      try { history.replaceState(null, '', url); } catch { /* The companion link still shares the room. */ }
    }
    const updateCompanion = () => {
      const companion = new URL(url);
      companion.searchParams.set('view', picker.value === 'record' ? 'place' : 'record');
      companion.hash = `frame-${selected}`;
      link.href = companion.href;
      link.textContent = picker.value === 'record' ? 'Open the place in another tab ↗' : 'Open the record in another tab ↗';
    };
    updateCompanion();
    picker.addEventListener('change', updateCompanion);
    link.addEventListener('click', updateCompanion);
    const reconnect = () => {
      if (channel) return;
      try {
        channel = new BroadcastChannel(`stp-study:${base}:${root.dataset.revision}:${room}`);
        channel.onmessage = event => {
          const message = decodeStudyMessage(event.data, ids);
          if (!message) return;
          if (message.type === 'request') channel?.postMessage({type: 'state', frame: selected});
          else {
            choose(message.frame, true, false);
            root.dataset.windowView = picker.value;
            windowStatus.textContent = 'Linked locally. Both windows are following the same thread.';
          }
        };
        channel.postMessage({type: 'request'});
        windowStatus.textContent = 'Ready to link. Open the other viewpoint, then choose a thread in either window.';
      } catch {
        channel = null; link.hidden = true; picker.value = 'both'; setView();
        windowStatus.textContent = 'Window linking is unavailable. Both viewpoints remain here.';
      }
    };
    reconnect();
    window.addEventListener('pageshow', event => { if (event.persisted) reconnect(); });
  };

  buttons.forEach(button => button.addEventListener('click', () => {
    if (root.dataset.kind === 'windows') root.dataset.windowView = root.querySelector<HTMLSelectElement>('[data-window-view]')!.value;
    choose(button.dataset.studySelect!);
  }));
  allButton.addEventListener('click', () => {
    requestNumber++; clearMotion(); showAll = !showAll;
    audio?.stop();
    if (root.dataset.kind === 'windows') root.dataset.windowView = showAll ? 'both' : root.querySelector<HTMLSelectElement>('[data-window-view]')!.value;
    render();
  });
  window.addEventListener('hashchange', () => { const id = location.hash.slice(1).replace(/^frame-/, ''); if (ids.includes(id)) choose(id, false, false); });
  const preferenceChange = () => { if (still()) clearMotion(); };
  reduced.addEventListener('change', preferenceChange);
  forced.addEventListener('change', preferenceChange);
  printing.addEventListener('change', preferenceChange);
  document.addEventListener('visibilitychange', preferenceChange);
  const preferenceObserver = new MutationObserver(preferenceChange);
  preferenceObserver.observe(document.documentElement, {attributes: true, attributeFilter: ['class']});
  window.addEventListener('beforeprint', () => { clearMotion(); audio?.stop('Sound paused for printing.'); });
  window.addEventListener('pagehide', () => {
    active = false; requestNumber++; clearMotion(); audio?.stop('Sound paused when you left the page.');
    channel?.close(); channel = null;
    highlightAPI.CSS?.highlights?.delete('stp-study-passage');
  });
  window.addEventListener('pageshow', event => {
    active = true;
    if (event.persisted) render(); // Restore the visible view; sound never resumes automatically.
  });

  render(false);
  status.textContent = `${saved ? 'Returning to' : 'Start with'} ${frames.find(f => f.dataset.studyFrame === selected)!.dataset.label}.`;
  root.dataset.enhanced = 'true';
  root.querySelector<HTMLElement>('[data-study-controls]')!.hidden = false;
  connectWindows();
  if (root.dataset.kind === 'audio') {
    import('./study-audio').then(({initStudyAudio}) => {
      audio = initStudyAudio(root, () => frames.find(f => f.dataset.studyFrame === selected)!);
      if (!active) audio.stop();
    }).catch(() => {
      root.querySelector<HTMLElement>('[data-sound-status]')!.textContent = 'Sound controls could not load. All perspectives and the transcript remain available.';
    });
  }
}
