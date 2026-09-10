import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Zap, Server, BookOpen, Play,
  FileText, Package, Users, History, Globe,
  ArrowRight, Download, ChevronRight, Code2,
  Terminal, Key, ExternalLink, Tag,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { SpecButtons } from '../components/SpecButtons';

// ─── Data ─────────────────────────────────────────────────────────────────────

const PRIMARY_TOOLS = [
  {
    id: 'quickstart',
    icon: Zap,
    label: 'Quick Start',
    title: 'From zero to first call.',
    desc: 'Get an API key, make your first guard request, and verify an on-chain action in under 5 minutes.',
    to: '/docs/quickstart',
    cta: 'Get started',
    accent: 'text-emerald-400',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/[0.05]',
    hoverBorder: 'hover:border-emerald-500/40',
    hoverBg: 'hover:bg-emerald-500/[0.07]',
    glow: 'from-emerald-500/10',
    badge: '5 min',
    badgeColor: 'text-emerald-400 border-emerald-500/25 bg-emerald-500/[0.08]',
    stat: { label: 'lines to integrate', value: '< 10' },
  },
  {
    id: 'api-reference',
    icon: Server,
    label: 'API Reference',
    title: 'Every endpoint documented.',
    desc: 'Full REST reference with request schemas, response types, auth flows, error codes, and multi-language examples.',
    to: '/api-reference',
    cta: 'View reference',
    accent: 'text-blue-400',
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/[0.05]',
    hoverBorder: 'hover:border-blue-500/40',
    hoverBg: 'hover:bg-blue-500/[0.07]',
    glow: 'from-blue-500/10',
    badge: 'REST',
    badgeColor: 'text-blue-400 border-blue-500/25 bg-blue-500/[0.08]',
    stat: { label: 'endpoints', value: '7' },
  },
  {
    id: 'playground',
    icon: Play,
    label: 'Playground',
    title: 'Fire requests live.',
    desc: 'Interactive API explorer. Paste in your key, pick an endpoint, send a request, and see the real response instantly.',
    to: '/playground',
    cta: 'Open playground',
    accent: 'text-cyan-400',
    border: 'border-cyan-500/20',
    bg: 'bg-cyan-500/[0.05]',
    hoverBorder: 'hover:border-cyan-500/40',
    hoverBg: 'hover:bg-cyan-500/[0.07]',
    glow: 'from-cyan-500/10',
    badge: 'live',
    badgeColor: 'text-cyan-400 border-cyan-500/25 bg-cyan-500/[0.08]',
    stat: { label: 'avg latency', value: '183ms' },
  },
  {
    id: 'docs',
    icon: BookOpen,
    label: 'Documentation',
    title: 'Concepts and guides.',
    desc: 'Deep-dives into the Guard API, x402 payment protocol, verdict logic, risk scoring, and agent integration patterns.',
    to: '/docs',
    cta: 'Read docs',
    accent: 'text-gray-300',
    border: 'border-white/[0.10]',
    bg: 'bg-white/[0.03]',
    hoverBorder: 'hover:border-white/[0.20]',
    hoverBg: 'hover:bg-white/[0.05]',
    glow: 'from-gray-500/10',
    badge: 'v1.0',
    badgeColor: 'text-gray-500 border-white/[0.10] bg-white/[0.03]',
    stat: { label: 'endpoints covered', value: 'all' },
  },
];

const RESOURCES = [
  {
    id: 'openapi',
    icon: FileText,
    label: 'OpenAPI Spec',
    desc: 'OpenAPI 3.1.0 — import into Swagger, Postman, Insomnia, or any compatible tool.',
    action: 'download',
    href: '/openapi.json',
    download: 'verifyproceed-openapi.json',
    accent: 'text-yellow-400',
    border: 'border-yellow-500/20',
    bg: 'bg-yellow-500/[0.05]',
    hoverBorder: 'hover:border-yellow-500/35',
  },
  {
    id: 'postman',
    icon: Package,
    label: 'Postman Collection',
    desc: 'Collection v2.1 with 9 pre-built requests, saved responses, and environment variables.',
    action: 'download',
    href: '/postman_collection.json',
    download: 'verifyproceed-postman-collection.json',
    accent: 'text-orange-400',
    border: 'border-orange-500/20',
    bg: 'bg-orange-500/[0.05]',
    hoverBorder: 'hover:border-orange-500/35',
  },
  {
    id: 'use-cases',
    icon: Users,
    label: 'Use Cases',
    desc: 'See how DeFi agents, trading bots, wallet controllers, and MCP tools use VerifyProceed.',
    action: 'link',
    to: '/#built-for',
    accent: 'text-sky-400',
    border: 'border-sky-500/20',
    bg: 'bg-sky-500/[0.05]',
    hoverBorder: 'hover:border-sky-500/35',
  },
  {
    id: 'changelog',
    icon: History,
    label: 'Changelog',
    desc: "What's new in the API — version history, breaking changes, and migration notes.",
    action: 'link',
    to: '/changelog',
    accent: 'text-emerald-400',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/[0.05]',
    hoverBorder: 'hover:border-emerald-500/35',
  },
  {
    id: 'marketplace-kit',
    icon: Tag,
    label: 'Marketplace Kit',
    desc: 'All metadata, descriptions, pricing, and assets formatted for RapidAPI, AWS, and others.',
    action: 'link',
    to: '/marketplace-kit',
    accent: 'text-teal-400',
    border: 'border-teal-500/20',
    bg: 'bg-teal-500/[0.05]',
    hoverBorder: 'hover:border-teal-500/35',
  },
];

const QUICK_LINKS = [
  { label: 'Get API key — free', to: '/get-api-key', icon: Key, primary: true },
  { label: 'View pricing',       to: '/pricing',     icon: Globe, primary: false },
  { label: 'Contact us',         to: '/contact',     icon: ExternalLink, primary: false },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DevelopersPage() {
  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <div className="relative border-b border-white/[0.06] pt-16">
        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[320px] bg-blue-600/[0.05] rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="section-label mb-4">
            <Code2 className="w-3.5 h-3.5" /> Developer Hub
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.04] mb-4">
            Everything you need<br />
            <span className="text-gradient-blue">to ship fast.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}
            className="text-gray-400 text-lg max-w-2xl leading-relaxed mb-7">
            Quick start, full API reference, interactive playground, OpenAPI spec, Postman collection — one click to any resource.
          </motion.p>

          {/* Status strip */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.17 }}
            className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/[0.06]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              <span className="text-[11px] font-mono text-emerald-400">API operational</span>
            </div>
            {[
              { label: 'Base Mainnet', c: 'text-blue-400 border-blue-500/25 bg-blue-500/[0.06]' },
              { label: 'x402 live',    c: 'text-cyan-400 border-cyan-500/25 bg-cyan-500/[0.06]' },
              { label: 'v1.0.0',       c: 'text-gray-400 border-white/[0.10] bg-white/[0.03]' },
            ].map((b) => (
              <span key={b.label} className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${b.c}`}>{b.label}</span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* ── PRIMARY TOOLS ── */}
        <section>
          <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex items-center gap-3 mb-6">
            <h2 className="text-[11px] font-mono text-gray-600 uppercase tracking-widest">Start Building</h2>
            <div className="flex-1 h-px bg-white/[0.05]" />
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {PRIMARY_TOOLS.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -3, transition: { duration: 0.18 } }}
                >
                  <Link to={tool.to}
                    className={`group flex flex-col h-full rounded-2xl border p-6 transition-all duration-200 ${tool.border} ${tool.bg} ${tool.hoverBorder} ${tool.hoverBg}`}
                    style={{ minHeight: 200 }}
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between mb-5">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${tool.border} ${tool.bg}`}>
                        <Icon className={`w-5 h-5 ${tool.accent}`} />
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${tool.badgeColor}`}>
                        {tool.badge}
                      </span>
                    </div>

                    {/* Label + title */}
                    <p className={`text-[10px] font-mono uppercase tracking-widest mb-1 ${tool.accent}`}>{tool.label}</p>
                    <h3 className="text-lg font-bold text-white mb-2 leading-tight">{tool.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed flex-1">{tool.desc}</p>

                    {/* Bottom row */}
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/[0.05]">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xl font-bold font-mono ${tool.accent}`}>{tool.stat.value}</span>
                        <span className="text-xs text-gray-700">{tool.stat.label}</span>
                      </div>
                      <span className={`flex items-center gap-1 text-xs font-medium ${tool.accent} group-hover:gap-2 transition-all`}>
                        {tool.cta}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── RESOURCES ── */}
        <section>
          <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex items-center gap-3 mb-6">
            <h2 className="text-[11px] font-mono text-gray-600 uppercase tracking-widest">Resources</h2>
            <div className="flex-1 h-px bg-white/[0.05]" />
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {RESOURCES.map((res, i) => {
              const Icon = res.icon;
              const inner = (
                <div className={`group flex flex-col h-full rounded-xl border p-4 transition-all duration-200 ${res.border} ${res.bg} ${res.hoverBorder} hover:scale-[1.015] cursor-pointer`}>
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center mb-3 ${res.border} ${res.bg}`}>
                    <Icon className={`w-4 h-4 ${res.accent}`} />
                  </div>
                  <p className="text-sm font-semibold text-white mb-1.5 leading-tight">{res.label}</p>
                  <p className="text-[11px] text-gray-600 leading-snug flex-1">{res.desc}</p>
                  <div className="mt-3 flex items-center gap-1">
                    {res.action === 'download' ? (
                      <span className={`flex items-center gap-1 text-[10px] font-mono ${res.accent}`}>
                        <Download className="w-3 h-3" /> Download
                      </span>
                    ) : (
                      <span className={`flex items-center gap-1 text-[10px] font-mono ${res.accent} group-hover:gap-1.5 transition-all`}>
                        Open <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              );

              return (
                <motion.div
                  key={res.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  {res.action === 'download' ? (
                    <a href={res.href} download={res.download} className="block h-full">{inner}</a>
                  ) : (
                    <Link to={res.to!} className="block h-full">{inner}</Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── SPEC BUTTONS ── */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-1">API Specifications</p>
              <p className="text-sm text-gray-400">Import directly into your toolchain — OpenAPI 3.1.0 or Postman Collection v2.1.</p>
            </div>
            <SpecButtons />
          </div>
        </motion.section>

        {/* ── QUICK LINKS ── */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid sm:grid-cols-3 gap-3 pb-4"
        >
          {QUICK_LINKS.map((ql) => {
            const Icon = ql.icon;
            return (
              <Link key={ql.label} to={ql.to}
                className={`flex items-center justify-between px-5 py-4 rounded-xl border transition-all duration-200 ${
                  ql.primary
                    ? 'bg-blue-600 hover:bg-blue-500 border-blue-500 text-white hover:shadow-blue-glow'
                    : 'glass-card hover:border-white/[0.14] text-gray-400 hover:text-white'
                }`}>
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-semibold">{ql.label}</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-60" />
              </Link>
            );
          })}
        </motion.section>

      </div>

      <Footer />
    </div>
  );
}
