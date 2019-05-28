const Engine = require("./lib/Engine.js");
const Collection = require("./lib/DataTypes/Collection.js");
const PriorityList = require("./lib/DataTypes/PriorityList.js");
const ActionManager = require("./lib/ActionManager.js");
const Timer = require("./lib/Timer.js");
const Structures = {
    Action: require("./lib/Structures/Action.js"),
    Nolynch: require("./lib/Structures/NoLynch.js"),
    Phase: require("./lib/Structures/Phase.js"),
    Player: require("./lib/Structures/Player.js"),
    Role: require("./lib/Structures/Role.js"),
    Settings: require("./lib/Structures/Settings.js"),
    Side: require("./lib/Structures/Side.js")
}
const Collectors = {
    PhaseCollector: require("./lib/Collectors/PhaseCollector.js"),
    RoleCollector: require("./lib/Collectors/RoleCollector.js"),
    PlayerCollector: require("./lib/Collectors/PlayerCollector.js"),
    SideCollector: require("./lib/Collectors/SideCollector.js")
}


module.exports = {
    Engine: Engine,
    Collection: Collection,
    PriorityList: PriorityList,
    ActionManager: ActionManager,
    Timer: Timer,
    Structures: Structures,
    Collectors: Collectors,
    Version: '1.0.0'
}
