import {setLayeredSceneProgress} from './layered-scene';
import {clearSpriteInterpolation} from './sprite-interpolation';

/** Swap the plate and its sprite sheet together after both have decoded. */
export function initVisualStory(root: HTMLElement) {
  const stage = root.querySelector<HTMLElement>('[data-visual-stage]');
  const scenes = Array.from(root.querySelectorAll<HTMLElement>('[data-visual-beat]')).flatMap(beat => {
    const caption = beat.querySelector<HTMLElement>('[data-visual-caption]');
    const art = beat.querySelector<HTMLElement>('.visual-beat-art');
    const canvas = art?.querySelector<HTMLElement>('[data-visual-canvas]');
    return caption && art && canvas ? [{beat, caption, art, canvas}] : [];
  });
  if (!stage || !scenes.length) return;

  const motion = matchMedia('screen and (prefers-reduced-motion: no-preference) and (forced-colors: none)');
  const desktop = matchMedia('screen and (min-width: 900px) and (min-height: 620px) and (min-aspect-ratio: 4/3)');
  const canDecode = typeof HTMLImageElement.prototype.decode === 'function';
  const chrome = [
    document.querySelector<HTMLElement>('.site-header'),
    root.closest('[data-story-journey]')?.querySelector<HTMLElement>('.story-rail'),
  ];
  const captionInset = 24;
  const loadedScenes = new Map<number, Promise<HTMLElement | null>>();
  let stickyOffset = 0;
  let frame = 0;
  let requested = -1;
  let requestVersion = 0;
  let showing: {index: number; canvas: HTMLElement} | undefined;
  let failed = false;

  const measure = () => {
    stickyOffset = chrome.reduce((height, element) =>
      height + (element && getComputedStyle(element).position === 'sticky' ? element.offsetHeight : 0), 0);
    root.style.setProperty('--visual-sticky-offset', `${stickyOffset}px`);
  };

  const motionAllowed = () => motion.matches && !document.hidden
    && !document.documentElement.classList.contains('calm-mode');
  const useStage = () => canDecode && desktop.matches && !failed;

  const resetStage = () => {
    if (requested === -1) return;
    requested = -1;
    requestVersion++;
    if (showing) clearSpriteInterpolation(showing.canvas);
    showing = undefined;
    delete root.dataset.visualEnhanced;
    delete root.dataset.visualActive;
    stage.replaceChildren();
  };

  const showStills = () => {
    resetStage();
    for (const {canvas} of scenes) setLayeredSceneProgress(canvas, 1);
  };

  const prepareScene = (index: number) => {
    const cached = loadedScenes.get(index);
    if (cached) return cached;

    const canvas = scenes[index].canvas.cloneNode(true) as HTMLElement;
    // Canvas pixels do not survive a DOM clone from the in-flow mobile scene.
    delete canvas.dataset.visualInterpolated;
    canvas.querySelector('[data-visual-interpolation-surface]')?.remove();
    const images = Array.from(canvas.querySelectorAll('img'));
    for (const image of images) image.loading = 'eager';
    const prepared = Promise.all(images.map(image => image.decode())).then(() => canvas, () => null);
    loadedScenes.set(index, prepared);
    return prepared;
  };

  const stageProgress = (index: number) => {
    const beat = scenes[index].beat.getBoundingClientRect();
    const nextCaption = scenes[index + 1]?.caption.getBoundingClientRect();
    const usualDistance = Math.min(beat.height, innerHeight - stickyOffset) * .65;
    // The next caption can enter early on short screens or with enlarged type.
    const cutDistance = nextCaption ? nextCaption.top - beat.top + stickyOffset - (innerHeight - captionInset) : Infinity;
    const distance = Math.max(1, Math.min(usualDistance, cutDistance * .88));
    return (stickyOffset - beat.top) / distance;
  };

  const paintInlineScenes = () => {
    const height = Math.max(1, innerHeight - stickyOffset);
    for (const {art, canvas} of scenes) {
      const {top, bottom, height: artHeight} = art.getBoundingClientRect();
      if (top >= innerHeight || bottom <= stickyOffset) continue;
      const entry = stickyOffset + height * .78;
      const distance = Math.max(height * .38, Math.min(artHeight, height * .8));
      setLayeredSceneProgress(canvas, (entry - top) / distance);
    }
  };

  const update = () => {
    frame = 0;
    if (!motionAllowed()) {
      showStills();
      return;
    }
    const bounds = root.getBoundingClientRect();
    if (bounds.top > innerHeight + 160 || bounds.bottom < stickyOffset) return;

    if (!useStage()) {
      resetStage();
      paintInlineScenes();
      return;
    }

    if (showing) setLayeredSceneProgress(showing.canvas, stageProgress(showing.index));
    const line = innerHeight - captionInset;
    let active = 0;
    for (let index = 1; index < scenes.length; index++) {
      if (scenes[index].caption.getBoundingClientRect().top > line) break;
      active = index;
    }
    if (active === requested) return;
    requested = active;
    const version = ++requestVersion;

    void prepareScene(active).then(canvas => {
      if (version !== requestVersion || !motionAllowed() || !useStage()) return;
      if (!canvas) {
        failed = true;
        resetStage();
        paintInlineScenes();
        return;
      }
      if (showing) clearSpriteInterpolation(showing.canvas);
      stage.replaceChildren(canvas);
      showing = {index: active, canvas};
      root.dataset.visualActive = scenes[active].beat.dataset.visualBeat ?? '';
      root.dataset.visualEnhanced = '';
      setLayeredSceneProgress(canvas, stageProgress(active));
      if (active + 1 < scenes.length) void prepareScene(active + 1);
    });
  };

  const schedule = () => {
    if (!motionAllowed()) {
      showStills();
      return;
    }
    if (!useStage()) resetStage();
    if (!frame) frame = requestAnimationFrame(update);
  };
  const resize = () => { measure(); schedule(); };
  new MutationObserver(resize).observe(document.documentElement, {attributes: true, attributeFilter: ['class']});
  const chromeSize = new ResizeObserver(resize);
  for (const element of chrome) if (element) chromeSize.observe(element);
  motion.addEventListener('change', resize);
  desktop.addEventListener('change', resize);
  document.addEventListener('visibilitychange', schedule);
  window.addEventListener('scroll', schedule, {passive: true});
  window.addEventListener('resize', resize, {passive: true});
  window.addEventListener('hashchange', schedule);
  window.addEventListener('pageshow', resize);
  root.addEventListener('toggle', schedule, true);
  resize();
}
