// Sound management for Stellar Defense
class SoundManager {
    constructor() {
        this.audioContext = null;
    }

    // Initialize audio context
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    // Play bullet sound effect
// Play bullet sound effect with stereo width
playBulletSound() {
    if (!this.audioContext) return;
    
    // Create two oscillators for stereo width
    const oscillatorL = this.audioContext.createOscillator();
    const oscillatorR = this.audioContext.createOscillator();
    const gainNodeL = this.audioContext.createGain();
    const gainNodeR = this.audioContext.createGain();
    const pannerL = this.audioContext.createStereoPanner();
    const pannerR = this.audioContext.createStereoPanner();
    
    // Connect left channel
    oscillatorL.connect(gainNodeL);
    gainNodeL.connect(pannerL);
    pannerL.connect(this.audioContext.destination);
    
    // Connect right channel
    oscillatorR.connect(gainNodeR);
    gainNodeR.connect(pannerR);
    pannerR.connect(this.audioContext.destination);
    
    // Set up oscillators
    oscillatorL.type = 'square';
    oscillatorR.type = 'square';

    const rampstart = 150;
    const rampsize= -65;
    const detune = 10;
    
    // Base frequency progression
    oscillatorL.frequency.setValueAtTime(rampstart, this.audioContext.currentTime);
    oscillatorL.frequency.linearRampToValueAtTime(rampstart+rampsize, this.audioContext.currentTime + 0.2);
    
    // Right channel slightly detuned for width
    oscillatorR.frequency.setValueAtTime(rampstart+detune, this.audioContext.currentTime);
    oscillatorR.frequency.linearRampToValueAtTime(rampstart+rampsize+detune, this.audioContext.currentTime + 0.2);
    
    // Pan to stereo positions
    pannerL.pan.setValueAtTime(-0.6, this.audioContext.currentTime); // Left
    pannerR.pan.setValueAtTime(0.6, this.audioContext.currentTime);  // Right
    
    // Set up gain envelopes
    gainNodeL.gain.setValueAtTime(0.08, this.audioContext.currentTime);
    gainNodeL.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
    
    gainNodeR.gain.setValueAtTime(0.08, this.audioContext.currentTime);
    gainNodeR.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
    
    // Start and stop both oscillators
    oscillatorL.start(this.audioContext.currentTime);
    oscillatorL.stop(this.audioContext.currentTime + 0.2);
    
    oscillatorR.start(this.audioContext.currentTime);
    oscillatorR.stop(this.audioContext.currentTime + 0.2);
}

    // Play explosion sound effect
    playExplosionSound() {
        if (!this.audioContext) return;
        
        const bufferSize = this.audioContext.sampleRate * 0.85;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const source = this.audioContext.createBufferSource();
        const lowpassFilter = this.audioContext.createBiquadFilter();
        const gainNode = this.audioContext.createGain();
        
        lowpassFilter.type = 'lowpass';
        lowpassFilter.frequency.setValueAtTime(700, this.audioContext.currentTime);
        lowpassFilter.frequency.linearRampToValueAtTime(100, this.audioContext.currentTime + 1.55);
        lowpassFilter.Q.setValueAtTime(1, this.audioContext.currentTime);
        
        source.buffer = buffer;
        source.connect(lowpassFilter);
        lowpassFilter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.55);
        
        source.start(this.audioContext.currentTime);
    }

    // Play enemy spawn sound effect
    playSpawnSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        // Set up oscillator
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime); // Start high
        oscillator.frequency.linearRampToValueAtTime(400, this.audioContext.currentTime + 0.15); // Ramp down quickly
        
        // Set up gain envelope
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
        
        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Start and stop
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.15);
    }

    // Play enemy bullet sound effect (lower pitched, more threatening)
    playEnemyBulletSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(80, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(40, this.audioContext.currentTime + 0.15);
        
        gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.15);
    }
}

// Create global sound manager instance
const soundManager = new SoundManager(); 
