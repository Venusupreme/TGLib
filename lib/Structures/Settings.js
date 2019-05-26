

class Settings {
    constructor(engine, data = {rolelist: [], stalemate: () => false, majority: true, plurality: true}) {
        this.engine = engine;
        this.rolelist = data.rolelist
        this.stalemate = data.stalemate 
        this.majority = {enabled: Boolean(data.majority), value: data.majority}
        this.plurality = data.plurality
    }

    scaleMajority() {
        if (this.engine.playercount % 2 == 0) return this.majority.value = (this.engine.playercount / 2) + 1; 
        this.majority.value = Math.ceil(this.engine.playercount / 2);
    }
}

module.exports = Settings;