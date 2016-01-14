class TextWindow {
    constructor(pubsub) {
        this._el = document.createElement('div');
        this._el.className = 'text-window';
        this._el.style.position = 'relative';
        this._el.style.zIndex = 10;
        this.pubsub = pubsub;
        this.subscribe();
    }

    render(context) {
        context.appendChild(this._el);
    }

    update(textString) {
        const paragraph = document.createElement('p');
        paragraph.innerHTML = textString;

        this._el.appendChild(paragraph);
    }

    subscribe() {
        this.pubsub.subscribe('text:add', this.update.bind(this));
    }

}

export default TextWindow;
