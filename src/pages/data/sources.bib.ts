import type {APIRoute} from 'astro';
import {sources} from '../../lib/catalog';
const esc = (v: string) => v.replace(/[{}\\]/g, '\\$&');
const year = (d: string | null) => d?.match(/^\d{4}/)?.[0];
export const GET: APIRoute = () => new Response(sources.map(s => {
  const fields: [string, string | undefined][] = [['author', s.creator], ['title', s.title], ['year', year(s.publicationDate)], ['url', s.url], ['urldate', s.consultationDate], ['note', `${s.sourceType}${s.archiveUrl ? `; archived: ${s.archiveUrl}` : ''}`]];
  return `@misc{${s.id},\n${fields.filter(([, v]) => v).map(([k, v]) => `  ${k} = {${esc(v!)}}`).join(',\n')}\n}`;
}).join('\n\n') + '\n', {headers: {'Content-Type': 'application/x-bibtex; charset=utf-8'}});
