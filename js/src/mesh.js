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
        const colours = settings.colours;
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

        let action;

        action = [Math.random() * (settings.width),
                  Math.random() * (settings.height)];

        action = action.map(function(coord){
            const positive = Math.random() > 0.5;
            return positive === true ? 16 : -16;
        });

        const colour = (function() {
            const colours = settings.colours;
            return colours[Math.floor(Math.random() * colours.length)];
        }());

        const attr = (function(){
            if (Math.random() < 0.45) {
                return 'control1';
            } else if (Math.random() < 0.85) {
                return 'control2';
            } else if (Math.random() < 0.95) {
                return 'end';
            }

            return 'start';
        }());

        this.updateQueue({
            attribute: attr,
            actions: action,
            options: {
                selector: [colour],
                cancel: true
            }
        });
    }

    updateQueue(action) {
        let endPoint, increment;
        const steps = 1000/60;

        if (action.attribute === 'width') {
            increment = (endPoint - this.strokeWidth)/steps;
        } else {
            increment = this.strands.map(function(strand){
                let x, y;

                if (action.options.absolute === true) {
                    x = (action.actions[0] - strand.control1[0])/steps;
                    y = (action.actions[1] - strand.control1[1])/steps;
                } else {
                    x = action.actions[0]/steps;
                    y = action.actions[1]/steps;
                }

                return [x, y];
            });
        }

        if (action.options.cancel === true) {
            this.queue = [];
        }

        for (let i = 0; i < steps; i += 1) {
            const queueAction = {
                point: action.attribute,
                increment: increment,
                selector: action.options.selector
            };

            this.queue.push(queueAction);
        }
    }

    processQueue() {
        const action = this.queue.shift();

        this.updatePoint(action.point, action.increment, action.selector);

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

    updatePoint(point, increments, selector = []) {
        increments.forEach(function(strandPoint, i) {
            const strand = this.strands[i];

            if (selector.indexOf(strand.colour) === -1) {
                return;
            }

            strand[point][0] += strandPoint[0];
            strand[point][1] += strandPoint[1];
        }, this);
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
