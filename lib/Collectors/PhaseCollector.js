const Phase = require("../Structures/Phase.js");
const Collection = require("../DataTypes/Collection.js");

class PhaseCollector extends Collection {
    constructor(engine) {
        super();
        this.engine = engine;
        this.current = null;
        this.firstPhase = null;
    }

    set(name, data = {duration: 60, first: false, next: null, amount: 1, listenForMajority: true, listenForPlurality: true, lynchPlayer: true}) {
        const phase = new Phase(name, data);
        if (phase.first) this.firstPhase = phase;
        super.set(name, phase);
        return phase;
    }

    endCurrent() {
        if (this.current.evaluateActions) {
        this.engine.actionManager.evaluate(null);
        this.current.amount++;
        this.current = this.get(this.current.next);
        for (let [, player] of this.engine.players) player.clearData();
        this.engine.timer.reset();
        }else {
        this.current.amount++;
        this.current = this.get(this.current.next);
        for (let [, player] of this.engine.players) player.clearData();
        if (!this.engine.phases._willJump) this.engine.timer.reset();
    }
    }

    jumpTo(phaseName, clear = true, emitEnd = false) {
        this.engine._set = false;
        if (emitEnd) this.engine.emit(`${this.current.name}-End`, this.current, true);
        this.current.amount++;
        this.current = this.get(phaseName);
        if (clear) for (let [, player] of this.engine.players) player.clearData();
        this.engine.timer.reset();
    }

}

module.exports = PhaseCollector;