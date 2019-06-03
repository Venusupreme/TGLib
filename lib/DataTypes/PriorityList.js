/**
 * How a priority list should look like:
 * 
 *{
 * 0: ['Jailor', 'Escort'],
 * 1: ['Something', 'AnotherThing'],
 * 2: Single_things_do_not_require_arrays,
 * }
 * 
 */

 class PriorityList {
     constructor(data) {
          for (let n in data) {
              this[n] = data[n];
          }
     }

     get(value) {
        for (let n in this) {
            let val = this[n];
            if (val instanceof Array) for (let i=0;i < val.length; i++) {
                if (value == val[i]) return {index: n, subIndex: i, value: val[i]}
            }
            else if (value == val) return {index: n, value: val, subIndex: null}
        }
     }

     forEach(fn) {
         for (let n in this) {
             let val = this[n];
             if (val instanceof Array) for (let i=0;i < val.length; i++) fn(val[i], n, i);
             else fn(val, n, 0);
         }
        }

      highestOf(...items) {
        for (let n in this) {
            let val = this[n];
            if (val instanceof Array) for (let i=0;i < val.length; i++) {
                if (items.includes(val[i])) return val[i];
            }
            else if (items.includes(val)) return val;
        }
      }

      lowestOf(...items) {
          let res = null;
          for (let n in this) {
            let val = this[n];
            if (val instanceof Array) for (let i=0;i < val.length; i++) {
                if (items.includes(val[i])) res = val[i];
            }
            else if (items.includes(val)) res = val;
        }
        return res;
      }

      compare(value1, value2) {
         value1 = this.get(value1);
         value2 = this.get(value2);
         if (!value1 || !value2) return false;
         console.log(value1, value2);
         if (value1.index == value2.index) {
            if (value1.subIndex > value2.subIndex) return 'higher'
            if (value1.subIndex < value2.subIndex) return 'lower'
         }else {
         if (value1.index > value2.index) return 'lower'
         if (value1.index < value2.index) return 'higher'
         }
      }

      order(...list) {
          const res = [];
          this.forEach(v => {
               if (list.includes(v)) res.push(v);
          });
          return res;
      }

 }



module.exports = PriorityList;