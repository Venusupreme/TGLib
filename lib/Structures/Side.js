const Collection = require("../DataTypes/Collection.js");

class Side {
    constructor(name, data) {
        this.name = name;
        this.factionalActionExecutor = null;
        this.players = new Collection(data.players);
        this.roles = new Collection(data.roles);
    }

    toString() {
        return this.name;
    }

}

module.exports = Side;