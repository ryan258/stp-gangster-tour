import type {APIRoute} from 'astro';
import {casebookStories, casebookStoryURL} from '../../lib/casebook-experiences';
import {paperTrails, paperTrailURL} from '../../lib/paper-trails';
import {edition, stops, claims, sources, evidence, people, relationships, locations, corrections} from '../../lib/catalog';
// Citable copy of the research catalog, with story references in place of visitor prose.
export const GET: APIRoute = () => new Response(JSON.stringify({
  edition: {id: edition.id, title: edition.title, contentRevision: edition.contentRevision, historicalCheckDate: edition.historicalCheckDate, releaseStatus: edition.releaseStatus},
  stops: stops.map(s => ({id: s.id, order: s.order, title: s.title, period: s.period, locationId: s.locationId, evidenceIds: s.evidenceIds, claimIds: [...new Set(Object.values(s.blocks).flatMap(b => b.claimIds))]})),
  casebookStories: casebookStories.map(s => ({id: s.id, title: s.title, period: s.period, stopId: s.stopId, path: casebookStoryURL(s.id), form:s.form, claimIds: [...new Set(s.scenes.flatMap(scene => scene.claimIds))]})),
  paperTrails: paperTrails.map(s => ({id: s.id, title: s.title, period: s.period, path: paperTrailURL(s.id), scenes: s.scenes.map(scene=>({id:scene.id,claimIds:scene.claimIds}))})),
  claims, sources, evidence, people, relationships, locations, corrections
}, null, 2) + '\n', {headers: {'Content-Type': 'application/json'}});
