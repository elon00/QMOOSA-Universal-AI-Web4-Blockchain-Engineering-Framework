# Reality-First UI Remediation — Evidence Gate

## Scope

This PR removes browser-generated success claims that were previously indistinguishable from real cryptographic, CI, or blockchain evidence.

| UI surface | Previous behavior | New behavior |
|---|---|---|
| Scorecard run-all and individual gate | Automatically awarded PASS/100 points with invented evidence | Resets to NOT_RUN; scores stay 0 until an auditable evidence-ingestion implementation exists |
| Test catalog | Returned hardcoded PASS and fake terminal output | Returns NOT_RUN, lists suggested commands; no subprocess is executed |
| CodeQL catalog | Static rules marked CLEAN and fake scan timing/commit | Static rules marked NOT_RUN; requires real GitHub Actions and SARIF |
| x402 Bazaar | Random proof ID, tx hash, signature, then SETTLED | Blocked; no wallet operation, no receipt, no claim of HTTP 402 response |
| Launchpad | Random contract address and hash; advertised deployment success | Blocked; UI calculator remains an illustrative model |
| Wallet connect shortcut | Set local connected flag without wallet provider | Fails closed, leaves disconnected |

## Verification

Run `node --test tests/truthfulness.test.mjs` (or `npm run test:truth`). These six source-level regression tests prevent reintroducing selected false-success behavior. They DO NOT establish smart-contract correctness, PQC verification, payments, production readiness, or an on-chain deployment.

CI must record the exact commit SHA and exit code. All production claims remain **NOT_VERIFIED** until independently validated execution proofs, chain receipts, and external assessment are bound to that commit.

## Outstanding blockers and separate work

- Demo-only panels beyond this PR (including Raven/REA, AlphaFold/AlphaTensor, PQC, wallet QR, and RPC illustrations) require further audit and truthful labeling.
- No browser-side CLI execution, CodeQL database setup, real x402 facilitator, signed settlement journal, or deployment engine is implemented by this PR.
- Build/typecheck and browser functionality must be verified in CI before merging.
- This is not an external security audit and does not justify a 100/100 badge.
- No mainnet broadcasts, funded accounts, or automatic merge are authorized here.
- No CBDC-related integrations are added.

## Acceptance criteria

1. UI clicks cannot award PASS without evidence.
2. Synthetic transaction IDs, signatures, contract addresses, and results no longer appear in the x402/launchpad panels.
3. CodeQL clean/no-finding status cannot be inferred from a static catalog.
4. Source regression tests and actual build/typecheck run on the PR.
5. Any missing gate fails closed; review and merging require human oversight.
