import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

/** Optional atmosphere: GSAP + ScrollTrigger. Text and links are always present in the static document. */
export function initStoryMotion(root: HTMLElement) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const forcedColors = matchMedia('(forced-colors: active)');
  const printing = matchMedia('print');
  const compact = matchMedia('(max-width: 900px)');
  const header = document.querySelector<HTMLElement>('.site-header');
  const journey = root.querySelector<HTMLElement>('[data-story-journey]');
  const scenes = Array.from(root.querySelectorAll<HTMLElement>('[data-story-scene]'));
  const links = Array.from(root.querySelectorAll<HTMLAnchorElement>('[data-story-link]'));
  // Chapter pages: the "On this page" tabs mark the section being read. Plain DOM, like the story rail, so it survives Calm view.
  const tabs = Array.from(root.querySelectorAll<HTMLAnchorElement>('.chapter-tabs a[href^="#"]'))
    .map(link => ({link, section: root.querySelector<HTMLElement>(link.getAttribute('href')!)}))
    .filter((tab): tab is {link: HTMLAnchorElement; section: HTMLElement} => !!tab.section);
  let currentTab: HTMLAnchorElement | undefined;
  const revealed = new WeakSet<Element>();
  let context: gsap.Context | undefined;
  let popups: HTMLElement[] = [];
  let running = false;
  let pageActive = true;
  let orientationFrame = 0;
  let currentScene: string | undefined;
  let headerHeight = 0;

  // Measure the real header, including wrapped navigation and enlarged text.
  const measureHeader = () => {
    headerHeight = header && getComputedStyle(header).position === 'sticky' ? header.offsetHeight : 0;
    root.style.setProperty('--story-header-offset', `${headerHeight}px`);
  };
  const updateOrientation = () => {
    orientationFrame = 0;
    const line = Math.max(headerHeight + 90, innerHeight * .4);
    const reading = [...tabs].reverse().find(tab => tab.section.getBoundingClientRect().top <= line)?.link;
    if (reading !== currentTab) {
      currentTab = reading;
      for (const {link} of tabs) {
        if (link === reading) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    }
    if (board) {
      const section = [...beatSections].reverse().find(s => s.getBoundingClientRect().top <= line);
      setBeat(section?.id ?? beatSections[0]?.id ?? 'intro');
    }
    const active = scenes.find(scene => {
      const rect = scene.getBoundingClientRect();
      return rect.top <= line && rect.bottom > line;
    })?.dataset.storyScene;
    if (active === currentScene) return;
    currentScene = active;
    for (const link of links) {
      if (link.dataset.storyLink === active) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    }
  };
  const queueOrientation = () => {
    if (pageActive && !orientationFrame) orientationFrame = requestAnimationFrame(updateOrientation);
  };
  // Actors-and-costs board (chapter pages that have one). Like the rail and tabs this is orientation, not decoration, so it works
  // with motion off; GSAP only adds the short transitions while motion is allowed.
  const board = root.querySelector<HTMLElement>('[data-board]');
  const beatSections = ['intro', 'record', 'metagame'].map(id => root.querySelector<HTMLElement>(`#${id}`)).filter((el): el is HTMLElement => !!el);
  const beatPanels = new Map<string, HTMLElement>();
  const beatActors = new Map<string, Set<string>>();
  const actorCards = new Map<string, HTMLElement>();
  const markerButtons: HTMLElement[] = [];
  const liveQuery = matchMedia('(min-width: 801px) and (min-height: 700px)');
  let liveBoard = false;
  let currentBeat: string | undefined;
  const setBeat = (block: string) => {
    if (!liveBoard || block === currentBeat) return;
    const panel = beatPanels.get(block);
    if (!panel) return;
    const previous = currentBeat;
    currentBeat = block;
    for (const [id, el] of beatPanels) el.toggleAttribute('data-active', id === block);
    const lit = beatActors.get(block) ?? new Set<string>();
    for (const [name, card] of actorCards) {
      card.toggleAttribute('data-emphasis', lit.has(name));
      if (lit.has(name)) card.setAttribute('aria-current', 'true');
      else card.removeAttribute('aria-current');
    }
    if (previous && running) {
      gsap.fromTo(panel, {y: 14, opacity: 0}, {y: 0, opacity: 1, duration: .45, ease: 'power2.out', overwrite: true, clearProps: 'opacity,transform'});
      gsap.fromTo([...actorCards].filter(([name]) => lit.has(name)).map(([, card]) => card), {scale: .98}, {scale: 1, duration: .5, ease: 'back.out(2)', stagger: .08, clearProps: 'transform'});
    }
  };
  // Pin only when the tallest beat fits the screen; measured synchronously, so nothing paints in between.
  const wantLive = () => {
    if (!board || !liveQuery.matches) return false;
    const was = board.hasAttribute('data-live');
    board.setAttribute('data-live', '');
    const fits = board.offsetHeight <= innerHeight - headerHeight - 24;
    if (!was) board.removeAttribute('data-live');
    return fits;
  };
  const syncBoard = () => {
    if (!board) return;
    liveBoard = wantLive();
    board.toggleAttribute('data-live', liveBoard);
    currentBeat = undefined;
    if (!liveBoard) {
      for (const el of beatPanels.values()) el.removeAttribute('data-active');
      for (const card of actorCards.values()) { card.removeAttribute('data-emphasis'); card.removeAttribute('aria-current'); }
    }
    queueOrientation();
  };
  const highlight = (name?: string) => {
    for (const [actor, card] of actorCards) card.toggleAttribute('data-highlight', actor === name);
    for (const button of markerButtons) button.toggleAttribute('data-lit', !!name && button.dataset.markerActor === name);
  };
  const announceActor = (name: string) => {
    const live = document.getElementById('live-announcer');
    if (live) live.textContent = `${name}: ${actorCards.get(name)?.querySelector('.board-role')?.textContent ?? ''}`;
  };
  const initBoard = () => {
    if (!board) return;
    for (const panel of board.querySelectorAll<HTMLElement>('[data-beat]')) {
      beatPanels.set(panel.dataset.beat!, panel);
      beatActors.set(panel.dataset.beat!, new Set<string>(JSON.parse(panel.dataset.actors ?? '[]')));
    }
    for (const card of board.querySelectorAll<HTMLElement>('.board-actor[data-actor]')) actorCards.set(card.dataset.actor!, card);
    // Phrases in the reading become buttons that light up their actor on the board. They stay inline spans with role="button"
    // (not <button> elements) so a long phrase can still wrap across lines like the sentence around it.
    for (const marker of root.querySelectorAll<HTMLElement>('.text-marker[data-marker-actor]')) {
      const name = marker.dataset.markerActor!;
      marker.setAttribute('role', 'button');
      marker.tabIndex = 0;
      markerButtons.push(marker);
      marker.addEventListener('pointerenter', () => highlight(name));
      marker.addEventListener('pointerleave', () => highlight());
      marker.addEventListener('focus', () => { highlight(name); announceActor(name); });
      marker.addEventListener('blur', () => highlight());
      marker.addEventListener('click', () => { highlight(name); announceActor(name); });
      marker.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); marker.click(); } });
    }
    // An actor the prose points at becomes a button that jumps to (and cycles through) those phrases.
    for (const [name, card] of actorCards) {
      const targets = markerButtons.filter(button => button.dataset.markerActor === name);
      const body = card.querySelector<HTMLElement>('.board-actor-body');
      if (!targets.length || !body) continue;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = body.className;
      button.append(...body.childNodes);
      const hint = document.createElement('span');
      hint.className = 'sr-only';
      hint.textContent = `. Find ${name} in the text.`;
      button.append(hint);
      body.replaceWith(button);
      let next = 0;
      button.addEventListener('pointerenter', () => highlight(name));
      button.addEventListener('pointerleave', () => highlight());
      button.addEventListener('click', () => {
        const target = targets[next++ % targets.length];
        const still = reduced.matches || document.documentElement.classList.contains('calm-mode');
        target.scrollIntoView({block: 'center', behavior: still ? 'auto' : 'smooth'});
        target.focus({preventScroll: true});
        if (running) gsap.fromTo(target, {backgroundColor: 'rgba(222,170,118,.5)'}, {backgroundColor: 'rgba(222,170,118,0)', duration: 1.2, ease: 'power2.out', clearProps: 'backgroundColor'});
      });
    }
    liveQuery.addEventListener('change', syncBoard);
    syncBoard();
  };
  const stopEffects = () => {
    running = false;
    root.dataset.storyMotion = 'still';
    // revert() kills every ScrollTrigger and tween made in the context and restores authored inline styles.
    try { context?.revert(); } catch (error) { console.warn('An optional motion cleanup failed.', error); }
    context = undefined;
    for (const popup of popups.splice(0)) popup.removeAttribute('data-scrolly');
  };
  const startEffects = () => {
    running = true;
    root.dataset.storyMotion = 'active';
    try {
      // Pop-ups get their tall pinned track before any trigger measures the page.
      popups = Array.from(root.querySelectorAll<HTMLElement>('.popup'));
      for (const popup of popups) popup.setAttribute('data-scrolly', '');

      context = gsap.context(() => {
        // Nothing starts at opacity: 0, and nothing waits for JS to become readable.
        // Headlines are split into words that rise and fade in with a stagger; they never drop below .4 opacity, and the
        // original markup is restored when the reveal finishes (or when the context reverts).
        const revealWords = (heading: HTMLElement) => {
          revealed.add(heading);
          // aria: 'none' keeps the words as ordinary text nodes; 'auto' would swap in an aria-label that drops the space between block spans.
          const text = SplitText.create(heading, {type: 'words', aria: 'none'});
          gsap.fromTo(text.words, {opacity: .4, yPercent: 35}, {
            opacity: 1, yPercent: 0, duration: .7, ease: 'power3.out', stagger: .07, immediateRender: false,
            onComplete: () => text.revert(),
            scrollTrigger: {trigger: heading, start: 'top 85%', once: true}
          });
        };
        const reveals = root.querySelectorAll<HTMLElement>('[data-story-reveal], .chapter-prose > section > h2, .bookend-prose > section > h2, .experience-hero-copy');
        for (const target of reveals) {
          if (revealed.has(target)) continue;
          if (target.matches('h1, h2')) { revealWords(target); continue; }
          gsap.fromTo(target, {opacity: .7, y: 16}, {
            opacity: 1, y: 0, duration: .65, ease: 'power3.out', immediateRender: false, clearProps: 'opacity,transform',
            onStart: () => revealed.add(target),
            scrollTrigger: {trigger: target, start: 'top 85%', once: true}
          });
        }
        for (const heading of root.querySelectorAll<HTMLElement>('.experience-hero h1, .story-scene-copy h2')) {
          if (!revealed.has(heading)) revealWords(heading);
        }

        // Evidence cards arrive together in a staggered batch.
        const cards = root.querySelectorAll<HTMLElement>('.evidence-card');
        if (cards.length) {
          ScrollTrigger.batch(Array.from(cards), {
            start: 'top bottom', once: true,
            onEnter: batch => gsap.fromTo(batch, {opacity: .5, y: 18}, {opacity: 1, y: 0, duration: .5, ease: 'power2.out', stagger: .1, overwrite: true, clearProps: 'opacity,transform'})
          });
        }

        // The big chapter numeral drifts against the scroll.
        if (!compact.matches) {
          for (const scene of scenes) {
            const numeral = scene.querySelector<HTMLElement>('.story-scene-numeral');
            if (!numeral) continue;
            gsap.fromTo(numeral, {yPercent: 25}, {
              yPercent: -25, ease: 'none',
              scrollTrigger: {trigger: scene, start: 'top bottom', end: 'bottom top', scrub: true}
            });
          }
        }

        // Small screens keep their images still and in normal flow.
        if (!compact.matches) {
          for (const stage of root.querySelectorAll<HTMLElement>('[data-story-parallax], .experience-hero')) {
            const image = stage.querySelector<HTMLElement>('[data-story-image], .experience-backdrop');
            if (!image) continue;
            gsap.fromTo(image, {y: -14, scale: 1.06}, {
              y: 14, scale: 1.015, ease: 'none',
              scrollTrigger: {trigger: stage, start: 'top bottom', end: 'bottom top', scrub: true}
            });
          }
        }

        const progress = root.querySelector<HTMLElement>('[data-story-progress]');
        if (progress && journey) {
          gsap.fromTo(progress, {scaleX: 0}, {
            scaleX: 1, ease: 'none',
            scrollTrigger: {trigger: journey, start: 'top top', end: 'bottom bottom', scrub: true}
          });
        }

        // Pop-up scenes: the figure unfolds from the floor as it enters, then CSS sticky pins it while the camera dollies
        // through the layers into the scene's lit focal point. The scene reads --hinge, --cam, --px, --py and --flood.
        for (const popup of popups) {
          const stage = popup.querySelector<HTMLElement>('.popup-stage');
          if (!stage) continue;
          const style = getComputedStyle(popup);
          const fx = style.getPropertyValue('--fx').trim() || '52.5%';
          const fy = style.getPropertyValue('--fy').trim() || '49%';
          gsap.fromTo(stage, {'--hinge': '72deg'}, {
            '--hinge': '0deg', ease: 'none',
            scrollTrigger: {trigger: popup, start: 'top 90%', end: 'top 15%', scrub: .5}
          });
          gsap.timeline({
            defaults: {ease: 'none', immediateRender: false},
            scrollTrigger: {trigger: popup, start: 'top top', end: 'bottom bottom', scrub: .5}
          })
            .fromTo(stage, {'--cam': 0}, {'--cam': 330, duration: .7}, 0)
            .fromTo(stage, {'--cam': 330}, {'--cam': 520, duration: .3}, .7)
            .fromTo(stage, {'--px': '50%', '--py': '20%'}, {'--px': fx, '--py': fy, duration: 1}, 0)
            .fromTo(stage, {opacity: 1}, {opacity: 0, duration: .3}, .7)
            .fromTo(stage, {'--flood': 0}, {'--flood': .9, duration: .35}, .55);
        }
      }, root);
      void document.fonts?.ready.then(() => { if (running) ScrollTrigger.refresh(); });
    } catch (error) {
      stopEffects();
      console.warn('Story motion stopped; the static story remains available.', error);
    }
  };
  const syncMotion = () => {
    const allowed = pageActive && !reduced.matches && !forcedColors.matches && !printing.matches && !document.documentElement.classList.contains('calm-mode');
    if (allowed && !running) startEffects();
    if (!allowed) stopEffects();
    measureHeader();
    queueOrientation();
  };
  const resize = () => { measureHeader(); if (board && wantLive() !== liveBoard) syncBoard(); queueOrientation(); };
  const onCompactChange = () => { stopEffects(); syncMotion(); };
  const headerObserver = new ResizeObserver(resize);
  const contentObserver = new ResizeObserver(queueOrientation);
  const calmObserver = new MutationObserver(syncMotion);
  const observe = () => {
    if (header) headerObserver.observe(header);
    if (journey) contentObserver.observe(journey);
    calmObserver.observe(document.documentElement, {attributes: true, attributeFilter: ['class']});
  };
  for (const preference of [reduced, forcedColors, printing]) preference.addEventListener('change', syncMotion);
  compact.addEventListener('change', onCompactChange);
  window.addEventListener('scroll', queueOrientation, {passive: true});
  window.addEventListener('resize', resize, {passive: true});
  // beforeprint is also needed where matchMedia('print') changes too late.
  window.addEventListener('beforeprint', stopEffects);
  window.addEventListener('afterprint', syncMotion);
  window.addEventListener('pagehide', () => {
    pageActive = false;
    stopEffects();
    headerObserver.disconnect();
    contentObserver.disconnect();
    calmObserver.disconnect();
    cancelAnimationFrame(orientationFrame);
    orientationFrame = 0;
  });
  window.addEventListener('pageshow', () => { pageActive = true; observe(); syncMotion(); });
  observe();
  initBoard();
  syncMotion();
}
