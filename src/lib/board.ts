import boardData from '../data/board.json';
import {metagames, stops} from './catalog';

// Build-time only. The scrolling "actors and costs" board is a presentation of a chapter's metagame record;
// scripts/validate-content.mjs checks every actor name and marker phrase against the catalog.
export type BoardField = 'aims' | 'expectedBenefit' | 'bearingCosts' | 'observedResponse' | 'evidentiaryLimit';
export type BlockId = 'intro' | 'record' | 'metagame';

export const fieldLabels: Record<BoardField, string> = {
  aims: 'What the actors sought',
  observedResponse: 'Reported response',
  expectedBenefit: 'Expected benefit',
  bearingCosts: 'Who bore the costs',
  evidentiaryLimit: 'Limit of the evidence'
};

export function boardFor(stopId: string) {
  const config = boardData.find(b => b.stopId === stopId);
  const metagame = metagames.find(m => m.owningStop === stopId);
  const stop = stops.find(s => s.id === stopId);
  if (!config || !metagame || !stop) return null;
  // Cards follow the order the reading introduces each actor (first linked phrase: block, then position), not the data order.
  const blocks: BlockId[] = ['intro', 'record', 'metagame'];
  const firstSeen = (name: string) => Math.min(...config.markers
    .filter(m => m.actor === name)
    .map(m => blocks.indexOf(m.block as BlockId) * 1e6 + stop.blocks[m.block as BlockId].text.indexOf(m.phrase)));
  return {
    metagame,
    actors: [...metagame.actors].sort((a, b) => (firstSeen(a.name) - firstSeen(b.name)) || 0),
    beats: config.beats as {block: BlockId; label: string; actors: string[]; fields: BoardField[]}[],
    markers: config.markers as {block: BlockId; phrase: string; actor: string}[]
  };
}

/** Splits one block's text into plain runs and marked phrases, in reading order. */
export function segments(text: string, markers: {phrase: string; actor: string}[]) {
  const found = markers
    .map(m => ({...m, at: text.indexOf(m.phrase)}))
    .filter(m => m.at >= 0)
    .sort((a, b) => a.at - b.at);
  const out: {text: string; actor?: string}[] = [];
  let cursor = 0;
  for (const m of found) {
    if (m.at > cursor) out.push({text: text.slice(cursor, m.at)});
    out.push({text: m.phrase, actor: m.actor});
    cursor = m.at + m.phrase.length;
  }
  if (cursor < text.length) out.push({text: text.slice(cursor)});
  return out;
}
