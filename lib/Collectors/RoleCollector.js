
const Unit = require("../DataStorage/Unit.js");
const Role = require("../Structures/Role.js");

class RoleCollector extends Unit {
    constructor(engine) {
        super();
        this.engine = engine;
        this.rules = () => true;
    }

    set(...data) {
        for (let role of data) {
            role = new Role({engine: this.engine, ...role});
            super.set(role.name, role);
        }
    }

    getByName(name) {
        const role = this.get(name);
        if (!role) return "Any";
        return role.copy("Named");
    }

    any() {
        const possible = this.filter(r => this.rules("Any", null, r));
        return possible.random().copy("Any");
    }

    fromRandomSide(side) {
        const possible = this.filter(r => r.side.name === side && this.rules("Random", side, r));
        return possible.random().copy(`Random ${side}`);
    }

     fromAlignment(side, alignment) {
         const possible = this.filter(r => r.side.name === side && r.alignment === alignment && this.rules(side, alignment, r));
         return possible.random().copy(`${side} ${alignment}`);
     }

     fill(side, alignment) {
         if (this.has(side)) return this.getByName(side);
         if (side === "Any") return this.any();
         if (side === "Random") return this.fromRandomSide(alignment);
         return this.fromAlignment(side, alignment);
     }

     fillRolelist(rolelist) {
         const roles = [];
         for (let role of rolelist) {
              const [side, alignment] = role.split(" ");
              roles.push(this.fill(side, alignment));
         }
         return roles;
     }


}

module.exports = RoleCollector;
