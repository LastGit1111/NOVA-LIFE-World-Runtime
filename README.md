# NOVA LIFE World Runtime

Independent, platform-neutral runtime foundation for the NOVA LIFE Founders District. It consumes WorldSpec from the canonical `world-engine-mcp` service and keeps external actions approval-gated.

## Status

The local runtime slice supports WorldSpec import/export, player movement, profiles, presence, inventory, entitlements, events, analytics events, and moderation hooks. Network multiplayer, LiveKit, GPT-Live-1, and real UEFN execution are integration gates, not claimed features.

## Checks

```bash
npm install
npm run typecheck
npm test
```
