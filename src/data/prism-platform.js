/**
 * Content model for the PRISM Products page.
 *
 * Everything here is sourced from two places and nothing else:
 *   - the live prism.inc/products copy (the eight platform modules), and
 *   - "PRISM — AI-Enabled Operating Model" proposal, July 2026 (the agent
 *     portfolio, control boundary, architecture, stack, security, roadmap
 *     and measurement framework).
 *
 * Keeping it in one module means marketing can edit claims without touching
 * layout, and it keeps the compliance-sensitive wording (approval gates,
 * "never autonomous", the HIPAA/SOC 2 readiness caveat) reviewable in a
 * single diff.
 */

export const HERO_STATS = [
  { k: "8", v: "Integrated platform modules, from claims ingest to immutable audit trail." },
  { k: "10", v: "Business agents — eight operate individual cases, two strengthen the portfolio." },
  { k: "10", v: "Mandatory human approval gates between preparation and any external action." },
  { k: "0", v: "Autonomous submissions. External communication stays blocked until a reviewer signs." },
];

export const PRINCIPLES = [
  {
    tag: "AI",
    tone: "text-[#2563EB]",
    title: "Reads and prepares",
    desc: "Reads EOBs, summarizes payer replies, drafts notices, assembles evidence packets and explains every recommendation with its source.",
  },
  {
    tag: "Rules",
    tone: "text-[#0A2540]",
    title: "Calculates and controls",
    desc: "Controls eligibility checks, business-day deadlines, arithmetic, case state, retries and versioned decisions — deterministically, every time.",
  },
  {
    tag: "People",
    tone: "text-emerald-700",
    title: "Decide and approve",
    desc: "Approve eligibility, settlements, filings, offers, rule changes and case closure. Named owners, recorded approvals, full audit history.",
  },
];

/**
 * The eight shipping modules. `desc` is unchanged from the live site so the
 * page keeps its existing SEO surface; `agent` is the new cross-reference
 * into the agent portfolio below.
 */
export const MODULES = [
  {
    icon: "Download",
    title: "Claims Ingest",
    desc: "Pull EOBs and remits from your clearinghouse via SFTP, X12 835 parsing, or direct payer portal scraping.",
    agent: "Agent 1 — Claim Intake",
  },
  {
    icon: "FileCheck2",
    title: "Eligibility Engine",
    desc: "Auto-classifies each claim under NSA, state surprise law, ERISA, or out-of-scope — with the supporting CFR citations.",
    agent: "Agent 2 — Eligibility & Jurisdiction",
  },
  {
    icon: "GitMerge",
    title: "QPA Validator",
    desc: "Compares the payer's QPA to FAIR Health, geographic medians, and historical contracted rates; flags low outliers for challenge.",
    agent: "Agent 4 — QPA & Underpayment",
  },
  {
    icon: "Workflow",
    title: "Negotiation Workflow",
    desc: "Auto-drafts Open Negotiation letters, tracks the 30-day clock, and escalates to IDR initiation on day 31.",
    agent: "Agent 5 — Negotiation Copilot",
  },
  {
    icon: "ShieldCheck",
    title: "IDRE Submission",
    desc: "Generates compliant IDR filings with credible information packets tuned to your service line and IDRE history.",
    agent: "Agent 6 — IDR Evidence",
  },
  {
    icon: "ChartColumn",
    title: "Recovery Analytics",
    desc: "Win rate, average uplift, payer-level performance, denial trends — exportable to your BI tool.",
    agent: "Agents 7 & 10 — Intelligence & Reporting",
  },
  {
    icon: "Bell",
    title: "Deadline Sentinel",
    desc: "Federal IDR deadlines are unforgiving. PRISM tracks every clock and routes overdue items before they expire.",
    agent: "Agent 3 — Deadline & Workflow",
  },
  {
    icon: "Clock",
    title: "Audit Trail",
    desc: "Every action, document, and timestamp is preserved in an immutable, BAA-covered record.",
    agent: "Agents 8 & 9 — Reconciliation & Regulatory",
  },
];

export const LIFECYCLE = [
  { n: "01", title: "Intake", desc: "EOB, ERA, claim and support files, scanned and matched to one verified case." },
  { n: "02", title: "Qualify", desc: "Eligibility, jurisdiction, QPA and the economics that decide whether to pursue." },
  { n: "03", title: "Negotiate", desc: "The 30-business-day Open Negotiation window, tracked and drafted end to end." },
  { n: "04", title: "IDR", desc: "Initiation, IDRE selection, cited evidence and the final offer submission." },
  { n: "05", title: "Collect", desc: "Determination, payment, remittance reconciliation and client reporting." },
];

/** Agents 1–8 operate a single case. Agents 9–10 operate across the portfolio. */
export const AGENTS = [
  {
    n: 1,
    scope: "case",
    name: "Claim Intake Agent",
    kind: "AI-assisted",
    where: "Case entry",
    does: "Classifies inbound files, extracts claim fields, matches service lines across documents and flags anything missing or inconsistent.",
    benefit: "Less re-keying and fewer intake errors, because the case record is verified before anyone works it.",
    gate: "A person resolves every low-confidence field before the case advances.",
  },
  {
    n: 2,
    scope: "case",
    name: "Eligibility & Jurisdiction Agent",
    kind: "Deterministic-first",
    where: "Before action",
    does: "Applies the active federal, state, plan, network, duplicate and batching rules, and returns the reason and evidence behind each result.",
    benefit: "Fewer ineligible filings and a defensible written reason attached to every eligibility call.",
    gate: "A specialist confirms eligibility and jurisdiction before any external step.",
  },
  {
    n: 3,
    scope: "case",
    name: "Deadline & Workflow Agent",
    kind: "Deterministic-first",
    where: "Whole lifecycle",
    does: "Runs business-day calendars, case state, reminders, retries and escalations across the entire dispute lifecycle.",
    benefit: "Fewer preventable deadline losses, and queues that surface work before it becomes urgent.",
    gate: "A named owner resolves any uncertain or contested date.",
  },
  {
    n: 4,
    scope: "case",
    name: "QPA & Underpayment Agent",
    kind: "Rules + analytics",
    where: "Prioritization",
    does: "Compares the payment received, the payer's QPA, licensed benchmarks, fees and expected recovery to score each opportunity.",
    benefit: "Specialists work the best opportunities first, with the finance assumptions visible on screen.",
    gate: "Finance owns the assumptions; they stay visible and versioned, never buried in a model.",
  },
  {
    n: 5,
    scope: "case",
    name: "Negotiation Copilot",
    kind: "AI drafting",
    where: "Open Negotiation",
    does: "Drafts Open Negotiation notices, summarizes payer replies and compares settlement options side by side.",
    benefit: "Faster, more consistent negotiation without losing the specialist's judgement.",
    gate: "An authorized person sends every notice and accepts every settlement.",
  },
  {
    n: 6,
    scope: "case",
    name: "IDR Evidence Agent",
    kind: "Grounded AI",
    where: "IDR preparation",
    does: "Builds cited statements, exhibit indexes, attachment checks and reviewer checklists for the credible information packet.",
    benefit: "Fewer missing or unsupported facts in front of the certified IDR entity.",
    gate: "A specialist approves the evidence and the submission itself.",
  },
  {
    n: 7,
    scope: "case",
    name: "Payer & IDRE Intelligence",
    kind: "Advisory analytics",
    where: "Strategy",
    does: "Finds patterns by payer, specialty, code, geography, offer level and IDRE across comparable historical outcomes.",
    benefit: "Better strategy from comparable outcomes instead of instinct.",
    gate: "Insights remain advisory and sourced — they never auto-apply to a live case.",
  },
  {
    n: 8,
    scope: "case",
    name: "Payment Reconciliation Agent",
    kind: "Deterministic-first",
    where: "After decision",
    does: "Matches determinations to remittances, then flags late, partial or missing payment against the amount awarded.",
    benefit: "No case closes before the cash actually arrives, and disputed balances stay visible.",
    gate: "Finance confirms every disputed balance before write-off or closure.",
  },
  {
    n: 9,
    scope: "portfolio",
    name: "Regulatory Intelligence Agent",
    kind: "AI research + control",
    where: "Compliance",
    does: "Summarizes CMS and state changes, then proposes rule, SOP and template updates with the source text attached.",
    benefit: "A faster, controlled response to regulatory change instead of a scramble.",
    gate: "Compliance approves every production rule, SOP or template change.",
  },
  {
    n: 10,
    scope: "portfolio",
    name: "Reporting Agent",
    kind: "Validated reporting",
    where: "Portfolio reporting",
    does: "Creates client, operations and executive reporting from validated data only, with the definitions shown.",
    benefit: "Faster, clearer visibility for clients and leadership from one validated source.",
    gate: "High-risk narratives are reviewed before they leave the building.",
  },
];

export const BOUNDARY = [
  {
    id: "automatic",
    title: "Automatic preparation",
    icon: "Zap",
    tone: "text-emerald-700",
    items: [
      "Receive, scan, classify and match files",
      "Detect duplicates and missing fields",
      "Calculate clocks, balances and opportunity",
      "Draft notices, summaries and evidence",
      "Create queues, reminders and audit events",
    ],
  },
  {
    id: "approval",
    title: "Recorded approval",
    icon: "Lock",
    tone: "text-amber-700",
    items: [
      "Confirm eligibility and jurisdiction",
      "Send a notice or payer response",
      "Accept, reject or counter a settlement",
      "Initiate IDR and select an IDRE",
      "Submit evidence, offers or rule changes",
    ],
  },
  {
    id: "never",
    title: "Never autonomous",
    icon: "Ban",
    tone: "text-rose-700",
    items: [
      "Invent evidence, dates, codes or amounts",
      "Change live rules without approval",
      "Send PHI to consumer AI accounts",
      "Scrape licensed data or bypass controls",
      "Autonomously submit to the CMS Gateway",
    ],
  },
];

export const GATES = [
  "Resolve uncertain data",
  "Confirm eligibility",
  "Send negotiation notice",
  "Approve settlement",
  "Initiate IDR",
  "Select IDRE",
  "Approve evidence",
  "Submit final offer",
  "Activate rule change",
  "Close the case",
];

export const ARCHITECTURE = {
  inputs: ["Secure portal", "SFTP / API", "X12 835 / 837", "Approved mailbox", "Payment feeds"],
  stages: [
    { n: "01", title: "Normalize", desc: "Malware scan, OCR, X12 parsing, document matching, confidence scoring and duplicate checks." },
    { n: "02", title: "Control", desc: "Versioned rules, business-day calendars, durable workflow, arithmetic, retries and state recovery." },
    { n: "03", title: "AI case team", desc: "Ten agents using only allow-listed internal functions and permission-aware knowledge." },
    { n: "04", title: "Human workbench", desc: "Source viewer, exception queue, approvals, role controls, comments and named ownership." },
    { n: "05", title: "Approved action", desc: "Payer communication, certified IDR entity workflow and supervised Gateway package preparation." },
    { n: "06", title: "Outcome", desc: "Determination, remittance matching, cash aging, client reporting and the learning loop." },
  ],
  rail: [
    "Tenant isolation",
    "SSO + MFA + RBAC",
    "Encryption",
    "Secrets management",
    "Audit history",
    "PHI-safe logs",
    "Manual fallback",
  ],
};

export const STACK = [
  { title: "Intake & connections", desc: "Secure portal · SFTP · authenticated APIs · X12 835/837 parser · approved mailbox · malware scan · OCR" },
  { title: "Case & workflow", desc: "PostgreSQL · encrypted object storage · Temporal or Camunda · task queues · self-hosted n8n for low-risk notifications" },
  { title: "Rules & services", desc: "Python / FastAPI · versioned decision tables · business-day calendar · finance service · idempotency and retries" },
  { title: "AI & knowledge", desc: "Enterprise LLM endpoint · model gateway · permission-aware RAG · CMS guidance · SOPs · prompt registry · evaluations" },
  { title: "Benchmarks & analytics", desc: "Licensed FAIR Health data · CMS public-use files · internal outcomes · dbt · BI dashboards" },
  { title: "Security & operations", desc: "Okta or Entra ID · SSO · MFA · RBAC · KMS / Vault · DLP · SIEM · OpenTelemetry · PHI-safe logs" },
];

/** `gated: true` marks the two functions that carry an approval requirement. */
export const FUNCTIONS = [
  { name: "ingest_document" },
  { name: "extract_eob_fields" },
  { name: "run_eligibility_rules" },
  { name: "calculate_deadlines" },
  { name: "compare_qpa" },
  { name: "score_opportunity" },
  { name: "draft_notice" },
  { name: "assemble_evidence_packet" },
  { name: "validate_packet" },
  { name: "query_payer_history" },
  { name: "match_remittance" },
  { name: "record_approval", gated: true },
  { name: "write_audit_event" },
  { name: "prepare_gateway_package", gated: true },
];

export const TRACE = [
  { l: "Source", d: "Document + page" },
  { l: "Case version", d: "Immutable" },
  { l: "Rule version", d: "Pinned" },
  { l: "Model + prompt", d: "Registered" },
  { l: "Reviewer", d: "Named user" },
  { l: "Timestamp", d: "Signed" },
];

export const SECURITY_PILLARS = [
  { title: "Identity", desc: "SSO, MFA, named users, RBAC and least-privilege access." },
  { title: "Data", desc: "Encryption in transit and at rest, tenant isolation and field-level permissions." },
  { title: "Vendors", desc: "BAA and covered-service review for every vendor that handles ePHI." },
  { title: "AI policy", desc: "No PRISM data used for training, controlled retention, no consumer AI accounts." },
  { title: "Operations", desc: "PHI-safe logs, DLP, SIEM, monitoring, manual fallback and a kill switch." },
  { title: "Change control", desc: "Rule, model, prompt and SOP versions with test results and rollback." },
];

/**
 * These three notes are deliberate and must not be softened without
 * compliance sign-off — they are the difference between a claim and a
 * defensible statement.
 */
export const OPERATING_NOTES = [
  "PRISM publicly states HIPAA compliant and SOC 2 ready. Readiness is not the same as a completed independent audit.",
  "HHS guidance treats a cloud provider handling ePHI as a business associate, requiring a HIPAA-compliant BAA.",
  "CMS states the late-2026 IDR Gateway will permit only U.S.-based users. Submission stays supervised by authorized U.S.-based staff.",
];

export const PHASES = [
  {
    phase: "Phase 1",
    weeks: "Weeks 1–2",
    title: "Map, measure and design",
    items: ["Process map and baseline", "Data and PHI inventory", "Approval matrix and pilot scope", "Architecture and acceptance tests"],
  },
  {
    phase: "Phase 2",
    weeks: "Weeks 3–8",
    title: "Control the case",
    items: ["Document intake and extraction", "Verified case record", "Deadline and exception queues", "Shadow-mode accuracy review"],
  },
  {
    phase: "Phase 3",
    weeks: "Weeks 9–14",
    title: "Prepare the dispute",
    items: ["Negotiation copilot", "Evidence packet assembly", "Source citation and validation", "Human approval workspace"],
  },
  {
    phase: "Phase 4",
    weeks: "Weeks 15–24",
    title: "Learn, collect and report",
    items: ["Payer and IDRE intelligence", "Payment reconciliation", "Client and executive reporting", "Controlled expansion by segment"],
  },
];

export const METRICS = [
  { title: "Operational", items: ["Minutes per claim", "Cases per specialist", "Correction rate", "Deadline misses", "Queue aging"] },
  { title: "Quality", items: ["Eligibility precision", "Ineligible filing rate", "Unsupported statement rate", "Human override rate", "Packet rework"] },
  { title: "Financial", items: ["Incremental net recovery", "Recovery per claim", "Collected-cash aging", "Fees and operating cost", "Unpaid determination balance"] },
  { title: "Client", items: ["Cycle time", "Report delivery speed", "Case visibility", "Payer scorecard quality", "Exception response time"] },
];

export const DIAGNOSTIC = [
  {
    title: "PRISM provides",
    items: [
      "100–500 historical cases, de-identified first where possible",
      "Source documents, actions, outcomes and payments",
      "SOPs, templates, approval rules and user roles",
      "System, integration and security documentation",
    ],
  },
  {
    title: "The pilot selects",
    items: ["One specialty", "One or two payers", "One or two states", "A clear eligibility, volume and recovery profile"],
  },
  {
    title: "Diagnostic output",
    items: ["Verified process and data map", "Pilot backlog and acceptance tests", "Security and BAA decision log", "Phased build plan and ROI baseline"],
  },
];

export const SECTIONS = [
  { id: "principle", label: "Operating principle" },
  { id: "modules", label: "Platform modules" },
  { id: "lifecycle", label: "Case lifecycle" },
  { id: "agents", label: "AI case team" },
  { id: "control", label: "Human control" },
  { id: "architecture", label: "Architecture" },
  { id: "stack", label: "Technology" },
  { id: "security", label: "Security" },
  { id: "roadmap", label: "Rollout" },
  { id: "measurement", label: "Measurement" },
];
