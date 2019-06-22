const Role = require("../Structures/Role.js");
const Collection = require("../DataTypes/Collection.js");
//const defaultAttrs = ["name", "alignment", "side", "unique", "amount", "blocked", "action", "visits", "factionalAction"];

class RoleCollection extends Collection {
    constructor(engine) {
        super();
        this.original = new Collection();
        this.rules = () => true;
         this.engine = engine;
    }

    set(name, data = {alignment: null, side: null, unique: false, amount: 999, blocked: false, action: null, visits: true, factionalAction: false, roleAttrs: null}) {
        const role = new Role(name, data);
        const backup = new Role(name, data);
        super.set(name, role);
        this.original.set(name, backup);
        this.engine.sides.has(data.side) ? this.engine.sides.get(data.side).roles.set(name, backup):this.engine.sides.set(data.side, {roles: [backup]});
        role.side = this.engine.sides.get(data.side);
        backup.side = this.engine.sides.get(data.side);
        return role;
    }

    parseSet(obj) {
        const role = new Role(obj.name, {});
       for (let key in obj) {
             role[key] = obj[key];
       }
        const backup = role.clone();
        super.set(role.name, role);
        this.original.set(backup.name, backup);
        this.engine.sides.has(role.side) ? this.engine.sides.get(role.side).roles.set(obj.name, backup):this.engine.sides.set(role.side, {roles: [backup]});
        role.side = this.engine.sides.get(role.side);
        backup.side = this.engine.sides.get(role.side.name);
        return role;
    }

   setRules(fn) {
         this.rules = fn;
   }

    any() {
         const tried = [];
         let role = null;
         do {
             if (this.size == 0) break;
            const trythis = this.random();
            if (!tried.includes(trythis.name) && trythis.amount >= 1 && !trythis.blocked && this.rules(trythis, 'Any')) {
                 role = trythis;
                trythis.amount--;
                 if (trythis.amount <= 0 || trythis.unique) this.delete(trythis.name);
            }else tried.push(trythis.name);
         }while(!role)
         return role;
    }

    fromSide(side) {
          let role = null;
          const possible = this.filter(r => r.side.name == side);
          do {
            if (this.size == 0) break;
            const trythis = possible.random();
            if (trythis.amount >= 1 && !trythis.blocked && this.rules(trythis, side)) {
                 role = trythis;
                if (trythis.unqiue) this.delete(trythis.name);
                trythis.amount--;
                 if (trythis.amount <= 0) this.delete(trythis.name);
            }else possible.delete(trythis.name);
         }while(!role)
         return role;
    }


    fromAlign(side, alignment) {
        let role = null;
        const possible = this.filter(r => r.side.name == side && r.alignment == alignment);
        do {
            if (this.size == 0) break;
            const trythis = possible.random();
            if (trythis.amount >= 1 && !trythis.blocked && this.rules(trythis, side, alignment)) {
                 role = trythis;
                if (trythis.unqiue) this.delete(trythis.name);
                trythis.amount--;
                 if (trythis.amount <= 0) this.delete(trythis.name);
            }else possible.delete(trythis.name);
         }while(!role)
         return role;
    }

    byName(name) {
        if (!this.has(name)) return;
        const role = this.get(name);
        if (role.unique) this.delete(name);
        role.amount--;
        if (role.amount <= 0) this.delete(name);
        return name;
    }

    fill(side, align) {
        let og = false;
        if (this.original.has(side)) {
            let role = this.original.get(side);
            og = role;
        }  else if (side.toLowerCase() == "any") {
             og = this.any();
        } else if (side.toLowerCase() == "random") {
             og = this.fromSide(align);
        } else {
            og = this.fromAlign(side, align);
        }
        return og;
    }


    fillRolelist(rolelist) {
        const filled = new Collection();
        const names = [];
        rolelist.forEach(val => {
            const side = val.split(" ")[0];
            const align = val.split(" ")[1];
             let role = this.fill(side, align);
             role.rolledFrom.push(val);
             filled.set(role.name, role);
             names.push(role.name);
        });
        return {names: names, roles: filled};
    }


}

module.exports = RoleCollection;