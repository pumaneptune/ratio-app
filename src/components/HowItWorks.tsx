import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bot, Cpu, CreditCard, CheckCircle, ArrowRight, Zap, ChevronRight } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: Bot,
    color: 'text-blue-400',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/10',
    title: 'Agent sends request',
    description: 'POST /v1/oracle with action, chain, and amount. x402 handles auth — no setup required for the first call.',
    code: 'POST /v1/oracle\n{ "action": "swap",\n  "chain": "base",\n  "assets": ["USDC", "USDT"],\n  "amount_usd": 25000 }',
    codeColor: 'text-blue-300',
    time: null,
  },
  {
    step: '02',
    icon: Cpu,
    color: 'text-cyan-400',
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-500/10',
    title: 'Parallel checks run',
    description: 'Bridge exploit monitor, RPC health, price deviation, stablecoin peg, DEX liquidity depth — all evaluated in parallel against live data.',
    code: 'stablecoin_peg: FAIL\nbridge_exploit: pass\nrpc_health: pass\nliquidity_depth: pass',
    codeColor: 'text-cyan-300',
    time: '~50ms',
  },
  {
    step: '03',
    icon: CreditCard,
    color: 'text-purple-400',
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/10',
    title: 'x402 payment',
    description: 'HTTP 402 challenge returned. Agent pays $0.01 USDC on Base via x402. Request retries automatically with x402 payment header attached.',
    code: '← 402 Payment Required\nagent pays $0.01 USDC\n→ x402 payment header\nrequest retries automatically',
    codeColor: 'text-purple-300',
    time: '~300ms',
  },
  {
    step: '04',
    icon: CheckCircle,
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    title: 'Verdict returned',
    description: 'JSON response: verdict, risk level, per-check breakdown. Agent reads the verdict and proceeds or halts.',
    code: '{ "verdict": "halt",\n  "risk": "high",\n  "reasoning": "USDT is losing\n   its value right now." }',
    codeColor: 'text-emerald-300',
    time: '183ms total',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/[0.06] via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-label mb-4"
            >
              <Zap className="w-3.5 h-3.5" />
              How It Works
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4"
            >
              Request → verify →<br />pay → proceed.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.14 }}
              className="text-gray-400 text-lg max-w-xl"
            >
              Four steps. Under 500ms end-to-end. No human in the loop.
            </motion.p>
          </div>

          {/* "How to start" inline CTA — answers the question directly */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex-shrink-0"
          >
            <div className="glass-card rounded-xl p-4 border-white/[0.08] max-w-xs">
              <p className="text-[10px] font-mono text-gray-700 uppercase tracking-widest mb-2">How to start</p>
              <ol className="howto-start-list space-y-1.5 text-xs text-gray-500 mb-4">
                <li>Get a free API key</li>
                <li>Fund agent wallet with USDC on Base</li>
                <li>POST /v1/oracle before every on-chain action</li>
                <li>x402 handles payment — no billing setup needed</li>
              </ol>
              <Link to="/get-api-key"
                className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                Get API Key — Free <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative"
              >
                {/* Connector arrow — desktop only */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-8 -right-2.5 z-10 w-5 items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-gray-700" />
                  </div>
                )}

                <div className="glass-card rounded-xl p-5 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-gray-700 font-medium">{step.step}</span>
                    <div className="flex items-center gap-2">
                      {step.time && (
                        <span className={`text-[10px] font-mono ${step.color} opacity-70`}>{step.time}</span>
                      )}
                      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${step.bg} ${step.border}`}>
                        <Icon className={`w-4 h-4 ${step.color}`} />
                      </div>
                    </div>
                  </div>

                  <h3 className="text-white font-semibold text-sm mb-2 leading-snug">{step.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4 flex-1">{step.description}</p>

                  <div className="rounded-lg bg-black/40 border border-white/[0.05] p-3 mt-auto">
                    <pre className={`text-xs font-mono whitespace-pre-wrap leading-5 ${step.codeColor}`}>{step.code}</pre>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* "Why now" signal + total latency callout */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid sm:grid-cols-3 gap-3"
        >
          {[
            { label: 'Total cycle time', value: '< 500ms', sub: 'request → payment → verdict', color: 'text-blue-400' },
            { label: 'Settlement', value: 'Base Mainnet', sub: 'USDC · x402 · no accounts', color: 'text-purple-400' },
            { label: 'Human involvement', value: 'Zero', sub: 'fully autonomous end-to-end', color: 'text-emerald-400' },
          ].map((m) => (
            <div key={m.label} className="glass-card rounded-xl p-4 flex items-center gap-4">
              <div>
                <p className={`text-lg font-bold font-mono ${m.color}`}>{m.value}</p>
                <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">{m.label}</p>
                <p className="text-xs text-gray-700 mt-0.5">{m.sub}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
