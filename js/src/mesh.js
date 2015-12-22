import settings from './settings.js';

const colours = [
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
];

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



}

class Mesh {

    constructor(strokeWidth = 1, spacing = 20) {
        this.queue = [];
        this.strokeWidth = strokeWidth;
        this.spacing = spacing;
        this.numberOfLines = Math.floor(settings.width * settings.pixelDensity/(strokeWidth + spacing));
        this.strands = this.lines();
    }

    lines() {
        const amount = this.numberOfLines;
        let strands = [];
        let i = 0;

        while (i < amount) {
            let x = i * (this.strokeWidth + this.spacing);
            strands.push(new Strand(
                this.strokeWidth,
                [x, 0],
                [x, 0],
                [x, 0],
                [x, settings.height * settings.pixelDensity]
            ));
            i += 1;
        }

        return strands;
    }

    draw(context) {
        this.strands.forEach(function(strand){ strand.draw(context); });
    }

    update(options) {
        if (options) {
            const final = 20,
                  steps = 1000/60;

            for (let i = 0; i < steps; i += 1) {
                this.queue.push({
                    width: this.strands.map(function(strand) {
                            let interpolatedValue = Math.abs(strand.width - final);
                            return Math.round(interpolatedValue/steps);
                        })
                });
            }
        }

        if (this.queue.length < 1) {
            return;
        }

        this.processQueue();
    }

    processQueue() {
        const action = this.queue.shift(),
              self = this;

        action.width.forEach(function(act, i){
            const strand = self.strands[i];
            if (strand === undefined) {
                return;
            }

            strand.width += act;
            self.strokeWidth = strand.width;

            const newX = (i * ((strand.width) + self.spacing)) + strand.width/2;

            strand.start = [newX, strand.start[1]];
            strand.control1 = [newX, 0];
            strand.control2 = [newX, 0];
            strand.end = [newX, strand.end[1]];
        });

        self.numberOfLines = Math.floor(settings.width * settings.pixelDensity/(this.strokeWidth + this.spacing));

        self.strands = self.strands.slice(0, self.numberOfLines);



    }

}

export default Mesh;
