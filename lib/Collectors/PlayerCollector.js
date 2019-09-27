
const Player = require("../Structures/Player.js");
const Unit = require("../DataStorage/Unit.js");
const Nolynch = require("../Structures/NoLynch.js");

class PlayerCollector extends Unit {
    constructor(engine) {
        super();
        this.engine = engine;
        this.nolynch = new Nolynch();
    }

    set(name) {
     const p = new Player({name: name, engine: this.engine});
     super.set(name, p);
     return p;
    }

    fromSide(side) {
         return this.filter(p => p.role.side.name === side);
    }

    withRole(roleName) {
        return this.filter(p => p.role.name === roleName);
    }

    withVotes(votes) {
        return this.filter(p => p.votes === votes);
    }

    roleblocked() {
        return this.filter(p => p.roleblocked)
    }

    clearVotes() {
        for (let [, player] of this) {
            player.votes = 0;
            player.votedFor = null;
            player.votedBy.clear();
        }
    }

    clearActions() {
        for (let [, player] of this) {
            if (player.action) player.action.clear();
            player.roleblocked = false;
        }
    }

}

module.exports = PlayerCollector;