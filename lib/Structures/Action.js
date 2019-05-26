


class Action {
    constructor(doer, target, other) {
         this.doer = doer;
         this.target = target;
         this.other = other;
         if (doer.role.visits) this.target.visitors.set(doer.name, doer);
         this.factionalAction = other.factionalAction;
         if (doer.role.side.factionalActionExecutor != null) {
             let them = doer.role.side.factionalActionExecutor;
             them.cancelAction();
             doer.engine.emit("factionalActionCancel", them, doer);
         }
         doer.role.side.factionalActionExecutor = doer;
    }

    cancel() {
        if (this.target.visitors.has(this.doer.name)) this.target.visitors.delete(this.doer.name);
        if (this.factionalAction) this.doer.role.side.factionalActionExecutor = null;
    }
}

module.exports = Action;