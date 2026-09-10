import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Zap, CreditCard, Activity, TrendingDown, Lock, Bot, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Shield,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    title: 'Pre-execution Guard',
    description: 'POST /v1/acp/guard runs multi-signal checks before any on-chain action. Bridge exploit monitor, RPC health, price deviation — all in parallel.',
    tags: ['Guard API', 'DeFi', 'Real-time'],
  },
  {
    icon: Zap,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
    title: 'Deterministic Verdicts',
    description: 'Every response is typed JSON. Verdict is binary: proceed or block. Confidence score and per-check breakdown on every call. No ambiguity.',
    tags: ['ACP', 'Structured JSON', 'Typed'],
  },
  {
    icon: CreditCard,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    title: 'x402 Agent Payments',
    description: 'Agents pay per call in USDC on Base via x402. HTTP 402 challenge — agent pays — request retries. No accounts. No subscriptions. No humans.',
    tags: ['x402', 'USDC', 'Base'],
  },
  {
    icon: Activity,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
    title: 'DeFi Threat Detection',
    description: 'Live checks for bridge exploits, DEX manipulation, liquidity drain, and cross-chain anomalies on Base, Ethereum, and Arbitrum.',
    tags: ['Bridges', 'DEX', 'Liquidity'],
  },
  {
    icon: TrendingDown,
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    title: 'Stablecoin Intelligence',
    description: 'Depeg detection for USDC, USDT, DAI. Checks collateral health and DEX liquidity depth before your agent swaps or bridges.',
    tags: ['Depeg', 'USDC', 'Alerts'],
  },
  {
    icon: Lock,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    title: 'Configurable Policies',
    description: 'conservative, balanced, or aggressive risk thresholds — scoped per agent, per chain, per action. Full reasoning trace in every JSON response.',
    tags: ['Decide API', 'Per-Agent', 'Policy'],
  },
  {
    icon: Bot,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
    title: 'ACP Native',
    description: 'POST /v1/acp/guard maps directly to the ACP pre-execution hook. Drop-in — no adapter layer, no wrapper, no middleware required.',
    tags: ['ACP', 'Coinbase', 'Agent'],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Features() {
  return (
    <section id="features" className="relative py-28">
      <div className="absolute inset-0 grid-bg opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-label mb-4 justify-center"
          >
            <Shield className="w-3.5 h-3.5" />
            Platform Capabilities
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4"
          >
            What the API does.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Four endpoints. Two verification primitives. x402-payable on Base — no human billing required.
          </motion.p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          transition={{ staggerChildren: 0.07 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} variants={cardVariants} className="feature-card">
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center mb-4 ${feature.bg}`}>
                  <Icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <h3 className="text-white font-semibold text-base mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{feature.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {feature.tags.map((tag) => (
                    <span key={tag} className="text-xs font-mono text-gray-600 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}

          {/* CTA card — 8th slot */}
          <motion.div variants={cardVariants}
            className="feature-card flex flex-col justify-between border-dashed border-white/[0.08] hover:border-blue-500/30">
            <div>
              <p className="text-[10px] font-mono text-gray-700 uppercase tracking-widest mb-3">Get started</p>
              <p className="text-white font-semibold text-sm mb-2">100 free calls / month.</p>
              <p className="text-gray-600 text-xs leading-relaxed">No credit card. No billing setup. API key in 30 seconds — make your first verified call in under 5 minutes.</p>
            </div>
            <Link to="/get-api-key"
              className="mt-6 flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium">
              Get API Key <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="text-center"
        >
          <Link to="/api"
            className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium">
            Explore full API reference <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
