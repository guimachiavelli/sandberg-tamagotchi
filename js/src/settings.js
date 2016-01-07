const settings = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelDensity: window.devicePixelRatio || 1,
    colours: [
        'gold',
        'skyblue',
        'crimson',
        'darkviolet',
        'orange',
        'pink',
        'olive',
        'purple',
        'indigo',
        'yellow'
    ],
    AudioContext: window.AudioContext || window.webkitAudioContext

};

Object.freeze(settings);

export default settings;
