
const Unit = require("../DataStorage/Unit.js");
const Role = require("../Structures/Role.js");

class RoleCollector extends Unit {
    constructor(engine, presets) {
        super();
        this.cache = new Unit();
        this.engine = engine;
        this.rules = () => true;
        if (presets) this.set(...presets);
        this._orderRolesByPriorityCache = null;
    }

    set(...data) {
        for (let role of data) {
            role = new Role({engine: this.engine, ...role});
            super.set(role.name, role);
            this.cache.set(role.name, role.hardCopy());
        }
    }

    orderRolesByPriority() {
        let roles = this.engine.players.filter((val, key, map) => val.role.priority);
        roles = [...new Set(roles.map(e => e.role.name))].map(v => roles.find(p => p.role.name === v).role);
        this._orderRolesByPriorityCache = roles.sort((a, b) => (a.priority[0] - b.priority[0]) + (a.priority[1] - b.priority[1]));
        return this._orderRolesByPriorityCache;
    }

    getByName(name) {
        const role = this.get(name);
        if (!role) return null;
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

     validateFill(str) {
         const [side, align] = str.split(" ");
         if (side === "Any") return true;
         if (side === "Random" && this.engine.sides.has(align)) return true;
         if (this.engine.sides.has(side) && this.find(r => r.alignment === align)) return true;
         if (this.has(side)) return true;
         return false;
     }

     fillRolelist(rolelist) {
         const roles = [];
         for (let role of rolelist) {
              const [side, alignment] = role.split(" ");
              roles.push(this.fill(side, alignment));
         }
         return roles;
     }

     restore() {
         this.clear();
        for (let [, role] of this.cache) super.set(role.name, role.hardCopy());
        this.engine.rolelist = [];
     }

     get inGame() {
         return this.engine.players.map(p => p.role);
     }


}

module.exports = RoleCollector;
