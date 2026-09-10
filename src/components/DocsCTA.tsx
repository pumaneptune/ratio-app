import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Terminal, ArrowRight, Key, BookOpen, Zap, ChevronRight, CheckCircle } from 'lucide-react';
import { SpecButtons } from './SpecButtons';

const codeLines: { text: string; color: string; italic?: boolean }[][] = [
  [{ text: '# 1. Set your API key', color: 'text-gray-600', italic: true }],
  [
    { text: 'export', color: 'text-emerald-400' },
    { text: ' VP_API_KEY=vp_...', color: 'text-gray-300' },
  ],
  [],
  [{ text: '# 2. Guard before every on-chain action', color: 'text-gray-600', italic: true }],
  [
    { text: 'const', color: 'text-purple-400' },
    { text: ' res = ', color: 'text-gray-300' },
    { text: 'await', color: 'text-purple-400' },
    { text: ' fetch(', color: 'text-gray-300' },
    { text: '"https://api.verifyproceed.com/v1/acp/guard"', color: 'text-emerald-300' },
    { text: ', {', color: 'text-gray-300' },
  ],
  [
    { text: '  method: ', color: 'text-gray-400' },
    { text: '"POST"', color: 'text-emerald-300' },
    { text: ', headers: { Authorization:', color: 'text-gray-400' },
  ],
  [
    { text: '    ', color: 'text-gray-400' },
    { text: '`Bearer ${process.env.VP_API_KEY}`', color: 'text-emerald-300' },
    { text: ' },', color: 'text-gray-400' },
  ],
  [
    { text: '  body: JSON.stringify({ action: ', color: 'text-gray-400' },
    { text: '"bridge"', color: 'text-emerald-300' },
    { text: ', chain: ', color: 'text-gray-400' },
    { text: '"base"', color: 'text-emerald-300' },
    { text: ' }),', color: 'text-gray-400' },
  ],
  [{ text: '});', color: 'text-gray-300' }],
  [],
  [
    { text: '// result → ', color: 'text-gray-600', italic: true },
    { text: '{ verdict: ', color: 'text-gray-600', italic: true },
    { text: '"proceed"', color: 'text-emerald-300', italic: true },
    { text: ', confidence: ', color: 'text-gray-600', italic: true },
    { text: '0.94', color: 'text-blue-300', italic: true },
    { text: ' }', color: 'text-gray-600', italic: true },
  ],
];

function QuickStart() {
  return (
    <>
      {codeLines.map((line, li) => (
        <div key={li} className="leading-7">
          {line.length === 0
            ? '\u00A0'
            : line.map((seg, si) => (
                <span key={si} className={`${seg.color}${seg.italic ? ' italic' : ''}`}>
                  {seg.text}
                </span>
              ))}
        </div>
      ))}
    </>
  );
}

const STEPS = [
  { n: '01', text: 'Get API key — free, no card required' },
  { n: '02', text: 'Fund agent wallet with USDC on Base' },
  { n: '03', text: 'POST /v1/acp/guard before every on-chain action' },
  { n: '04', text: 'x402 handles payment automatically' },
];

export default function DocsCTA() {
  return (
    <section id="docs-cta" className="relative py-36 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/[0.10] to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-blue-600/[0.09] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/25 to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-emerald-500/25 bg-emerald-500/[0.06]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-xs font-mono text-emerald-400 font-semibold tracking-wide">API live · Base Mainnet · x402 active</span>
          </div>
        </motion.div>

        {/* Headline — answers what + why now */}
        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.02] mb-6 text-center"
        >
          First call
          <br />
          <span className="text-gradient-blue">in 5 minutes.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.16 }}
          className="text-xl text-gray-400 max-w-2xl mx-auto mb-4 leading-relaxed text-center"
        >
          100 free calls / month. No credit card. No SDK. Pay per call in USDC on Base when you need more.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.24 }}
          className="flex flex-wrap gap-4 justify-center mb-12"
        >
          <Link to="/get-api-key"
            className="group inline-flex items-center gap-2.5 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all duration-200 hover:shadow-blue-glow active:scale-[0.97] text-base">
            <Key className="w-4 h-4" />
            Get API Key — Free
            <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>

          <Link to="/playground"
            className="group inline-flex items-center gap-2.5 px-8 py-4 glass-card hover:border-blue-500/35 hover:bg-blue-500/[0.06] text-gray-200 hover:text-white font-bold rounded-xl transition-all duration-200 active:scale-[0.97] text-base">
            <Terminal className="w-4 h-4 text-blue-400" />
            Try in Playground
            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-blue-400 transition-colors" />
          </Link>

          <Link to="/docs"
            className="group inline-flex items-center gap-2.5 px-8 py-4 glass-card hover:border-white/12 text-gray-400 hover:text-white font-semibold rounded-xl transition-all duration-200 active:scale-[0.97] text-base">
            <BookOpen className="w-4 h-4" />
            View Docs
            <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-gray-400 transition-colors" />
          </Link>
        </motion.div>

        {/* Spec download strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-8"
        >
          <SpecButtons />
        </motion.div>

        {/* Steps + code block side by side */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
        >
          {/* 4-step onboarding */}
          <div className="glass-card rounded-xl border border-white/[0.08] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.015]">
              <span className="text-xs font-mono text-gray-600">onboarding · 5 minutes</span>
            </div>
            <div className="p-5 space-y-4">
              {STEPS.map((s) => (
                <div key={s.n} className="flex items-center gap-3.5">
                  <span className="w-6 h-6 rounded-full border border-blue-500/30 bg-blue-500/10 flex items-center justify-center text-[10px] font-mono text-blue-400 font-bold flex-shrink-0">
                    {s.n}
                  </span>
                  <span className="text-sm text-gray-400">{s.text}</span>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-white/[0.05] bg-white/[0.01]">
              <Link to="/docs"
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium">
                Full integration guide <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Code block */}
          <div className="relative">
            <div className="absolute -inset-3 bg-blue-500/[0.05] rounded-2xl blur-xl pointer-events-none" />
            <div className="relative glass-card rounded-xl overflow-hidden border border-white/[0.09]">
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-white/[0.015]">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                  </div>
                  <span className="text-xs font-mono text-gray-600">quickstart.sh / fetch</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-blue-500/60" />
                  <span className="text-xs font-mono text-blue-500/60">x402</span>
                </div>
              </div>
              <pre className="p-5 text-sm font-mono overflow-x-auto text-left">
                <QuickStart />
              </pre>
            </div>
          </div>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-5 mt-10 text-xs text-gray-600"
        >
          {[
            { dot: 'bg-emerald-500/60', text: '100 free calls / month' },
            { dot: 'bg-blue-500/60',    text: 'No credit card required' },
            { dot: 'bg-purple-500/60',  text: 'x402 on Base' },
            { dot: 'bg-cyan-500/60',    text: 'Base Mainnet · USDC' },
            { dot: 'bg-gray-500/60',    text: 'Open API spec' },
          ].map((t) => (
            <span key={t.text} className="flex items-center gap-1.5">
              <CheckCircle className="w-3 h-3 text-gray-700" />
              {t.text}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </section>
  );
}
