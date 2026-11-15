# SENTINEL — Contract audit (phase 1)

Audit time: 2026-11-14 UTC. Status: **deployment, source, schema and public reads verified; required repository documentation and tests unavailable. Implementation not started.** Network state can change, especially after a Studio Dev reset.

## Repository and deployment identity

- Repository: https://github.com/MIKI4222/evidence-watch-genlayer, `main`, commit `5f6031598f841677a27d2e14fc640cf90fc6fa79`.
- The actual checkout contains only `README.md` and `evidence_watch.py` at the root (apart from `.git`). The README refers to `contracts/evidence_watch.py`, five files under `docs/`, `tests/`, and LICENSE, none of which were present in this checkout. The contract source was read from the root. The cited documentation and tests could not be reviewed or run; the README's claim of 83 simulation tests is not an independently verified result.
- Address: `0x402af6154B9D64635e2c32FEB9f07D4A492532F4`. Network: GenLayer Studio Dev. Canonical RPC: `https://studio-dev.genlayer.com/api`. `eth_chainId` returned `0xf22d` (61997).
- Installed `genlayer-js@2.0.0-rc.3` for inspection. Its `studioDevnet` preset returned chain 61997 and the canonical RPC. `getContractCode` at the address returned source identical to repository `evidence_watch.py` after normalization of CRLF to LF. SHA-256 of the normalized source and repository file: `d2d7ff1c2f6ffaff796b7f8f544d38a8deedab629846e1d0cebf2ba6921e6571`. This establishes source identity at audit time, not future immutability of a resettable preview.
- SDK `getContractSchema` returned all the methods below with matching parameter order, mutability and top-level return types. Nested dictionary shapes are derived from the matched source and confirmed for the observed test source; not every branch has been independently exercised.
- Public `get_source_count()` returned 1. Public source ID `grant-rules` was obtained from the calldata of published transaction `0x47d46d6992d6e8be74e95ca58faf3dec0ac75e84eccdd78f72754176808ec812`; all six remaining view calls succeeded with that ID. `get_version_count` returned 2; `get_integration_status` reported ACTIVE, latest status MATERIAL_CHANGE, version 2. This does not constitute a new transaction, or proof of every feature branch.
- The published transaction returned `FINISHED_WITH_RETURN`; explorer reported FINALIZED and accepted at audit time. No transaction was signed or submitted during this audit.

## Public API

All arguments below are `string`, return types are schema types, and all names and parameter ordering match the deployed schema.

### Writes — all return `null`

- `register_source(source_id, source_url, source_name, description, instructions, reference_context, watch_items)`
- `update_source(source_id, source_name, description, instructions, reference_context)`
- `deactivate_source(source_id)`
- `create_baseline(source_id)`
- `check_source(source_id)`

### Views

- `get_source_count() -> int`
- `get_source(source_id) -> dict`: `source_id`, `owner`, `source_url`, `source_name`, `description`, `instructions`, `reference_context`, `watch_items`, `status`, `registered_at`, `updated_at`.
- `get_baseline(source_id) -> dict`: `title`, `source_type`, `subject`, `summary`, `version_info`, `observed_date`, `items`, `source_id`, `baseline_version`. Baseline items: `item`, `present`, `value`. Errors if no baseline exists.
- `get_latest_check(source_id) -> dict`: `source_id`, `version`, `previous_version`, `kind`, `status`, `title`, `change_summary`, `added_information`, `removed_information`, `modified_information`, `affected_requirements`, `important_findings`, `items`, `confidence`, `observed_at`, `baseline_version`, `baseline_updated`, `requested_by`. Errors if no record exists. BASELINE and CHECK item shapes differ; CHECK items contain `item`, `base_present`, `present_now`, `change`, `value`, `note`.
- `get_check_history(source_id) -> array`: same record shape, newest first, at most 20 entries including baseline. Oldest records overwritten.
- `get_version_count(source_id) -> int`: latest version number, not necessarily number currently retained.
- `get_integration_status(source_id) -> dict`: `source_id`, `source_url`, `source_owner`, `source_status`, `baseline_version`, `latest_version`, `latest_status`, `latest_check_summary`, `last_successful_check` (`version`, `at`).

`added_information` entries contain `item`, `value`; removed entries contain `item`, `previous_value`; modified entries contain `item`, `previous_value`, `new_value`. Other branches and no-baseline errors are source-inspected, not live-tested in this audit.

## Validation, access and state

- ID: 3–64 characters matching `^[a-z0-9][a-z0-9._-]{2,63}$`; globally unique. URL: HTTP(S), up to 500 characters, fully qualified host, no credentials, blocked host patterns per source. Duplicate URL per owner rejected after removing fragment and trailing slash.
- Name required, up to 120 characters. Description 10–1000 characters. Instructions and reference context each up to 1000 characters. Trimmed before validation.
- Watch items: separated by `||`, newline, or literal backslash-n; empty invokes four defaults. Up to 8, each 3–120 characters, case-insensitive duplicates rejected.
- Only the owner can update, deactivate, create baseline, or check. URL and watch items cannot be updated. A deactivated source cannot be modified, checked or reactivated with this API. Baseline can be created only while REGISTERED; check requires ACTIVE. Source transitions REGISTERED → ACTIVE → DEACTIVATED.
- Check classifications: `UNCHANGED`, `MINOR_CHANGE`, `MATERIAL_CHANGE`, `SOURCE_UNAVAILABLE`, `INCONCLUSIVE`; baseline records use `BASELINE`. Item classes: `UNCHANGED`, `MINOR`, `MODIFIED`, `ADDED`, `REMOVED`, `UNCLEAR`. A successful MINOR_CHANGE or MATERIAL_CHANGE replaces the baseline; UNCHANGED and unavailable/inconclusive preserve it. Failed consensus stores nothing. `confidence` is informational, not calibrated probability.
- There is no public view to enumerate IDs. `get_source_count()` alone cannot reconstruct them. A user-provided ID or explicitly non-authoritative local index is needed; do not present a partial list as global.
- Fetches are HTTP GET and cleaned content is truncated to 12,000 characters. No scheduler, payment workflow, historic content cryptographic proof, or verified cross-contract integration is provided by this contract. Values and summaries are model-generated; validation and equivalence have limitations.

## SDK and testing limitations

Official GenLayer documentation identifies the v2.0 RC and `studioDevnet` as the Consensus v0.6 / Studio v0.123 preview family. `2.0.0-rc.3` was the npm `rc` tag at audit time and successfully performed the reads above. This confirms read compatibility for the observed calls, not write/fee or wallet compatibility. SDK write operations require current network fee estimation and correct handling of execution result and finalization. No wallet, writes, simulations, end-to-end tests, browser tests, build, deployment, or code changes to the contract were performed.

## Blocking gaps before full implementation

The supplied mandatory first-phase instructions require inspecting `docs/ARCHITECTURE.md`, `docs/CONSENSUS.md`, `docs/STATE_MODEL.md`, `docs/INTEGRATION.md`, `docs/USAGE.md`, and relevant tests. These files are missing in the actual repository checkout. Obtain the complete repository or correct revision containing these files, then review them and run the available tests before claiming the requested audit complete. No replacement contract was deployed.

## References

- Repository: https://github.com/MIKI4222/evidence-watch-genlayer
- Explorer: https://explorer-studio-next.genlayer.com/address/0x402af6154B9D64635e2c32FEB9f07D4A492532F4
- SDK: https://docs.genlayer.com/api-references/genlayer-js
- Network and migration: https://docs.genlayer.com/developers/consensus-v06-migration

## Audit continuation

The user supplied a ZIP with the same two files and reported that testing was conducted in GenLayer Studio. Those tests were not included in the ZIP and were not independently rerun. The implementation proceeded with this limitation explicitly recorded.
