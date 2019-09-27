class PriorityList {
    constructor(data, og = true) {
         for (let n in data) {
             this[n] = data[n];
         }
         if (og) this.original = new PriorityList(data, false);
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
           if (val) {
           if (val instanceof Array) for (let i=0;i < val.length; i++) {
               if (items.includes(val[i])) res = val[i];
           }
           else if (items.includes(val)) res = val;
       }
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

     delete(item) {
         item = this.get(item);
         if (this[item.index] instanceof Array) this[item.index].splice(item.subIndex, 1);
         else this[item.index] = null;
     }

     insert(item, index, subIndex) {
         if (this[index] instanceof Array) this[index].splice(subIndex || 0, 0, item);
         else this[index] = item;
     }

     move(item, index, subIndex) {
         item = this.get(item);
         if (this[index] instanceof Array && (subIndex == undefined || subIndex == null)) subIndex = 0;
         if (!(this[index] instanceof Array) && this[index] != null) this[index] = [this[index]];
         (this[item.index] instanceof Array) ? this[item.index].splice(item.subIndex, 1) : this[item.index] = null;
         (!(subIndex == undefined || subIndex == null)) ? this[index].splice(subIndex, 0, item.value) : this[index] = item.value;
         return () => {
           this.move(item.value, item.index, item.subIndex);
       }
     }

     switch(item1, item2) {
         item1 = this.get(item1);
         item2 = this.get(item2);
         this.delete(item1.value);
         this.move(item2.value, item1.index, item1.subIndex);
         this.insert(item1.value, item2.index, item2.subIndex);
     }

     clone() {
         const re = {};
         for (let index in this) {
             re[index] = this[index];
         }
         return new PriorityList(re);
     }

}


module.exports = PriorityList;