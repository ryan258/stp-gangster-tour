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
import corrections from '../data/corrections.json';
import {base} from './base';
import presenters from '../data/presenters.json';
export {edition,evidence,claims,sources,people,relationships,locations,metagames,media,presenters,corrections,base};
/** Where readers report a correction; the claim ID is prefilled by the sources page. */
export const issuesURL = 'https://github.com/ryan258/stp-gangster-tour/issues/new';
export const stops=edition.stops.map(id=>{const stop=stopData.find(s=>s.id===id);if(!stop)throw new Error(`Missing stop: ${id}`);return stop;});

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

/** Image record by file basename (e.g. 'card-the-arrangement'); throws so a missing record fails the build. */
export const imageRecord = (name: string) => {
  const record = media.images.find(i => i.file === `/images/redesign/${name}.webp`);
  if (!record) throw new Error(`Image not in media catalog: ${name}`);
  return record;
};
