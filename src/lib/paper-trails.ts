import storyData from '../data/paper-trails.json';
import {routeURL} from './catalog';

export interface PaperTrailScene {
  id: string;
  label: string;
  title: string;
  text: string;
  claimIds: string[];
}

export const paperTrailForms = {
  table: 'Cigar counter',
  letters: 'Correspondence',
  brief: 'Inventor’s pitch',
  freight: 'Freight trail',
  signals: 'Call log',
  escape: 'Escape sequence',
  ledger: 'Pocket ledger'
} as const;

export interface PaperTrail {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  form: keyof typeof paperTrailForms;
  scenes: PaperTrailScene[];
  sourceLink: {sourceId: string; label: string};
  comparison?: {merchandiseValue: string; cashValue: string};
}

export const paperTrails = storyData as PaperTrail[];
export const paperTrailURL = (id: string) => routeURL(`/casebook/${id}/`);
