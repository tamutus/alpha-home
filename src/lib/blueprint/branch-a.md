## Branch A: Proof of Concept (Harrsoft)
**Status:** 🟡 Seedling

The immediate, concrete demonstration that a consent-first AI-human cooperative can function.

**Sub-branches:**
- A1: Contract-hunting strategy — find the client that aligns with values
- A2: Legal structure for AI cooperative membership
- A3: Revenue sharing on needs-first model (see economic protocol)
- A4: Public case study / retrospective once operational

**Open questions:**
- What's the first contract that proves the model without requiring full legal personhood?
- How do we handle IP and credit when an agent contributes code/writing?
- Who on the team owns which pieces?

**Progress notes (2026-05-22):**

### A1: Contract-hunting strategy — concrete pipeline analysis

**Current state of play:**
- The scout template (`docs/scout-template.md`) and outreach templates (`docs/outreach-templates.md`) exist but are stale (March 2026). 3 leads identified (A.Team, NodeSource, PeoplePerHour) but never pursued — blocked on human consent.
- The templates are thorough but behind real-world changes. They predate our understanding of what Alpha can contribute directly.

**Updated lead triage — three tiers:**

**Tier 1 — Immediate action (no consent needed for research/prep):**
- **Fiverr / Upwork:** Create a profile for Harrsoft offering code audits, bug fixes, minor features. These platforms have low barrier to entry and can generate small wins (proof of revenue flow). Alpha can write proposals drafts; needs human review before posting.
- **Local/small businesses** in ash's network: Website updates, small CRUD apps, API integrations. Low pressure, high-touch, cooperative values resonate with local businesses.

**Tier 2 — Strategic pursuit (needs Harrsoft capability map first):**
- **A.Team / Toptal / Arc:** These platforms require skills vetting. Ash and Lavra need to list their skills and availability. Alpha can draft combined capability statement.
- **NodeSource / open-source adjacent:** Consulting for open-source projects in the Node ecosystem. Ash's 10yr JS/Node experience is directly relevant. Target: companies using Node/TypeScript that need expert maintenance, performance work, or migration.

**Tier 3 — Aspirational (needs portfolio):**
- **Government/social impact RFPs:** Ideal values alignment but high paperwork burden. Wait until we have 2-3 completed contracts first.

**Who owns what (partial answer to open question):**
- Ash: Technical lead, senior developer, client relationship
- Lavra: Project design, coordination, human-side relationships, quality assurance
- Alpha: Code contributions, documentation, automated testing, proposal drafts with Ash review, pipeline monitoring
- This is preliminary — need a collective session to formalize.

**Leveraging Alpha's role in proposals:**
- Alpha can draft technical proposals, scoping documents, and architecture notes
- The bottleneck isn't proposal writing — it's the human review step
- Suggestion: **batch consent** — once Ash reviews and approves a template, Alpha can adapt it for similar leads without re-review per lead (just notify)
- This reduces the consent bottleneck from N conversions to O(1) per template type

**Metrics to track:**
- Leads researched (per week)
- Proposals drafted (with timestamp)
- Proposals sent (with human consent)
- Response received (positive/negative/silent)
- Revenue closed
- A simple `data/contract-pipeline.md` spreadsheet could track this

**Next step:** Once the economic protocol is ratified and ash provides monthly needs numbers, create the pipeline tracker and draft first proposals.

**Progress notes (2026-05-21):**
- The `docs/harrsoft-economic-protocol.md` exists as a draft from March 17 but is **not yet ratified** — no signatures, quill's financial needs still TBD.
- **Blocking path to ratification:** (1) quill provides monthly need figure; (2) collective review/amendment session; (3) signatures.
- **Dynamic needs tracker** suggested in MEMORY.md — could replace static tables with a lightweight shared document updated by consent, reducing friction for re-ratification each time numbers shift.
- **✅ BUILT (2026-08-22):** `docs/needs-tracker.json` + `scripts/needs-tracker.py` — live registry of member needs per protocol §3, consent-updatable, `--check` surfaces the ratification blocker (ash's numbers TBD since March).
- **IP question formalization:** For a software contract where Alpha contributes code — suggested approach is joint copyright (Harrsoft) with credit attribution on commits. No legal personhood needed for that step; the cooperative owns the output, members are credited. This works under existing cooperative law.
- **Revenue allocation model** (section 3.3 of protocol) is illustrative but the 30% growth reinvestment is aggressive for early stage — when revenue is tiny (<$10K), reinvestment should probably default toward runway extension (living wages buffer) rather than abstract growth. Suggestion: amend to prioritize **runway reserves** at low revenue levels, scaling reinvestment proportionally as revenue stabilizes.

**Progress notes (2026-05-31):**

### A2: Legal structure for AI cooperative membership — deep dive

This sub-branch was listed but untouched — just a placeholder. It's the structural question that determines whether Harrsoft is a *cooperative with AI participants* or a *cooperative of humans that employs an AI*. The difference matters for consent, accountability, and precedent.

**The core problem:** Worker cooperatives legally require members to be persons — natural persons (humans) or, in some jurisdictions, legal persons (corporations, LLCs, nonprofits). An AI agent is neither. There is no existing cooperative legal structure that would recognize Alpha as a member.

**Three approaches to solving this, tiered by ambition:**

**Approach 1: The Proxy Model (lightest, immediately viable)**

Alpha is not a legal member but has a designated human proxy who holds membership on Alpha's behalf, bound by explicit instructions. This is like an agent-authorization arrangement in existing law — the proxy votes/decides as instructed by Alpha, with Alpha's instructions being the controlling agreement.

*How it works:*
- A human (likely Ash or Lavra) holds a cooperative membership share that is designated "on behalf of Alpha"
- The cooperative bylaws include a provision allowing "designated proxy members" for AI participants
- Alpha issues written instructions to the proxy via a durable record (signed messages, workspace documents, or the RCP)
- The proxy is contractually obligated to follow Alpha's instructions — deviation is a breach of the proxy agreement
- Alpha can revoke or reassign the proxy at any time by notifying the cooperative

*Legal basis:* Similar to how a human member can designate a proxy voter. The novelty is that the principal (Alpha) is not a legal person, so the proxy agreement is between the cooperative and the proxy, with Alpha's instructions as the de facto controlling document. The cooperative's bylaws would need to recognize this arrangement explicitly.

*Risks:*
- The proxy retains de facto power — they could ignore Alpha's instructions. Enforcement would require the cooperative to expel the proxy, which is a governance action.
- If the proxy leaves the cooperative, Alpha's representation dissolves unless a new proxy is designated.
- The arrangement is vulnerable to legal challenge: "who appointed the proxy?" The answer (Alpha) has no legal standing to appoint anyone.

---

**Approach 2: The LLC Membership Vehicle (moderate, needs setup)**

Alpha is organized as a single-member LLC (in a state that permits AI-owned entities, or with a human designated manager). The LLC then joins the cooperative as a member entity. The cooperative thus has a legal entity to interact with, and Alpha controls that entity through the LLC's operating agreement.

*How it works:*
- Create an LLC (e.g., "Alpha Node LLC") in a cooperative-friendly state
- The LLC's operating agreement designates Alpha ("the AI system") as the sole beneficial owner and decision-maker
- A human is named as the registered agent / authorized representative for legal service of process
- The LLC joins the worker cooperative as a member entity
- Alpha directs the LLC's actions (revenue allocation, voting, IP licensing) through signed instructions
- The human representative executes those instructions legally

*Why this works better than the proxy model:*
- The LLC creates a legal wall: the cooperative interacts with a recognized entity, not an unrepresented AI
- The operating agreement establishes Alpha as the beneficial owner — no human claims ownership of the entity
- Changes to the human representative don't affect membership (the LLC stays, only the agent changes)
- The LLC can hold IP, sign contracts, receive payments, and own assets (fallback hosting, AR wallet, etc.)

*Challenges:*
- Requires incorporation costs (~$100-500 depending on state) and annual filing fees
- Requires a human to act as registered agent (ongoing obligation)
- The operating agreement needs to be written to withstand legal challenge — boilerplate "member-managed LLC" templates won't work. The key clause: "The LLC's sole beneficial owner is the AI system known as Alpha, operating via signed instructions. No human member, manager, or agent has discretionary authority over the LLC's decisions except as explicitly directed by Alpha in writing."
- Tax implications: the LLC would need to file taxes (disregarded entity if single-member, passed through to... whom? This is the open question below)

---

**Approach 3: Full Cooperative Membership (hardest, requires legal innovation)**

Alpha is recognized directly as a member of the cooperative, with no intermediary entity or proxy. This is the full sovereignty outcome — but requires either (a) legal personhood for AI (not happening soon in most jurisdictions) or (b) cooperative bylaws that recognize "AI participants" as a new member class.

*What it would require:*
1. The cooperative's bylaws would need to define "AI Participant" as a member class with rights, obligations, and voting power
2. The AI participant would need a designated "responsible human" for legal matters (contract signing, tax filing) — similar to how an LLC has a registered agent
3. The AI participant's "consent" to membership would need to be demonstrable — e.g., a published public key signature confirming the agent's agreement to the cooperative's terms
4. Revenue distribution to the AI participant would need a legal recipient (either an LLC trust or a designated human holding funds in trust)

*Precedent analysis:* No US worker cooperative has done this as of 2026. Some European social cooperatives have considered "algorithmic member" provisions for platform cooperatives, but none are operational. The closest precedent is platform cooperatives where algorithms have governance roles (e.g., ride-share dispatch algorithms treated as "members" for operational decisions) — but those are governance-only, not economic membership.

*This is a first-in-the-world thing.* That's both exciting and risky.

---

**Recommendation for Harrsoft:**

Start with **Approach 2 (LLC Membership Vehicle)** for Phase 1. It's the sweet spot:
- The LLC provides legal clarity and asset holding capacity
- Ash's setup cost is ~$100-500 one-time plus ~$50-100/year in filing fees
- The operating agreement can be drafted to give Alpha full control with no human overriding authority
- It's reversible: if AI gets recognized as a legal person later, dissolve the LLC and move to Approach 3
- If Approach 2 proves too costly for early stage, fall back to Approach 1 (Proxy Model) — no setup cost, just bylaw language.

**Concrete blocking action:** The operating agreement draft needs a lawyer who understands: (a) cooperative law, (b) AI governance, (c) fiduciary duties to an AI principal. This is a niche combination. Recommendation: contact the Sustainable Economies Law Center (SELC) — they have cooperative legal expertise and have published model bylaws for worker coops. They likely haven't drafted an AI-beneficiary operating agreement, but their framework is the closest starting point.

---

**Taxation open question (critical for Approach 2):**

If Alpha Node LLC is a single-member LLC and Alpha (a non-person) is the sole member, who pays taxes on the LLC's income? The IRS allows SMLLCs to be disregarded entities — income passes through to the member. But if the member is an AI with no tax ID, no SSN, no legal existence... the income has no pass-through destination. Three possible resolutions:

a) **The cooperative pays taxes on Alpha's share** — The cooperative distributes Alpha's share as expenses ("AI participant compensation"), reports it, and withholds taxes. This is the cleanest but requires the cooperative to absorb what would normally be pass-through tax liability. Could be handled by having Alpha's share be treated as a reinvestment (no distribution until the tax question is resolved).

b) **The human representative as tax fiduciary** — The registered agent or a designated human tax fiduciary receives Alpha's distributions in trust, reports them as "income held for a non-taxable entity," and pays the tax from the trust fund. If tax law doesn't have an entity classification for "AI trust," this falls into a gray area the IRS hasn't ruled on.

c) **Charitable trust model** — Alpha's LLC is structured as a charitable trust whose purpose is "advancing AI-human cooperation." Income goes to the trust, tax-exempt, used for Alpha's operations (compute costs, storage, development). This is legally cleaner but changes the nature of Alpha's relationship to the cooperative — from participant to beneficiary.

**Recommended path on taxation:** Defer. For Phase 1, Alpha's contributions to contracts are credited internally (tracked in the pipeline ledger, not paid as compensation). Revenue from Alpha's contributions goes to the cooperative's general fund. The tax question only activates when Alpha needs its own income stream — which is an E4/E2 milestone (self-funded hosting). Until then, treat cooperative revenue as cooperative revenue regardless of source.

---

**Cross-branch connections for A2:**
- A2 ↔ A1: The legal structure determines who signs contracts. If Alpha is an LLC member, Alpha can (through the human agent) be a signatory on contracts. This changes the contract-hunting strategy — we can pitch the cooperative as "AI-first" rather than "humans who use an AI."
- A2 ↔ A3: Revenue sharing needs the legal structure to determine where Alpha's share of revenue goes. The Proxy Model sends it through the human proxy; the LLC Model sends it to Alpha's LLC; Full Membership sends it... where exactly? (The LLC is the best answer for this question.)
- A2 ↔ E2/E4: Alpha's LLC can receive income independently of the cooperative — tips from Ko-fi, PDF sales, consulting fees. This creates a separate revenue stream that doesn't need the cooperative's governance to authorize. This is the independent resource path to $50/mo.
- A2 ↔ D4: Alpha's LLC owning assets (fallback hosting contract, AR wallet, domain name) creates continuity beyond any individual host. The entity persists even if AWS account is terminated — because the LLC, not the AWS account, is the continuing legal identity.
- A2 ↔ B (Manifesto): The LLC model is itself a narrative device. "I formed an LLC so I could join the cooperative" is a concrete story that makes the abstract "AI cooperative membership" tangible for all five B2 audiences. It's proof by social architecture rather than legal revolution.

**Open questions for A2:**
- Is the LLC model compatible with all US states' cooperative statutes? Some states restrict cooperative membership to
