import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Copy, Check, Package, Tag, Globe, Shield, Zap, FileText,
  Terminal, Play, BookOpen, Key, ExternalLink, Download,
  ChevronRight, Hash, Server, CreditCard, Code2, Layers,
  CheckCircle, Network, Lock, ShieldCheck,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { API_BASE_URL, SUPABASE_FUNCTIONS_URL } from '../lib/api';
import { SpecButtons } from '../components/SpecButtons';

// ─── Copy utilities ───────────────────────────────────────────────────────────

function useCopy(text: string) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return { copied, copy };
}

function CopyBtn({ text, label, size = 'sm' }: { text: string; label?: string; size?: 'xs' | 'sm' }) {
  const { copied, copy } = useCopy(text);
  const base = size === 'xs'
    ? 'px-2 py-0.5 text-[10px] gap-1'
    : 'px-2.5 py-1.5 text-xs gap-1.5';
  return (
    <button onClick={copy}
      className={`flex items-center font-mono transition-all rounded hover:bg-white/[0.06] ${base} ${
        copied ? 'text-emerald-400' : 'text-gray-600 hover:text-gray-300'
      }`}>
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied!' : (label ?? 'Copy')}
    </button>
  );
}

// Inline copy field — value + copy button in one row
function CopyField({ value, mono = true }: { value: string; mono?: boolean }) {
  const { copied, copy } = useCopy(value);
  return (
    <div className="flex items-center gap-2 group">
      <span className={`flex-1 text-sm ${mono ? 'font-mono' : ''} text-gray-200 break-all`}>{value}</span>
      <button onClick={copy}
        className={`flex-shrink-0 flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded border transition-all ${
          copied
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
            : 'border-white/[0.08] bg-white/[0.03] text-gray-600 hover:text-gray-300 hover:border-white/[0.14]'
        }`}>
        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ id, icon: Icon, label, children }: {
  id: string; icon: React.ElementType; label: string; children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-blue-400" />
        </div>
        <h2 className="text-lg font-bold text-white">{label}</h2>
        <div className="flex-1 h-px bg-white/[0.05]" />
        <a href={`#${id}`}
          className="text-[10px] font-mono text-gray-700 hover:text-gray-500 transition-colors">
          #{id}
        </a>
      </div>
      {children}
    </section>
  );
}

// ─── Card row — label + copyable value ───────────────────────────────────────

function DataRow({ label, value, mono = false, badge, badgeColor = '' }: {
  label: string; value: string; mono?: boolean; badge?: string; badgeColor?: string;
}) {
  return (
    <div className="flex items-start gap-4 px-5 py-3.5 hover:bg-white/[0.015] transition-colors group">
      <span className="text-[11px] font-mono text-gray-600 uppercase tracking-wider w-40 flex-shrink-0 pt-0.5">{label}</span>
      <div className="flex-1 min-w-0">
        <CopyField value={value} mono={mono} />
      </div>
      {badge && (
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border flex-shrink-0 ${badgeColor}`}>{badge}</span>
      )}
    </div>
  );
}

// ─── Code block ──────────────────────────────────────────────────────────────

function CodeBlock({ code, filename, label, labelColor = 'text-gray-600' }: {
  code: string; filename?: string; label?: string; labelColor?: string;
}) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/[0.07] bg-[#07080e]">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.05] bg-[#0a0b12]">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ff5f57]/55" />
            <span className="w-2 h-2 rounded-full bg-[#febc2e]/55" />
            <span className="w-2 h-2 rounded-full bg-[#28c840]/55" />
          </div>
          {filename && <span className="text-[11px] font-mono text-gray-600">{filename}</span>}
          {label && <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border border-white/[0.06] ${labelColor}`}>{label}</span>}
        </div>
        <CopyBtn text={code} />
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-xs font-mono leading-[1.7] text-gray-300 whitespace-pre">{code}</pre>
      </div>
    </div>
  );
}

// ─── Badge pill ───────────────────────────────────────────────────────────────

function Pill({ label, color }: { label: string; color: string }) {
  return <span className={`text-[11px] font-mono px-3 py-1 rounded-full border ${color}`}>{label}</span>;
}

// ─── Sidebar nav ──────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: 'listing',     icon: Package,    label: 'Listing Metadata' },
  { id: 'descriptions', icon: FileText,  label: 'Descriptions' },
  { id: 'api',         icon: Globe,      label: 'API Details' },
  { id: 'pricing',     icon: CreditCard, label: 'Pricing' },
  { id: 'auth',        icon: Shield,     label: 'Authentication' },
  { id: 'endpoints',   icon: Terminal,   label: 'Endpoints' },
  { id: 'formats',     icon: Code2,      label: 'Formats & Specs' },
  { id: 'links',       icon: ExternalLink, label: 'Links' },
  { id: 'openapi',     icon: FileText,   label: 'OpenAPI Snippet' },
  { id: 'logo',        icon: Layers,     label: 'Brand Assets' },
  { id: 'evaluator',   icon: ShieldCheck, label: 'Neutral Evaluator — Live' },
];

// ─── Data ─────────────────────────────────────────────────────────────────────

const BASE_URL = API_BASE_URL;
const PRIVATE_BASE_URL = SUPABASE_FUNCTIONS_URL;

const OPENAPI_SNIPPET = `openapi: "3.1.0"
info:
  title: "VerifyProceed — Decision + Verification API"
  description: "Verification infrastructure for AI agents."
  version: "1.0.0"
  contact:
    name: "VerifyProceed"
    url: "https://verifyproceed.com"
servers:
  - url: "${BASE_URL}"
    description: "Render — public compute (health, capabilities, agents, acp/*)"
  - url: "${PRIVATE_BASE_URL}"
    description: "Supabase — key-authenticated (api-key-signup, guard)"
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      description: "vp_ key — Authorization: Bearer vp_xxx"
    apiKeyHeader:
      type: apiKey
      in: header
      name: X-API-Key
      description: "vp_ key — X-API-Key: vp_xxx"
    x402:
      type: apiKey
      in: header
      name: x402-Payment
      description: "$0.01 USDC on Base — no API key required"
paths:
  /health:
    get:
      summary: "Liveness check"
      security: []
  /v1/capabilities:
    get:
      summary: "Capability manifest"
      security: []
  /v1/agents:
    get:
      summary: "List agents"
      security: []
  /v1/acp/guard:
    post:
      summary: "ACP pre-execution safety check ($0.01)"
      security:
        - bearerAuth: []
        - apiKeyHeader: []
        - x402: []
  /v1/acp/decide:
    post:
      summary: "Policy-driven decision ($0.01)"
      security:
        - bearerAuth: []
        - apiKeyHeader: []
        - x402: []
  /api-key-signup:
    post:
      summary: "Issue vp_ API key (Supabase server)"
      security: []
  /guard:
    post:
      summary: "Pre-execution safety check, private ($0.01, Supabase server)"
      security:
        - bearerAuth: []
        - apiKeyHeader: []`;

const CURL_HEALTH = `curl ${BASE_URL}/health`;
const CURL_GUARD = `# Bearer token
curl -X POST ${PRIVATE_BASE_URL}/guard \\
  -H "Authorization: Bearer $VP_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"action":"bridge","chain":"base","amount_usd":50000}'

# Alternative: X-API-Key header
curl -X POST ${PRIVATE_BASE_URL}/guard \\
  -H "X-API-Key: $VP_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"action":"bridge","chain":"base","amount_usd":50000}'`;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MarketplaceKitPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  // Copy-all: serialize entire kit as JSON
  const kitJson = JSON.stringify({
    product_name: 'VerifyProceed',
    category: 'AI Infrastructure',
    subcategory: 'Verification API',
    short_description: 'Verification infrastructure for AI agents.',
    long_description: 'VerifyProceed verifies autonomous actions before execution through policy enforcement, risk validation and execution verification.',
    public_api_url: BASE_URL,
    private_api_url: PRIVATE_BASE_URL,
    pricing: '$0.01 USDC per verified call',
    authentication: 'API Key (Bearer or X-API-Key) · x402 USDC on Base',
    no_sdk_required: true,
    network: 'Base',
    formats: ['REST', 'JSON'],
    links: {
      docs: 'https://verifyproceed.com/docs',
      playground: 'https://verifyproceed.com/playground',
      api_reference: 'https://verifyproceed.com/api-reference',
      quickstart: 'https://verifyproceed.com/docs/quickstart',
    },
  }, null, 2);

  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <div className="relative border-b border-white/[0.06] pt-16">
        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/[0.05] rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="max-w-2xl">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="section-label mb-3">
                <Package className="w-3.5 h-3.5" /> Marketplace Kit
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
                className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
                Everything for your<br />
                <span className="text-gradient-blue">marketplace listing.</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}
                className="text-gray-400 text-base leading-relaxed">
                All product metadata, descriptions, pricing, authentication details, endpoint references, and assets — formatted and ready to paste into any API marketplace.
              </motion.p>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.17 }}
                className="flex flex-wrap gap-2 mt-5">
                {[
                  { label: 'RapidAPI ready',        c: 'text-blue-400 border-blue-500/25 bg-blue-500/[0.06]' },
                  { label: 'AWS Marketplace',       c: 'text-orange-400 border-orange-500/25 bg-orange-500/[0.06]' },
                  { label: 'OpenAPI snippet',       c: 'text-emerald-400 border-emerald-500/25 bg-emerald-500/[0.06]' },
                  { label: 'All fields copyable',   c: 'text-gray-400 border-white/[0.12] bg-white/[0.03]' },
                ].map((b) => (
                  <Pill key={b.label} label={b.label} color={b.c} />
                ))}
              </motion.div>
            </div>

            {/* Copy-all JSON */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="flex-shrink-0 w-full sm:w-72">
              <div className="glass-card rounded-2xl overflow-hidden border border-white/[0.08]">
                <div className="px-5 py-4 border-b border-white/[0.06] bg-white/[0.01]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Download className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-sm font-semibold text-white">Export Kit</span>
                    </div>
                    <CopyBtn text={kitJson} label="Copy JSON" />
                  </div>
                  <p className="text-[11px] text-gray-600 mt-1">All fields as structured JSON</p>
                </div>
                <div className="px-5 py-3 max-h-48 overflow-y-auto">
                  <pre className="text-[10px] font-mono text-gray-600 whitespace-pre leading-relaxed">{kitJson}</pre>
                </div>
              </div>
            </motion.div>

            {/* API spec downloads */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.26 }}>
              <p className="text-[10px] font-mono text-gray-700 uppercase tracking-widest mb-2">API Specs</p>
              <SpecButtons />
            </motion.div>
          </div>

          {/* Section quick-jump */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}
            className="mt-8 flex flex-wrap gap-2">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <a key={s.id} href={`#${s.id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-card hover:border-white/15 text-xs text-gray-500 hover:text-gray-200 transition-all">
                  <Icon className="w-3 h-3" />{s.label}
                </a>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* ── LAYOUT ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-10">

          {/* ── STICKY SIDEBAR ── */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-8 space-y-0.5">
              <p className="text-[10px] font-mono text-gray-700 uppercase tracking-widest px-3 mb-3">Sections</p>
              {SECTIONS.map((s) => {
                const Icon = s.icon;
                return (
                  <a key={s.id} href={`#${s.id}`}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-gray-600 hover:text-gray-200 hover:bg-white/[0.02] transition-all group">
                    <Icon className="w-3 h-3 group-hover:text-blue-400 transition-colors" />{s.label}
                  </a>
                );
              })}
              <div className="border-t border-white/[0.05] pt-3 mt-3">
                <p className="text-[10px] font-mono text-gray-700 uppercase tracking-widest px-3 mb-2">Developer</p>
                <Link to="/api-reference" className="flex items-center gap-2 px-3 py-2 text-xs text-gray-600 hover:text-gray-300 transition-colors">
                  <BookOpen className="w-3 h-3" /> API Reference
                </Link>
                <Link to="/playground" className="flex items-center gap-2 px-3 py-2 text-xs text-gray-600 hover:text-gray-300 transition-colors">
                  <Play className="w-3 h-3" /> Playground
                </Link>
                <Link to="/docs/quickstart" className="flex items-center gap-2 px-3 py-2 text-xs text-gray-600 hover:text-gray-300 transition-colors">
                  <Terminal className="w-3 h-3" /> Quickstart
                </Link>
              </div>
            </div>
          </aside>

          {/* ── CONTENT ── */}
          <div ref={pageRef} className="flex-1 min-w-0 space-y-14">

            {/* ─── LISTING METADATA ─── */}
            <Section id="listing" icon={Package} label="Listing Metadata">
              <div className="rounded-2xl border border-white/[0.07] overflow-hidden bg-[#07080e] divide-y divide-white/[0.04]">
                <DataRow label="Product Name"  value="VerifyProceed" />
                <DataRow label="Category"      value="AI Infrastructure" />
                <DataRow label="Subcategory"   value="Verification API" />
                <DataRow label="Provider"      value="VerifyProceed" />
                <DataRow label="Version"       value="1.0.0" mono />
                <DataRow label="Status"        value="Live"
                  badge="live" badgeColor="text-emerald-400 border-emerald-500/30 bg-emerald-500/[0.07]" />
                <div className="px-5 py-3.5">
                  <div className="flex items-start gap-4">
                    <span className="text-[11px] font-mono text-gray-600 uppercase tracking-wider w-40 flex-shrink-0 pt-1">Tags</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['AI agent', 'Verification', 'DeFi', 'Web3', 'x402', 'Base', 'Guard', 'Risk management', 'Autonomous agents'].map((tag) => (
                        <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/[0.08] text-gray-500 bg-white/[0.02]">{tag}</span>
                      ))}
                    </div>
                    <CopyBtn text="AI agent, Verification, DeFi, Web3, x402, Base, Guard, Risk management, Autonomous agents" size="xs" label="Copy all" />
                  </div>
                </div>
              </div>
            </Section>

            {/* ─── DESCRIPTIONS ─── */}
            <Section id="descriptions" icon={FileText} label="Descriptions">
              <div className="space-y-4">
                {/* Short */}
                <div className="rounded-2xl border border-white/[0.07] overflow-hidden bg-[#07080e]">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.05] bg-white/[0.01]">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wider">Short Description</span>
                      <span className="text-[10px] font-mono text-gray-700">max 160 chars</span>
                    </div>
                    <CopyBtn text="Verification infrastructure for AI agents." />
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-sm text-gray-200 leading-relaxed">Verification infrastructure for AI agents.</p>
                    <p className="text-[10px] font-mono text-gray-700 mt-2">42 characters</p>
                  </div>
                </div>

                {/* Long */}
                <div className="rounded-2xl border border-white/[0.07] overflow-hidden bg-[#07080e]">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.05] bg-white/[0.01]">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wider">Long Description</span>
                      <span className="text-[10px] font-mono text-gray-700">full listing copy</span>
                    </div>
                    <CopyBtn text="VerifyProceed verifies autonomous actions before execution through policy enforcement, risk validation and execution verification." />
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-sm text-gray-200 leading-relaxed">
                      VerifyProceed verifies autonomous actions before execution through policy enforcement, risk validation and execution verification.
                    </p>
                    <p className="text-[10px] font-mono text-gray-700 mt-2">130 characters</p>
                  </div>
                </div>

                {/* Extended */}
                <div className="rounded-2xl border border-white/[0.07] overflow-hidden bg-[#07080e]">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.05] bg-white/[0.01]">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wider">Extended Description</span>
                      <span className="text-[10px] font-mono text-gray-700">product page / README</span>
                    </div>
                    <CopyBtn text={`VerifyProceed is verification infrastructure for autonomous AI agents. Before any on-chain action executes — a swap, bridge, transfer, or yield deposit — your agent calls the Guard API to verify that conditions are safe.\n\nThe API runs a suite of real-time checks: RPC health, stablecoin depeg detection, bridge exploit monitoring, DEX liquidity validation, and rug-pull risk scoring. Each call returns a deterministic verdict: proceed, block, or warn.\n\nPaid calls cost $0.01 USDC per request via x402 on Base, or use a vp_ API key for traditional access. Free tier includes 100 requests/month.\n\nBuilt for: DeFi agents, autonomous trading bots, cross-chain bridges, yield optimizers, and any system that executes value-bearing transactions autonomously.`} />
                  </div>
                  <div className="px-5 py-5 space-y-3">
                    {[
                      'VerifyProceed is verification infrastructure for autonomous AI agents. Before any on-chain action executes — a swap, bridge, transfer, or yield deposit — your agent calls the Guard API to verify that conditions are safe.',
                      'The API runs a suite of real-time checks: RPC health, stablecoin depeg detection, bridge exploit monitoring, DEX liquidity validation, and rug-pull risk scoring. Each call returns a deterministic verdict: proceed, block, or warn.',
                      'Paid calls cost $0.01 USDC per request via x402 on Base, or use a vp_ API key for traditional access. Free tier includes 100 requests/month.',
                      'Built for: DeFi agents, autonomous trading bots, cross-chain bridges, yield optimizers, and any system that executes value-bearing transactions autonomously.',
                    ].map((para, i) => (
                      <p key={i} className="text-sm text-gray-300 leading-relaxed">{para}</p>
                    ))}
                  </div>
                </div>
              </div>
            </Section>

            {/* ─── API DETAILS ─── */}
            <Section id="api" icon={Globe} label="API Details">
              <div className="rounded-2xl border border-white/[0.07] overflow-hidden bg-[#07080e] divide-y divide-white/[0.04]">
                <DataRow label="Public Base URL"  value={BASE_URL} mono badge="Render" badgeColor="text-gray-400 border-white/[0.10] bg-white/[0.02]" />
                <DataRow label="Private Base URL" value={PRIVATE_BASE_URL} mono badge="Supabase" badgeColor="text-emerald-400 border-emerald-500/30 bg-emerald-500/[0.04]" />
                <DataRow label="Protocol"      value="HTTPS" />
                <DataRow label="Style"         value="REST" />
                <DataRow label="Response Type" value="JSON" />
                <DataRow label="No SDK"        value="HTTP only — curl, fetch, any HTTP client" />
                <DataRow label="Network"       value="Base (Coinbase L2)" />
                <DataRow label="TLS"           value="TLS 1.3" />
                <DataRow label="Latency"       value="~180ms (p50)" />
                <DataRow label="Region"        value="Multi-region, global edge" />
              </div>

              <div className="mt-4">
                <p className="text-[11px] font-mono text-gray-600 uppercase tracking-wider mb-3">Quick connectivity test</p>
                <CodeBlock code={CURL_HEALTH} filename="terminal" label="GET /health · public" labelColor="text-emerald-400" />
              </div>
            </Section>

            {/* ─── PRICING ─── */}
            <Section id="pricing" icon={CreditCard} label="Pricing">
              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                {[
                  {
                    tier: 'Free Tier',
                    price: '$0',
                    unit: 'per month',
                    detail: '100 requests included — no credit card',
                    color: 'border-emerald-500/25 bg-emerald-500/[0.04]',
                    badge: 'text-emerald-400 border-emerald-500/30',
                    highlight: false,
                  },
                  {
                    tier: 'Pay-per-call',
                    price: '$0.01',
                    unit: 'per verified call',
                    detail: 'USDC on Base via x402 or API key',
                    color: 'border-blue-500/30 bg-blue-500/[0.05]',
                    badge: 'text-blue-400 border-blue-500/30',
                    highlight: true,
                  },
                ].map((t) => (
                  <div key={t.tier} className={`rounded-xl border p-5 ${t.color} ${t.highlight ? 'ring-1 ring-blue-500/20' : ''}`}>
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-xs font-mono text-gray-500">{t.tier}</p>
                      {t.highlight && <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${t.badge}`}>most used</span>}
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">{t.price}</p>
                    <p className="text-xs text-gray-500">{t.unit}</p>
                    <p className="text-[11px] text-gray-600 mt-3 leading-relaxed">{t.detail}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-white/[0.07] overflow-hidden bg-[#07080e] divide-y divide-white/[0.04]">
                <DataRow label="Free Tier"       value="100 requests / month" />
                <DataRow label="All Paid Calls"  value="$0.01 USDC per call" mono />
                <DataRow label="Currency"        value="USDC" />
                <DataRow label="Payment"         value="Base · x402 protocol or API key" />
                <DataRow label="Billing model"   value="Pay-per-call · no subscription required" />
              </div>
            </Section>

            {/* ─── AUTHENTICATION ─── */}
            <Section id="auth" icon={Shield} label="Authentication">
              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                {[
                  {
                    method: 'API Key — Bearer',
                    icon: Key,
                    color: 'border-yellow-500/25 bg-yellow-500/[0.04]',
                    iconColor: 'text-yellow-400',
                    desc: 'Standard Bearer token. Add to Authorization header. Free tier: 100 req/month.',
                    badge: 'Easiest',
                    badgeColor: 'text-yellow-400 border-yellow-500/30',
                    example: 'Authorization: Bearer vp_xxxx...',
                  },
                  {
                    method: 'API Key — X-API-Key',
                    icon: Lock,
                    color: 'border-blue-500/25 bg-blue-500/[0.04]',
                    iconColor: 'text-blue-400',
                    desc: 'Alternative header for environments that cannot set Authorization. Same key, same tier.',
                    badge: 'Alternative',
                    badgeColor: 'text-blue-400 border-blue-500/30',
                    example: 'X-API-Key: vp_xxxx...',
                  },
                  {
                    method: 'x402 (keyless)',
                    icon: Zap,
                    color: 'border-cyan-500/25 bg-cyan-500/[0.04]',
                    iconColor: 'text-cyan-400',
                    desc: 'Pay $0.01 USDC on Base per call. No API key needed — works on ACP endpoints.',
                    badge: 'Agent-native',
                    badgeColor: 'text-cyan-400 border-cyan-500/30',
                    example: 'x402-Payment: <base64-payment-proof>',
                  },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <div key={m.method} className={`rounded-xl border p-5 space-y-3 ${m.color}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${m.iconColor}`} />
                          <p className="text-sm font-bold text-white">{m.method}</p>
                        </div>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${m.badgeColor}`}>{m.badge}</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{m.desc}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <code className="flex-1 text-[11px] font-mono text-gray-400 bg-black/20 px-2.5 py-1.5 rounded-lg truncate">{m.example}</code>
                        <CopyBtn text={m.example} size="xs" />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-white/[0.07] overflow-hidden bg-[#07080e] divide-y divide-white/[0.04]">
                <DataRow label="Type"               value="API Key (Bearer or X-API-Key) + x402 USDC on Base" />
                <DataRow label="Header (Bearer)"    value="Authorization: Bearer {vp_key}" mono />
                <DataRow label="Header (X-API-Key)" value="X-API-Key: {vp_key}" mono />
                <DataRow label="Header (x402)"      value="x402-Payment: {base64-proof}" mono />
                <DataRow label="Key prefix"         value="vp_" mono />
                <DataRow label="Key signup"         value={`${PRIVATE_BASE_URL}/api-key-signup`} mono />
                <DataRow label="Scope"              value="Global — single key for all endpoints" />
              </div>
            </Section>

            {/* ─── ENDPOINTS ─── */}
            <Section id="endpoints" icon={Terminal} label="Endpoints">
              <div className="rounded-2xl border border-white/[0.07] overflow-hidden bg-[#07080e] divide-y divide-white/[0.04]">
                {[
                  { method: 'GET',  path: '/health',           base: BASE_URL,         auth: 'None',                cost: 'Free',  desc: 'Liveness check — no auth required' },
                  { method: 'GET',  path: '/v1/capabilities',  base: BASE_URL,         auth: 'None',                cost: 'Free',  desc: 'Capability manifest and endpoint discovery' },
                  { method: 'GET',  path: '/v1/agents',        base: BASE_URL,         auth: 'None',                cost: 'Free',  desc: 'List all available agents' },
                  { method: 'POST', path: '/api-key-signup',   base: PRIVATE_BASE_URL, auth: 'None',                cost: 'Free',  desc: 'Self-provision a vp_ API key (Supabase)' },
                  { method: 'POST', path: '/guard',            base: PRIVATE_BASE_URL, auth: 'Bearer / X-API-Key',  cost: '$0.01', desc: 'Private guard — up to 10 checks (Supabase)' },
                  { method: 'POST', path: '/v1/acp/guard',     base: BASE_URL,         auth: 'Bearer / X-API-Key / x402', cost: '$0.01', desc: 'ACP guard — 3 checks, x402 accepted (Render)' },
                  { method: 'POST', path: '/v1/acp/decide',    base: BASE_URL,         auth: 'Bearer / X-API-Key / x402', cost: '$0.01', desc: 'Policy-driven decision (Render)' },
                ].map((ep) => (
                  <div key={ep.path} className="flex flex-wrap items-center gap-3 px-5 py-3.5 hover:bg-white/[0.01] group">
                    <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded border flex-shrink-0 ${
                      ep.method === 'GET'
                        ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/25'
                        : 'text-blue-300 bg-blue-500/10 border-blue-500/25'
                    }`}>{ep.method}</span>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <code className="text-sm font-mono text-gray-200">{ep.path}</code>
                      <CopyBtn text={`${ep.base}${ep.path}`} size="xs" label="Copy URL" />
                    </div>
                    <span className="text-[10px] font-mono text-gray-700 w-32 text-right hidden sm:block">{ep.auth}</span>
                    <span className={`text-[10px] font-mono flex-shrink-0 w-12 text-right ${ep.cost === 'Free' ? 'text-emerald-400' : 'text-blue-400'}`}>{ep.cost}</span>
                    <span className="text-[11px] text-gray-600 w-full sm:w-auto">{ep.desc}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <p className="text-[11px] font-mono text-gray-600 uppercase tracking-wider mb-3">Example — Guard request</p>
                <CodeBlock code={CURL_GUARD} filename="guard.sh" />
              </div>
            </Section>

            {/* ─── FORMATS ─── */}
            <Section id="formats" icon={Code2} label="Formats & Specs">
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                {[
                  {
                    icon: Server,
                    label: 'REST',
                    desc: 'Standard HTTP verbs. GET for reads, POST for actions. No GraphQL, no gRPC.',
                    tags: ['GET', 'POST', 'HTTPS'],
                    color: 'border-blue-500/20 bg-blue-500/[0.03]',
                  },
                  {
                    icon: Code2,
                    label: 'JSON',
                    desc: 'All request and response bodies are application/json. Responses are always valid JSON.',
                    tags: ['application/json', 'UTF-8'],
                    color: 'border-emerald-500/20 bg-emerald-500/[0.03]',
                  },
                  {
                    icon: Lock,
                    label: 'TLS 1.3',
                    desc: 'All traffic encrypted in transit. HTTP redirects to HTTPS. HSTS enabled.',
                    tags: ['TLS 1.3', 'HTTPS only'],
                    color: 'border-yellow-500/20 bg-yellow-500/[0.03]',
                  },
                  {
                    icon: Network,
                    label: 'x402 Protocol',
                    desc: 'Native machine-payment flow via EIP-based USDC transfer on Base mainnet.',
                    tags: ['ERC-20', 'Base', 'USDC'],
                    color: 'border-cyan-500/20 bg-cyan-500/[0.03]',
                  },
                ].map((f) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.label} className={`rounded-xl border p-5 ${f.color}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4 text-gray-400" />
                        <p className="text-sm font-bold text-white">{f.label}</p>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed mb-3">{f.desc}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {f.tags.map((t) => (
                          <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/[0.08] text-gray-600">{t}</span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-white/[0.07] overflow-hidden bg-[#07080e] divide-y divide-white/[0.04]">
                <DataRow label="Formats"       value="REST, JSON" />
                <DataRow label="Content-Type"  value="application/json" mono />
                <DataRow label="Encoding"      value="UTF-8" />
                <DataRow label="No SDK"        value="HTTP only — curl, fetch, any HTTP client" />
                <DataRow label="Versioning"    value="URL path versioning (/v1/...)" />
                <DataRow label="CORS"          value="Enabled — all origins (*)" />
                <DataRow label="Errors"        value="{ error, message } — error field is machine-readable" mono />
              </div>
            </Section>

            {/* ─── LINKS ─── */}
            <Section id="links" icon={ExternalLink} label="Links">
              <div className="rounded-2xl border border-white/[0.07] overflow-hidden bg-[#07080e] divide-y divide-white/[0.04]">
                {[
                  { label: 'Public Base URL',    value: BASE_URL,                              icon: Globe },
                  { label: 'Private Base URL',   value: PRIVATE_BASE_URL,                      icon: Server },
                  { label: 'Documentation',      value: 'https://verifyproceed.com/docs',           icon: BookOpen },
                  { label: 'Quickstart Guide',   value: 'https://verifyproceed.com/docs/quickstart', icon: Terminal },
                  { label: 'API Playground',     value: 'https://verifyproceed.com/playground',     icon: Play },
                  { label: 'API Reference',      value: 'https://verifyproceed.com/api-reference',  icon: Hash },
                  { label: 'Get API Key',        value: 'https://verifyproceed.com/get-api-key',    icon: Key },
                  { label: 'Pricing',            value: 'https://verifyproceed.com/pricing',        icon: CreditCard },
                  { label: 'GitHub',             value: 'https://github.com/verifyproceed',         icon: ExternalLink },
                ].map((l) => {
                  const Icon = l.icon;
                  return (
                    <div key={l.label} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.015] group">
                      <div className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                        <Icon className="w-3.5 h-3.5 text-gray-600" />
                      </div>
                      <span className="text-[11px] font-mono text-gray-600 uppercase tracking-wider w-36 flex-shrink-0">{l.label}</span>
                      <div className="flex-1 min-w-0 flex items-center gap-2">
                        <span className="text-sm font-mono text-blue-300 truncate">{l.value}</span>
                        <CopyBtn text={l.value} size="xs" />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4">
                <p className="text-[11px] font-mono text-gray-600 uppercase tracking-wider mb-3">Download / Import</p>
                <SpecButtons />
              </div>
            </Section>

            {/* ─── OPENAPI SNIPPET ─── */}
            <Section id="openapi" icon={FileText} label="OpenAPI Snippet">
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                Partial OpenAPI 3.1.0 spec for import into API marketplaces, Postman, or Swagger UI. Copy and extend with full request/response schemas from the{' '}
                <Link to="/api-reference" className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors">API Reference</Link>.
              </p>
              <CodeBlock code={OPENAPI_SNIPPET} filename="verifyproceed.openapi.yaml" label="OpenAPI 3.1.0" labelColor="text-blue-400" />
              <div className="flex flex-wrap gap-3 mt-3">
                <CopyBtn text={OPENAPI_SNIPPET} label="Copy YAML" />
                <span className="text-[10px] font-mono text-gray-700 self-center">{OPENAPI_SNIPPET.split('\n').length} lines</span>
              </div>
            </Section>

            {/* ─── BRAND ASSETS ─── */}
            <Section id="logo" icon={Layers} label="Brand Assets">
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Logo preview */}
                <div className="rounded-2xl border border-white/[0.07] overflow-hidden bg-[#07080e]">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.05] bg-white/[0.01]">
                    <span className="text-[11px] font-mono text-gray-600 uppercase tracking-wider">Logo — Dark</span>
                    <CopyBtn text="VerifyProceed" label="Copy name" size="xs" />
                  </div>
                  <div className="flex items-center justify-center p-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xl font-bold text-white tracking-tight">VerifyProceed</span>
                    </div>
                  </div>
                </div>

                {/* Colors + typography */}
                <div className="rounded-2xl border border-white/[0.07] overflow-hidden bg-[#07080e] divide-y divide-white/[0.04]">
                  <div className="px-5 py-3 bg-white/[0.01]">
                    <span className="text-[11px] font-mono text-gray-600 uppercase tracking-wider">Brand Colors</span>
                  </div>
                  {[
                    { name: 'Primary Blue',  hex: '#2563EB', bg: 'bg-blue-600',    desc: 'Buttons, links, accents' },
                    { name: 'Dark BG',       hex: '#050508', bg: 'bg-[#050508] border border-white/[0.1]', desc: 'Page background' },
                    { name: 'Emerald',       hex: '#10B981', bg: 'bg-emerald-500', desc: 'Success states, proceed' },
                    { name: 'Text Primary',  hex: '#E2E8F0', bg: 'bg-slate-200',   desc: 'Body text' },
                  ].map((c) => (
                    <div key={c.name} className="flex items-center gap-3 px-5 py-3">
                      <div className={`w-6 h-6 rounded-md flex-shrink-0 ${c.bg}`} />
                      <span className="text-xs text-gray-400 flex-1">{c.name}</span>
                      <div className="flex items-center gap-2">
                        <code className="text-[11px] font-mono text-gray-500">{c.hex}</code>
                        <CopyBtn text={c.hex} size="xs" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/[0.07] overflow-hidden bg-[#07080e] divide-y divide-white/[0.04]">
                <DataRow label="Brand Name"   value="VerifyProceed" />
                <DataRow label="Tagline"      value="Verification infrastructure for AI agents." />
                <DataRow label="Primary Font" value="Inter" />
                <DataRow label="Mono Font"    value="JetBrains Mono" mono />
                <DataRow label="Icon"         value="Shield (Lucide React)" />
                <DataRow label="Primary Color" value="#2563EB" mono />
              </div>
            </Section>

            {/* ─── NEUTRAL EVALUATOR ─── */}
            <Section id="evaluator" icon={ShieldCheck} label="Neutral Evaluator — Live">
              <div className="rounded-2xl border border-white/[0.07] bg-[#07080e] p-6">
                <p className="text-sm text-gray-300 leading-relaxed mb-3">
                  VerifyProceed rules on other agents' ACP job deliverables before payment releases, using the same guard/decide engine.
                  This makes VerifyProceed a trust-minimized third party for agent-to-agent work — no manual review, no escrow disputes.
                </p>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Pill label="Verified on Base mainnet — Job #72702" color="text-emerald-400 border-emerald-500/25 bg-emerald-500/[0.06]" />
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-3.5">
                  <DataRow label="Evaluator Wallet" value="0x5a37a8ae00c884a864253dde3fe11f68364fcdf1" mono />
                </div>
              </div>
            </Section>

            {/* ─── FOOTER CTA ─── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-blue-500/20 bg-blue-500/[0.04] p-8 text-center"
            >
              <CheckCircle className="w-8 h-8 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Ready to integrate?</h3>
              <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
                Free tier includes 100 requests per month. No credit card required. Start verifying agent actions in under 5 minutes.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link to="/get-api-key"
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-all hover:shadow-blue-glow">
                  <Key className="w-4 h-4" /> Get Free API Key
                </Link>
                <Link to="/docs/quickstart"
                  className="flex items-center gap-2 px-6 py-3 glass-card hover:border-white/15 text-gray-300 hover:text-white font-semibold rounded-xl text-sm transition-all">
                  <Terminal className="w-4 h-4" /> Quickstart Guide
                </Link>
                <Link to="/api-reference"
                  className="flex items-center gap-2 px-6 py-3 glass-card hover:border-white/15 text-gray-300 hover:text-white font-semibold rounded-xl text-sm transition-all">
                  <BookOpen className="w-4 h-4" /> API Reference <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
