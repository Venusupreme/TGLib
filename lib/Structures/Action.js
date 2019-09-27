

/**Represents a night action */

class Action {
    constructor(data) {
        this.player = data.player;
        this.target = data.target;
        this.other = data.other;
        /**If this action is a factional one. */
        this.factionAction = data.other.factionAction || this.player.role.factionAction;
        /**If it is, call the "side.setFactionAction" method so the side knows who is executing it. */
        if (this.factionAction) this.player.role.side.setFactionAction(this.player);
    }

    cancel() {
        if (this.factionAction) this.player.role.side.setFactionAction(null);
        this.player.action = null;
    }

    clear() {
        if (this.factionAction) this.player.role.side.setFactionAction(null);
        this.player.action = null;
    }

    exe() {
        /**Return if the player is roleblocked, or their role doesn't have an action */
      if (this.player.roleblocked || !this.player.role.action) return;
       this.player.role.action(this.player, this.target, this.other);
    }

}

module.exports = Action;