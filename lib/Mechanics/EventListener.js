

class Arrangement {
    constructor(data) {
        this.id = data.id;
        this.checker = data.checker;
        this.fn = data.fn;
    }

    exe(...args) {
        if (this.checker && !this.checker(...args)) return null;
        this.fn(...args);
    }

}

class Event {
    constructor(data) {
         this.name = data.name;
         this.executable = data.executable;
         this.arrangements = [];
    }

    exe(...args) {
        if (this.arrangements.length) {
            for (let at of this.arrangements) at.exe(...args);
            this.arrangements.length = 0;
        }
        return this.executable(...args);
    }

    createArrangement(id, fn, checker) {
        this.arrangements.push(new Arrangement({id: id, fn: fn, checker: checker}));
    }

    cancelArrangement(id) {
        this.arrangements.splice(this.arrangements.findIndex(a => a.id === id), 1);
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

    at(eventName, fn, name, checker) {
        if (!this.events.has(eventName)) return;
        this.events.get(eventName).createArrangement(name, fn, checker);
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

}

module.exports = EventListener;