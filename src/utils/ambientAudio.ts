// Procedural Web Audio API sound generator for peaceful rural morning sounds
class RuralAmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private breezeNode: AudioBufferSourceNode | null = null;
  private breezeGain: GainNode | null = null;
  private birdTimer: number | null = null;
  private masterGain: GainNode | null = null;

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.3;
        this.masterGain.connect(this.ctx.destination);
      }
    }
  }

  public async toggle(play?: boolean): Promise<boolean> {
    this.init();
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    const shouldPlay = play !== undefined ? play : !this.isPlaying;

    if (shouldPlay) {
      this.startBreeze();
      this.scheduleBirdChirps();
      this.isPlaying = true;
    } else {
      this.stop();
      this.isPlaying = false;
    }

    return this.isPlaying;
  }

  public setVolume(val: number) { // 0 to 1
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(val * 0.4, this.ctx.currentTime, 0.1);
    }
  }

  private startBreeze() {
    if (!this.ctx || !this.masterGain) return;
    
    // Create 5 seconds of pink noise for gentle wind
    const bufferSize = this.ctx.sampleRate * 5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.015; // Keep wind subtle
      b6 = white * 0.115926;
    }

    this.breezeNode = this.ctx.createBufferSource();
    this.breezeNode.buffer = buffer;
    this.breezeNode.loop = true;

    // Filter for soft morning breeze frequency
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    this.breezeGain = this.ctx.createGain();
    this.breezeGain.gain.value = 0.2;

    this.breezeNode.connect(filter);
    filter.connect(this.breezeGain);
    this.breezeGain.connect(this.masterGain);

    this.breezeNode.start();
  }

  private playBirdChirp() {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Randomize chirp pitch (morning birds: high melodic chirps 2500Hz - 4500Hz)
    const startFreq = 2200 + Math.random() * 2000;
    const duration = 0.08 + Math.random() * 0.12;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(startFreq * 1.3, now + duration * 0.5);
    osc.frequency.exponentialRampToValueAtTime(startFreq * 0.8, now + duration);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration);
  }

  private scheduleBirdChirps() {
    if (this.birdTimer) window.clearTimeout(this.birdTimer);

    const triggerGroup = () => {
      if (!this.isPlaying) return;
      // Play 2-4 rapid chirps
      const count = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          this.playBirdChirp();
        }, i * (100 + Math.random() * 120));
      }

      // Next bird song in 2 to 6 seconds
      const nextDelay = 2000 + Math.random() * 4000;
      this.birdTimer = window.setTimeout(triggerGroup, nextDelay);
    };

    triggerGroup();
  }

  public stop() {
    if (this.birdTimer) {
      window.clearTimeout(this.birdTimer);
      this.birdTimer = null;
    }
    if (this.breezeNode) {
      try {
        this.breezeNode.stop();
        this.breezeNode.disconnect();
      } catch (e) {}
      this.breezeNode = null;
    }
    this.isPlaying = false;
  }
}

export const ambientSound = new RuralAmbientSoundEngine();
