// Subpath guard: in a build made with ASTRO_BASE, every root-relative URL must sit under that base.
// Usage: npm run check:base -- /stp-gangster-tour [dir]   (dir defaults to dist-preview)
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const attribute = /\b(href|src|poster|action|srcset)="([^"]*)"/g;
const cssUrl = /url\(\s*['"]?(\/[^)'"\s]*)/g;

export function rootRelativeEscapes(text, base) {
  const prefix = base.endsWith('/') ? base : `${base}/`;
  const found = [];
  const check = url => {
    if (url.startsWith('/') && !url.startsWith('//') && !url.startsWith(prefix) && url !== prefix.slice(0, -1)) found.push(url);
  };
  for (const [, name, value] of text.matchAll(attribute)) {
    for (const part of name === 'srcset' ? value.split(',') : [value]) check(part.trim().split(/\s+/)[0]);
  }
  for (const [, url] of text.matchAll(cssUrl)) check(url);
  return found;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const [base = '/', dir = 'dist-preview'] = process.argv.slice(2);
  if (base === '/' || base === '') {
    console.log('Root deployment: no base path to check.');
  } else {
    const bad = [];
    const walk = folder => {
      for (const entry of fs.readdirSync(folder, {withFileTypes: true})) {
        const file = path.join(folder, entry.name);
        if (entry.isDirectory()) walk(file);
        else if (/\.(html|css)$/.test(entry.name)) for (const url of rootRelativeEscapes(fs.readFileSync(file, 'utf8'), base)) bad.push(`${file}: ${url}`);
      }
    };
    walk(dir);
    if (bad.length) {
      console.error(`${bad.length} root-relative URL(s) outside ${base} in ${dir}:\n${[...new Set(bad)].slice(0, 40).join('\n')}`);
      process.exitCode = 1;
    } else console.log(`No root-relative URLs outside ${base} in ${dir}.`);
  }
}
