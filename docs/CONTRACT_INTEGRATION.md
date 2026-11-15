# Contract integration

See CONTRACT_AUDIT.md for the verified deployment and full method/schema list. `studioDevnet` and the audited contract are used; no replacement is deployed. Writes submit exact contract arguments with the SDK, after fee simulation, confirmation, network validation, and a fresh owner/status check for owner-only operations. On a successful finalized write the cache is invalidated and views re-read. Registration and baseline are separate transactions.

Fee estimates are simulated using `estimateTransactionFeesForWrite`; observed fee requirements and execution costs can change. The actual wallet flow has not been independently tested. A submitted hash is persisted locally and tracked via `getTransaction` and `advanced.getTransactionLifecycle`; SDK `isSuccessful` plus FINALIZED determine confirmed success. A status timeout must never be treated as a failure to submit.
