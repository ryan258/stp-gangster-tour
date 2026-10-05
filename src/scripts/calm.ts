import { getPreferences, savePreferences } from './storage';

export function initCalmView(): void {
  const prefs = getPreferences();
  const calmBtn = document.getElementById('btn-toggle-calm') as HTMLButtonElement;

  if (prefs.calmView) {
    document.documentElement.classList.add('calm-mode');
    if (calmBtn) calmBtn.setAttribute('aria-pressed', 'true');
  } else {
    document.documentElement.classList.remove('calm-mode');
    if (calmBtn) calmBtn.setAttribute('aria-pressed', 'false');
  }

  calmBtn?.addEventListener('click', () => {
    const isCalm = document.documentElement.classList.toggle('calm-mode');
    savePreferences({ calmView: isCalm });
    calmBtn.setAttribute('aria-pressed', String(isCalm));

    const announcer = document.getElementById('live-announcer');
    if (announcer) {
      announcer.textContent = isCalm ? 'Calm view enabled: decorative textures and ambient audio paused.' : 'Calm view disabled.';
      announcer.classList.add('active');
      setTimeout(() => announcer.classList.remove('active'), 3000);
    }
  });
}
