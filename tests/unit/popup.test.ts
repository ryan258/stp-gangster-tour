import {describe,it,expect} from 'vitest';
import {popUpLayers} from '../../src/lib/popup';
describe('Pop-up scene layers',()=>{
 it('cuts the Arrangement scene into depth layers and keeps the reconstruction badge flat',()=>{
  const pop=popUpLayers({id:'scene-arrangement',file:'/media/scenes/scene-arrangement.svg'})!;
  expect(pop.layers).toHaveLength(4);
  expect(pop.layers[1].body).toContain('GREEN LANTERN');
  expect(pop.flat).toContain('ILLUSTRATED RECONSTRUCTION');
  expect(pop.layers.some(l=>l.body.includes('ILLUSTRATED RECONSTRUCTION'))).toBe(false);
 });
 it('ignores scenes without a depth stack',()=>{expect(popUpLayers({id:'scene-skyline',file:'/media/scenes/scene-skyline.svg'})).toBeNull();});
});
