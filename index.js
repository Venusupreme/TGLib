

module.exports = {
    Structrues: {
        Action: require("./lib/Structures/Action.js"),
        NoLynch: require("./lib/Structures/NoLynch"),
        Phase: require("./lib/Structures/Phase.js"),
        Player: require("./lib/Structures/Player.js"),
        Role: require("./lib/Structures/Role.js"),
        Side: require("./lib/Structures/Side.js")
    },
    Mechanics: {
        Arrangement: require("./lib/Mechanics/Arrangement.js"),
        EventListener: require("./lib/Mechanics/EventListener.js"),
        Majority: require("./lib/Mechanics/Majority.js"),
        Timer: require("./lib/Mechanics/Timer.js")
    },
    Collectors: {
        PhaseCollector: require("./lib/Collectors/PhaseCollector.js"),
        PlayerCollector: require("./lib/Collectors/PlayerCollector.js"),
        RoleCollector: require("./lib/Collectors/RoleCollector.js"),
        SideCollector: require("./lib/Collectors/SideCollector.js")
    },
    DataStorage: {
        Unit: require("./lib/DataStorage/Unit.js"),
        PriorityList: require("./lib/DataStorage/PriorityList.js")
    },
    Engine: require("./lib/Base/Engine.js")
}