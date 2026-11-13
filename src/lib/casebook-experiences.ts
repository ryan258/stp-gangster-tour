import storyData from '../data/casebook-stories.json';
import experienceData from '../data/casebook-experiences.json';
import {routeURL} from './catalog';

export const casebookForms = {
  timeline: 'Timeline',
  sound: 'Sound in the record',
  comparison: 'Side by side',
  sequence: 'Scene sequence',
  evidence: 'Evidence table',
  map: 'Route diagram',
  dispatch: 'News dispatches',
  ledger: 'Ledger',
  reconstruction: 'Reconstruction',
  hearing: 'Case hearing',
  letters: 'Correspondence',
  trace: 'Clue trace',
  apparatus: 'Equipment inspection',
  playbill: 'Playbill',
  'call-log': 'Call log'
} as const;

type CasebookForm = keyof typeof casebookForms;
type SceneLabels = {
  label: string;
  title: string;
  focus: string;
  inset?: {
    label: string;
    layout?: 'cards';
    lines: {label: string; text: string}[];
  };
};
type Design = {
  id: string;
  form: CasebookForm;
  collection?: 'old-records' | 'strange-finds' | 'between-the-lines' | 'clues-in-plain-sight' | 'stranger-than-the-headlines' | 'oddities-in-saint-paul-files';
  deck: string;
  sceneLabels: SceneLabels[];
};

const designs = new Map((experienceData as Design[]).map(design => [design.id, design]));

export const casebookStories = storyData.map(story => {
  const design = designs.get(story.id);
  if (!design || design.sceneLabels.length !== story.blocks.length) {
    throw new Error(`Incomplete Casebook experience for ${story.id}`);
  }
  return {
    ...story,
    form: design.form,
    collection: design.collection,
    deck: design.deck,
    scenes: story.blocks.map((block, index) => ({
      ...block,
      ...design.sceneLabels[index],
      id: `scene-${index + 1}`
    }))
  };
});

export const casebookStoryURL = (id: string) => routeURL(`/casebook/stories/${id}/`);
export type CasebookStory = typeof casebookStories[number];
