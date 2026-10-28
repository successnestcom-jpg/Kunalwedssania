/**
 * Web Audio Sound Engine for Indian Wedding Ceremonies & Interactive UI
 * Handles both recorded romantic wedding tracks and procedural synthesis
 * (Shehnai, temple bells, coin scratching, wax seal, and celebratory chimes).
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private gainNode: GainNode | null = null;
  private musicInterval: any = null;
  private currentPreset: 'shehnai' | 'flute' | 'sitar' | 'romantic' | 'nadaswaram' = 'romantic';
  private audioElement: HTMLAudioElement | null = null;
  private audioTrackUrl: string = '/assets/aistudio/WhatsApp_Audio_2026-10-28_at_4.14.28_PM_60a49e95.mpeg';
  private listeners: Set<(playing: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.audioElement = new Audio(this.audioTrackUrl);
        this.audioElement.loop = true;
        this.audioElement.preload = 'auto';

        this.audioElement.addEventListener('play', () => {
          this.isPlaying = true;
          this.notifyListeners();
        });

        this.audioElement.addEventListener('pause', () => {
          this.isPlaying = false;
          this.notifyListeners();
        });

        this.audioElement.addEventListener('ended', () => {
          this.isPlaying = false;
          this.notifyListeners();
        });
      } catch (e) {
        console.warn('Audio element initialization error:', e);
      }
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.isPlaying);
      } catch (err) {
        console.error(err);
      }
    });
  }

  public subscribe(listener: (playing: boolean) => void): () => void {
    this.listeners.add(listener);
    listener(this.isPlaying);
    return () => this.listeners.delete(listener);
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setAudioTrackUrl(url: string) {
    if (url && url !== this.audioTrackUrl) {
      this.audioTrackUrl = url;
      const wasPlaying = this.isPlaying;
      if (this.audioElement) {
        this.audioElement.pause();
        this.audioElement.src = url;
        if (wasPlaying) {
          this.audioElement.play().catch(() => {});
        }
      }
    }
  }

  public setPreset(preset: 'shehnai' | 'flute' | 'sitar' | 'romantic' | 'nadaswaram') {
    this.currentPreset = preset;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public toggleMusic(): boolean {
    if (this.isPlaying) {
      this.stopWeddingMusic();
      return false;
    } else {
      this.playWeddingMusic();
      return true;
    }
  }

  public playWeddingMusic() {
    this.initCtx();

    // 1. Prioritize playing the recorded romantic Punjabi audio track
    if (this.audioElement) {
      this.audioElement
        .play()
        .then(() => {
          this.isPlaying = true;
          this.notifyListeners();
        })
        .catch((err) => {
          console.warn('Direct audio play failed, falling back to Web Audio synth:', err);
          this.playSynthWeddingMusic();
        });
      return;
    }

    this.playSynthWeddingMusic();
  }

  public stopWeddingMusic() {
    this.isPlaying = false;
    this.notifyListeners();

    if (this.audioElement) {
      this.audioElement.pause();
    }

    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }

    if (this.ctx && this.gainNode) {
      const now = this.ctx.currentTime;
      this.gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    }
  }

  // Synthesizer fallback
  private playSynthWeddingMusic() {
    if (!this.ctx || this.isPlaying) return;
    this.isPlaying = true;
    this.notifyListeners();

    const r = this.ctx.currentTime;
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.01, r);
    masterGain.gain.exponentialRampToValueAtTime(0.25, r + 2);
    masterGain.connect(this.ctx.destination);
    this.gainNode = masterGain;

    const baseFreq = this.currentPreset === 'flute' ? 174.61 : 146.83;
    [baseFreq, baseFreq * 1.5, baseFreq * 2, baseFreq * 0.75].forEach((freq, idx) => {
      if (!this.ctx || !this.gainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? 'triangle' : 'sawtooth';
      osc.frequency.setValueAtTime(freq, r);

      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.18 + idx * 0.08, r);
      lfoGain.gain.setValueAtTime(0.7, r);
      lfo.connect(osc.frequency);
      lfo.start(r);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400 + idx * 70, r);
      gain.gain.setValueAtTime(0.035 / (idx + 1), r);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.gainNode);
      osc.start(r);
    });

    const yamanScale = [293.66, 329.63, 369.99, 415.3, 440.0, 493.88, 554.37, 587.33];
    const melodyPattern = [0, 2, 4, 3, 2, 4, 5, 7, 6, 4, 2, 0, 1, 2, 4, 0, 4, 5, 7, 6, 4, 2, 0, 2];
    let noteIndex = 0;

    const playNextNote = () => {
      if (!this.isPlaying || !this.ctx || !this.gainNode) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      const noteOffset = melodyPattern[noteIndex % melodyPattern.length];
      const freq = yamanScale[noteOffset % yamanScale.length];
      noteIndex++;

      osc.type = 'sawtooth';
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq * 1.85, now);
      filter.Q.setValueAtTime(2.8, now);

      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.015, now + 0.25);
      osc.frequency.exponentialRampToValueAtTime(freq, now + 0.65);

      const duration = 1.2 + Math.random() * 0.6;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.07, now + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.gainNode);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    };

    playNextNote();
    this.musicInterval = setInterval(playNextNote, 950);
  }

  // Sound Effects
  public playScratchSound() {
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(130 + Math.random() * 70, now);
    gain.gain.setValueAtTime(0.045, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  public playCardFlipSound() {
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.18);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.38));
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(450, now + 0.15);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    source.start(now);
  }

  public playTempleBellSound() {
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [
      { f: 880, g: 0.14, decay: 2.2 },
      { f: 1760, g: 0.07, decay: 1.4 },
      { f: 2640, g: 0.035, decay: 0.8 },
      { f: 3520, g: 0.015, decay: 0.5 },
    ].forEach((tone) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(tone.f, now);
      gain.gain.setValueAtTime(tone.g, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + tone.decay);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + tone.decay);
    });
  }

  public playWaxSealSound() {
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.18);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  public playBlessingChime() {
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [587.33, 739.99, 880.0, 1174.66, 1479.98, 1760.0].forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);
      gain.gain.setValueAtTime(0.08, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 1.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 1.2);
    });
  }

  public playFireworkSound() {
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.5);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(140, now + 0.4);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    source.start(now);
  }
}

export const Sound = new SoundEngine();
