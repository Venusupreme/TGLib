const PriorityList = require("./DataTypes/PriorityList.js");

class ActionManager {
    constructor(engine) {
        this.engine = engine;
        this.priorityList = null;
    }

    setPriorityList(list) {
        this.priorityList = new PriorityList(list);
    } 

    evaluate(list = this.priorityList) {
         list.forEach(role => {
             const all = this.engine.players.filter(p => p.role.name == role && p.action && !p.action.roleblocked);
             for (let [, player] of all) {
                 player.role.action(player, player.action.target, player.action.other);
                 this.engine.emit("executeAction", player);
             }
         }); 
    }

}

module.exports = ActionManager;