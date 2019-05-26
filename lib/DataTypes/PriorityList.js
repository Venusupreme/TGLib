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

     forEach(fn) {
         for (let n in this) {
             let val = this[n];
             if (val instanceof Array) for (let i=0;i < val.length; i++) fn(val[i], n, i);
             else fn(val, n, 0);
         }
     }

 }

module.exports = PriorityList;