
const Unit = require("../DataStorage/Unit.js");

/**Represents a "Nolynch". Players vote for this class if they want to skip voting. It's identical to the player class in terms of voting. */

class NoLynch {
  constructor() {
        this.votes = 0;
        this.votedBy = new Unit();
        this.nolynch = true;
  }
}

module.exports = NoLynch;