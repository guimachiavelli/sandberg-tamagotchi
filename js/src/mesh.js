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
        this.control2[0] = newX;
        this.end[0] = newX;
    }


}

class Mesh {

    constructor(strokeWidth = 1, spacing = 10) {
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
            let x = i * (this.strokeWidth + this.spacing) + this.strokeWidth;
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
            this.idle();
            return;
        }

        this.processQueue();
    }

    idle() {
        if (Math.random() > 0.25) {
            return;
        }

        const test = this.strands[0].control1[0];
        let action;

        action = [Math.random() * (settings.width * 2),
                  Math.random() * (settings.height * 2)];

        action = action.map(function(coord){
            const positive = Math.random() > 0.5;
            return positive === true ? coord : coord * -1;
        });

        this.updateQueue({control1: action});
    }

    updateQueue(action) {
        let final, increment;
        const attribute = Object.keys(action)[0],
              steps = 1000/60;

        if (attribute === 'width') {
            final = action[attribute];
            increment = (final - this.strokeWidth)/steps;
        } else {
            final = action[attribute];
            increment = [(final[0] - this.strands[0].control1[0])/steps,
                         (final[1] - this.strands[0].control1[1])/steps];
        }

        this.queue = [];

        for (let i = 0; i < steps; i += 1) {
            const queueAction = {};
            queueAction[attribute] = increment;
            this.queue.push(queueAction);
        }
    }

    processQueue() {
        const action = this.queue.shift();

        if (action.width) {
            this.updateWidth(action.width);
        } else {
            this.updatePoint(action.control1);
        }

        this.updateMeshSize();
    }

    updateWidth(increment) {
        const spacing = this.spacing;

        this.strokeWidth += increment;

        const width = this.strokeWidth;

        this.strands.forEach(function(strand, i){
            strand.width = width;
            strand.updateXCoordinates((i * (width + spacing)) + width/2);
        });
    }

    updatePoint(point) {
        this.strands.forEach(function(strand){
            strand.control1[0] += point[0];
            strand.control1[1] += point[1];

            strand.control2[0] += -point[1];
            strand.control2[1] += -point[0];
        });
    }

    updateMeshSize() {
        const meshSize = Math.floor((settings.width * settings.pixelDensity)/
                                    (this.strokeWidth + this.spacing)),
              difference = meshSize - this.numberOfLines;

        if (difference === 0) {
            return;
        }

        this.numberOfLines = meshSize;

        if (difference < 0) {
            this.strands = this.strands.slice(0, this.numberOfLines + 1);
        } else {
            let i = 0;
            const length = this.strands.length;
            while (i < difference) {
                let x = (length + i) * (this.strokeWidth + this.spacing) + this.strokeWidth/2;

                this.strands.push(new Strand(
                    this.strokeWidth,
                    [x, 0],
                    [x, 0],
                    [x, 0],
                    [x, settings.height * settings.pixelDensity]
                ));

                i += 1;
            }
        }



    }

}

export default Mesh;
