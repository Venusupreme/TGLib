

module.exports = [
    {
        name: "Citizen",
        side: "Town",
        alignment: "Powerless",
        amount: 4
    },
    {
        name: "Sheriff",
        side: "Town",
        alignment: "Investigative",
        priority: [2, 2],
       /** interactions: [
            {
                role: "Lookout",
                executor: (thisPlayer, target) => {
                    console.log("This is an interaction!")
                }
            }
        ], **/
        common: {actionType: "check"},
        action: (player, target, data) => {
            if (target.framed) return console.log(`${target} is a member of the mafia!`);
            if (target.role.side.name === "Mafia") return console.log(`${target} is a member of the mafia!`);
            console.log(`${target} is not suspicious!`);
        }
    },
    {
        name: "Lookout",
        side: "Town",
        alignment: "Investigative",
        priority: [1, 2],
        common: {actionType: "lookout"},
        action: (player, target, data) => {
            console.log(`${target.visitors.map(v => v.name)} have visited ${player}`);
        }
    },
    {
        name: "Escort",
        side: "Town",
        alignment: "Support",
        priority: [0, 2],
        common: {actionType: "roleblock"},
        action: (player, target, data) => {
             target.roleblocked = true;
        }
    },
    {
        name: "Vigilante",
        side: "Town",
        alignment: "Support",
        attack: 1,
        priority: [5, 1],
        common: {actionType: "kill"},
        action: (player, target, data) => {
            if (!player.canKill(target)) console.log(`${player}: Your target was immune to your attack!`);
            target.kill(player);
        }
    },
    {
        name: "Veteran",
        side: "Town",
        alignment: "Killing",
        attack: 5,
        defense: 2,
        unique: true,
        priority: [0, 0],
        common: {actionType: "alert"},
        action: (player, target, data) => {
            for (let [, visitor] of player.visitors) {
                if (!player.canKill(visitor)) return console.log(`${player}: A visitor was immune to your attack!`);
                visitor.kill(player);
                console.log(`${player}: You killed a visitor!`);
            }
        }
    },
    {
        name: "Goon",
        side: "Mafia",
        alignment: "Powerless",
        attack: 1,
        priority: [5, 1],
        common: {actionType: "kill"},
        factionAction: true,
        action: (player, target, data) => {
            if (!player.canKill(target)) return console.log(`${player}: Your target was immune to your attack!`);
            target.kill(player);
        }
    },
    {
        name: "Framer",
        side: "Mafia",
        alignment: "Support",
        attack: 1,
        priority: [2, 1],
        common: {actionType: "frame", whenFactionAction: "kill"},
        action: (player, target, data) => {
            if (data.factionAction) {
             if (!player.canKill(target)) console.log(`${player}: Your target was immune to your attack!`);
             return target.kill(player);
            }
             target.framed = true;
        }
    }
]