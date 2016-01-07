import settings from './settings.js';

class Song {
    constructor(tama, pubsub) {
        this.muted = false;
        this.defaultVolume = 0.1;

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
            oscillator.type = Math.random() > 0.5 ? 'triangle' : 'sine';
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

}

export default Song;
