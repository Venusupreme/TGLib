const Collection = require("../DataTypes/Collection.js");
const Side = require("../Structures/Side.js");

class SideCollection extends Collection {
    constructor(engine) {
        super();
        this.engine = engine;
    }

    set(name, data) {
         const side = new Side(name, data);
         super.set(name, side);
         return side;
    }

    addPlayer(side, player) {
        this.get(side).players.set(player.name, player);
    }
    
    removePlayer(side, playerName) {
        this.get(side).players.delete(playerName);
    }

    sizeOf(side) {
       return this.get(side).players.size;
    }

}

module.exports = SideCollection;