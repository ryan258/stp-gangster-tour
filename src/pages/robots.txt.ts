import type {APIRoute} from 'astro';
import {routeURL} from '../lib/catalog';
export const GET: APIRoute = ({site}) => new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL(routeURL('/sitemap.xml'), site).href}\n`, {headers: {'Content-Type': 'text/plain; charset=utf-8'}});
