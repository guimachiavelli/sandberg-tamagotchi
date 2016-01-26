import settings from './settings.js';

class Song {
    constructor(tama, pubsub) {
        this.muted = false;
        this.defaultVolume = 0.1;
        this.lastUpdate = {};
        this.lastIncrement = Date.now();
        this.rhythm = 800;
        //this.defaultVolume = 0;

        this.context = new settings.AudioContext();
        this.tama = tama;
        this.strands = tama.mesh.strands;
        this.oscillators = this.oscillatorsFromSephirot();


        this.pubsub = pubsub;
        this.subscribe();
    }

    subscribe() {
        this.pubsub.subscribe('action:mute', this.mute.bind(this));
        this.pubsub.subscribe('action:play', this.startPlay.bind(this));
    }

    mute() {
        this.muted = true;
    }

    startPlay() {
        this.muted = false;
        this.play(0,1,1,'sine');
    }

    oscillatorsFromSephirot() {
        const sephirot = Object.keys(settings.sephirot);

        return sephirot.map(function(sephira) {
            const oscillator = {
                name: sephira
            };

            this.lastUpdate[sephira] = Date.now();

            sephira = settings.sephirot[sephira];

            oscillator.waveform = sephira.waveform;
            oscillator.frequency = sephira.frequency;
            oscillator.detune = sephira.detune;
            oscillator.attack = sephira.attack;
            oscillator.release = sephira.release;
            oscillator.interval = sephira.interval;

            return oscillator;
        }, this);
    }

    update() {
        if (this.muted === true) {
            return;
        }

        const currentTime = Date.now(),
              aspect = this.tama.topSephira();

        this.oscillators.forEach(this.updateOscillator.bind(this,
                                                            currentTime,
                                                            aspect));
    }

    updateOscillator(currentTime, aspect, oscillator) {
        const sephira = oscillator.name,
              sephiraScore = this.tama.sephirot[sephira];

        if (sephiraScore < 30) {
            return;
        }

        if (currentTime - this.lastUpdate[sephira] < oscillator.interval) {
            return;
        }

        this.incrementAttribute(aspect, sephiraScore, oscillator);

        this.play(oscillator.frequency,
                  oscillator.attack,
                  oscillator.release,
                  oscillator.waveform,
                  Math.random());

        this.lastUpdate[sephira] = currentTime;
    }

    incrementAttribute(aspect, score, oscillator) {
        const currentTime = Date.now();

        if (currentTime - this.lastIncrement < 300) {
            return;
        }

        this.lastIncrement = currentTime;

        if (Math.random() > 0.85) {
            oscillator.interval = settings.sephirot[oscillator.name].interval;
            oscillator.attack = settings.sephirot[oscillator.name].attack;
            oscillator.release = settings.sephirot[oscillator.name].release;
            oscillator.frequency = settings.sephirot[oscillator.name].frequency;
            return;
        }

        switch (aspect) {
            case 'keter':
                oscillator.interval += score;
                oscillator.attack += score;
                oscillator.release += score;

                if (oscillator.interval > 5000) {
                    oscillator.interval = 2000;
                }
                break;
            case 'malkuth':
                oscillator.interval -= score;
                oscillator.attack -= score;
                oscillator.release -= score;

                if (oscillator.interval < 100) {
                    oscillator.interval = 5000;
                }

                if (oscillator.attack < 10) {
                    oscillator.attack = 600;
                }

                if (oscillator.release < 5) {
                    oscillator.release = 100;
                }

                break;
            case 'chokmah':
                oscillator.attack -= score;
                break;
            case 'binah':
                oscillator.attack += score;
                break;
            case 'gevurah':
                oscillator.frequency -= score/20;
                break;
            case 'chesed':
                oscillator.frequency += score/20;
                break;

        }
    }

    play(freq, attack, release, waveform, volume) {
        const osc = this.context.createOscillator(),
              envelope = this.context.createGain(),
              contextTime = this.context.currentTime;

        volume = volume || this.defaultVolume;

        envelope.gain.setValueAtTime(volume, contextTime);
        envelope.connect(this.context.destination);
        envelope.gain.setValueAtTime(0, contextTime);
        envelope.gain.setTargetAtTime(volume, contextTime, attack / 1000);

        if (release > 0) {
            envelope.gain.setTargetAtTime(0,
                                          contextTime + attack / 1000,
                                          release / 1000);

            setTimeout(function() {
                osc.stop();
                osc.disconnect(envelope);
                envelope.gain.cancelScheduledValues(contextTime);
                envelope.disconnect(this.context.destination);
            }.bind(this), attack * 10 + release * 10);
        }

        osc.frequency.setValueAtTime(freq, contextTime);
        osc.type = waveform;
        osc.connect(envelope);
        osc.start();
    }

}

export default Song;
