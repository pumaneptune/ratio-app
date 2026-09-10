import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Shield, Zap, ArrowRight, Server, CreditCard,
  Lock, ChevronRight, Hash, Cpu, Network,
  CircleDot, AlertTriangle,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function FadeUp({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FadeIn({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.7, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PRINCIPLES = [
  {
    title: 'Machines are first-class participants.',
    body: 'Every design decision starts from the agent\'s perspective, not the human operator\'s. APIs should be callable without accounts. Payments should settle without billing portals. Verdicts should be machine-readable without parsing. The human workflow is the exception, not the rule.',
    color: 'text-blue-400',
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/[0.04]',
  },
  {
    title: 'Deterministic over probabilistic.',
    body: 'An agent cannot act on "probably safe." Responses are typed. Fields are guaranteed. Verdicts are binary. When the check is pass, it means pass. When the verdict is block, it means block. No ambiguous text, no undefined states, no soft suggestions. Agents need facts.',
    color: 'text-emerald-400',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/[0.04]',
  },
  {
    title: 'Infrastructure, not product.',
    body: 'We build primitives that other systems depend on. That means uptime is more important than features. Correctness is more important than coverage. A wrong verdict at scale is a systemic failure. We optimize for the failure modes that matter, not the demos that impress.',
    color: 'text-cyan-400',
    border: 'border-cyan-500/20',
    bg: 'bg-cyan-500/[0.04]',
  },
  {
    title: 'Open where it matters.',
    body: 'The x402 payment protocol is an open standard. The capability manifest is publicly queryable. The API specification is published. Lock-in is a design smell that compounds over time. Infrastructure that agents depend on needs to be predictable, not proprietary.',
    color: 'text-purple-400',
    border: 'border-purple-500/20',
    bg: 'bg-purple-500/[0.04]',
  },
];

const PROBLEMS = [
  {
    icon: AlertTriangle,
    color: 'text-orange-400',
    border: 'border-orange-500/20',
    bg: 'bg-orange-500/[0.05]',
    title: 'AI agents have no trust layer.',
    body: 'Current AI frameworks give agents the ability to execute actions — bridge funds, execute swaps, interact with contracts — with no mechanism to verify that the environment is safe before they act. A compromised RPC, a depegged stablecoin, an active bridge exploit: the agent has no way to know. It just executes.',
  },
  {
    icon: CreditCard,
    color: 'text-yellow-400',
    border: 'border-yellow-500/20',
    bg: 'bg-yellow-500/[0.05]',
    title: 'APIs require humans to pay for them.',
    body: 'Every API in production today requires a human to create an account, enter a credit card, approve a billing plan, and manage an API key. An autonomous agent fleet of 10,000 instances cannot do any of that. Subscriptions are human-native infrastructure accidentally extended to machines.',
  },
  {
    icon: Network,
    color: 'text-red-400',
    border: 'border-red-500/20',
    bg: 'bg-red-500/[0.05]',
    title: 'Autonomous systems have no verification primitive.',
    body: 'There is no standard way for an agent to ask: "Is this action safe to execute right now, given current market conditions, contract state, and known exploits?" Without that primitive, verification is either skipped entirely or implemented ad hoc by each team — inconsistently, incompletely, and without shared intelligence.',
  },
];

const INFRASTRUCTURE_LAYERS = [
  {
    icon: Shield,
    label: 'Verification Layer',
    desc: 'Real-time pre-execution safety checks across bridge exploits, price deviations, RPC health, contract blacklists, and stablecoin peg status.',
    color: 'text-blue-400',
    border: 'border-blue-500/25',
    bg: 'bg-blue-500/[0.06]',
  },
  {
    icon: CreditCard,
    label: 'Payment Layer',
    desc: 'x402 machine-native payments. Agents pay per call in USDC on Base — atomically, with cryptographic proof, without accounts or subscriptions.',
    color: 'text-purple-400',
    border: 'border-purple-500/25',
    bg: 'bg-purple-500/[0.06]',
  },
  {
    icon: Cpu,
    label: 'Policy Layer',
    desc: 'Configurable risk policies applied on top of real-time signals. conservative, balanced, and aggressive modes with full reasoning traces.',
    color: 'text-emerald-400',
    border: 'border-emerald-500/25',
    bg: 'bg-emerald-500/[0.06]',
  },
  {
    icon: Server,
    label: 'Identity Layer',
    desc: 'Agent identity registration and per-agent policy association. Fleets can be managed programmatically — no human onboarding required.',
    color: 'text-cyan-400',
    border: 'border-cyan-500/25',
    bg: 'bg-cyan-500/[0.06]',
  },
];

const TIMELINE = [
  { year: '2024',    event: 'Founded. First ACP Guard prototype running on Base testnet. Initial safety check architecture established.' },
  { year: 'Q1 2025', event: 'x402 payment integration completed. First agents paying for verification autonomously in USDC — no human accounts.' },
  { year: 'Q2 2025', event: 'Base mainnet launch. Decide API with configurable policy engine. Multi-chain support for Ethereum and Arbitrum.' },
  { year: 'Q4 2025', event: 'Public beta. 50+ agent teams integrating ACP into production systems. Infrastructure plan tier opened.' },
  { year: '2026',    event: 'Production launch. Pay-per-call via x402 live. Machine-payable API key provisioning released.' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <div className="relative pt-16 border-b border-white/[0.06]">
        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-600/[0.05] rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="section-label mb-6"
          >
            <Shield className="w-3.5 h-3.5" /> About VerifyProceed
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.03] mb-8"
          >
            Building the infrastructure layer<br className="hidden sm:block" />
            <span className="text-gradient-blue">for autonomous economies.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.16 }}
            className="max-w-3xl space-y-5"
          >
            <p className="text-xl text-gray-300 leading-[1.7]">
              AI agents are being deployed into production systems with increasing autonomy — managing capital, executing transactions, and operating infrastructure without direct human oversight.
            </p>
            <p className="text-lg text-gray-500 leading-[1.7]">
              The tooling they operate within was built for humans. Billing systems require credit cards. APIs require accounts. Verification is manual or absent entirely. None of that scales to machines operating at machine speed.
            </p>
            <p className="text-lg text-gray-500 leading-[1.7]">
              VerifyProceed builds the primitives that autonomous systems actually need: real-time verification, machine-native payments, and deterministic trust infrastructure.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── THE PROBLEM ──────────────────────────────────────────────── */}
        <div className="py-20 border-b border-white/[0.04]">
          <FadeUp>
            <div className="mb-12">
              <div className="section-label mb-3"><Hash className="w-3.5 h-3.5" /> The problem</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                Three fundamental gaps<br />in autonomous AI infrastructure.
              </h2>
            </div>
          </FadeUp>

          <div className="space-y-4">
            {PROBLEMS.map((p, i) => {
              const Icon = p.icon;
              return (
                <FadeUp key={p.title} delay={i * 0.1}>
                  <div className={`rounded-2xl border p-7 ${p.bg} ${p.border}`}>
                    <div className="flex items-start gap-5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${p.bg} border ${p.border}`}>
                        <Icon className={`w-5 h-5 ${p.color}`} />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-base mb-2.5">{p.title}</h3>
                        <p className="text-gray-400 text-sm leading-[1.75]">{p.body}</p>
                      </div>
                    </div>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>

        {/* ── WHAT WE BUILD ─────────────────────────────────────────────── */}
        <div className="py-20 border-b border-white/[0.04]">
          <FadeUp>
            <div className="mb-3 section-label"><Server className="w-3.5 h-3.5" /> What we build</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              A four-layer infrastructure stack<br className="hidden sm:block" />for autonomous agents.
            </h2>
            <p className="text-gray-500 text-base leading-relaxed max-w-2xl mb-12">
              Each layer addresses one of the gaps above. Together they form a complete runtime substrate for agents that need to act safely, pay autonomously, and operate within defined risk constraints.
            </p>
          </FadeUp>

          <div className="grid sm:grid-cols-2 gap-4">
            {INFRASTRUCTURE_LAYERS.map((l, i) => {
              const Icon = l.icon;
              return (
                <FadeUp key={l.label} delay={i * 0.08}>
                  <div className={`p-6 rounded-2xl border h-full ${l.bg} ${l.border}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${l.bg} border ${l.border}`}>
                        <Icon className={`w-4.5 h-4.5 ${l.color}`} />
                      </div>
                      <h3 className="text-white font-bold text-sm">{l.label}</h3>
                    </div>
                    <p className="text-gray-500 text-sm leading-[1.75]">{l.desc}</p>
                  </div>
                </FadeUp>
              );
            })}
          </div>

          {/* Stack diagram */}
          <FadeUp delay={0.15} className="mt-8">
            <div className="rounded-2xl border border-white/[0.07] overflow-hidden bg-[#07080e]">
              <div className="flex items-center gap-2.5 px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500/50" />
                  <span className="w-2 h-2 rounded-full bg-yellow-500/50" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500/50" />
                </div>
                <span className="text-xs font-mono text-gray-600">ACP infrastructure stack</span>
              </div>
              <div className="p-5 space-y-2 font-mono text-xs">
                {[
                  { label: '┌─ Agent runtime',              color: 'text-gray-500' },
                  { label: '│   └─ guard.verify(action)',    color: 'text-blue-300' },
                  { label: '│       └─ 402 → pay USDC',      color: 'text-purple-300' },
                  { label: '│           └─ x402 payment header', color: 'text-cyan-300' },
                  { label: '│               └─ verdict: proceed / block', color: 'text-emerald-300' },
                  { label: '└─ Agent executes or halts',     color: 'text-gray-500' },
                ].map((line, i) => (
                  <div key={i} className={line.color}>{line.label}</div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>

        {/* ── x402 SECTION ───────────────────────────────────────────────── */}
        <div className="py-20 border-b border-white/[0.04]">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <FadeUp>
              <div className="section-label mb-3"><Zap className="w-3.5 h-3.5" /> Machine-native payments</div>
              <h2 className="text-3xl font-bold text-white mb-5 leading-tight">
                x402: HTTP payments<br />for autonomous systems.
              </h2>
              <div className="space-y-4 text-gray-400 text-sm leading-[1.8]">
                <p>
                  The HTTP 402 status code — "Payment Required" — has existed since 1991 but was never fully specified. We implement it as a complete payment protocol: the API returns a 402 with a payment-required challenge, the agent pays in USDC on Base via x402, and retries with the x402 payment header.
                </p>
                <p>
                  The entire cycle completes in under 500ms. No billing accounts. No API keys that expire. No human approval. The agent self-provisions access and pays exactly for what it uses.
                </p>
                <p>
                  This is the correct model for machine-to-machine commerce. Subscriptions assume monthly billing cycles, human oversight, and predictable usage. Autonomous agents have none of those properties.
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="space-y-3">
                {[
                  {
                    step: '01',
                    title: 'Agent sends request',
                    code: 'POST /v1/acp/guard',
                    color: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/[0.05]',
                  },
                  {
                    step: '02',
                    title: 'Server returns 402 with payment-required challenge',
                    code: '{ "amount": "$0.01 USDC", "network": "base" }',
                    color: 'text-yellow-300', border: 'border-yellow-500/20', bg: 'bg-yellow-500/[0.05]',
                  },
                  {
                    step: '03',
                    title: 'Agent pays on-chain via x402',
                    code: 'USDC transfer confirmed on Base',
                    color: 'text-purple-400', border: 'border-purple-500/20', bg: 'bg-purple-500/[0.05]',
                  },
                  {
                    step: '04',
                    title: 'Agent retries with x402 payment header',
                    code: 'x402 payment header attached to retry',
                    color: 'text-cyan-400', border: 'border-cyan-500/20', bg: 'bg-cyan-500/[0.05]',
                  },
                  {
                    step: '05',
                    title: 'Server verifies and responds',
                    code: '{ "verdict": "proceed", "confidence": 0.94 }',
                    color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/[0.05]',
                  },
                ].map((s) => (
                  <div key={s.step} className={`flex items-start gap-4 p-4 rounded-xl border ${s.bg} ${s.border}`}>
                    <span className={`text-xs font-mono font-bold flex-shrink-0 mt-px ${s.color}`}>{s.step}</span>
                    <div className="min-w-0">
                      <p className="text-white text-xs font-semibold mb-1">{s.title}</p>
                      <code className={`text-[10px] font-mono break-all ${s.color} opacity-70`}>{s.code}</code>
                    </div>
                  </div>
                ))}
                <div className="text-center pt-1">
                  <span className="text-[10px] font-mono text-gray-700">total cycle time: &lt;500ms · settlement: Base mainnet</span>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>

        {/* ── PRINCIPLES ─────────────────────────────────────────────────── */}
        <div className="py-20 border-b border-white/[0.04]">
          <FadeUp className="mb-12">
            <div className="section-label mb-3"><Lock className="w-3.5 h-3.5" /> Design principles</div>
            <h2 className="text-3xl font-bold text-white">What we believe.</h2>
          </FadeUp>

          <div className="grid sm:grid-cols-2 gap-4">
            {PRINCIPLES.map((p, i) => (
              <FadeUp key={p.title} delay={i * 0.07}>
                <div className={`p-6 rounded-2xl border h-full ${p.bg} ${p.border} group hover:border-white/20 transition-colors`}>
                  <div className={`flex items-center gap-2 mb-4`}>
                    <CircleDot className={`w-3.5 h-3.5 ${p.color}`} />
                    <h3 className="text-white font-bold text-sm">{p.title}</h3>
                  </div>
                  <p className="text-gray-500 text-sm leading-[1.8]">{p.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>

        {/* ── TIMELINE ───────────────────────────────────────────────────── */}
        <div className="py-20 border-b border-white/[0.04]">
          <FadeUp className="mb-12">
            <div className="section-label mb-3"><Hash className="w-3.5 h-3.5" /> History</div>
            <h2 className="text-3xl font-bold text-white">Where we've been.</h2>
          </FadeUp>

          <div className="relative">
            <div className="absolute left-[88px] top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/30 via-white/[0.05] to-transparent" />
            <div className="space-y-0">
              {TIMELINE.map((item, i) => (
                <FadeIn key={item.year} delay={i * 0.08}>
                  <div className="relative flex items-start gap-8 pb-10 last:pb-0">
                    {/* Year */}
                    <div className="w-[72px] flex-shrink-0 text-right">
                      <span className="text-xs font-mono font-bold text-blue-400">{item.year}</span>
                    </div>

                    {/* Dot */}
                    <div className="flex-shrink-0 relative z-10 mt-1">
                      <div className="w-3 h-3 rounded-full bg-[#050508] border-2 border-blue-500/50 flex items-center justify-center">
                        <span className="w-1 h-1 rounded-full bg-blue-400" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-0">
                      <p className="text-gray-400 text-sm leading-[1.75]">{item.event}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>

        {/* ── VISION STATEMENT ───────────────────────────────────────────── */}
        <div className="py-20 border-b border-white/[0.04]">
          <FadeUp>
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]">
              <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/[0.06] via-transparent to-cyan-600/[0.04] pointer-events-none" />
              <div className="relative px-8 sm:px-12 py-12 sm:py-14">
                <div className="max-w-3xl">
                  <div className="section-label mb-5"><Network className="w-3.5 h-3.5" /> Vision</div>
                  <blockquote className="text-xl sm:text-2xl font-semibold text-white leading-[1.55] mb-6">
                    "The autonomous economy is not a distant hypothesis. Agents are already managing capital, executing transactions, and operating infrastructure at scale. The missing piece is not capability — it is trust, verification, and economic primitives designed for machines rather than adapted from human workflows."
                  </blockquote>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    That is what we are building. Not an AI product. Not another chatbot wrapper. Infrastructure — the kind that runs quietly underneath everything else, that nobody notices unless it fails, and that everything depends on being correct.
                  </p>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>

        {/* ── CTA ────────────────────────────────────────────────────────── */}
        <div className="py-20">
          <FadeUp>
            <div className="grid sm:grid-cols-3 gap-6">

              <div className="sm:col-span-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Build on the infrastructure.
                </h2>
                <p className="text-gray-500 text-sm leading-[1.8] mb-6 max-w-lg">
                  The ACP API is live in production. 100 free requests per month. Pay-per-call via x402 when you need more. No contracts, no sales calls, no minimum commitments.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/get-api-key"
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all hover:shadow-blue-glow">
                    Get API key <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/contact"
                    className="flex items-center gap-2 px-6 py-3 glass-card hover:border-white/15 text-gray-300 hover:text-white font-semibold rounded-xl text-sm transition-all">
                    Contact us <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { icon: Shield,     label: 'API Reference',  sub: 'All endpoints documented',  to: '/api' },
                  { icon: Zap,        label: 'Pricing',        sub: 'x402 pay-per-call',         to: '/pricing' },
                  { icon: Server,     label: 'Infrastructure', sub: 'Enterprise plans',          to: '/contact' },
                ].map(({ icon: Icon, label, sub, to }) => (
                  <Link key={label} to={to}
                    className="flex items-center gap-3 p-3.5 glass-card hover:border-white/12 rounded-xl transition-all group">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-300 transition-colors" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-semibold">{label}</p>
                      <p className="text-gray-600 text-[10px]">{sub}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-700 ml-auto group-hover:text-gray-400 transition-colors" />
                  </Link>
                ))}
              </div>

            </div>
          </FadeUp>
        </div>

      </div>

      <Footer />
    </div>
  );
}