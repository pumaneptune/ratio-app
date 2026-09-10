import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Zap, CheckCircle, CreditCard, RefreshCw, ArrowRight, ArrowDown } from 'lucide-react';

const flowSteps = [
  {
    icon: ArrowRight,
    step: '01',
    title: 'Agent calls API',
    detail: 'POST /v1/acp/guard',
    color: 'text-blue-400',
    border: 'border-blue-500/25',
    bg: 'bg-blue-500/8',
    glow: 'rgba(59,130,246,0.15)',
    connector: 'bg-gradient-to-b from-blue-500/30 to-yellow-500/20',
  },
  {
    icon: CreditCard,
    step: '02',
    title: 'API returns 402',
    detail: 'Payment Required',
    color: 'text-yellow-300',
    border: 'border-yellow-500/25',
    bg: 'bg-yellow-500/8',
    glow: 'rgba(234,179,8,0.12)',
    connector: 'bg-gradient-to-b from-yellow-500/20 to-purple-500/20',
  },
  {
    icon: Zap,
    step: '03',
    title: 'Agent pays in USDC',
    detail: '$0.01 on Base',
    color: 'text-purple-400',
    border: 'border-purple-500/25',
    bg: 'bg-purple-500/8',
    glow: 'rgba(168,85,247,0.15)',
    connector: 'bg-gradient-to-b from-purple-500/20 to-cyan-500/20',
  },
  {
    icon: RefreshCw,
    step: '04',
    title: 'Request retries',
    detail: 'Automatically',
    color: 'text-cyan-400',
    border: 'border-cyan-500/25',
    bg: 'bg-cyan-500/8',
    glow: 'rgba(34,211,238,0.12)',
    connector: 'bg-gradient-to-b from-cyan-500/20 to-emerald-500/20',
  },
  {
    icon: CheckCircle,
    step: '05',
    title: 'Verified response',
    detail: '{ verdict: "proceed" }',
    color: 'text-emerald-400',
    border: 'border-emerald-500/25',
    bg: 'bg-emerald-500/8',
    glow: 'rgba(52,211,153,0.15)',
    connector: null,
  },
];

// Live transaction feed
const txFeed = [
  { agent: '0xBot...a4f2', amount: '0.001', ms: 183, verdict: 'proceed' },
  { agent: '0xDAO...c91b', amount: '0.001', ms: 211, verdict: 'proceed' },
  { agent: '0xDeFi...77e3', amount: '0.001', ms: 156, verdict: 'block' },
  { agent: '0xArb...5520', amount: '0.001', ms: 198, verdict: 'proceed' },
  { agent: '0xMEV...d108', amount: '0.001', ms: 241, verdict: 'proceed' },
  { agent: '0xYld...f330', amount: '0.001', ms: 172, verdict: 'proceed' },
];

function LiveTxFeed() {
  const [items, setItems] = useState<typeof txFeed>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const add = () => {
      setItems(prev => [txFeed[idx % txFeed.length], ...prev].slice(0, 4));
      setIdx(i => i + 1);
    };
    add();
    const t = setInterval(add, 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {items.map((tx, i) => (
          <motion.div
            key={`${tx.agent}-${i}`}
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-white/[0.025] border border-white/[0.05]"
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${tx.verdict === 'proceed' ? 'bg-emerald-400' : 'bg-red-400'}`} />
              <span className="text-xs font-mono text-gray-400">{tx.agent}</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-purple-400">{tx.amount} USDC</span>
              <span className="text-gray-600">{tx.ms}ms</span>
              <span className={tx.verdict === 'proceed' ? 'text-emerald-400' : 'text-red-400'}>
                {tx.verdict}
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function FlowDiagram() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const advance = () => {
      setActiveStep(i);
      i++;
      if (i < flowSteps.length) setTimeout(advance, 320);
    };
    setTimeout(advance, 300);
  }, [inView]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-0">
      {flowSteps.map((step, i) => {
        const Icon = step.icon;
        const isActive = activeStep >= i;
        return (
          <div key={step.step} className="flex flex-col items-center w-full max-w-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={isActive ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <div
                className={`flex items-center gap-4 px-5 py-4 rounded-xl border transition-all duration-500 ${step.bg} ${step.border}`}
                style={{ boxShadow: isActive ? `0 0 24px ${step.glow}` : 'none' }}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border ${step.bg} ${step.border}`}>
                  <Icon className={`w-4.5 h-4.5 ${step.color}`} style={{ width: 18, height: 18 }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold ${step.color}`}>{step.title}</div>
                  <div className="text-xs font-mono text-gray-500 mt-0.5 truncate">{step.detail}</div>
                </div>
                <span className="text-xs font-mono text-gray-700 flex-shrink-0">{step.step}</span>
              </div>
            </motion.div>

            {step.connector && (
              <motion.div
                initial={{ scaleY: 0, opacity: 0 }}
                animate={isActive ? { scaleY: 1, opacity: 1 } : {}}
                transition={{ duration: 0.25, delay: 0.1 }}
                style={{ transformOrigin: 'top' }}
                className="flex flex-col items-center py-0.5"
              >
                <div className={`w-px h-5 ${step.connector}`} />
                <ArrowDown className="w-3 h-3 text-gray-700 -mt-1" />
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function X402Section() {
  return (
    <section id="x402" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-purple-950/[0.08] to-[#050508]" />
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-purple-600/[0.06] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── HEADER ── */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-label mb-5 justify-center"
            style={{ color: '#a78bfa' }}
          >
            <Zap className="w-3.5 h-3.5" />
            x402 Protocol
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.04] mb-6"
          >
            HTTP 402.<br />
            <span style={{
              background: 'linear-gradient(135deg, #a78bfa 0%, #818cf8 50%, #60a5fa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              USDC on Base.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 leading-relaxed"
          >
            x402 extends standard HTTP. A 402 response signals payment required. Agent pays in USDC on Base, request retries. No billing portal, no subscriptions, no human in the loop.
          </motion.p>
        </div>

        {/* ── CALLOUT BOX ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="max-w-2xl mx-auto mb-20"
        >
          <div className="relative rounded-2xl overflow-hidden">
            {/* Gradient border */}
            <div className="absolute inset-0 rounded-2xl p-px bg-gradient-to-r from-purple-500/40 via-blue-500/40 to-purple-500/40">
              <div className="w-full h-full rounded-2xl bg-[#050508]" />
            </div>
            <div className="relative px-7 py-6 bg-gradient-to-br from-purple-500/[0.07] via-transparent to-blue-500/[0.07] rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Zap className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-base font-semibold text-white leading-relaxed mb-1">
                    Not SaaS billing.
                  </p>
                  <p className="text-gray-400 leading-relaxed">
                    Per-request USDC payments between agents, settled on Base in under 2 seconds. No human authorization, no monthly invoice, no account management. Each API call is a micropayment. Each agent is a first-class payer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start">

          {/* LEFT: Animated flow diagram */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-2">Request flow</h3>
              <p className="text-gray-500 text-sm">Every request follows this exact sequence — no human steps.</p>
            </div>
            <FlowDiagram />
          </motion.div>

          {/* RIGHT: Live feed + stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Live transaction feed */}
            <div className="glass-card rounded-xl overflow-hidden border border-white/[0.07]">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-semibold text-white">Live Transactions</span>
                </div>
                <span className="text-xs font-mono text-gray-600">Base Mainnet</span>
              </div>

              {/* Column headers */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.03]">
                <span className="text-[10px] font-mono text-gray-700 uppercase tracking-wider">Agent</span>
                <div className="flex items-center gap-4 text-[10px] font-mono text-gray-700 uppercase tracking-wider">
                  <span className="w-16 text-right">Amount</span>
                  <span className="w-10 text-right">Latency</span>
                  <span className="w-12 text-right">Verdict</span>
                </div>
              </div>

              <div className="px-4 py-3">
                <LiveTxFeed />
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Per request', value: '$0.01', sub: 'USDC on Base', color: 'text-purple-400', border: 'border-purple-500/20' },
                { label: 'Settlement', value: '< 2s', sub: 'Base finality', color: 'text-emerald-400', border: 'border-emerald-500/20' },
                { label: 'Protocol', value: 'x402', sub: 'HTTP extension', color: 'text-blue-400', border: 'border-blue-500/20' },
                { label: 'Human approval', value: 'Zero', sub: 'Fully autonomous', color: 'text-cyan-400', border: 'border-cyan-500/20' },
              ].map((s) => (
                <div key={s.label} className={`glass-card rounded-xl p-4 border ${s.border}`}>
                  <div className={`text-2xl font-bold font-mono ${s.color} mb-0.5`}>{s.value}</div>
                  <div className="text-xs text-gray-400 font-medium">{s.label}</div>
                  <div className="text-[11px] text-gray-600 mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Ecosystem badges */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Base Mainnet', color: 'text-blue-400 border-blue-500/20 bg-blue-500/5' },
                { label: 'USDC Native', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' },
                { label: 'ERC-20', color: 'text-purple-400 border-purple-500/20 bg-purple-500/5' },
                { label: 'RFC-9110', color: 'text-gray-400 border-gray-500/20 bg-gray-500/5' },
                { label: 'No KYC', color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5' },
              ].map((badge) => (
                <span key={badge.label} className={`px-3 py-1.5 rounded-full text-xs font-mono border ${badge.color}`}>
                  {badge.label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── COMPARISON CALLOUT ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          {[
            { label: 'Traditional API', items: ['Monthly subscription', 'Human-managed billing', 'Credit card required', 'Account management'], bad: true },
            { label: '', isVs: true },
            { label: 'x402 API', items: ['Per-request USDC payment', 'Agent-managed wallet', 'Pay only what you use', 'No human overhead'], bad: false },
          ].map((col, i) => {
            if (col.isVs) return (
              <div key={i} className="flex items-center justify-center">
                <div className="w-12 h-12 rounded-full glass-card border border-white/[0.08] flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-500">VS</span>
                </div>
              </div>
            );
            return (
              <div key={i} className={`glass-card rounded-xl p-5 border ${col.bad ? 'border-red-500/15' : 'border-emerald-500/20'}`}>
                <div className={`text-xs font-semibold mb-3 ${col.bad ? 'text-red-400' : 'text-emerald-400'}`}>{col.label}</div>
                <ul className="space-y-2">
                  {col.items?.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-gray-400">
                      <span className={`w-1 h-1 rounded-full flex-shrink-0 ${col.bad ? 'bg-red-500/50' : 'bg-emerald-500/60'}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
