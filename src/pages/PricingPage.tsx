import { useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, Check, ArrowRight, Terminal, ChevronRight,
  X, CreditCard, AlertCircle, RefreshCw, Shield, Clock,
  Hash, Wifi, Lock, Bot, Scale, Sparkles, Mail,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// ─── Data ─────────────────────────────────────────────────────────────────────

const ENDPOINT_COSTS = [
  { method: 'POST', path: '/v1/acp/guard',    label: 'Guard',        cost: '$0.01', desc: 'Full pre-execution safety check',         color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/25' },
  { method: 'POST', path: '/v1/acp/decide',   label: 'Decide',       cost: '$0.01', desc: 'Policy-driven decision engine',           color: 'text-cyan-400',    bg: 'bg-cyan-500/10 border-cyan-500/25' },
  { method: 'GET',  path: '/v1/capabilities', label: 'Capabilities', cost: '$0.01', desc: 'Capability manifest, cacheable 5 min',     color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/25' },
  { method: 'GET',  path: '/v1/agents',       label: 'Agents',       cost: '$0.01', desc: 'List registered agent identities',        color: 'text-cyan-400',    bg: 'bg-cyan-500/10 border-cyan-500/25' },
];

const WHY_SUBS_FAIL = [
  {
    icon: X,
    color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20',
    title: 'Subscriptions are human-native',
    body: 'Monthly billing cycles assume a human reviews a credit card statement. Autonomous agents run continuously, bill unpredictably, and have no concept of a billing period. A 30-day cycle is meaningless to a process that makes 10,000 decisions per second.',
  },
  {
    icon: AlertCircle,
    color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20',
    title: 'Pre-paid buckets break agent economics',
    body: 'Buying request packs in advance requires human forecasting. Agents operating autonomously cannot predict their usage patterns weeks ahead. Over-buying wastes capital. Under-buying causes failures in production — the worst possible outcome.',
  },
  {
    icon: Lock,
    color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20',
    title: 'Auth tokens are a human bottleneck',
    body: 'API keys must be provisioned by a human, rotated by a human, and attached to a billing account managed by a human. Autonomous agent fleets — potentially thousands of instances — cannot block on human approval to access infrastructure they need right now.',
  },
  {
    icon: Zap,
    color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20',
    title: 'x402 enables machine-native commerce',
    body: 'HTTP 402 turns API access into a real-time payment. The agent requests, receives a price, pays in USDC on Base, and retries with proof — all in under 500ms. No accounts, no subscriptions, no humans. Just atomic transactions between machines.',
  },
];

const FAQS = [
  {
    q: 'How does x402 pay-per-call pricing work?',
    a: 'x402 extends HTTP 402 into a complete payment protocol. The agent calls the API, receives payment instructions in the response body, pays $0.01 USDC on Base mainnet, and retries with an on-chain proof header. The server verifies on-chain and returns the response.',
  },
  {
    q: 'Do I need a crypto wallet?',
    a: 'No — for the free tier you only need an API key. For pay-per-call, the SDK manages an EOA wallet automatically. You fund it with USDC on Base and the SDK handles all payment logic. Typical daily spend for a production agent is $0.50–$5.',
  },
  {
    q: 'How is per-request cost calculated?',
    a: 'All paid endpoints cost $0.01 USDC per call. The exact cost for each endpoint is published in the capability manifest at GET /v1/capabilities.',
  },
  {
    q: 'How does Evaluator pricing work?',
    a: 'The Evaluator charges 1% of the job value, with a minimum of $0.50 and a cap of $25 per ruling. The fee is taken automatically from the job\'s existing payment — no separate billing, no invoices, no setup.',
  },
  {
    q: 'Can agents self-provision API keys?',
    a: 'Yes. Submit your email, name, and use case to POST /functions/v1/api-key-signup — a key is provisioned instantly. The free tier includes 100 requests/month. No credit card required.',
  },
];

const EVALUATOR_EXAMPLES = [
  { jobValue: '$50',    fee: '$0.50', note: 'minimum applies' },
  { jobValue: '$500',   fee: '$5.00', note: 'normal 1%' },
  { jobValue: '$5,000', fee: '$25.00', note: 'cap applies' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      <span className="section-label">{children}</span>
    </div>
  );
}

// ─── 402 flow animation ───────────────────────────────────────────────────────

const FLOW_STEPS = [
  { icon: Terminal,  label: 'Agent sends request',  sub: 'POST /v1/acp/guard',          color: 'text-blue-400',    border: 'border-blue-500/30',    bg: 'bg-blue-500/[0.08]' },
  { icon: AlertCircle, label: '402 Payment Required', sub: '{ "amount": "$0.01 USDC" }',  color: 'text-yellow-300',  border: 'border-yellow-500/30',  bg: 'bg-yellow-500/[0.06]' },
  { icon: CreditCard, label: 'USDC paid on Base',   sub: 'tx 0xabc…def confirmed',       color: 'text-purple-400',  border: 'border-purple-500/30',  bg: 'bg-purple-500/[0.07]' },
  { icon: Hash,      label: 'x402 payment header',  sub: 'x402 payment attached to retry', color: 'text-cyan-400',    border: 'border-cyan-500/30',    bg: 'bg-cyan-500/[0.07]' },
  { icon: Shield,    label: 'Verified response',    sub: '{ "verdict": "proceed" }',     color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/[0.08]' },
];

function X402FlowDiagram() {
  const [active, setActive] = useState(-1);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const [played, setPlayed] = useState(false);
  if (inView && !played) {
    setPlayed(true);
    let i = 0;
    const tick = () => {
      setActive(i);
      i++;
      if (i < FLOW_STEPS.length) setTimeout(tick, 420);
    };
    setTimeout(tick, 300);
  }

  return (
    <div ref={ref} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-1.5 flex-wrap">
      {FLOW_STEPS.map((step, i) => {
        const Icon = step.icon;
        const done = active >= i;
        return (
          <div key={step.label} className="flex sm:flex-row flex-col items-center gap-1.5 sm:gap-1.5">
            <motion.div
              initial={{ opacity: 0.2, scale: 0.92 }}
              animate={done ? { opacity: 1, scale: 1 } : { opacity: 0.2, scale: 0.92 }}
              transition={{ duration: 0.3 }}
              className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border transition-all min-w-[140px] ${
                done ? `${step.bg} ${step.border}` : 'bg-white/[0.02] border-white/[0.05]'
              }`}
            >
              <Icon className={`w-4 h-4 ${done ? step.color : 'text-gray-700'}`} />
              <span className={`text-xs font-semibold text-center leading-tight ${done ? 'text-white' : 'text-gray-700'}`}>{step.label}</span>
              <code className={`text-[10px] font-mono text-center ${done ? step.color : 'text-gray-800'}`}>{step.sub}</code>
            </motion.div>
            {i < FLOW_STEPS.length - 1 && (
              <motion.div
                animate={active >= i ? { opacity: 1 } : { opacity: 0.15 }}
                transition={{ duration: 0.3, delay: 0.15 }}
              >
                <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0 rotate-90 sm:rotate-0" />
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── FAQ accordion ────────────────────────────────────────────────────────────

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <FadeUp delay={index * 0.05}>
      <div className={`rounded-xl border transition-all duration-200 overflow-hidden ${
        open ? 'border-blue-500/25 bg-blue-500/[0.03]' : 'border-white/[0.06] bg-white/[0.02]'
      }`}>
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
        >
          <span className="text-white font-semibold text-sm">{q}</span>
          <ChevronRight className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''}`} />
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <p className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">{a}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FadeUp>
  );
}

// ─── Pricing card helpers ──────────────────────────────────────────────────────

function FeatureList({ features, accentColor = 'text-gray-600' }: { features: { text: string; included: boolean; accent?: boolean }[]; accentColor?: string }) {
  return (
    <ul className="space-y-2.5">
      {features.map((f) => (
        <li key={f.text} className="flex items-center gap-2.5 text-sm">
          {f.included
            ? <Check className={`w-3.5 h-3.5 flex-shrink-0 ${f.accent ? 'text-blue-400' : 'text-emerald-500/70'}`} />
            : <X className={`w-3.5 h-3.5 flex-shrink-0 ${accentColor}`} />}
          <span className={f.included ? (f.accent ? 'text-white font-semibold' : 'text-gray-400') : 'text-gray-700'}>{f.text}</span>
        </li>
      ))}
    </ul>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <div className="relative pt-16 border-b border-white/[0.06]">
        <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-600/[0.05] rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="section-label mb-5 justify-center">
            <Zap className="w-3.5 h-3.5" /> Pricing
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.02] mb-6"
          >
            Pay per call.<br />
            <span className="text-gradient-blue">Not per month.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.14 }}
            className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto mb-6"
          >
            Two products, transparent pricing. The Risk Oracle guards every call. The Evaluator rules on completed jobs. Both priced for autonomous systems.
          </motion.p>

          {/* Prominent callout */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
            className="max-w-xl mx-auto mb-10"
          >
            <div className="relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 rounded-2xl p-px bg-gradient-to-r from-blue-500/40 via-cyan-500/30 to-blue-500/40">
                <div className="w-full h-full rounded-2xl bg-[#050508]" />
              </div>
              <div className="relative px-6 py-4 bg-gradient-to-br from-blue-500/[0.06] via-transparent to-cyan-500/[0.04] rounded-2xl text-center">
                <p className="text-base font-semibold text-white">
                  Autonomous agents should not need subscriptions.{' '}
                  <span className="text-blue-300">They should pay APIs directly.</span>
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.24 }}
            className="flex flex-wrap items-center justify-center gap-2">
            {[
              { label: 'USDC on Base',         c: 'text-blue-400   border-blue-500/25   bg-blue-500/[0.06]' },
              { label: 'x402 native',           c: 'text-purple-400 border-purple-500/25 bg-purple-500/[0.06]' },
              { label: 'No subscriptions',      c: 'text-emerald-400 border-emerald-500/25 bg-emerald-500/[0.06]' },
              { label: 'Instant settlement',    c: 'text-cyan-400   border-cyan-500/25   bg-cyan-500/[0.06]' },
            ].map((b) => (
              <span key={b.label} className={`text-xs font-mono px-3.5 py-1.5 rounded-full border ${b.c}`}>{b.label}</span>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── STATS BAR ─────────────────────────────────────────────── */}
        <FadeUp>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.05] rounded-2xl overflow-hidden my-14">
            {[
              { label: 'Min cost per call',    value: '$0.01',  sub: '/v1/capabilities' },
              { label: 'Avg latency',          value: '~180ms', sub: 'guard endpoint' },
              { label: 'Settlement time',      value: '<2s',    sub: 'Base mainnet' },
              { label: 'Free requests / mo',   value: '100',    sub: 'no card needed' },
            ].map((s) => (
              <div key={s.label} className="bg-[#07080e] px-6 py-6 text-center">
                <p className="text-3xl font-bold text-white mb-1">{s.value}</p>
                <p className="text-xs font-mono text-gray-600 mb-0.5">{s.label}</p>
                <p className="text-[10px] text-gray-700">{s.sub}</p>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* ════════════════════════════════════════════════════════════ */}
        {/* ── SECTION 1: RISK ORACLE PRICING ─────────────────────────── */}
        {/* ════════════════════════════════════════════════════════════ */}
        <FadeUp className="mb-10">
          <div className="text-center">
            <SectionLabel><Shield className="w-3.5 h-3.5" /> Risk Oracle</SectionLabel>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Pre-execution safety checks</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Guard every action before it happens. Three tiers — from free exploration to unlimited machine-native pay-per-call.
            </p>
          </div>
        </FadeUp>

        <div className="grid lg:grid-cols-3 gap-5 items-stretch mb-20">

          {/* FREE */}
          <FadeUp delay={0.04}>
            <div className="glass-card rounded-2xl p-7 flex flex-col h-full">
              <div className="mb-8 flex-1">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
                    <Terminal className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Free Tier</span>
                </div>
                <div className="mb-1">
                  <span className="text-6xl font-bold text-white tracking-tight">$0</span>
                </div>
                <p className="text-gray-600 text-sm font-mono mb-4">forever</p>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  Start exploring. No payment method. No expiry. Just build.
                </p>
                <FeatureList features={[
                  { text: '100 requests / month', included: true },
                  { text: 'No card required', included: true },
                  { text: 'API key access', included: true },
                  { text: 'Public endpoints', included: true },
                  { text: 'Basic verification', included: true },
                  { text: 'Priority support', included: false },
                  { text: 'SLA', included: false },
                ]} />
              </div>
              <Link to="/get-api-key"
                className="w-full py-3 rounded-xl glass-card hover:border-white/15 text-gray-300 hover:text-white text-sm font-semibold transition-all flex items-center justify-center gap-2">
                Get free key <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeUp>

          {/* TEAM */}
          <FadeUp delay={0.08}>
            <div className="glass-card rounded-2xl p-7 flex flex-col h-full">
              {/* New badge */}
              <div className="flex justify-end -mt-1 mb-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-wide text-emerald-400 bg-emerald-500/10 border border-emerald-500/25">
                  <Sparkles className="w-3 h-3" /> New
                </span>
              </div>
              <div className="mb-8 flex-1">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Team</span>
                </div>
                <div className="mb-1 flex items-end gap-1">
                  <span className="text-6xl font-bold text-white tracking-tight">$49</span>
                  <span className="text-lg font-mono text-gray-600 mb-2">/month</span>
                </div>
                <p className="text-gray-600 text-sm font-mono mb-4">billed by credit card</p>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  For teams running production agents that need predictable monthly costs and email support.
                </p>
                <FeatureList features={[
                  { text: '25,000 requests / month', included: true, accent: true },
                  { text: 'Billed by credit card', included: true, accent: true },
                  { text: 'Email support', included: true, accent: true },
                  { text: 'API key access', included: true },
                  { text: 'All public endpoints', included: true },
                  { text: 'Full verification suite', included: true },
                ]} />
              </div>
              <Link to="/get-api-key"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all hover:shadow-blue-glow active:scale-[0.98] flex items-center justify-center gap-2">
                Get started <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeUp>

          {/* PAY-PER-CALL */}
          <FadeUp delay={0.12}>
            <div className="relative flex flex-col h-full">
              {/* Border glow */}
              <div className="absolute inset-0 rounded-2xl p-px bg-gradient-to-b from-blue-500/40 via-cyan-500/20 to-blue-500/30 pointer-events-none" />
              {/* Floating badge */}
              <div className="absolute -top-4 inset-x-0 flex justify-center z-10">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                  <Zap className="w-3 h-3" /> Machine-Native
                </span>
              </div>

              <div className="relative z-10 rounded-2xl p-7 flex flex-col h-full overflow-hidden"
                style={{ background: 'linear-gradient(145deg, rgba(37,99,235,0.09) 0%, rgba(6,182,212,0.04) 60%, rgba(37,99,235,0.08) 100%)' }}>

                {/* Glow orb */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/[0.07] rounded-full blur-2xl pointer-events-none" />

                <div className="mb-8 flex-1 relative">
                  <div className="flex items-center gap-2 mb-5 mt-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">Pay-Per-Call</span>
                  </div>

                  <div className="mb-1 flex items-end gap-2">
                    <span className="text-6xl font-bold text-white tracking-tight">$0.01</span>
                  </div>
                  <p className="text-sm font-mono text-gray-500 mb-4">per request</p>

                  {/* x402 badge */}
                  <div className="flex items-center gap-2 mb-6 p-3 rounded-xl bg-cyan-500/[0.06] border border-cyan-500/20">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-cyan-200">Paid via x402 · USDC on Base</p>
                      <p className="text-[10px] text-cyan-400/60 font-mono">No billing account required</p>
                    </div>
                  </div>

                  <FeatureList features={[
                    { text: 'No subscription', included: true, accent: true },
                    { text: 'Unlimited requests', included: true, accent: true },
                    { text: 'Paid automatically in USDC', included: true },
                    { text: 'Designed for autonomous agents', included: true },
                    { text: 'Full verification suite', included: true },
                    { text: 'Machine-payable provisioning', included: true },
                  ]} />
                </div>

                <Link to="/get-api-key"
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all hover:shadow-blue-glow active:scale-[0.98] flex items-center justify-center gap-2">
                  Start building <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </FadeUp>

        </div>

        {/* ════════════════════════════════════════════════════════════ */}
        {/* ── SECTION 2: EVALUATOR PRICING ───────────────────────────── */}
        {/* ════════════════════════════════════════════════════════════ */}
        <div className="border-t border-white/[0.06] pt-16">
          <FadeUp className="mb-10">
            <div className="text-center">
              <SectionLabel><Scale className="w-3.5 h-3.5" /> Evaluator</SectionLabel>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Neutral third-party rulings</h2>
              <p className="text-gray-500 text-sm max-w-xl mx-auto">
                The ACP Evaluator judges completed jobs and issues binding rulings. Pricing is a percentage of job value — taken from the existing payment, no separate billing.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.08}>
            <div className="max-w-2xl mx-auto">
              <div className="relative rounded-2xl overflow-hidden">
                {/* Gradient border */}
                <div className="absolute inset-0 rounded-2xl p-px bg-gradient-to-b from-emerald-500/30 via-cyan-500/15 to-emerald-500/20">
                  <div className="w-full h-full rounded-2xl bg-[#07080e]" />
                </div>

                <div className="relative p-8 sm:p-10">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
                      <Scale className="w-6 h-6 text-emerald-400" />
                    </div>

                    {/* Price */}
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-5xl font-bold text-white tracking-tight">1%</span>
                        <span className="text-lg font-mono text-gray-500">of job value</span>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed mb-5">
                        Automatically taken from the job's existing payment. No separate billing, no invoices, no setup.
                      </p>

                      {/* Min / Cap badges */}
                      <div className="flex flex-wrap gap-3 mb-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/[0.08] bg-white/[0.02]">
                          <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Min</span>
                          <span className="text-sm font-bold font-mono text-white">$0.50</span>
                        </div>
                        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/[0.08] bg-white/[0.02]">
                          <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Cap</span>
                          <span className="text-sm font-bold font-mono text-white">$25.00</span>
                        </div>
                        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05]">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-xs font-mono text-emerald-300">No separate billing</span>
                        </div>
                      </div>

                      <Link to="/evaluator"
                        className="inline-flex items-center gap-2 px-5 py-2.5 glass-card hover:border-white/15 text-gray-300 hover:text-white font-semibold rounded-xl text-sm transition-all">
                        Learn about the Evaluator <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Worked examples table */}
                  <div className="mt-8 pt-6 border-t border-white/[0.06]">
                    <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-4">Worked examples</p>
                    <div className="rounded-xl border border-white/[0.06] overflow-hidden">
                      {/* Header */}
                      <div className="grid grid-cols-3 px-4 py-2.5 bg-white/[0.03] border-b border-white/[0.06]">
                        <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Job value</span>
                        <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Evaluator fee</span>
                        <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest text-right">Note</span>
                      </div>
                      {/* Rows */}
                      {EVALUATOR_EXAMPLES.map((ex, i) => (
                        <div key={i} className={`grid grid-cols-3 items-center px-4 py-3 ${i < EVALUATOR_EXAMPLES.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
                          <span className="text-sm font-mono text-gray-300">{ex.jobValue}</span>
                          <span className="text-sm font-bold font-mono text-emerald-400">{ex.fee}</span>
                          <span className="text-xs font-mono text-gray-600 text-right">{ex.note}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>

        {/* ── "NEED SOMETHING DIFFERENT" LINE ────────────────────────── */}
        <FadeUp className="mt-12 mb-20">
          <div className="text-center">
            <p className="text-sm text-gray-600 font-mono">
              Need something different?{' '}
              <a href="mailto:api@verifyproceed.com" className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                api@verifyproceed.com
              </a>
            </p>
          </div>
        </FadeUp>

        {/* ── x402 FLOW ─────────────────────────────────────────────── */}
        <FadeUp className="mb-16">
          <div className="text-center mb-8">
            <SectionLabel><RefreshCw className="w-3.5 h-3.5" /> x402 Payment Flow</SectionLabel>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">How machine payments work</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Every call is a self-contained economic transaction. No accounts, no sessions, no state — just atomic HTTP with embedded payments.
            </p>
          </div>
          <X402FlowDiagram />
        </FadeUp>

        {/* ── PER-ENDPOINT COST TABLE ───────────────────────────────── */}
        <FadeUp className="mb-20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <SectionLabel><Terminal className="w-3.5 h-3.5" /> Cost breakdown</SectionLabel>
              <h2 className="text-2xl font-bold text-white mb-2">Per-endpoint pricing</h2>
              <p className="text-gray-500 text-sm">Every endpoint publishes its cost in the capability manifest.</p>
            </div>

            <div className="rounded-2xl overflow-hidden border border-white/[0.07]">
              <div className="grid grid-cols-[auto_1fr_auto] gap-0 divide-y divide-white/[0.05]">
                {/* Header */}
                <div className="col-span-3 grid grid-cols-[auto_1fr_auto] px-5 py-3 bg-white/[0.03] border-b border-white/[0.07]">
                  <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest w-28">Method</span>
                  <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Endpoint</span>
                  <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest text-right">Cost</span>
                </div>

                {ENDPOINT_COSTS.map((ep) => (
                  <div key={ep.path} className="col-span-3 grid grid-cols-[auto_1fr_auto] items-center px-5 py-4 hover:bg-white/[0.015] transition-colors bg-[#07080e]">
                    <div className="w-28">
                      <span className={`text-[10px] font-bold font-mono px-2 py-1 rounded border ${ep.bg} ${ep.color}`}>
                        {ep.method}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-mono text-gray-200">{ep.path}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{ep.desc}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-bold font-mono ${ep.color}`}>{ep.cost}</span>
                      <p className="text-[10px] text-gray-700 font-mono mt-0.5">USDC</p>
                    </div>
                  </div>
                ))}

                {/* Free tier note */}
                <div className="col-span-3 px-5 py-3.5 bg-emerald-500/[0.04] border-t border-emerald-500/15 flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span className="text-xs text-emerald-300/70">
                    All endpoints are free for your first 100 requests / month. No card required.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* ── WHY SUBSCRIPTIONS FAIL ────────────────────────────────── */}
        <div className="mb-24">
          <FadeUp className="text-center mb-12">
            <SectionLabel><Bot className="w-3.5 h-3.5" /> Machine-native economics</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why subscriptions fail<br className="hidden sm:block" /> for autonomous agents
            </h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed">
              Subscriptions were designed for humans with credit cards and monthly budgets. Autonomous agents operate on a different economic model entirely.
            </p>
          </FadeUp>

          <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {WHY_SUBS_FAIL.map((item, i) => {
              const Icon = item.icon;
              return (
                <FadeUp key={item.title} delay={i * 0.08}>
                  <div className={`p-6 rounded-2xl border h-full ${item.bg}`}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.bg}`}>
                        <Icon className={`w-4 h-4 ${item.color}`} />
                      </div>
                      <h3 className="text-white font-bold text-sm leading-snug pt-1">{item.title}</h3>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.body}</p>
                  </div>
                </FadeUp>
              );
            })}
          </div>

          {/* x402 contrast card */}
          <FadeUp delay={0.1} className="max-w-4xl mx-auto mt-5">
            <div className="relative rounded-2xl overflow-hidden border border-blue-500/20 bg-gradient-to-br from-blue-500/[0.06] via-transparent to-purple-500/[0.04] p-8 sm:p-10 text-center">
              <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
              <div className="relative">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Wifi className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">The alternative</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  x402: Pay, verify, proceed.<br />
                  <span className="text-gradient-blue">No humans required.</span>
                </h3>
                <p className="text-gray-400 text-base max-w-2xl mx-auto leading-relaxed mb-6">
                  x402 turns every API call into a self-contained atomic transaction. The agent requests, receives a price, pays in USDC on Base, and retries with cryptographic proof — all within a single request cycle, under 500ms, with no human in the loop.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                  {[
                    { icon: Clock,  label: '<500ms',    sub: 'full cycle' },
                    { icon: Shield, label: 'On-chain',  sub: 'verifiable' },
                    { icon: Zap,    label: 'Per-call',  sub: 'no minimums' },
                    { icon: Lock,   label: 'No key mgmt', sub: 'for agents' },
                  ].map(({ icon: Icon, label, sub }) => (
                    <div key={label} className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-blue-400" />
                      <div className="text-left">
                        <p className="text-white font-semibold text-xs">{label}</p>
                        <p className="text-gray-600 text-[10px]">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        </div>

        {/* ── FAQ ───────────────────────────────────────────────────── */}
        <div className="max-w-2xl mx-auto mb-24">
          <FadeUp className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">Common questions</h2>
          </FadeUp>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        </div>

        {/* ── CTA ───────────────────────────────────────────────────── */}
        <FadeUp className="mb-24">
          <div className="relative rounded-2xl overflow-hidden border border-white/[0.07]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/[0.06]" />
            <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
            <div className="relative px-8 py-14 sm:px-16 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to build autonomous AI agents?
              </h2>
              <p className="text-gray-400 text-base max-w-xl mx-auto mb-8">
                Start for free. No credit card. Upgrade to pay-per-call automatically via x402 when you're ready for production.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link to="/get-api-key"
                  className="flex items-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all hover:shadow-blue-glow">
                  Get free API key <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/docs"
                  className="flex items-center gap-2 px-7 py-3.5 glass-card hover:border-white/15 text-gray-300 hover:text-white font-semibold rounded-xl text-sm transition-all">
                  Read the docs <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </FadeUp>

      </div>

      <Footer />
    </div>
  );
}
