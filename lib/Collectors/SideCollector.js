
const Unit = require("../DataStorage/Unit.js");
const Side = require("../Structures/Side.js");

class SideCollector extends Unit {
    constructor(engine) {
        super();
        this.engine = engine;
    }

    set(name) {
         const side = new Side({name: name, engine: this});
         super.set(name, side);
         return side;
    }

    sizeOf(sideName) {
        return this.get(sideName).size;
    }

}

module.exports = SideCollector;