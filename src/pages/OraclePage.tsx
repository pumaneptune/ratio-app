import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, ArrowRight, Check, X, AlertTriangle,
  Zap, Droplet, Network, TrendingDown, Activity, DollarSign,
  Layers, Workflow, ArrowLeftRight,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CHECKS = [
  { icon: DollarSign, label: 'Stablecoin peg health', desc: 'Real-time peg deviation across USDC, USDT, DAI and more.' },
  { icon: ShieldCheck, label: 'Bridge exploit status', desc: 'Monitors known bridge incidents and exploit feeds.' },
  { icon: Activity, label: 'Price feed health', desc: 'Staleness and deviation checks on oracle price feeds.' },
  { icon: Network, label: 'Network health', desc: 'RPC liveness and mempool congestion on the target chain.' },
  { icon: Layers, label: 'Trading liquidity depth', desc: 'Depth and slippage analysis across DEX pools.' },
];

const DONT_CHECK = [
  { label: 'Is this contract a scam?', tools: 'Blockaid, Tenderly' },
  { label: 'Wallet spending limits', tools: 'Coinbase, Privy, Turnkey' },
];

const AUDIENCES = [
  {
    icon: Zap,
    title: 'Liquidation bots',
    desc: "Don't liquidate based on a broken price feed.",
    color: 'text-amber-400',
    border: 'border-amber-500/20',
    bg: 'bg-amber-500/[0.04]',
  },
  {
    icon: TrendingDown,
    title: 'Yield optimizers',
    desc: "Don't move money into a stablecoin that's losing its value.",
    color: 'text-cyan-400',
    border: 'border-cyan-500/20',
    bg: 'bg-cyan-500/[0.04]',
  },
  {
    icon: ArrowLeftRight,
    title: 'Bridge-dependent agents',
    desc: "Don't send funds through a bridge that was just hacked.",
    color: 'text-red-400',
    border: 'border-red-500/20',
    bg: 'bg-red-500/[0.04]',
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

export default function OraclePage() {
  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative border-b border-white/[0.06] pt-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-blue-600/[0.06] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[200px] bg-amber-600/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div variants={container} initial="hidden" animate="show">
            {/* Live badge */}
            <motion.div variants={item} className="flex justify-center mb-7">
              <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-emerald-500/25 bg-emerald-500/[0.06] backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-xs font-mono font-semibold text-emerald-300 tracking-wide">Risk Oracle · Live on Base</span>
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={item}
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.08] tracking-[-0.03em] mb-6"
            >
              <span className="text-white">Know when the environment is unsafe</span>
              <br />
              <span className="text-gradient-blue">— before your agent acts.</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={item}
              className="text-lg text-gray-400 leading-[1.75] max-w-2xl mx-auto mb-9"
            >
              One request tells you whether stablecoins, bridges, price feeds, and trading
              liquidity are healthy right now. Not 'is this specific transaction a scam' —{' '}
              <span className="text-white font-semibold">'is this a safe moment to act at all.'</span>{' '}
              Pay per request, or a flat $49/month.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={item} className="flex flex-wrap justify-center gap-3">
              <Link
                to="/get-api-key"
                className="inline-flex items-center gap-2.5 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all duration-200 hover:shadow-blue-glow active:scale-[0.98] text-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                Get API Key
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2.5 px-6 py-3 glass-card hover:border-white/15 text-gray-300 hover:text-white font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] text-sm"
              >
                View Pricing
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CODE EXAMPLE ── */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Workflow className="w-4 h-4 text-blue-400" />
            </div>
            <h2 className="text-lg font-bold text-white">One request. Full environment check.</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            {/* Request */}
            <div className="code-block rounded-xl overflow-hidden">
              <div className="code-block-header">
                <div className="terminal-dots">
                  <span className="bg-red-500/50" />
                  <span className="bg-yellow-500/50" />
                  <span className="bg-emerald-500/50" />
                </div>
                <span className="text-[11px] font-mono text-gray-600 ml-2">Request</span>
                <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400">POST</span>
              </div>
              <pre className="p-5 text-xs font-mono leading-relaxed overflow-x-auto">
<span className="token-keyword">POST</span> <span className="token-string">/v1/oracle</span>
{'{'}
  <span className="token-property">"action"</span>: <span className="token-string">"swap"</span>,
  <span className="token-property">"chain"</span>: <span className="token-string">"base"</span>,
  <span className="token-property">"assets"</span>: [<span className="token-string">"USDC"</span>, <span className="token-string">"USDT"</span>],
  <span className="token-property">"amount_usd"</span>: <span className="token-number">25000</span>
{'}'}
              </pre>
            </div>

            {/* Response */}
            <div className="code-block rounded-xl overflow-hidden border-red-500/15">
              <div className="code-block-header">
                <div className="terminal-dots">
                  <span className="bg-red-500/50" />
                  <span className="bg-yellow-500/50" />
                  <span className="bg-emerald-500/50" />
                </div>
                <span className="text-[11px] font-mono text-gray-600 ml-2">Response</span>
                <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-400">HALT</span>
              </div>
              <pre className="p-5 text-xs font-mono leading-relaxed overflow-x-auto">
{'{'}
  <span className="token-property">"verdict"</span>: <span className="text-red-400 font-semibold">"halt"</span>,
  <span className="token-property">"risk"</span>: <span className="text-red-400 font-semibold">"high"</span>,
  <span className="token-property">"checks"</span>: {'{'}
    <span className="token-property">"stablecoin_peg"</span>: <span className="text-red-400 font-semibold">"FAIL — USDT at 0.971, threshold 0.985"</span>,
    <span className="token-property">"bridge_exploit_monitor"</span>: <span className="text-emerald-400">"pass"</span>,
    <span className="token-property">"rpc_health"</span>: <span className="text-emerald-400">"pass"</span>,
    <span className="token-property">"price_deviation"</span>: <span className="text-amber-400 font-semibold">"WARN — 2.1% vs oracle"</span>,
    <span className="token-property">"liquidity_depth"</span>: <span className="text-emerald-400">"pass"</span>
  {'}'},
  <span className="token-property">"reasoning"</span>: <span className="token-string">"USDT is losing its value right now. Recommend halting any stable-to-stable trade."</span>,
  <span className="token-property">"data_age_seconds"</span>: <span className="token-number">4</span>,
  <span className="token-property">"latency_ms"</span>: <span className="token-number">176</span>
{'}'}
              </pre>
            </div>
          </div>

          {/* Callout below code */}
          <div className="mt-4 flex items-start gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.04]">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-400 leading-relaxed">
              The oracle caught a depeg <span className="text-red-400 font-semibold">before</span> the agent executed.
              A swap would have locked in a 2.9% loss. The agent halts and retries when conditions recover.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── WHAT WE CHECK / WHAT WE DON'T ── */}
      <section className="relative border-t border-white/[0.06] py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <Activity className="w-4 h-4 text-cyan-400" />
              </div>
              <h2 className="text-lg font-bold text-white">Scope</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Left: What we check */}
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">What VerifyProceed checks</h3>
                </div>
                <ul className="space-y-3.5">
                  {CHECKS.map((c) => {
                    const Icon = c.icon;
                    return (
                      <li key={c.label} className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-200">{c.label}</p>
                          <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{c.desc}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Right: What we don't */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#07080e] p-6">
                <div className="flex items-center gap-2 mb-5">
                  <X className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm font-bold text-white">Use these for the rest</h3>
                </div>
                <ul className="space-y-3.5">
                  {DONT_CHECK.map((d) => (
                    <li key={d.label} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center flex-shrink-0">
                        <X className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-300">{d.label}</p>
                        <p className="text-xs text-gray-600 leading-relaxed mt-0.5">{d.tools}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Caption */}
            <p className="text-center text-xs text-gray-600 mt-6 italic">
              VerifyProceed works alongside these tools, not instead of them.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── WHO THIS IS FOR ── */}
      <section className="relative border-t border-white/[0.06] py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Droplet className="w-4 h-4 text-blue-400" />
              </div>
              <h2 className="text-lg font-bold text-white">Who this is for</h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              {AUDIENCES.map((a) => {
                const Icon = a.icon;
                return (
                  <div
                    key={a.title}
                    className={`rounded-2xl border p-6 ${a.border} ${a.bg} transition-all duration-300 hover:scale-[1.02]`}
                  >
                    <div className={`w-10 h-10 rounded-xl border ${a.border} flex items-center justify-center mb-4`}>
                      <Icon className={`w-5 h-5 ${a.color}`} />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-2">{a.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{a.desc}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PRICING STRIP ── */}
      <section className="relative border-t border-white/[0.06] py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050508]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="rounded-2xl border border-white/[0.08] bg-[#07080e] p-8 text-center"
          >
            <div className="flex flex-wrap items-center justify-center gap-8 mb-6">
              <div>
                <p className="text-3xl font-bold font-mono text-blue-400">$0.01</p>
                <p className="text-xs text-gray-600 mt-1">per request</p>
              </div>
              <div className="w-px h-12 bg-white/[0.08]" />
              <div>
                <p className="text-3xl font-bold font-mono text-emerald-400">$49</p>
                <p className="text-xs text-gray-600 mt-1">per month · 25,000 requests</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-6">Free tier includes 100 requests per month. No credit card required.</p>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 glass-card hover:border-white/15 text-gray-300 hover:text-white font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] text-sm"
            >
              See full pricing
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
