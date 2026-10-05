// Single BASE_URL normalisation shared by build-time helpers and browser scripts (tiny; no catalog imports).
const raw = import.meta.env.BASE_URL || '/';
export const base = raw.endsWith('/') ? raw : `${raw}/`;
