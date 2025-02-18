export class TimerAudio {
  private static instance: TimerAudio;
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private loopTimeout: number | null = null;
  private beepInterval: number | null = null;

  private constructor() {}

  static getInstance(): TimerAudio {
    if (!TimerAudio.instance) {
      TimerAudio.instance = new TimerAudio();
    }
    return TimerAudio.instance;
  }

  private async initializeAudioContext(): Promise<void> {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }

    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }
  }

  async play(): Promise<void> {
    try {
      await this.initializeAudioContext();

      if (!this.audioContext) {
        throw new Error("AudioContext not initialized");
      }

      this.oscillator = this.audioContext.createOscillator();
      this.gainNode = this.audioContext.createGain();

      this.oscillator.type = "sine";
      this.oscillator.frequency.setValueAtTime(
        880,
        this.audioContext.currentTime
      );

      this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      this.gainNode.gain.linearRampToValueAtTime(
        0.5,
        this.audioContext.currentTime + 0.01
      );
      this.gainNode.gain.linearRampToValueAtTime(
        0,
        this.audioContext.currentTime + 0.5
      );

      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);

      this.oscillator.start(this.audioContext.currentTime);
      this.oscillator.stop(this.audioContext.currentTime + 0.5);

      setTimeout(() => {
        this.cleanup();
      }, 500);
    } catch (error) {
      console.error("Failed to play audio:", error);
    }
  }

  async playFor5Seconds(): Promise<void> {
    this.stop();

    try {
      await this.play();

      let count = 1;
      this.beepInterval = window.setInterval(async () => {
        await this.play();
        count++;

        if (count >= 6) {
          this.stop();
        }
      }, 800);

      this.loopTimeout = window.setTimeout(() => {
        this.stop();
      }, 5000);
    } catch (error) {
      console.error("Failed to play audio for 5 seconds:", error);
    }
  }

  stop(): void {
    if (this.loopTimeout !== null) {
      window.clearTimeout(this.loopTimeout);
      this.loopTimeout = null;
    }

    if (this.beepInterval !== null) {
      window.clearInterval(this.beepInterval);
      this.beepInterval = null;
    }

    this.cleanup();
    if (this.audioContext) {
      this.audioContext
        .suspend()
        .catch((err) => console.error("Failed to suspend AudioContext:", err));
    }
  }

  private cleanup(): void {
    if (this.oscillator) {
      try {
        this.oscillator.stop();
        this.oscillator.disconnect();
        this.oscillator = null;
      } catch (error) {
        console.error("Error oscillator stop:", error);
      }
    }

    if (this.gainNode) {
      try {
        this.gainNode.disconnect();
        this.gainNode = null;
      } catch (error) {
        console.error("Error disconnecting gain node:", error);
      }
    }
  }
}
