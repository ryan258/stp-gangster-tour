const chapterAnchors = {opening: 'sequence-opening', record: 'sequence-record', return: 'sequence-return'} as const;
// Preserve bookmarks and direct links from the Under the Bluff pilot.
const bluffAnchors = {opening: 'bluff-room', record: 'bluff-record', return: 'bluff-return'} as const;

type FeaturedTitleScene = {
  theme: 'threshold' | 'telephone';
  image: string;
  inspectLabel: string;
  returnLabel: string;
};

export const featuredTitleScenes: Record<string, FeaturedTitleScene | undefined> = {
  'the-arrangement': {theme: 'threshold', image: 'story-doorway', inspectLabel: 'Inspect the conditions', returnLabel: 'Return to the doorway'},
  'the-deal-breaks': {theme: 'telephone', image: 'story-the-deal-breaks', inspectLabel: 'Read the demand', returnLabel: 'Return to the telephone'},
};

export type TitleBlock = (typeof chapterAnchors | typeof bluffAnchors)[keyof typeof chapterAnchors];

export const titleBlockLabels: Record<TitleBlock, string> = {
  'sequence-opening': 'Opening',
  'sequence-record': 'The record',
  'sequence-return': 'The return',
  'bluff-room': 'The room',
  'bluff-record': 'The record',
  'bluff-return': 'The empty chair',
};

export function chapterTitleAnchors(stopId: string) {
  return stopId === 'under-the-bluff' ? bluffAnchors : chapterAnchors;
}
