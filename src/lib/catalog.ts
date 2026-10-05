import edition from '../data/edition.json';
import stopData from '../data/stops.json';
import evidence from '../data/evidence.json';
import claims from '../data/claims.json';
import sources from '../data/sources.json';
import people from '../data/people.json';
import relationships from '../data/relationships.json';
import locations from '../data/locations.json';
import metagames from '../data/metagames.json';
import media from '../data/media.json';
import presenters from '../data/presenters.json';
export {edition,evidence,claims,sources,people,relationships,locations,metagames,media,presenters};
export const stops=edition.stops.map(id=>{const stop=stopData.find(s=>s.id===id);if(!stop)throw new Error(`Missing stop: ${id}`);return stop;});

const rawBase = import.meta.env.BASE_URL || '/';
export const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;
export const routeURL = (path: string = '') => {
  const clean = path.replace(/^\//, '');
  if (!clean) return base;
  return `${base}${clean}`;
};
export const assetURL = (path: string = '') => {
  const clean = path.replace(/^\//, '');
  return `${base}${clean}`;
};
export const stopURL = (id: string) => `${base}stops/${id}/`;
export const sourceURL = (id: string, from?: string) =>
  `${base}sources/${from ? `?from=${from}` : ''}#source-${id}`;
export const claimURL = (id: string, from?: string) =>
  `${base}sources/${from ? `?from=${from}` : ''}#claim-${id}`;
