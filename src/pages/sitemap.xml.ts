import type {APIRoute} from 'astro';
import {stops, routeURL} from '../lib/catalog';
const routes = ['/', '/prologue/', ...stops.map(s => `/stops/${s.id}/`), '/map/', '/casebook/', '/sources/', '/method/', '/epilogue/'];
export const GET: APIRoute = ({site}) => {
  const urls = routes.map(r => `  <url><loc>${new URL(routeURL(r), site).href}</loc></url>`);
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`, {headers: {'Content-Type': 'application/xml'}});
};
