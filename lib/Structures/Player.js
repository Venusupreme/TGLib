

const Unit = require("../DataStorage/Unit.js");

//**Represents a player */

class Player {
    constructor(data) {
        this.name = data.name;
        this.engine = data.engine;
        this.role = data.role;
        this.votes = 0;
        this.votedFor = null;
        this.votedBy = new Unit();
        this.action = null;
        this.roleblocked = false;
        this.actionHistory = new Unit();
        this.votePower = data.votePower || 1;
    }

    setRole(role) {
        this.role = role;
        this.engine.events.emit("setRole", this);
    }


    visitors() {
        //**Gets all the players that are visiting this player*/
        return this.engine.players.filter(p => p.action && p.action.target.name === this.name && p.role.visits);
    }

}

module.exports = Player;