import {EventEmitter} from 'events';

export type callback<K, V> = (val: V, key: K) => any

export class Collection<K, V> extends Map {
      public find(fn: callback<K, V>) : V
      public some(fn: callback<K, V>) : Boolean
      public filter(fn: callback<K, V>) : Collection<K, V>
      public map(fn: callback<K, V>) : Array<V>
      public random(amount: Number) : V|Collection<K, V>
      public sweep(fn: callback<K, V>) : Collection<K, V>
      public split(fn: callback<K, V>) : Array<Collection<K, V>>
      public clone() : Collection<K, V>
      public keyArray() : Array<K>
      public valArray() : Array<V>
      public first() : V
      public last() : V
      public forEach(fn: callback<K, V>) : void
}

export class Role {
      constructor(name: String, data: {name: string, side: string, alignment: string, unique: boolean, blocked: boolean, amount: number, visits: boolean, factionalAction: boolean, action: (doer: Player, target: Player, other: Object) => void})
      public name: string
      public side: Side
      public alignment: string
      public unique: boolean
      public blocked: boolean
      public amount: number
      public visits: boolean
      public factionalAction: boolean
      public rolledFrom: Array<String>
      public attrs: Collection<string, any>
      public action: (doer: Player, target: Player, other: Object) => void
      public clone() : Role
      public addAttr(key: string, val: any) : Role
}

export class Side {
      constructor(name: String, data: {players: Array<Player>, roles: Array<Role>})
      public name: string
      public factionalActionExecutor?: Player
      public players: Collection<string, Player>
      public roles: Collection<string, Role>
      public clear() : void
      public toString() : string
}

export class Player {
     constructor(name: string, engine: Engine) 
     public name: string
     public role?: Role
     public engine: Engine
     public votes: Number
     public dead: boolean
     public votedFor?: Player
     public killedBy?: Player
     public votedBy: Collection<string, Player>
     public votingPower: number
     public action?: Action
     public actionHistory: Collection<string, Action>
     public visitors: Collection<string, Player>
     public roleAttrs: Collection<string, any>
     public votesFor(player: Player) : void
     public unvote() : void
     public kill(killer: Player) : void
     public lynch(way: string, emit: boolean) : void
     public clearData() : void
     public delete() : void
     public setAction(target: Player, other: {factionalAction: false}) : void
     public cancelAction() : void
     public setRole(role: Role) : void
     public toString() : string
}

export class Action {
     constructor(doer: Player, target: Player, other: {factionalAction: false})
     public doer: Player
     public target: Player
     public other: Object
     public factionalAction: boolean
     public cancel() : void
}

export class Phase {
      constructor(name: String, data: {first: boolean, amount: number, duration: number, next: string, evaluateActions: boolean, listenForMajority: boolean, listenForPlurality: boolean, lynchPlayer: boolean})
      public name: string
      public data: {first: boolean, amount: number, duration: number, next: string}
      public first: boolean
      public amount: number
      public duration: number
      public evaluateActions: boolean
      public next: string
      public listenForMajority: boolean
      public listenForPlurality: boolean
      public lynchPlayer: boolean
      public toString() : string
}

export class NoLynch {
      constructor(engine: Engine)
      public votes: number
      public votedBy: Collection<string, Player>
      public engine: Engine
      public lynch() : void
      public toString() : string
}

export class Settings {
      constructor(engine: Engine, data: {rolelist: Array<string>, stalemate: () => boolean, majority: boolean, plurality: boolean, rules: (role: Role, side: String, alignment: String) => boolean, priorityList: Object})
      public engine: Engine
      public rolelist: Array<string>
      public stalemate: () => boolean
      public majority: {enabled: boolean, value: number}
      public plurality: boolean
      public scaleMajority() : void
}

export class PhaseCollector extends Collection<string, Phase> {
      constructor(engine: Engine)
      public engine: Engine
      public current?: Phase
      public firstPhase?: Phase
      public get(key: string) : Phase
      public set(name: string, data: {first: boolean, amount: number, duration: number, next: string, evaluateActions: boolean, listenForPlurality: boolean, listenForMajority: boolean, lynchPlayer: boolean}) : Phase
      public endCurrent() : void
      public jumpTo(phaseName: string, clear: boolean, emitEnd: boolean) : void
}

export class PlayerCollector extends Collection<string, Player> {
      constructor(engine: Engine)
      public engine: Engine
      public nolynch: NoLynch
      public get(name: string) : Player
      public set(name: string) : Player
      public delete(name: string) : void
      public dead(): Collection<string, Player>
      public alive(): Collection<string, Player>
      public fromSide(sideName: string, dead: boolean) : Collection<string, Player>
      public fromAlign(sideName: string, alignName: string, dead: boolean) : Collection<string, Player>
}

export class RoleCollector extends Collection<string, Role> {
      constructor(engine: Engine)
      public engine: Engine
      public original: Collection<string, Role> 
      public get(name: string) : Role
      public rules: (role: Role, side: String, alignment: String) => boolean
      public set(name: string, data: {name: string, side: string, alignment: string, unique: boolean, blocked: boolean, amount: number, visits: boolean, factionalAction: boolean, action: (doer: Player, target: Player, other: Object) => void}) : Role
      public parseSet(object: Object) : Role
      public setRules(rules: (role: Role, side: String, alignment: String) => boolean) : void
      public any() : ?Role
      public fromSide(side: String) : ?Role
      public fromAlign(side: string, alignment: String) : ?Role
      public byName(name: string) : string
      public fill(side: string, alignment: string) : ?Role
      public fillRolelist(rolelist: Array<string>) : {names: Array<string>, roles: Collection<string, Role>}
}

export class SideCollector extends Collection<string, Side> {
      constructor(engine: Engine)
      public engine: Engine
      public get(name: string) : Side
      public set(name: string, data: {players: Array<Player>, roles: Array<Role>}) : Side
      public addPlayer(side: string, player: Player) : void
      public removePlayer(side: string, player: string) : void
      public sizeOf(side: string) : number
}

export class ActionManager {
      constructor(engine: Engine)
      public engine: Engine
      public priorityList?: PriorityList
      public setPriorityList(list: Object) : void
      public evaluate(list?: Object) : void
}

export class PriorityList {
     constructor(data: Object)
     public forEach(fn: (element: any, position: number, microposition: number) => void) : void
     public order(...list : String) : Array<String>
     public highestOf(...list: String) : String
     public lowestOf(...list: String) : String
     public compare(item1: String, item2: String) : "higher"|"lower"
}

export class Timer {
      constructor(engine: Engine)
      public engine: Engine
      public paused: boolean
      public elapsed: number
      public startedAt?: number
      public loop(fn: (this: Timer) => void) : void
      public timeLeft() : {minutes: number, seconds: number}
      public pause() : void
      public resume() : void
      public stop() : void
      public reset() : void
}

export class Engine {
     constructor(settings: {rolelist: Array<string>, stalemate: () => boolean, majority: boolean, plurality: boolean, rules: (role: Role, side: String, alignment: String) => boolean, priorityList: Object})
     public players: PlayerCollector
     public roles: RoleCollector
     public sides: SideCollector
     public phases: PhaseCollector
     public timer: Timer
     public actionManager: ActionManager
     public settings: Settings
     public started: boolean
     public playercount: number
     public rolesInGame: Array<String>
     public roll(rolelist: Array<String>) : void
     public start() : void
     public clear() : void
     public on(event: "start",  listener: () => void) : void
     public on(event: "setRole", listener: (player: Player) => void) : void
     public on(event: "vote", listener: (voter: Player, votee: Player) => void) : void
     public on(event: "unvote", listener: (voter: Player, votee: Player) => void) : void
     public on(event: "kill", listener: (victim: Player, killer: Player) => void) : void
     public on(event: "lynch", listener: (player: Player, way: "majority"|"plurality") => void) : void
     public on(event: "deletePlayer", listener: (player: Player) => void) : void
     public on(event: "setAction", listener: (player: Player) => void) : void
     public on(event: "cancelAction", listener: (player: Player) => void) : void
     public on(event: "cancelAction", listener: (player: Player) => void) : void
     public on(event: "tick", listener: () => void) : void
     public on(event: "executeAction", listener: (player: Player) => void) : void
     public on(event: "factionalActionCancel", listener: (canceled: Player, newP: Player) => void) : void
     public on(event: "end", listener: (winner: Side) => void) : void
     public on(event: "Day", listener: (phase: Phase) => void) : void
     public on(event: "Night", listener: (phase: Phase) => void) : void
}




