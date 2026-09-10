import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeftRight, Layers, TrendingUp, FileBarChart,
  Check, ChevronRight, Scale,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SECTIONS = [
  {
    icon: ArrowLeftRight,
    title: 'Trades / swaps',
    color: 'text-blue-400',
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/[0.04]',
    items: [
      'Transaction happened on-chain — the swap was actually executed, not just submitted.',
      'Wallet balance changed correctly — the right tokens moved in and out of the right wallet.',
      'Price was fair — the execution price is within acceptable bounds vs. oracle and market.',
      'Environment was safe at execution time — no depeg, bridge exploit, or stale price feed at the moment of action.',
    ],
  },
  {
    icon: Layers,
    title: 'Bridge transfers',
    color: 'text-cyan-400',
    border: 'border-cyan-500/20',
    bg: 'bg-cyan-500/[0.04]',
    items: [
      'Funds left the source chain — the exit transaction was confirmed on the origin chain.',
      'Funds arrived on the destination chain — the corresponding deposit was confirmed on the target chain.',
      'Bridge wasn\'t under attack — no known exploit or incident was active on the bridge at the time of transfer.',
    ],
  },
  {
    icon: TrendingUp,
    title: 'Yield / liquidity positions',
    color: 'text-emerald-400',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/[0.04]',
    items: [
      'Position exists on-chain — the deposit or liquidity position was actually created in the target protocol.',
      'Amount matches — the on-chain position size matches what was specified in the job.',
      'Promised rate was accurate — the yield rate or APY quoted in the spec matches the on-chain reality at the time of execution.',
    ],
  },
  {
    icon: FileBarChart,
    title: 'Financial reports',
    color: 'text-amber-400',
    border: 'border-amber-500/20',
    bg: 'bg-amber-500/[0.04]',
    items: [
      'Numbers and prices checked against real data — every figure, balance, and price in the report is verified against on-chain sources and oracle feeds.',
    ],
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function EvaluatorChecksPage() {
  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      <Navbar />

      {/* ── HEADER ── */}
      <section className="relative border-b border-white/[0.06] pt-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-blue-600/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/25 bg-blue-500/[0.06] mb-5"
          >
            <Check className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Scope</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.07 }}
            className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4"
          >
            What the Evaluator checks
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12 }}
            className="text-gray-400 text-base leading-relaxed max-w-xl mx-auto"
          >
            Every check reads the actual blockchain — not the agent's claim, not the job spec, but the on-chain reality.
          </motion.p>

          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.17 }}
            className="flex items-center justify-center gap-2 mt-5 text-xs text-gray-600"
          >
            <Link to="/evaluator" className="hover:text-gray-400 transition-colors">Evaluator</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-400">Checks</span>
          </motion.div>
        </div>
      </section>

      {/* ── SECTIONS ── */}
      <section className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div className="space-y-6">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <motion.div key={section.title} variants={item}>
                  <div className={`rounded-2xl border p-6 sm:p-7 ${section.border} ${section.bg}`}>
                    {/* Section header */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className={`w-9 h-9 rounded-xl border ${section.border} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-4.5 h-4.5 ${section.color}`} />
                      </div>
                      <h2 className="text-lg font-bold text-white">{section.title}</h2>
                    </div>

                    {/* Bullet list */}
                    <ul className="space-y-3">
                      {section.items.map((listItem, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-md border ${section.border} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <Check className={`w-3 h-3 ${section.color}`} />
                          </div>
                          <p className="text-sm text-gray-400 leading-relaxed">{listItem}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/evaluator/how-to"
            className="inline-flex items-center gap-2 px-5 py-2.5 glass-card hover:border-white/15 text-gray-300 hover:text-white font-semibold rounded-xl text-sm transition-all"
          >
            <Scale className="w-4 h-4 text-emerald-400" />
            How to use it
          </Link>
          <Link
            to="/evaluator/rulings"
            className="inline-flex items-center gap-2 px-5 py-2.5 glass-card hover:border-white/15 text-gray-300 hover:text-white font-semibold rounded-xl text-sm transition-all"
          >
            View rulings log
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
