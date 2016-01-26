class Button {
    constructor(name, action) {
        this.el = document.createElement('button');
        this.el.innerHTML = name;
        this.el.type = 'button';
        this.el.dataset.action = action;
    }
}

class Interface {
    constructor(pubsub) {
        this.interface = this.container();
        this.mercyButton = new Button('Be merciful', 'merciful');
        this.sweetButton = new Button('Sweeten all severities', 'sweeten');
        this.communeButton = new Button('Commune with the Unending', 'commune');
        this.punishButton = new Button('Punish the wicked', 'punish');
        this.kindnessButton = new Button('Be kind', 'kind');
        this.balanceButton = new Button('Seek balance in creation', 'balance');
        this.submissionButton = new Button('Submit to the obstacle', 'submission');
        this.patienceButton = new Button('Be patient', 'patience');
        this.penetrateButton = new Button('Penetrate the creation', 'penetrate');
        this.filterButton = new Button('Filter the cosmos', 'filter');
        this.addButtonToContainer(this.penetrateButton);
        this.addButtonToContainer(this.mercyButton);
        this.addButtonToContainer(this.sweetButton);
        this.addButtonToContainer(this.communeButton);
        this.addButtonToContainer(this.punishButton);
        this.addButtonToContainer(this.kindnessButton);
        this.addButtonToContainer(this.submissionButton);
        this.addButtonToContainer(this.patienceButton);
        this.addButtonToContainer(this.filterButton);
        this.addButtonToContainer(this.balanceButton);

        this.muteButton = new Button('Mute', 'mute');
        this.playButton = new Button('Play', 'play');
        this.addButtonToContainer(this.muteButton);
        this.addButtonToContainer(this.playButton);

        this.pubsub = pubsub;

        this.bind();
    }

    bind() {
        this.interface.addEventListener('click', this.onClick.bind(this));
    }

    container() {
        const el = document.createElement('div');
        el.className = 'interface';
        el.style.position = 'relative';
        el.style.zIndex = 1;

        return el;
    }

    addButtonToContainer(button) {
        this.interface.appendChild(button.el);
    }

    render() {
        document.body.appendChild(this.interface);
    }

    onClick(e) {
        const target = e.target;

        if (target.nodeName !== 'BUTTON') {
            return;
        }

        this.pubsub.publish('action:' + target.dataset.action);
    }
}

export default Interface;
