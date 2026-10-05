/**
 * Audio Controller complying with Spec R3 and AC10–AC12, AC28
 */
import { getPreferences, savePreferences } from './storage';

export class TourAudioController {
  private narrationAudio: HTMLAudioElement | null = null;
  private ambienceAudio: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private narrationSrc: string | null = null;
  private ambienceSrc: string = '/media/audio/ambience-city-rain.mp3';

  private statusBadge: HTMLElement | null = null;
  private playBtn: HTMLButtonElement | null = null;
  private pauseBtn: HTMLButtonElement | null = null;
  private restartBtn: HTMLButtonElement | null = null;
  private ambienceBtn: HTMLButtonElement | null = null;
  private speedSelect: HTMLSelectElement | null = null;

  constructor(narrationTrackUrl?: string) {
    if (narrationTrackUrl) {
      this.narrationSrc = narrationTrackUrl;
    }
  }

  public initUI(): void {
    this.statusBadge = document.getElementById('audio-status');
    this.playBtn = document.getElementById('btn-audio-play') as HTMLButtonElement;
    this.pauseBtn = document.getElementById('btn-audio-pause') as HTMLButtonElement;
    this.restartBtn = document.getElementById('btn-audio-restart') as HTMLButtonElement;
    this.ambienceBtn = document.getElementById('btn-toggle-ambience') as HTMLButtonElement;
    this.speedSelect = document.getElementById('audio-speed-select') as HTMLSelectElement;

    // Attach listeners
    this.playBtn?.addEventListener('click', () => this.playNarration());
    this.pauseBtn?.addEventListener('click', () => this.pauseNarration());
    this.restartBtn?.addEventListener('click', () => this.restartNarration());
    this.ambienceBtn?.addEventListener('click', () => this.toggleAmbience());

    if (this.speedSelect) {
      const prefs = getPreferences();
      this.speedSelect.value = String(prefs.playbackSpeed);
      this.speedSelect.addEventListener('change', (e) => {
        const val = parseFloat((e.target as HTMLSelectElement).value);
        this.setSpeed(val);
      });
    }

    // Quieter / Louder buttons
    document.getElementById('btn-volume-down')?.addEventListener('click', () => this.adjustVolume(-0.1));
    document.getElementById('btn-volume-up')?.addEventListener('click', () => this.adjustVolume(0.1));

    // Handle visibility changes per Spec R3 (hide/minimize -> pause both channels)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAll();
      }
    });
  }

  private ensureNarrationElement(): HTMLAudioElement {
    if (!this.narrationAudio && this.narrationSrc) {
      this.narrationAudio = new Audio();
      this.narrationAudio.src = this.narrationSrc;
      this.narrationAudio.preload = 'none';

      const prefs = getPreferences();
      let vol = prefs.narrationVolume;
      if (vol <= 0.05) vol = 0.5; // restore modest nonzero level per R3
      this.narrationAudio.volume = vol;
      this.narrationAudio.playbackRate = prefs.playbackSpeed;

      this.narrationAudio.addEventListener('ended', () => {
        this.updateStatus('Replay introduction');
        this.restoreAmbienceLevel();
      });

      this.narrationAudio.addEventListener('error', () => {
        this.updateStatus('Unavailable — Retry');
      });
    }
    return this.narrationAudio!;
  }

  private ensureAmbienceElement(): HTMLAudioElement {
    if (!this.ambienceAudio) {
      this.ambienceAudio = new Audio();
      this.ambienceAudio.src = this.ambienceSrc;
      this.ambienceAudio.loop = true;
      this.ambienceAudio.preload = 'none';

      const prefs = getPreferences();
      this.ambienceAudio.volume = prefs.ambienceVolume;
    }
    return this.ambienceAudio;
  }

  public async playNarration(): Promise<void> {
    if (!this.narrationSrc) return;
    this.updateStatus('Loading...');

    const audio = this.ensureNarrationElement();
    this.isMuted = false;

    try {
      this.duckAmbience();
      await audio.play();
      this.updateStatus('Playing');
      if (this.pauseBtn) this.pauseBtn.style.display = 'inline-flex';
      if (this.playBtn) this.playBtn.style.display = 'none';
    } catch (err) {
      this.updateStatus('Unavailable — Retry');
    }
  }

  public pauseNarration(): void {
    if (this.narrationAudio) {
      this.narrationAudio.pause();
      this.updateStatus('Paused');
      this.restoreAmbienceLevel();
      if (this.pauseBtn) this.pauseBtn.style.display = 'none';
      if (this.playBtn) {
        this.playBtn.style.display = 'inline-flex';
        this.playBtn.textContent = 'Resume introduction';
      }
    }
  }

  public restartNarration(): void {
    if (this.narrationAudio) {
      this.narrationAudio.currentTime = 0;
      this.playNarration();
    }
  }

  public toggleAmbience(): void {
    const prefs = getPreferences();
    if (prefs.calmView) {
      const announcer = document.getElementById('live-announcer');
      if (announcer) {
        announcer.textContent = 'Calm view is active and suppresses ambient sound.';
        announcer.classList.add('active');
        setTimeout(() => announcer.classList.remove('active'), 4000);
      }
      return;
    }

    const audio = this.ensureAmbienceElement();
    if (audio.paused) {
      audio.play().then(() => {
        if (this.ambienceBtn) this.ambienceBtn.setAttribute('aria-pressed', 'true');
      }).catch(() => {});
    } else {
      audio.pause();
      if (this.ambienceBtn) this.ambienceBtn.setAttribute('aria-pressed', 'false');
    }
  }

  private duckAmbience(): void {
    if (this.ambienceAudio && !this.ambienceAudio.paused) {
      const prefs = getPreferences();
      // Duck to 25% of chosen level per Spec R3
      this.ambienceAudio.volume = prefs.ambienceVolume * 0.25;
    }
  }

  private restoreAmbienceLevel(): void {
    if (this.ambienceAudio && !this.ambienceAudio.paused) {
      const prefs = getPreferences();
      this.ambienceAudio.volume = prefs.ambienceVolume;
    }
  }

  public pauseAll(): void {
    if (this.narrationAudio) this.narrationAudio.pause();
    if (this.ambienceAudio) this.ambienceAudio.pause();
    this.updateStatus('Paused');
  }

  public mute(): void {
    this.isMuted = true;
    if (this.narrationAudio) this.narrationAudio.pause();
    if (this.ambienceAudio) this.ambienceAudio.pause();
    this.updateStatus('Muted');
  }

  public setSpeed(speed: number): void {
    savePreferences({ playbackSpeed: speed });
    if (this.narrationAudio) {
      this.narrationAudio.playbackRate = speed;
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public adjustVolume(delta: number): void {
    const prefs = getPreferences();
    const newVol = Math.max(0, Math.min(1, Math.round((prefs.narrationVolume + delta) * 10) / 10));
    savePreferences({ narrationVolume: newVol });
    if (this.narrationAudio) {
      this.narrationAudio.volume = newVol;
    }
    const announcer = document.getElementById('live-announcer');
    if (announcer) {
      announcer.textContent = `Narration volume: ${Math.round(newVol * 100)}%`;
      announcer.classList.add('active');
      setTimeout(() => announcer.classList.remove('active'), 2000);
    }
  }

  private updateStatus(text: string): void {
    if (this.statusBadge) {
      this.statusBadge.textContent = text;
      if (text === 'Playing') {
        this.statusBadge.classList.add('playing');
      } else {
        this.statusBadge.classList.remove('playing');
      }
    }
  }
}
