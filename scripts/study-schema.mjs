import {z} from 'zod';

const text = z.string().trim().min(1);
const id = text.regex(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/);
const ids = z.array(id).min(1).refine(values => new Set(values).size === values.length, 'Duplicate IDs');
const citation = {body: text, claimIds: ids};
const frame = z.object({
  id, label: text, title: text, period: text.optional(), ...citation, qualification: text,
  focusIds: ids.optional(), path: z.array(text).min(2).max(5).optional(), highlight: text.optional(), afterword: text.optional(),
  pair: z.object({title: text, ...citation, qualification: text}).strict().optional(),
  timeline: z.array(z.object({period: text, title: text, ...citation}).strict()).min(2).optional(),
  audioPerspective: z.enum(['street', 'room', 'account']).optional(), ambienceId: id.optional()
}).strict();

export const studySchema = z.array(z.object({
  id, kind: z.enum(['question', 'palimpsest', 'windows', 'audio', 'return', 'time']),
  title: text, subtitle: text, question: text, instructions: text, stopId: id,
  image: text.regex(/^card-[a-z-]+$/), api: text,
  role: z.enum(['Tour explanation', 'Tour explanation / Interpretation']),
  passage: z.object({stopId: id, block: z.enum(['intro', 'record', 'metagame'])}).strict().optional(),
  actors: z.array(z.object({id, label: text}).strict()).min(2).optional(),
  frames: z.array(frame).min(2).max(4)
}).strict()).length(6).refine(studies => new Set(studies.map(s => s.kind)).size === 6, 'One study per form');

export const studyClaimIds = studies => studies.flatMap(s => s.frames.flatMap(f => [
  ...f.claimIds, ...(f.pair?.claimIds ?? []), ...(f.timeline ?? []).flatMap(t => t.claimIds)
]));

/** Only checks structural links; this is never an editorial or listening review. */
export function validateStudyReferences(studies, data) {
  const errors = [];
  const distinct = (values, owner) => { if(new Set(values).size !== values.length) errors.push(`${owner}: duplicate ID`); };
  distinct(studies.map(s => s.id), 'studies');
  for (const study of studies) {
    const fail = message => errors.push(`study ${study.id}: ${message}`);
    if (!data.stops.some(s => s.id === study.stopId)) fail('unknown stop');
    if (!data.media.images.some(i => i.file === `/images/redesign/${study.image}.webp`)) fail('unknown catalog image');
    distinct(study.frames.map(f => f.id), `study ${study.id} frames`);
    distinct((study.actors ?? []).map(a => a.id), `study ${study.id} actors`);
    const passage = study.passage && data.stops.find(s => s.id === study.passage.stopId)?.blocks[study.passage.block];
    if (study.passage && !passage) fail('unknown passage');
    if (['palimpsest', 'audio'].includes(study.kind) && !passage) fail('needs a passage');
    if (study.kind === 'audio' && (study.passage?.block !== 'intro' || study.passage?.stopId !== study.stopId)) fail('audio transcript must be this stop introduction');
    for (const id of studyClaimIds([study])) if(!data.claims.some(c => c.id === id)) fail(`unknown claim ${id}`);
    for (const frame of study.frames) {
      if (study.kind === 'palimpsest' && (!frame.highlight || !passage?.text.includes(frame.highlight))) fail(`${frame.id}: highlight must match passage`);
      if (study.kind === 'windows' && !frame.pair) fail(`${frame.id}: needs both viewpoints`);
      if (study.kind === 'time' && !frame.timeline) fail(`${frame.id}: needs timeline`);
      if (study.kind === 'question' && (!frame.focusIds?.length || !frame.path)) fail(`${frame.id}: needs a focus and a relationship path`);
      for (const id of frame.focusIds ?? []) if(!study.actors?.some(a => a.id === id)) fail(`${frame.id}: unknown actor ${id}`);
      if (frame.ambienceId && !data.media.ambience.some(a => a.id === frame.ambienceId)) fail(`${frame.id}: unknown ambience`);
      if (study.kind === 'audio' && (!frame.audioPerspective || (frame.audioPerspective !== 'account' && !frame.ambienceId))) fail(`${frame.id}: incomplete audio perspective`);
    }
  }
  return errors;
}
