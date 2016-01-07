import settings from './settings.js';

class Song {
    constructor(tama, pubsub) {
        this.muted = false;
        this.defaultVolume = 0.01;
        //this.defaultVolume = 0;

        this.context = new settings.AudioContext();
        this.strands = tama.mesh.strands;
        this.oscillators = this.oscillatorsFromStrands(tama.mesh.strands);

        this.gainNode = this.context.createGain();
        this.gainNode.connect(this.context.destination);

        this.gainNode.gain.value = this.defaultVolume;

        this.pubsub = pubsub;
        this.subscribe();
    }

    setup() {
        this.oscillators.forEach(function(oscillator) {
            oscillator.connect(this.gainNode);
            oscillator.start(0);
        }, this);
    }

    subscribe() {
        this.pubsub.subscribe('action:mute', this.mute.bind(this));
    }

    mute() {
        const volume = this.defaultVolume;
        this.gainNode.gain.value = this.muted === false ? 0 : volume;
        this.muted = this.muted === false;
    }

    oscillatorsFromStrands(strands) {
        return strands.map(function(strand){
            const oscillator = this.context.createOscillator();
            oscillator.type = Math.random() > 0.5 ? 'sawtooth' : 'sine';
            oscillator.frequency.value = strand.control1[0];
            oscillator.detune.value = strand.control1[1];
            return oscillator;
        }, this);
    }

    update() {
        this.oscillators.forEach(function(oscillator, i){
            oscillator.detune.value = this.strands[i].detune;
            oscillator.frequency.value = this.strands[i].frequency;
        }, this);

    }

    // might be useful to create a bit more ellaborate sounds
    // snatched from tones.js (https://github.com/bit101/tones/)
    play(freq) {
        this.attack = this.attack || 1;
        this.release = this.release || 1;
        var envelope = this.context.createGain();
        envelope.gain.setValueAtTime(this.volume, this.context.currentTime);
        envelope.connect(this.context.destination);

        envelope.gain.setValueAtTime(0, this.context.currentTime);
        envelope.gain.setTargetAtTime(this.volume, this.context.currentTime, this.attack / 1000);
        if(this.release) {
            envelope.gain.setTargetAtTime(0, this.context.currentTime + this.attack / 1000, this.release / 1000);
            setTimeout(function() {
                osc.stop();
                osc.disconnect(envelope);
                envelope.gain.cancelScheduledValues(tones.context.currentTime);
                envelope.disconnect(tones.context.destination);

            }, this.attack * 10 + this.release * 10);
        }

        var osc = this.context.createOscillator();
        osc.frequency.setValueAtTime(freq, this.context.currentTime);
        osc.type = this.type;
        osc.connect(envelope);
        osc.start();
    }

}

export default Song;
