class PubSub {

    constructor() {
        this._topics = {};
    }

    subscribe(event, listener) {
        if (this._topics[event] === undefined) {
            this._topics[event] = [];
        }

        if (this.listenerIndexInTopic(listener, event) >= 0) {
            console.warn('cannot subscribe: event already subscribed');
            return;
        }

        this._topics[event].push(listener);
    }

    desubscribe(event, listener) {
        const listenerIndex = this.hasListenerInTopic(listener, event);

        if (listenerIndex < 0) {
            console.warn('cannot desubscribe: listener not found');
            return;
        }

        this._topics[event].splice(listenerIndex, 1);
    }

    publish(event, args = {}) {
        const listeners = this._topics[event];
        listeners.forEach(function(listener){
            listener(args);
        });
    }

    listenerIndexInTopic(listener, topic) {
        const findListener = this.findListener.bind(this, listener);

        if (this._topics[topic] === undefined) {
            return -1;
        }

        return this._topics[topic].findIndex(findListener);
    }

    findListener(listener, subscribedListener) {
        if (listener === subscribedListener) {
            return true;
        }
        return false;
    }
}

export default PubSub;
