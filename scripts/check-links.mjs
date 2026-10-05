// Owner-run report: are cited URLs reachable, and does each source have an archived snapshot?
// Network access required. Exits nonzero only for hard failures (404/410/5xx/network); 403/429 usually mean bot-blocking.
import fs from 'node:fs';

const read = name => JSON.parse(fs.readFileSync(`src/data/${name}.json`, 'utf8'));
const targets = [
  ...read('sources').map(s => ({id: s.id, url: s.url, archived: Boolean(s.archiveUrl)})),
  ...read('locations').flatMap(l => [
    l.coordinates && {id: `${l.id} coordinates`, url: l.coordinates.sourceUrl, archived: true},
    l.currentCheck && {id: `${l.id} current`, url: l.currentCheck.url, archived: true}
  ].filter(Boolean))
];

let hardFailures = 0;
for (const t of targets) {
  let status;
  try {
    const res = await fetch(t.url, {redirect: 'follow', signal: AbortSignal.timeout(25000), headers: {'User-Agent': 'Mozilla/5.0 (stp-gangster-tour link check)'}});
    status = res.status;
  } catch (error) {
    status = `network error (${error.name})`;
  }
  const blocked = status === 403 || status === 429;
  const hard = typeof status !== 'number' || status === 404 || status === 410 || status >= 500;
  if (hard) hardFailures++;
  console.log(`${String(status).padEnd(26)} ${t.id.padEnd(28)} ${t.archived ? '' : '[no archive snapshot] '}${blocked ? '[blocked: check by hand] ' : ''}${t.url}`);
}
console.log(`\n${targets.length} URLs checked; ${hardFailures} hard failures; ${targets.filter(t => !t.archived).length} sources without an archive snapshot.`);
process.exitCode = hardFailures ? 1 : 0;
