


class Interaction {
    constructor(data) {
        this.forRole = data.role;
        this.executor = data.executor;
    }

    exe(player1, player2, data) {
        return this.executor(player1, player2, data);
    }

}

class InteractionManager extends Map {
    constructor(presets) {
        super();
        if (presets) this.set(...presets);
    }

    set(...data) {
        for (let inte of data) {
            super.set(inte.role, new Interaction(inte));
        }
    }

    exe(role, you, targetter, data) {
        this.get(role).exe(you, targetter, data);
    }

}

module.exports = InteractionManager;