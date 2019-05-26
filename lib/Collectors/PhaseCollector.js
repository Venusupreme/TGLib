const Phase = require("../Structures/Phase.js");
const Collection = require("../DataTypes/Collection.js");

class PhaseCollector extends Collection {
    constructor(engine) {
        super();
        this.engine = engine;
        this.current = null;
        this.firstPhase = null;
    }

    set(name, data = {duration: 60, first: false, next: null, amount: 1}) {
        const phase = new Phase(name, data);
        if (phase.first) this.firstPhase = phase;
        super.set(name, phase);
        return phase;
    }

    endCurrent() {
        this.engine.emit(`${this.current.name}-End`, this.current)
        this.current.amount++;
        this.current = this.get(this.current.next);
        for (let [, player] of this.engine.players.alive()) player.clearData();
        this.engine.players.nolynch.clearData();
        this.engine.players.nolynch.dead = false;
        this.engine.timer.reset();
    }

}

module.exports = PhaseCollector;