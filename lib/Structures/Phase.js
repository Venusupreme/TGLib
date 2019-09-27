
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
    
    begin() {
        for (let [, arr] of this.arrangements.filter(a => a.at === this.iterations && a.when === "start")) arr.exe();
        this.engine.phases.current = this;
        this.engine.events.emit(this.name, this);
    }

    end() {
        for (let [, arr] of this.arrangements.filter(a => a.at === this.iterations && a.when === "end")) arr.exe();
        this.iterations++;
        this.engine.events.emit(`${this.name}-End`, this);
        this.engine.phases.current = this.engine.phases.get(this.next);
        this.engine.timer.reset();
    }

    at(id, data) {
        const arr = new Arrangement({id: id, ...data});
        this.arrangements.set(id, arr)
        return arr;
    }


}

module.exports = Phase;