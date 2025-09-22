// Audio generator utility for creating ambient sounds
export class AudioGenerator {
  private audioContext: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  // Generate a simple ambient tone
  generateAmbientTone(frequency: number = 220, duration: number = 30, volume: number = 0.1) {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Generate white noise
  generateWhiteNoise(duration: number = 30, volume: number = 0.1) {
    if (!this.audioContext) return;

    const bufferSize = this.audioContext.sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    
    whiteNoise.buffer = buffer;
    whiteNoise.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    
    whiteNoise.start(this.audioContext.currentTime);
    whiteNoise.stop(this.audioContext.currentTime + duration);
  }

  // Generate nature-like sounds
  generateNatureSound(type: 'rain' | 'ocean' | 'forest' | 'wind', duration: number = 30, volume: number = 0.1) {
    if (!this.audioContext) return;

    switch (type) {
      case 'rain':
        this.generateRainSound(duration, volume);
        break;
      case 'ocean':
        this.generateOceanSound(duration, volume);
        break;
      case 'forest':
        this.generateForestSound(duration, volume);
        break;
      case 'wind':
        this.generateWindSound(duration, volume);
        break;
    }
  }

  private generateRainSound(duration: number, volume: number) {
    // Create multiple oscillators for rain effect
    for (let i = 0; i < 5; i++) {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);
      
      oscillator.frequency.setValueAtTime(200 + Math.random() * 100, this.audioContext!.currentTime);
      oscillator.type = 'sawtooth';
      
      gainNode.gain.setValueAtTime(volume * 0.2, this.audioContext!.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + duration);
      
      oscillator.start(this.audioContext!.currentTime + i * 0.1);
      oscillator.stop(this.audioContext!.currentTime + duration);
    }
  }

  private generateOceanSound(duration: number, volume: number) {
    // Create wave-like sound
    const oscillator = this.audioContext!.createOscillator();
    const gainNode = this.audioContext!.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext!.destination);
    
    oscillator.frequency.setValueAtTime(60, this.audioContext!.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(volume, this.audioContext!.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + duration);
    
    oscillator.start(this.audioContext!.currentTime);
    oscillator.stop(this.audioContext!.currentTime + duration);
  }

  private generateForestSound(duration: number, volume: number) {
    // Create bird-like chirping sounds
    for (let i = 0; i < 10; i++) {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);
      
      oscillator.frequency.setValueAtTime(800 + Math.random() * 400, this.audioContext!.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(volume * 0.3, this.audioContext!.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + 2);
      
      oscillator.start(this.audioContext!.currentTime + i * 3);
      oscillator.stop(this.audioContext!.currentTime + 2);
    }
  }

  private generateWindSound(duration: number, volume: number) {
    // Create wind-like sound using noise
    this.generateWhiteNoise(duration, volume * 0.5);
  }
}

