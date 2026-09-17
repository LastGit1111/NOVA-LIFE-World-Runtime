import test from 'node:test'; import assert from 'node:assert/strict';
import { NovaRuntime, exportWorldSpec, importWorldSpec } from '../src/runtime.ts';
import founders from '../worlds/founders-district.json' with { type:'json' };

test('loads Founders District and supports the core player loop',()=>{ const r=new NovaRuntime(founders); r.join('p1'); r.move('p1',4,8); r.grantItem('p1','starter-pass'); r.grantEntitlement('p1','language-cafe'); assert.equal(r.snapshot('p1').online_players,1); assert.equal(r.events.length,3); });
test('imports and exports validated WorldSpec',()=>{ const copy=importWorldSpec(exportWorldSpec(founders)); assert.equal(copy.world_id,'nova-life-founders-district'); });
test('moderation removes blocked player from presence',()=>{ const r=new NovaRuntime(founders); r.join('p1'); r.block('p1','test reason'); assert.equal(r.events.at(-1)?.type,'moderation'); assert.throws(()=>r.join('p1'),/player blocked/); });
