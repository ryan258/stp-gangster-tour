import {readFileSync} from 'node:fs';
import {join} from 'node:path';

// Depth stacks are cut from each scene's own comment headers, so the reviewed SVG (and its digest) stays untouched.
// z: translateZ in px; hinge: how far this layer folds relative to the stage, so the front opens last.
// ponytail: build throws if a comment is reworded; author <g data-depth> groups in the SVGs when more scenes join.
const stacks: Record<string, {marker: string; z: number; hinge: number}[]> = {
 'scene-arrangement': [
  {marker: '<!-- Dark Street Background -->', z: -240, hinge: 1},
  {marker: '<!-- The Saloon Entrance (Focal Point) -->', z: -110, hinge: 1.1},
  {marker: '<!-- Wet Street & Pavement Surface -->', z: -40, hinge: 1.2},
  {marker: '<!-- Shadowy Indistinct Figures', z: 110, hinge: 1.3}
 ]
};
// Everything after this stays flat on top: the reconstruction badge and frame must never fold or blur.
const flatMarker = '<!-- Reconstruction Label Badge';

export const hasPopUp = (sceneId: string) => sceneId in stacks;

export function popUpLayers(scene: {id: string; file: string}) {
 const stack = stacks[scene.id];
 if (!stack) return null;
 const svg = readFileSync(join(process.cwd(), 'public', scene.file), 'utf8');
 const defsEnd = svg.indexOf('</defs>') + '</defs>'.length;
 const body = svg.slice(defsEnd, svg.lastIndexOf('</svg>'));
 const cuts = [...stack.map(l => l.marker), flatMarker].map(m => {
  const i = body.indexOf(m);
  if (i < 0) throw new Error(`${scene.id}: pop-up marker not found: ${m}`);
  return i;
 });
 if (cuts.some((c, i) => i && c <= cuts[i - 1])) throw new Error(`${scene.id}: pop-up markers are out of paint order`);
 return {
  defs: svg.slice(svg.indexOf('<defs>') + '<defs>'.length, defsEnd - '</defs>'.length),
  layers: stack.map((l, i) => ({z: l.z, hinge: l.hinge, body: body.slice(cuts[i], cuts[i + 1])})),
  flat: body.slice(cuts[stack.length])
 };
}
