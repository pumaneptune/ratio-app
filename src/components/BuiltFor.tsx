import { motion } from 'framer-motion';
import { Zap, TrendingUp, ArrowLeftRight, Users } from 'lucide-react';

const targets = [
  {
    icon: Zap,
    title: 'Liquidation bots',
    description: 'Don\'t liquidate based on a broken price feed.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
  },
  {
    icon: TrendingUp,
    title: 'Yield optimizers',
    description: 'Don\'t move money into a stablecoin that\'s losing its value.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  {
    icon: ArrowLeftRight,
    title: 'Bridge-dependent agents',
    description: 'Don\'t send funds through a bridge that was just hacked.',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10 border-sky-500/20',
  },
];

export default function BuiltFor() {
  return (
    <section id="built-for" className="relative py-28">
      <div className="absolute inset-0 grid-bg opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-label mb-4 justify-center"
          >
            <Users className="w-3.5 h-3.5" />
            Built For
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4"
          >
            Who uses this.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-xl mx-auto"
          >
            Any agent, bot, or automated system that executes on-chain and needs a deterministic safety check before it does.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {targets.map((target, i) => {
            const Icon = target.icon;
            return (
              <motion.div
                key={target.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="feature-card"
              >
                <div className={`w-9 h-9 rounded-lg border flex items-center justify-center mb-3 ${target.bg}`}>
                  <Icon className={`w-4 h-4 ${target.color}`} />
                </div>
                <h3 className="text-white font-semibold text-sm mb-1.5">{target.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{target.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
