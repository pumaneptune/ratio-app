import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Briefcase, CheckCircle, XCircle, Clock, ExternalLink,
  ChevronRight, Scale, Activity,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

type Verdict = 'complete' | 'reject';

type Ruling = {
  timestamp: string;
  jobType: string;
  verdict: Verdict;
  reason: string;
  txHash: string;
};

const MOCK_RULINGS: Ruling[] = [
  {
    timestamp: '2026-09-03 14:22 UTC',
    jobType: 'Trade / swap',
    verdict: 'reject',
    reason: 'Price deviation — execution price 3.2% above oracle',
    txHash: '0x8f3a...c7e2',
  },
  {
    timestamp: '2026-09-03 11:05 UTC',
    jobType: 'Bridge transfer',
    verdict: 'complete',
    reason: 'Funds confirmed on destination chain',
    txHash: '0x4b21...9d1f',
  },
  {
    timestamp: '2026-09-02 22:14 UTC',
    jobType: 'Trade / swap',
    verdict: 'reject',
    reason: 'Stale price feed — oracle last updated 9 min ago',
    txHash: '0x2d9e...b4a1',
  },
  {
    timestamp: '2026-09-02 15:09 UTC',
    jobType: 'Bridge transfer',
    verdict: 'reject',
    reason: 'Funds not confirmed on destination chain within timeout',
    txHash: '0x6e3b...2a8c',
  },
  {
    timestamp: '2026-09-01 21:18 UTC',
    jobType: 'Yield position',
    verdict: 'reject',
    reason: 'Position size mismatch — on-chain amount 8% below spec',
    txHash: '0x9d02...4f71',
  },
];

const SUMMARY = {
  total: 5,
  completed: 1,
  rejected: 4,
  medianTimeToRule: '42s',
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function EvaluatorRulingsPage() {
  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      <Navbar />

      {/* ── HEADER ── */}
      <section className="relative border-b border-white/[0.06] pt-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-cyan-600/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/25 bg-cyan-500/[0.06] mb-5"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Live Feed</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.07 }}
            className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4"
          >
            Evaluator Rulings
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12 }}
            className="text-gray-400 text-base leading-relaxed max-w-xl mx-auto"
          >
            Every ruling VerifyProceed issues as an ACP evaluator, newest first. Each entry links to its on-chain proof.
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
            <span className="text-gray-400">Rulings</span>
          </motion.div>
        </div>
      </section>

      {/* ── SUMMARY STRIP ── */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          <div className="rounded-2xl border border-white/[0.07] bg-[#07080e] p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Briefcase className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-bold font-mono text-blue-400">{SUMMARY.total}</p>
            <p className="text-xs text-gray-600 mt-1">Jobs judged</p>
          </div>
          <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.03] p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold font-mono text-emerald-400">{Math.round((SUMMARY.completed / SUMMARY.total) * 100)}%</p>
            <p className="text-xs text-gray-600 mt-1">Completed</p>
          </div>
          <div className="rounded-2xl border border-red-500/15 bg-red-500/[0.03] p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-red-400" />
            </div>
            <p className="text-2xl font-bold font-mono text-red-400">{Math.round((SUMMARY.rejected / SUMMARY.total) * 100)}%</p>
            <p className="text-xs text-gray-600 mt-1">Rejected</p>
          </div>
          <div className="rounded-2xl border border-white/[0.07] bg-[#07080e] p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold font-mono text-gray-300">{SUMMARY.medianTimeToRule}</p>
            <p className="text-xs text-gray-600 mt-1">Median time to rule</p>
          </div>
        </motion.div>
      </section>

      {/* ── RULINGS TABLE ── */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div className="space-y-3">
            {MOCK_RULINGS.map((ruling, i) => {
              const isComplete = ruling.verdict === 'complete';
              return (
                <motion.div key={i} variants={item}>
                  <div className="rounded-xl border border-white/[0.07] bg-[#07080e] p-4 sm:p-5 hover:border-white/[0.12] transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      {/* Timestamp */}
                      <div className="flex items-center gap-2 sm:w-44 flex-shrink-0">
                        <Clock className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                        <span className="text-xs font-mono text-gray-500">{ruling.timestamp}</span>
                      </div>

                      {/* Job type */}
                      <div className="flex items-center gap-2 sm:w-36 flex-shrink-0">
                        <span className="text-xs text-gray-400 font-medium">{ruling.jobType}</span>
                      </div>

                      {/* Verdict badge */}
                      <div className="flex-shrink-0">
                        {isComplete ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold text-emerald-400 border border-emerald-500/25 bg-emerald-500/[0.06]">
                            <CheckCircle className="w-3 h-3" />
                            complete
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold text-red-400 border border-red-500/25 bg-red-500/[0.06]">
                            <XCircle className="w-3 h-3" />
                            reject
                          </span>
                        )}
                      </div>

                      {/* Reason */}
                      <p className="flex-1 text-sm text-gray-400 min-w-0">{ruling.reason}</p>

                      {/* On-chain link */}
                      <a
                        href={`https://basescan.org/tx/${ruling.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors flex-shrink-0"
                      >
                        view on-chain
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
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
            to="/evaluator"
            className="inline-flex items-center gap-2 px-5 py-2.5 glass-card hover:border-white/15 text-gray-300 hover:text-white font-semibold rounded-xl text-sm transition-all"
          >
            <Scale className="w-4 h-4 text-emerald-400" />
            Back to Evaluator
          </Link>
          <Link
            to="/evaluator/checks"
            className="inline-flex items-center gap-2 px-5 py-2.5 glass-card hover:border-white/15 text-gray-300 hover:text-white font-semibold rounded-xl text-sm transition-all"
          >
            What we check
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
