import {describe,it,expect} from 'vitest';
import {popUpLayers,hasPopUp} from '../../src/lib/popup';
import media from '../../src/data/media.json';
import stops from '../../src/data/stops.json';
const scene=(id:string)=>media.scenes.find(s=>s.id===id)!;
describe('Pop-up scene layers',()=>{
 it('cuts the Arrangement scene into depth layers and keeps the reconstruction badge flat',()=>{
  const pop=popUpLayers({id:'scene-arrangement',file:'/media/scenes/scene-arrangement.svg'})!;
  expect(pop.layers).toHaveLength(4);
  expect(pop.layers[1].body).toContain('GREEN LANTERN');
  expect(pop.flat).toContain('ILLUSTRATED RECONSTRUCTION');
  expect(pop.layers.some(l=>l.body.includes('ILLUSTRATED RECONSTRUCTION'))).toBe(false);
 });
 it('gives every stop scene a stack that keeps SVG groups whole and the badge flat',()=>{
  for(const stop of stops){
   const s=scene(stop.sceneId);
   expect(hasPopUp(s.id),s.id).toBe(true);
   const pop=popUpLayers(s)!;
   expect(pop.layers.length,s.id).toBeGreaterThanOrEqual(3);
   expect(new Set(pop.layers.map(l=>l.z)).size,`${s.id} layer depths`).toBe(pop.layers.length);
   expect(pop.flat,s.id).toContain('ILLUSTRATED RECONSTRUCTION');
   expect(pop.layers.some(l=>l.body.includes('ILLUSTRATED RECONSTRUCTION')),s.id).toBe(false);
   expect(pop.focus.x>0&&pop.focus.x<100&&pop.focus.y>0&&pop.focus.y<100,`${s.id} focus`).toBe(true);
  }
 });
 it('staggers Lincoln Court as three separate panel layers',()=>{
  const pop=popUpLayers(scene('scene-lincoln'))!;
  expect(pop.layers.map(l=>['panel-report','panel-surveillance','panel-confrontation'].filter(id=>l.body.includes(`id="${id}"`)))).toEqual([[],['panel-report'],['panel-surveillance'],['panel-confrontation']]);
 });
 it('ignores scenes without a depth stack',()=>{expect(popUpLayers({id:'scene-skyline',file:'/media/scenes/scene-skyline.svg'})).toBeNull();});
});
