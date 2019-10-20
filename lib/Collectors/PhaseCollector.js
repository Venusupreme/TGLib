

const Unit = require("../DataStorage/Unit.js");
const Phase = require("../Structures/Phase.js");

class PhaseCollector extends Unit {
    constructor(engine, presets) {
        super();
        this.engine = engine;
        this.first = null;
        this.current = null;
        if (presets) this.set(...presets);
    }

    set(...datas) {
        for (let data of datas) {
        const phase = new Phase({engine: this.engine, ...data});
        super.set(data.name, phase);
        if (phase.isFirst) this.first = phase;
        }
    }

    move(end) {
        this.engine.majority.update();
        if (!end) return this.current.begin();
        this.current.end();
    } 

    jumpTo(phaseName, emitEnd = false) {
        if (emitEnd === true) this.current.end();
        this.engine.jumpingTo = true;
        this.current = this.get(phaseName);
        this.engine.timer.reset();
    }

    
}

module.exports = PhaseCollector;