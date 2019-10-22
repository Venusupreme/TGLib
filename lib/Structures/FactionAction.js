

class FactionAction {
    constructor(engine) {
        this.engine = engine;
        this.doer = null;
    }

    set(player) {
        if (this.doer) this.cancel();
        this.doer = player;
        this.engine.events.emit("setFactionAction", player);
    }

    cancel() {
        this.engine.events.emit("cancelFactionAction", this.doer);
        if (this.doer.action) this.doer.action = null;
        this.doer = null; 
    }

    clear() {
        this.doer = null;
    }


}

module.exports = FactionAction;