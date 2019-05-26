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
    }

    votesFor(player) {
        if (this.dead) return;
        this.votedFor = player;
        player.votes += this.votingPower;
        player.votedBy.set(this.name, this);
        this.engine.emit('vote', this, player);
    }

    unvote() {
       this.votedFor.votes  -= this.votingPower;
       this.votedFor.delete(this.name);
       this.engine.emit('unvote', this, this.votedFor);
       this.votedFor = null;
    }

    kill(killer) {
        this.dead = true;
        this.killedBy = killer;
        this.engine.playercount--;
        this.engine.emit("kill", this, killer);
        this.clearData();
        this.role.side.players.delete(this.name);
    }

    lynch(way) {
        if (this.name == 'nolynch') {
            this.engine.emit("lynch", this, way);
            this.clearData();
        }else {
         this.dead = true;
        this.killedBy = 'lynched';
        this.engine.playercount--;     
         this.engine.emit("lynch", this, way);
        this.clearData();
        this.role.side.players.delete(this.name);
        }
    }

    clearData() {
        this.votedBy.clear();
        this.votes = 0;
        this.votedFor = null;
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

    setAction(target, others = {factionalTarget: false}) {
       const action = new Action(this, target, others);
       this.action = action;
       this.actionHistory.set(this.engine.phases.current.toString(), action);
       this.engine.emit('setAction', this);
    }

    cancelAction() {
        this.action.cancel();
        this.action = null;
        this.actionHistory.delete(this.engine.phases.current.toString());
        this.engine.emit("cancelAction", this);
    }

    setRole(role) {
        role.side.players.set(this.name, this);
        this.role = role;
        this.engine.emit("setRole", this);
    }

    toString() {
        return this.name;
    }

}

module.exports = Player;