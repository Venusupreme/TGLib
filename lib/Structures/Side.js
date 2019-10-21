
//**Represents a side in the game, ex. "Town", "Mafia", "Neutral" */

class Side {
    constructor(data) {
        this.name = data.name;
        this.engine = data.engine;

        /**If there is someone executing the factional action */
        this.factionAction = null;
    }

    get members() {
        /**Get all members of this side */
        return this.engine.players.filter(p => p.role.side.name === this.name && !p.dead && !p.invisible);
    }

    get size() {
        /**Get the size of all the members */
        return this.members.size;
    }
 
    setFactionAction(val) {
        /**Sets the factional kill, if there is someone doing it already, their action is cancelled. */
        const facAc = this.factionAction;
        if (!val) {
            if (facAc) this.engine.events.emit("cancelFactionAction", facAc);
            return this.factionAction = null;
        }
        if (val && facAc) {
            facAc.action.cancel();
            this.engine.events.emit("cancelFactionAction", facAc);
        }
            this.factionAction = val;
            this.engine.events.emit("setFactionAction", val);
    }

    toString() {
        return this.name;
    }

}

module.exports = Side;