

class Majority {
    constructor(engine) {
        this.engine = engine;
        this.value = this.engine.players.size / 2;
    }

    update() {
       return this.value = this.calc(this.engine.players.size);
    }

    calc(players) {
        if (players % 2 == 0) return (players / 2) + 1; 
        return Math.ceil(players / 2);
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