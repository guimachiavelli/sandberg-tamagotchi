import settings from './settings.js';

class Strand {
    constructor(width, start, control1, control2, end) {
        this._width = width;
        this._start = start;
        this._control1 = control1;
        this._control2 = control2;
        this._end = end;
        this.colour = this._colour();
    }

    _colour() {
        let colours = Object.keys(settings.colours);

        colours = colours.map(function(colour){
            return settings.colours[colour];
        });

        return colours[Math.floor(Math.random() * colours.length)];
    }

    draw(context) {
        context.beginPath();
        context.moveTo(...this.start);
        context.bezierCurveTo(...this.control1,
                              ...this.control2,
                              ...this.end);
        context.lineWidth = this.width;
        context.strokeStyle = this.colour;
        context.stroke();
        context.closePath();
    }

    get frequency() {
        const min = 250;
        const max = 4500;
        let frequency = this._control1[0] + this._control2[0];

        frequency = Math.min(frequency, max);
        frequency = Math.max(frequency, min);

        return frequency;
    }

    get detune() {
        return (this._control1[1] + this._control2[1]) * 10;
    }

    set width(value) {
        this._width = value;
    }

    get width() {
        return this._width;
    }

    set start(value) {
        if (value.length !== 2) {
            console.err('strand:start:set: invalid value');
        }

        this._start = value;
    }

    get start() {
        return this._start;
    }

    set control1(value) {
        if (value.length !== 2) {
            console.err('strand:control1:set: invalid value');
        }

        this._control1 = value;
    }

    get control1() {
        return this._control1;
    }

    set control2(value) {
        if (value.length !== 2) {
            console.err('strand:control2:set: invalid value');
        }

        this._control2 = value;
    }

    get control2() {
        return this._control2;
    }

    set end(value) {
        if (value.length !== 2) {
            console.err('strand:end:set: invalid value');
        }

        this._end = value;
    }

    get end() {
        return this._end;
    }

    updateXCoordinates(newX) {
        this.start[0] = newX;
        this.control2[0] = newX;
        this.end[0] = newX;
    }
}

export default Strand;
