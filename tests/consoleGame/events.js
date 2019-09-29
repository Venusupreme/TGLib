

module.exports = function(Game) {
     Game.events.on("Day", phase => {
          console.log(`It's Day ${phase.iterations}`);
     });

     Game.events.on("Night", phase => {
          console.log(`It's Night ${phase.iterations}`);
     });

     Game.events.on("Night-End", phase => {
            Game.players.executeActions();
            Game.players.clearActions();
     });

     Game.events.on("checkWin", () => {
          if (Game.sides.sizeOf("Mafia") === 0) return "Town";
          if (Game.sides.sizeOf("Town") === 0) return "Mafia";
          return false;
     });

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
          console.log(`${lynched}, you are now on trial!`);
          Game.phases.jumpTo("Defense", true);
     });
}