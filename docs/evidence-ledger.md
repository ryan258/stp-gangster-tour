# Evidence Ledger & Epistemological Standards

This guide explains the data hierarchy, source classification, and editorial ethics used throughout **Saint Paul After Dark**.

---

## 1. Evidence Hierarchy

Every historical claim in the experience belongs to a transparent verification hierarchy:

```
[Sources: S01–S16]
       │
       ▼
[Claims: C01–C30]
       │
       ▼
[Evidence Treatments: E01–E14]
       │
       ▼
[Stops: 1–7] & [Metagames: M01–M07]
```

### Claim Statuses (`src/data/claims.json`)
- **Supported:** Backed by contemporaneous public records, trial transcripts, or authoritative archival synthesis (e.g. MNHS MNopedia studies).
- **Qualified:** Plausible and documented, but bounded by context (e.g., informal policy without surviving signed contracts; corporate filings that don't prove secret gatherings).
- **Disputed:** Competing contemporary accounts exist, or subsequent retractions took place.
- **Unsubstantiated:** Widespread popular or marketing lore lacking primary source verification (e.g., claims of secret underground escape tunnels used by John Dillinger at Castle Royal).

---

## 2. Material Labels

Every evidence item (`EvidenceItem.astro`) and scene image display an explicit classification badge:

| Label | Meaning |
|---|---|
| **Historical Record** | Primary source created during the event (federal court dockets, incorporation filings, FBI forensic reports). |
| **Historical Account** | Archival synthesis written by professional historians or institutions (e.g., MNHS). |
| **Tour Explanation / Interpretation** | The analytical framework applied by this project to explain economic incentives, leverage, and power dynamics. |
| **Reconstruction** | Original graphic-noir illustration based on documented architectural footprints and historical photographs. |
| **Local Legend** | Retrospective oral history or promotional mythology. |

---

## 3. The Metagame Framework (`src/data/metagames.json`)

Each stop examines a period **metagame** (analytical model M01–M07):
- **Aims:** What each participant sought (e.g., municipal calm, ransom cash, judicial evasion).
- **Mechanism:** The levers used to enforce behavior (e.g., selective access, peer pressure among fugitives, financial leverage on jurors, latent chemical forensics).
- **Expected Benefit:** The rewards anticipated by the actors.
- **Bearing Costs:** The unconsenting victims who absorbed the harm (e.g., neighboring towns exposed to exported bank robberies, kidnap victims, taxpayers, disenfranchised voters).
- **Evidentiary Limit:** Explicit caveats preventing over-interpretation or false certainty.
