


class Arrangement {
    constructor(data) {
        this.id = data.id;
        this.executor = data.executor;
        this.at = data.at;
        this.checker = data.checker;
    }

    exe() {
        if (this.checker && !this.checker()) return;
        this.executor();
    }


}

module.exports = Arrangement;