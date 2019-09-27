
const EventListener = require("../Mechanics/EventListener.js");
const RoleCollector = require("../Collectors/RoleCollector.js");
const PlayerCollector = require("../Collectors/PlayerCollector.js");
const PhaseCollector = require("../Collectors/PhaseCollector.js");
const SideCollector = require("../Collectors/SideCollector.js");
const Timer = require("../Mechanics/Timer.js");
const Majority = require("../Mechanics/Majority.js");

class Engine {
    constructor() {
        this.events = new EventListener();
        this.roles = new RoleCollector(this);
        this.players = new PlayerCollector(this);
        this.phases = new PhaseCollector(this);
        this.sides = new SideCollector(this);
        this.timer = new Timer(this);
        this.majority = new Majority(this);
        this.started = false;
        this.rolelist = [];
    }

    roll(rolelist = this.rolelist) {
        const roles = this.roles.fillRolelist(rolelist);
        for (let role of roles) {
            const player = this.players.filter(p => !p.role).random();
            if (player) player.setRole(role);
        }
    }

    start() {
        this.events.emit("start");
        this.started = true;
        this.roll();
        this.timer.loop(() => {
            if (!this.phases.current) this.phases.current = this.phases.first;
            if (this.timer.elapsed === 0.1) this.phases.move(false)
            const win = this.events.emit("checkWin");
            if (win) {
                this.events.emit("win", this.sides.get(win) || win);
                this.timer.stop();
            }
            if (this.timer.elapsed === this.phases.current.duration) this.phases.move(true)
        }); 
    }

}

const Game = new Engine();

Game.roles.set({name: "Jailor", side: "Town", alignment: "Invest", amount: 2});
Game.roles.set({name: "Investigator", side: "Town", alignment: "Invest", unique: true});
Game.roles.set({name: "Sheriff", side: "Mafia", alignment: "Invest", unique: true});

const Me = Game.players.set("Google");
const Hidden = Game.players.set("Hidden");
const BS = Game.players.set("BS");

Game.events.on("setRole", player => {
    console.log(`${player.name} is ${player.role.name}`);
});

Game.events.on("Day", phase => {
    if (phase.iterations === 2) return Game.phases.jumpTo("Secret", true);
    console.log(`It's Day ${phase.iterations}`);
});

Game.events.on("Night", phase => {
    console.log(`It's Night ${phase.iterations}`);
  });

Game.events.on("checkWin", () => {
   if (Game.sides.sizeOf("Town") === 0) return "Mafia";
   return null;
});

Game.events.on('Secret', () => {
   console.log("THis is a secret!")
});
Game.rolelist = ["Any", "Any", "Any"];

Game.phases.set({name: "Day", duration: 5, isFirst: true, next: "Night"});
Game.phases.set({name: "Night", duration: 5, next: "Day"})
Game.phases.set({name: "Secret", duration: 10, next: "Day"});

Game.phases.get("Night").at("aa", {executor: () => console.log("TEST"), at: 2, when: "end"});


Game.start();

