
class Phase {
    constructor(name, data) {
        this.data = data;
        this.name = name;
        this.first = data.first || false;
        this.amount = data.amount || 1;
        this.duration = data.duration || 60;
        this.evaluateActions = (data.evaluateActions == undefined) ? false:data.evaluateActions;
        this.next = data.next;
        this.listenForMajority = (data.listenForMajority == undefined) ? true:data.listenForMajority
        this.listenForPlurality = (data.listenForPlurality == undefined) ? true:data.listenForPlurality
        this.lynchPlayer = (data.lynchPlayer == undefined) ? true:data.lynchPlayer;
    }

    toString() {
        return `${this.name} ${this.amount}`
    }


}

module.exports = Phase;