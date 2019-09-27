

/**
 * Represents a role template OR an actual role in-game. 
 * Template roles can be accessed through the "engine.roles" Unit
 * Only template roles should be copied.
 */

class Role {
     constructor(data) {
         this.name = data.name;
         this.engine = data.engine;
         /**Gets the side object */
         this.side = this.engine.sides.get(data.side);
         /**If there is no side object, create one! */
         if (!this.side) this.side = this.engine.sides.set(data.side);
         this.alignment = data.alignment;
         this.rolledFrom = null;
         this.unique = data.unique || false;
         this.blocked = data.blocked || false;
         this.amount = data.amount;
         this.visits = data.visits || true;
         this.factionAction = data.factionAction || false;
         this.action = data.action;
         this.common = data.common;
         if (data.common) for (let prop of data.common) this[prop] = data.common[prop];
     }
     

     copy(rolledFrom) {
         /**Makes another copy of the role, if this role's amount is 0, or if the role is unique, it gets removed from the possible pool of roles. */
         if (this.amount) this.amount--;
         if (this.amount === 0 || this.unique === true) this.engine.roles.remove(this.name);
         const role = new Role(this);
         role.rolledFrom = rolledFrom;
         return role;
     }

}

module.exports = Role;