
class Action {
    constructor(doer, target, other) {
         this.doer = doer;
         this.target = target;
         this.other = other;
         this.roleblocked = false;
         this.factionalAction = (other.factionalAction == undefined) ? this.doer.role.factionalAction:other.factionalAction;
        if (other.visits == undefined) other.visits = doer.role.visits;
        if (other.visits) this.target.visitors.set(doer.name, doer);
         if (doer.role.side.factionalActionExecutor != null && this.factionalAction) {
             let them = doer.role.side.factionalActionExecutor;
             them.cancelAction();
             doer.engine.emit("factionalActionCancel", them, doer);
         }else if (this.factionalAction) doer.role.side.factionalActionExecutor = doer;
    }

    cancel() {
        if (this.target.visitors.has(this.doer.name)) this.target.visitors.delete(this.doer.name);
        if (this.factionalAction && this.doer.role.side.factionalActionExecutor && this.doer.role.side.factionalActionExecutor.name == this.doer.name) this.doer.role.side.factionalActionExecutor = null;
    }
}

module.exports = Action;