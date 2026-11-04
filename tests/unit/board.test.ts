import {describe,it,expect} from 'vitest';
import {boardFor,segments} from '../../src/lib/board';
import stops from '../../src/data/stops.json';
describe('Scrolling board',()=>{
 it('splits text around marked phrases in reading order and rejoins to the original',()=>{
  const text='Alpha beta gamma delta.';
  const parts=segments(text,[{phrase:'gamma',actor:'G'},{phrase:'Alpha',actor:'A'}]);
  expect(parts.map(p=>p.actor)).toEqual(['A',undefined,'G',undefined]);
  expect(parts.map(p=>p.text).join('')).toBe(text);
 });
 it('gives every chapter a board with one beat per block and a phrase link for every actor',()=>{
  for(const stop of stops){
   const board=boardFor(stop.id)!;
   expect(board,stop.id).not.toBeNull();
   expect(board.beats.map(b=>b.block),stop.id).toEqual(['intro','record','metagame']);
   for(const m of board.markers) expect(stop.blocks[m.block].text,stop.id).toContain(m.phrase);
   for(const actor of board.metagame.actors) expect(board.markers.some(m=>m.actor===actor.name),`${stop.id}: ${actor.name}`).toBe(true);
  }
  expect(boardFor('missing')).toBeNull();
 });
 it('lists the actors in the order the reading introduces them',()=>{
  const names=(id:string)=>boardFor(id)!.actors.map(a=>a.name);
  expect(names('the-safe-house-fails')).toEqual(['Building manager','Dillinger and Frechette','Officers']);
  expect(names('a-suite-above-the-street')).toEqual(['Leon Gleckman','Investigators and prosecutors','Bernard Fuchs']);
  expect(names('the-deal-breaks')[0]).toBe('Bremer and Magee');
 });
});
