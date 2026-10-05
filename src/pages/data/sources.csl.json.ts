import type {APIRoute} from 'astro';
import {sources} from '../../lib/catalog';
const parts = (d: string | null) => d?.match(/^\d{4}(-\d{2})?(-\d{2})?$/) ? [d.split('-').map(Number)] : undefined;
export const GET: APIRoute = () => new Response(JSON.stringify(sources.map(s => ({
  id: s.id, type: 'webpage', title: s.title, author: [{literal: s.creator}], URL: s.url,
  issued: parts(s.publicationDate) && {'date-parts': parts(s.publicationDate)}, accessed: {'date-parts': parts(s.consultationDate)},
  note: s.sourceType
})), null, 2) + '\n', {headers: {'Content-Type': 'application/json'}});
