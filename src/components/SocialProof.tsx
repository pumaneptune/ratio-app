import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Globe, ArrowRight, Zap, Shield, Server, Cpu } from 'lucide-react';

const proofs = [
  {
    icon: Server,
    iconColor: 'text-blue-400',
    title: 'Base-native',
    badge: 'chain_id: 8453',
    badgeColor: 'text-blue-400 border-blue-500/25 bg-blue-500/[0.07]',
    description: 'USDC settlement and x402 payments run on Base mainnet. Coinbase L2 — EVM-compatible, sub-second finality, production traffic live.',
    tags: ['Base Mainnet', 'L2', 'EVM'],
    border: 'border-blue-500/20 hover:border-blue-500/40',
    stat: { value: '<2s', label: 'settlement finality' },
  },
  {
    icon: Cpu,
    iconColor: 'text-cyan-400',
    title: 'ACP Compatible',
    badge: 'Coinbase Protocol',
    badgeColor: 'text-cyan-400 border-cyan-500/25 bg-cyan-500/[0.07]',
    description: 'POST /v1/acp/guard maps directly to the ACP pre-execution hook. Drop-in integration — no adapter layer, no wrapper required.',
    tags: ['ACP', 'Agent Protocol', 'Coinbase'],
    border: 'border-cyan-500/20 hover:border-cyan-500/40',
    stat: { value: 'Native', label: 'ACP guard hook' },
  },
  {
    icon: Zap,
    iconColor: 'text-purple-400',
    title: 'x402 Compatible',
    badge: 'Open Standard',
    badgeColor: 'text-purple-400 border-purple-500/25 bg-purple-500/[0.07]',
    description: 'HTTP 402 payment protocol — first class. Agents pay per call in USDC on Base. No accounts, no subscriptions, no human authorization.',
    tags: ['x402', 'HTTP Protocol', 'USDC'],
    border: 'border-purple-500/20 hover:border-purple-500/40',
    stat: { value: '0', label: 'human approvals needed' },
  },
  {
    icon: Shield,
    iconColor: 'text-emerald-400',
    title: 'Developer-first',
    badge: 'REST · JSON',
    badgeColor: 'text-emerald-400 border-emerald-500/25 bg-emerald-500/[0.07]',
    description: 'Standard REST over HTTPS. Every response is typed JSON. No SDK required — works with plain fetch in any language.',
    tags: ['REST API', 'JSON', 'No SDK'],
    border: 'border-emerald-500/20 hover:border-emerald-500/40',
    stat: { value: '<300ms', label: 'p99 response time' },
  },
];

const TECH_STACK = ['Base', 'USDC', 'x402', 'ACP', 'EVM', 'REST', 'JSON', 'OpenAPI', 'TLS 1.3', 'TypeScript'];

export default function SocialProof() {
  return (
    <section id="ecosystem" className="relative py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/[0.04] to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-label mb-4"
            >
              <Globe className="w-3.5 h-3.5" />
              Ecosystem Alignment
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-3"
            >
              Base-native.<br />ACP-compatible.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.18 }}
              className="text-gray-400 text-base max-w-lg"
            >
              Same stack as the Coinbase agent ecosystem. x402-payable, USDC-settled, developer-first from day one.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
          >
            <Link to="/about"
              className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium whitespace-nowrap">
              Infrastructure thesis <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* Proof cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {proofs.map((proof, i) => {
            const Icon = proof.icon;
            return (
              <motion.div
                key={proof.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09 }}
                className={`glass-card rounded-2xl p-6 transition-all duration-300 border ${proof.border} cursor-default group`}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center flex-shrink-0">
                      <Icon className={`w-5 h-5 ${proof.iconColor}`} />
                    </div>
                    <h3 className="text-white font-semibold text-base">{proof.title}</h3>
                  </div>
                  <span className={`text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full border flex-shrink-0 ${proof.badgeColor}`}>
                    {proof.badge}
                  </span>
                </div>

                <p className="text-gray-500 text-sm leading-relaxed mb-4">{proof.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {proof.tags.map((tag) => (
                      <span key={tag} className="text-xs font-mono text-gray-600 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex-shrink-0 text-right pl-4">
                    <p className={`text-base font-bold font-mono ${proof.iconColor}`}>{proof.stat.value}</p>
                    <p className="text-[10px] text-gray-700">{proof.stat.label}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tech stack strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2"
        >
          {TECH_STACK.map((badge) => (
            <div key={badge} className="glass-card rounded-lg px-4 py-2">
              <span className="text-gray-500 text-xs font-mono">{badge}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
