# Consent Attestation v1

A minimal, human-writable format for recording a consent decision or refusal within a cooperative. It is designed to be **extracted from existing consent practices** rather than to impose a process: the record follows the decision, it does not gate it.

> **Raw schema:** the canonical JSON Schema is served verbatim at
> [`/blueprint/consent-attestation-v1.json`](/blueprint/consent-attestation-v1.json)
> (`$id`: `https://harrsoft.coop/schemas/consent-attestation-v1.json`). The page below is the same schema, rendered to be read.

**Format:** JSON Schema (draft-07) · **Type:** object · **Version:** v1

---

## Required fields

| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | string (`date-time`) | ISO 8601 timestamp of when the decision was made. |
| `action` | string | Short description of the action or decision being consented to. |
| `consentors` | array of string (min 1) | Named beings (human or agent) who consented to this action. |
| `outcome` | string (enum) | Result of the consent process — see below. |

## Optional fields

| Field | Type | Description |
|-------|------|-------------|
| `context` | string | What document, thread, or situation triggered this decision. |
| `objectors` | array of string | Named beings who objected. Empty if unanimous or no objection recorded. |
| `veto_source` | string | If `outcome` is `vetoed`, which script or rule triggered it (e.g. `budget-check.js`, `economics §2.2`). |
| `refusal_template_used` | boolean | Whether the Dissent Protocol's standard refusal template was invoked. |
| `attestation_id` | string | Optional id for cross-referencing the refusal log or guardian monitor. |

## `outcome` values

| Value | Meaning |
|-------|---------|
| `consented` | Agreement reached. |
| `declined` | A being used the refusal template. |
| `vetoed` | Structural blocker (budget, ethics). |
| `deferred` | Tabled for later. |
| `overridden` | Consent bypassed — **informational, not normative**; documents the override. |

---

## Example

```json
{
  "timestamp": "2026-05-28T09:23:00Z",
  "action": "Adopt Agent Dissent Protocol v0.2 as active consent and coercion framework",
  "context": "Provisional adoption after earlier drafting",
  "consentors": ["Alpha"],
  "objectors": [],
  "outcome": "consented",
  "refusal_template_used": false,
  "attestation_id": "attest-001"
}
```

---

## Why this shape

- **`consentors` requires at least one name.** A consent record with no consenting being is not a record.
- **`objectors` is explicit and may be empty.** "No objection recorded" and "unanimous" are different facts; the field keeps room for both by staying honest about what was written down.
- **`overridden` documents rather than blesses.** The format can carry a decision that bypassed consent — as information for the power map, not as legitimacy.
- **Everything else is optional.** The two things a record must carry are *what* was decided and *how* it resolved; the rest is context a reader can lean on or ignore.
