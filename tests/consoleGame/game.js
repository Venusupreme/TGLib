

const Mafia = require("../../index.js");

const Game = new Mafia.Engine();

Game.roles.set(...require("./roles.js"));
Game.priorities = ["Veteran", "Escort", "Framer", "Sheriff", "Vigilante", "Goon"]
Game.rolelist = ["Sheriff", "Framer", "Citizen"];
for (let phase of require("./phases.js")) Game.phases.set(phase);
require("./events.js")(Game);

const player1 = Game.players.set("Volen");
const player2 = Game.players.set("Arzu");
const player3 = Game.players.set("Niko");

Game.phases.get("Day").schedule("voteout", {
   executor: () => {
       player1.votesFor(player2);
       player3.votesFor(player2);
   },
   at: 1,
   when: 10
});

Game.phases.get("Judgement").schedule("setvotes", {
   executor: () => {
       player1.judge = "guilty";
       player3.judge = "innocent";
   },
   at: Game.phases.get("Judgement").iterations,
   when: 5
});

Game.start();

