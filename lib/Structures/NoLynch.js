

/**Represents a "Nolynch". Players vote for this class if they want to skip voting. It's identical to the player class in terms of voting. */

class NoLynch {
  constructor(engine) {
        this.engine = engine;
        this.votes = 0;
        this.nolynch = true;
        this.dead = false;
        this.name = "nolynch";
  }

  get votedBy() {
     return this.engine.players.filter(p => p.votedFor && p.votedFor.nolynch);
  }

  clear() {
    this.votes = 0;
  }

  toString() {
    return 'nolynch';
  }
  
}

module.exports = NoLynch;