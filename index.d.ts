import {EventEmitter} from 'events';
import { StringDecoder } from 'string_decoder';

export class Listener extends EventEmitter {
      emitReturn(event: string, ...args: any) : any
}

export type callbackFetch<K, V> = (val: V, key: K) => boolean
export type callbackCheck<K, V> = (val: V, key: K) => any

export class Unit<V> extends Map<String, V> {
      public find(fn: callbackFetch<K, V>) : V
      public some(fn: callbackFetch<K, V>) : boolean
      public every(fn: callbackFetch<K, V>) : boolean
      public filter(fn: callbackFetch<K, V>) : Unit<V>
      public map(fn: callbackCheck<K, V>) : Array<V>
      public random(amount: number) : V|Unit<V>
      public sweep(fn: callbackFetch<K, V>) : Unit<V>
      public partition(fn: callbackFetch<K, V>) : Array<Unit<V>>
      public clone() : Unit<V>
      public keyArray() : Array<K>
      public valArray() : Array<V>
      public first() : V
      public last() : V
      public forEach(fn: callbackCheck<K, V>) : void
}

export class Side {
      public name: string
      public engine: Engine
      public members: Unit<Player>
      public size: number
      public setFactionAction(value?: Player) : void
      public toString() : string
}

export class Role {
      public name: string
      public engine: Engine
      public side: Side
      public alignment: string
      public rolledFrom?: string
      public unique: boolean
      public amount?: number
      public blocked: boolean
      public visits: boolean
      public factionAction: boolean
      public action?: (player: Player, target: Player, data: {}) => void
      public attack: number
      public defense: number
      private common: {}
      public toString(): string
      public copy(rolledFrom: string) : Role
}

export class Action {
      public player: Player
      public target: Player
      public data: {}
      public factionAction: boolean
      public save() : void
      public cancel(): void
      public clear(): void
      public exe() : void
}

export class Phase {
   public name: string
   public engine: Engine
   public isFirst: boolean
   public duration: number
   public iterations: number
   public next: string
   public arrangements: Unit<Arrengement>
   public begin(): void
   public end(): void
   public schedule(id: string, data: {executor: () => void, at: number, when: "start"|"end", checker?: () => boolean}) : Arrangement
   public toString(): string
}

export class Player {
    public name: string
    public role?: Role
    public dead: boolean
    public engine: Engine
    public votes: number
    public votedFor?: Player
    public votedBy: Unit<Player>
    public visitors: Unit<Player>
    public action?: Action
    public roleblocked: boolean
    public votePower: number
    public invisible: boolean
    public actionHistory: Unit<Action>
    public votesFor(player: Player) : void
    public unvote() : void
    public canKill(target: PLayer) : boolean
    public kill(killer?: Player) : void
    public revive(reviver?: Player) : void
    public setAction(target: Player, data: {factionAction?: Boolean}) : void
    public setRole(role: Role) : void
    public toString() : string
}

export class NoLynch {
      public name: string
      public votes: number
      public votedBy: Unit<Player>
      public nolynch: true
      public dead: false
      public clear() : void
      public toString() : string
}

export class Event {
      public name: string
      public executable: (...args: any) => any
      public exe(...args: any) : any
      public extendBefore(fn: (...args) => any) : void
      public extendAfter(fn: (...args) => any) : void
}

export class EventListener {
      public events: Unit<Event>
      public on(event: string, fn: (...args: any) => any) : void
      public emit(event: string, ...args: any) : any
      public clear() : void
      public off(event: string) : void
      public get(event: string) : Event
}

export class Majority {
      public engine: Engine
      public value: number
      public update(): void
      public check() : Player|null
      public valueOf() : number
      public toString(): string
}

export class Arrangement {
      public phase: Phase
      public id: string
      public executor: () => any
      public checker?: () => boolean
      public at: number
      public when: "start"|"end"
      public exe() : void
      public overwrite(data: {executor?: () => any, checker?: () => boolean, at?: number, when?: "start"|"end"}) : void
}

export class Timer {
      public engine: Engine
      public elapsed: number
      public startedAt: number
      public loop(fn: () => any) : void
      public timeLeft() : {minutes: number, seconds: number}
      public stop() : void
      public reset(): void
}

export class SideCollector extends Unit<Side> {
     public engine: Engine
     public set(name: string) : Side
     public sizeOf(side: string) : number
}

export class RoleCollector extends Unit<Role> {
      public engine: Engine
      public set(...roles: Array<{}>) : void
      public rules: (side: string, alignment?: string|null, role: Role) => boolean
      public any(): Role
      public getByName(name: string): Role
      public fromRandomSide(side: string) : Role
      public fromAlignment(side: string, alignment: string) : Role
      public fill(side: string, alignment: string) : Role
      public fillRolelist(rolelist: Array<String>) : Array<Role>
}

export class PhaseCollector extends Unit<Phase> {
      public engine: Engine
      public current: Phase
      public first: Phase
      public set(data: {}) : Phase
      public move(end: boolean) : void
      public jumpTo(phase: string) : void
}

export class PlayerCollector extends Unit<Player> {
      public engine: Engine
      public nolynch: NoLynch
      public set(name: string) : Player
      public all(): Array<Player|NoLynch>
      public fromSide(side: string) : Unit<Player>
      public withRole(role: string) : Unit<Player>
      public clearvVotes() : void
      public clearActions(): void
      public executeActions(priorities: Array<String>): void
}

export class Engine {
     public started: boolean
     public players: PlayerCollector
     public roles: RoleCollector
     public phases: PhaseCollector
     public sides: SideCollector
     public timer: Timer
     public events: EventListener
     public rolelist: Array<String>
     public majority: Majority
     public priorities?: Array<String>
     public roll(rolelist: Array<string>) : void
     public start() : void
}


