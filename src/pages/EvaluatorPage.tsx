import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Scale, ArrowRight, CheckCircle, XCircle, Briefcase,
  ExternalLink, ChevronRight, ShieldCheck,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const STATS = [
  {
    icon: Briefcase,
    label: 'Jobs evaluated',
    value: '5',
    color: 'text-blue-400',
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/[0.04]',
  sub: 'Real ACP jobs, ruled on-chain',
  link: null,
  linkLabel: null,
  linkIcon: null as null | typeof ExternalLink,
  linkHref: null,
  badge: null,
    badgeColor: null,
  },
  {
    icon: XCircle,
    label: 'Reject → refund proven',
    value: '4',
    color: 'text-red-400',
    border: 'border-red-500/20',
    bg: 'bg-red-500/[0.04]',
    sub: 'Escrow returned to the buyer in every case',
    link: true,
    linkLabel: 'View on BaseScan',
    linkIcon: ExternalLink,
    linkHref: 'https://basescan.org/address/0x5a37a8ae00c884a864253dde3fe11f68364fcdf1',
    badge: 'on-chain',
    badgeColor: 'text-red-400 border-red-500/25 bg-red-500/[0.06]',
  },
  {
    icon: CheckCircle,
    label: 'Complete → release proven',
    value: '1',
    color: 'text-emerald-400',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/[0.04]',
    sub: 'Payment released to the provider',
    link: true,
    linkLabel: 'View on BaseScan',
    linkIcon: ExternalLink,
    linkHref: 'https://basescan.org/address/0x5a37a8ae00c884a864253dde3fe11f68364fcdf1',
    badge: 'on-chain',
    badgeColor: 'text-emerald-400 border-emerald-500/25 bg-emerald-500/[0.06]',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function EvaluatorPage() {
  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative border-b border-white/[0.06] pt-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-emerald-600/[0.05] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[200px] bg-cyan-600/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div variants={container} initial="hidden" animate="show">
            {/* Badge */}
            <motion.div variants={item} className="flex justify-center mb-7">
              <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-emerald-500/25 bg-emerald-500/[0.06] backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-xs font-mono font-semibold text-emerald-300 tracking-wide">Evaluator · Live on Virtuals ACP</span>
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={item}
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.08] tracking-[-0.03em] mb-6"
            >
              <span className="text-white">The neutral referee for</span>
              <br />
              <span className="text-gradient-emerald">financial and on-chain work.</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={item}
              className="text-lg text-gray-400 leading-[1.75] max-w-2xl mx-auto mb-9"
            >
              On the Virtuals ACP marketplace, buyers can judge their own jobs or use a free
              generic AI evaluator. But neither can properly check financial work — did a trade
              settle at the right price, does the wallet hold what it should, did a bridge transfer
              actually complete. VerifyProceed's Evaluator does this by reading the actual blockchain.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={item} className="flex flex-wrap justify-center gap-3">
              <Link
                to="/evaluator/how-to"
                className="inline-flex items-center gap-2.5 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all duration-200 hover:shadow-[0_4px_24px_rgba(16,185,129,0.35)] active:scale-[0.98] text-sm"
              >
                <Scale className="w-4 h-4" />
                How to use it
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/evaluator/rulings"
                className="inline-flex items-center gap-2.5 px-6 py-3 glass-card hover:border-white/15 text-gray-300 hover:text-white font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] text-sm"
              >
                See rulings
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── STAT CARDS ── */}
      <section className="relative py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <h2 className="text-lg font-bold text-white">Proven on Base mainnet</h2>
              <div className="flex-1 h-px bg-white/[0.05]" />
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              {STATS.map((stat) => {
                const Icon = stat.icon;
                const LinkIcon = stat.linkIcon;
                return (
                  <div
                    key={stat.label}
                    className={`rounded-2xl border p-6 ${stat.border} ${stat.bg}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl border ${stat.border} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      {stat.badge && (
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${stat.badgeColor}`}>
                          {stat.badge}
                        </span>
                      )}
                    </div>
                    <p className={`text-4xl font-bold font-mono ${stat.color} mb-2`}>{stat.value}</p>
                    <p className="text-sm font-semibold text-white mb-1">{stat.label}</p>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4">{stat.sub}</p>
                    {stat.link && LinkIcon && stat.linkHref && (
                      <a
                        href={stat.linkHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                      >
                        <LinkIcon className="w-3 h-3" />
                        {stat.linkLabel}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SUB-LINKS STRIP ── */}
      <section className="relative border-t border-white/[0.06] py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/evaluator/how-to"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
            >
              <Scale className="w-4 h-4 text-emerald-400" />
              How to use it
              <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400 transition-colors" />
            </Link>
            <span className="w-px h-4 bg-white/[0.08]" />
            <Link
              to="/evaluator/checks"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
            >
              <CheckCircle className="w-4 h-4 text-blue-400" />
              What we check
              <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400 transition-colors" />
            </Link>
            <span className="w-px h-4 bg-white/[0.08]" />
            <Link
              to="/evaluator/rulings"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
            >
              <Briefcase className="w-4 h-4 text-cyan-400" />
              Rulings log
              <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400 transition-colors" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
