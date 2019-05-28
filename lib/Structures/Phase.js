
class Phase {
    constructor(name, data) {
        this.data = data;
        this.name = name;
        this.first = data.first || false;
        this.amount = data.amount || 1;
        this.duration = data.duration || 60;
        this.evaluateActions = data.evaluateActions || false;
        this.next = data.next;
    }

    toString() {
        return `${this.name} ${this.amount}`
    }


}

module.exports = Phase;