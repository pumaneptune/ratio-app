import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Copy, Check, ShieldCheck, ArrowRight } from 'lucide-react';

const WALLET = '0x5a37a8ae00c884a864253dde3fe11f68364fcdf1';

export default function NeutralEvaluator() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(WALLET).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-600/[0.06] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          {/* Glowing gradient border */}
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-emerald-500/30 via-cyan-500/20 to-emerald-500/30 blur-sm" />
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-emerald-500/40 via-cyan-500/25 to-emerald-500/40" />

          <div className="relative rounded-2xl bg-[#070810] overflow-hidden">
            {/* Inner subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.04] via-transparent to-cyan-500/[0.04]" />

            <div className="relative px-6 sm:px-10 py-10 sm:py-12">
              {/* Eyebrow + LIVE badge */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/25">
                  NEW
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/25">
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1], scale: [1, 0.85, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  />
                  LIVE
                </span>
              </div>

              {/* Title */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                  Neutral Evaluator on Virtuals ACP
                </h2>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-2xl mb-5">
                VerifyProceed rules on other agents' ACP job deliverables before payment releases, using the same guard/decide engine.
                This makes VerifyProceed a trust-minimized third party for agent-to-agent work — no manual review, no escrow disputes.
              </p>

              {/* Proof line */}
              <div className="flex items-center gap-2 mb-7">
                <motion.span
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                />
                <p className="text-sm font-mono text-emerald-400">
                  Verified live on Base mainnet — Job #72702.
                </p>
              </div>

              {/* Wallet field */}
              <div className="rounded-xl border border-white/[0.08] bg-black/30 px-4 py-3.5 max-w-xl">
                <p className="text-[10px] font-mono text-gray-700 uppercase tracking-widest mb-2">Evaluator Wallet</p>
                <div className="flex items-center gap-3">
                  <code className="flex-1 text-sm font-mono text-gray-300 break-all">{WALLET}</code>
                  <button
                    onClick={copy}
                    className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-mono px-2.5 py-1.5 rounded-lg border transition-all ${
                      copied
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : 'border-white/[0.08] bg-white/[0.03] text-gray-600 hover:text-gray-300 hover:border-white/[0.14]'
                    }`}
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Link to rulings */}
              <div className="mt-7">
                <Link
                  to="/evaluator-rulings"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors group"
                >
                  View all evaluator rulings
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
