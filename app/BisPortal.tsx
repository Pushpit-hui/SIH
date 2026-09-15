"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  api,
  Product,
  Standard,
  ComplianceAlert,
  ComplianceStatus,
  DashboardStats,
  ChatResponse,
  LicenceVerification,
  ComplaintResult,
} from "../lib/api";

type Page = "dashboard" | "assistant" | "passport" | "standards" | "services" | "alerts" | "details" | "reports" | "analytics" | "settings";

const navigation: { label: string; href: string; icon: string; page: Page }[] = [
  { label: "Dashboard", href: "/", icon: "grid", page: "dashboard" },
  { label: "AI Assistant", href: "/ai-assistant", icon: "sparkle", page: "assistant" },
  { label: "Product Compliance Passport", href: "/product-compliance-passport", icon: "passport", page: "passport" },
  { label: "Standards & Requirements", href: "/standards-requirements", icon: "book", page: "standards" },
  { label: "Consumer Services", href: "/applications-cases", icon: "briefcase", page: "services" },
  { label: "Compliance Alerts", href: "/compliance-alerts", icon: "alert", page: "alerts" },
  { label: "Reports", href: "/reports", icon: "file", page: "reports" },
  { label: "Analytics", href: "/analytics", icon: "chart", page: "analytics" },
  { label: "Settings", href: "/settings", icon: "settings", page: "settings" },
];

function Icon({ name, className = "" }: { name: string; className?: string }) {
  const paths: Record<string, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    sparkle: <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Zm6 12 .8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15Z"/>,
    passport: <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h4"/></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z"/><path d="M4 19h16M8 7h8"/></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/></>,
    alert: <><path d="m12 3 9 16H3L12 3Z"/><path d="M12 9v4M12 16h.01"/></>,
    chart: <><path d="M4 19V5M4 19h16"/><path d="m7 15 4-4 3 2 5-6"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.12 2.12-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20.3h-3v-.08A1.7 1.7 0 0 0 10.68 18.66a1.7 1.7 0 0 0-1.88.34l-.06.06-2.12-2.12.06-.06A1.7 1.7 0 0 0 7.02 15 1.7 1.7 0 0 0 5.46 14H5.4v-3h.06A1.7 1.7 0 0 0 7.02 10a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.12-2.12.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 11.7 4.78V4.7h3v.08a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.12 2.12-.06.06A1.7 1.7 0 0 0 19.4 10 1.7 1.7 0 0 0 20.96 11H21v3h-.04A1.7 1.7 0 0 0 19.4 15Z"/></>,
    search: <><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></>, 
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"/><path d="M10 21h4"/></>,
    arrow: <path d="M5 12h14M13 6l6 6-6 6"/>, 
    check: <path d="m5 12 4 4L19 6"/>, 
    plus: <path d="M12 5v14M5 12h14"/>, 
    upload: <><path d="M12 16V4M8 8l4-4 4 4M5 20h14"/></>, 
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>, 
    file: <><path d="M6 3h8l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M14 3v5h5M8 13h8M8 17h6"/></>, 
    shield: <><path d="M12 3 20 6v5c0 5-3.4 8.3-8 10-4.6-1.7-8-5-8-10V6l8-3Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></>, 
    down: <path d="m7 10 5 5 5-5"/>,
  };
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const Stat = ({ label, value, trend, icon, tone }: { label: string; value: string | number; trend: string; icon: string; tone: string }) => (
  <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
      </div>
      <span className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}>
        <Icon name={icon} className="h-5 w-5"/>
      </span>
    </div>
    <p className="mt-4 text-xs text-slate-400">
      <b className="text-emerald-600">{trend}</b> vs. last month
    </p>
  </article>
);

const Badge = ({ children, tone = "blue" }: { children: React.ReactNode; tone?: "blue" | "green" | "amber" | "rose" | "slate" }) => (
  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${{ blue: "bg-blue-50 text-blue-700", green: "bg-emerald-50 text-emerald-700", amber: "bg-amber-50 text-amber-700", rose: "bg-rose-50 text-rose-700", slate: "bg-slate-100 text-slate-600" }[tone]}`}>
    {children}
  </span>
);

function Shell({ page, children }: { page: Page; children: React.ReactNode }) {
  const [persona, setPersona] = useState<"manufacturer" | "consumer">("manufacturer");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-slate-200 bg-white px-4 py-6 lg:flex">
        <Link href="/" className="mb-9 flex items-center gap-3 px-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-700 text-lg font-bold text-white">B</span>
          <span>
            <b className="block text-sm tracking-tight text-slate-900">BIS Compliance</b>
            <span className="text-xs text-slate-400">AI Service Assistant</span>
          </span>
        </Link>
        <nav className="space-y-1">
          {navigation.map(item => (
            <Link
              href={item.href}
              key={item.label}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${page === item.page ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}
            >
              <Icon name={item.icon} className="h-5 w-5"/>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl bg-slate-900 p-4 text-white">
          <p className="text-sm font-semibold">Need BIS guidance?</p>
          <p className="mt-1 text-xs leading-5 text-slate-300">Ask the assistant about standards, certification or services.</p>
          <Link href="/ai-assistant" className="mt-3 inline-block text-xs font-semibold text-blue-300">
            Open AI Assistant <span aria-hidden>→</span>
          </Link>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-5 backdrop-blur sm:px-8">
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-700 font-bold text-white">B</span>
            <b className="text-sm text-slate-900">BIS Compliance</b>
          </Link>

          {/* Persona Switcher Toggle */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setPersona("manufacturer")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${persona === "manufacturer" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              <span>🏭 Industry Mode</span>
            </button>
            <button
              type="button"
              onClick={() => setPersona("consumer")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${persona === "consumer" ? "bg-blue-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              <span>👤 Consumer Mode</span>
            </button>
          </div>

          <div className="relative hidden w-full max-w-md lg:block">
            <Icon name="search" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/>
            <input
              aria-label="Global search"
              placeholder="Search products, standards, IS codes or services..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
            />
          </div>

          <div className="flex items-center gap-3">
            <button aria-label="Notifications" className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100">
              <Icon name="bell" className="h-5 w-5"/>
              <i className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-white bg-rose-500"/>
            </button>
            <span className="hidden h-8 w-px bg-slate-200 sm:block"/>
            <button className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-50">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-violet-500 text-xs font-bold text-white">PK</span>
              <span className="hidden text-left sm:block">
                <b className="block text-sm text-slate-700">Pushpit Kumar</b>
                <span className="block text-xs text-blue-700 font-semibold">{persona === "consumer" ? "Citizen / Consumer" : "Manufacturer"}</span>
              </span>
              <Icon name="down" className="hidden h-4 w-4 text-slate-400 sm:block"/>
            </button>
          </div>
        </header>

        {persona === "consumer" && (
          <div className="mx-auto max-w-7xl px-5 pt-6 sm:px-8">
            <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 p-4 text-white shadow-md flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/20">
                  <Icon name="shield" className="h-5 w-5 text-white"/>
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-200">Consumer Services Active</p>
                  <p className="text-sm font-semibold">Verify BIS Licences, Check Gold Hallmarks (HUID), &amp; File Citizen Grievances</p>
                </div>
              </div>
              <Link href="/applications-cases" className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50 shadow-sm transition">
                Open Consumer Portal →
              </Link>
            </div>
          </div>
        )}

        <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [compliance, setCompliance] = useState<ComplianceStatus | null>(null);

  useEffect(() => {
    api.getDashboardStats().then(setStats).catch(() => {});
    api.getProducts().then(products => {
      if (products && products.length > 0) {
        api.getProductCompliance(products[0].product_id).then(setCompliance).catch(() => {});
      }
    }).catch(() => {});
  }, []);

  const actions = [
    ["Find a Standard", "Search applicable Indian Standards", "book"],
    ["Check Product Compliance", "Assess readiness for your product", "shield"],
    ["Verify BIS / HUID", "Verify certification and hallmarking", "check"],
    ["Explore BIS Services", "Discover applications and services", "briefcase"],
  ];

  const readinessPct = compliance?.readiness_percentage ? Math.round(compliance.readiness_percentage) : 72;
  const completedReqs = compliance?.completed ?? 8;
  const pendingReqs = compliance?.pending ?? 3;

  return (
    <Shell page="dashboard">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-blue-700">SIH26107 · AI-powered BIS Compliance Copilot</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">BIS Compliance Assistant</h1>
          <p className="mt-2 text-sm text-slate-500">Turn product requirements into a clear, source-backed compliance journey.</p>
        </div>
        <Badge tone="green">System status: Ready</Badge>
      </div>

      <section className="rounded-2xl bg-gradient-to-br from-blue-700 via-blue-700 to-indigo-700 p-5 text-white shadow-lg sm:p-7">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-blue-100">
            <Icon name="sparkle" className="h-5 w-5"/>
            <span className="text-sm font-semibold">AI Compliance Copilot</span>
          </div>
          <h2 className="mt-3 text-xl font-bold sm:text-2xl">What can we help you understand today?</h2>
          <p className="mt-2 text-sm leading-6 text-blue-100">Get tailored BIS standards, certification and service guidance for your product.</p>
          <div className="mt-5 flex rounded-xl bg-white p-1.5 shadow-lg">
            <input
              aria-label="Ask the BIS assistant"
              className="min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              placeholder="Ask about BIS standards, certification, hallmarking or services..."
            />
            <Link href="/ai-assistant" className="grid h-10 w-10 place-items-center rounded-lg bg-blue-600 text-white">
              <Icon name="arrow" className="h-5 w-5"/>
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map(([title, detail, icon]) => (
          <Link
            href={title === "Find a Standard" ? "/standards-requirements" : title === "Check Product Compliance" ? "/product-compliance-passport" : title === "Explore BIS Services" ? "/applications-cases" : "/ai-assistant"}
            key={title}
            className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <Icon name={icon} className="h-5 w-5"/>
            </span>
            <p className="mt-3 text-sm font-bold text-slate-800">{title}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
          </Link>
        ))}
      </section>

      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total Products" value={stats?.total_products ?? 12} trend="+2" icon="passport" tone="bg-blue-50 text-blue-600"/>
        <Stat label="Active Standards" value={stats?.active_standards ?? 6} trend="+1" icon="clock" tone="bg-violet-50 text-violet-600"/>
        <Stat label="Active Certifications" value={stats?.active_certifications ?? 42} trend="+14.2%" icon="check" tone="bg-emerald-50 text-emerald-600"/>
        <Stat label="Critical Alerts" value={stats?.critical_alerts ?? 3} trend="-25%" icon="alert" tone="bg-amber-50 text-amber-600"/>
      </section>

      <section className="mt-7 grid gap-7 xl:grid-cols-[1.3fr_.7fr]">
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50/60 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Product Compliance Passport</p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">{compliance?.product_name || "Electric Kettle"}</h2>
                <p className="mt-1 text-sm text-slate-500">Household electrical appliance · PCP-ELK-24018</p>
              </div>
              <Badge tone="amber">In progress</Badge>
            </div>
          </div>
          <div className="p-5 sm:p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="grid h-24 w-24 shrink-0 place-items-center rounded-full border-8 border-blue-100 text-center">
                <span>
                  <b className="text-2xl text-blue-700">{readinessPct}%</b>
                  <small className="block text-[10px] text-slate-400">ready</small>
                </span>
              </div>
              <div className="grid flex-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-400">Applicable standards</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {compliance?.applicable_standards?.map(s => s.standard_number).join(" · ") || "IS 302-2-15 · IS 4250"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Compliance scheme</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">ISI Marking Scheme</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Requirements</p>
                  <p className="mt-1 text-sm font-semibold text-emerald-700">
                    {completedReqs} completed <span className="text-slate-400">· {pendingReqs} pending</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Next milestone</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">Factory test evidence</p>
                </div>
              </div>
            </div>
            <Link href="/case-details" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">
              View Compliance Roadmap <Icon name="arrow" className="h-4 w-4"/>
            </Link>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">Recommended Actions</h2>
              <p className="mt-1 text-sm text-slate-500">Prioritized for {compliance?.product_name || "Electric Kettle"}</p>
            </div>
            <Link href="/case-details" className="text-xs font-semibold text-blue-700">View roadmap</Link>
          </div>
          <div className="mt-5 space-y-4">
            <div className="flex gap-3">
              <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-rose-500"/>
              <div>
                <p className="text-sm font-semibold text-slate-700">Upload dielectric strength report</p>
                <p className="mt-1 text-xs text-slate-500">Required before laboratory assessment.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-amber-500"/>
              <div>
                <p className="text-sm font-semibold text-slate-700">Confirm rated capacity marking</p>
                <p className="mt-1 text-xs text-slate-500">Label artwork needs BIS marking review.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-blue-500"/>
              <div>
                <p className="text-sm font-semibold text-slate-700">Start licence application</p>
                <p className="mt-1 text-xs text-slate-500">Prepare documents for the ISI scheme.</p>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900">Recent Compliance Activity</h2>
            <p className="mt-1 text-sm text-slate-500">Latest progress across your products</p>
          </div>
          <Link href="/product-compliance-passport" className="text-xs font-semibold text-blue-700">View all</Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {(stats?.recent_activity || [
            { title: "Standard identified", detail: "IS 302-2-15 mapped to Electric Kettle", time: "20 min ago", color: "bg-blue-500" },
            { title: "Document uploaded", detail: "Product safety test report received", time: "2 hrs ago", color: "bg-violet-500" },
            { title: "Requirement completed", detail: "Product labelling evidence verified", time: "Yesterday", color: "bg-emerald-500" },
            { title: "Compliance alert generated", detail: "IS 4250 amendment needs review", time: "Yesterday", color: "bg-amber-500" },
          ]).map((item) => (
            <div key={item.title + item.detail} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <span className={`mb-3 block h-2.5 w-2.5 rounded-full ${item.color}`}/>
              <p className="text-sm font-semibold text-slate-700">{item.title}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">{item.detail}</p>
              <p className="mt-3 text-[11px] text-slate-400">{item.time}</p>
            </div>
          ))}
        </div>
      </section>
    </Shell>
  );
}

interface ChatMsg {
  sender: "user" | "assistant";
  text: string;
  sources?: string[];
  standards?: Array<{ code: string; title: string }>;
  requirements?: string[];
  nextSteps?: string[];
  clarifyingQuestions?: string[];
  suggestedPrompts?: string[];
}

function Assistant() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      sender: "assistant",
      text: "Hello, Pushpit. I can help you identify applicable Indian Standards, understand certification or hallmarking requirements, and plan your compliance journey. I have your **Electric Kettle** profile ready.",
      suggestedPrompts: [
        "Which BIS standards apply to my Electric Kettle?",
        "What are the dielectric strength test requirements?",
        "How do I apply for the ISI mark for home appliances?",
      ],
    },
    {
      sender: "user",
      text: "Which BIS standards apply to my Electric Kettle?",
    },
    {
      sender: "assistant",
      text: "For a domestic electric kettle, the primary product standard is **IS 4250**. Safety requirements are read with **IS 302-2-15**.",
      standards: [
        { code: "IS 4250", title: "Domestic electric kettles" },
        { code: "IS 302-2-15", title: "Household appliance safety" },
      ],
      requirements: [
        "Electrical safety and dielectric strength test evidence",
        "Rated capacity, voltage and product marking artwork",
        "Factory quality-control records",
      ],
      nextSteps: [
        "1. Confirm model and rated capacity against IS 4250.",
        "2. Upload test reports and final artwork to your Passport.",
        "3. Start the BIS licence application after evidence review.",
      ],
      clarifyingQuestions: [
        "What is the rated liquid capacity (e.g. 1.5L vs commercial bulk volume)?",
        "Does the heating element use an automatic boil-dry cut-off mechanism?",
        "Is the body stainless steel, food-grade polypropylene, or borosilicate glass?",
      ],
      sources: ["IS 4250", "IS 302-2-15", "BIS Scheme I"],
    },
  ]);

  const handleSend = async (queryText?: string) => {
    const q = (queryText || question).trim();
    if (!q || loading) return;

    // Add user message
    const userMsg: ChatMsg = { sender: "user", text: q };
    setMessages(prev => [...prev, userMsg]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await api.sendChat(q);
      const assistantMsg: ChatMsg = {
        sender: "assistant",
        text: res.answer,
        sources: res.sources || [],
        requirements: res.requirements?.map(r => `${r.requirement_title} [${r.status}]`),
        standards: res.product?.standards?.map((s: any) => ({ code: s.standard_number, title: s.standard_title })),
        clarifyingQuestions: res.clarifying_questions,
        suggestedPrompts: res.suggested_prompts,
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: "assistant",
          text: "I am having trouble reaching the compliance knowledge base right now. Please verify that the FastAPI backend is running on port 8000.",
          sources: ["System Connection Check"],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell page="assistant">
      <div className="mb-7">
        <p className="text-sm font-medium text-blue-700">AI-powered guidance</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">BIS Compliance Assistant</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Ask questions about BIS standards, certification, hallmarking and product compliance. Get clear next steps grounded in relevant BIS references.
        </p>
      </div>

      <div className="grid gap-7 xl:grid-cols-[1.35fr_.65fr]">
        <section className="flex min-h-[550px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700">
                <Icon name="sparkle" className="h-5 w-5"/>
              </span>
              <div>
                <h2 className="font-bold text-slate-900">BIS Compliance Copilot</h2>
                <p className="text-xs text-emerald-600">
                  <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"/>
                  Online · Source-aware guidance
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-5 p-5 sm:p-6 overflow-y-auto max-h-[600px]">
            {messages.map((m, idx) => (
              <div key={idx}>
                {m.sender === "user" ? (
                  <div className="ml-auto max-w-[88%] rounded-2xl rounded-tr-sm bg-blue-700 p-4 text-sm text-white">
                    {m.text}
                  </div>
                ) : (
                  <div className="max-w-[94%] rounded-2xl rounded-tl-sm border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
                    <p className="font-bold text-slate-900">Answer</p>
                    <div className="mt-2 leading-6 whitespace-pre-line text-slate-700">
                      {m.text}
                    </div>

                    {m.standards && m.standards.length > 0 && (
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {m.standards.map((st, i) => (
                          <div key={i} className="rounded-xl bg-blue-50 p-3">
                            <p className="text-xs font-bold uppercase tracking-wide text-blue-700">Applicable standard</p>
                            <p className="mt-1 text-xs text-slate-700">{st.code} · {st.title}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {m.requirements && m.requirements.length > 0 && (
                      <>
                        <p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-500">Requirements</p>
                        <ul className="mt-2 space-y-1 text-xs leading-5 text-slate-600">
                          {m.requirements.map((req, i) => (
                            <li key={i}>• {req}</li>
                          ))}
                        </ul>
                      </>
                    )}

                    {m.nextSteps && m.nextSteps.length > 0 && (
                      <>
                        <p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-500">Recommended next steps</p>
                        <ol className="mt-2 space-y-1 text-xs leading-5 text-slate-600">
                          {m.nextSteps.map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ol>
                      </>
                    )}

                    {m.clarifyingQuestions && m.clarifyingQuestions.length > 0 && (
                      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5">
                        <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                          <span>🤔 Clarifying Questions for precise compliance scope:</span>
                        </p>
                        <div className="mt-2.5 flex flex-col gap-1.5">
                          {m.clarifyingQuestions.map((cq, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleSend(cq)}
                              className="w-full text-left rounded-lg border border-amber-300/80 bg-white px-3 py-2 text-xs font-medium text-amber-950 shadow-xs hover:bg-amber-100 hover:border-amber-400 transition flex items-center justify-between gap-2"
                            >
                              <span>{cq}</span>
                              <span className="shrink-0 text-amber-600 font-bold text-sm">→</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {m.suggestedPrompts && m.suggestedPrompts.length > 0 && (
                      <div className="mt-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Suggested Inquiries</p>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {m.suggestedPrompts.map((sp, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleSend(sp)}
                              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition"
                            >
                              {sp}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-4 border-t border-slate-100 pt-3">
                        <p className="text-xs font-semibold text-blue-700">Sources used</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {m.sources.map((src, i) => (
                            <Badge key={i} tone={i % 2 === 0 ? "blue" : "slate"}>
                              {src}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-slate-100 p-4 text-sm leading-6 text-slate-600 flex items-center gap-2">
                <span className="inline-block h-2 w-2 animate-ping rounded-full bg-blue-600"/>
                Consulting BIS standards and compliance database...
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="border-t border-slate-100 p-4"
          >
            <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1.5 focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50">
              <input
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="Ask about BIS standards, certification or services..."
                className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={loading}
                className="grid h-10 w-10 place-items-center rounded-lg bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-50"
              >
                <Icon name="arrow" className="h-5 w-5"/>
              </button>
            </div>
          </form>
        </section>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-900">Suggested prompts</h2>
            <div className="mt-4 space-y-2">
              {[
                "Which BIS standards apply to my smart TV?",
                "What are the requirements for Electric Kettle under IS 4250?",
                "How do I check product compliance for electronics?",
                "What documents do I need for ISI marking scheme?",
              ].map(prompt => (
                <button
                  onClick={() => handleSend(prompt)}
                  key={prompt}
                  className="w-full rounded-xl border border-slate-200 p-3 text-left text-xs leading-5 text-slate-600 hover:border-blue-200 hover:bg-blue-50 transition"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-900">Recent Questions</h2>
            <p className="mt-1 text-xs text-slate-500">From your compliance workspace</p>
            <div className="mt-4 space-y-3">
              {[
                "Which documents are pending for my kettle?",
                "How do I apply for the ISI mark?",
                "Can a consumer verify this HUID?",
              ].map(item => (
                <button
                  onClick={() => handleSend(item)}
                  key={item}
                  className="block w-full border-b border-slate-100 pb-3 text-left text-xs leading-5 text-slate-600 last:border-0 last:pb-0 hover:text-blue-700"
                >
                  {item}
                  <span className="mt-1 block text-[10px] text-slate-400">Recent activity</span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-900">Sources & References</h2>
            <p className="mt-1 text-xs text-slate-500">Reference material used in guidance</p>
            <div className="mt-4 space-y-3">
              {[
                ["IS 13252 (Part 1)", "Safety of Information Technology Equipment"],
                ["IS 302-2-15", "Safety of household electrical appliances"],
                ["IS 4250", "Domestic electric kettles"],
                ["BIS Conformity Assessment", "Product certification scheme overview"],
              ].map(([code, title]) => (
                <div key={code} className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-bold text-blue-700">{code}</p>
                  <p className="mt-1 text-xs text-slate-600">{title}</p>
                  <Link href="/standards-requirements" className="mt-2 inline-block text-xs font-semibold text-blue-700">
                    View reference
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </Shell>
  );
}

function Passport({ details = false }: { details?: boolean }) {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [activeProductId, setActiveProductId] = useState<number>(1);
  const [compliance, setCompliance] = useState<ComplianceStatus | null>(null);
  const [product, setProduct] = useState<any>(null);
  const [detailsData, setDetailsData] = useState<{ documents?: any[]; tests?: any[]; certifications?: any[] }>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProductData, setNewProductData] = useState({
    product_name: "",
    model_number: "",
    category_code: "CAT-ELEC",
    manufacturer_name: "Aarav Home Appliances Pvt. Ltd.",
    country_of_origin: "India",
    description: "",
  });

  useEffect(() => {
    api.getProducts().then(list => {
      if (list && list.length > 0) {
        setProductsList(list);
        setActiveProductId(list[0].product_id);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (activeProductId) {
      api.getProduct(activeProductId).then(res => {
        setProduct(res.product);
        setDetailsData({
          documents: res.documents || [],
          tests: res.tests || [],
          certifications: res.certifications || [],
        });
      }).catch(() => {});
      api.getProductCompliance(activeProductId).then(setCompliance).catch(() => {});
    }
  }, [activeProductId]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductData.product_name.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await api.createProduct(newProductData);
      if (res && res.product_id) {
        const refreshed = await api.getProducts();
        setProductsList(refreshed);
        setActiveProductId(res.product_id);
        setShowCreateModal(false);
        setNewProductData({
          product_name: "",
          model_number: "",
          category_code: "CAT-ELEC",
          manufacturer_name: "Aarav Home Appliances Pvt. Ltd.",
          country_of_origin: "India",
          description: "",
        });
      }
    } catch (err: any) {
      alert("Error creating product: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const readinessPct = compliance?.readiness_percentage ? Math.round(compliance.readiness_percentage) : 33;
  const totalReqs = compliance?.total_requirements || 3;
  const completedReqs = compliance?.completed || 1;
  const pendingReqs = compliance?.pending || 2;

  return (
    <Shell page={details ? "details" : "passport"}>
      <PageHeading
        eyebrow={details ? "Product compliance profile" : "BIS product record"}
        title={product?.product_name || "Demo Smart Television"}
        description={details ? `${product?.product_code || product?.model_number || "DEMO-TV-001"} · ${product?.category_name || "Electrical and Electronic Products"}` : "A complete view of this product's BIS compliance status."}
      />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs text-slate-400">Connected to live BIS database · bis_compliance</p>
          <div className="flex items-center gap-2">
            <select
              value={activeProductId}
              onChange={e => setActiveProductId(Number(e.target.value))}
              aria-label="Select Product"
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-blue-700 outline-none focus:border-blue-400 shadow-xs"
            >
              {productsList.map(p => (
                <option key={p.product_id} value={p.product_id}>
                  {p.product_name} ({p.model_number || p.product_code})
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1 rounded-lg bg-blue-700 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-800 transition shadow-xs"
            >
              <span>+ Register Product</span>
            </button>
          </div>
        </div>
        <p className="text-xs font-medium text-slate-500">Live BIS Record</p>
      </div>

      {!details && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Product name" value={product?.product_name || "Demo Smart Television"}/>
            <Field label="Product category" value={product?.category_name || "Electrical and Electronic Products"}/>
            <Field label="Manufacturer" value={product?.manufacturer_name || "Aarav Home Appliances Pvt. Ltd."}/>
            <Field label="Model / Code" value={product?.model_number || product?.product_code || "DSTV-55-A1"}/>
            <Field label="Compliance scheme" value={product?.product_name?.toLowerCase().includes("tv") ? "Compulsory Registration Scheme (CRS)" : "ISI Marking Scheme (Scheme-I)"}/>
            <Field label="Country of origin" value={product?.country_of_origin || "India"}/>
          </div>
        </section>
      )}

      <div className="mt-7 grid gap-7 xl:grid-cols-[1.35fr_.65fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-bold text-slate-900">Compliance readiness</h2>
              <p className="mt-1 text-sm text-slate-500">Your current journey toward BIS conformity</p>
              <div className="mt-3">
                <Badge tone={readinessPct >= 100 ? "green" : readinessPct > 50 ? "amber" : "blue"}>
                  {readinessPct >= 100 ? "Fully Compliant" : "Partially Compliant"}
                </Badge>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Core product and manufacturer information is complete. Testing evidence, certification and final verification remain.
                </p>
              </div>
            </div>
            <span className="text-3xl font-bold text-blue-700">{readinessPct}%</span>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-blue-600 transition-all duration-500" style={{ width: `${readinessPct}%` }}/>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Mini
              label="Applicable standards"
              value={compliance?.applicable_standards?.length ? String(compliance.applicable_standards.length) : "2"}
              detail={compliance?.applicable_standards?.map(s => s.standard_number).join(", ") || "IS 302-2-15, IS 4250"}
            />
            <Mini
              label="Requirements complete"
              value={`${completedReqs} / ${totalReqs}`}
              detail={`${pendingReqs} pending`}
            />
            <Mini
              label="Documents & Evidence"
              value={detailsData.documents ? `${detailsData.documents.length} records` : "5 records"}
              detail="Laboratory & QA records"
            />
          </div>

          <h3 className="mt-8 font-bold text-slate-900">Requirements checklist &amp; roadmap</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Completed Items</p>
              <p className="mt-2 text-xs leading-5 text-emerald-900">
                ✓ Product classification &amp; scope definition<br/>
                ✓ Manufacturer registration verified<br/>
                ✓ Technical datasheet &amp; marking layout
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Action Required</p>
              <p className="mt-2 text-xs leading-5 text-amber-900">
                ○ Safety &amp; performance test report upload<br/>
                ○ Factory QA inspection audit readiness<br/>
                ○ Formal BIS license application filing
              </p>
            </div>
          </div>

          <h3 className="mt-8 font-bold text-slate-900">Step-by-step roadmap</h3>
          <div className="mt-5 space-y-5">
            {[
              ["Product classification", "Applicable product category and Harmonized System confirmed", "Complete", "green"],
              ["Standards mapping", compliance?.applicable_standards?.map(s => s.standard_number).join(" & ") || "IS 302-2-15 and IS 4250 mapped", "Complete", "green"],
              ["Evidence & Lab Testing", "Upload accredited lab test reports and safety certificates", "In progress", "amber"],
              ["BIS licence application", "Prepare application under ISI / CRS marking scheme", "Next", "blue"],
            ].map(([title, info, status, tone], i) => (
              <div className="flex gap-4" key={title}>
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${tone === "green" ? "bg-emerald-100 text-emerald-700" : tone === "amber" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                  {i + 1}
                </span>
                <div className="flex-1 border-b border-slate-100 pb-5">
                  <div className="flex justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-700">{title}</p>
                    <Badge tone={tone as "green" | "amber" | "blue"}>{status}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{info}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-900">Applicable standards</h2>
            <div className="mt-3 space-y-2">
              {(compliance?.applicable_standards || [
                { standard_number: "IS 4250", standard_title: "Domestic electric kettles" },
                { standard_number: "IS 302-2-15", standard_title: "Household appliance safety" },
              ]).map((std) => (
                <div key={std.standard_number} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                  <span>
                    <b className="block text-xs text-blue-700">{std.standard_number}</b>
                    <span className="text-xs text-slate-500">{std.standard_title}</span>
                  </span>
                  <Badge tone="green">Mapped</Badge>
                </div>
              ))}
            </div>
            <h2 className="mt-5 font-bold text-slate-900">Applicable scheme</h2>
            <Badge tone="blue">
              {product?.product_name?.toLowerCase().includes("tv") ? "Compulsory Registration Scheme (CRS)" : "ISI Marking Scheme (Scheme-I)"}
            </Badge>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Product certification confirms that the product meets the requirements of the applicable Indian Standard.
            </p>
            <Link href="/standards-requirements" className="mt-4 inline-block text-sm font-semibold text-blue-700 hover:underline">
              Explore scheme details →
            </Link>
          </section>

          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="font-bold text-amber-900">Compliance gaps</h2>
            <p className="mt-1 text-xs leading-5 text-amber-800">These remaining items are preventing full compliance.</p>
            <ul className="mt-3 space-y-2 text-sm leading-5 text-amber-800">
              {compliance?.compliance_gaps?.length ? (
                compliance.compliance_gaps.map(gap => (
                  <li key={gap.requirement_id}>• {gap.requirement_title} ({gap.requirement_code})</li>
                ))
              ) : (
                <>
                  <li>• Dielectric strength test report</li>
                  <li>• Final product marking artwork</li>
                  <li>• Factory inspection readiness record</li>
                </>
              )}
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-900">Recommended Actions</h2>
            <div className="mt-3 space-y-2 text-xs leading-5 text-slate-600">
              {compliance?.recommended_actions?.length ? (
                compliance.recommended_actions.map(act => (
                  <p key={act.requirement_id}>→ {act.recommended_action}</p>
                ))
              ) : (
                <>
                  <p>→ Complete testing information</p>
                  <p>→ Upload missing documents</p>
                  <p>→ Complete certification step</p>
                  <p>→ Verify applicable requirements</p>
                </>
              )}
            </div>
            <Link href="/case-details" className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">
              View Detailed Passport Records
            </Link>
          </section>
        </aside>
      </div>

      {/* Product Documents, Laboratory Tests, and Certifications Tables */}
      <div className="mt-8 space-y-7">
        {/* Compliance Documents */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-bold text-slate-900">Compliance Documents &amp; Evidence</h2>
              <p className="mt-1 text-xs text-slate-500">Technical documentation filed for this product passport</p>
            </div>
            <span className="text-xs font-semibold text-blue-700">{detailsData.documents?.length || 0} Files</span>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-xs text-slate-400">
                <tr>
                  <th className="pb-3 font-semibold">Document Title</th>
                  <th className="pb-3 font-semibold">Category / Type</th>
                  <th className="pb-3 font-semibold">Uploaded</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {detailsData.documents && detailsData.documents.length > 0 ? (
                  detailsData.documents.map((doc: any, i: number) => (
                    <tr key={i} className="text-xs">
                      <td className="py-3 font-semibold text-slate-800">{doc.document_title || doc.file_name}</td>
                      <td className="py-3 text-slate-500">{doc.document_type || "Technical Spec"}</td>
                      <td className="py-3 text-slate-400">{doc.created_at ? new Date(doc.created_at).toLocaleDateString() : "Recent"}</td>
                      <td className="py-3">
                        <Badge tone={doc.verification_status === "VERIFIED" ? "green" : "amber"}>
                          {doc.verification_status || "PENDING"}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="text-xs text-slate-400">
                    <td colSpan={4} className="py-4 text-center">No documents uploaded yet. Add test reports and circuit diagrams.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Laboratory Tests */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-bold text-slate-900">Accredited Laboratory Test Reports</h2>
              <p className="mt-1 text-xs text-slate-500">Independent testing results against Indian Standards</p>
            </div>
            <span className="text-xs font-semibold text-blue-700">{detailsData.tests?.length || 0} Reports</span>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-xs text-slate-400">
                <tr>
                  <th className="pb-3 font-semibold">Test Name</th>
                  <th className="pb-3 font-semibold">Laboratory Name</th>
                  <th className="pb-3 font-semibold">Standard Tested</th>
                  <th className="pb-3 font-semibold">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {detailsData.tests && detailsData.tests.length > 0 ? (
                  detailsData.tests.map((test: any, i: number) => (
                    <tr key={i} className="text-xs">
                      <td className="py-3 font-semibold text-slate-800">{test.test_name}</td>
                      <td className="py-3 text-slate-500">{test.lab_name || "NABL Accredited Lab"}</td>
                      <td className="py-3 text-blue-700 font-medium">{test.standard_number || "BIS Standard"}</td>
                      <td className="py-3">
                        <Badge tone={test.result === "PASS" ? "green" : test.result === "FAIL" ? "rose" : "amber"}>
                          {test.result || "PENDING"}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="text-xs text-slate-400">
                    <td colSpan={4} className="py-4 text-center">Testing evidence being compiled by accredited testing laboratory.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Certifications */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-bold text-slate-900">Official BIS Certifications &amp; Licences</h2>
              <p className="mt-1 text-xs text-slate-500">Registered certificates, CM/L numbers and CRS registrations</p>
            </div>
            <span className="text-xs font-semibold text-blue-700">{detailsData.certifications?.length || 0} Licences</span>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-xs text-slate-400">
                <tr>
                  <th className="pb-3 font-semibold">Certificate / CM/L #</th>
                  <th className="pb-3 font-semibold">Certification Type</th>
                  <th className="pb-3 font-semibold">Issuing Authority</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {detailsData.certifications && detailsData.certifications.length > 0 ? (
                  detailsData.certifications.map((cert: any, i: number) => (
                    <tr key={i} className="text-xs">
                      <td className="py-3 font-bold text-blue-700">{cert.certificate_number}</td>
                      <td className="py-3 text-slate-700">{cert.certification_type || "ISI Scheme-I"}</td>
                      <td className="py-3 text-slate-500">{cert.issuing_authority || "Bureau of Indian Standards"}</td>
                      <td className="py-3">
                        <Badge tone={cert.status === "ACTIVE" ? "green" : "amber"}>
                          {cert.status || "ACTIVE"}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="text-xs text-slate-400">
                    <td colSpan={4} className="py-4 text-center">Licence under processing with BIS Regional Office.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Register New Product Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/40 p-4">
          <div role="dialog" aria-modal="true" className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Register New Product Passport</h2>
                <p className="text-xs text-slate-500">Add a product profile to track BIS compliance and standards.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-2 text-xl text-slate-400 hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="mt-5 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smart Induction Cooktop"
                  value={newProductData.product_name}
                  onChange={e => setNewProductData({ ...newProductData, product_name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Model / Product Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SIC-2200-X"
                    value={newProductData.model_number}
                    onChange={e => setNewProductData({ ...newProductData, model_number: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Category Code</label>
                  <select
                    value={newProductData.category_code}
                    onChange={e => setNewProductData({ ...newProductData, category_code: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400 focus:bg-white"
                  >
                    <option value="CAT-ELEC">CAT-ELEC (Electrical &amp; Electronics)</option>
                    <option value="CAT-HOME">CAT-HOME (Domestic Appliances)</option>
                    <option value="CAT-CABL">CAT-CABL (Cables &amp; Conductors)</option>
                    <option value="CAT-SOLAR">CAT-SOLAR (Solar PV &amp; Clean Energy)</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Manufacturer Name</label>
                  <input
                    type="text"
                    value={newProductData.manufacturer_name}
                    onChange={e => setNewProductData({ ...newProductData, manufacturer_name: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Country of Origin</label>
                  <input
                    type="text"
                    value={newProductData.country_of_origin}
                    onChange={e => setNewProductData({ ...newProductData, country_of_origin: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Product Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief specifications, voltage ratings, or intended use..."
                  value={newProductData.description}
                  onChange={e => setNewProductData({ ...newProductData, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:bg-white"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
                >
                  {isSubmitting ? "Creating Passport..." : "Create Product Passport"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Shell>
  );
}
function Services() {
  const [activeTab, setActiveTab] = useState<"verify" | "huid" | "complaint" | "standards">("verify");

  // State for Licence Verification
  const [licenceInput, setLicenceInput] = useState("CM/L-8472910");
  const [licenceResult, setLicenceResult] = useState<LicenceVerification | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  const handleVerifyLicence = async (queryLicence?: string) => {
    const num = (queryLicence || licenceInput).trim();
    if (!num) return;
    setVerifyLoading(true);
    setVerifyError("");
    setLicenceResult(null);
    try {
      const res = await api.verifyLicence(num);
      setLicenceResult(res);
    } catch (err: any) {
      setVerifyError("Licence or Registration number not found in official BIS national registry. Please check format or report counterfeit.");
    } finally {
      setVerifyLoading(false);
    }
  };

  // State for HUID Verification
  const [huidInput, setHuidInput] = useState("HUID-GOLD-916-4421");
  const [huidResult, setHuidResult] = useState<any>(null);
  const [huidLoading, setHuidLoading] = useState(false);

  const handleVerifyHuid = (queryHuid?: string) => {
    const code = (queryHuid || huidInput).trim().toUpperCase();
    if (!code) return;
    setHuidLoading(true);
    setTimeout(() => {
      setHuidResult({
        huid: code,
        status: "AUTHENTIC & VERIFIED",
        jeweller_name: "Kalyan Jewellers / BIS Certified Jeweller #JL-98124",
        ahc_center: "AHC-DL-042 (Delhi Central Assaying & Hallmarking Centre)",
        purity: code.includes("750") ? "18K (750 Purity - 75.0% Fine Gold)" : "22K (916 Purity - 91.6% Pure Gold)",
        article_type: code.includes("750") ? "Diamond Studded Gold Ring" : "Handcrafted Gold Bangle",
        hallmarking_date: "12 August 2026",
        weight_tested: "14.850 grams",
        bis_seal: "Official BIS Triangular Hallmark Compliant (IS 1417)",
      });
      setHuidLoading(false);
    }, 400);
  };

  // State for Citizen Complaint
  const [complaintForm, setComplaintForm] = useState({
    consumer_name: "",
    consumer_email: "",
    consumer_phone: "",
    product_name: "",
    brand_or_model: "",
    licence_number: "",
    complaint_type: "Misuse of ISI Mark on Unregistered Product",
    description: "",
  });
  const [complaintResult, setComplaintResult] = useState<ComplaintResult | null>(null);
  const [complaintSubmitting, setComplaintSubmitting] = useState(false);

  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintForm.consumer_name || !complaintForm.product_name || !complaintForm.description) return;
    setComplaintSubmitting(true);
    try {
      const res = await api.submitComplaint(complaintForm);
      setComplaintResult(res);
      setComplaintForm({
        consumer_name: "",
        consumer_email: "",
        consumer_phone: "",
        product_name: "",
        brand_or_model: "",
        licence_number: "",
        complaint_type: "Misuse of ISI Mark on Unregistered Product",
        description: "",
      });
    } catch (err: any) {
      alert("Error submitting complaint: " + err.message);
    } finally {
      setComplaintSubmitting(false);
    }
  };

  // Know Your Standards consumer guides
  const consumerStandards = [
    {
      code: "IS 14543",
      title: "Packaged Drinking Water (Other than Natural Mineral Water)",
      mark: "Mandatory ISI Mark",
      whatToCheck: "Look for the BIS Standard Mark (ISI) with CM/L number, shelf-life, batch number, and intact tamper-evident cap seal.",
      safetyTip: "Never purchase unsealed or non-ISI packaged water bottles.",
      tone: "blue",
    },
    {
      code: "IS 2347",
      title: "Domestic Pressure Cookers",
      mark: "Mandatory ISI Mark",
      whatToCheck: "Verify presence of fusible safety plug, metallic safety vent weight, and ISI mark embossed on the lid and body.",
      safetyTip: "Non-certified pressure cookers pose severe explosion risks.",
      tone: "green",
    },
    {
      code: "IS 4151",
      title: "Protective Helmets for Two-Wheeler Riders",
      mark: "Mandatory ISI Mark",
      whatToCheck: "Check for permanent ISI mark on the rear outer shell, EPS impact-absorbing liner, and quick-release chin strap buckle.",
      safetyTip: "Wearing non-ISI helmets is illegal in India under the Motor Vehicles Act.",
      tone: "amber",
    },
    {
      code: "IS 9873 (Parts 1-3)",
      title: "Safety of Toys - Physical, Flammability & Chemical",
      mark: "Mandatory ISI Mark",
      whatToCheck: "Check for ISI mark with manufacturer CM/L license number, age grading, and non-toxic paint certification.",
      safetyTip: "BIS toy certification protects infants from choking on small parts and lead poisoning.",
      tone: "rose",
    },
    {
      code: "IS 16102",
      title: "Self-Ballasted LED Lamps for General Lighting",
      mark: "Mandatory CRS Registration",
      whatToCheck: "Look for the BIS CRS logo with 8-digit R-number (Registration number) and lumen/wattage rating.",
      safetyTip: "Prevents fire hazard and protects eyes against excessive photobiological blue light radiation.",
      tone: "violet",
    },
    {
      code: "IS 4246",
      title: "Domestic Gas Stoves (LPG)",
      mark: "Mandatory ISI Mark",
      whatToCheck: "Look for ISI mark on body rating plate, brass burners, gas leakage safety seal, and thermal efficiency >68%.",
      safetyTip: "Ensure gas burner nozzles match certified BIS specifications to prevent gas leakages.",
      tone: "blue",
    },
  ];

  return (
    <Shell page="services">
      <PageHeading
        eyebrow="Consumer & Industry Services"
        title="BIS Consumer Services & Verification Hub"
        description="Verify authentic ISI/CRS licenses, validate gold hallmarking (HUID), file consumer grievances, and explore mandatory Indian Standards."
      />

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: "verify", label: "🔍 Licence / ISI Verification" },
          { id: "huid", label: "✨ Gold Hallmarking (HUID) Checker" },
          { id: "complaint", label: "📝 Citizen Grievance / Complaint" },
          { id: "standards", label: "📚 Know Your Standards Guide" },
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition ${activeTab === tab.id ? "bg-blue-700 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Licence Verification */}
      {activeTab === "verify" && (
        <section className="mt-6 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900">Verify BIS Licence (CM/L or CRS Number)</h2>
            <p className="mt-1 text-xs text-slate-500">
              Confirm whether an ISI Mark (CM/L-XXXXXXX) or CRS Electronic Registration (CRS-REG-XXXX) is genuine and active in the official BIS repository.
            </p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Icon name="search" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/>
                <input
                  type="text"
                  value={licenceInput}
                  onChange={e => setLicenceInput(e.target.value)}
                  placeholder="Enter CM/L or CRS number (e.g. CM/L-8472910)"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-400 focus:bg-white"
                />
              </div>
              <button
                type="button"
                onClick={() => handleVerifyLicence()}
                disabled={verifyLoading}
                className="rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50 transition shadow-sm"
              >
                {verifyLoading ? "Checking BIS National Register..." : "Verify Licence"}
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>Try quick demo records:</span>
              <button
                type="button"
                onClick={() => { setLicenceInput("CM/L-8472910"); handleVerifyLicence("CM/L-8472910"); }}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-blue-700 font-medium hover:bg-blue-50"
              >
                CM/L-8472910 (ISI Kettle)
              </button>
              <button
                type="button"
                onClick={() => { setLicenceInput("CRS-REG-2026-9012"); handleVerifyLicence("CRS-REG-2026-9012"); }}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-blue-700 font-medium hover:bg-blue-50"
              >
                CRS-REG-2026-9012 (CRS Smart TV)
              </button>
              <button
                type="button"
                onClick={() => { setLicenceInput("CM/L-9182374"); handleVerifyLicence("CM/L-9182374"); }}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-blue-700 font-medium hover:bg-blue-800 hover:text-white"
              >
                CM/L-9182374 (Power Cable)
              </button>
            </div>

            {verifyError && (
              <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
                <p className="font-bold">⚠️ Licence Verification Alert</p>
                <p className="mt-1">{verifyError}</p>
                <button
                  type="button"
                  onClick={() => setActiveTab("complaint")}
                  className="mt-2.5 inline-block font-bold text-rose-900 underline"
                >
                  Report Suspicious / Fake ISI Mark in Complaint Portal →
                </button>
              </div>
            )}

            {licenceResult && (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-emerald-200/80 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-600 text-white font-bold text-xl shadow-sm">
                      ✓
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-slate-900">{licenceResult.certificate_number}</span>
                        <Badge tone="green">{licenceResult.status}</Badge>
                      </div>
                      <p className="text-xs text-emerald-800 font-medium">
                        {licenceResult.certification_type} · Authenticated against BIS Central Registry
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Valid Until</p>
                    <p className="text-sm font-bold text-slate-800">{licenceResult.expiry_date || "2027-05-31"}</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
                  <div className="rounded-xl bg-white p-3.5 border border-emerald-100">
                    <span className="text-slate-400">Product Covered</span>
                    <p className="mt-1 font-bold text-slate-900 text-sm">{licenceResult.product_name}</p>
                    <p className="text-slate-500 mt-0.5">Model: {licenceResult.model_number || "All Listed Variants"}</p>
                  </div>

                  <div className="rounded-xl bg-white p-3.5 border border-emerald-100">
                    <span className="text-slate-400">Manufacturer &amp; Factory</span>
                    <p className="mt-1 font-bold text-slate-900 text-sm">{licenceResult.manufacturer_name}</p>
                    <p className="text-slate-500 mt-0.5">{licenceResult.city}, {licenceResult.state} ({licenceResult.country})</p>
                  </div>

                  <div className="rounded-xl bg-white p-3.5 border border-emerald-100">
                    <span className="text-slate-400">Issuing Authority</span>
                    <p className="mt-1 font-bold text-slate-900 text-sm">{licenceResult.issuing_authority}</p>
                    <p className="text-slate-500 mt-0.5">Issued: {licenceResult.issue_date || "2024-06-01"}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-emerald-100/60 p-3 text-xs text-emerald-950">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span>🛡️</span> Genuine BIS certified product. Consumers are legally protected under the BIS Act, 2016.
                  </span>
                  <span className="font-bold text-emerald-800">Official BIS Certified Seal</span>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Tab 2: Gold Hallmarking (HUID) Checker */}
      {activeTab === "huid" && (
        <section className="mt-6 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900">Gold Hallmarking &amp; HUID Verifier</h2>
            <p className="mt-1 text-xs text-slate-500">
              Hallmark Unique Identification (HUID) is a 6-digit alphanumeric code laser-engraved on every certified gold jewellery item in India.
            </p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={huidInput}
                  onChange={e => setHuidInput(e.target.value)}
                  placeholder="Enter 6-digit HUID code (e.g. HUID-GOLD-916-4421 or AH9162)"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm outline-none focus:border-blue-400 focus:bg-white uppercase tracking-wider font-mono"
                />
              </div>
              <button
                type="button"
                onClick={() => handleVerifyHuid()}
                disabled={huidLoading}
                className="rounded-xl bg-amber-600 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50 transition shadow-sm"
              >
                {huidLoading ? "Verifying Hallmark Database..." : "Verify HUID Code"}
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>Sample HUIDs:</span>
              <button
                type="button"
                onClick={() => { setHuidInput("HUID-GOLD-916-4421"); handleVerifyHuid("HUID-GOLD-916-4421"); }}
                className="rounded-lg bg-amber-50 px-2.5 py-1 text-amber-800 font-medium hover:bg-amber-100"
              >
                22K Gold Bangle (HUID-GOLD-916-4421)
              </button>
              <button
                type="button"
                onClick={() => { setHuidInput("HUID-GOLD-750-1092"); handleVerifyHuid("HUID-GOLD-750-1092"); }}
                className="rounded-lg bg-amber-50 px-2.5 py-1 text-amber-800 font-medium hover:bg-amber-100"
              >
                18K Diamond Ring (HUID-GOLD-750-1092)
              </button>
            </div>

            {/* Educational 3 Marks Info */}
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                The 3 Mandatory Marks on BIS Hallmarked Gold Jewellery
              </h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-3 text-xs">
                <div className="rounded-xl bg-white p-3 border border-amber-100">
                  <span className="font-bold text-amber-800">1. BIS Standard Logo</span>
                  <p className="mt-1 text-slate-600">The triangular BIS mark certifying authenticity under Indian Standard IS 1417.</p>
                </div>
                <div className="rounded-xl bg-white p-3 border border-amber-100">
                  <span className="font-bold text-amber-800">2. Purity &amp; Fineness Mark</span>
                  <p className="mt-1 text-slate-600">22K916 (91.6% Pure), 18K750 (75% Pure), or 14K585 (58.5% Pure Gold).</p>
                </div>
                <div className="rounded-xl bg-white p-3 border border-amber-100">
                  <span className="font-bold text-amber-800">3. 6-Character HUID</span>
                  <p className="mt-1 text-slate-600">Unique alphanumeric code giving complete trace of Jeweller, Centre and Article weight.</p>
                </div>
              </div>
            </div>

            {huidResult && (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-emerald-200/80 pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Verified Article Profile</span>
                    <h3 className="mt-1 text-lg font-bold text-slate-900">{huidResult.article_type}</h3>
                    <p className="text-xs text-slate-500">HUID: <span className="font-mono font-bold text-blue-700">{huidResult.huid}</span></p>
                  </div>
                  <Badge tone="green">{huidResult.status}</Badge>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
                  <div className="rounded-xl bg-white p-3.5 border border-emerald-100">
                    <span className="text-slate-400">Certified Purity</span>
                    <p className="mt-1 font-bold text-amber-700 text-sm">{huidResult.purity}</p>
                    <p className="text-slate-500 mt-0.5">Net Weight: {huidResult.weight_tested}</p>
                  </div>
                  <div className="rounded-xl bg-white p-3.5 border border-emerald-100">
                    <span className="text-slate-400">Licenced Jeweller</span>
                    <p className="mt-1 font-bold text-slate-900 text-sm">{huidResult.jeweller_name}</p>
                    <p className="text-slate-500 mt-0.5">Hallmarked On: {huidResult.hallmarking_date}</p>
                  </div>
                  <div className="rounded-xl bg-white p-3.5 border border-emerald-100">
                    <span className="text-slate-400">Assaying &amp; Hallmarking Centre</span>
                    <p className="mt-1 font-bold text-slate-900 text-sm">{huidResult.ahc_center}</p>
                    <p className="text-slate-500 mt-0.5">{huidResult.bis_seal}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Tab 3: Grievance / Complaint Portal */}
      {activeTab === "complaint" && (
        <section className="mt-6 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900">File a Citizen Grievance / BIS Complaint</h2>
            <p className="mt-1 text-xs text-slate-500">
              Report misuse of the ISI mark, substandard consumer products, fake hallmarking, or unregistered electronic goods.
            </p>

            {complaintResult ? (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-600 text-white font-bold text-xl">
                  ✓
                </span>
                <h3 className="mt-3 text-lg font-bold text-slate-900">Grievance Successfully Registered</h3>
                <p className="mt-1 text-xs text-slate-600 max-w-md mx-auto">
                  Your complaint has been logged in the BIS National Enforcement Management System.
                </p>
                <div className="mt-4 inline-block rounded-xl bg-white px-5 py-3 border border-emerald-200 text-xs">
                  <span className="text-slate-400 block">Formal Grievance Tracking ID</span>
                  <span className="text-base font-mono font-bold text-blue-700">{complaintResult.complaint_number}</span>
                  <span className="block text-[11px] text-emerald-700 mt-1">Status: {complaintResult.status} · SLA: {complaintResult.estimated_resolution}</span>
                </div>
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => setComplaintResult(null)}
                    className="rounded-xl bg-blue-700 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-800"
                  >
                    File Another Grievance
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleComplaintSubmit} className="mt-6 space-y-4 text-xs">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block font-semibold text-slate-700">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Sharma"
                      value={complaintForm.consumer_name}
                      onChange={e => setComplaintForm({ ...complaintForm, consumer_name: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. ramesh@example.com"
                      value={complaintForm.consumer_email}
                      onChange={e => setComplaintForm({ ...complaintForm, consumer_email: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700">Mobile Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={complaintForm.consumer_phone}
                      onChange={e => setComplaintForm({ ...complaintForm, consumer_phone: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-semibold text-slate-700">Complaint Category *</label>
                    <select
                      value={complaintForm.complaint_type}
                      onChange={e => setComplaintForm({ ...complaintForm, complaint_type: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400 focus:bg-white"
                    >
                      <option value="Misuse of ISI Mark on Unregistered Product">Misuse of ISI Mark on Unregistered Product</option>
                      <option value="Substandard / Hazardous Quality Goods">Substandard / Hazardous Quality Goods</option>
                      <option value="Counterfeit / Tampered Gold Hallmark HUID">Counterfeit / Tampered Gold Hallmark HUID</option>
                      <option value="CRS Non-Compliance (Electronics)">CRS Non-Compliance (Electronics)</option>
                      <option value="Misleading BIS Certification Claim">Misleading BIS Certification Claim</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700">Product Name &amp; Model *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Electric Immersion Rod 1500W"
                      value={complaintForm.product_name}
                      onChange={e => setComplaintForm({ ...complaintForm, product_name: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-semibold text-slate-700">Brand / Retailer Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Local Market / XYZ Brand"
                      value={complaintForm.brand_or_model}
                      onChange={e => setComplaintForm({ ...complaintForm, brand_or_model: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700">Licence / CM/L Number if displayed</label>
                    <input
                      type="text"
                      placeholder="e.g. CM/L-0000000 (Optional)"
                      value={complaintForm.licence_number}
                      onChange={e => setComplaintForm({ ...complaintForm, licence_number: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700">Detailed Description of Defect / Violation *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe where the product was purchased, the nature of failure, missing ISI mark, or why you suspect counterfeit certification..."
                    value={complaintForm.description}
                    onChange={e => setComplaintForm({ ...complaintForm, description: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:bg-white"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={complaintSubmitting}
                    className="rounded-xl bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50 transition shadow-sm"
                  >
                    {complaintSubmitting ? "Submitting Grievance..." : "Submit Grievance to BIS"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      )}

      {/* Tab 4: Know Your Standards Guide */}
      {activeTab === "standards" && (
        <section className="mt-6 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900">Know Your Standards: Everyday Consumer Goods</h2>
            <p className="mt-1 text-xs text-slate-500">
              Under the Quality Control Orders (QCOs) issued by the Government of India, the following products cannot be sold without mandatory BIS certification.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {consumerStandards.map(item => (
                <div key={item.code} className="rounded-2xl border border-slate-200 p-5 hover:border-blue-300 transition">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700">{item.code}</span>
                    <Badge tone={item.tone as any}>{item.mark}</Badge>
                  </div>
                  <h3 className="mt-2 text-sm font-bold text-slate-900">{item.title}</h3>
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="rounded-lg bg-slate-50 p-2.5">
                      <span className="font-bold text-slate-700 block">What to Check:</span>
                      <p className="mt-1 text-slate-600 leading-4">{item.whatToCheck}</p>
                    </div>
                    <div className="rounded-lg bg-amber-50/70 p-2.5 text-amber-900">
                      <span className="font-bold block">Consumer Safety Tip:</span>
                      <p className="mt-1 leading-4">{item.safetyTip}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </Shell>
  );
}

function AlertsDiscovery() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [severity, setSeverity] = useState("All");
  const [product, setProduct] = useState("All");
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    api.getAlerts({ severity }).then(setAlerts).catch(() => {});
  }, [severity]);

  const handleResolve = async (alertId: number) => {
    try {
      await api.resolveAlert(alertId);
      setAlerts(prev => prev.map(a => a.alert_id === alertId ? { ...a, status: "RESOLVED" } : a));
      if (selected?.alert_id === alertId) {
        setSelected((prev: any) => prev ? { ...prev, status: "RESOLVED" } : null);
      }
    } catch (err) {
      console.error("Failed to resolve alert:", err);
    }
  };

  const filtered = alerts.filter(alert =>
    [alert.title, alert.message, alert.product_name, alert.standard_number].filter(Boolean).join(" ").toLowerCase().includes(query.toLowerCase()) &&
    (type === "All" || alert.alert_type === type) &&
    (product === "All" || alert.product_name === product)
  );

  const reset = () => {
    setQuery("");
    setType("All");
    setSeverity("All");
    setProduct("All");
  };

  const tone = (value: string) => value === "CRITICAL" || value === "Critical" ? "rose" : value === "HIGH" || value === "Action Required" ? "amber" : "blue";

  return (
    <Shell page="alerts">
      <PageHeading eyebrow="Compliance monitoring" title="Compliance Alerts" description="Stay informed about changes, missing requirements and product-specific compliance updates."/>
      <section className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Icon name="sparkle" className="h-5 w-5 text-blue-700"/>
              <h2 className="font-bold text-blue-900">What changed for me?</h2>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-800">
              For your Electric Kettle passport, recent updates affect testing evidence, product marking review and certification preparation.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <p className="text-xl font-bold text-blue-900">2</p>
                <p className="text-xs text-blue-700">requirements changed</p>
              </div>
              <div>
                <p className="text-xl font-bold text-blue-900">1</p>
                <p className="text-xs text-blue-700">new applicable requirement</p>
              </div>
              <div>
                <p className="text-xl font-bold text-blue-900">1</p>
                <p className="text-xs text-blue-700">pending action</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => filtered[0] && setSelected(filtered[0])}
            className="shrink-0 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Review Changes
          </button>
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Missing Requirements" value="1" trend="Action" icon="alert" tone="bg-rose-50 text-rose-600"/>
        <Stat label="Standard Changes" value="2" trend="+1" icon="book" tone="bg-amber-50 text-amber-600"/>
        <Stat label="New Requirements" value="1" trend="New" icon="plus" tone="bg-blue-50 text-blue-600"/>
        <Stat label="Product-Specific Alerts" value={alerts.length || 4} trend="+2" icon="passport" tone="bg-violet-50 text-violet-600"/>
      </div>

      <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-3 lg:grid-cols-[1.5fr_repeat(3,1fr)_auto]">
          <div className="relative">
            <Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search compliance alerts..."
              aria-label="Search compliance alerts"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:bg-white"
            />
          </div>
          <select value={type} onChange={e => setType(e.target.value)} aria-label="Alert Type" className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-600 outline-none">
            <option value="All">Alert Type: All</option>
            <option value="MISSING_REQUIREMENT">Missing Requirement</option>
            <option value="STANDARD_UPDATE">Standard Update</option>
            <option value="OVERDUE_REQUIREMENT">Overdue Requirement</option>
            <option value="EXPIRING_CERTIFICATION">Expiring Certification</option>
          </select>
          <select value={severity} onChange={e => setSeverity(e.target.value)} aria-label="Severity" className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-600 outline-none">
            <option value="All">Severity: All</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
          </select>
          <select value={product} onChange={e => setProduct(e.target.value)} aria-label="Product" className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-600 outline-none">
            <option value="All">Product: All</option>
            <option value="Electric Kettle">Electric Kettle</option>
            <option value="Demo Smart Television">Smart Television</option>
          </select>
          <button onClick={reset} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">
            Reset
          </button>
        </div>
      </section>

      <section className="mt-7">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900">Active alerts</h2>
            <p className="mt-1 text-sm text-slate-500">Real-time alerts from compliance database.</p>
          </div>
          <span className="text-xs text-slate-400">{filtered.length} alerts</span>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-emerald-600">
              <Icon name="check" className="h-6 w-6"/>
            </span>
            <h3 className="mt-4 font-bold text-slate-900">No active alerts</h3>
            <p className="mt-1 text-sm text-slate-500">No alerts match these filters. Try resetting your search.</p>
            <button onClick={reset} className="mt-4 text-sm font-semibold text-blue-700">Reset filters</button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(alert => (
              <article key={alert.alert_id || alert.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex gap-4">
                    <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${alert.severity === "CRITICAL" ? "bg-rose-500" : alert.severity === "HIGH" ? "bg-amber-500" : "bg-blue-500"}`}/>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone={tone(alert.severity) as "rose" | "amber" | "blue"}>{alert.severity}</Badge>
                        <span className="text-xs text-slate-400">{alert.alert_type}</span>
                      </div>
                      <h3 className="mt-2 font-bold text-slate-900">{alert.title}</h3>
                      <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">{alert.message}</p>
                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-400">
                        <span>Product: <b className="text-slate-600">{alert.product_name || "Electric Kettle"}</b></span>
                        {alert.standard_number && <span>Standard: <b className="text-slate-600">{alert.standard_number}</b></span>}
                        <span>Due: {alert.due_date || "Within 7 days"}</span>
                        {alert.status === "RESOLVED" && <span className="text-emerald-600 font-bold">Status: RESOLVED</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2 lg:pt-1">
                    <button onClick={() => setSelected(alert)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                      View details
                    </button>
                    {alert.status === "RESOLVED" ? (
                      <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 border border-emerald-200">
                        ✓ Resolved
                      </span>
                    ) : (
                      <button
                        onClick={() => handleResolve(alert.alert_id)}
                        className="rounded-xl bg-blue-700 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-800 transition shadow-xs"
                      >
                        Resolve Alert
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {selected && (
        <div className="fixed inset-0 z-30 flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-6">
          <div role="dialog" aria-modal="true" aria-labelledby="alert-detail-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge tone={tone(selected.severity) as "rose" | "amber" | "blue"}>{selected.severity}</Badge>
                <h2 id="alert-detail-title" className="mt-2 text-xl font-bold text-slate-900">{selected.title}</h2>
              </div>
              <button onClick={() => setSelected(null)} aria-label="Close alert details" className="rounded-lg p-2 text-xl text-slate-400 hover:bg-slate-100">×</button>
            </div>
            <div className="mt-5 space-y-4 text-sm">
              <div>
                <h3 className="font-bold text-slate-900">What changed</h3>
                <p className="mt-1 leading-6 text-slate-500">{selected.message}</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Why it matters</h3>
                <p className="mt-1 leading-6 text-slate-500">Certification review cannot progress without completing this evidence item.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Mini label="Affected product" value={selected.product_name || "Electric Kettle"} detail={selected.standard_number || "BIS Standard"}/>
                <Mini label="Related requirement" value={selected.requirement_code || "REQ-TEST"} detail={selected.requirement_title || "Standard Requirement"}/>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Recommended action</h3>
                <p className="mt-1 leading-6 text-slate-500">Review the requirement evidence and upload necessary reports to the Product Compliance Passport.</p>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => {
                  if (selected.alert_id) handleResolve(selected.alert_id);
                  setSelected(null);
                }}
                className="rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
              >
                {selected.status === "RESOLVED" ? "Close" : "Mark as Resolved"}
              </button>
              <button onClick={() => setSelected(null)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}

function StandardsDiscovery() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [scheme, setScheme] = useState("All");
  const [status, setStatus] = useState("All");
  const [standardsList, setStandardsList] = useState<Standard[]>([]);
  const [selected, setSelected] = useState<Standard | null>(null);

  useEffect(() => {
    api.getStandards({ q: query, category, scheme, status }).then(setStandardsList).catch(() => {});
  }, [query, category, scheme, status]);

  const reset = () => {
    setQuery("");
    setCategory("All");
    setScheme("All");
    setStatus("All");
  };

  return (
    <Shell page="standards">
      <PageHeading eyebrow="BIS knowledge base" title="Standards & Requirements" description="Explore applicable BIS standards and product compliance requirements."/>
      <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
        <b>Official BIS Knowledge Base:</b> Standards records are loaded directly from the compliance database.
      </div>
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-3 lg:grid-cols-[1.5fr_repeat(3,1fr)_auto]">
          <div className="relative">
            <Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by standard code, title or product category..."
              aria-label="Search standards"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:bg-white"
            />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)} aria-label="Product Category" className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-600 outline-none">
            <option value="All">Product Category: All</option>
            <option value="ELEC">Electronics & IT</option>
            <option value="ELEC-CONS">Electrical Appliances</option>
            <option value="ELEC-ACC">Electrical Accessories</option>
          </select>
          <select value={scheme} onChange={e => setScheme(e.target.value)} aria-label="Compliance Scheme" className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-600 outline-none">
            <option value="All">Compliance Scheme: All</option>
            <option value="Product Certification">ISI Mark (Scheme I)</option>
            <option value="CRS">Compulsory Registration (CRS)</option>
          </select>
          <select value={status} onChange={e => setStatus(e.target.value)} aria-label="Status" className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-600 outline-none">
            <option value="All">Status: All</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="DRAFT">DRAFT</option>
          </select>
          <button onClick={reset} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">
            Reset
          </button>
        </div>
      </section>

      <section className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5 sm:px-6">
          <div>
            <h2 className="font-bold text-slate-900">Standards library</h2>
            <p className="mt-1 text-sm text-slate-500">{standardsList.length} standards match your current filters.</p>
          </div>
          <span className="text-xs text-slate-400">Database source</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-6 py-3">Standard Code</th>
                <th className="px-6 py-3">Standard Title</th>
                <th className="px-6 py-3">Product Category</th>
                <th className="px-6 py-3">Issuing Body</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {standardsList.map(row => (
                <tr key={row.standard_id} className="hover:bg-slate-50/70">
                  <td className="px-6 py-4 font-bold text-blue-700">{row.standard_number}</td>
                  <td className="max-w-xs px-6 py-4 font-medium text-slate-700">{row.standard_title}</td>
                  <td className="px-6 py-4 text-slate-500">{row.category_name || "General"}</td>
                  <td className="px-6 py-4 text-slate-500">{row.issuing_body || "Bureau of Indian Standards"}</td>
                  <td className="px-6 py-4">
                    <Badge tone={row.status === "ACTIVE" ? "green" : "amber"}>{row.status}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => setSelected(row)} className="font-semibold text-blue-700 hover:text-blue-900">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-30 flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-6">
          <div role="dialog" aria-modal="true" aria-labelledby="standard-detail-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-blue-700">{selected.standard_number}</p>
                <h2 id="standard-detail-title" className="mt-1 text-xl font-bold text-slate-900">{selected.standard_title}</h2>
              </div>
              <button onClick={() => setSelected(null)} aria-label="Close standard details" className="rounded-lg p-2 text-xl text-slate-400 hover:bg-slate-100">×</button>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Mini label="Product category" value={selected.category_name || "General"} detail="BIS Classification"/>
              <Mini label="Issuing Authority" value={selected.issuing_body || "Bureau of Indian Standards"} detail="National Standards Body"/>
            </div>
            <div className="mt-5 space-y-4 text-sm">
              <div>
                <h3 className="font-bold text-slate-900">Standard Scope &amp; Summary</h3>
                <p className="mt-1 leading-6 text-slate-500">{selected.description || "Specifications and testing protocols established by BIS."}</p>
              </div>
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-slate-900">Compliance status</h3>
                <Badge tone={selected.status === "ACTIVE" ? "green" : "amber"}>{selected.status}</Badge>
              </div>
            </div>
            <button onClick={() => setSelected(null)} className="mt-6 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">
              Close details
            </button>
          </div>
        </div>
      )}
    </Shell>
  );
}

function Reports({ section = "reports" }: { section?: "reports" | "analytics" }) {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    api.getDashboardStats().then(setStats).catch(() => {});
  }, []);

  const bars = [45, 58, 70, 63, 86, 72, 92, 78];

  return (
    <Shell page={section}>
      <PageHeading eyebrow="Compliance intelligence" title="Reports & Analytics" description="Measure readiness, requirements completion, trends and resolution performance."/>
      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Average readiness" value="78%" trend="+6.4%" icon="shield" tone="bg-blue-50 text-blue-600"/>
        <Stat label="Requirements complete" value="42 / 51" trend="+9" icon="check" tone="bg-emerald-50 text-emerald-600"/>
        <Stat label="Active Standards" value={stats?.active_standards ?? 6} trend="+1" icon="alert" tone="bg-violet-50 text-violet-600"/>
        <Stat label="Active products" value={stats?.total_products ?? 12} trend="+2" icon="passport" tone="bg-amber-50 text-amber-600"/>
      </section>

      <section className="mt-7 grid gap-7 xl:grid-cols-[1.25fr_.75fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex justify-between">
            <div>
              <h2 className="font-bold text-slate-900">Requirement completion</h2>
              <p className="mt-1 text-sm text-slate-500">Completion trend across product profiles</p>
            </div>
            <Badge tone="blue">Last 8 weeks</Badge>
          </div>
          <div className="mt-8 flex h-56 items-end gap-3 border-b border-l border-slate-100 px-4 pt-3">
            {bars.map((height, i) => (
              <div className="flex h-full flex-1 items-end" key={i}>
                <div style={{ height: `${height}%` }} className="w-full rounded-t-md bg-blue-600"/>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-[11px] text-slate-400">
            <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span>
            <span>Week 5</span><span>Week 6</span><span>Week 7</span><span>Week 8</span>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-bold text-slate-900">Compliance status</h2>
          <p className="mt-1 text-sm text-slate-500">Across active product profiles</p>
          <div className="mt-6 space-y-5">
            {[["On track", "58%", "bg-emerald-500"], ["In progress", "31%", "bg-blue-500"], ["Needs attention", "11%", "bg-amber-500"]].map(([label, pct, color]) => (
              <div key={label}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-600">{label}</span>
                  <b className="text-slate-700">{pct}</b>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className={`h-2 rounded-full ${color}`} style={{ width: pct }}/>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900">Reports</h2>
            <p className="mt-1 text-sm text-slate-500">Generate or download product and portfolio summaries.</p>
          </div>
          <button className="rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white">Generate report</button>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {["Product Compliance Passport", "Requirement Completion Summary", "Alerts & Resolution Performance"].map(title => (
            <div key={title} className="rounded-xl border border-slate-200 p-4">
              <Icon name="file" className="h-5 w-5 text-blue-700"/>
              <p className="mt-3 text-sm font-bold text-slate-700">{title}</p>
              <div className="mt-4 flex gap-4 text-xs font-semibold text-blue-700">
                <button>View</button>
                <button>Download</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Shell>
  );
}

function Settings() {
  return (
    <Shell page="settings">
      <PageHeading eyebrow="Account and portal" title="Settings" description="Manage your profile, notifications, portal preferences and security."/>
      <div className="mt-7 grid gap-7 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-bold text-slate-900">Profile & organisation</h2>
          <div className="mt-5 flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-blue-700 text-lg font-bold text-white">PK</span>
            <div>
              <p className="font-bold text-slate-900">Pushpit Kumar</p>
              <p className="text-sm text-slate-500">Aarav Home Appliances Pvt. Ltd.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Name" value="Pushpit Kumar"/>
            <Field label="Role" value="Manufacturer"/>
            <Field label="Email" value="pushpit1845@gmail.com"/>
            <Field label="Location" value="Bengaluru, Karnataka"/>
          </div>
          <button className="mt-5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700">Edit profile</button>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-bold text-slate-900">Notification preferences</h2>
          <p className="mt-1 text-sm text-slate-500">Choose which compliance updates you receive.</p>
          <div className="mt-4 divide-y divide-slate-100">
            {[
              ["Standard updates", "Relevant standards and amendment alerts", true],
              ["Requirement reminders", "Evidence and milestone reminders", true],
              ["Application updates", "BIS service and application status", true],
              ["Product tips", "Guidance for your product categories", false]
            ].map(([label, desc, enabled]) => (
              <div className="flex items-center justify-between gap-4 py-4" key={String(label)}>
                <div>
                  <p className="text-sm font-semibold text-slate-700">{label as string}</p>
                  <p className="mt-1 text-xs text-slate-500">{desc as string}</p>
                </div>
                <span className={`relative h-6 w-11 shrink-0 rounded-full ${enabled ? "bg-blue-700" : "bg-slate-200"}`}>
                  <i className={`absolute top-1 h-4 w-4 rounded-full bg-white ${enabled ? "left-6" : "left-1"}`}/>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-bold text-slate-900">Portal preferences</h2>
          <div className="mt-5 space-y-4">
            <Select label="Default view: Dashboard"/>
            <Select label="Language: English"/>
            <Select label="Date format: DD/MM/YYYY"/>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-bold text-slate-900">Security & general</h2>
          <div className="mt-5 rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">Password & sign-in</p>
            <p className="mt-1 text-xs text-slate-500">Keep your account protected with a strong password.</p>
            <button className="mt-3 text-sm font-semibold text-blue-700">Change password</button>
          </div>
          <div className="mt-4 rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">Last signed in</p>
            <p className="mt-1 text-xs text-slate-500">Today at 09:14 AM · Bengaluru, India</p>
          </div>
        </section>
      </div>
    </Shell>
  );
}

function PageHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-blue-700">{eyebrow}</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function Input({ placeholder }: { placeholder: string }) {
  return (
    <div className="relative">
      <Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/>
      <input placeholder={placeholder} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-3 text-sm outline-none focus:border-blue-400"/>
    </div>
  );
}

function Select({ label }: { label: string }) {
  return (
    <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-600 outline-none">
      <option>{label}</option>
    </select>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      <input defaultValue={value} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:bg-white"/>
    </label>
  );
}

function Mini({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-2 text-lg font-bold text-slate-800">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  );
}

export default function BisPortal({ page }: { page: Page }) {
  return page === "dashboard" ? <Dashboard/> :
         page === "assistant" ? <Assistant/> :
         page === "passport" ? <Passport/> :
         page === "details" ? <Passport details/> :
         page === "standards" ? <StandardsDiscovery/> :
         page === "services" ? <Services/> :
         page === "alerts" ? <AlertsDiscovery/> :
         page === "reports" ? <Reports/> :
         page === "analytics" ? <Reports section="analytics"/> :
         <Settings/>;
}
