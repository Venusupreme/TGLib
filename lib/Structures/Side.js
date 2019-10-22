
//**Represents a side in the game, ex. "Town", "Mafia", "Neutral" */

const FactionAction = require("./FactionAction.js");

class Side {
    constructor(data) {
        this.name = data.name;
        this.engine = data.engine;

        /**If there is someone executing the factional action */
        this.factionAction = new FactionAction(this.engine);
    }

    get members() {
        /**Get all members of this side */
        return this.engine.players.filter(p => p.role.side.name === this.name && !p.dead && !p.invisible);
    }

    get size() {
        /**Get the size of all the members */
        return this.members.size;
    }
 
    toString() {
        return this.name;
    }

}

module.exports = Side;