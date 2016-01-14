import settings from './settings.js';

class Song {
    constructor(tama, pubsub) {
        this.muted = false;
        this.defaultVolume = 0.01;
        //this.defaultVolume = 0;

        this.context = new settings.AudioContext();
        this.tama = tama;
        this.strands = tama.mesh.strands;
        //this.oscillators = this.oscillatorsFromStrands(tama.mesh.strands);
        this.oscillators = this.oscillatorsFromSephirot();

        this.gainNode = this.context.createGain();
        this.gainNode.connect(this.context.destination);

        this.gainNode.gain.value = this.defaultVolume;

        this.pubsub = pubsub;
        this.subscribe();
    }

    setup() {
        this.oscillators.forEach(function(oscillator) {
            oscillator.osc.connect(this.gainNode);
            oscillator.osc.start(0);
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

    oscillatorsFromSephirot() {
        const sephirot = Object.keys(settings.sephirot);

        return sephirot.map(function(sephira) {
            const oscillator = {
                name: sephira
            };

            sephira = settings.sephirot[sephira];

            oscillator.waveform = sephira.waveform;
            oscillator.frequency = sephira.frequency;
            oscillator.detune = sephira.detune;
            oscillator.attack = sephira.attack;
            oscillator.release = sephira.release;

            return oscillator;
        }, this);
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
            const sephira = oscillator.name,
                  sephiraScore = this.tama.sephirot[sephira] + 1;
            let increment = Math.random() > 0.5 ? sephiraScore * 1 : sephiraScore * -1;
            //oscillator.detune.value = this.strands[i].detune;

            oscillator.frequency += increment;

            this.play(oscillator.frequency,
                      oscillator.attack,
                      oscillator.release,
                      oscillator.waveform);
        }, this);

    }

    // might be useful to create a bit more ellaborate sounds
    // snatched from tones.js (https://github.com/bit101/tones/)
    play(freq, attack, release, waveform) {
        if (Math.random() < 0.94) {
            return;
        }

        const osc = this.context.createOscillator();
        const envelope = this.context.createGain();

        envelope.gain.setValueAtTime(this.defaultVolume, this.context.currentTime);
        envelope.connect(this.context.destination);
        envelope.gain.setValueAtTime(0, this.context.currentTime);
        envelope.gain.setTargetAtTime(this.defaultVolume,
                                      this.context.currentTime,
                                      attack / 1000);
        if (release) {
            envelope.gain.setTargetAtTime(0,
                             this.context.currentTime + attack / 1000,
                             release / 1000);

            setTimeout(function() {
                osc.stop();
                osc.disconnect(envelope);
                envelope.gain.cancelScheduledValues(this.context.currentTime);
                envelope.disconnect(this.context.destination);
            }.bind(this), attack * 10 + release * 10);
        }

        osc.frequency.setValueAtTime(freq, this.context.currentTime);
        osc.type = waveform;
        osc.connect(envelope);
        osc.start();
    }

}

export default Song;
