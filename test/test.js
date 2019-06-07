const Mafia = require("../index.js");

const Game = new Mafia.Engine({
     majority: true, // Activate Majority
     plurality: true, // Activate Plurality
     stalemate: () => { 
         if (Game.sides.sizeOf("Evil") > Game.sides.sizeOf("Town")) return "Evil"; // If the majority of players are evil, evils win.
         if (Game.sides.sizeOf("Evil") == 0) return 'Town'; // If there aren't any alive evil players, town wins. 
     },
     rolelist: ['Lookout', 'Town Protective', 'Sheriff', 'Plague', 'Evil Killing', 'Evil Killing'],
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

Game.phases.set("Day", {duration: 30, first: true, next: 'Night', lynchPlayer: false});
Game.phases.set("Night", {duration: 30, next: 'Day', evaluateActions: true});
Game.phases.set("Judgement", {duration: 20, next: 'Night', listenForMajority: false, listenForPlurality: false})

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
}}).addAttr("test", 3).addAttr("test2", 66);
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
    const rng = Game.players.random();
    Game.players.random().votesFor(rng);
  Game.players.random().votesFor(rng);
    Game.players.random().votesFor(rng)
   Game.players.random().votesFor(rng);
});

Game.on("Night", phase => {
    console.log(`It's ${phase}!`);
    setTimeout(() => {
        const [wolves, others] = Game.players.split(p => p.role.name == 'Wolf');
        const lucky = others.random();
        Game.players.find(p => p.role.name == 'Doctor').setAction(lucky);
        wolves.first().setAction(lucky);
        wolves.last().setAction(others.last(), {factionalAction: true});
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
      Game.ontrial = lynched;
      for (let [, p] of Game.players) {
        if (p.name != lynched.name) p.judgementVote = 'abstain';
      }        
      lynched.judgementVotes = {guilty: 0, innocent: 0, abstain: Game.playercount};
      Game.phases.jumpTo('Judgement', false);
});

Game.on("factionalActionCancel", (canceled, newP) => {
   console.log(`${newP} has decided to carry out the action instead of ${canceled}`);
});

Game.on("end", winners => {
    console.log(`${winners} win!`);
})

Game.on("Judgement", () => {
    console.log(`${Game.ontrial.name}, it's time for your trial.`);
    const pls = Game.players.alive().random(3);
    const things = ['guilty', 'innocent'];
    for (let [, p] of pls) {
           const vote = things[Math.floor(Math.random()*things.length)];
           if (p.judgementVote) Game.ontrial.judgementVotes[p.judgementVote]--;
           p.judgementVote = vote;
           Game.ontrial.judgementVotes[vote]++;
    }
});

Game.on("Judgement-End", () => {
      if (Game.ontrial.judgementVotes.guilty > Game.ontrial.judgementVotes.innocent) {
           Game.ontrial.lynch();
           console.log(`${Game.ontrial} has been lynched! Votes: ${Game.players.map(p => `${p} => ${p.judgementVote}`)}`);
      }else {
          console.log(`${Game.ontrial} wasn't lynched!  Votes: ${Game.players.map(p => `${p} => ${p.judgementVote}`)}`);
          for (let [, p] of Game.players) {
            p.judgementVote = null;
            if (Game.ontrial.name == p.name) p.judgementVotes = null;
          }    
          Game.ontrial = null;
      }
});

Game.start();

