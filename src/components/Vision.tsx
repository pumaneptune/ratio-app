import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

const pillars = [
  {
    label: 'Verification',
    description: 'Pre-execution checks against live on-chain data — before every agent action.',
  },
  {
    label: 'Payment',
    description: 'x402 machine-native micropayments in USDC, settled on Base per request.',
  },
  {
    label: 'Infrastructure',
    description: 'REST API primitives. JSON responses. No SDK required. Developer-first by default.',
  },
];

export default function Vision() {
  return (
    <section id="vision" className="relative py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[900px] h-[400px] rounded-full bg-blue-600/5 blur-[140px]" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-label mb-5 justify-center"
        >
          <Target className="w-3.5 h-3.5" />
          Vision
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-8 leading-tight"
        >
          Verification and payment
          <br className="hidden sm:block" />
          <span className="text-gradient-blue"> infrastructure</span>
          <br className="hidden sm:block" />
          {' '}for autonomous agents.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.16 }}
          className="text-gray-400 text-xl leading-relaxed max-w-3xl mx-auto mb-16"
        >
          When agents become the primary actors in on-chain systems, the infrastructure beneath them must be deterministic, auditable, and machine-native. REST API. JSON responses. Base-native.
        </motion.p>

        {/* Three pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="glass-card rounded-2xl px-6 py-7 border border-white/8 text-left"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-6 rounded-full bg-blue-500/60" />
                <h3 className="text-white font-semibold text-base">{pillar.label}</h3>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">{pillar.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Closing statement */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="inline-block glass-card rounded-2xl border border-blue-500/20 px-8 py-5"
        >
          <p className="text-gray-300 text-sm font-mono tracking-wide">
            <span className="text-blue-400">$</span>{' '}
            <span className="text-gray-400">Infrastructure grade. Agent native. Open by default.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
