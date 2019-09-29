

const Unit = require("../DataStorage/Unit.js");
const Phase = require("../Structures/Phase.js");

class PhaseCollector extends Unit {
    constructor(engine) {
        super();
        this.engine = engine;
        this.first = null;
        this.current = null;
    }

    set(data) {
        const phase = new Phase({engine: this.engine, ...data});
        super.set(data.name, phase);
        if (phase.isFirst) this.first = phase;
        return phase;
    }

    move(end) {
        this.engine.majority.update();
        if (!end) return this.current.begin();
        this.current.end();
    } 

    jumpTo(phaseName, emitEnd = false) {
        if (emitEnd) this.current.end();
        this.current = this.get(phaseName);
        this.engine.timer.reset();
    }

    
}

module.exports = PhaseCollector;