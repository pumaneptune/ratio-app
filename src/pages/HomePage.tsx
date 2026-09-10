import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Scale, ArrowRight, Activity, AlertTriangle, TrendingDown, Droplet } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HowItWorks from '../components/HowItWorks';
import CodeExamples from '../components/CodeExamples';
import NeutralEvaluator from '../components/NeutralEvaluator';
import Pricing from '../components/Pricing';
import BuiltFor from '../components/BuiltFor';
import DocsCTA from '../components/DocsCTA';
import SocialProof from '../components/SocialProof';

type Detection = {
  icon: typeof AlertTriangle;
  label: string;
  minutesAgo: number;
  color: string;
  border: string;
  bg: string;
};

const MOCK_DETECTIONS: Detection[] = [
  {
    icon: AlertTriangle,
    label: 'USDC depeg risk detected — deviant from $1 by 0.3%',
    minutesAgo: 2,
    color: 'text-amber-400',
    border: 'border-amber-500/20',
    bg: 'bg-amber-500/[0.06]',
  },
  {
    icon: Droplet,
    label: 'Bridge liquidity dropped 18% on Base→Ethereum channel',
    minutesAgo: 11,
    color: 'text-cyan-400',
    border: 'border-cyan-500/20',
    bg: 'bg-cyan-500/[0.06]',
  },
  {
    icon: TrendingDown,
    label: 'Chainlink price feed staleness — 6 min since last update',
    minutesAgo: 24,
    color: 'text-red-400',
    border: 'border-red-500/20',
    bg: 'bg-red-500/[0.06]',
  },
];

const detectionTimestamps = MOCK_DETECTIONS.map(
  (d) => Date.now() - d.minutesAgo * 60 * 1000,
);

function formatTimeAgo(timestamp: number): string {
  const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
  return `${minutes} min ago`;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function HomePage() {
  const [detections] = useState(MOCK_DETECTIONS);
  const [tick, setTick] = useState(0);

  // Recalculate timestamps every 30 seconds so "X min ago" advances live
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Hero */}
        <section className="relative min-h-[88vh] flex items-center overflow-hidden pt-16">
          {/* Background */}
          <div className="absolute inset-0 grid-bg" />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/10 via-transparent to-[#050508]" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/[0.06] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-emerald-600/[0.04] rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left — headline & buttons */}
              <motion.div variants={container} initial="hidden" animate="show" className="text-center lg:text-left">
                {/* Live badge */}
                <motion.div variants={item} className="flex justify-center lg:justify-start mb-8">
                  <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-emerald-500/25 bg-emerald-500/[0.06] backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                    </span>
                    <span className="text-xs font-mono font-semibold text-emerald-300 tracking-wide">Live on Base Mainnet</span>
                  </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                  variants={item}
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-[-0.03em] mb-8"
                >
                  <span className="text-white">Know when the environment is unsafe</span>
                  <br />
                  <span className="text-gradient-blue">— before your agent acts.</span>
                </motion.h1>

                {/* Intro paragraph */}
                <motion.p
                  variants={item}
                  className="text-lg sm:text-xl text-gray-400 leading-[1.75] max-w-2xl mx-auto lg:mx-0 mb-12"
                >
                  Two products keep your agents safe.{' '}
                  <span className="text-blue-400 font-semibold">Risk Oracle</span> checks whether
                  stablecoins, bridges, price feeds and liquidity are healthy right now.{' '}
                  <span className="text-emerald-400 font-semibold">Evaluator</span> is a neutral
                  referee that checks whether financial on-chain work was actually done correctly,
                  used on the Virtuals ACP marketplace.
                </motion.p>

                {/* CTA buttons */}
                <motion.div variants={item} className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <Link
                    to="/oracle"
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all duration-200 hover:shadow-blue-glow active:scale-[0.98] text-sm"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Try the Oracle
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/evaluator"
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 glass-card hover:border-emerald-500/30 text-gray-300 hover:text-white font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] text-sm"
                  >
                    <Scale className="w-4 h-4 text-emerald-400" />
                    Learn about the Evaluator
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </motion.div>

              {/* Right — terminal panel & stat chips */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Terminal card */}
                <div className="glass-card rounded-2xl overflow-hidden border border-white/[0.07]">
                  {/* Terminal chrome bar */}
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.015]">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/45" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/45" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/45" />
                      </div>
                      <span className="text-xs font-mono text-gray-600">oracle — request</span>
                    </div>
                    <span className="text-xs font-mono font-medium text-blue-400">POST /v1/oracle</span>
                  </div>

                  {/* Request */}
                  <div className="px-6 pt-5 pb-2">
                    <div className="text-xs font-mono text-gray-600 mb-2">// Request</div>
                    <pre className="text-sm font-mono leading-7 text-gray-300"><span className="text-blue-400">POST</span> /v1/oracle</pre>
                    <pre className="text-sm font-mono leading-7 text-gray-300">{`{ "action": "swap", "chain": "base", "assets": ["USDC", "USDT"], "amount_usd": 25000 }`}</pre>
                  </div>

                  {/* Divider */}
                  <div className="mx-6 my-3 border-t border-white/[0.06]" />

                  {/* Response */}
                  <div className="px-6 pb-5">
                    <div className="text-xs font-mono text-gray-600 mb-2">// Response · 200 OK</div>
                    <div className="text-sm font-mono leading-7">
                      <div><span className="text-gray-500">{`{`}</span></div>
                      <div>&nbsp;&nbsp;<span className="text-blue-200">"verdict"</span><span className="text-gray-500">: </span><span className="text-amber-400">"halt"</span><span className="text-gray-500">,</span></div>
                      <div>&nbsp;&nbsp;<span className="text-blue-200">"risk"</span><span className="text-gray-500">: </span><span className="text-amber-400">"high"</span><span className="text-gray-500">,</span></div>
                      <div>&nbsp;&nbsp;<span className="text-blue-200">"checks"</span><span className="text-gray-500">: {`{`}</span></div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-200">"stablecoin_peg"</span><span className="text-gray-500">: </span><span className="text-red-400">"FAIL — USDT at 0.971"</span><span className="text-gray-500">,</span></div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-200">"bridge_exploit_monitor"</span><span className="text-gray-500">: </span><span className="text-emerald-500/70">"pass"</span><span className="text-gray-500">,</span></div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-200">"rpc_health"</span><span className="text-gray-500">: </span><span className="text-emerald-500/70">"pass"</span><span className="text-gray-500">,</span></div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-200">"liquidity_depth"</span><span className="text-gray-500">: </span><span className="text-emerald-500/70">"pass"</span></div>
                      <div>&nbsp;&nbsp;<span className="text-gray-500">{`},`}</span></div>
                      <div>&nbsp;&nbsp;<span className="text-blue-200">"reasoning"</span><span className="text-gray-500">: </span><span className="text-emerald-300">"USDT is losing its value right now."</span></div>
                      <div><span className="text-gray-500">{`}`}</span></div>
                    </div>
                  </div>
                </div>

                {/* Stat chips */}
                <div className="flex flex-wrap gap-2 mt-5 justify-center lg:justify-start">
                  <span className="glass-card rounded-lg px-3.5 py-2 text-xs font-mono text-gray-400 border border-white/[0.04]">
                    <span className="text-blue-400">183ms</span> p99
                  </span>
                  <span className="glass-card rounded-lg px-3.5 py-2 text-xs font-mono text-gray-400 border border-white/[0.04]">
                    <span className="relative flex h-1.5 w-1.5 inline-flex mr-1.5 align-middle">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                    </span>
                    Live on Base Mainnet
                  </span>
                  <span className="glass-card rounded-lg px-3.5 py-2 text-xs font-mono text-gray-400 border border-white/[0.04]">
                    <span className="text-emerald-400">0</span> human approvals needed
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <SocialProof />

        <HowItWorks />
        <CodeExamples />

        {/* Live detections strip */}
        <section className="relative border-t border-white/[0.06] py-16">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050508]" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-mono font-semibold text-gray-300 uppercase tracking-widest">
                  Recent Detections
                </h2>
                <span className="relative flex h-2 w-2 ml-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
              </div>
              <span className="text-[10px] font-mono text-gray-700">live feed</span>
            </div>

            {/* Detection entries */}
            <div className="space-y-3">
              {detections.map((d, i) => {
                const Icon = d.icon;
                return (
                  <motion.div
                    key={`${d.label}-${tick}`}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className={`flex items-center gap-4 p-4 rounded-xl border ${d.border} ${d.bg} backdrop-blur-sm`}
                  >
                    <div className={`w-9 h-9 rounded-lg border ${d.border} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${d.color}`} />
                    </div>
                    <p className="flex-1 text-sm text-gray-300 font-medium">{d.label}</p>
                    <span className="text-xs font-mono text-gray-600 flex-shrink-0">{formatTimeAgo(detectionTimestamps[i])}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <NeutralEvaluator />
        <Pricing />
        <BuiltFor />
        <DocsCTA />
      </motion.main>
      <Footer />
    </div>
  );
}
