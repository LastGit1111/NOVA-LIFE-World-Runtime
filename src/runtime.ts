export type WorldSpec = { schema_version:string; world_id:string; world_type:string; zones:Array<{id:string;name:string}>; [key:string]:unknown };
export type RuntimeEvent = { type:string; player_id:string; at:string; data?:Record<string,unknown> };

export class NovaRuntime {
  readonly world: WorldSpec;
  readonly events: RuntimeEvent[] = [];
  private readonly profiles = new Map<string, { x:number; y:number; inventory:string[]; entitlements:string[] }>();
  private readonly presence = new Set<string>();
  private readonly blocked = new Set<string>();

  constructor(world: WorldSpec) { this.world = validateWorld(world); }
  join(playerId:string) { if (this.blocked.has(playerId)) throw new Error('player blocked'); this.profiles.set(playerId, this.profiles.get(playerId) ?? {x:0,y:0,inventory:[],entitlements:[]}); this.presence.add(playerId); return this.emit('arrival',playerId); }
  leave(playerId:string) { this.presence.delete(playerId); return this.emit('session_end',playerId); }
  move(playerId:string,x:number,y:number) { this.requirePlayer(playerId); if (![x,y].every(Number.isFinite)) throw new Error('coordinates must be finite'); const p=this.profiles.get(playerId)!; p.x=x; p.y=y; return { ...p }; }
  grantItem(playerId:string,itemId:string) { this.requirePlayer(playerId); const p=this.profiles.get(playerId)!; if(!p.inventory.includes(itemId)) p.inventory.push(itemId); return this.emit('inventory_grant',playerId,{item_id:itemId}); }
  grantEntitlement(playerId:string,entitlementId:string) { this.requirePlayer(playerId); const p=this.profiles.get(playerId)!; if(!p.entitlements.includes(entitlementId)) p.entitlements.push(entitlementId); return this.emit('entitlement',playerId,{entitlement_id:entitlementId}); }
  block(playerId:string,reason:string) { this.blocked.add(playerId); this.presence.delete(playerId); return this.emit('moderation',playerId,{action:'block',reason}); }
  snapshot(playerId:string) { this.requirePlayer(playerId); return { world_id:this.world.world_id, profile:{...this.profiles.get(playerId)!}, online_players:this.presence.size }; }
  private requirePlayer(id:string) { if(!this.profiles.has(id)) throw new Error('unknown player'); }
  private emit(type:string,player_id:string,data?:Record<string,unknown>) { const event={type,player_id,at:new Date().toISOString(),data}; this.events.push(event); return event; }
}

export function validateWorld(world:WorldSpec):WorldSpec { if(!world || typeof world!=='object' || !world.world_id || !world.schema_version || !Array.isArray(world.zones)) throw new Error('invalid WorldSpec'); return structuredClone(world); }
export function exportWorldSpec(world:WorldSpec):string { return JSON.stringify(validateWorld(world),null,2); }
export function importWorldSpec(serialized:string):WorldSpec { return validateWorld(JSON.parse(serialized) as WorldSpec); }
