

module.exports = function(Game) {

     Game.events.on("Day-End", phase => {
          console.log("End of day 1!");
     });


     Game.events.on("Day", phase => {
          console.log(`It's Day ${phase.iterations}`);
     });

     Game.events.on("Night", phase => {
          console.log(`It's Night ${phase.iterations}`);
     });

     Game.events.on("Secret", phase => {
          console.log("Secret phase activated!");
     })

     Game.events.on("Night-End", phase => {
            Game.players.executeActions();
            Game.players.clearActions();
     });

     Game.events.on("checkWin", () => {
          if (Game.sides.sizeOf("Town") === 0) return "Mafia";
           if (Game.sides.sizeOf("Mafia") === 0) return "Town";
          return false; 
     });

     Game.events.on("win", side => {
          console.log(`${side.name} wins!`);
     })

     Game.events.on("setRole", player => {
        console.log(`${player} is ${player.role}`);
     });

     Game.events.on("setAction", player => {
         console.log(`${player} is going to ${player.role.actionType} ${player.action.target}`);
     });

     Game.events.on("setFactionAction", player => {
         console.log(`${player} is doing the factional kill!`);
     });

     Game.events.on("vote", (voter, votee) => {
           console.log(`${voter} has voted for ${votee}! ${votee} now has ${votee.votes} votes!`);
     });

     Game.events.on("majority", (lynched) => {
         lynched.invisible = true;
          Game.onTrial = lynched;
          Game.phases.jumpTo("Defense", true);
     });

     Game.events.on("Defense", () => {
          console.log(`${Game.onTrial}, you are now on trial!`);
          for ([, player] of Game.players) player.judge = "abstain";
     });

     Game.events.on("Judgement-End", () => {
         const guilties = Game.players.filter(p => p.judge === "guilty");
         console.log(guilties.size, Game.majority.value);
         if (guilties.size >= Game.majority.value) return Game.phases.jumpTo("Last Words");
         Game.phases.jumpTo("Night");
     });

     Game.events.on("Last Words-End", () => {
         console.log(`${Game.onTrial}, you have been lynched!`);
         Game.onTrial.kill();
         Game.onTrial.invisible = false;
         Game.onTrial = null;
         for ([, player] of Game.players) player.judge = "abstain";
     });

     Game.events.on("kill", (killer, target) => {
           console.log(`${target} was killed by ${killer}`)
     });
}