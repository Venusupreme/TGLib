


class PriorityList extends Map {
   constructor(priorities) {
       super();
       for (let priority in priorities) {
           const val = (priorities[priority] instanceof Array) ? priorities[priority]:[priorities[priority]];
           super.set(priority, val);
       }
       this.undo = null;
   }

   set(value, index = 1, subIndex = 0) {
       if (!this.has(index)) return super.set(index, [value])
       this.get(index).splice(subIndex, 0, value);
   }

   forEach(fn) {
       for (let [pri, val] of this) {
           for (let subVal of val) fn(subVal);
       }
   }

   move(value, index, subIndex) {

   }

}