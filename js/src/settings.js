const settings = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelDensity: window.devicePixelRatio || 1,
    sephirot: {
        keter: {
            waveform: 'sine',
            colour: 'gold',
            frequency: 493.883,
            detune: 0,
            attack: 2000,
            release: 50,
            interval: 2000
        },
        chokhmah: {
            waveform: 'sine',
            colour: 'skyblue',
            frequency: 436,
            detune: 5,
            attack: 50,
            release: 20,
            interval: 500
        },
        binah: {
            waveform: 'sine',
            colour: 'crimson',
            frequency: 440,
            detune: 0,
            attack: 20,
            release: 50,
            interval: 500
        },
        chesed: {
            waveform: 'triangle',
            colour: 'darkviolet',
            frequency: 391.995,
            detune: 0,
            attack: 1,
            release: 1,
            interval: 5000
        },
        gevurah: {
            waveform: 'sine',
            colour: 'orange',
            frequency: 391.995,
            detune: 15,
            attack: 25,
            release: 1,
            interval: 5000
        },
        tiferet: {
            waveform: 'sine',
            colour: 'pink',
            frequency: 349.228,
            detune: 0,
            attack: 60,
            release: 60,
            interval: 5000
        },
        netzach: {
            waveform: 'sine',
            colour: 'olive',
            frequency: 329.628,
            detune: 0,
            attack: 25,
            release: 10,
            interval: 5000
        },
        hod: {
            waveform: 'sine',
            colour: 'purple',
            frequency: 329.628,
            detune: 50,
            attack: 70,
            release: 1,
            interval: 5000
        },
        yesod: {
            waveform: 'sine',
            colour: 'indigo',
            frequency: 293.665,
            detune: 0,
            attack: 1,
            release: 8,
            interval: 1500
        },
        malkuth: {
            waveform: 'triangle',
            colour: 'yellow',
            frequency: 110,
            detune: 0,
            attack: 10,
            release: 2000,
            interval: 1000
        }
    },
    colours: {
        keter: 'gold',
        chokhmah: 'skyblue',
        binah: 'crimson',
        chesed: 'darkviolet',
        gevurah: 'orange',
        tiferet: 'pink',
        netzach: 'olive',
        hod: 'purple',
        yesod: 'indigo',
        malkuth: 'yellow'
    },
    AudioContext: window.AudioContext || window.webkitAudioContext

};

Object.freeze(settings);

export default settings;
