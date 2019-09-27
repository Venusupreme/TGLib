

class Majority {
    constructor(engine) {
        this.engine = engine;
        this.value = this.engine.players.size / 2;
    }

    update() {
        if (this.engine.players.size % 2 == 0) this.value = (this.engine.players.size / 2) + 1; 
        this.value = Math.ceil(this.engine.playercount / 2);
    }

    valueOf() {
        return this.value;
    }

    toString() {
        return this.value.toString();
    }
}

module.exports = Majority;