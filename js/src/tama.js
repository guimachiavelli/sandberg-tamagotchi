import settings from './settings.js';
import Mesh from './mesh.js';

class Tama {
    constructor(pubsub) {
        this.latestAction = Date.now();
        this.age = 0;
        this.lastFeed = 0;
        this.unhealthy = 0;
        this.size = 5;

        this.pubsub = pubsub;
        this.subscribe();

        this.mesh = new Mesh(1);

        this.sephirot = {
            keter: this.randomStartValue(),
            chokhmah: this.randomStartValue(),
            binah: this.randomStartValue(),
            chesed: this.randomStartValue(),
            gevurah: this.randomStartValue(),
            tiferet: this.randomStartValue(),
            netzach: this.randomStartValue(),
            hod: this.randomStartValue(),
            yesod: this.randomStartValue(),
            malkuth: this.randomStartValue()
        };
    }

    randomStartValue() {
        return Math.floor(Math.random() * 50) + 10;
    }

    topSephira() {
        let top = {
            name: null,
            value: 0
        };

        for (let sephira in this.sephirot) {
            if (this.sephirot.hasOwnProperty(sephira) !== true) {
                continue;
            }

            if (this.sephirot[sephira] <= top.value) {
                continue;
            }

            top.name = sephira;
            top.value = this.sephirot[sephira];
        }

        return top.name;
    }

    subscribe() {
        this.pubsub.subscribe('action:penetrate', this.penetrate.bind(this));
        this.pubsub.subscribe('action:merciful', this.merciful.bind(this));
        this.pubsub.subscribe('action:sweeten', this.sweeten.bind(this));
        this.pubsub.subscribe('action:commune', this.commune.bind(this));
        this.pubsub.subscribe('action:punish', this.punish.bind(this));
        this.pubsub.subscribe('action:kind', this.kind.bind(this));
        this.pubsub.subscribe('action:balance', this.balance.bind(this));
        this.pubsub.subscribe('action:submission', this.submission.bind(this));
        this.pubsub.subscribe('action:patience', this.patience.bind(this));
        this.pubsub.subscribe('action:filter', this.filter.bind(this));
    }

    randomSephirot() {
        const sephirotNames = Object.keys(this.sephirot);
        return sephirotNames[Math.floor(Math.random() * sephirotNames.length)];
    }

    update() {
        const currentTime = Date.now();

        this.age += 1;

        if (this._unhealthy > 5) {
            this.die();
            return;
        }

        if (currentTime - this.latestAction > 2000) {
            this.idle(this.randomSephirot());
        }

        this.mesh.update();
    }

    draw(context) {
        this.mesh.draw(context);
    }

    merciful() {
        //keter
        const revert = Math.random() > 0.5;

        this.sephirot.keter += 10;
        this.sephirot.malkuth -= 5;

        this.mesh.moveGroup({
            attribute: 'control1',
            actions: [-200, 160],
            options: {
                cancel: true,
                selector: [settings.sephirot.keter.colour],
            }
        });

        this.mesh.moveGroup({
            attribute: 'control2',
            actions: [50, -300],
            options: {
                selector: [settings.sephirot.keter.colour],
                reverse: revert
            }
        });

        this.latestAction = Date.now();
    }

    sweeten() {
        //Binah
        const revert = Math.random() > 0.5;

        this.sephirot.binah += 10;
        this.sephirot.chokhmah -= 10;

        this.mesh.moveGroup({
            attribute: 'control2',
            actions: [500, 160],
            options: {
                selector: [settings.sephirot.binah.colour],
                reverse: revert
            }
        });

        this.mesh.moveGroup({
            attribute: 'end',
            actions: [-500, -60],
            options: {
                selector: [settings.sephirot.binah.colour],
                reverse: revert
            }
        });

        this.latestAction = Date.now();
    }

    commune() {
        //Chokmah
        const revert = Math.random() > 0.5;

        this.sephirot.chokhmah += 10;
        this.sephirot.binah -= 10;

        this.mesh.moveGroup({
            attribute: 'control2',
            actions: [200, 160],
            options: {
                selector: [settings.sephirot.chokhmah.colour],
                reverse: revert
            }
        });

        this.mesh.moveGroup({
            attribute: 'control2',
            actions: [200, -1600],
            options: {
                selector: [settings.sephirot.chokhmah.colour],
                reverse: revert
            }
        });


        this.latestAction = Date.now();
    }

    punish() {
        const revert = Math.random() > 0.5;

        this.sephirot.gevurah += 10;
        this.sephirot.chesed -= 10;

        this.mesh.moveGroup({
            attribute: 'control2',
            actions: [200, 160],
            options: {
                selector: [settings.sephirot.gevurah.colour],
                reverse: revert
            }
        });

        this.mesh.moveGroup({
            attribute: 'start',
            actions: [600, 1.6],
            options: {
                selector: [settings.sephirot.gevurah.colour],
                reverse: revert
            }
        });

        this.latestAction = Date.now();
    }

    kind() {
        const revert = Math.random() > 0.5;

        this.sephirot.chesed += 10;
        this.sephirot.gevurah -= 10;

        this.mesh.moveGroup({
            attribute: 'control2',
            actions: [200, 160],
            options: {
                selector: [settings.sephirot.chesed.colour],
                reverse: revert
            }
        });

        this.mesh.moveGroup({
            attribute: 'control1',
            actions: [-200, 260],
            options: {
                selector: [settings.sephirot.chesed.colour],
                reverse: revert
            }
        });

        this.latestAction = Date.now();
    }

    balance() {
        const revert = Math.random() > 0.5;

        this.sephirot.tiferet += 10;
        this.sephirot.gevurah -= 5;
        this.sephirot.chesed -= 5;
        this.sephirot.hod -= 5;
        this.sephirot.netzach -= 5;

        this.mesh.moveGroup({
            attribute: 'control1',
            actions: [10, 160],
            options: {
                selector: [settings.sephirot.tiferet.colour],
                reverse: revert
            }
        });

        this.mesh.moveGroup({
            attribute: 'control1',
            actions: [10, 160],
            options: {
                selector: [settings.sephirot.tiferet.colour],
            }
        });

        this.mesh.moveGroup({
            attribute: 'control2',
            actions: [16, 16],
            options: {
                selector: [settings.sephirot.tiferet.colour],
            }
        });

        this.latestAction = Date.now();
    }

    submission() {
        const revert = Math.random() > 0.5;

        this.sephirot.hod += 10;
        this.sephirot.netzach -= 10;

        this.mesh.moveGroup({
            attribute: 'end',
            actions: [10, 160],
            options: {
                selector: [settings.sephirot.hod.colour],
                reverse: revert
            }
        });

        this.mesh.moveGroup({
            attribute: 'end',
            actions: [Math.random() * 160, Math.random() * 260],
            options: {
                selector: [settings.sephirot.hod.colour],
                reverse: revert
            }
        });

        this.latestAction = Date.now();
    }

    patience() {
        const revert = Math.random() > 0.5;

        this.sephirot.netzach += 10;
        this.sephirot.hod -= 10;

        this.mesh.moveGroup({
            attribute: 'start',
            actions: [410, 10],
            options: {
                selector: [settings.sephirot.netzach.colour],
                reverse: revert
            }
        });

        this.mesh.moveGroup({
            attribute: 'control2',
            actions: [100, -10],
            options: {
                selector: [settings.sephirot.netzach.colour],
            }
        });

        this.latestAction = Date.now();
    }

    penetrate() {
        const revert = Math.random() > 0.5;

        this.sephirot.yesod += 10;
        this.sephirot.hod -= 10;
        this.sephirot.netzach -= 10;
        this.sephirot.malkuth -= 10;

        this.mesh.moveGroup({
            attribute: 'control2',
            actions: [150, 1300],
            options: {
                selector: [settings.sephirot.yesod.colour],
                cancel: true,
                reverse: revert
            }
        });

        this.latestAction = Date.now();
    }

    filter() {
        this.sephirot.malkuth += 10;

        this.mesh.moveGroup({
            attribute: 'control2',
            actions: [150, 300],
            options: {
                selector: [settings.sephirot.malkuth.colour],
                cancel: true
            }
        });

        this.latestAction = Date.now();
    }


    idle(sephirot) {
        const positive = Math.random() > 0.5,
              attr = Math.random() > 0.5 ? 'control1' : 'control2',
              action = positive === true ? 32 : -32,
              sephira = this.randomSephirot();

        this.sephirot[sephira] += Math.random() > 0.5 ? 10 : -10;

        this.mesh.moveGroup({
            attribute: attr,
            actions: [action, action],
            options: {
                selector: [settings.colours[sephirot]]
            }
        });

        this.latestAction = Date.now();
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
