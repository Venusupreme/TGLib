

class Majority {
    constructor(engine) {
        this.engine = engine;
        this.value = this.engine.players.size / 2;
    }

    update() {
        if (this.engine.players.size % 2 == 0) this.value = (this.engine.players.size / 2) + 1; 
        this.value = Math.ceil(this.engine.players.size / 2);
    }

    check() {
        return this.engine.players.all().find(p => !p.dead && p.votes === this.value && !p.invisible);
    }

    valueOf() {
        return this.value;
    }

    toString() {
        return this.value.toString();
    }
}

module.exports = Majority;