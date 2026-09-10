import { motion } from 'framer-motion';
import { Clock, Bot, ShieldCheck, CreditCard, Zap, DollarSign } from 'lucide-react';

const points = [
  {
    icon: Bot,
    headline: 'LLM agents now execute autonomously',
    body: 'Agents transact continuously — managing capital, bridging assets, coordinating with other agents — without human approval. Each action needs a verification gate.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
  {
    icon: ShieldCheck,
    headline: 'Verification must happen at the API layer',
    body: 'When an agent acts without oversight, a wrong action is immediate and irreversible. The guard call must run before execution — not after.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  {
    icon: CreditCard,
    headline: 'APIs need machine-native payment rails',
    body: 'API keys issued to humans cannot be dynamically priced or paid by an agent in real time. Autonomous billing requires a different primitive than SaaS.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
  },
  {
    icon: Zap,
    headline: 'x402 makes HTTP APIs payable by agents',
    body: 'HTTP 402 signals payment required. Agent pays in USDC on-chain, then retries. No wallets-as-UI, no invoicing, no human authorization in the flow.',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10 border-sky-500/20',
  },
  {
    icon: DollarSign,
    headline: 'Base makes per-call USDC settlement practical',
    body: 'Base mainnet offers sub-cent transaction fees and fast finality. Micropayments for individual API calls are economically viable at production scale.',
    color: 'text-teal-400',
    bg: 'bg-teal-500/10 border-teal-500/20',
  },
];

export default function WhyNow() {
  return (
    <section id="why-now" className="relative py-28">
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-label mb-4 justify-center"
          >
            <Clock className="w-3.5 h-3.5" />
            Why Now
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4"
          >
            Five conditions. One moment.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            ACP, x402, and Base converged to make verification infrastructure for autonomous agents viable and necessary right now.
          </motion.p>
        </div>

        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-blue-500/30 via-cyan-500/20 to-transparent hidden sm:block" />

          <div className="space-y-4">
            {points.map((point, i) => {
              const Icon = point.icon;
              return (
                <motion.div
                  key={point.headline}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative flex gap-6 glass-card rounded-2xl px-6 py-5 border border-white/6 hover:border-white/10 transition-colors duration-200"
                >
                  {/* Step number */}
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${point.bg}`}>
                      <Icon className={`w-4 h-4 ${point.color}`} />
                    </div>
                    <span className="text-[10px] font-mono text-gray-700 mt-1">{String(i + 1).padStart(2, '0')}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className={`text-base font-semibold mb-1.5 ${point.color}`}>{point.headline}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{point.body}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
