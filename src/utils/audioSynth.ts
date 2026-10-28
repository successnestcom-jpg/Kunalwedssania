/**
 * Web Audio Sound Engine for Indian Wedding Ceremonies & Interactive UI
 * Synthesizes auspicious Shehnai, Flute, Tanpura drone, temple bells, coin scratching, and chimes.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private gainNode: GainNode | null = null;
  private musicInterval: any = null;
  private currentPreset: 'shehnai' | 'flute' | 'sitar' | 'romantic' | 'nadaswaram' = 'shehnai';

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setPreset(preset: 'shehnai' | 'flute' | 'sitar' | 'romantic' | 'nadaswaram') {
    this.currentPreset = preset;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public toggleMusic(preset?: 'shehnai' | 'flute' | 'sitar' | 'romantic' | 'nadaswaram'): boolean {
    if (preset) this.currentPreset = preset;
    if (this.isPlaying) {
      this.stopWeddingMusic();
      return false;
    } else {
      this.playWeddingMusic();
      return true;
    }
  }

  public playWeddingMusic() {
    this.init();
    if (!this.ctx || this.isPlaying) return;
    this.isPlaying = true;

    const r = this.ctx.currentTime;
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.01, r);
    masterGain.gain.exponentialRampToValueAtTime(0.25, r + 2);
    masterGain.connect(this.ctx.destination);
    this.gainNode = masterGain;

    // 1. Auspicious Drone / Tanpura Harmonics (Root Sa = D = 146.83 Hz)
    const baseFreq = this.currentPreset === 'flute' ? 174.61 : 146.83;
    [baseFreq, baseFreq * 1.5, baseFreq * 2, baseFreq * 0.75].forEach((freq, idx) => {
      if (!this.ctx || !this.gainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? 'triangle' : 'sawtooth';
      osc.frequency.setValueAtTime(freq, r);

      // Subtle vibrato/swell for Indian classical drone
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

    // 2. Ceremonial Melody Sequence (Raag Yaman / Bilawal festive wedding phrasing)
    const yamanScale = [293.66, 329.63, 369.99, 415.3, 440.0, 493.88, 554.37, 587.33];
    // Traditional auspicious wedding raag motif: Pa Dha Ni Sa, Ga Ma Dha Ni Sa
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

      // Shehnai/Bansuri characteristics
      if (this.currentPreset === 'flute') {
        osc.type = 'sine';
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(freq * 2.2, now);
      } else {
        osc.type = 'sawtooth'; // Shehnai reed bite
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(freq * 1.85, now);
        filter.Q.setValueAtTime(2.8, now);
      }

      // Microtonal Meend (smooth pitch slide)
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.015, now + 0.25);
      osc.frequency.exponentialRampToValueAtTime(freq, now + 0.65);

      const duration = 1.2 + Math.random() * 0.6;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(this.currentPreset === 'flute' ? 0.08 : 0.07, now + 0.25);
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

  public stopWeddingMusic() {
    this.isPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.ctx && this.gainNode) {
      const now = this.ctx.currentTime;
      this.gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      setTimeout(() => {
        if (!this.isPlaying && this.ctx) {
          try {
            this.ctx.close().then(() => {
              this.ctx = null;
            });
          } catch {
            this.ctx = null;
          }
        }
      }, 900);
    }
  }

  // Tactile sound effect when scratching coin across canvas
  public playScratchSound() {
    this.init();
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

  // Crisp card flip sound
  public playCardFlipSound() {
    this.init();
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

  // Auspicious temple bell resonance
  public playTempleBellSound() {
    this.init();
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

  // Royal wax seal stamp / crack
  public playWaxSealSound() {
    this.init();
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

  // Celestial blessing chime for petal showers & reveals
  public playBlessingChime() {
    this.init();
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

  // Rajputana Royal Chime
  public playRajputanaChime() {
    this.playTempleBellSound();
    setTimeout(() => this.playBlessingChime(), 150);
  }

  // Church Chimes Sound
  public playChurchChimesSound() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);
      gain.gain.setValueAtTime(0.1, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 1.5);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 1.5);
    });
  }

  // Celebratory night fireworks burst sound
  public playFireworkSound() {
    this.init();
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
