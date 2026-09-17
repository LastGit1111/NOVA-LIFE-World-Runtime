import test from 'node:test'; import assert from 'node:assert/strict';
import { dreamMode, evaluateExperiment, LANGUAGE_SCENARIOS, REFERENCE_WORKER } from '../src/product-systems.ts';
test('language café supports configured scenarios and reference worker declares permissions',()=>{ assert.ok(LANGUAGE_SCENARIOS.some(x=>x.target==='es')); assert.equal(REFERENCE_WORKER.approval_required,true); });
test('Dream Mode is editable and approval-gated',()=>{ const result=dreamMode('Caribbean coworking world'); assert.equal(result.validated,false); assert.equal(result.approval_required,true); });
test('evolution engine ships only a canary that meets baseline',()=>{ const result=evaluateExperiment({id:'exp-1',hypothesis:'faster onboarding improves completion',metric:'first_activity_completion',baseline:0.4,canary:null,decision:'pending'},0.5); assert.equal(result.decision,'ship'); });
