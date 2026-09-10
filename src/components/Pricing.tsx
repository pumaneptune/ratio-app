import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Zap, Terminal, Building2, ChevronRight, Users } from 'lucide-react';

const txFlow = [
  { label: 'API Request', color: 'text-blue-400', border: 'border-blue-500/25', bg: 'bg-blue-500/8' },
  { label: '402 Payment Required', color: 'text-yellow-300', border: 'border-yellow-500/25', bg: 'bg-yellow-500/8' },
  { label: 'USDC Payment', color: 'text-purple-400', border: 'border-purple-500/25', bg: 'bg-purple-500/8' },
  { label: 'Verified Response', color: 'text-emerald-400', border: 'border-emerald-500/25', bg: 'bg-emerald-500/8' },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-25" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/[0.06] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── HEADER ── */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-label mb-5 justify-center"
          >
            <Zap className="w-3.5 h-3.5" />
            Pricing
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.04] mb-6"
          >
            Pricing that fits<br />
            <span className="text-gradient-blue">how you run.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 leading-relaxed"
          >
            Three ways to pay, depending on how your system runs — from free testing to a flat monthly plan to pure pay-per-call.
          </motion.p>
        </div>

        {/* ── TX FLOW ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-20"
        >
          {txFlow.map((step, i) => (
            <div key={step.label} className="flex items-center gap-2">
              <span className={`px-4 py-2 rounded-xl border text-xs font-mono font-medium ${step.color} ${step.border} ${step.bg}`}>
                {step.label}
              </span>
              {i < txFlow.length - 1 && (
                <ChevronRight className="w-4 h-4 text-gray-700 flex-shrink-0" />
              )}
            </div>
          ))}
        </motion.div>

        {/* ── PRICING CARDS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

          {/* FREE TIER */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="glass-card rounded-2xl p-7 border border-white/[0.06] flex flex-col"
          >
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Free Tier</span>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-5xl font-bold text-white tracking-tight">Free</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Start building. Explore the API. No payment method needed to get started.
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {[
                '100 requests / month',
                'No card required',
                'API key access',
                'Public endpoints',
                'Basic verification',
              ].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-gray-400">
                  <Check className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <Link to="/get-api-key" className="w-full py-3 px-4 text-gray-500 hover:text-blue-400 text-sm font-medium transition-colors flex items-center justify-center gap-2">
              Get API Key
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* TEAM TIER */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative glass-card rounded-2xl p-7 border border-blue-500/20 flex flex-col"
          >
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-blue-600">
                <Zap className="w-3 h-3" />
                Popular
              </span>
            </div>

            <div className="mb-6 mt-3">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">Team</span>
              </div>

              <div className="mb-2">
                <span className="text-5xl font-bold text-white tracking-tight leading-none">$49</span>
              </div>
              <div className="text-sm font-mono text-gray-500 mb-3">/month</div>

              <p className="text-gray-500 text-sm leading-relaxed">
                25,000 requests / month · billed by card via Stripe
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {[
                '25,000 requests included',
                'Standard API key auth — no wallet required',
                'Email support',
                'Overage billed at $0.01/request',
              ].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-gray-400">
                  <Check className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <Link to="/get-api-key"
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all duration-200 hover:shadow-blue-glow active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Start Building
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* PAY-PER-CALL — highlighted */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="relative flex flex-col"
          >
            {/* Glowing border wrapper */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-blue-500/35 via-cyan-500/20 to-blue-500/25 p-px">
              <div className="w-full h-full rounded-2xl bg-[#060810]" />
            </div>

            {/* Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-blue-600">
                <Zap className="w-3 h-3" />
                Machine-Native Pricing
              </span>
            </div>

            <div
              className="relative z-10 rounded-2xl p-7 flex flex-col h-full mt-0"
              style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.07) 0%, rgba(6,182,212,0.04) 50%, rgba(59,130,246,0.07) 100%)' }}
            >
              <div className="mb-6 mt-3">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">Pay-Per-Call</span>
                </div>

                <div className="mb-2">
                  <span className="text-5xl font-bold text-white tracking-tight leading-none">$0.01</span>
                </div>
                <div className="text-sm font-mono text-gray-500 mb-3">per request · USDC on Base</div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/[0.08] border border-cyan-500/20 text-xs font-mono text-cyan-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  Paid automatically via x402 · USDC on Base
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {[
                  { text: 'No subscriptions required', accent: true },
                  { text: 'No billing portal required', accent: true },
                  { text: 'Paid automatically in USDC on Base', accent: false },
                  { text: 'No billing account required', accent: false },
                  { text: 'Designed for autonomous agents', accent: false },
                  { text: 'Unlimited requests', accent: false },
                  { text: 'Full verification suite', accent: false },
                ].map((f) => (
                  <li key={f.text} className="flex items-center gap-2.5 text-sm">
                    <Check className={`w-3.5 h-3.5 flex-shrink-0 ${f.accent ? 'text-blue-400' : 'text-emerald-500/70'}`} />
                    <span className={f.accent ? 'text-white font-medium' : 'text-gray-400'}>{f.text}</span>
                  </li>
                ))}
              </ul>

              <Link to="/get-api-key"
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all duration-200 hover:shadow-blue-glow active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Start Building
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* ── BOTTOM NOTE ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-14 text-center"
        >
          <p className="text-sm text-gray-600 font-mono">
            ACP endpoints support x402 USDC payments on Base.{' '}
            <Link to="/docs" className="text-blue-500 hover:text-blue-400 transition-colors">
              How x402 works →
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
