import {clearSpriteInterpolation, renderSpriteInterpolation} from './sprite-interpolation';

/** Drive the authored pose pair and its in-between position from the same scroll value. */
export function setLayeredSceneProgress(canvas: HTMLElement, progress: number) {
  const travel = Math.max(0, Math.min(1, progress));
  const frameCount = Number(canvas.dataset.visualFrameCount);
  const pose = travel * (frameCount - 1);
  const frame = Math.floor(pose);

  if (canvas.dataset.visualFrame !== String(frame)) {
    const columns = Number(canvas.dataset.visualColumns);
    const next = Math.min(frame + 1, frameCount - 1);
    canvas.dataset.visualFrame = String(frame);
    canvas.style.setProperty('--visual-pose-column', String(frame % columns));
    canvas.style.setProperty('--visual-pose-row', String(Math.floor(frame / columns)));
    canvas.style.setProperty('--visual-next-column', String(next % columns));
    canvas.style.setProperty('--visual-next-row', String(Math.floor(next / columns)));
  }

  const position = String(travel);
  if (canvas.style.getPropertyValue('--visual-sprite-progress') !== position) {
    canvas.style.setProperty('--visual-sprite-progress', position);
    canvas.style.setProperty('--visual-pose-fraction', String(pose - frame));
  }

  if (frameCount > 1 && travel < 1 && canvas.dataset.visualFlow) renderSpriteInterpolation(canvas, travel);
  else clearSpriteInterpolation(canvas);
}
