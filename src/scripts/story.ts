import {animate} from 'motion/mini';
import {inView, scroll} from 'motion';

/** Optional atmosphere. Text and links are always present in the static document. */
export function initStoryMotion(root: HTMLElement) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const forcedColors = matchMedia('(forced-colors: active)');
  const printing = matchMedia('print');
  const compact = matchMedia('(max-width: 900px)');
  const header = document.querySelector<HTMLElement>('.site-header');
  const journey = root.querySelector<HTMLElement>('[data-story-journey]');
  const scenes = Array.from(root.querySelectorAll<HTMLElement>('[data-story-scene]'));
  const links = Array.from(root.querySelectorAll<HTMLAnchorElement>('[data-story-link]'));
  const revealed = new WeakSet<Element>();
  let effects: (() => void)[] = [];
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
  const stopEffects = () => {
    running = false;
    root.dataset.storyMotion = 'still';
    // Cancel native animations before detaching timelines: detach may commit styles,
    // which throws for artwork/progress that Calm view has just hidden.
    for (const cleanup of effects.splice(0).reverse()) {
      try { cleanup(); } catch (error) { console.warn('An optional motion cleanup failed.', error); }
    }
  };
  const startEffects = () => {
    running = true;
    root.dataset.storyMotion = 'active';
    try {
      const originalStyles = new Map<HTMLElement, string | null>();
      const rememberStyle = (element: HTMLElement) => {
        if (!originalStyles.has(element)) originalStyles.set(element, element.getAttribute('style'));
      };
      const restoreStyle = (element: HTMLElement) => {
        const style = originalStyles.get(element);
        if (style == null) element.removeAttribute('style');
        else element.setAttribute('style', style);
      };
      // Timeline detach can commit its current transform. Restore after every cancellation.
      effects.push(() => { for (const element of originalStyles.keys()) restoreStyle(element); });
      const revealTargets = root.querySelectorAll<HTMLElement>('[data-story-reveal], .chapter-prose > section > h2, .bookend-prose > section > h2, .experience-hero-copy');
      const revealAnimations = new Set<ReturnType<typeof animate>>();
      effects.push(() => { for (const animation of revealAnimations) animation.cancel(); });
      // Nothing starts at opacity: 0, and nothing waits for JS to become readable.
      effects.push(inView(Array.from(revealTargets), element => {
        if (revealed.has(element)) return;
        revealed.add(element);
        const target = element as HTMLElement;
        rememberStyle(target);
        const animation = animate(target, {opacity: [.7, 1], transform: ['translateY(16px)', 'translateY(0px)']}, {duration: .65, ease: [.22, 1, .36, 1]});
        revealAnimations.add(animation);
        // Cancel the finished effect to restore the authored styles, avoiding filled effects.
        animation.finished.then(() => { animation.cancel(); restoreStyle(target); revealAnimations.delete(animation); });
      }, {amount: .15}));

      // Small screens keep their images still and in normal flow.
      if (!compact.matches) {
        const stages = root.querySelectorAll<HTMLElement>('[data-story-parallax], .experience-hero');
        for (const stage of stages) {
          const image = stage.querySelector<HTMLElement>('[data-story-image], .experience-backdrop');
          if (!image) continue;
          rememberStyle(image);
          const animation = animate(image, {transform: ['translateY(-14px) scale(1.06)', 'translateY(14px) scale(1.015)']}, {duration: 1, ease: 'linear', autoplay: false});
          let detach = () => {};
          effects.push(() => { animation.cancel(); detach(); });
          detach = scroll(animation, {target: stage, offset: ['start end', 'end start']});
        }
      }
      const progress = root.querySelector<HTMLElement>('[data-story-progress]');
      if (progress && journey) {
        rememberStyle(progress);
        const animation = animate(progress, {transform: ['scaleX(0)', 'scaleX(1)']}, {duration: 1, ease: 'linear', autoplay: false});
        let detach = () => {};
        effects.push(() => { animation.cancel(); detach(); });
        detach = scroll(animation, {target: journey, offset: ['start start', 'end end']});
      }
    } catch (error) {
      stopEffects();
      console.warn('Story motion stopped; the static story remains available.', error);
    }
  };
  const syncMotion = () => {
    const allowed = pageActive && !document.hidden && !reduced.matches && !forcedColors.matches && !printing.matches && !document.documentElement.classList.contains('calm-mode');
    if (allowed && !running) startEffects();
    if (!allowed) stopEffects();
    measureHeader();
    queueOrientation();
  };
  const resize = () => { measureHeader(); queueOrientation(); };
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
  document.addEventListener('visibilitychange', syncMotion);
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
  syncMotion();
}
