import studyData from '../data/studies.json';

export interface StudyFrame {
  id: string; label: string; title: string; period?: string; body: string; qualification: string; claimIds: string[];
  focusIds?: string[]; path?: string[]; highlight?: string; afterword?: string;
  pair?: {title: string; body: string; qualification: string; claimIds: string[]};
  timeline?: {period: string; title: string; body: string; claimIds: string[]}[];
  audioPerspective?: 'street' | 'room' | 'account'; ambienceId?: string;
}
export interface Study {
  id: string; kind: 'question' | 'palimpsest' | 'windows' | 'audio' | 'return' | 'time';
  title: string; subtitle: string; question: string; instructions: string; stopId: string;
  image: string; api: string; role: string; frames: StudyFrame[];
  actors?: {id: string; label: string}[];
  passage?: {stopId: string; block: 'intro' | 'record' | 'metagame'};
}
// The build/dev content gate owns runtime validation and cross-catalog references.
export const studies = studyData as Study[];
