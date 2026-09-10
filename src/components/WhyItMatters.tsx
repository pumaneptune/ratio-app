import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AlertTriangle, Bot, CreditCard, Zap, X, Check, ArrowRight } from 'lucide-react';

const points = [
  {
    icon: Bot,
    color: 'text-blue-400',
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/[0.05]',
    tag: 'TRUST LAYER',
    title: 'No pre-execution safety checks exist.',
    body: 'LangChain, AutoGPT, and every major agent framework executes on-chain with zero verification. Bridge exploits, MEV attacks, depeg events — all happen in seconds. An agent with no guard layer is unprotected capital.',
    stat: '$2.8B+ lost to DeFi exploits in 2024.',
  },
  {
    icon: CreditCard,
    color: 'text-emerald-400',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/[0.05]',
    tag: 'MONETIZATION',
    title: 'SaaS billing cannot scale to agents.',
    body: 'Every API billing system — Stripe, AWS, OpenAI — requires a human to register, enter a card, and manage a subscription. A fleet of 10,000 autonomous agents cannot do any of that. Per-request, agent-managed payments require a different primitive.',
    stat: 'Zero APIs natively support autonomous agent billing.',
  },
  {
    icon: Zap,
    color: 'text-purple-400',
    border: 'border-purple-500/20',
    bg: 'bg-purple-500/[0.05]',
    tag: 'TIMING',
    title: 'Agent wallets are live on Base now.',
    body: "Coinbase's ACP is in production. Agent wallets holding USDC are active on Base. The missing primitive is an API agents can call for pre-execution verification — and pay autonomously via x402. That infrastructure exists today.",
    stat: 'ACP production launch: Q2 2025.',
  },
  {
    icon: AlertTriangle,
    color: 'text-orange-400',
    border: 'border-orange-500/20',
    bg: 'bg-orange-500/[0.04]',
    tag: 'SCALE',
    title: 'Monthly billing breaks at agent scale.',
    body: 'One developer manages one subscription. A thousand agents cannot manage a thousand subscriptions. Monthly cycles assume human oversight and a billing portal — neither of which exist in an autonomous agent economy.',
    stat: 'x402 enables per-request, per-agent, autonomous USDC payment.',
  },
];

export default function WhyItMatters() {
  return (
    <section id="why" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/[0.06] to-transparent" />
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── HEADER ── */}
        <div className="max-w-3xl mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-label mb-5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Why It Matters
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.04] mb-8"
          >
            Four gaps that block
            <br />
            <span className="text-gradient-blue">autonomous execution.</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18 }}
            className="relative"
          >
            <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/60 via-blue-500/30 to-transparent" />
            <p className="text-lg text-gray-300 leading-relaxed pl-4">
              Agents can already execute complex on-chain workflows. The constraint is infrastructure: no verification primitive, no pre-execution safety layer, no machine-native payment rails. Those gaps close here.
            </p>
          </motion.div>
        </div>

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* LEFT: Problem cards */}
          <div className="space-y-4">
            {points.map((point, i) => {
              const Icon = point.icon;
              return (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`rounded-xl p-5 border ${point.border} ${point.bg} transition-all duration-300`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-9 h-9 rounded-lg border ${point.border} flex items-center justify-center bg-white/[0.03]`}>
                      <Icon className={`w-[18px] h-[18px] ${point.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-[10px] font-bold font-mono tracking-widest mb-1.5 ${point.color}`}>{point.tag}</div>
                      <h3 className="text-white font-bold text-sm leading-snug mb-2">{point.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-3">{point.body}</p>
                      <p className={`text-[11px] font-mono ${point.color} opacity-70`}>{point.stat}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* RIGHT: Before/after + signals */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="space-y-5 lg:sticky lg:top-24"
          >
            {/* Before/after comparison */}
            <div className="glass-card rounded-xl overflow-hidden border border-white/[0.07]">
              <div className="grid grid-cols-2 divide-x divide-white/[0.06]">
                <div className="px-5 py-3.5 border-b border-white/[0.06]">
                  <span className="text-[10px] font-bold font-mono text-red-400 tracking-widest">WITHOUT ACP</span>
                </div>
                <div className="px-5 py-3.5 border-b border-white/[0.06]">
                  <span className="text-[10px] font-bold font-mono text-emerald-400 tracking-widest">WITH ACP</span>
                </div>
              </div>
              {[
                { bad: 'No safety checks before execution',   good: 'Pre-execution guard on every call' },
                { bad: 'Blind to bridge exploits',           good: 'Real-time exploit monitoring' },
                { bad: 'Human billing required',             good: 'x402 agent-paid per request' },
                { bad: 'Monthly subscriptions',              good: 'Pay only what you use' },
                { bad: 'Unknown risk exposure',              good: 'Confidence score on every verdict' },
                { bad: 'No ACP verification hook',           good: 'Native ACP guard endpoint' },
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-2 divide-x divide-white/[0.04] border-t border-white/[0.04]">
                  <div className="flex items-center gap-2.5 px-5 py-3">
                    <X className="w-3 h-3 text-red-500/60 flex-shrink-0" />
                    <span className="text-xs text-gray-500 leading-snug">{row.bad}</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-5 py-3">
                    <Check className="w-3 h-3 text-emerald-500/70 flex-shrink-0" />
                    <span className="text-xs text-gray-300 leading-snug">{row.good}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: '$2.8B+',  label: 'DeFi exploits in 2024',        color: 'text-red-400' },
                { value: '<300ms',  label: 'Verification response time',    color: 'text-blue-400' },
                { value: '$0.01',   label: 'Per request via x402',          color: 'text-purple-400' },
                { value: 'Base',    label: 'Mainnet settlement · USDC',     color: 'text-emerald-400' },
              ].map((stat) => (
                <div key={stat.label} className="glass-card rounded-xl p-4">
                  <div className={`text-2xl font-bold font-mono ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-xs text-gray-600 leading-snug">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Investor/ecosystem signal */}
            <div className="glass-card rounded-xl p-5 border border-white/[0.06]">
              <p className="text-[10px] font-mono text-gray-700 uppercase tracking-widest mb-3">Market timing</p>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                Coinbase's ACP is live. Agent wallets holding USDC are active on Base. Verification and USDC settlement via x402 are the missing primitives that make autonomous execution production-safe.
              </p>
              <Link to="/about"
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium">
                Read our infrastructure thesis <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
