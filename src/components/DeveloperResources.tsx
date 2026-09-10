import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Zap, Code2, Play, FileText, Package, History, BookOpen,
  ArrowRight, ExternalLink,
} from 'lucide-react';

const resources = [
  {
    icon: Zap,
    label: 'Quick Start',
    sub: '5 min to first call',
    desc: 'Get an API key, fund a wallet with USDC on Base, and POST /v1/acp/guard. No SDK required.',
    to: '/docs/quickstart',
    color: 'text-emerald-400',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/[0.06]',
    badge: '5 min',
  },
  {
    icon: Code2,
    label: 'API Reference',
    sub: 'Full REST docs',
    desc: 'Request schemas, response types, auth flows, error codes, and multi-language fetch examples.',
    to: '/api-reference',
    color: 'text-blue-400',
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/[0.06]',
    badge: 'REST',
  },
  {
    icon: Play,
    label: 'Playground',
    sub: 'Fire live requests',
    desc: 'Interactive API explorer. Paste your key, pick an endpoint, send a request — see the real JSON response.',
    to: '/playground',
    color: 'text-cyan-400',
    border: 'border-cyan-500/20',
    bg: 'bg-cyan-500/[0.06]',
    badge: 'Live',
  },
  {
    icon: FileText,
    label: 'Use Cases',
    sub: '9 integration patterns',
    desc: 'Trading bots, wallet agents, DeFi automation, MCP tools, x402 APIs, agent commerce — with request and response examples.',
    to: '/use-cases',
    color: 'text-sky-400',
    border: 'border-sky-500/20',
    bg: 'bg-sky-500/[0.06]',
    badge: '9 patterns',
  },
  {
    icon: Package,
    label: 'Marketplace Kit',
    sub: 'Agent listing resources',
    desc: 'Everything needed to list your agent on Virtuals and other ACP-compatible agent marketplaces.',
    to: '/marketplace-kit',
    color: 'text-purple-400',
    border: 'border-purple-500/20',
    bg: 'bg-purple-500/[0.06]',
    badge: 'ACP',
  },
  {
    icon: History,
    label: 'Changelog',
    sub: 'Releases and updates',
    desc: 'API version history, breaking changes, new endpoints, and deprecation notices.',
    to: '/changelog',
    color: 'text-gray-400',
    border: 'border-white/[0.08]',
    bg: 'bg-white/[0.03]',
    badge: null,
  },
];

export default function DeveloperResources() {
  return (
    <section id="developer-resources" className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-label mb-4"
            >
              <Code2 className="w-3.5 h-3.5" />
              Developer Resources
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-3"
            >
              Everything you need<br />to integrate.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.14 }}
              className="text-gray-400 text-base max-w-lg"
            >
              Quickstart, full API reference, live playground, use-case patterns, and spec files — all in one place.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex-shrink-0"
          >
            <a
              href="/openapi.json"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-xl text-sm text-gray-400 hover:text-white hover:border-white/[0.14] transition-all font-mono"
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
              OpenAPI Spec
              <ExternalLink className="w-3.5 h-3.5 opacity-50" />
            </a>
          </motion.div>
        </div>

        {/* Resource grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={r.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  to={r.to}
                  className={`flex flex-col h-full p-5 rounded-2xl border ${r.border} ${r.bg} hover:border-opacity-60 transition-all duration-200 group`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl border ${r.border} flex items-center justify-center bg-black/20`}>
                      <Icon className={`w-4.5 h-4.5 ${r.color}`} style={{ width: 18, height: 18 }} />
                    </div>
                    {r.badge && (
                      <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${r.border} ${r.bg} ${r.color}`}>
                        {r.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-semibold text-sm">{r.label}</span>
                    </div>
                    <p className="text-[11px] font-mono text-gray-600 mb-2">{r.sub}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{r.desc}</p>
                  </div>

                  <div className={`flex items-center gap-1 mt-4 text-xs font-medium ${r.color} opacity-70 group-hover:opacity-100 transition-opacity`}>
                    Go to {r.label}
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
