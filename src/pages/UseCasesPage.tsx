import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  TrendingUp, Wallet, Zap, Cpu, CreditCard, ArrowLeftRight,
  ShieldAlert, Lock, CheckCircle, Play, BookOpen, Terminal,
  ChevronRight, ArrowRight, Copy, Check,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// ─── Types ────────────────────────────────────────────────────────────────────

interface UseCase {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  color: string;
  border: string;
  bg: string;
  tag: string;
  problem: string;
  solution: string;
  request: string;
  response: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const USE_CASES: UseCase[] = [
  {
    id: 'trading-bots',
    icon: TrendingUp,
    title: 'AI Trading Bots',
    subtitle: 'Verify trades before execution.',
    color: 'text-blue-400',
    border: 'border-blue-500/25',
    bg: 'bg-blue-500/[0.07]',
    tag: 'POST /v1/acp/guard',
    problem: 'Trading bots execute swaps and bridge transactions with no pre-execution safety check. Bridge exploits, DEX manipulation, and stablecoin depegs cause immediate, irreversible losses.',
    solution: 'Call POST /v1/acp/guard before each trade. The API runs bridge exploit monitor, price deviation, RPC health, and liquidity checks in parallel and returns a binary verdict in under 300ms.',
    request: `POST /v1/acp/guard
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "action": "swap",
  "chain": "base",
  "asset": "USDC",
  "amount_usd": 25000,
  "strict_mode": true
}`,
    response: `HTTP/1.1 200 OK

{
  "verdict": "proceed",
  "confidence": 0.96,
  "risk": "low",
  "checks": {
    "bridge_exploit_monitor": "pass",
    "price_deviation": "pass",
    "dex_liquidity": "pass",
    "rpc_health": "pass"
  },
  "latency_ms": 183
}`,
  },
  {
    id: 'wallet-agents',
    icon: Wallet,
    title: 'Wallet Agents',
    subtitle: 'Validate transfers and payments.',
    color: 'text-cyan-400',
    border: 'border-cyan-500/25',
    bg: 'bg-cyan-500/[0.07]',
    tag: 'POST /v1/acp/guard',
    problem: 'Agent-controlled wallets sign and broadcast transactions autonomously. Without a guard layer, a single misconfigured policy or compromised RPC can drain the wallet.',
    solution: 'Gate every signing action through POST /v1/acp/guard. If the verdict is block, the wallet agent does not sign. Confidence score and failure mode analysis included in the JSON response.',
    request: `POST /v1/acp/guard
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "action": "transfer",
  "chain": "base",
  "asset": "USDC",
  "amount_usd": 5000,
  "to": "0xRecipient..."
}`,
    response: `HTTP/1.1 200 OK

{
  "verdict": "block",
  "confidence": 0.91,
  "risk": "high",
  "reason": "Recipient address flagged: rug-pull pattern detected.",
  "checks": {
    "address_risk": "fail",
    "rpc_health": "pass",
    "price_deviation": "pass"
  },
  "latency_ms": 201
}`,
  },
  {
    id: 'defi-automation',
    icon: Zap,
    title: 'DeFi Automation',
    subtitle: 'Check swaps, bridges, and vault actions.',
    color: 'text-emerald-400',
    border: 'border-emerald-500/25',
    bg: 'bg-emerald-500/[0.07]',
    tag: 'POST /v1/acp/guard',
    problem: 'Yield optimizers, liquidation bots, and keeper bots operate in adversarial on-chain environments. A single bad block — exploit, depeg, or manipulated price feed — can cause catastrophic losses.',
    solution: 'Run a guard call before every vault deposit, bridge, or liquidation trigger. The API evaluates live on-chain state across Base, Ethereum, and Arbitrum and returns a structured risk verdict.',
    request: `POST /v1/acp/guard
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "action": "bridge",
  "chain": "base",
  "destination_chain": "ethereum",
  "asset": "USDC",
  "amount_usd": 100000
}`,
    response: `HTTP/1.1 200 OK

{
  "verdict": "proceed",
  "confidence": 0.93,
  "risk": "low",
  "checks": {
    "bridge_exploit_monitor": "pass",
    "stablecoin_depeg": "pass",
    "dex_liquidity": "pass",
    "rpc_health": "pass"
  },
  "latency_ms": 227
}`,
  },
  {
    id: 'base-mcp',
    icon: Cpu,
    title: 'Base MCP',
    subtitle: 'Add verification before agent actions.',
    color: 'text-sky-400',
    border: 'border-sky-500/25',
    bg: 'bg-sky-500/[0.07]',
    tag: 'POST /v1/acp/guard',
    problem: 'Model Context Protocol tools trigger external actions — on-chain writes, API calls, asset transfers — with no verification gate. A single bad instruction from an LLM can cause irreversible side effects.',
    solution: 'Wire POST /v1/acp/guard as a pre-execution hook in your MCP tool. If verdict is block, the tool refuses to execute. Maps directly to the ACP pre-execution safety hook — no adapter needed.',
    request: `POST /v1/acp/guard
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "action": "execute_tool",
  "chain": "base",
  "tool": "on_chain_write",
  "amount_usd": 1500,
  "strict_mode": true
}`,
    response: `HTTP/1.1 200 OK

{
  "verdict": "proceed",
  "confidence": 0.94,
  "risk": "low",
  "checks": {
    "policy_check": "pass",
    "rpc_health": "pass",
    "price_deviation": "pass"
  },
  "latency_ms": 189
}`,
  },
  {
    id: 'x402-apis',
    icon: CreditCard,
    title: 'x402 APIs',
    subtitle: 'Verify paid requests before execution.',
    color: 'text-purple-400',
    border: 'border-purple-500/25',
    bg: 'bg-purple-500/[0.07]',
    tag: 'x402 · USDC on Base',
    problem: 'Agent APIs have no machine-native payment primitive. Monthly SaaS billing requires human account management and cannot scale to autonomous agent fleets paying per-request.',
    solution: 'x402 handles payment automatically. Agent sends a request, receives HTTP 402, pays $0.01 USDC on Base, and retries with the x402 payment header.',
    request: `POST /v1/acp/guard
Content-Type: application/json

{
  "action": "verify",
  "chain": "base",
  "amount_usd": 10000
}

# → Server returns 402 Payment Required
# → Agent pays 0.01 USDC on Base via x402
# → Request retries with payment header`,
    response: `HTTP/1.1 200 OK
x-payment-confirmed: true

{
  "verdict": "proceed",
  "confidence": 0.95,
  "risk": "low",
  "payment_confirmed": true,
  "latency_ms": 198
}`,
  },
  {
    id: 'agent-commerce',
    icon: ArrowLeftRight,
    title: 'Agent Commerce',
    subtitle: 'Verify agent-to-agent transactions.',
    color: 'text-teal-400',
    border: 'border-teal-500/25',
    bg: 'bg-teal-500/[0.07]',
    tag: 'POST /v1/acp/decide',
    problem: 'Multi-agent systems involve agents transacting with each other — service payments, data purchases, task delegation — with no checkpoint between the decision and the on-chain action.',
    solution: 'Use POST /v1/acp/decide for policy-driven decisions in agent-to-agent transactions. Returns block or proceed with full reasoning chain and failure mode analysis in structured JSON.',
    request: `POST /v1/acp/decide
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "action": "agent_payment",
  "chain": "base",
  "asset": "USDC",
  "amount_usd": 200,
  "policy": "conservative",
  "counterparty": "0xAgentB..."
}`,
    response: `HTTP/1.1 200 OK

{
  "verdict": "proceed",
  "confidence": 0.89,
  "risk": "low",
  "policy_applied": "conservative",
  "reasoning": "Counterparty verified. Amount within policy limits.",
  "failure_modes": [],
  "latency_ms": 241
}`,
  },
  {
    id: 'risk-validation',
    icon: ShieldAlert,
    title: 'Risk Validation',
    subtitle: 'Detect risky actions before execution.',
    color: 'text-orange-400',
    border: 'border-orange-500/25',
    bg: 'bg-orange-500/[0.07]',
    tag: 'POST /v1/guard',
    problem: 'Agents executing high-value on-chain operations have no way to quantify risk before acting. A numeric confidence score and per-check breakdown are required to build reliable autonomous systems.',
    solution: 'POST /v1/guard runs up to 10 parallel risk checks and returns a confidence score (0–1), risk level (low/medium/high), and per-check pass/fail breakdown. Bearer auth required — private use.',
    request: `POST /v1/guard
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "action": "large_transfer",
  "chain": "ethereum",
  "asset": "ETH",
  "amount_usd": 500000,
  "checks": [
    "bridge_exploit",
    "price_deviation",
    "mev_risk",
    "rpc_health",
    "liquidity_depth"
  ]
}`,
    response: `HTTP/1.1 200 OK

{
  "verdict": "block",
  "confidence": 0.87,
  "risk": "high",
  "reason": "MEV risk elevated. Price deviation 0.4%.",
  "checks": {
    "bridge_exploit": "pass",
    "price_deviation": "fail",
    "mev_risk": "warn",
    "rpc_health": "pass",
    "liquidity_depth": "pass"
  },
  "latency_ms": 267
}`,
  },
  {
    id: 'policy-enforcement',
    icon: Lock,
    title: 'Policy Enforcement',
    subtitle: 'Block actions that violate rules.',
    color: 'text-red-400',
    border: 'border-red-500/25',
    bg: 'bg-red-500/[0.07]',
    tag: 'POST /v1/acp/decide',
    problem: 'Autonomous agents operating under specific mandates — conservative capital preservation, restricted asset lists, max transfer limits — have no enforcement layer below the LLM decision.',
    solution: 'POST /v1/acp/decide applies named policies (conservative, balanced, aggressive) per agent per call. If the action violates the policy, verdict is block with full reasoning trace in JSON.',
    request: `POST /v1/acp/decide
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "action": "swap",
  "chain": "ethereum",
  "asset": "WBTC",
  "amount_usd": 200000,
  "policy": "conservative"
}`,
    response: `HTTP/1.1 200 OK

{
  "verdict": "block",
  "confidence": 0.92,
  "risk": "high",
  "policy_applied": "conservative",
  "reason": "Stablecoin depeg detected. 0.3% USDC deviation.",
  "checks": {
    "stablecoin_depeg": "fail",
    "dex_liquidity": "warn",
    "price_feed": "pass"
  },
  "latency_ms": 241
}`,
  },
  {
    id: 'execution-verification',
    icon: CheckCircle,
    title: 'Execution Verification',
    subtitle: 'Confirm actions are safe to execute.',
    color: 'text-emerald-400',
    border: 'border-emerald-500/25',
    bg: 'bg-emerald-500/[0.07]',
    tag: 'POST /v1/acp/guard',
    problem: 'Any autonomous system that writes to a blockchain needs a final verification gate — a deterministic, low-latency check that the current on-chain state is safe for the intended action.',
    solution: 'POST /v1/acp/guard is that gate. Binary verdict: proceed or block. Confidence score and per-check breakdown in every JSON response. Sub-300ms p99. x402-payable — no accounts required.',
    request: `POST /v1/acp/guard
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "action": "execute",
  "chain": "base",
  "operation": "vault_deposit",
  "amount_usd": 50000,
  "strict_mode": true
}`,
    response: `HTTP/1.1 200 OK

{
  "verdict": "proceed",
  "confidence": 0.97,
  "risk": "low",
  "checks": {
    "bridge_exploit_monitor": "pass",
    "stablecoin_depeg": "pass",
    "dex_liquidity": "pass",
    "rpc_health": "pass"
  },
  "execution_gate": "open",
  "latency_ms": 172
}`,
  },
];

// ─── Code panel with copy ─────────────────────────────────────────────────────

function CodeBlock({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-white/[0.07] bg-black/30">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
        <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">{label}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[10px] font-mono text-gray-600 hover:text-gray-300 transition-colors"
        >
          {copied
            ? <><Check className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400">copied</span></>
            : <><Copy className="w-3 h-3" />copy</>
          }
        </button>
      </div>
      <pre className="p-4 text-xs font-mono text-gray-300 leading-6 overflow-x-auto whitespace-pre">{code}</pre>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function UseCaseCard({ uc, index }: { uc: UseCase; index: number }) {
  const [open, setOpen] = useState(false);
  const Icon = uc.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-2xl border ${uc.border} bg-[#050508] overflow-hidden`}
    >
      {/* Header — always visible */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left px-6 py-5 flex items-start gap-4 group"
      >
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 mt-0.5 ${uc.border} ${uc.bg}`}>
          <Icon className={`w-5 h-5 ${uc.color}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <span className="text-white font-semibold text-base">{uc.title}</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${uc.border} ${uc.bg} ${uc.color}`}>
              {uc.tag}
            </span>
          </div>
          <p className="text-sm text-gray-500">{uc.subtitle}</p>
        </div>

        <motion.div
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 mt-1"
        >
          <ChevronRight className={`w-4 h-4 ${uc.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
        </motion.div>
      </button>

      {/* Expanded body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-white/[0.05]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-5">

                {/* Left: problem + solution */}
                <div className="space-y-5">
                  <div>
                    <div className={`text-[10px] font-bold font-mono tracking-widest mb-2 ${uc.color}`}>PROBLEM</div>
                    <p className="text-sm text-gray-400 leading-relaxed">{uc.problem}</p>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold font-mono tracking-widest mb-2 text-gray-500">SOLUTION</div>
                    <p className="text-sm text-gray-300 leading-relaxed">{uc.solution}</p>
                  </div>
                </div>

                {/* Right: request + response */}
                <div className="space-y-3">
                  <CodeBlock code={uc.request} label="request" />
                  <CodeBlock code={uc.response} label="response" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UseCasesPage() {
  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <div className="relative border-b border-white/[0.06] pt-16">
        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/[0.06] rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-label mb-4"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Use Cases
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4 leading-tight"
          >
            How developers use<br />
            <span className="text-gradient-blue">VerifyProceed.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12 }}
            className="text-gray-400 text-lg max-w-2xl leading-relaxed mb-6"
          >
            Nine concrete integration patterns. Each one shows the problem, the solution, and the exact request and response your agent will send and receive.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18 }}
            className="flex flex-wrap gap-4"
          >
            {[
              { value: '4', label: 'endpoints', color: 'text-blue-400' },
              { value: '<300ms', label: 'p99 response', color: 'text-emerald-400' },
              { value: '$0.01', label: 'per call via x402', color: 'text-purple-400' },
              { value: 'JSON', label: 'all responses', color: 'text-cyan-400' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-card border border-white/[0.06]">
                <span className={`text-sm font-bold font-mono ${s.color}`}>{s.value}</span>
                <span className="text-xs text-gray-600">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── USE CASE LIST ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="space-y-3">
          {USE_CASES.map((uc, i) => (
            <UseCaseCard key={uc.id} uc={uc} index={i} />
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-blue-500/20 bg-blue-500/[0.04] p-8"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="text-sm font-mono text-gray-600 uppercase tracking-widest mb-2">Ready to integrate</p>
                <h2 className="text-xl font-bold text-white mb-1">One endpoint. Any use case.</h2>
                <p className="text-sm text-gray-500 max-w-md leading-relaxed">
                  REST API over HTTPS. JSON responses. No SDK required. 100 free calls / month — x402 USDC payment on Base when you need more.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 flex-shrink-0">
                <Link
                  to="/playground"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-blue-glow active:scale-[0.98]"
                >
                  <Play className="w-4 h-4" />
                  Try API
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/docs"
                  className="inline-flex items-center gap-2 px-5 py-2.5 glass-card hover:border-white/[0.14] text-gray-400 hover:text-white text-sm font-semibold rounded-xl transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  View Docs
                </Link>
                <Link
                  to="/playground"
                  className="inline-flex items-center gap-2 px-5 py-2.5 glass-card hover:border-white/[0.14] text-gray-400 hover:text-white text-sm font-semibold rounded-xl transition-all"
                >
                  <Terminal className="w-4 h-4" />
                  Open Playground
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
