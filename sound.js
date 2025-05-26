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
    
    // Create reverb impulse response if it doesn't exist
    if (!this.reverbBuffer) {
        this.reverbBuffer = this.createReverbImpulse(0.3, 0.02); // 0.3s decay, 0.02 decay factor
    }
    
    // Create two oscillators for stereo width
    const oscillatorL = this.audioContext.createOscillator();
    const oscillatorR = this.audioContext.createOscillator();
    const gainNodeL = this.audioContext.createGain();
    const gainNodeR = this.audioContext.createGain();
    const pannerL = this.audioContext.createStereoPanner();
    const pannerR = this.audioContext.createStereoPanner();
    
    // Create reverb
    const convolver = this.audioContext.createConvolver();
    const reverbGain = this.audioContext.createGain();
    const dryGain = this.audioContext.createGain();
    const outputGain = this.audioContext.createGain();
    
    convolver.buffer = this.reverbBuffer;
    reverbGain.gain.setValueAtTime(0.25, this.audioContext.currentTime); // Light reverb
    dryGain.gain.setValueAtTime(0.75, this.audioContext.currentTime);   // Mostly dry
    
    // Connect left channel
    oscillatorL.connect(gainNodeL);
    gainNodeL.connect(pannerL);
    
    // Connect right channel
    oscillatorR.connect(gainNodeR);
    gainNodeR.connect(pannerR);
    
    // Mix panners to output and reverb
    pannerL.connect(dryGain);
    pannerR.connect(dryGain);
    pannerL.connect(convolver);
    pannerR.connect(convolver);
    
    // Connect reverb and dry signals to output
    convolver.connect(reverbGain);
    dryGain.connect(outputGain);
    reverbGain.connect(outputGain);
    outputGain.connect(this.audioContext.destination);
    
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
    
    // Narrower random base position, then space channels apart
    const basePan = (Math.random() * 0.8 - 0.4); // Range from -0.4 to 0.4
    const spacing = 0.2; // Distance between channels
    
    const panL = basePan - spacing;
    const panR = basePan + spacing;
    
    pannerL.pan.setValueAtTime(panL, this.audioContext.currentTime);
    pannerR.pan.setValueAtTime(panR, this.audioContext.currentTime);
    
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

// Helper method to create reverb impulse response
createReverbImpulse(duration, decay) {
    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const impulse = this.audioContext.createBuffer(2, length, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
        const channelData = impulse.getChannelData(channel);
        for (let i = 0; i < length; i++) {
            const envelope = Math.pow(1 - i / length, decay);
            channelData[i] = (Math.random() * 2 - 1) * envelope;
        }
    }
    
    return impulse;
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
    
    // Sound parameters - easy to adjust
    const params = {
        waveType: 'sawtooth',
        startFreq: 70,
        endFreq: 25,
        startVolume: 0.15,
        endVolume: 0.005,
        duration: 0.45,
        rampDuration: 0.45
    };
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    // Apply parameters
    oscillator.type = params.waveType;
    oscillator.frequency.setValueAtTime(params.startFreq, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(params.endFreq, this.audioContext.currentTime + params.rampDuration);
    
    gainNode.gain.setValueAtTime(params.startVolume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(params.endVolume, this.audioContext.currentTime + params.rampDuration);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + params.duration);
}
}

// Create global sound manager instance
const soundManager = new SoundManager(); 
