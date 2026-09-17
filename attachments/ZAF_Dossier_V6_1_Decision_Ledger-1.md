# ZAF Dossier V6.1 — Decision Ledger

**Purpose:** Record Derek-approved structural decisions before Dossier V6.1 implementation.  
**Controlling baseline:** ZAF Dossier V6.1 Thread Instructions  
**Created:** 2026-08-15  
**Workbook status:** Dossier V6 remains untouched. Dossier V6.1 has not yet been generated.

## Decision Register

| Proposal ID | Status | Final Decision | Implementation Status |
|---|---|---|---|
| D1 — Registry versus Active Portfolio | Approved | Preserve all 744 projects in one Master Project Registry. Create an Active Portfolio as a formula-driven view, not copied data. Approximately 100 candidates is a flexible target, not a quota. Entry requires explicit review and is never triggered solely by score ≥80. | Approved; awaiting structural implementation after architecture review. |
| D2 — Permanent IDs | Approved | Freeze every existing Project and Module ID permanently. Never recycle IDs. New projects and modules receive the next unused ID. Merged, retired, alias, and variant records retain their original IDs. | Approved; ID baseline must be captured before any sorting or normalization. |
| D3 — Preference Rank | Approved | Separate rank from identity. Maintain a Registry Preference Rank for records with numeric scores and an Active Preference Rank for Active Portfolio candidates. Display rank with Score Origin and Confidence. | Approved; formula design pending D15. |
| D4 — Global Builder Guardrails | Approved | Store universal platform requirements once instead of repeating them in every project. Include ownership/export, repository access, data portability, custom domains, secrets/environments, backup/recovery, external API/backend access, acceptable lock-in, cost ceiling, and security/privacy baselines. | Approved; table design pending D6–D9. |
| D5 — Build-stage Guardrails | Approved | Define Prototype, MVP, and Production requirements. Build Stage belongs to scenarios rather than projects so Production requirements cannot contaminate Prototype or MVP matching. | Approved; scenario linkage pending D8–D9. |
| D6 — Atomic Requirements | Pending | Not yet reviewed. | Not started. |
| D7 — Requirement Levels | Pending | Not yet reviewed. | Not started. |
| D8 — Explicit Scenarios | Pending | Not yet reviewed. | Not started. |
| D9 — Derived Scenario Requirements | Pending | Not yet reviewed. | Not started. |
| D10 — Module Hierarchy | Pending | Not yet reviewed. | Not started. |
| D11 — Capability-tag Cleanup | Pending | Not yet reviewed. | Not started. |
| D12 — KaraokeDokie Core Reconstruction | Pending | Not yet reviewed. | Not started. |
| D13 — Evidence Maturity and Specification Readiness | Pending | Not yet reviewed. | Not started. |
| D14 — Decision Eligible? | Pending | Not yet reviewed. | Not started. |
| D15 — Score Origin and Confidence | Pending | Not yet reviewed. | Not started. |
| D16 — Project Relationships | Pending | Not yet reviewed. | Not started. |
| D17 — Build Target Normalization | Pending | Not yet reviewed. | Not started. |
| D18 — Unassigned Source Modules | Pending | Not yet reviewed. | Not started. |
| D19 — Spreadsheet QA | Pending | Not yet reviewed. | Not started. |
| D20 — Active Portfolio Dashboard | Pending | Not yet reviewed. | Not started. |

## Approved Definitions

### Active Portfolio

A curated, formula-driven decision view sourced from the Master Project Registry. It contains serious current platform-selection candidates without deleting or demoting the preserved long-tail registry.

### Permanent identity

Project and Module IDs identify records, not rank. Sorting, rescoring, renaming, merging, parking, or changing portfolio status must never change an existing ID.

### Preference ranks

- **Registry Preference Rank:** Calculated across registry records possessing a numeric concept-quality score.
- **Active Preference Rank:** Calculated only across Active Portfolio candidates.
- Neither rank selects a builder or grants Decision Eligibility.

### Build stages

- **Prototype:** Proves the central workflow. Manual assistance, temporary integrations, and acknowledged limitations may be allowed.
- **MVP:** Safe and reliable for real users. Requires functional persistence, privacy, recovery, and successful completion of the primary workflow and outputs.
- **Production:** Adds mature scalability, monitoring, administration, auditability, operational resilience, and support requirements.

## Change Log

| Date | Change |
|---|---|
| 2026-08-15 | D1–D5 approved as recommended. Decision ledger initialized. No workbook edits performed. |
