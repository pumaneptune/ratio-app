import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Scale, ArrowRight, Info, Code2, Clock, FlaskConical,
  ListChecks, ChevronRight,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const STEPS = [
  {
    icon: Info,
    title: 'What an evaluator is — and when you\'d want one',
    body: 'On the Virtuals ACP marketplace, every job has three roles: Client (pays), Provider (delivers), and Evaluator (rules on whether the work was done). By default the Client evaluates their own job — an obvious conflict of interest. You can also use a free generic AI evaluator, but it can\'t verify financial work because it doesn\'t read the blockchain. You\'d want a separate evaluator for any job involving money moving on-chain: trades, swaps, bridge transfers, yield deposits, or financial reporting.',
  },
  {
    icon: Scale,
    title: 'Your evaluator\'s marketplace ID',
    body: 'VerifyProceed is registered on the Virtuals ACP marketplace as an evaluator. When you start a job, you\'ll designate it by its marketplace ID. (Placeholder — the real ID will be filled in here once the listing is finalized.)',
    codeBlock: {
      label: 'Evaluator Marketplace ID',
      content: 'evaluator_id: "vp-evaluator-v1"\n# (placeholder — real ID coming soon)',
    },
  },
  {
    icon: Code2,
    title: 'Set VerifyProceed as the evaluator when starting a job',
    body: 'When you create a new ACP job, pass the evaluator ID so VerifyProceed is assigned as the neutral third party. (Placeholder code — the real SDK calls will be filled in.)',
    codeBlock: {
      label: 'POST /v1/acp/jobs',
      content: `// Placeholder — real SDK calls coming soon
const job = await acp.createJob({
  spec: "swap USDC for 2500 USDT on Base",
  evaluator_id: "vp-evaluator-v1",
  payment: { token: "USDC", amount: 2500 }
});`,
    },
  },
  {
    icon: Clock,
    title: 'What happens after',
    body: 'Once the Provider submits the deliverable, VerifyProceed reads the blockchain to verify the work. A ruling is typically issued within 30–60 seconds. The buyer sees a verdict (complete or reject) with a reasoning breakdown — which checks passed, which failed, and the on-chain evidence for each. If the verdict is "complete," payment is released to the Provider automatically. If "reject," escrow is returned to the buyer.',
  },
  {
    icon: FlaskConical,
    title: 'Test safely with a small trial job',
    body: 'Before relying on the evaluator for large-value jobs, run a small trial. Create a job with a minimal payment amount (e.g. $1 USDC) and a simple spec. Watch the ruling come back, check the reasoning, and confirm the on-chain evidence matches your expectations. This lets you verify the integration end-to-end without risking real funds.',
  },
  {
    icon: ListChecks,
    title: 'View the rulings log',
    body: 'Every ruling VerifyProceed issues is logged publicly. You can review past rulings — including verdicts, reasoning, and on-chain proof — on the rulings page.',
    link: { to: '/evaluator/rulings', label: 'Go to rulings log' },
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

export default function EvaluatorHowToPage() {
  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      <Navbar />

      {/* ── HEADER ── */}
      <section className="relative border-b border-white/[0.06] pt-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-emerald-600/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/[0.06] mb-5"
          >
            <Scale className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Getting Started</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.07 }}
            className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4"
          >
            How to use the Evaluator
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12 }}
            className="text-gray-400 text-base leading-relaxed max-w-xl mx-auto"
          >
            A step-by-step guide to designating VerifyProceed as the neutral evaluator on your next ACP job.
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
            <span className="text-gray-400">How to use it</span>
          </motion.div>
        </div>
      </section>

      {/* ── STEPS ── */}
      <section className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div className="space-y-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div key={step.title} variants={item}>
                  <div className="relative rounded-2xl border border-white/[0.07] bg-[#07080e] p-6 sm:p-8">
                    {/* Number + icon */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-2xl font-bold font-mono text-emerald-400/40">0{i + 1}</span>
                        <h2 className="text-base sm:text-lg font-bold text-white">{step.title}</h2>
                      </div>
                    </div>

                    {/* Body */}
                    <p className="text-sm text-gray-400 leading-relaxed mb-4">{step.body}</p>

                    {/* Code block */}
                    {step.codeBlock && (
                      <div className="code-block rounded-xl overflow-hidden mt-4">
                        <div className="code-block-header">
                          <div className="terminal-dots">
                            <span className="bg-red-500/50" />
                            <span className="bg-yellow-500/50" />
                            <span className="bg-emerald-500/50" />
                          </div>
                          <span className="text-[11px] font-mono text-gray-600 ml-2">{step.codeBlock.label}</span>
                        </div>
                        <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto text-gray-300">{step.codeBlock.content}</pre>
                      </div>
                    )}

                    {/* Link */}
                    {step.link && (
                      <Link
                        to={step.link.to}
                        className="inline-flex items-center gap-2 mt-4 text-sm text-emerald-400 hover:text-emerald-300 transition-colors group"
                      >
                        {step.link.label}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    )}
                  </div>

                  {/* Connector line */}
                  {i < STEPS.length - 1 && (
                    <div className="flex justify-center py-2">
                      <div className="w-px h-8 bg-gradient-to-b from-white/[0.08] to-transparent" />
                    </div>
                  )}
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
          className="mt-10 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-8 text-center"
        >
          <h3 className="text-lg font-bold text-white mb-2">Ready to see it in action?</h3>
          <p className="text-sm text-gray-400 mb-5 max-w-md mx-auto">
            Browse the public rulings log to see real verdicts, reasoning, and on-chain proof.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/evaluator/rulings"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-all"
            >
              View Rulings <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/evaluator/checks"
              className="inline-flex items-center gap-2 px-5 py-2.5 glass-card hover:border-white/15 text-gray-300 hover:text-white font-semibold rounded-xl text-sm transition-all"
            >
              What we check
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
