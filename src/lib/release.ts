import {edition, locations, media, stops} from './catalog';
import reviews from '../data/narration-reviews.json';
import geography from '../data/geography.json';

// Visitor copy about review state is derived from the catalog, so it cannot contradict the release gates
// in scripts/validate-content.mjs. Build-time only: browser scripts must not import this.
const unapproved = (rows: readonly Record<string, unknown>[]) => rows.some(r => r.rightsStatus !== 'approved');

export const release = {
  preview: edition.releaseStatus !== 'reviewed',
  listening: [...reviews.narration, ...reviews.ambience].some(r => r.listeningReviewStatus !== 'passed'),
  audioRights: unapproved([...media.narration, ...media.ambience]),
  imageProvenance: media.images.some(i => i.provenanceStatus !== 'confirmed'),
  imageRights: unapproved(media.images),
  sceneReview: media.scenes.some(s => s.reviewStatus !== 'reviewed'),
  sceneRights: unapproved(media.scenes),
  geography: geography.status !== 'reviewed'
};

export const listeningPending = (narrationId: string) =>
  reviews.narration.find(r => r.id === narrationId)?.listeningReviewStatus !== 'passed';

export const list = (items: string[]) =>
  items.length < 3 ? items.join(' and ') : `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;

export const count = (n: number) => ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven'][n] ?? String(n);

export const placedCount = locations.filter(l => l.coordinates !== null).length;
export const unplacedCount = stops.length - placedCount;
export const unplacedSentence = `${count(unplacedCount)} ${unplacedCount === 1 ? 'chapter remains' : 'chapters remain'} unplaced`;
