# QMOOSA Portfolio: Evidence-First Production and Hackathon Standard

Version: 2026-10-20 | Status: **proposed**, not a certification of any repository.

## 0. Truth and scope
- Enumerate all accessible repositories with pagination. Separate owner-authored projects, forks, reference/tutorial repositories, generated scaffolds, and multi-repository product families.
- Count repositories and distinct products separately. Do not infer authorship, collaboration, deploy status, security, or market fit from repository presence.
- Preserve existing working code. Never mark PASS from a README, mock, skipped test, badge, or generated report alone.
- No automatic mainnet deployment, asset issuance, gas/cycles expenditure, token listing, or custody operation without explicit separate authorization and completed safety gates.

## 1. Product architecture (select modules only where applicable)
```text
apps/web-mobile -> API gateway (auth, rate limits, schema validation)
                -> product services (agent orchestration, payments, wallet UX)
                -> chain adapters (EVM / Solana / ICP / Algorand / Polkadot ...)
                -> verified contracts/canisters/programs
                -> event indexer, DB, queue, observability
shared: SDKs, key management, auditing, threat model, policy engine
```
Use versioned API contracts, typed chain adapters, idempotent transaction intents, deterministic builds, and documented trust boundaries. AI outputs are not transaction approvals. Agent signing requires human/policy authorization, spend ceilings, and revocation.

## 2. Mandatory independent proof gates
G0 Inventory: default branch SHA, repository classification, dependencies, license and ownership provenance.
G1 Build: lockfile installs, reproducible compile, lint, formatting, SBOM and supported toolchain.
G2 Tests: real unit/integration/regression/smoke, coverage, adversarial/fuzz/property tests where relevant; log exact commands, exit codes and environment.
G3 Security: SAST, dependency audits, secret scan, least privilege, authenticated endpoints, rate limiting, replay/nonce safeguards, signed releases, artifact provenance.
G4 Protocol: chain-specific invariants and cryptographic verification with official test vectors; never substitute mocks for compliance claims.
G5 Testnet: genuine chain RPC, network/chain ID, explorer transaction links, deployed program/contract identifiers, end-to-end wallet UX; record confirmations and block hashes.
G6 Operations: monitoring, alerts, incident runbook, data recovery, upgrade safety, rollback/circuit breakers, budgets and abuse protection.
G7 Product and market: actual customer workflow, accessibility, documentation, business model, privacy, legal jurisdiction analysis, demo video and hackathon compliance.
G8 Mainnet: separate manual go/no-go review after G0–G7, independent security review for custody/asset protocols, owner approval and explicit funding consent.

Each gate is PASS (linked machine-verifiable evidence), FAIL (linked failing result), BLOCKED (named missing prerequisite), or NOT_APPLICABLE (justified). Unknown is NOT_VERIFIED, never PASS.

## 3. Token economics — transparent policy, not a value guarantee
- 'Unlimited supply' means no hard cap; it must NOT mean uncontrolled minting. Set explicit authorization, policy constraints, treasury controls and disclosure of potential dilution.
- Token purpose, utility, issuance schedule, circulating supply, emission controls, burn rules, governance rights, treasury reserves, insider vesting, and disclosures belong in audited specs.
- For supply S(t), new issuance M(t), and burns B(t): S(t+1)=S(t)+M(t)-B(t). Expose these numbers and mint permissions on-chain and on dashboards.
- Optionally use bounded annual inflation r(t), for example M(t) <= r(t)*S(t), but specify r(t) governance bounds and emergency stop; bounded rates do NOT create a fixed cap.
- Test unauthorized mint, overflow, supply accounting, fee-on-transfer/rebase compatibility, oracle manipulation, governance takeover, tax/fee abuse, and emergency pauses.
- Avoid promises of exchange listings, guaranteed yields, fixed returns, legal compliance, or hackathon awards.

## 4. Hackathon packaging
Per product: problem statement; verifiable differentiation; working hosted demo and testnet transaction; 2–3 minute demo; deployment manifest; architecture diagram; clean README; benchmark methodology; threat model; accessibility checklist; complete submission requirements; license and open-source attribution.
Optimize for functional originality, usability and judges' published criteria, not repository count.

## 5. Proposed family-based rollout
A: identity/inventory and provenance across every accessible repo.
B: critical crypto/PQC/ZK and wallet security families.
C: live hackathon candidates, with real demos.
D: protocol/engine/SDK/dashboard/tests families and chain adapter integration.
E: measured production rollout, gated per project.
Issue/PR workflow: evidence inventory -> branch -> tests -> review -> CI -> merge -> testnet -> operations -> authorized mainnet.

## 6. Reusable project evidence schema
Each product should publish `evidence/production-readiness.json`:
```json
{
  "schema_version": "1.0",
  "product": "replace-me",
  "repositories": [],
  "commit_sha": "replace-me",
  "verification_date": null,
  "deployment": {"network": null, "chain_id": null, "contract_address": null, "explorer_tx_url": null},
  "gates": {
    "inventory": "NOT_VERIFIED", "build": "NOT_VERIFIED",
    "tests": "NOT_VERIFIED", "security": "NOT_VERIFIED",
    "protocol": "NOT_VERIFIED", "testnet": "NOT_VERIFIED",
    "operations": "NOT_VERIFIED", "market": "NOT_VERIFIED",
    "mainnet": "NOT_VERIFIED"
  },
  "evidence_urls": [],
  "known_blockers": []
}
```
This example is a template, not a claimed result. Publish gate results with run URL, timestamp, exact SHA and links to logs/artifacts. Report independent external audit separately from automated scanning.
