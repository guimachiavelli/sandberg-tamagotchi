import settings from './settings.js';

class Strand {
    constructor() {
        this.x1 = this.randomValue(2);
        this.y1 = this.randomValue(2);

        this.control1x = this.randomValue(2);
        this.control1y = this.randomValue(2);

        this.control2x = this.randomValue(2);
        this.control2y = this.randomValue(2);

        this.x2 = this.randomValue(200);
        this.y2 = this.randomValue(200);

        this.colour = this.randomColour();
    }

    update() {
        this.control1x += this.randomValue();
        this.control2x += this.randomValue();
        this.control1y += this.randomValue();
        this.control2y += this.randomValue();

        this.x2 += this.randomValue();
        this.y2 += this.randomValue();

        if (this.isAtBoundary(this.x2, 'width') === true) {
            this.x2 = this.randomValue();
        }

        if (this.isAtBoundary(this.y2, 'height') === true) {
            this.y2 = this.randomValue();
        }

    }

    isAtBoundary(value, dimension) {
        if (dimension !== 'width' && dimension !== 'height') {
            console.warn('strand:boundary: invalid dimension');
            return false;
        }

        return value >= settings[dimension] || value <= 0;
    }

    startingPoint() {
        return [this.x1, this.y1];
    }

    bezierPoints() {
        return [
            this.control1x, this.control1y,
            this.control2x, this.control2y,
            this.x2, this.y2
        ];
    }

    randomValue(max = 2) {
        const value = Math.random() * max,
              direction = Math.random() > 0.45 ? 1 : -1;

        return Math.round(value * direction);
    }

    randomColour() {
        const r = Math.abs(this.randomValue(255)),
              g = Math.abs(this.randomValue(255)),
              b = Math.abs(this.randomValue(255));

        return `rgb(${r},${g},${b})`;
    }

}

class Tama {
    constructor(pubsub) {
        this.age = 0;
        this.lastFeed = 0;
        this.unhealthy = 0;
        this.size = 1;

        this.pubsub = pubsub;
        this.subscribe();

        this.strands = [new Strand()];
    }

    subscribe() {
        this.pubsub.subscribe('action:feed', this.feed.bind(this));
    }

    update() {
        this.age += 1;

        if (this._unhealthy > 5) {
            this.die();
            return;
        }

        this.strands.forEach(function(strand){ strand.update(); });
    }

    draw(context) {
        for(let i = 0; i < this.strands.length; i += 1) {
            let strand = this.strands[i];

            context.beginPath();
            context.moveTo(...strand.startingPoint());
            context.bezierCurveTo(...strand.bezierPoints());
            context.strokeStyle = strand.colour;
            context.stroke();
        }
    }

    fillColor() {
        return `rgb(${this.unhealthy * 10}, 50, 155)`;
    }

    feed() {
        const currentTime = Date.now();

        if (currentTime - this.lastFeed < 500) {
            this.unhealthy += 1;
        }

        this.size += 1;
        this.strands.push(new Strand());

        this.lastFeed = currentTime;
        this.write('I am fed.');

        console.log(`unhealthy: ${this.unhealthy}`);

    }

    write(string) {
        if (!string) {
            return;
        }

        this.pubsub.publish('text:add', string);
    }

    die() {
        this.write('I have died');
        this.pubsub.publish('action:die');
    }


}

export default Tama;
