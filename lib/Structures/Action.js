


class Action {
    constructor(doer, target, other) {
         this.doer = doer;
         this.target = target;
         this.other = other;
         if (doer.role.visits) this.target.visitors.set(doer.name, doer);
         if (doer.role.side.factionalActionExecutor != null && doer.role.factionalAction) {
             let them = doer.role.side.factionalActionExecutor;
             them.cancelAction();
             doer.engine.emit("factionalActionCancel", them, doer);
         }else if (doer.role.factionalAction) doer.role.side.factionalActionExecutor = doer;
    }

    cancel() {
        if (this.target.visitors.has(this.doer.name)) this.target.visitors.delete(this.doer.name);
        if (this.doer.role.factionalAction && this.doer.role.side.factionalActionExecutor && this.doer.role.side.factionalActionExecutor.name == this.doer.name) this.doer.role.side.factionalActionExecutor = null;
    }
}

module.exports = Action;