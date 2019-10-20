
const EventListener = require("../Mechanics/EventListener.js");
const RoleCollector = require("../Collectors/RoleCollector.js");
const PlayerCollector = require("../Collectors/PlayerCollector.js");
const PhaseCollector = require("../Collectors/PhaseCollector.js");
const SideCollector = require("../Collectors/SideCollector.js");
const Timer = require("../Mechanics/Timer.js");
const Majority = require("../Mechanics/Majority.js");

class Engine {
    constructor(data = {}) {
        this.events = new EventListener();
        this.players = new PlayerCollector(this);
        this.sides = new SideCollector(this);
        this.phases = new PhaseCollector(this, data.phases);
        this.roles = new RoleCollector(this, data.roles);
        this.timer = new Timer(this);
        this.majority = new Majority(this);
        this.started = false;
        this.rolelist = data.rolelist || [];
    }

    roll(rolelist = this.rolelist) {
        const roles = this.roles.fillRolelist(rolelist);
        for (let role of roles) {
            const player = this.players.filter(p => !p.role).random();
            if (player) player.setRole(role);
        }
        this.roles.orderRolesByPriority();
    }

    start() {
        this.events.emit("start");
        this.started = true;
        this.majority.update();
        this.roll();
        this.timer.loop(() => {
            if (!this.phases.current) this.phases.current = this.phases.first;
            if (this.timer.elapsed === 0.1) this.phases.move(false)
            const win = this.events.emit("checkWin");
            if (win) {
                this.events.emit("win", this.sides.get(win) || win);
                this.timer.stop();
            }
            const lynchedM = this.majority.check();
            if (lynchedM) this.events.emit("majority", lynchedM);
            if (this.timer.elapsed === this.phases.current.duration) {
              /**  const lynchedP = this.players.all().find(p => !p.dead && !p.invisible && p.votes === Math.max(...this.players.all().map(p => p.votes > 0))); PLURLAITY
                if (lynchedP && lynchedP.votes > 0) this.events.emit("plurality", lynchedP); PLURALITY**/
                this.phases.move(true)
            }
            if (this.phases.current) this.phases.current.checkForArrangements();
            if (this.jumpingTo) this.jumpingTo = undefined;
        }); 
    }


}

module.exports = Engine;