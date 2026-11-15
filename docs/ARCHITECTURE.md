# Architecture

The SPA uses Vite, React and React Router. `src/lib/genlayer.ts` centralizes the SDK chain, address, public read client, wallet-backed client, bounded read concurrency, in-flight deduplication and short-lived in-memory snapshots. The browser keeps only known source IDs and submitted transaction hashes in localStorage. Public contract views remain authoritative. Direct source routes add their IDs to this local index.

`src/App.tsx` contains routing, UI, source reads, wallet/network state, write orchestration and transaction tracking. This is a compact implementation and should be modularized further before a larger team extends it. An accepted transaction is not declared successful until the SDK reports FINALIZED and `isSuccessful` returns true. Polling is bounded; submitted hashes remain locally available for manual tracking.

The state model is eventually consistent: snapshots have a 45-second in-memory cache, invalidated on manual refresh and successful finalized writes. If a refresh fails previously loaded values may be stale and the UI warns. Two view calls run concurrently at most; the shared public RPC still enforces its own limits.
