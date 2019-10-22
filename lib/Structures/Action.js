

/**Represents a night action */

class Action {
    constructor(data = {}) {
        this.player = data.player;
        this.target = data.target;
        this.other = data.other || {};
        /**If this action is a factional one. */
        this.factionAction = this.other.factionAction || this.player.role.factionAction;
    }

    _checkForFA() {
         /**If it is, call the "side.setFactionAction" method so the side knows who is executing it. */
        if (this.factionAction) this.player.role.side.factionAction.set(this.player);
    }
    
    /**Saves an action to the player's "actionHistory" */
    save() {
        this.player.actionHistory.set(this.player.engine.phases.current.name + this.player.engine.phases.current.iterations, this);
    }

    /**cancels the action, signals "cancelAction" to engine, clears out the factionAction if needed. */
    cancel() {
        if (this.factionAction) this.player.role.side.factionAction.cancel();
        this.player.engine.events.emit("cancelAction", this.player);
        this.player.action = null;
    }

    /**"clears" the action. "cancel" but without signaling*/
    clear() {
        this.player.action = null;
    }

    /**executes the action */
    exe() {
       this.player.role.action(this.player, this.target, this.other);
    }

}

module.exports = Action;