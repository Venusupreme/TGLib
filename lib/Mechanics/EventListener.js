


class Event {
    constructor(data) {
         this.name = data.name;
         this.executable = data.executable;
    }

    exe(...args) {
        return this.executable(...args);
    }

    extendBefore(fn) {
        this.executable = function(...args) {
            fn(...args);
            this.executable(...args);
        }
    }

    extendAfter(fn) {
        this.executable = function(...args) {
            this.executable(...args);
            fn(...args);
        } 
    }

}

class EventListener {
    constructor() {
        this.events = new Map();
    }

    on(eventName, fn) {
        this.events.set(eventName, new Event({executable: fn, name: eventName}));
    }

    emit(eventName, ...args) {
        if (!this.events.has(eventName)) return;
        return this.events.get(eventName).exe(...args);
    }

    clear() {
        this.events.clear();
    }
 
    off(eventName) {
        this.events.delete(eventName);
    }

    get(event) {
        return this.events.get(event);
    }

    extendAll(when, fn) {
        if (when === "before") when = "extendBefore";
        else when = "extendAfter";
        for (let [, event] of this.events) {
              event[when](fn);
        }
    }

}

module.exports = EventListener;