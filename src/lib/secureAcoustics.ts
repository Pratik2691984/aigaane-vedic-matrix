'use client';

// Packed 32-bit ratios: (Numerator << 16) | Denominator
const PACKED_SRUTI = new Uint32Array([
  0x00010001, 0x010000F3, 0x0010000F, 0x000A0009, 0x00090008, 0x0020001B,
  0x00060005, 0x00050004, 0x00510040, 0x00040003, 0x001B0014, 0x002D0020,
  0x02D90200, 0x00030002, 0x00800051, 0x00080005, 0x00050003, 0x001B0010,
  0x00100009, 0x00090005, 0x000F0008, 0x00F30080
]);

const LABELS = [
  'Sa', 're₁', 're₂', 'Re₃', 'Re₄', 'ga₁', 'ga₂', 'Ga₃', 'Ga₄',
  'ma₁', 'ma₂', 'Ma₃', 'Ma₄', 'Pa', 'dha₁', 'dha₂', 'Dha₃', 'Dha₄',
  'ni₁', 'ni₂', 'Ni₃', 'Ni₄'
];

class AcousticEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private droneSa: OscillatorNode | null = null;
  private dronePa: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private isDroneActive = false;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.6;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public trigger(index: number, baseFreq: number): { name: string; cents: number; freq: number } {
    this.init();
    if (!this.ctx || !this.master || index < 0 || index >= PACKED_SRUTI.length) {
      return { name: '', cents: 0, freq: 0 };
    }

    const num = PACKED_SRUTI[index] >>> 16;
    const den = PACKED_SRUTI[index] & 0xFFFF;
    const ratio = num / den;
    const freq = baseFreq * ratio;
    const cents = Math.round(1200 * Math.log2(ratio));
    const now = this.ctx.currentTime;

    const env = this.ctx.createGain();
    env.connect(this.master);
    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(0.4, now + 0.03);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq, now);

    const harm = this.ctx.createGain();
    harm.gain.value = 0.15;

    osc1.connect(env);
    osc2.connect(harm);
    harm.connect(env);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 2.5);
    osc2.stop(now + 2.5);

    return { name: LABELS[index], cents, freq };
  }

  public toggleDrone(baseFreq: number, onStateChange: (active: boolean) => void) {
    this.init();
    if (!this.ctx || !this.master) return;

    if (this.isDroneActive) {
      const now = this.ctx.currentTime;
      this.droneGain?.gain.linearRampToValueAtTime(0.0001, now + 0.4);
      setTimeout(() => {
        this.droneSa?.stop();
        this.dronePa?.stop();
        this.droneSa = null;
        this.dronePa = null;
      }, 450);
      this.isDroneActive = false;
      onStateChange(false);
    } else {
      const now = this.ctx.currentTime;
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.0001, now);
      this.droneGain.gain.linearRampToValueAtTime(0.18, now + 0.6);
      this.droneGain.connect(this.master);

      this.droneSa = this.ctx.createOscillator();
      this.droneSa.type = 'sawtooth';
      this.droneSa.frequency.setValueAtTime(baseFreq, now);

      this.dronePa = this.ctx.createOscillator();
      this.dronePa.type = 'sawtooth';
      this.dronePa.frequency.setValueAtTime(baseFreq * 1.5, now);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(baseFreq * 3.2, now);

      this.droneSa.connect(filter);
      this.dronePa.connect(filter);
      filter.connect(this.droneGain);

      this.droneSa.start(now);
      this.dronePa.start(now);
      this.isDroneActive = true;
      onStateChange(true);
    }
  }

  public updateDroneFreq(freq: number) {
    if (this.isDroneActive && this.droneSa && this.dronePa && this.ctx) {
      const now = this.ctx.currentTime;
      this.droneSa.frequency.setValueAtTime(freq, now);
      this.dronePa.frequency.setValueAtTime(freq * 1.5, now);
    }
  }

  public getLabels() {
    return LABELS;
  }
}

export const acousticEngine = new AcousticEngine();
