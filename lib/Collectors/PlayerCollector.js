const Collection = require("../DataTypes/Collection.js");
const Player = require("../Structures/Player.js")
const NoLynch = require("../Structures/NoLynch.js");

class PlayerCollector extends Collection {
    constructor(engine) {
        super();
        this.engine = engine;
        this.nolynch = new NoLynch(engine);
    }

    set(name) {
        this.engine.playercount++;
        const pl =new Player(name, this.engine);
        super.set(name, pl);
        this.engine.emit("addPlayer", pl)
        return pl;
    }

    delete(name) {
        this.engine.playercount--;
        const player = this.get(name);
        this.delete(name);
        for (let [, pl] of this.engine.players) {
             if (pl.votedBy.has(name)) {
                 pl.votes -= player.votingPower; 
                 pl.votedBy.delete(name);
             }
             if (pl.votedFor && pl.votedFor.name == name) pl.votedFor = null;
        }
       this.engine.emit("deletePlayer", player);
    }

    dead() {
        return this.filter(p => p.dead);
    }

    alive() {
        return this.filter(p => !p.dead);
    }

    fromSide(sideName, dead = false) {
        return this.filter(p => p.role.side.name == sideName && p.dead == dead);
    }

}

module.exports = PlayerCollector;