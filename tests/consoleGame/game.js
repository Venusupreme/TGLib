

const Mafia = require("../../index.js");

const Game = new Mafia.Engine();

Game.roles.set(...require("./roles.js"));
Game.rolelist = ["Sheriff", "Lookout", "Goon"];
for (let phase of require("./phases.js")) Game.phases.set(phase);
require("./events.js")(Game);

const player1 = Game.players.set("Volen");
const player2 = Game.players.set("Arzu");
const player3 = Game.players.set("Niko");

Game.phases.get("Night").schedule("test", {
    executor: () => {
        const sheriff = Game.players.find(p => p.role.name === 'Sheriff');
        const lo = Game.players.find(p => p.role.name === 'Lookout');
        sheriff.setAction(lo);
    },
    when: 3,
    at: 1
});

/**Game.phases.get("Judgement").schedule("setvotes", {
   executor: () => {
       player1.judge = "guilty";
       player3.judge = "innocent";
   },
   at: Game.phases.get("Judgement").iterations,
   when: 5
}); **/

Game.start();


