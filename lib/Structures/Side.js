const Collection = require("../DataTypes/Collection.js");

class Side {
    constructor(name, data) {
        this.name = name;
        this.factionalActionExecutor = null;
        this.players = new Collection(data.players);
        this.roles = new Collection(data.roles);
    }

    clear() {
        this.factionalActionExecutor = null;
        this.players.clear();
    }

    toString() {
        return this.name;
    }

}

module.exports = Side;