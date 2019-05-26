import {EventEmitter} from 'events';

export type callback<K, V> = (val: V, key: K, this: Collection) => any

export class Collection<K, V> extends Map {
      public find(fn: callback<K, V>) : V
      public some(fn: callback<K, V>) : Boolean
      public filter(fn: callback<K, V>) : Collection<K, V>
      public map(fn: callback<K, V>) : Array<V>
      public random(amount: Number) : V|Collection<K, V>
      public keyArray() : Array<K>
      public valArray() : Array<V>
      public first() : V
      public last() : V
}




