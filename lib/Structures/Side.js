
//**Represents a side in the game, ex. "Town", "Mafia", "Neutral" */

class Side {
    constructor(data) {
        this.name = data.name;
        this.engine = data.engine;

        /**If there is someone executing the factional action */
        this.factionAction = null;
    }

    members() {
        /**Get all members of this side */
        return this.engine.players.filter(p => p.role.side.name === this.name);
    }

    size() {
        /**Get the size of all the members */
        return this.members().size;
    }
 
    setFactionAction(val) {
        /**Sets the factional kill, if there is someone doing it already, their action is cancelled. */
          if (this.factionAction) this.factionAction.cancelAction();
          this.factionAction = val;
    }

}

module.exports = Side;