const PriorityList = require("./DataTypes/PriorityList.js");

class ActionManager {
    constructor(engine) {
        this.engine = engine;
        this.priorityList = null;
    }

    setPriorityList(list) {
        this.priorityList = list;
    } 

    evaluate(list = this.priorityList) {
        list = new PriorityList(list);
         list.forEach(role => {
             const all = this.engine.players.filter(p => !p.dead && p.role.name == role && !p.roleblocked && p.action);
             for (let [, player] of all) {
                 player.role.action(player, player.action.target, player.action.other);
                 this.engine.emit("executeAction", player);
             }
         }); 
    }

}

module.exports = ActionManager;