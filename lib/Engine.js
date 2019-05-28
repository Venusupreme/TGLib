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
       this.players = new PlayerCollector(this);
       this.sides = new SideCollector(this);
       this.roles = new RoleCollector(this);
       this.phases = new PhaseCollector(this);
       this.timer = new Timer(this);
       this.playercount = 0;
       this.actionManager = new ActionManager(this);
       this.settings = new Settings(this, settings);
       this.rolesInGame = [];
       this.started = false;
   }

   roll(rolelist = this.settings.rolelist) {
       this.settings.rolelist = rolelist;
       const filled = this.roles.fillRolelist(rolelist);
       this.rolesInGame = filled.names;
       for (let roleName of filled.names) {
           let player = this.players.filter((p) => !p.role).random();
           player.setRole(filled.roles.get(roleName));
       }
   } 

   start() {
       this.started = true;
       this.emit("start");
       this.roll();
       this._set = false;
       this.timer.loop(() => {
            if (this.timer.elapsed == 0.1 || this.timer.elapsed == 0.0) {
                if (!this._set) {
               if (!this.phases.current) this.phases.current = this.phases.firstPhase; // Set the first phase
                this.settings.scaleMajority(); // Scale the majority
                this._set = true;
                this.emit(this.phases.current.name, this.phases.current, false);
                }
            }
             let majCheck = this.players.find(p => p.votes == this.settings.majority.value);
             if (!majCheck) majCheck = (this.players.nolynch.votes == this.settings.majority.value) ? this.players.nolynch:null;
             if (majCheck && this.settings.majority.enabled) { // Check if there is anyone who has hit the majority vote
                 majCheck.lynch("majority"); // Lynch the player
                  this.phases.endCurrent(); // End the phase
                  this._set = false;
             }else 
             if (this.timer.elapsed == this.phases.current.duration) { // Check if it's the end of the phase
                 if (this.settings.plurality) { // Check if plurality is enabled
                       const p = this.players.max('votes') // Get the player with the highest votes
                       p.lynch("plurality") // Lynch the player
                 }
                 this.phases.endCurrent() // If there is no plurality... just end the day
                 this._set = false;
             }
             let win = this.settings.stalemate();
             if (win) { // If the win stalemate returns true... end the game!
                 this.emit("end", this.sides.get(win) || win); 
                 this.timer.stop(); // Stop the timer
                  this.clear() // Clear the engine.. WIP!
             }
             this.emit("tick"); 
       });
   }

   clear() {
       this.started = false;
       this.players.clear();
       this.roles.setByName(this.roles.original.valArray());
       for (let [, val] of this.phases) {
            val.amount = val.data.amount;
       }
       for (let [, val] of this.sides) {
           val.clear();
       }
      this.playercount = 0;
      this.rolesInGame = [];
   }

   
}

module.exports = Engine;
