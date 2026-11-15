# SENTINEL — Semantic Evidence Watch

A Vite/React/TypeScript client for the existing EvidenceWatch intelligent contract on GenLayer Studio Dev. Reads are live; source IDs stored in the browser are only an index, never the source of truth.

## Status

**Development build, not production-verified.** Public reads against the specified deployed contract and a fee-estimation simulation have been exercised. Wallet submission, real writes, finalization tracking in this UI, all classification paths, and an actual Netlify deployment have not been tested end to end. Review `docs/CONTRACT_AUDIT.md` and `docs/LIMITATIONS.md` before use. Original repository documentation/tests are unavailable; the user reported tests were conducted in Studio, but those tests were not independently reproduced.

## Run locally

```sh
npm ci
cp .env.example .env   # optional; defaults are the requested deployment
npm run dev
```

Open the local URL printed by Vite. Public reads work without a wallet. To look up an existing source, enter its exact ID. `grant-rules` was observed on the public deployment during audit, though Studio Dev can reset.

```sh
npm run test
npm run lint
npm run build
npm run preview
```

## Network and configuration

Studio Dev: chain ID `61997`, RPC `https://studio-dev.genlayer.com/api`, currency GEN. The SDK `studioDevnet` preset is pinned to `genlayer-js@2.0.0-rc.3`. The contract defaults to `0x402af6154B9D64635e2c32FEB9f07D4A492532F4`. The only configurable public environment variables are in `.env.example`. The chain/RPC are intentionally not configurable separately from the SDK preset, to prevent an inconsistent consensus deployment. Do not put secrets or private keys in Vite variables.

## Netlify

Build command: `npm run build`; publish directory: `dist`. `netlify.toml` provides the SPA fallback. A successful local build is not evidence of a completed Netlify deployment. Ensure your deployed origin can reach the Studio Dev RPC and validate wallet and consensus behavior before production use.

## Notes

- Source IDs are user-supplied, locally retained lookup references; there is no global source-ID enumeration.
- Writes are initiated only from a compatible EIP-1193 wallet, require the exact chain and an explicit fee estimate confirmation, and are submitted using the SDK. Each hash is stored immediately and tracked without resubmitting. If no hash is returned after a wallet/RPC error, inspect the wallet and explorer before trying again.
- The tracker uses the stored SDK status and execution result; successful completion requires `FINALIZED` and `isSuccessful`. Projection is informational. Automatic polling is bounded; resume manually. Browser storage can be cleared; retain hashes independently.
- RPC rate limits may delay or prevent reads. Errors are displayed rather than replaced by demo data. Studio Dev is a resettable preview network.
