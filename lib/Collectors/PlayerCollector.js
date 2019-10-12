
const Player = require("../Structures/Player.js");
const Unit = require("../DataStorage/Unit.js");
const Nolynch = require("../Structures/NoLynch.js");

class PlayerCollector extends Unit {
    constructor(engine) {
        super();
        this.engine = engine;
        this.nolynch = new Nolynch(this.engine);
    }

    set(name) {
     const p = new Player({name: name, engine: this.engine});
     super.set(name, p);
     return p;
    }

    all() {
        const vals = this.valArray();
        vals.push(this.nolynch);
        return vals;
    }

    fromSide(side) {
         return this.filter(p => p.role.side.name === side);
    }

    withRole(roleName) {
        return this.filter(p => p.role.name === roleName);
    }

    clearVotes() {
        for (let [, player] of this) {
            player.votes = 0;
            player.votedFor = null;
        }
        this.nolynch.clear();
    }

    clearActions() {
        for (let [, player] of this) {
            if (player.action) player.action.clear();
            player.roleblocked = false;
        }
       // for (let [, side] of this.engine.sides) side.factionAction = null;
    }

    executeActions(priorities = this.engine.priorities) {
        for (let role of priorities) {
             const players = this.filter(p => p.action && p.role.name === role && !p.roleblocked && p.role.action && !p.invisible);
             for (let [, player] of players) {
                 player.action.save();
                 player.action.exe();
             }
        };
    }

}

module.exports = PlayerCollector;