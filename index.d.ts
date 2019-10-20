import {EventEmitter} from 'events';

 class Listener extends EventEmitter {
      emitReturn(event: string, ...args: any) : any
}

 type callbackFetch<K, V> = (val: V, key: K) => boolean
 type callbackCheck<K, V> = (val: V, key: K) => any

 class Unit<V> extends Map<String, V> {
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

 class Side {
      public name: string
      public engine: Engine
      public members: Unit<Player>
      public size: number
      public setFactionAction(value?: Player) : void
      public toString() : string
}

 class Role {
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
      public priority: Array<Number>
      private common: {}
      public setPriority(index: Number, subIndex: Number) : void
      public toString(): string
      public copy(rolledFrom: string) : Role
}

 class Action {
      public player: Player
      public target: Player
      public data: {}
      public factionAction: boolean
      public save() : void
      public cancel(): void
      public clear(): void
      public exe() : void
}

 class Phase {
   public name: string
   public engine: Engine
   public isFirst: boolean
   public duration: number
   public iterations: number
   public next: string
   public arrangements: Unit<Arrengement>
   public begin(): void
   public end(): void
   public schedule(id: string, data: {executor: () => void, at?: number, when?: number, checker?: () => boolean}) : Arrangement
   public checkForArrangements() : void
   public toString(): string
}

 class Player {
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
    public canKill(target: Player) : boolean
    public kill(killer?: Player) : void
    public revive(reviver?: Player) : void
    public setAction(target: Player, data: {factionAction?: Boolean}) : void
    public setRole(role: Role) : void
    public toString() : string
}

 class NoLynch {
      public name: string
      public votes: number
      public votedBy: Unit<Player>
      public nolynch: true
      public dead: false
      public clear() : void
      public toString() : string
}

 class Event {
      public name: string
      public executable: (...args: any) => any
      public exe(...args: any) : any
      public extendBefore(fn: (...args) => any) : void
      public extendAfter(fn: (...args) => any) : void
}

 class EventListener {
      public events: Unit<Event>
      public on(event: string, fn: (...args: any) => any) : void
      public emit(event: string, ...args: any) : any
      public clear() : void
      public off(event: string) : void
      public get(event: string) : Event
      public extendAll(when: "before"|"after", fn: (...args: any) => any) : void
      public on(event: "start", fn: () => any) : void
      public on(event: "setRole", fn: (player: Player) => any) : void
      public on(event: "setAction", fn: (player: Player) => any) : void
      public on(event: "kill", fn: (player: Player, killer: Player) => any) : void
      public on(event: "setVotePower", fn: (player: Player) => any) : void
      public on(event: "majority", fn: (lynched: Player) => any) : void
      public on(event: "plurality", fn: (lynched: Player) => any) : void
      public on(event: "cancelAction", fn: (player: Player) => any) : void
      public on(event: "setFactionAction", fn: (player: Player) => any) : void
      public on(event: "cancelFactionAction", fn: (player: Player) => any) : void
      public on(event: "revive", fn: (player: Player, reviver: Player) => any) : void
      public on(event: "vote", fn: (voter: Player, votee: Player) => any) : void
      public on(event: "unvote", fn: (unvoter: Player, unvotee: Player) => any) : void
      public on(event: "checkWin", fn: () => string|false) : void
}

 class Majority {
      public engine: Engine
      public value: number
      public update(): void
      public check() : Player|null
      public valueOf() : number
      public toString(): string
}

 class Arrangement {
      public phase: Phase
      public id: string
      public executor: () => any
      public checker?: () => boolean
      public at: number
      public when: number
      public exe() : void
      public overwrite(data: {executor?: () => any, checker?: () => boolean, at?: number, when?: "start"|"end"}) : void
      public cancel() : void
}

 class Timer {
      public engine: Engine
      public elapsed: number
      public startedAt: number
      public loop(fn: () => any) : void
      public timeLeft() : {minutes: number, seconds: number}
      public stop() : void
      public reset(): void
}

 class SideCollector extends Unit<Side> {
     public engine: Engine
     public set(name: string) : Side
     public sizeOf(side: string) : number
}

 class RoleCollector extends Unit<Role> {
      public engine: Engine
      public set(...roles: Array<{}>) : void
      public orderRolesByPriority() : Array<Role>
      public rules: (side: string, alignment?: string|null, role: Role) => boolean
      public any(): Role
      public getByName(name: string): Role
      public fromRandomSide(side: string) : Role
      public fromAlignment(side: string, alignment: string) : Role
      public fill(side: string, alignment: string) : Role
      public validateFill(str: string) : Boolean
      public fillRolelist(rolelist: Array<String>) : Array<Role>
}

 class PhaseCollector extends Unit<Phase> {
      public engine: Engine
      public current: Phase
      public first: Phase
      public set(...data: Array<Any>) : void
      public move(end: boolean) : void
      public jumpTo(phase: string, emitEnd: boolean) : void
}

 class PlayerCollector extends Unit<Player> {
      public engine: Engine
      public nolynch: NoLynch
      public set(name: string) : Player
      public all(): Array<Player|NoLynch>
      public fromSide(side: string) : Unit<Player>
      public withRole(role: string) : Unit<Player>
      public clearVotes() : void
      public clearActions(): void
      public executeActions(): void
}

 class Engine {
     public started: boolean
     public players: PlayerCollector
     public roles: RoleCollector
     public phases: PhaseCollector
     public sides: SideCollector
     public timer: Timer
     public events: EventListener
     public rolelist: Array<String>
     public majority: Majority
     public roll(rolelist: Array<string>) : void
     public start() : void
}

/**export interface Exported {
      static Structrues: {
            Action: Action,
            NoLynch: NoLynch,
            Phase: Phase,
            Player: Player,
            Role: Role,
            Side: Side
        }
        static Mechanics: {
            Arrangement: Arrangement,
            EventListener: EventListener,
            Majority: Majority,
            Timer: Timer
        }
        static Collectors: {
            PhaseCollector: PhaseCollector,
            PlayerCollector: PlayerCollector,
            RoleCollector: RoleCollector,
            SideCollector: SideCollector
        }
        static DataStorage: {
            Unit: Unit,
            PriorityList: PriorityList
        }
        static Engine: Engine
} **/


