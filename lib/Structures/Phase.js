
const Arrangement = require("../Mechanics/Arrangement.js");
const Unit = require("../DataStorage/Unit.js")

/**Represents a phase, ex. "Day", "Night", "Judgement" */

class Phase {
    constructor(data) {
        this.name = data.name;
        this.engine = data.engine;
        this.duration = data.duration;
        this.iterations = data.iterations || 1;
        this.next = data.next;
        this.isFirst = data.isFirst || false;
        this.arrangements = new Unit();
    }
    
    /**"starts" the phase. Emits a signal to the engine and loops through arrangements that need to be executed. */
    begin() {
        this.engine.phases.current = this;
        this.engine.events.emit(this.name, this);
    }

    /**"ends" the phase. Emits a signal to the engine, loops through all the arrangments, switches to the next phase and resets the timer. */
    end() {
        this.iterations++;
        this.engine.events.emit(`${this.name}-End`, this);
        if (this.engine.jumpingTo) return;
        this.engine.phases.current = this.engine.phases.get(this.next);
        this.engine.timer.reset();
    }

    /**Creates an arrangement */
    schedule(id, data) {
        const arr = new Arrangement({id: id, phase: this, ...data});
        this.arrangements.set(id, arr)
        return arr;
    }
    
    checkForArrangements() {
       if (this.arrangements.size) for (let [, arr] of this.arrangements.filter(a => a.when === this.engine.timer.elapsed && a.at === this.iterations)) arr.exe();
    }
    
    toString() {
        return this.name;
    }


}

module.exports = Phase;