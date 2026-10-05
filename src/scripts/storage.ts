/**
 * Storage and state manager according to Spec R8 & AC16-AC18, AC27, AC30, AC32
 */

export interface Bookmark {
  stopId: string;
  blockId: 'intro' | 'record' | 'metagame' | 'opening';
}

export interface ProgressState {
  schemaVersion: 1;
  contentRevision: string;
  bookmark: Bookmark | null;
  visitedStops: string[];
  inspectedEvidence: string[];
  endingReached: boolean;
}

export interface PreferencesState {
  schemaVersion: 1;
  calmView: boolean;
  narrationVolume: number;
  ambienceVolume: number;
  playbackSpeed: number;
}

const PROGRESS_KEY = 'stp-after-dark:progress:v1';
const PREFERENCES_KEY = 'stp-after-dark:preferences:v1';
const MAX_PAYLOAD_BYTES = 32768; // 32 KiB per Spec R8

let storageAvailable = true;
let notifiedStorageFailure = false;

// In-memory fallback states
let memProgress: ProgressState = {
  schemaVersion: 1,
  contentRevision: '0.4.0',
  bookmark: null,
  visitedStops: [],
  inspectedEvidence: [],
  endingReached: false
};

let memPreferences: PreferencesState = {
  schemaVersion: 1,
  calmView: false,
  narrationVolume: 0.7,
  ambienceVolume: 0.2,
  playbackSpeed: 1.0
};

function testStorage(): boolean {
  try {
    const testKey = '__stp_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

storageAvailable = typeof window !== 'undefined' && testStorage();

function announceStorageFailureOnce() {
  if (notifiedStorageFailure) return;
  notifiedStorageFailure = true;
  const announcer = document.getElementById('live-announcer');
  if (announcer) {
    announcer.textContent = 'Progress cannot be saved. You can keep exploring, but progress may reset when you open another page or close this one.';
    announcer.classList.add('active');
    setTimeout(() => announcer.classList.remove('active'), 6000);
  }
}

export function getProgress(): ProgressState {
  if (!storageAvailable) return memProgress;
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) return memProgress;
    if (raw.length > MAX_PAYLOAD_BYTES) throw new Error('Payload exceeded size limit');
    const parsed = JSON.parse(raw);
    if (parsed.schemaVersion !== 1) throw new Error('Unknown schema version');
    
    // Validate fields
    memProgress = {
      schemaVersion: 1,
      contentRevision: parsed.contentRevision || '0.4.0',
      bookmark: parsed.bookmark && typeof parsed.bookmark.stopId === 'string' ? parsed.bookmark : null,
      visitedStops: Array.isArray(parsed.visitedStops) ? parsed.visitedStops : [],
      inspectedEvidence: Array.isArray(parsed.inspectedEvidence) ? parsed.inspectedEvidence : [],
      endingReached: Boolean(parsed.endingReached)
    };
    return memProgress;
  } catch (e) {
    announceStorageFailureOnce();
    return memProgress;
  }
}

export function saveProgress(updates: Partial<ProgressState>): void {
  const current = getProgress();
  const next: ProgressState = {
    ...current,
    ...updates,
    schemaVersion: 1
  };
  memProgress = next;
  if (!storageAvailable) {
    announceStorageFailureOnce();
    return;
  }
  try {
    const serialized = JSON.stringify(next);
    if (serialized.length <= MAX_PAYLOAD_BYTES) {
      window.localStorage.setItem(PROGRESS_KEY, serialized);
    }
  } catch (e) {
    storageAvailable = false;
    announceStorageFailureOnce();
  }
}

export function getPreferences(): PreferencesState {
  if (!storageAvailable) return memPreferences;
  try {
    const raw = window.localStorage.getItem(PREFERENCES_KEY);
    if (!raw) return memPreferences;
    if (raw.length > MAX_PAYLOAD_BYTES) throw new Error('Payload exceeded limit');
    const parsed = JSON.parse(raw);
    if (parsed.schemaVersion !== 1) throw new Error('Unknown schema version');
    
    memPreferences = {
      schemaVersion: 1,
      calmView: Boolean(parsed.calmView),
      narrationVolume: typeof parsed.narrationVolume === 'number' ? Math.max(0, Math.min(1, parsed.narrationVolume)) : 0.7,
      ambienceVolume: typeof parsed.ambienceVolume === 'number' ? Math.max(0, Math.min(1, parsed.ambienceVolume)) : 0.2,
      playbackSpeed: [0.75, 1.0, 1.25, 1.5].includes(parsed.playbackSpeed) ? parsed.playbackSpeed : 1.0
    };
    return memPreferences;
  } catch (e) {
    return memPreferences;
  }
}

export function savePreferences(updates: Partial<PreferencesState>): void {
  const current = getPreferences();
  const next: PreferencesState = {
    ...current,
    ...updates,
    schemaVersion: 1
  };
  memPreferences = next;
  if (!storageAvailable) return;
  try {
    const serialized = JSON.stringify(next);
    if (serialized.length <= MAX_PAYLOAD_BYTES) {
      window.localStorage.setItem(PREFERENCES_KEY, serialized);
    }
  } catch (e) {
    storageAvailable = false;
  }
}

export function markStopVisited(stopId: string): void {
  const p = getProgress();
  if (!p.visitedStops.includes(stopId)) {
    saveProgress({ visitedStops: [...p.visitedStops, stopId] });
  }
}

export function markEvidenceInspected(evidenceId: string): boolean {
  const p = getProgress();
  if (!p.inspectedEvidence.includes(evidenceId)) {
    saveProgress({ inspectedEvidence: [...p.inspectedEvidence, evidenceId] });
    return true; // newly inspected
  }
  return false; // already inspected
}

export function saveBookmark(stopId: string, blockId: 'intro' | 'record' | 'metagame' | 'opening'): void {
  saveProgress({
    bookmark: { stopId, blockId }
  });
}

export function clearProgressKeepPreferences(): void {
  memProgress = {
    schemaVersion: 1,
    contentRevision: '0.4.0',
    bookmark: null,
    visitedStops: [],
    inspectedEvidence: [],
    endingReached: false
  };
  if (storageAvailable) {
    try {
      window.localStorage.removeItem(PROGRESS_KEY);
      // NOTE: DO NOT call localStorage.clear() per Spec R8!
    } catch (e) {
      // ignore
    }
  }
}
