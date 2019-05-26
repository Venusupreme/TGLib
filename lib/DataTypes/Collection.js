

class Collection extends Map {
      constructor(objs, ite) {
          super(ite);
          if (objs) {
              for (let val of objs) {
                   this.set(val.name, val);
              }
          }
      }

      find(fn) {
          for (let [key, val] of this) {
             if (fn(val, key, this)) return val;
          }
          return null;
      }

      some(fn) {
        for (let [key, val] of this) {
            if (fn(val, key, this)) return true;
         }
         return false;
      }

      filter(fn) {
          const res = new Collection();
          for (let [key, val] of this) {
            if (fn(val, key, this)) res.set(key, val)
         }
         return res;
      }

      map(fn) {
          const res = [];
          for (let [key, val] of this) {
            res.push(fn(val, key, this))
         }
         return res;
      }

      random(amount = 1) {
          amount = Math.min(amount, this.size)
          let res = new Collection();
          let keys = this.keyArray();
          while (amount != res.size) {
              let rng = keys[Math.floor(Math.random()*keys.length)];
             if (!res.has(rng)) res.set(rng, this.get(rng));
          }
          if (res.size == 1) return res.first();
          return res;
      }

      max(prop) {
          const mapped = Math.max(...this.map(thing => thing[prop]));
          return this.find(p => p[prop] == mapped);
      }

      keyArray() {
          return [...this.keys()];
      }

      valArray() {
          return [...this.values()];
      }

      first() {
         return this.valArray()[0];
      }

      last() {
          return this.valArray()[this.size - 1];
      }

      remove(key) {
           return this.delete(key);
      }
}

module.exports = Collection;