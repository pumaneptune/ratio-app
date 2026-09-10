import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';

const badges = [
  { label: 'Base Mainnet', color: 'text-blue-300', bg: 'bg-blue-500/10 border-blue-500/25', dot: 'bg-blue-400' },
  { label: 'USDC', color: 'text-emerald-300', bg: 'bg-emerald-500/10 border-emerald-500/25', dot: 'bg-emerald-400' },
  { label: 'x402 Enabled', color: 'text-cyan-300', bg: 'bg-cyan-500/10 border-cyan-500/25', dot: 'bg-cyan-400' },
  { label: 'ACP Compatible', color: 'text-sky-300', bg: 'bg-sky-500/10 border-sky-500/25', dot: 'bg-sky-400' },
  { label: 'Virtuals ACP Listed', color: 'text-teal-300', bg: 'bg-teal-500/10 border-teal-500/25', dot: 'bg-teal-400' },
];

export default function BaseEcosystem() {
  return (
    <section id="base-ecosystem" className="relative py-28">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/4 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-label mb-5"
            >
              <Layers className="w-3.5 h-3.5" />
              Base Ecosystem
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-6 leading-tight"
            >
              Base-native.{' '}
              <span className="text-gradient-blue">USDC settlement.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.14 }}
              className="text-gray-400 text-lg leading-relaxed mb-10 max-w-xl"
            >
              VerifyProceed runs on Base mainnet. Payments are in USDC via x402. Chain ID 8453 — not a testnet, not a simulation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-3"
            >
              {badges.map((badge, i) => (
                <motion.span
                  key={badge.label}
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.22 + i * 0.06 }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium font-mono tracking-wide ${badge.bg} ${badge.color}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${badge.dot} flex-shrink-0`} />
                  {badge.label}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Right: infrastructure diagram */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="glass-card rounded-2xl p-8 border border-white/8">
              <div className="space-y-3">
                {/* Layer stack */}
                {[
                  { label: 'Agent Layer', sublabel: 'Autonomous LLM agents / ACP clients', color: 'border-blue-500/40 bg-blue-500/6', text: 'text-blue-300', dot: 'bg-blue-400', mono: true },
                  { label: 'x402 Protocol', sublabel: 'HTTP 402 → payment-required challenge → USDC → retry', color: 'border-cyan-500/40 bg-cyan-500/6', text: 'text-cyan-300', dot: 'bg-cyan-400', mono: true },
                  { label: 'VerifyProceed API', sublabel: 'Decision verification · Guard · ACP', color: 'border-emerald-500/40 bg-emerald-500/6', text: 'text-emerald-300', dot: 'bg-emerald-400', mono: false },
                  { label: 'Base Mainnet', sublabel: 'USDC settlement · low-cost · fast finality', color: 'border-sky-500/40 bg-sky-500/6', text: 'text-sky-300', dot: 'bg-sky-400', mono: false },
                ].map((layer, i) => (
                  <motion.div
                    key={layer.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.09 }}
                    className={`rounded-xl border px-5 py-4 ${layer.color}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-semibold ${layer.text} ${layer.mono ? 'font-mono' : ''}`}>{layer.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{layer.sublabel}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${layer.dot} opacity-70`} />
                    </div>
                  </motion.div>
                ))}

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-gray-600 font-mono">settlement layer</span>
                  <span className="text-xs text-gray-600 font-mono">chain_id: 8453</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
