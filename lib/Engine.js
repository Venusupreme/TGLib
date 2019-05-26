const PlayerCollector = require("./Collectors/PlayerCollector.js");
const SideCollector = require("./Collectors/SideCollector.js");
const RoleCollector = require("./Collectors/RoleCollector.js");
const PhaseCollector = require("./Collectors/PhaseCollector.js");
const Collection = require("./DataTypes/Collection.js");
const ActionManager = require("./ActionManager.js");
const Settings = require("./Structures/Settings.js");
const EventEmitter = require("events").EventEmitter;
const Timer = require("./Timer.js");

class Engine extends EventEmitter {
   constructor(settings) {
       super();
       this.settings = new Settings(this, settings);
       this.players = new PlayerCollector(this);
       this.sides = new SideCollector(this);
       this.roles = new RoleCollector(this);
       this.phases = new PhaseCollector(this);
       this.timer = new Timer(this);
       this.playercount = 0;
       this.actionManager = new ActionManager(this);
       this.rolesInGame = new Collection();
       this.started = false;
   }

   roll(rolelist = this.settings.rolelist) {
       this.settings.rolelist = rolelist;
       const filled = this.roles.fillRolelist(rolelist);
       for (let roleName of filled.names) {
           let player = this.players.filter((p) => !p.role).random();
           player.setRole(filled.roles.get(roleName));
       }
   } 

   start() {
       this.started = true;
       this.emit("start");
       this.roll();
       let set = false;
       this.timer.loop(() => {
            if (this.timer.elapsed == 0.1 || this.timer.elapsed == 0.0) {
                if (!set) {
               if (!this.phases.current) this.phases.current = this.phases.firstPhase; // Set the first phase
                this.settings.scaleMajority(); // Scale the majority
                set = true;
                this.emit(this.phases.current.name, this.phases.current);
                }
            }
             const majCheck = this.players.find(p => p.votes == this.settings.majority.value) || (this.players.nolynch.votes == this.settings.majority.value) ? this.players.nolynch:null;
             if (majCheck && this.settings.majority.enabled) { // Check if there is anyone who has hit the majority vote
                 majCheck.lynch("majority"); // Lynch the player
                  this.phases.endCurrent(); // End the phase
                  set = false;
             }else 
             if (this.timer.elapsed == this.phases.current.duration) { // Check if it's the end of the phase
                 if (this.settings.plurality) { // Check if plurality is enabled
                       const p = this.players.max('votes') // Get the player with the highest votes
                       p.lynch("plurality") // Lynch the player
                 }
                 this.phases.endCurrent() // If there is no plurality... just end the day
                 set = false;
             }
             let win = this.settings.stalemate();
             if (win) { // If the win stalemate returns true... end the game!
                 this.emit("end", this.sides.get(win) || win); 
                 this.timer.stop(); // Stop the timer
                  this.clear() // Clear the engine.. WIP!
             } 
       });
   }

   clear() {
       return true;
   }

   
}

const Game = new Engine({
      majority: true,
      plurality: false,
      rolelist: ["Wolf", "Escort", "Wolf"],
      stalemate: () => {
          if (Game.sides.sizeOf('Wolf') == 0) return 'Town';
          if (Game.sides.sizeOf("Town") == 0) return 'Wolf';
      }
});

Game.roles.set("Citizen", {side: "Town", alignment: "Boring", amount: 4});
Game.roles.set("Wolf", {side: 'Wolf', alignment: "Evil", unique: false, action: (you, target) => target.kill(you)});
Game.roles.set("Escort", {side: "Town", alignment: "OP", unqiue: true, action: (you, target) => target.roleblocked = true});

Game.phases.set("Day", {duration: 10, first: true, next: 'Night'});
Game.phases.set("Night", {duration: 10, next: "Day"})

const Google = Game.players.set("Google");
const Hidden = Game.players.set("Hidden");
const BS = Game.players.set("BS");

Game.on("setRole", (p) => {
    console.log(`${p} is ${p.role}`)
});

Game.on("Day", phase => {
    console.log(`It's ${phase}. Majority: ${Game.settings.majority.value}`);
    if (phase.amount == 1) {
        Google.votesFor(Game.players.nolynch);
        BS.votesFor(Google);
        Hidden.votesFor(Google);
    }
});

Game.on("vote", (voter, votee) => {
     console.log(`${voter} has voted for ${votee}! ${votee} now has ${votee.votes} votes`)
});

Game.on("Night", phase => {
    console.log(`It's ${phase}`);
});

Game.on("Night-End", () => {
    Game.actionManager.evaluate({
         1: "Escort",
         2: "Wolf"
    });
})

Game.on("setAction", player => {
   console.log(`${player} set their action. Their target is ${player.action.target}`);
});

Game.on("kill", (killed, killer) => {
   console.log(`${killed} has been killed by ${killer.role.side.name}! Their role was ${killed.role}`);
}); 

Game.on("lynch", (lynched, way) => {
    if (lynched.name == 'nolynch') console.log("The majority has voted for a no lynch! Nobody has been lynched!");
   else console.log(`${lynched} has been lynched! They were a ${lynched.role}`);
});

Game.on("end", side => {
   console.log(`${side.name} wins!`);
});

Game.on("executeAction", player => {
   if (player.role.name == 'Escort') console.log(`${player} roleblocked ${player.action.target}`)
   if (player.role.name == 'Wolf') console.log(`${player} tried to attack ${player.action.target}`)
});

Game.on("factionalActionCancel", (canceled, newA) => {
   console.log(`${newA}'s action has overridden ${canceled}'s!`)
});

Game.start();

// CUrrent ISSUE: NOLYNCH IS ALWAYS LYNCHED!!!