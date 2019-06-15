const Collection = require("../DataTypes/Collection.js");
const Action = require("./Action.js");

class Player {
    constructor(name, engine) {
         this.name = name;
         this.role = null;
         this.engine = engine;
         this.votes = 0;
         this.dead = false;
         this.votedFor = null;
         this.killedBy = null;
         this.votedBy = new Collection();
         this.votingPower = 1;
         this.action = null;
         this.actionHistory = new Collection();
         this.visitors = new Collection();
         this.roleAttrs = new Collection();
    }

    votesFor(player) {
        if (player == 'nolynch') {
            this.votedFor = this.engine.players.nolynch;
            this.engine.players.nolynch.votes += this.votingPower;
            this.engine.players.nolynch.votedBy.set(this.name, this);
            this.engine.emit('vote', this, this.engine.players.nolynch);
        }else {
        this.votedFor = player;
        player.votes += this.votingPower;
        player.votedBy.set(this.name, this);
        this.engine.emit('vote', this, player);
        }
    }

    unvote() {
       this.votedFor.votes  -= this.votingPower;
       this.engine.emit('unvote', this, this.votedFor);
       this.votedFor.votedBy.delete(this.name);
       this.votedFor = null;
    }

    kill(killer) {
        this.dead = true;
        this.killedBy = killer;
        this.engine.playercount--;
        this.engine.emit("kill", this, killer);
     //   this.clearData();
        this.role.side.players.delete(this.name);
    }

    lynch(way, emit) {
         this.dead = true;
        this.killedBy = 'lynched';
        this.engine.playercount--; 
        if (emit) this.engine.emit("lynch", this, way);
        this.clearData();
        this.role.side.players.delete(this.name);
    }

    clearData() {
        this.votedBy.clear();
        this.visitors.clear();
        this.votes = 0;
        this.votedFor = null;
        if (this.action) this.action.cancel();
        this.action = null;
    }

    delete() {
        this.engine.players.delete(this.name);
        for (let [, pl] of this.engine.players) {
             if (pl.votedBy.has(this.name)) {
                 pl.votes -= this.votingPower; 
                 pl.votedBy.delete(this.name);
             }
             if (pl.votedFor && pl.votedFor.name == this.name) pl.votedFor = null;
        }
        this.engine.settings.scaleMajority();
        this.engine.emit("deletePlayer", this);
    }

    setAction(target, others = {factionalAction: undefined}) {
       const action = new Action(this, target, others);
       this.action = action;
       this.actionHistory.set(this.engine.phases.current.toString(), action);
       this.engine.emit('setAction', this);
    }

    roleblock() {
        if (this.action) this.action.roleblocked = true;
    }

    cancelAction() {
        this.engine.emit("cancelAction", this);
        if (this.action) this.action.cancel();
        this.action = null;
        this.actionHistory.delete(this.engine.phases.current.toString());
    }

    setRole(role) {
        if (role.side) role.side.players.set(this.name, this);
        this.role = role;
        this.roleAttrs = role.attrs.clone();
        this.engine.emit("setRole", this);
    }

    toString() {
        return this.name;
    }

}

module.exports = Player;