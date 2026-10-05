import type {APIRoute} from 'astro';
import {edition, stops, claims, sources, evidence, people, relationships, locations, corrections} from '../../lib/catalog';
// Citable copy of the research catalog; visitor prose (stop text) is deliberately excluded.
export const GET: APIRoute = () => new Response(JSON.stringify({
  edition: {id: edition.id, title: edition.title, contentRevision: edition.contentRevision, historicalCheckDate: edition.historicalCheckDate, releaseStatus: edition.releaseStatus},
  stops: stops.map(s => ({id: s.id, order: s.order, title: s.title, period: s.period, locationId: s.locationId, evidenceIds: s.evidenceIds, claimIds: [...new Set(Object.values(s.blocks).flatMap(b => b.claimIds))]})),
  claims, sources, evidence, people, relationships, locations, corrections
}, null, 2) + '\n', {headers: {'Content-Type': 'application/json'}});
