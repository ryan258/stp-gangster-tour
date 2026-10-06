/** Browser input is restricted to the frame IDs already rendered by the catalog. */
export function decodeStudySelection(raw: string | null, allowed: readonly string[]): string | null {
  if (!raw || raw.length > 512) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object') return null;
    const record = value as Record<string, unknown>;
    return record.version === 1 && typeof record.frame === 'string' && allowed.includes(record.frame) ? record.frame : null;
  } catch { return null; }
}

export type StudyMessage = {type: 'request'} | {type: 'select' | 'state'; frame: string};
export function decodeStudyMessage(value: unknown, allowed: readonly string[]): StudyMessage | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  if (record.type === 'request') return {type: 'request'};
  if ((record.type === 'select' || record.type === 'state') && typeof record.frame === 'string' && allowed.includes(record.frame)) {
    return {type: record.type, frame: record.frame};
  }
  return null;
}

export function validStudyRoom(value: string | null): value is string {
  return !!value && /^[a-f0-9]{32}$/.test(value);
}
