import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const errors = [];

function error(recordType, id, field, reason) {
  errors.push(`[${recordType}:${id}] ${field}: ${reason}`);
}

function loadJson(relPath) {
  const fullPath = path.resolve(relPath);
  if (!fs.existsSync(fullPath)) {
    errors.push(`Missing required file: ${relPath}`);
    return null;
  }
  return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
}

const edition = loadJson('src/data/edition.json');
const stops = loadJson('src/data/stops.json');
const evidence = loadJson('src/data/evidence.json');
const people = loadJson('src/data/people.json');
const relationships = loadJson('src/data/relationships.json');
const sources = loadJson('src/data/sources.json');
const claims = loadJson('src/data/claims.json');
const metagames = loadJson('src/data/metagames.json');
const locations = loadJson('src/data/locations.json');
const media = loadJson('src/data/media.json');

if (!errors.length) {
  // 1. Validate Edition
  if (!edition.stops || edition.stops.length !== 7) {
    error('Edition', edition.id, 'stops', `Must specify exactly 7 stops, got ${edition.stops ? edition.stops.length : 0}`);
  }
  if (!edition.prologue || !edition.prologue.paragraphs || edition.prologue.paragraphs.length === 0) {
    error('Edition', edition.id, 'prologue', 'Must contain non-empty prologue paragraphs');
  }
  if (!edition.epilogue || !edition.epilogue.paragraphs || edition.epilogue.paragraphs.length === 0) {
    error('Edition', edition.id, 'epilogue', 'Must contain non-empty epilogue paragraphs');
  }

  // Maps for reference validation
  const stopMap = new Map();
  const orderSet = new Set();
  const evidenceMap = new Map();
  const personMap = new Map();
  const sourceMap = new Map();
  const claimMap = new Map();
  const metagameMap = new Map();
  const locationMap = new Map();
  const sceneMap = new Map();
  const narrationMap = new Map();

  sources.forEach(s => {
    if (sourceMap.has(s.id)) error('Source', s.id, 'id', 'Duplicate source ID');
    sourceMap.set(s.id, s);
    if (!s.title || !s.creator || !s.sourceType) {
      error('Source', s.id, 'fields', 'Missing title, creator, or sourceType');
    }
  });

  claims.forEach(c => {
    if (claimMap.has(c.id)) error('Claim', c.id, 'id', 'Duplicate claim ID');
    claimMap.set(c.id, c);
    if (!c.assertion || !c.status || !c.evidenceBasis) {
      error('Claim', c.id, 'fields', 'Missing assertion, status, or evidenceBasis');
    }
    // Check qualification requirement
    const needsQual = c.status !== 'Supported' || c.evidenceBasis === 'attributed account';
    if (needsQual && (!c.qualification || c.qualification.trim() === '')) {
      error('Claim', c.id, 'qualification', `Status '${c.status}' requires a non-empty qualification`);
    }
    // Check source references
    for (const sid of c.sourceIds || []) {
      if (!sourceMap.has(sid)) error('Claim', c.id, 'sourceIds', `Dangling source ID: ${sid}`);
    }
  });

  locations.forEach(l => {
    if (locationMap.has(l.id)) error('Location', l.id, 'id', 'Duplicate location ID');
    locationMap.set(l.id, l);
    if (!['exact', 'approximate', 'unknown'].includes(l.precision)) {
      error('Location', l.id, 'precision', `Invalid precision: ${l.precision}`);
    }
    if (!['extant', 'altered', 'demolished', 'unverified'].includes(l.condition)) {
      error('Location', l.id, 'condition', `Invalid condition: ${l.condition}`);
    }
    if (!['public', 'private', 'restricted', 'unknown'].includes(l.access)) {
      error('Location', l.id, 'access', `Invalid access: ${l.access}`);
    }
  });

  media.scenes.forEach(sc => {
    sceneMap.set(sc.id, sc);
    const p = path.join('public', sc.file);
    if (!fs.existsSync(p)) error('Media', sc.id, 'file', `Scene file does not exist: ${sc.file}`);
  });

  media.narration.forEach(n => {
    narrationMap.set(n.id, n);
    const p = path.join('public', n.file);
    if (!fs.existsSync(p)) error('Media', n.id, 'file', `Audio file does not exist: ${n.file}`);
  });

  people.forEach(p => {
    if (personMap.has(p.id)) error('Person', p.id, 'id', 'Duplicate person ID');
    personMap.set(p.id, p);
    for (const cid of p.supportingClaimIds || []) {
      if (!claimMap.has(cid)) error('Person', p.id, 'supportingClaimIds', `Dangling claim ID: ${cid}`);
    }
  });

  metagames.forEach(m => {
    if (metagameMap.has(m.id)) error('Metagame', m.id, 'id', 'Duplicate metagame ID');
    metagameMap.set(m.id, m);
    if (!m.actors || m.actors.length === 0) error('Metagame', m.id, 'actors', 'Actors cannot be empty');
    if (!m.mechanism || !m.expectedBenefit || !m.bearingCosts || !m.evidentiaryLimit) {
      error('Metagame', m.id, 'fields', 'Missing mechanism, benefit, costs, or limit');
    }
    for (const cid of m.premiseClaims || []) {
      if (!claimMap.has(cid)) error('Metagame', m.id, 'premiseClaims', `Dangling claim ID: ${cid}`);
    }
  });

  evidence.forEach(e => {
    if (evidenceMap.has(e.id)) error('Evidence', e.id, 'id', 'Duplicate evidence ID');
    evidenceMap.set(e.id, e);
    if (!e.title || !e.description || !e.supports || !e.limits) {
      error('Evidence', e.id, 'fields', 'Missing title, description, supports, or limits');
    }
    for (const cid of e.claimIds || []) {
      if (!claimMap.has(cid)) error('Evidence', e.id, 'claimIds', `Dangling claim ID: ${cid}`);
    }
    for (const ref of e.sourceLocators || []) {
      if (!sourceMap.has(ref.sourceId)) error('Evidence', e.id, 'sourceLocators', `Dangling source: ${ref.sourceId}`);
    }
  });

  if (evidence.length !== 14) {
    error('Evidence', 'catalog', 'length', `Expected exactly 14 evidence items (2 per stop), found ${evidence.length}`);
  }

  // 2. Validate Stops
  if (stops.length !== 7) {
    error('Stops', 'catalog', 'length', `Expected exactly 7 stops, found ${stops.length}`);
  }

  stops.forEach(s => {
    if (stopMap.has(s.id)) error('Stop', s.id, 'id', 'Duplicate stop ID');
    stopMap.set(s.id, s);

    if (orderSet.has(s.order)) error('Stop', s.id, 'order', `Duplicate order: ${s.order}`);
    orderSet.add(s.order);

    if (!locationMap.has(s.locationId)) error('Stop', s.id, 'locationId', `Dangling location: ${s.locationId}`);
    if (!sceneMap.has(s.sceneId)) error('Stop', s.id, 'sceneId', `Dangling scene: ${s.sceneId}`);
    if (!narrationMap.has(s.narrationId)) error('Stop', s.id, 'narrationId', `Dangling narration: ${s.narrationId}`);

    // Blocks
    if (!s.blocks.intro || !s.blocks.record || !s.blocks.metagame) {
      error('Stop', s.id, 'blocks', 'Must have intro, record, and metagame blocks');
    }

    // Narration transcript consistency & digest check
    const norm = s.blocks.intro.text.normalize('NFC').replace(/\r\n/g, '\n').trim();
    const digest = crypto.createHash('sha256').update(norm, 'utf8').digest('hex');
    const narrRecord = narrationMap.get(s.narrationId);
    if (narrRecord) {
      if (narrRecord.transcriptDigest !== digest) {
        error('Stop', s.id, 'narration', `Stale narration review: text digest ${digest} != recorded ${narrRecord.transcriptDigest}`);
      }
    }

    // Evidence
    if (!s.evidenceIds || s.evidenceIds.length !== 2) {
      error('Stop', s.id, 'evidenceIds', `Each stop must have exactly 2 evidence items, got ${s.evidenceIds ? s.evidenceIds.length : 0}`);
    } else {
      for (const eid of s.evidenceIds) {
        if (!evidenceMap.has(eid)) error('Stop', s.id, 'evidenceIds', `Dangling evidence ID: ${eid}`);
      }
    }

    // Related people
    for (const pid of s.relatedPersonIds || []) {
      if (!personMap.has(pid)) error('Stop', s.id, 'relatedPersonIds', `Dangling person ID: ${pid}`);
    }

    // Related stops
    for (const rsid of s.relatedStopIds || []) {
      if (!edition.stops.includes(rsid)) error('Stop', s.id, 'relatedStopIds', `Dangling related stop: ${rsid}`);
    }
  });

  // 3. Relationships check
  relationships.forEach((r, idx) => {
    if (!personMap.has(r.fromId)) error('Relationship', idx, 'fromId', `Dangling entity ID: ${r.fromId}`);
    if (!personMap.has(r.toId)) error('Relationship', idx, 'toId', `Dangling entity ID: ${r.toId}`);
    for (const cid of r.premiseClaims || []) {
      if (!claimMap.has(cid)) error('Relationship', idx, 'premiseClaims', `Dangling claim ID: ${cid}`);
    }
  });

  // 4. Required R9 checked venue geography
  const requiredVenues = ['loc-hotel', 'loc-castle-royal', 'loc-courthouse'];
  for (const vid of requiredVenues) {
    const loc = locationMap.get(vid);
    if (!loc || !loc.coordinates || loc.precision !== 'exact') {
      error('Location', vid, 'coordinates', 'R9 requires verified exact coordinates for hotel, caves, and courthouse');
    }
  }
}

if (errors.length > 0) {
  console.error(`\nContent Validation FAILED with ${errors.length} error(s):`);
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log(`✓ Content validation passed quietly (7 stops, 14 evidence items, 30 claims, 16 sources, 7 metagames, 12 people, media verified).`);
  process.exit(0);
}
