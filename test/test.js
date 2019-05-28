const Mafia = require("../index.js");

const Game = new Mafia.Engine({
     majority: true, // Activate Majority
     plurality: false, // Deactivate Plurality
     stalemate: () => { 
         if (Game.sides.sizeOf("Evil") > Game.sides.sizeOf("Town")) return "Evil"; // If the majority of players are evil, evils win.
         if (Game.sides.sizeOf("Evil") == 0) return 'Town'; // If there aren't any alive evil players, town wins. 
     },
     rolelist: ['Lookout', 'Town Protective', 'Sheriff', 'Plague', 'Wolf', 'Evil Killing'],
     rules: (role, side, alignment) => {
         if (role.alignment == 'Protective' && side == 'Random' && alignment == 'Town') return false;
         return true;
     },
     priorityList: {
         1: ['Escort', 'Doctor'],
         2: ['Plague', 'Vigilante', 'Wolf'],
         3: ['Sheriff', 'Lookout']
     }
});

Game.phases.set("Day", {duration: 10, first: true, next: 'Night'});
Game.phases.set("Night", {duration: 10, next: 'Day', evaluateActions: true});

Game.roles.set("Citizen", {side: "Town", alignment: "Citizen", amount: 2});
Game.roles.set("Escort", {side: "Town", alignment: "Support", unique: false, action: (doer, target) => target.roleblocked = true});
Game.roles.set("Sheriff", {side: "Town", alignment: "Investigative", action: (doer, target) => (target.role.side.name == 'Evil') ? console.log('Your target is evil!'):console.log("Your target is member of the town!")});
Game.roles.set("Lookout", {side: "Town", alignment: "Investigative", action: (doer, target) => console.log(`${target.name} was visited by: ${target.visitors.map(v => v.name).join(", ").replace(doer.name, "") || "Nobody!"}`)});
Game.roles.set("Vigilante", {side: "Town", alignment: "Killing", unique: true, action: (doer, target) => {
    if (!target.protected) target.kill(doer);
    else console.log(`${doer}: You couldn't attack ${target}! They were healed!`)
}});
Game.roles.set("Doctor", {side: "Town", alignment: "Protective", action: (doer, target) => {
    if (doer.role.heals == 0) return console.log(`${doer}: You don't have anymore heals!`);
    target.protected = true;
    doer.role.heals--;
}}).addAttr('heals', 3)
Game.roles.set("Wolf", {side: "Evil", alignment: "Killing", factionalAction: true, action: (doer, target) => {
      if (!target.protected) target.kill(doer);
      else console.log(`${doer}: You couldn't attack ${target}! They were healed! The doctor now has ${Game.players.find(p => p.role.name == 'Doctor').role.heals} heals!`)
}});
Game.roles.set("Plague", {side: "Evil", alignment: "Support", visits: false, action: (doer, target) => {
   if (doer.role.things == 0)  return console.log(`${doer}: You don't have anymore things!`);
   target.protected = false;
   doer.role.things--;
}}).addAttr('things', 2);

Game.players.set("Google");
Game.players.set("Hidden")
Game.players.set("Ralozey")
Game.players.set("BS")
Game.players.set("Poptart")
Game.players.set("Parallax")

Game.on("setRole", player => {
       console.log(`${player} is a ${player.role}`);
});

Game.on("Day", phase => {
    console.log(`It's ${phase}! Majority: ${Game.settings.majority.value}`);
});

Game.on("Night", phase => {
    console.log(`It's ${phase}!`);
    setTimeout(() => {
        const [wolves, others] = Game.players.split(p => p.role.name == 'Wolf');
        const lucky = others.random();
        Game.players.find(p => p.role.name == 'Plague').setAction(lucky);
        Game.players.find(p => p.role.name == 'Doctor').setAction(lucky);
        wolves.first().setAction(lucky);
        wolves.last().setAction(lucky);
    }, 5000);
});

Game.on("kill", (victim, killer) => {
   console.log(`${victim} was killed by ${killer}`);
});


Game.on("vote", (voter, votee) => {
    console.log(`${voter} has voted for ${votee} (${votee.votes})`);
});

Game.on("setAction", player => {
    console.log(`${player} (${player.role}) is now targeting ${player.action.target}`);
});

Game.on("lynch", lynched => {
    console.log(`${lynched} has been lynched!`);
});

Game.on("factionalActionCancel", (canceled, newP) => {
   console.log(`${newP} has decided to carry out the action instead of ${canceled}`);
});

Game.on("end", winners => {
    console.log(`${winners} win!`);
})

Game.start();

