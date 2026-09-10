import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SpecButtons } from '../components/SpecButtons';
import {
  Book, Terminal, Shield, Zap, AlertCircle, CheckCircle, Copy, Check,
  ChevronRight, ArrowRight, Hash, ExternalLink, Menu, X, Key,
  Activity, Server, Lock, Unlock,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { API_BASE_URL, SUPABASE_FUNCTIONS_URL, ENDPOINTS } from '../lib/api';

// ─── Sidebar nav ──────────────────────────────────────────────────────────────

interface NavItem { id: string; label: string }
interface NavSection { id: string; label: string; icon: React.ElementType; items: NavItem[] }

const NAV: NavSection[] = [
  {
    id: 'getting-started', label: 'Getting Started', icon: Book,
    items: [
      { id: 'introduction',   label: 'Introduction' },
      { id: 'quick-start',    label: 'Quick Start' },
      { id: 'authentication', label: 'Authentication' },
    ],
  },
  {
    id: 'payments', label: 'Payments', icon: Zap,
    items: [
      { id: 'x402-overview', label: 'x402 Payment Flow' },
      { id: 'base-mainnet',  label: 'Base Mainnet' },
    ],
  },
  {
    id: 'endpoints', label: 'Endpoints', icon: Terminal,
    items: [
      { id: 'ep-health',        label: 'GET /health' },
      { id: 'ep-capabilities',  label: 'GET /v1/capabilities' },
      { id: 'ep-agents',        label: 'GET /v1/agents' },
      { id: 'ep-signup',        label: 'POST /functions/v1/api-key-signup' },
      { id: 'ep-guard-acp',     label: 'POST /v1/acp/guard' },
      { id: 'ep-decide-acp',    label: 'POST /v1/acp/decide' },
      { id: 'ep-guard-private', label: 'POST /functions/v1/guard' },
    ],
  },
  {
    id: 'reference', label: 'Reference', icon: Shield,
    items: [
      { id: 'response-schema', label: 'Response Schema' },
      { id: 'checks-reference', label: 'Check Types' },
      { id: 'error-codes',     label: 'Error Codes' },
    ],
  },
];

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-200 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08]"
    >
      {copied
        ? <><Check className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400 font-mono">Copied</span></>
        : <><Copy className="w-3.5 h-3.5" /><span className="font-mono">Copy</span></>}
    </button>
  );
}

// ─── Code block ───────────────────────────────────────────────────────────────

function CodeBlock({ code, lang = 'bash', title }: { code: string; lang?: string; title?: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/[0.08] my-5 bg-[#0a0b10]">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-[#0c0d14]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]/60" />
          </div>
          {title && <span className="text-xs font-mono text-gray-500">{title}</span>}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-gray-700 uppercase">{lang}</span>
          <CopyButton text={code} />
        </div>
      </div>
      <pre className="p-5 text-sm font-mono leading-6 overflow-x-auto text-gray-300 whitespace-pre">{code}</pre>
    </div>
  );
}

// ─── Request card ─────────────────────────────────────────────────────────────

function RequestCard({
  method, path, headers, body, description,
}: {
  method: 'GET' | 'POST'; path: string; description?: string;
  headers?: Record<string, string>; body?: string;
}) {
  const mc = method === 'POST'
    ? 'text-blue-400 bg-blue-500/10 border-blue-500/25'
    : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25';

  const curlLines = [
    `curl -X ${method} ${path}`,
    ...(headers ? Object.entries(headers).map(([k, v]) => `  -H "${k}: ${v}"`) : []),
    ...(body ? [`  -d '${body}'`] : []),
  ].join(' \\\n');

  return (
    <div className="rounded-xl border border-white/[0.08] overflow-hidden my-5 bg-[#0a0b10]">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-[#0c0d14]">
        <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded-md border ${mc}`}>{method}</span>
        <code className="text-sm font-mono text-gray-200 flex-1 truncate">{path}</code>
        {description && <span className="text-xs text-gray-600 hidden sm:block flex-shrink-0">{description}</span>}
        <CopyButton text={curlLines} />
      </div>
      {headers && (
        <div className="px-4 py-3 border-b border-white/[0.05]">
          <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-2">Headers</p>
          {Object.entries(headers).map(([k, v]) => (
            <div key={k} className="flex items-center gap-3 text-xs font-mono py-0.5">
              <span className="text-blue-400/80 flex-shrink-0">{k}:</span>
              <span className="text-gray-400">{v}</span>
            </div>
          ))}
        </div>
      )}
      {body && (
        <div>
          <div className="px-4 pt-3 pb-1">
            <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Body</p>
          </div>
          <pre className="px-4 pb-4 text-sm font-mono text-gray-300 leading-6 overflow-x-auto whitespace-pre">{body}</pre>
        </div>
      )}
    </div>
  );
}

// ─── Response card ────────────────────────────────────────────────────────────

function ResponseCard({
  status, statusText, body, label,
}: {
  status: number; statusText: string; body: string; label?: string;
}) {
  const isOk = status >= 200 && status < 300;
  const is402 = status === 402;
  const sc = isOk
    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25'
    : is402
    ? 'text-yellow-300 bg-yellow-500/10 border-yellow-500/25'
    : 'text-red-400 bg-red-500/10 border-red-500/25';

  return (
    <div className="rounded-xl border border-white/[0.08] overflow-hidden my-5 bg-[#0a0b10]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-[#0c0d14]">
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded-md border ${sc}`}>{status}</span>
          <span className="text-xs font-mono text-gray-500">{statusText}</span>
          {label && <span className="text-[10px] font-mono text-gray-700 px-2 py-0.5 border border-white/[0.06] rounded bg-white/[0.02]">{label}</span>}
        </div>
        <CopyButton text={body} />
      </div>
      <pre className="px-4 py-4 text-sm font-mono text-gray-300 leading-6 overflow-x-auto whitespace-pre">{body}</pre>
    </div>
  );
}

// ─── Callout ──────────────────────────────────────────────────────────────────

function Callout({
  type = 'info', title, children,
}: {
  type?: 'info' | 'warning' | 'success' | 'danger'; title?: string; children: React.ReactNode;
}) {
  const map = {
    info:    { icon: AlertCircle, border: 'border-blue-500/25',    bg: 'bg-blue-500/[0.06]',    title_c: 'text-blue-300',    icon_c: 'text-blue-400' },
    warning: { icon: AlertCircle, border: 'border-yellow-500/25',  bg: 'bg-yellow-500/[0.05]',  title_c: 'text-yellow-200',  icon_c: 'text-yellow-400' },
    success: { icon: CheckCircle, border: 'border-emerald-500/25', bg: 'bg-emerald-500/[0.06]', title_c: 'text-emerald-200', icon_c: 'text-emerald-400' },
    danger:  { icon: AlertCircle, border: 'border-red-500/25',     bg: 'bg-red-500/[0.05]',     title_c: 'text-red-200',     icon_c: 'text-red-400' },
  };
  const m = map[type];
  const Icon = m.icon;
  return (
    <div className={`flex gap-3 p-4 rounded-xl border ${m.border} ${m.bg} my-5`}>
      <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${m.icon_c}`} />
      <div>
        {title && <p className={`font-semibold text-sm mb-1.5 ${m.title_c}`}>{title}</p>}
        <div className="text-sm text-gray-400 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────

function H({ id, level, children }: { id: string; level: 1 | 2 | 3; children: React.ReactNode }) {
  const base = 'group flex items-center gap-2 font-bold text-white scroll-mt-24';
  const size = level === 1 ? 'text-3xl mt-2 mb-5' : level === 2 ? 'text-xl mt-10 mb-4' : 'text-base mt-7 mb-3';
  return (
    <div id={id} className={`${base} ${size}`}>
      {children}
      <a href={`#${id}`} className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Hash className="w-4 h-4 text-gray-600" />
      </a>
    </div>
  );
}

// ─── Param table ──────────────────────────────────────────────────────────────

function ParamTable({ params }: {
  params: { name: string; type: string; required?: boolean; desc: string; default?: string }[];
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] overflow-hidden my-5">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.07] bg-white/[0.02]">
            <th className="text-left px-4 py-2.5 text-xs font-mono text-gray-500 font-medium">Field</th>
            <th className="text-left px-4 py-2.5 text-xs font-mono text-gray-500 font-medium">Type</th>
            <th className="text-left px-4 py-2.5 text-xs font-mono text-gray-500 font-medium hidden sm:table-cell">Required</th>
            <th className="text-left px-4 py-2.5 text-xs font-mono text-gray-500 font-medium">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {params.map((p) => (
            <tr key={p.name} className="hover:bg-white/[0.01] transition-colors">
              <td className="px-4 py-3"><code className="text-xs font-mono text-blue-300">{p.name}</code></td>
              <td className="px-4 py-3"><code className="text-xs font-mono text-purple-300">{p.type}</code></td>
              <td className="px-4 py-3 hidden sm:table-cell">
                {p.required
                  ? <span className="text-xs text-red-400 font-mono">required</span>
                  : <span className="text-xs text-gray-600 font-mono">{p.default ? `default: ${p.default}` : 'optional'}</span>}
              </td>
              <td className="px-4 py-3 text-gray-500 text-xs leading-relaxed">{p.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Sidebar content ──────────────────────────────────────────────────────────

function SidebarContent({
  sections, activeId, scrollTo,
}: {
  sections: NavSection[]; activeId: string; scrollTo: (id: string) => void;
}) {
  return (
    <nav className="space-y-6">
      {sections.map((sec) => {
        const Icon = sec.icon;
        return (
          <div key={sec.id}>
            <div className="flex items-center gap-2 mb-2 px-2">
              <Icon className="w-3.5 h-3.5 text-gray-600" />
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">{sec.label}</span>
            </div>
            <div className="space-y-0.5">
              {sec.items.map((item) => {
                const active = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-100 border-l-2 ${
                      active
                        ? 'bg-blue-500/10 text-white border-blue-500'
                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03] border-transparent'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="pt-3 border-t border-white/[0.05] space-y-1 px-2">
        <a href="https://github.com/verifyproceed" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-400 transition-colors py-1.5">
          <ExternalLink className="w-3 h-3" /> GitHub
        </a>
        <Link to="/playground" className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-400 transition-colors py-1.5">
          <Terminal className="w-3 h-3" /> Playground
          <ChevronRight className="w-2.5 h-2.5 ml-auto" />
        </Link>
        <Link to="/get-api-key" className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-400 transition-colors py-1.5">
          <Key className="w-3 h-3" /> Get API Key
          <ChevronRight className="w-2.5 h-2.5 ml-auto" />
        </Link>
      </div>
    </nav>
  );
}

// ─── On this page ─────────────────────────────────────────────────────────────

const ON_THIS_PAGE = [
  { id: 'introduction',     label: 'Introduction' },
  { id: 'quick-start',      label: 'Quick Start' },
  { id: 'authentication',   label: 'Authentication' },
  { id: 'x402-overview',    label: 'x402 Payment Flow' },
  { id: 'base-mainnet',     label: 'Base Mainnet' },
  { id: 'ep-health',        label: 'GET /health' },
  { id: 'ep-capabilities',  label: 'GET /v1/capabilities' },
  { id: 'ep-agents',        label: 'GET /v1/agents' },
  { id: 'ep-signup',        label: 'POST /v1/api-keys/signup' },
  { id: 'ep-guard-acp',     label: 'POST /v1/acp/guard' },
  { id: 'ep-decide-acp',    label: 'POST /v1/acp/decide' },
  { id: 'ep-guard-private', label: 'POST /v1/guard' },
  { id: 'response-schema',  label: 'Response Schema' },
  { id: 'checks-reference', label: 'Check Types' },
  { id: 'error-codes',      label: 'Error Codes' },
];

function OnThisPage({ activeId, scrollTo }: { activeId: string; scrollTo: (id: string) => void }) {
  return (
    <div className="space-y-0.5">
      {ON_THIS_PAGE.map((item) => (
        <button key={item.id} onClick={() => scrollTo(item.id)}
          className={`w-full text-left text-xs py-1.5 px-2 rounded transition-all duration-100 ${
            activeId === item.id ? 'text-blue-400 font-medium' : 'text-gray-600 hover:text-gray-400'
          }`}>
          {item.label}
        </button>
      ))}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function DocsPage() {
  const [activeId, setActiveId] = useState('introduction');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const allIds = NAV.flatMap((s) => s.items.map((i) => i.id));
    const onScroll = () => {
      for (let i = allIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(allIds[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveId(allIds[i]);
          return;
        }
      }
      setActiveId(allIds[0]);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: 'smooth' });
    setActiveId(id);
    setMobileNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      <Navbar />

      {/* ── PAGE HEADER ── */}
      <div className="relative border-b border-white/[0.06] pt-16">
        <div className="absolute inset-0 grid-bg opacity-15" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="section-label mb-4">
            <Book className="w-3.5 h-3.5" /> Documentation
          </motion.div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
                className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-3">
                API Reference
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.14 }}
                className="text-gray-400 text-base max-w-xl">
                Verification and decision infrastructure for autonomous AI agents. Real-time checks. x402 machine payments.
              </motion.p>
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}
              className="flex flex-wrap items-center gap-2 sm:flex-shrink-0">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/[0.06]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                <span className="text-xs font-mono text-emerald-400">Live API</span>
              </div>
              {[
                { label: 'Base Mainnet', color: 'text-blue-400 border-blue-500/25 bg-blue-500/[0.06]' },
                { label: 'x402 enabled', color: 'text-cyan-400 border-cyan-500/25 bg-cyan-500/[0.06]' },
              ].map((b) => (
                <span key={b.label} className={`text-xs font-mono px-3 py-1 rounded-full border ${b.color}`}>{b.label}</span>
              ))}
              <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                <span className="text-gray-700">Base URL</span>
                <code className="text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-lg text-xs">{API_BASE_URL}</code>
                <CopyButton text={API_BASE_URL} />
              </div>
              <SpecButtons size="xs" className="mt-1" />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-0 lg:gap-8">

          {/* Mobile nav toggle */}
          <div className="lg:hidden sticky top-16 z-40 bg-[#050508] border-b border-white/[0.06] -mx-4 px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-400">
              {NAV.flatMap((s) => s.items).find((i) => i.id === activeId)?.label ?? 'Docs'}
            </span>
            <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
              {mobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

          {mobileNavOpen && (
            <div className="lg:hidden fixed inset-0 top-[9.5rem] z-30 bg-[#050508]/95 backdrop-blur-xl overflow-y-auto px-4 py-6 border-r border-white/[0.06]">
              <SidebarContent sections={NAV} activeId={activeId} scrollTo={scrollTo} />
            </div>
          )}

          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-60 flex-shrink-0 py-10">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
              <SidebarContent sections={NAV} activeId={activeId} scrollTo={scrollTo} />
            </div>
          </aside>

          {/* ── CONTENT ── */}
          <main ref={contentRef} className="flex-1 min-w-0 py-10 pb-24 max-w-3xl">

            {/* ─── INTRODUCTION ─── */}
            <section>
              <H id="introduction" level={1}>Introduction</H>
              <p className="text-gray-400 leading-relaxed mb-5">
                The <strong className="text-white">Decision + Verification Agent</strong> is verification and decision infrastructure for autonomous AI agents. Before your agent executes an on-chain action, it calls this API to get a real-time safety verdict based on live checks — RPC health, stablecoin pegs, bridge exploits, DEX liquidity, and more.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 my-6">
                {[
                  {
                    icon: Shield, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
                    title: 'Guard & Decide',
                    desc: 'Pre-execution safety checks and policy-driven decisions for any on-chain agent action.',
                  },
                  {
                    icon: Zap, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
                    title: 'x402 Machine Payments',
                    desc: 'HTTP-native USDC micropayments on Base. Agents pay APIs directly — no billing, no accounts.',
                  },
                  {
                    icon: Activity, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                    title: 'Live Evidence',
                    desc: 'Every verdict includes raw evidence: which checks ran, latency, results, and failure modes.',
                  },
                  {
                    icon: Server, color: 'text-gray-400 bg-white/[0.04] border-white/[0.08]',
                    title: 'ACP + Private modes',
                    desc: 'Public ACP endpoints for permissionless access. Private endpoints for API key holders.',
                  },
                ].map((c) => {
                  const Icon = c.icon;
                  return (
                    <div key={c.title} className={`p-4 rounded-xl border ${c.color}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={`w-4 h-4 ${c.color.split(' ')[0]}`} />
                        <span className="text-white font-semibold text-sm">{c.title}</span>
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed">{c.desc}</p>
                    </div>
                  );
                })}
              </div>
              <Callout type="info" title="Base URL">
                All requests go to <code className="text-blue-300 font-mono bg-blue-500/10 px-1.5 py-0.5 rounded text-xs">{API_BASE_URL}</code>. All responses are JSON. TLS required.
              </Callout>
            </section>

            <div className="my-12 border-t border-white/[0.05]" />

            {/* ─── QUICK START ─── */}
            <section>
              <H id="quick-start" level={1}>Quick Start</H>
              <p className="text-gray-400 leading-relaxed mb-6">
                Get your first verified guard check in under two minutes.
              </p>

              <H id="qs-install" level={2}>1. Get an API key</H>
              <RequestCard
                method="POST"
                path={`${API_BASE_URL}${ENDPOINTS.API_KEY_SIGNUP}`}
                description="Free — instant key delivery"
                headers={{ 'Content-Type': 'application/json' }}
                body={`{
  "email":     "you@example.com",
  "full_name": "Your Name",
  "use_case":  "defi-agent"
}`}
              />
              <ResponseCard
                status={200}
                statusText="OK"
                label="api-key issued"
                body={`{
  "ok":      true,
  "message": "Signup received. Use the issued key for private endpoints.",
  "api_key": "vp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "base_url": "${API_BASE_URL}"
}`}
              />

              <H id="qs-verify" level={2}>2. Verify before acting</H>
              <CodeBlock lang="typescript" title="agent.ts" code={`import { API_BASE_URL } from './api';

const result = await fetch(\`\${API_BASE_URL}/v1/acp/guard\`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action:     'bridge',
    chain:      'base',
    amount_usd: 50000,
  }),
}).then(r => r.json());

if (result.verdict === 'proceed') {
  await executeBridge(params);  // safe to act
} else {
  console.warn('Blocked:', result.decision.reason);
}`} />

              <H id="qs-sdk" level={2}>3. SDK (coming soon)</H>
              <Callout type="info" title="SDK coming soon">
                A TypeScript SDK is in development and not yet published. Use the <code className="text-cyan-300 font-mono">fetch</code> or <code className="text-cyan-300 font-mono">curl</code> examples above while it's in progress.
              </Callout>
            </section>

            <div className="my-12 border-t border-white/[0.05]" />

            {/* ─── AUTHENTICATION ─── */}
            <section>
              <H id="authentication" level={1}>Authentication</H>
              <p className="text-gray-400 leading-relaxed mb-5">
                The API supports two modes:
              </p>
              <div className="space-y-3 mb-6">
                {[
                  {
                    icon: Lock,
                    tag: 'Authorization: Bearer', tagColor: 'text-blue-400',
                    color: 'border-blue-500/25 bg-blue-500/[0.04]',
                    desc: 'Recommended. Include your API key in the Authorization header.',
                    code: `Authorization: Bearer vp_your_api_key`,
                  },
                  {
                    icon: Key,
                    tag: 'X-API-Key', tagColor: 'text-sky-400',
                    color: 'border-sky-500/25 bg-sky-500/[0.04]',
                    desc: 'Alternative header. Accepted on all authenticated endpoints alongside Bearer.',
                    code: `X-API-Key: vp_your_api_key`,
                  },
                  {
                    icon: Unlock,
                    tag: 'x402 (keyless)', tagColor: 'text-cyan-400',
                    color: 'border-cyan-500/25 bg-cyan-500/[0.04]',
                    desc: 'No API key required. Respond to 402 responses with USDC on Base via x402. ACP endpoints only.',
                    code: `x402-payment: <x402 payment header>`,
                  },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <div key={m.tag} className={`p-4 rounded-xl border ${m.color}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={`w-3.5 h-3.5 ${m.tagColor}`} />
                        <span className={`text-xs font-mono font-bold ${m.tagColor}`}>{m.tag}</span>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{m.desc}</p>
                      <div className="flex items-center justify-between bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2">
                        <code className="text-xs font-mono text-gray-400">{m.code}</code>
                        <CopyButton text={m.code} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <Callout type="warning" title="Keep keys secret">
                Store in environment variables. Never commit to version control or use in client-side code.
              </Callout>
            </section>

            <div className="my-12 border-t border-white/[0.05]" />

            {/* ─── X402 ─── */}
            <section>
              <H id="x402-overview" level={1}>x402 Payment Flow</H>
              <p className="text-gray-400 leading-relaxed mb-5">
                x402 extends the HTTP <code className="text-yellow-300 font-mono bg-yellow-500/10 px-1 py-0.5 rounded text-xs">402 Payment Required</code> status code into a complete machine-to-machine payment flow. Your agent pays in USDC on Base — no accounts, no billing portals, no human operators.
              </p>

              <H id="x402-steps" level={2}>How it works</H>
              <div className="space-y-3 my-5">
                {[
                  {
                    step: '1', color: 'bg-blue-500/15 border-blue-500/30 text-blue-400',
                    title: 'Agent calls endpoint',
                    desc: 'Send any ACP endpoint request with no credentials. This is a valid first request.',
                  },
                  {
                    step: '2', color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
                    title: 'API returns 402',
                    desc: 'The server responds with HTTP 402 and a JSON body: token, amount, recipient address, and nonce.',
                  },
                  {
                    step: '3', color: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
                    title: 'Agent pays on-chain via x402',
                    desc: 'Pay the USDC amount to the recipient on Base using the x402 protocol.',
                  },
                  {
                    step: '4', color: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
                    title: 'Agent retries with x402 payment header',
                    desc: 'Retry the original request with the x402 payment header attached. The server verifies and responds.',
                  },
                  {
                    step: '5', color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
                    title: 'API returns verified response',
                    desc: 'Server confirms payment and returns the full guard/decide response.',
                  },
                ].map((s) => (
                  <div key={s.step} className={`flex gap-3 p-4 rounded-xl border ${s.color.split(' ')[1]} ${s.color.split(' ')[0]}`}>
                    <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 ${s.color}`}>
                      {s.step}
                    </span>
                    <div>
                      <p className="text-white font-semibold text-sm mb-0.5">{s.title}</p>
                      <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <H id="x402-402-response" level={2}>402 Response body</H>
              <ResponseCard
                status={402}
                statusText="Payment Required"
                label="x402 payment prompt"
                body={`{
  "error": "payment_required",
  "payment": {
    "protocol":   "x402",
    "version":    "1",
    "token":      "USDC",
    "network":    "base",
    "amount":     "0.010000",
    "recipient":  "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    "nonce":      "a1b2c3d4e5f6789012",
    "expires_at": "2026-05-20T10:05:00Z"
  },
  "message": "Payment required. Pay $0.01 USDC on Base via x402 and retry."
}`}
              />

              <H id="x402-sdk" level={2}>SDK auto-payment (coming soon)</H>
              <Callout type="info" title="SDK coming soon">
                A TypeScript SDK that handles the full x402 flow automatically is in development. In the meantime, use the raw fetch pattern below.
              </Callout>
              <CodeBlock lang="typescript" title="x402-fetch.ts" code={`// Full x402 flow using raw fetch + viem (no SDK required)
import { createWalletClient, http, parseUnits } from 'viem';
import { base } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

const API = 'https://api.verifyproceed.com';
const USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

const account = privateKeyToAccount(process.env.AGENT_WALLET_KEY as \`0x\${string}\`);
const client = createWalletClient({ account, chain: base, transport: http() });

async function callWithX402(path: string, body: unknown) {
  // Step 1: initial request
  const res1 = await fetch(\`\${API}\${path}\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (res1.status !== 402) return res1.json();

  // Step 2: parse the payment-required challenge
  const { payment } = await res1.json();

  // Step 3: pay USDC on Base
  const txHash = await client.writeContract({
    address: USDC,
    abi: [{ name: 'transfer', type: 'function', inputs: [{ type: 'address' }, { type: 'uint256' }], outputs: [{ type: 'bool' }] }],
    functionName: 'transfer',
    args: [payment.recipient, parseUnits(payment.amount, 6)],
  });

  // Step 4: retry with x402 payment header
  const res2 = await fetch(\`\${API}\${path}\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x402-payment': JSON.stringify({ txHash, ...payment }),
    },
    body: JSON.stringify(body),
  });

  return res2.json();
}

const result = await callWithX402('/v1/acp/guard', { action: 'bridge', chain: 'base' });`} />
            </section>

            <div className="my-12 border-t border-white/[0.05]" />

            {/* ─── BASE MAINNET ─── */}
            <section>
              <H id="base-mainnet" level={1}>Base Mainnet</H>
              <p className="text-gray-400 leading-relaxed mb-5">
                All x402 payments settle on <strong className="text-white">Base</strong> (Coinbase L2) using USDC.
              </p>
              <ParamTable params={[
                { name: 'Chain ID',     type: 'number',  desc: '8453 (Base mainnet)' },
                { name: 'Token',        type: 'address', desc: 'USDC — 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' },
                { name: 'Min balance',  type: 'string',  desc: 'Recommend 1 USDC. Each request costs $0.01.' },
              ]} />
              <CodeBlock lang="typescript" title="wallet-setup.ts" code={`import { createWalletClient, http } from 'viem';
import { base } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

const account = privateKeyToAccount(process.env.AGENT_WALLET_KEY as \`0x\${string}\`);

// Connect to Base mainnet (optionally with a custom RPC)
const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http(process.env.BASE_RPC_URL), // defaults to public RPC if omitted
});`} />
            </section>

            <div className="my-12 border-t border-white/[0.05]" />

            {/* ─── ENDPOINTS ─── */}

            {/* GET /health */}
            <section>
              <H id="ep-health" level={1}>GET /health</H>
              <p className="text-gray-400 leading-relaxed mb-4">
                Liveness check. Returns <code className="text-emerald-300 font-mono bg-emerald-500/10 px-1 py-0.5 rounded text-xs">ok: true</code> when the API is operational. No authentication required.
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {[
                  { label: 'No auth required', color: 'text-emerald-400 border-emerald-500/25 bg-emerald-500/[0.05]' },
                  { label: '~5ms avg', color: 'text-blue-400 border-blue-500/25 bg-blue-500/[0.05]' },
                  { label: 'Free', color: 'text-gray-400 border-white/[0.10] bg-white/[0.02]' },
                ].map((b) => (
                  <span key={b.label} className={`text-xs font-mono px-3 py-1 rounded-full border ${b.color}`}>{b.label}</span>
                ))}
              </div>
              <RequestCard method="GET" path={`${API_BASE_URL}/health`} />
              <ResponseCard status={200} statusText="OK" label="healthy" body={`{
  "ok":   true,
  "name": "Decision + Verification Agent"
}`} />
            </section>

            <div className="my-10 border-t border-white/[0.04]" />

            {/* GET /v1/capabilities */}
            <section>
              <H id="ep-capabilities" level={1}>GET /v1/capabilities</H>
              <p className="text-gray-400 leading-relaxed mb-4">
                Returns the capability manifest: all supported checks, actions, decision types, and endpoint map. Call this at agent startup to discover what's available.
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {[
                  { label: 'No auth required', color: 'text-emerald-400 border-emerald-500/25 bg-emerald-500/[0.05]' },
                  { label: '~30ms avg', color: 'text-blue-400 border-blue-500/25 bg-blue-500/[0.05]' },
                  { label: 'Cacheable 5 min', color: 'text-gray-400 border-white/[0.10] bg-white/[0.02]' },
                ].map((b) => (
                  <span key={b.label} className={`text-xs font-mono px-3 py-1 rounded-full border ${b.color}`}>{b.label}</span>
                ))}
              </div>
              <RequestCard method="GET" path={`${API_BASE_URL}${ENDPOINTS.CAPABILITIES}`} />
              <ResponseCard status={200} statusText="OK" label="capability manifest" body={`{
  "name": "Decision + Verification Agent",
  "description": "Verify external conditions before an AI agent executes actions.",
  "checks_supported": [
    "http",
    "rpc",
    "price",
    "tx",
    "dex_price",
    "stablecoin_depeg",
    "bridge_exploit_monitor",
    "rug_pull_risk"
  ],
  "guard_actions_supported": ["swap", "transfer", "bridge", "yield_deposit", "generic"],
  "max_checks_private": 10,
  "max_checks_acp": 3,
  "decision_types": ["proceed", "wait", "block"],
  "base_url": "${API_BASE_URL}",
  "endpoints": {
    "acp_guard":        "/v1/acp/guard",
    "acp_decision":     "/v1/acp/decide",
    "private_guard":    "/functions/v1/guard",
    "private_decision": "/v1/decide",
    "api_key_signup":   "/functions/v1/api-key-signup",
    "agents":           "/v1/agents",
    "health":           "/health"
  }
}`} />
            </section>

            <div className="my-10 border-t border-white/[0.04]" />

            {/* GET /v1/agents */}
            <section>
              <H id="ep-agents" level={1}>GET /v1/agents</H>
              <p className="text-gray-400 leading-relaxed mb-4">
                Lists all available agents in the ecosystem. Each agent has a unique slug, status, and a set of endpoints it exposes.
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {[
                  { label: 'No auth required', color: 'text-emerald-400 border-emerald-500/25 bg-emerald-500/[0.05]' },
                  { label: '~25ms avg', color: 'text-blue-400 border-blue-500/25 bg-blue-500/[0.05]' },
                ].map((b) => (
                  <span key={b.label} className={`text-xs font-mono px-3 py-1 rounded-full border ${b.color}`}>{b.label}</span>
                ))}
              </div>
              <RequestCard method="GET" path={`${API_BASE_URL}${ENDPOINTS.AGENTS}`} />
              <ResponseCard status={200} statusText="OK" label="agent list" body={`[
  {
    "name":        "Decision Verification Agent",
    "slug":        "decision-verification-agent",
    "status":      "live",
    "description": "AI infrastructure agent that verifies conditions before autonomous systems act.",
    "endpoints":   ["/v1/decide", "/v1/acp/decide", "/functions/v1/guard", "/v1/acp/guard"]
  },
  {
    "name":        "Execution Guard Engine",
    "slug":        "execution-guard-engine",
    "status":      "live",
    "description": "Universal guard endpoint that automatically builds the correct safety checks.",
    "endpoints":   ["/functions/v1/guard", "/v1/acp/guard", "/v1/agents/execution-guard/execute"]
  },
  {
    "name":        "DeFi Risk Verification Module",
    "slug":        "defi-risk-verification-module",
    "status":      "live",
    "description": "DeFi-focused checks: stablecoin depeg, DEX liquidity, rug-pull risk, bridge monitoring.",
    "endpoints":   ["/v1/agents/defi-risk/verify"]
  }
]`} />
            </section>

            <div className="my-10 border-t border-white/[0.04]" />

            {/* POST /functions/v1/api-key-signup */}
            <section>
              <H id="ep-signup" level={1}>POST /functions/v1/api-key-signup</H>
              <p className="text-gray-400 leading-relaxed mb-4">
                Issue an API key for private endpoints. Keys are stored in the shared <code className="text-blue-300 font-mono bg-blue-500/10 px-1 py-0.5 rounded text-xs">api_signups</code> table and are immediately valid on <code className="text-blue-300 font-mono bg-blue-500/10 px-1 py-0.5 rounded text-xs">/functions/v1/guard</code>.
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {[
                  { label: 'No auth required', color: 'text-emerald-400 border-emerald-500/25 bg-emerald-500/[0.05]' },
                  { label: 'Free tier', color: 'text-blue-400 border-blue-500/25 bg-blue-500/[0.05]' },
                ].map((b) => (
                  <span key={b.label} className={`text-xs font-mono px-3 py-1 rounded-full border ${b.color}`}>{b.label}</span>
                ))}
              </div>
              <H id="signup-params" level={2}>Request body</H>
              <ParamTable params={[
                { name: 'email',     type: 'string', required: true,  desc: 'Your email address. Used for key recovery.' },
                { name: 'full_name', type: 'string', required: true,  desc: 'Your name or agent identifier.' },
                { name: 'company',   type: 'string',                  desc: 'Organization or project name.' },
                { name: 'use_case',  type: 'string', required: true,  desc: 'Primary use case (e.g. defi-agent, bridge, research).' },
                { name: 'description', type: 'string',                desc: 'Brief description of what you are building.' },
              ]} />
              <RequestCard
                method="POST"
                path={`${SUPABASE_FUNCTIONS_URL}/api-key-signup`}
                headers={{ 'Content-Type': 'application/json' }}
                body={`{
  "email":       "agent@example.com",
  "full_name":   "Trading Bot v2",
  "use_case":    "defi-agent",
  "description": "Autonomous DeFi trading agent on Base"
}`}
              />
              <ResponseCard status={200} statusText="OK" label="key issued" body={`{
  "ok":            true,
  "api_key":       "vp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "plan":          "free",
  "monthly_limit": 100,
  "is_existing":   false,
  "message":       "API key created successfully."
}`} />
            </section>

            <div className="my-10 border-t border-white/[0.04]" />

            {/* POST /v1/acp/guard */}
            <section>
              <H id="ep-guard-acp" level={1}>POST /v1/acp/guard</H>
              <p className="text-gray-400 leading-relaxed mb-4">
                Pre-execution safety check. Runs real-time checks (RPC health, bridge exploits, stablecoin pegs, DEX liquidity) and returns a binary verdict with evidence. ACP variant — publicly accessible, up to 3 checks per request.
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {[
                  { label: 'No auth required', color: 'text-emerald-400 border-emerald-500/25 bg-emerald-500/[0.05]' },
                  { label: 'x402 supported', color: 'text-cyan-400 border-cyan-500/25 bg-cyan-500/[0.05]' },
                  { label: '$0.01 / request', color: 'text-blue-400 border-blue-500/25 bg-blue-500/[0.05]' },
                  { label: '~180ms avg', color: 'text-gray-400 border-white/[0.10] bg-white/[0.02]' },
                ].map((b) => (
                  <span key={b.label} className={`text-xs font-mono px-3 py-1 rounded-full border ${b.color}`}>{b.label}</span>
                ))}
              </div>

              <H id="guard-acp-params" level={2}>Request body</H>
              <ParamTable params={[
                { name: 'action',      type: 'string', required: true,  desc: 'Agent action type.', default: undefined },
                { name: 'chain',       type: 'string', required: true,  desc: 'Target chain: base, ethereum, arbitrum, optimism.' },
                { name: 'amount_usd',  type: 'number',                  desc: 'USD value of the operation. Enables amount-based risk checks.' },
                { name: 'asset',       type: 'string',                  desc: 'Asset symbol (e.g. USDC, ETH, WBTC).' },
                { name: 'strict_mode', type: 'boolean', default: 'false', desc: 'Block on warnings in addition to hard failures.' },
                { name: 'context',     type: 'object',                  desc: 'Arbitrary metadata passed to checks.' },
              ]} />

              <H id="guard-acp-unpaid" level={2}>Unpaid request — HTTP 402</H>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                When calling without an API key and without an x402 payment header, the server returns HTTP 402 with a payment-required challenge.
              </p>
              <RequestCard
                method="POST"
                path={`${API_BASE_URL}${ENDPOINTS.ACP_GUARD}`}
                description="no auth header"
                headers={{ 'Content-Type': 'application/json' }}
                body={`{
  "action":     "bridge",
  "chain":      "base",
  "amount_usd": 50000
}`}
              />
              <ResponseCard
                status={402}
                statusText="Payment Required"
                label="x402 prompt"
                body={`{
  "error": "payment_required",
  "payment": {
    "protocol":   "x402",
    "version":    "1",
    "token":      "USDC",
    "network":    "base",
    "amount":     "0.010000",
    "recipient":  "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    "nonce":      "a1b2c3d4e5f6789012",
    "expires_at": "2026-05-20T10:05:00Z"
  },
  "message": "Payment required. Pay $0.01 USDC on Base via x402 and retry."
}`}
              />

              <H id="guard-acp-paid" level={2}>Paid x402 request — HTTP 200</H>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                After paying, retry with the <code className="text-cyan-300 font-mono bg-cyan-500/10 px-1 py-0.5 rounded text-xs">x402 payment header</code>. The server verifies the payment and returns the full response.
              </p>
              <RequestCard
                method="POST"
                path={`${API_BASE_URL}${ENDPOINTS.ACP_GUARD}`}
                description="x402 payment header attached"
                headers={{
                  'Content-Type': 'application/json',
                  'x402-payment': '<x402 payment header>',
                }}
                body={`{
  "action":     "bridge",
  "chain":      "base",
  "amount_usd": 50000
}`}
              />
              <ResponseCard
                status={200}
                statusText="OK"
                label="guard verdict"
                body={`{
  "verdict":    "block",
  "confidence": 0.92,
  "risk":       "high",
  "expires_in": 300,
  "decision": {
    "action":      "block",
    "reason":      "Non-transient check failed in strict mode.",
    "constraints": {}
  },
  "evidence": [
    {
      "type":               "rpc",
      "rpc_url":            "https://mainnet.base.org/",
      "method_name":        "eth_blockNumber",
      "params":             [],
      "expect_hex_result":  true,
      "status":             200,
      "latency_ms":         121,
      "ok":                 true,
      "transient":          false,
      "error":              null,
      "result":             "0x2c0a62d"
    }
  ],
  "failure_modes": []
}`}
              />

              <H id="guard-acp-proceed" level={2}>Proceed verdict example</H>
              <ResponseCard
                status={200}
                statusText="OK"
                label="verdict: proceed"
                body={`{
  "verdict":    "proceed",
  "confidence": 0.95,
  "risk":       "low",
  "expires_in": 300,
  "decision": {
    "action":      "execute_swap",
    "reason":      "All safety checks passed successfully.",
    "constraints": {}
  },
  "evidence": [
    {
      "type":        "rpc",
      "rpc_url":     "https://ethereum-rpc.publicnode.com/",
      "method_name": "eth_blockNumber",
      "status":      200,
      "latency_ms":  32,
      "ok":          true,
      "transient":   false,
      "result":      "0x17f62bc"
    },
    {
      "type":              "stablecoin_depeg",
      "asset_id":          "usd-coin",
      "quote":             "usd",
      "warn_deviation_pct": 0.005,
      "block_deviation_pct": 0.02,
      "status":            200,
      "latency_ms":        57,
      "ok":                true,
      "price":             0.999762,
      "deviation_pct":     0.000238,
      "severity":          "safe"
    }
  ],
  "failure_modes": []
}`}
              />
            </section>

            <div className="my-10 border-t border-white/[0.04]" />

            {/* POST /v1/acp/decide */}
            <section>
              <H id="ep-decide-acp" level={1}>POST /v1/acp/decide</H>
              <p className="text-gray-400 leading-relaxed mb-4">
                Policy-driven decision engine. Provide a <code className="text-blue-300 font-mono bg-blue-500/10 px-1 py-0.5 rounded text-xs">goal</code> and the API returns a structured decision with reasoning chain and failure modes. ACP variant — publicly accessible.
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {[
                  { label: 'No auth required', color: 'text-emerald-400 border-emerald-500/25 bg-emerald-500/[0.05]' },
                  { label: 'x402 supported', color: 'text-cyan-400 border-cyan-500/25 bg-cyan-500/[0.05]' },
                  { label: '$0.01 / request', color: 'text-blue-400 border-blue-500/25 bg-blue-500/[0.05]' },
                  { label: '~240ms avg', color: 'text-gray-400 border-white/[0.10] bg-white/[0.02]' },
                ].map((b) => (
                  <span key={b.label} className={`text-xs font-mono px-3 py-1 rounded-full border ${b.color}`}>{b.label}</span>
                ))}
              </div>

              <H id="decide-acp-params" level={2}>Request body</H>
              <ParamTable params={[
                { name: 'action',  type: 'string', required: true, desc: 'Agent action: swap, transfer, bridge, yield_deposit, generic.' },
                { name: 'goal',    type: 'string', required: true, desc: 'What the agent is trying to achieve. Used for reasoning.' },
                { name: 'asset',   type: 'string',                 desc: 'Asset symbol (e.g. USDC, ETH).' },
                { name: 'chain',   type: 'string',                 desc: 'Target chain identifier.' },
                { name: 'amount',  type: 'number',                 desc: 'Token amount in atomic units.' },
                { name: 'policy',  type: 'string', default: 'balanced', desc: 'Risk policy: conservative, balanced, or aggressive.' },
                { name: 'context', type: 'object',                 desc: 'Arbitrary metadata.' },
              ]} />

              <RequestCard
                method="POST"
                path={`${API_BASE_URL}${ENDPOINTS.ACP_DECIDE}`}
                headers={{ 'Content-Type': 'application/json' }}
                body={`{
  "action": "swap",
  "goal":   "maximize yield on idle USDC",
  "asset":  "USDC",
  "chain":  "ethereum",
  "amount": 100000000,
  "policy": "conservative"
}`}
              />
              <ResponseCard
                status={200}
                statusText="OK"
                label="decide verdict"
                body={`{
  "verdict":    "block",
  "confidence": 0.9,
  "risk":       "high",
  "expires_in": 300,
  "decision": {
    "action":      "halt",
    "reason":      "No evidence provided to support decision.",
    "constraints": {}
  },
  "evidence":      [],
  "failure_modes": ["insufficient evidence", "lack of context"]
}`}
              />
            </section>

            <div className="my-10 border-t border-white/[0.04]" />

            {/* POST /functions/v1/guard */}
            <section>
              <H id="ep-guard-private" level={1}>POST /functions/v1/guard</H>
              <p className="text-gray-400 leading-relaxed mb-4">
                Private guard endpoint. Same semantics as <code className="text-blue-300 font-mono bg-blue-500/10 px-1 py-0.5 rounded text-xs">/v1/acp/guard</code> but requires an API key and supports up to 10 checks per request (vs 3 for the ACP variant).
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {[
                  { label: 'API key required', color: 'text-yellow-400 border-yellow-500/25 bg-yellow-500/[0.05]' },
                  { label: 'Up to 10 checks', color: 'text-emerald-400 border-emerald-500/25 bg-emerald-500/[0.05]' },
                  { label: '$0.01 / request', color: 'text-blue-400 border-blue-500/25 bg-blue-500/[0.05]' },
                ].map((b) => (
                  <span key={b.label} className={`text-xs font-mono px-3 py-1 rounded-full border ${b.color}`}>{b.label}</span>
                ))}
              </div>
              <RequestCard
                method="POST"
                path={`${SUPABASE_FUNCTIONS_URL}/guard`}
                headers={{
                  'Authorization': 'Bearer vp_your_api_key',
                  'Content-Type':  'application/json',
                }}
                body={`{
  "action":     "bridge",
  "chain":      "base",
  "amount_usd": 50000
}`}
              />
              <Callout type="warning">
                Without a valid API key, this endpoint returns <code className="text-red-300 font-mono bg-red-500/10 px-1 py-0.5 rounded text-xs">401 Unauthorized</code>.{' '}
                <Link to="/get-api-key" className="text-yellow-300 underline underline-offset-2 hover:text-yellow-200">Get an API key →</Link>
              </Callout>
            </section>

            <div className="my-12 border-t border-white/[0.05]" />

            {/* ─── RESPONSE SCHEMA ─── */}
            <section>
              <H id="response-schema" level={1}>Response Schema</H>
              <p className="text-gray-400 leading-relaxed mb-5">
                All guard and decide responses share the same top-level shape.
              </p>
              <ParamTable params={[
                { name: 'verdict',      type: 'string', required: true, desc: 'Decision outcome: proceed, wait, or block.' },
                { name: 'confidence',   type: 'number', required: true, desc: 'Model confidence in the verdict, 0–1.' },
                { name: 'risk',         type: 'string', required: true, desc: 'Risk level: low, medium, or high.' },
                { name: 'expires_in',   type: 'number', required: true, desc: 'Seconds this verdict is valid for. Re-call after expiry.' },
                { name: 'decision',     type: 'object', required: true, desc: 'Structured decision with action, reason, and constraints.' },
                { name: 'evidence',     type: 'array',  required: true, desc: 'Array of raw check results. Each entry has type, status, ok, latency_ms, and type-specific fields.' },
                { name: 'failure_modes', type: 'array', required: true, desc: 'Human-readable list of reasons the verdict may be unreliable.' },
              ]} />

              <H id="evidence-object" level={2}>Evidence object</H>
              <ParamTable params={[
                { name: 'type',       type: 'string',  required: true, desc: 'Check type: rpc, stablecoin_depeg, bridge_exploit_monitor, rug_pull_risk, dex_price, price, http, tx.' },
                { name: 'status',     type: 'number',  required: true, desc: 'HTTP status returned by the check source.' },
                { name: 'latency_ms', type: 'number',  required: true, desc: 'Time the check took in milliseconds.' },
                { name: 'ok',         type: 'boolean', required: true, desc: 'Whether the check passed.' },
                { name: 'transient',  type: 'boolean', required: true, desc: 'If true, the failure may resolve on retry (e.g. network timeout).' },
                { name: 'error',      type: 'string',                  desc: 'Error message if the check failed.' },
              ]} />
            </section>

            <div className="my-12 border-t border-white/[0.05]" />

            {/* ─── CHECK TYPES ─── */}
            <section>
              <H id="checks-reference" level={1}>Check Types</H>
              <p className="text-gray-400 leading-relaxed mb-5">
                Each entry in the <code className="text-blue-300 font-mono bg-blue-500/10 px-1 py-0.5 rounded text-xs">evidence</code> array represents one check run.
              </p>
              <div className="rounded-xl border border-white/[0.07] overflow-hidden">
                {[
                  { type: 'rpc',                   desc: 'Calls an RPC endpoint (e.g. eth_blockNumber). Verifies chain liveness and connectivity.' },
                  { type: 'stablecoin_depeg',       desc: 'Checks stablecoin price deviation. Returns price, deviation_pct, and severity.' },
                  { type: 'bridge_exploit_monitor', desc: 'Scans known exploit feeds for active bridge attacks on the target contract.' },
                  { type: 'rug_pull_risk',          desc: 'Evaluates contract source, liquidity lock, and holder concentration.' },
                  { type: 'dex_price',              desc: 'Queries DEX price and liquidity depth. Computes price impact for your trade size.' },
                  { type: 'price',                  desc: 'Fetches spot price from oracle/aggregator. Validates against expected value.' },
                  { type: 'http',                   desc: 'Generic HTTP check against any URL. Returns status code and latency.' },
                  { type: 'tx',                     desc: 'Verifies a transaction hash — receipt status, block confirmation, revert reason.' },
                ].map((c, i, arr) => (
                  <div key={c.type} className={`flex items-start gap-4 px-4 py-3.5 ${i < arr.length - 1 ? 'border-b border-white/[0.04]' : ''} hover:bg-white/[0.01] transition-colors`}>
                    <code className="text-xs font-mono text-blue-300 flex-shrink-0 w-44">{c.type}</code>
                    <p className="text-sm text-gray-500 leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="my-12 border-t border-white/[0.05]" />

            {/* ─── ERROR CODES ─── */}
            <section>
              <H id="error-codes" level={1}>Error Codes</H>
              <div className="rounded-xl border border-white/[0.07] overflow-hidden mb-5">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.07] bg-white/[0.02]">
                      <th className="text-left px-4 py-3 text-xs font-mono text-gray-500">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-mono text-gray-500">error</th>
                      <th className="text-left px-4 py-3 text-xs font-mono text-gray-500 hidden sm:table-cell">Meaning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {[
                      { code: '200', error: '—',                   color: 'text-emerald-400', desc: 'Success. Check verdict field.' },
                      { code: '400', error: 'bad_request',         color: 'text-red-400',     desc: 'Missing or invalid required fields.' },
                      { code: '401', error: 'invalid_api_key',     color: 'text-red-400',     desc: 'Missing or invalid API key.' },
                      { code: '402', error: 'payment_required',    color: 'text-yellow-300',  desc: 'x402 — pay USDC on Base and retry.' },
                      { code: '422', error: 'unprocessable_entity',color: 'text-orange-400',  desc: 'Validation error. Check the detail array in the response.' },
                      { code: '500', error: 'internal_error',      color: 'text-red-400',     desc: 'Server error. Retry once. Contact support if it persists.' },
                    ].map((e) => (
                      <tr key={e.code} className="hover:bg-white/[0.01]">
                        <td className="px-4 py-2.5"><code className={`text-xs font-mono font-bold ${e.color}`}>{e.code}</code></td>
                        <td className="px-4 py-2.5"><code className="text-xs font-mono text-gray-400">{e.error}</code></td>
                        <td className="px-4 py-2.5 text-xs text-gray-500 hidden sm:table-cell">{e.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <H id="error-422" level={2}>422 Validation error</H>
              <ResponseCard
                status={422}
                statusText="Unprocessable Entity"
                label="missing field"
                body={`{
  "detail": [
    {
      "type":  "missing",
      "loc":   ["body", "goal"],
      "msg":   "Field required",
      "input": { "action": "swap", "asset": "USDC" }
    }
  ]
}`}
              />
            </section>

            {/* ── FOOTER NAV ── */}
            <div className="mt-16 pt-8 border-t border-white/[0.05] flex justify-between items-center">
              <div />
              <Link to="/playground" className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium">
                Try it in the Playground <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </main>

          {/* Right rail */}
          <div className="hidden xl:block w-52 flex-shrink-0 py-10">
            <div className="sticky top-24">
              <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-3">On this page</p>
              <OnThisPage activeId={activeId} scrollTo={scrollTo} />
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
