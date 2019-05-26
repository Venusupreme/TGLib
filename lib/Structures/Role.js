
class Role {
    constructor(name, data) {
        this.name = name;
        this.side = data.side;
        this.alignment = data.alignment;
        this.unique = data.unique || false;
        this.blocked = data.blocked || false;
        this.amount = data.amount || 99999;
        this.visits = data.visits || true;
        this.action = data.action;
    }

    setSide(side) {
        this.side = side;
        return this;
    }

    setAlignment(alignment) {
        this.alignment = alignment;
        return this;
    }

    isUnique(bool) {
        this.unique = bool;
        return this;
    }

    isBlocked(bool) {
        this.blocked = bool;
        return this;
    }

    setAmount(amount) {
        this.amount = amount;
        return this;
    }

    setAction(fn) {
       this.action = fn;
       return this;
    }

    setName(name) {
        this.name = name;
        return this;
    }

     toString() {
        return this.name;
    } 

}

module.exports = Role;