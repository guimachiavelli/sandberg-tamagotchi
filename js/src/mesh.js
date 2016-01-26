import settings from './settings.js';
import Strand from './strand.js';

class Mesh {

    constructor(strokeWidth = 1, strands = null) {
        this.queue = [];
        this.strokeWidth = strokeWidth;
        this.numberOfLines = strands || this.maxNumberOfStrands();
        this.spacing = this.calculatedSpacing();
        this.strands = this.lines();
    }

    maxNumberOfStrands() {
        return Math.floor(
            (settings.width * settings.pixelDensity)/this.strokeWidth
        );
    }

    calculatedSpacing() {
            return  Math.floor((settings.width * settings.pixelDensity) -
                    (this.strokeWidth * this.numberOfLines))/
                    this.numberOfLines;
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
        this.processQueue();
    }

    moveGroup(command) {
        if (command.options.reverse === true) {
            command.actions[0] = command.actions[0] * -1;
            command.actions[1] = command.actions[1] * -1;
        }
        this.updateQueue(command);
    }

    updateQueue(action) {
        let increment;
        const steps = 1000/60;

        if (action.attribute === 'size') {
            increment = (action.actions - this.numberOfLines)/steps;
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
                attribute: action.attribute,
                increment: increment,
                selector: action.options.selector
            };

            this.queue.push(queueAction);
        }
    }

    processQueue() {
        if (this.queue.length < 1) {
            return;
        }

        const action = this.queue.shift();

        if (action.attribute === 'size') {
            this.updateMeshSize(action.increment);
            return;
        }

        this.updatePoint(action.attribute, action.increment, action.selector);
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

    updateMeshSize(increment) {
        if (increment === 0) {
            return;
        }

        let lines = this.numberOfLines;

        lines += increment;



    }

}

export default Mesh;
