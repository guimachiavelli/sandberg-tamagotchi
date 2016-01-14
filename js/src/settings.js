const settings = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelDensity: window.devicePixelRatio || 1,
    sephirot: {
        keter: {
            waveform: 'triangle',
            colour: 'gold',
            frequency: 493.883,
            detune: 0,
            attack: 2000,
            release: 10
        },
        chokhmah: {
            waveform: 'sine',
            colour: 'skyblue',
            frequency: 440,
            detune: 5,
            attack: 50,
            release: 20
        },
        binah: {
            waveform: 'sine',
            colour: 'crimson',
            frequency: 440,
            detune: 0,
            attack: 20,
            release: 50
        },
        chesed: {
            waveform: 'square',
            colour: 'darkviolet',
            frequency: 391.995,
            detune: 0,
            attack: 1,
            release: 25
        },
        gevurah: {
            waveform: 'sine',
            colour: 'orange',
            frequency: 391.995,
            detune: 15,
            attack: 25,
            release: 1
        },
        tiferet: {
            waveform: 'sawtooth',
            colour: 'pink',
            frequency: 349.228,
            detune: 0,
            attack: 600,
            release: 600
        },
        netzach: {
            waveform: 'sine',
            colour: 'olive',
            frequency: 329.628,
            detune: 0,
            attack: 250,
            release: 1
        },
        hod: {
            waveform: 'square',
            colour: 'purple',
            frequency: 329.628,
            detune: 50,
            attack: 800,
            release: 1
        },
        yesod: {
            waveform: 'sawtooth',
            colour: 'indigo',
            frequency: 293.665,
            detune: 0,
            attack: 1,
            release: 8
        },
        malkuth: {
            waveform: 'triangle',
            colour: 'yellow',
            frequency: 261.626,
            detune: 0,
            attack: 10,
            release: 2000
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
