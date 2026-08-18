import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Ban,
  Bell,
  BotMessageSquare,
  ChartColumn,
  ChevronRight,
  CircleCheckBig,
  Clock,
  Download,
  FileCheck2,
  GitMerge,
  Lock,
  ShieldCheck,
  SquareCheckBig,
  TriangleAlert,
  UserRoundCheck,
  Workflow,
  X,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AGENTS,
  ARCHITECTURE,
  BOUNDARY,
  DIAGNOSTIC,
  FUNCTIONS,
  GATES,
  HERO_STATS,
  LIFECYCLE,
  METRICS,
  MODULES,
  OPERATING_NOTES,
  PHASES,
  PRINCIPLES,
  SECTIONS,
  SECURITY_PILLARS,
  STACK,
  TRACE,
} from "@/data/prism-platform";

/* ------------------------------------------------------------------ *
 * Shared bits
 * ------------------------------------------------------------------ */

const MODULE_ICONS = {
  Download,
  FileCheck2,
  GitMerge,
  Workflow,
  ShieldCheck,
  ChartColumn,
  Bell,
  Clock,
};

const PRINCIPLE_ICONS = { AI: BotMessageSquare, Rules: SquareCheckBig, People: UserRoundCheck };
const BOUNDARY_ICONS = { Zap, Lock, Ban };
const BOUNDARY_BULLETS = { automatic: CircleCheckBig, approval: SquareCheckBig, never: X };

/** Hairline grid — the Swiss rule the rest of the site already uses. */
function RuleGrid({ as: Tag = "div", cols, className = "", children }) {
  return (
    <Tag className={`grid gap-px bg-slate-200 border border-slate-200 ${cols} ${className}`}>
      {children}
    </Tag>
  );
}

/** Statement left, argument right — one head treatment for every section. */
function SectionHead({ eyebrow, title, lede, invert = false }) {
  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-x-16 lg:items-end">
      <div className={`overline lg:col-span-12 ${invert ? "text-blue-200" : "text-slate-500"}`}>
        {eyebrow}
      </div>
      <h2
        className={`font-display text-4xl sm:text-5xl tracking-tight font-light mt-4 leading-[1.1] lg:col-span-7 ${
          invert ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h2>
      <p
        className={`mt-6 lg:mt-0 lg:pb-2 text-lg leading-relaxed max-w-2xl lg:col-span-5 ${
          invert ? "text-slate-300" : "text-slate-600"
        }`}
      >
        {lede}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Section jump rail (scroll-spy)
 * ------------------------------------------------------------------ */

function SectionNav() {
  const [active, setActive] = useState(SECTIONS[0].id);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-140px 0px -65% 0px", threshold: 0 }
    );
    const nodes = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="On this page"
      className="sticky top-16 z-40 bg-white/95 backdrop-blur border-b border-slate-200"
      data-testid="products-section-nav"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <ul className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={active === s.id ? "true" : undefined}
                className={`block whitespace-nowrap px-4 first:pl-0 pt-3.5 pb-3 text-[12.5px] font-semibold tracking-wide border-b-2 transition-colors cursor-pointer ${
                  active === s.id
                    ? "text-[#0A2540] border-[#2563EB]"
                    : "text-slate-500 border-transparent hover:text-slate-900"
                }`}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ *
 * Agent board — the interactive centrepiece
 * ------------------------------------------------------------------ */

function AgentBoard() {
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef([]);

  const groups = useMemo(
    () => [
      { label: "Case agents · 1–8", agents: AGENTS.filter((a) => a.scope === "case") },
      { label: "Portfolio agents · 9–10", agents: AGENTS.filter((a) => a.scope === "portfolio") },
    ],
    []
  );

  // Roving tabindex across both tablists, so the whole team is one keyboard walk.
  const onKeyDown = useCallback((event) => {
    const keys = {
      ArrowDown: (i) => (i + 1) % AGENTS.length,
      ArrowRight: (i) => (i + 1) % AGENTS.length,
      ArrowUp: (i) => (i - 1 + AGENTS.length) % AGENTS.length,
      ArrowLeft: (i) => (i - 1 + AGENTS.length) % AGENTS.length,
      Home: () => 0,
      End: () => AGENTS.length - 1,
    };
    const move = keys[event.key];
    if (!move) return;
    event.preventDefault();
    setSelected((current) => {
      const next = move(current);
      tabRefs.current[next]?.focus();
      return next;
    });
  }, []);

  const agent = AGENTS[selected];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-px bg-slate-200 border border-slate-200">
      <div className="bg-white lg:col-span-4">
        {groups.map((group) => (
          <div key={group.label}>
            <div className="px-5 pt-3.5 pb-2.5 bg-slate-50 border-b border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                {group.label}
              </span>
            </div>
            <div role="tablist" aria-label={group.label} aria-orientation="vertical">
              {group.agents.map((a) => {
                const index = AGENTS.indexOf(a);
                const isSelected = index === selected;
                return (
                  <button
                    key={a.n}
                    type="button"
                    role="tab"
                    id={`agent-tab-${a.n}`}
                    aria-controls={`agent-panel-${a.n}`}
                    aria-selected={isSelected}
                    tabIndex={isSelected ? 0 : -1}
                    ref={(node) => {
                      tabRefs.current[index] = node;
                    }}
                    onClick={() => setSelected(index)}
                    onKeyDown={onKeyDown}
                    data-testid={`agent-tab-${a.n}`}
                    className={`w-full text-left grid grid-cols-[auto_1fr_auto] items-center gap-3.5 px-5 py-3.5 border-b border-slate-200 cursor-pointer transition-colors ${
                      isSelected ? "bg-slate-100 shadow-[inset_3px_0_0_#2563EB]" : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`font-mono text-xs tabular-nums w-5 ${
                        isSelected ? "text-[#2563EB]" : "text-slate-500"
                      }`}
                    >
                      {String(a.n).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block font-display text-[15px] font-medium text-slate-900 leading-tight">
                        {a.name}
                      </span>
                      <span className="block mt-0.5 text-[11.5px] font-medium text-slate-500">{a.kind}</span>
                    </span>
                    <ChevronRight
                      className={`h-4 w-4 ${isSelected ? "text-[#2563EB]" : "text-slate-500"}`}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white lg:col-span-6 p-8 sm:p-11">
        {AGENTS.map((a, index) => (
          <div
            key={a.n}
            role="tabpanel"
            id={`agent-panel-${a.n}`}
            aria-labelledby={`agent-tab-${a.n}`}
            tabIndex={0}
            hidden={index !== selected}
            data-testid={`agent-panel-${a.n}`}
          >
            <div className="font-display text-6xl font-light leading-none tabular-nums text-[#8695A9]">
              {String(a.n).padStart(2, "0")}
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-normal mt-2 text-slate-900">{a.name}</h3>
            <span className="inline-block mt-3.5 text-[11px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {a.kind}
            </span>

            <dl className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 border border-slate-200">
              <div className="bg-white p-5">
                <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">What it does</dt>
                <dd className="mt-2.5 text-[14.5px] text-slate-700 leading-relaxed">{a.does}</dd>
              </div>
              <div className="bg-white p-5">
                <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Where it works</dt>
                <dd className="mt-2.5 text-[14.5px] text-slate-700 leading-relaxed">{a.where}</dd>
              </div>
              <div className="bg-white p-5 md:col-span-2">
                <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">What it changes</dt>
                <dd className="mt-2.5 text-[14.5px] text-slate-700 leading-relaxed">{a.benefit}</dd>
              </div>
            </dl>

            <div className="mt-6 flex gap-3 items-start border-l-[3px] border-amber-700 bg-amber-50 px-4 py-4 rounded-r">
              <Lock className="h-4 w-4 text-amber-700 shrink-0 mt-1" aria-hidden="true" />
              <p className="text-sm text-amber-900 leading-relaxed">
                <strong className="font-bold">Approval gate.</strong> {a.gate}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

export default function Products() {
  return (
    <div data-testid="products-page">
      <SectionNav />

      {/* ---------------------------------------------------------- HERO */}
      <section className="relative bg-white">
        <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-16 sm:pt-28 sm:pb-20 relative">
          <div className="overline text-slate-500">Product</div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-tight font-light mt-4 text-slate-900 max-w-4xl leading-[1.05]">
            The PRISM IDR Platform, now with an AI case team.
          </h1>
          <p className="mt-8 text-lg text-slate-600 max-w-2xl leading-relaxed">
            A complete operating system for No Surprises Act dispute management. Eight integrated
            modules, ten business agents, one workspace, zero spreadsheets — built so AI reads and
            prepares, deterministic rules calculate and control, and people approve every
            consequential decision.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button
              asChild
              data-testid="products-cta-top"
              className="rounded-md bg-[#0A2540] hover:bg-[#0F3A66] text-white h-12 px-6 gap-1"
            >
              <Link to="/contact">
                Book a demo <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              data-testid="products-cta-agents"
              className="rounded-md h-12 px-6 border-slate-300 text-slate-900 hover:bg-slate-100"
            >
              <a href="#agents">Explore the AI case team</a>
            </Button>
          </div>

          <RuleGrid as="ul" cols="grid-cols-1 md:grid-cols-2 lg:grid-cols-4" className="mt-14">
            {HERO_STATS.map((s, i) => (
              <li key={i} className="bg-white p-6" data-testid={`hero-stat-${i}`}>
                <div className="font-display text-4xl font-light text-[#0A2540] tabular-nums leading-none">
                  {s.k}
                </div>
                <div className="mt-2.5 text-[13px] text-slate-600 leading-relaxed">{s.v}</div>
              </li>
            ))}
          </RuleGrid>
        </div>
      </section>

      {/* ------------------------------------------- OPERATING PRINCIPLE */}
      <section id="principle" className="scroll-mt-32 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <SectionHead
            eyebrow="The operating principle"
            title="AI reads and prepares. Rules calculate and control. People approve."
            lede="Capacity should never come from giving software uncontrolled authority. PRISM separates the three kinds of work so every dispute moves faster without loosening a single control."
          />
          <RuleGrid cols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" className="mt-12">
            {PRINCIPLES.map((p) => {
              const Icon = PRINCIPLE_ICONS[p.tag];
              return (
                <div key={p.tag} className="bg-white p-8" data-testid={`principle-${p.tag.toLowerCase()}`}>
                  <div className={`inline-flex items-center gap-2 font-display text-[13px] font-semibold uppercase tracking-[0.14em] ${p.tone}`}>
                    <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    {p.tag}
                  </div>
                  <h3 className="font-display text-xl font-medium mt-5 text-slate-900">{p.title}</h3>
                  <p className="mt-3 text-[14.5px] text-slate-600 leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </RuleGrid>
        </div>
      </section>

      {/* -------------------------------------------------------- MODULES */}
      <section id="modules" className="scroll-mt-32 py-24 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHead
            eyebrow="The platform"
            title="Eight integrated modules, one workspace."
            lede="The modules you already run the practice on. Each one now has an agent working inside it — preparing the work, never authorizing it."
          />
          <RuleGrid cols="grid-cols-1 md:grid-cols-2 lg:grid-cols-4" className="mt-12">
            {MODULES.map((m, i) => {
              const Icon = MODULE_ICONS[m.icon];
              return (
                <article
                  key={m.title}
                  data-testid={`module-${i}`}
                  className="bg-white p-8 hover:bg-slate-50 transition-colors"
                >
                  <div className="text-xs text-slate-500 font-mono tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <Icon className="h-7 w-7 text-[#0A2540] mt-4" aria-hidden="true" />
                  <h3 className="font-display text-lg font-medium mt-4 text-slate-900">{m.title}</h3>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">{m.desc}</p>
                  <span className="inline-block mt-3.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-2.5 py-1">
                    + {m.agent}
                  </span>
                </article>
              );
            })}
          </RuleGrid>
        </div>
      </section>

      {/* ------------------------------------------------------ LIFECYCLE */}
      <section id="lifecycle" className="scroll-mt-32 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <SectionHead
            eyebrow="Case lifecycle"
            title="One dispute, one controlled lifecycle."
            lede="A single case record carries the claim from intake to collected cash. No handoffs between disconnected systems, no case closed before the money actually arrives."
          />
          <RuleGrid as="ol" cols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-5" className="mt-12">
            {LIFECYCLE.map((s, i) => (
              <li key={s.n} className="bg-white p-6 relative group" data-testid={`lifecycle-${i}`}>
                <span className="absolute inset-x-0 top-0 h-[3px] bg-[#2563EB] opacity-20 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                <div className="font-mono text-xs text-[#2563EB] tabular-nums">{s.n}</div>
                <h3 className="font-display text-[17px] font-semibold uppercase tracking-wide mt-3 text-slate-900">
                  {s.title}
                </h3>
                <p className="mt-2.5 text-[13.5px] text-slate-600 leading-relaxed">{s.desc}</p>
              </li>
            ))}
          </RuleGrid>
        </div>
      </section>

      {/* ----------------------------------------------------- AGENT BOARD */}
      <section id="agents" className="scroll-mt-32 py-24 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHead
            eyebrow="The AI case team"
            title="Ten business agents. Every one of them has a supervisor."
            lede="Eight agents operate individual cases; two strengthen regulation and reporting across the whole portfolio. Select an agent to see what it does, where it works, what it changes, and the approval gate it can never cross."
          />
          <div className="mt-12">
            <AgentBoard />
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- HUMAN CONTROL */}
      <section id="control" className="scroll-mt-32 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <SectionHead
            eyebrow="Human control"
            title="A clear automation boundary."
            lede="The safest design draws a hard line between automatic preparation and consequential decisions. Here is exactly where PRISM draws it."
          />

          <RuleGrid cols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" className="mt-12">
            {BOUNDARY.map((col) => {
              const Icon = BOUNDARY_ICONS[col.icon];
              const Bullet = BOUNDARY_BULLETS[col.id];
              return (
                <div key={col.id} className="bg-white p-8" data-testid={`boundary-${col.id}`}>
                  <h3 className={`flex items-center gap-2.5 text-[15px] font-bold uppercase tracking-[0.1em] ${col.tone}`}>
                    <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    {col.title}
                  </h3>
                  <ul className="mt-2">
                    {col.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 py-3 border-b border-dashed border-slate-200 last:border-0 text-sm text-slate-700 leading-snug"
                      >
                        <Bullet className={`h-[15px] w-[15px] shrink-0 mt-1 ${col.tone}`} aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </RuleGrid>

          <div className="mt-14">
            <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Ten mandatory human gates across the case
            </p>
            <ul className="mt-5 flex flex-wrap gap-px bg-slate-200 border border-slate-200">
              {GATES.map((gate, i) => (
                <li
                  key={gate}
                  className="bg-white flex-[1_1_200px] px-4 py-4 flex gap-3 items-center text-[13.5px] text-slate-700 leading-snug"
                >
                  <span className="font-mono text-[11px] text-white bg-[#0A2540] rounded-full w-6 h-6 inline-flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  {gate}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- ARCHITECTURE */}
      <section id="architecture" className="scroll-mt-32 py-24 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHead
            eyebrow="Architecture"
            title="A single case record coordinates everything."
            lede="Agents, deterministic services, reviewers and official channels all read and write one case record — and everything they do runs along the same control rail."
          />

          <ul className="mt-10 flex flex-wrap gap-2" aria-label="Inputs">
            {ARCHITECTURE.inputs.map((input) => (
              <li
                key={input}
                className="font-mono text-[12.5px] text-slate-700 bg-slate-100 border border-slate-200 rounded-md px-3 py-1.5"
              >
                {input}
              </li>
            ))}
          </ul>

          <RuleGrid cols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" className="mt-6">
            {ARCHITECTURE.stages.map((stage) => (
              <div key={stage.n} className="bg-white p-6" data-testid={`arch-${stage.n}`}>
                <div className="font-mono text-xs text-[#2563EB] tabular-nums">{stage.n}</div>
                <h3 className="font-display text-base font-semibold uppercase tracking-wide mt-3 text-slate-900">
                  {stage.title}
                </h3>
                <p className="mt-2.5 text-[13.5px] text-slate-600 leading-relaxed">{stage.desc}</p>
              </div>
            ))}
          </RuleGrid>

          <div className="mt-px bg-[#0A2540] text-slate-300 px-6 py-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
            <strong className="text-white font-bold uppercase tracking-[0.16em] text-[11px]">Control rail</strong>
            {ARCHITECTURE.rail.map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <span className="w-[5px] h-[5px] rounded-full bg-[#3B82F6]" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- STACK */}
      <section id="stack" className="scroll-mt-32 bg-[#0A2540] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <SectionHead
            invert
            eyebrow="Technology"
            title="Agents don't get open access. They get a gateway."
            lede="Every action an agent takes passes through an allow-listed internal function. There is no general-purpose tool use, no free-form browsing, and no path to an external system that skips the approval record."
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/15 border border-white/15">
            {STACK.map((s) => (
              <div key={s.title} className="bg-[#071A2E] p-7">
                <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-blue-200">{s.title}</h3>
                <p className="mt-3.5 text-sm text-slate-300 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-14">
            <p className="overline text-blue-200">Sample allow-listed internal functions</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {FUNCTIONS.map((fn) => (
                <li
                  key={fn.name}
                  className={`font-mono text-[12.5px] rounded-md px-3 py-1.5 border ${
                    fn.gated
                      ? "text-amber-200 border-amber-200/45 bg-amber-200/10"
                      : "text-blue-100 border-white/20 bg-white/5"
                  }`}
                >
                  {fn.name}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-slate-300 leading-relaxed max-w-3xl border-l-[3px] border-[#3B82F6] pl-4">
              External communication stays blocked until{" "}
              <code className="font-mono text-amber-200">record_approval</code> confirms both the
              authorized reviewer and the current case version.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- SECURITY */}
      <section id="security" className="scroll-mt-32 py-24 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHead
            eyebrow="Security & compliance"
            title="PHI-safe and audit-ready by design."
            lede="Security is part of the workflow, not a layer bolted on after automation. Every important action carries the same six-part trace."
          />

          <ul
            className="mt-10 flex flex-wrap gap-px bg-slate-200 border border-slate-200"
            aria-label="Required trace for every important action"
          >
            {TRACE.map((t) => (
              <li key={t.l} className="bg-white flex-[1_1_150px] px-5 py-4">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">{t.l}</div>
                <div className="mt-2 font-display text-base font-medium text-[#0A2540]">{t.d}</div>
              </li>
            ))}
          </ul>

          <RuleGrid cols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" className="mt-14">
            {SECURITY_PILLARS.map((p) => (
              <div key={p.title} className="bg-white p-6">
                <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#0A2540]">{p.title}</h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </RuleGrid>

          <div className="mt-12 border border-slate-200 border-l-[3px] border-l-[#0A2540] bg-slate-50 p-7 rounded-r-md">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#0A2540]">
              Important operating notes
            </p>
            <ul>
              {OPERATING_NOTES.map((note) => (
                <li key={note} className="mt-3.5 flex gap-3 text-sm text-slate-700 leading-relaxed">
                  <TriangleAlert className="h-4 w-4 text-amber-700 shrink-0 mt-1" aria-hidden="true" />
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- ROADMAP */}
      <section id="roadmap" className="scroll-mt-32 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <SectionHead
            eyebrow="Rollout"
            title="Value in four controlled stages."
            lede="Start with reliable intake and deadline control, then add drafting, intelligence and payment automation. Nothing ships to production before it passes a shadow-mode accuracy gate."
          />
          <RuleGrid as="ol" cols="grid-cols-1 md:grid-cols-2 lg:grid-cols-4" className="mt-12">
            {PHASES.map((p, i) => (
              <li key={p.phase} className="bg-white p-8" data-testid={`phase-${i}`}>
                <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#2563EB]">{p.phase}</div>
                <div className="mt-1.5 font-mono text-xs text-slate-500">{p.weeks}</div>
                <h3 className="font-display text-xl font-medium mt-3.5 text-slate-900">{p.title}</h3>
                <ul className="mt-3">
                  {p.items.map((item) => (
                    <li key={item} className="mt-3 flex gap-2.5 text-[13.5px] text-slate-600 leading-snug">
                      <span className="text-[#2563EB] shrink-0" aria-hidden="true">
                        —
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </RuleGrid>
        </div>
      </section>

      {/* ---------------------------------------------------- MEASUREMENT */}
      <section id="measurement" className="scroll-mt-32 py-24 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHead
            eyebrow="Measurement"
            title="ROI measured in capacity and collected cash."
            lede="We use your baseline to prove value. No percentage is promised before the pilot is measured, and every agent runs in shadow mode against specialist decisions first."
          />

          <RuleGrid cols="grid-cols-1 md:grid-cols-2 lg:grid-cols-4" className="mt-12">
            {METRICS.map((m) => (
              <div key={m.title} className="bg-white p-7">
                <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#0A2540]">{m.title}</h3>
                <ul className="mt-2">
                  {m.items.map((item) => (
                    <li
                      key={item}
                      className="py-2.5 border-b border-dashed border-slate-200 last:border-0 text-sm text-slate-700"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </RuleGrid>

          <div className="mt-10 border border-slate-200 bg-white p-8 rounded-md">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">ROI framework</p>
            <code className="block mt-4 font-mono text-sm sm:text-base text-[#0A2540] leading-relaxed overflow-x-auto whitespace-nowrap pb-2">
              ( labour capacity gained + incremental recovery + prevented losses − platform cost ) ÷ platform cost
            </code>
            <p className="mt-4 text-sm text-slate-600 leading-relaxed max-w-3xl">
              Tracked with finance-approved definitions, collection timing and material exclusions.
              Agents run in shadow mode first: their output is compared to specialist decisions,
              every material error is investigated, and scope expands only after accuracy, security
              and workflow acceptance gates pass.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ CLOSING CTA */}
      <section className="bg-[#0A2540] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 text-center">
          <h2 className="font-display text-4xl sm:text-5xl tracking-tight font-light">
            See PRISM resolve a live dispute.
          </h2>
          <p className="mt-6 text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A 45-minute working session with our IDR strategists. Bring a real EOB and we'll walk
            through eligibility, QPA validation and the recommended offer in front of you — then
            show you the same case running through the agent workbench.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            <Button
              asChild
              data-testid="products-cta-bottom"
              className="rounded-md bg-white text-[#0A2540] hover:bg-blue-50 h-12 px-6"
            >
              <Link to="/contact">
                Schedule demo <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              data-testid="products-cta-diagnostic"
              className="rounded-md h-12 px-6 bg-transparent text-white border-white/35 hover:bg-white/10 hover:text-white"
            >
              <Link to="/contact">Approve a 30-day diagnostic</Link>
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-px bg-white/15 border border-white/15 text-left">
            {DIAGNOSTIC.map((d) => (
              <div key={d.title} className="bg-[#071A2E] p-6">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-200">{d.title}</h3>
                <ul>
                  {d.items.map((item) => (
                    <li key={item} className="mt-3 flex gap-2.5 text-[13.5px] text-slate-200 leading-snug">
                      <span className="text-[#3B82F6] shrink-0" aria-hidden="true">
                        —
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
