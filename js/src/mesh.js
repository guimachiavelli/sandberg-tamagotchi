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

    updateXCoordinates(newX) {
        this.start[0] = newX;
        this.control1[0] = newX;
        this.control2[0] = newX;
        this.end[0] = newX;
    }


}

class Mesh {

    constructor(strokeWidth = 1, spacing = 0) {
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

    update() {
        if (this.queue.length < 1) {
            return;
        }

        this.processQueue();
    }

    updateQueue(action) {
        const attribute = Object.keys(action)[0],
              final = action[attribute],
              steps = 1000/60,
              increment = Math.round(Math.abs(this.strokeWidth - final)/steps);

        for (let i = 0; i < steps; i += 1) {
            const queueAction = {};
            queueAction[attribute] = increment;
            this.queue.push(queueAction);
        }
    }

    processQueue() {
        const action = this.queue.shift(),
              spacing = this.spacing;

        this.strokeWidth += action.width;

        const width = this.strokeWidth;

        this.strands.forEach(function(strand, i){
            strand.width = width;
            strand.updateXCoordinates((i * (width + spacing)) + width/2);
        });

        this.updateMeshSize();
    }

    updateMeshSize() {
        this.numberOfLines = Math.floor(settings.width * settings.pixelDensity/(this.strokeWidth + this.spacing));
        this.strands = this.strands.slice(0, this.numberOfLines);
    }

}

export default Mesh;
