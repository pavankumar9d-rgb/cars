"use client";

class AutomotiveAudioEngine {
  private ctx: AudioContext | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private isRunning: boolean = false;

  public init() {
    if (typeof window === "undefined") return;
    if (this.ctx) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();

      // Low frequency sub-rumble oscillator (V8 engine idle pulse)
      this.osc1 = this.ctx.createOscillator();
      this.osc1.type = "sawtooth";
      this.osc1.frequency.setValueAtTime(42, this.ctx.currentTime); // 42 Hz deep bass

      // Harmonic overtone oscillator
      this.osc2 = this.ctx.createOscillator();
      this.osc2.type = "sine";
      this.osc2.frequency.setValueAtTime(84, this.ctx.currentTime);

      // Lowpass filter for smooth muffled mechanical tone
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = "lowpass";
      this.filterNode.frequency.setValueAtTime(140, this.ctx.currentTime);

      // Master gain
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.0001, this.ctx.currentTime);

      this.osc1.connect(this.filterNode);
      this.osc2.connect(this.filterNode);
      this.filterNode.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      this.osc1.start();
      this.osc2.start();
    } catch (e) {
      console.warn("Web Audio not permitted yet:", e);
    }
  }

  public setPlaying(play: boolean) {
    if (!this.ctx) this.init();
    if (!this.ctx || !this.gainNode) return;

    if (this.ctx.state === "suspended" && play) {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    if (play) {
      this.gainNode.gain.cancelScheduledValues(now);
      this.gainNode.gain.linearRampToValueAtTime(0.08, now + 0.8);
      this.isRunning = true;
    } else {
      this.gainNode.gain.cancelScheduledValues(now);
      this.gainNode.gain.linearRampToValueAtTime(0.0001, now + 0.5);
      this.isRunning = false;
    }
  }

  public updateSpeed(velocity: number) {
    if (!this.ctx || !this.osc1 || !this.osc2 || !this.filterNode) return;
    const now = this.ctx.currentTime;
    const clampedVel = Math.min(Math.max(velocity, 0), 1);
    const targetFreq = 42 + clampedVel * 60; // 42Hz to 102Hz
    this.osc1.frequency.setTargetAtTime(targetFreq, now, 0.1);
    this.osc2.frequency.setTargetAtTime(targetFreq * 2, now, 0.1);
    this.filterNode.frequency.setTargetAtTime(140 + clampedVel * 220, now, 0.1);
  }

  public getStatus(): boolean {
    return this.isRunning;
  }
}

export const audioEngine = new AutomotiveAudioEngine();
