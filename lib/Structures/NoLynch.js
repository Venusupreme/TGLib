const Collection = require("../DataTypes/Collection.js");

class NoLynch {
    constructor(engine) {
        this.votes = 0;
        this.votedBy = new Collection();
        this.engine = engine;
    }

    lynch() {
        this.engine.emit("noLynch", this);
        this.votes = 0;
        this.votedBy.clear();
    }

    toString() {
        return 'nolynch';
    }
}

module.exports = NoLynch;