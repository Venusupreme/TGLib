

const Unit = require("../DataStorage/Unit.js");
const Action = require("./Action.js");

//**Represents a player */

class Player {
    constructor(data) {
        this.name = data.name;
        this.dead = false;
        this.engine = data.engine;
        this.role = data.role;
        this.votes = 0;
        this.votedFor = null;
        this.action = null;
        this.invisible = false;
        this.roleblocked = false;
        this.actionHistory = new Unit();
        this.votePower = data.votePower || 1;
    }

    votesFor(player) {
        player.votes += this.votePower;
        this.votedFor = player;
        this.engine.events.emit("vote", this, player);
    }

    unvote() {
        this.votedFor.votes -= this.votePower;
        this.engine.events.emit("unvote", this, this.votedFor);
        this.votedFor = null;
    }

    canKill(target) {
        if (target.role.defense >= this.role.attack) return false;
        return true;
    }

    kill(killer) {
        this.dead = true;
        if (killer) this.engine.events.emit("kill", killer, this);
    }

    revive(reviver) {
        this.dead = false;
        if (reviver) this.engine.events.emit("revive", reviver, this);
    }

    setAction(target, data = {factionAction: false}) {
        const action = new Action({target: target, player: this, data: this});
        this.action = action;
        this.engine.events.emit("setAction", this);
    }

    setRole(role) {
        this.role = role;
        this.engine.events.emit("setRole", this);
    }

    get visitors() {
        //**Gets all the players that are visiting this player*/
        return this.engine.players.filter(p => p.action && p.action.target.name === this.name && p.role.visits);
    }

    get votedBy() {
        return this.engine.players.filter(p => p.votedFor && p.votedFor.name === this.name);
    }

    setVotePower(value) {
        if (this.votedFor) {
            this.votedFor.votes -= this.votePower;
            this.votedFor.votes += value;
        }
        this.votedFor = value;
    }
    
    toString() {
        return this.name;
    }

}

module.exports = Player;