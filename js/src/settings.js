const settings = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelDensity: window.devicePixelRatio || 1,
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
