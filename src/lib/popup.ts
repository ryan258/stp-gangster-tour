import {readFileSync} from 'node:fs';
import {join} from 'node:path';

// Depth stacks are cut from each scene's own comment headers, so the reviewed SVG (and its digest) stays untouched.
// A stack lists [marker, z] from back to front. z: translateZ in px; hinge rises with each layer so the front opens last.
// focus: where the camera dollies to, in % of the scene. glow: [bright centre, soft edge] of the light that floods in at the end.
// ponytail: build throws if a comment is reworded or a cut lands inside a <g>; author <g data-depth> groups in the SVGs if that gets tedious.
type Stack = {layers: [marker: string, z: number][]; flat: string; focus: {x: number; y: number}; glow: [string, string]};
// Everything from the flat marker on stays flat on top: the reconstruction badge and frame must never fold or blur.
const badge = '<!-- Reconstruction Label Badge';
const amber: [string, string] = ['#f0cf8a', '#e2b15855'];
const stacks: Record<string, Stack> = {
 'scene-arrangement': {
  layers: [['<!-- Dark Street Background -->', -240], ['<!-- The Saloon Entrance (Focal Point) -->', -110], ['<!-- Wet Street & Pavement Surface -->', -40], ['<!-- Shadowy Indistinct Figures', 110]],
  flat: badge, focus: {x: 52.5, y: 49}, glow: ['#7fd3a0', '#38a16955']
 },
 'scene-hotel': {
  layers: [['<!-- Dark Atmospheric Night Sky -->', -240], ['<!-- Left: The Great Hotel Facade', -110], ['<!-- Right: Interpretive Interior Suite Vignette', 80]],
  flat: badge, focus: {x: 29.2, y: 39.5}, glow: amber
 },
 'scene-caves': {
  layers: [['<!-- Deep Subterranean Darkness -->', -240], ['<!-- Great Carved Sandstone Arches', -150], ['<!-- The Bandstand / Stage', -40], ['<!-- Dining Tables with Tablecloths', 100]],
  flat: '<!-- Spec Compliance', focus: {x: 50, y: 61.5}, glow: amber
 },
 'scene-hamm': {
  layers: [['<!-- Industrial Twilight Sky -->', -240], ['<!-- Great Industrial Hamm Brewery Complex', -150], ['<!-- Street Level & Cobblestone', -40], ['<!-- 1933 Automobile', 50], ['<!-- Evidence Document Surface', 110]],
  flat: badge, focus: {x: 58, y: 62}, glow: ['#f3d9a0', '#c9a15a55']
 },
 'scene-bremer': {
  layers: [['<!-- Winter Morning Foggy Sky -->', -240], ['<!-- Residential Victorian', -170], ['<!-- Bare Winter Trees', -90], ['<!-- Winter Intersection Ground', -30], ['<!-- Interrupted Routine', 80]],
  flat: badge, focus: {x: 52, y: 66}, glow: ['#cfe6f5', '#7fa9c955']
 },
 'scene-courthouse': {
  layers: [['<!-- Deep Night Sky -->', -240], ['<!-- Left Half: Landmark Center', -100], ['<!-- Right Half: Formal Federal Courtroom', 40]],
  flat: badge, focus: {x: 75, y: 29}, glow: ['#f3efe6', '#b8c4d655']
 },
 // The three panels stay in their own columns and all stay visible; only their depth is staggered.
 'scene-lincoln': {
  layers: [['<!-- Background -->', -240], ['<!-- PANEL 1', -90], ['<!-- PANEL 2', -20], ['<!-- PANEL 3', 50]],
  flat: badge, focus: {x: 50, y: 52}, glow: amber
 }
};

export const hasPopUp = (sceneId: string) => sceneId in stacks;

const groups = (svg: string) => [(svg.match(/<g[\s>]/g) ?? []).length, (svg.match(/<\/g>/g) ?? []).length];

export function popUpLayers(scene: {id: string; file: string}) {
 const stack = stacks[scene.id];
 if (!stack) return null;
 const svg = readFileSync(join(process.cwd(), 'public', scene.file), 'utf8');
 const defsEnd = svg.indexOf('</defs>') + '</defs>'.length;
 const body = svg.slice(defsEnd, svg.lastIndexOf('</svg>'));
 const markers = [...stack.layers.map(([marker]) => marker), stack.flat];
 const cuts = markers.map(m => {
  const i = body.indexOf(m);
  if (i < 0) throw new Error(`${scene.id}: pop-up marker not found: ${m}`);
  return i;
 });
 if (cuts.some((c, i) => i && c <= cuts[i - 1])) throw new Error(`${scene.id}: pop-up markers are out of paint order`);
 const slices = cuts.map((c, i) => body.slice(c, cuts[i + 1]));
 slices.forEach((s, i) => {
  const [open, close] = groups(s);
  if (open !== close) throw new Error(`${scene.id}: pop-up cut at "${markers[i]}" splits an SVG group`);
 });
 return {
  defs: svg.slice(svg.indexOf('<defs>') + '<defs>'.length, defsEnd - '</defs>'.length),
  layers: stack.layers.map(([, z], i) => ({z, hinge: +(1 + i / 10).toFixed(1), body: slices[i]})),
  flat: slices[stack.layers.length],
  focus: stack.focus,
  glow: stack.glow
 };
}
