


class Arrangement {
    constructor(data) {
        this.id = data.id;
        this.executor = data.executor;
        this.checker = data.checker;
        this.when = data.when || 1;
        this.phase = data.phase;
        this.at = data.at || this.phase.iterations;
    }

    exe() {
        if (this.checker && !this.checker()) return;
        this.executor();
        this.phase.arrangements.remove(this.id);
    }

    overwrite(data) {
        this.executor();
        if (data.executor) this.executor = data.executor;
        if (data.checker) this.checker = data.checker;
        if (data.at) this.at = data.at;
        if (data.when) this.when = data.when;
    }

    cancel() {
        this.phase.arrangements.remove(this.id);
    }

}

module.exports = Arrangement;