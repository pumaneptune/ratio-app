import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { History, ArrowRight, CheckCircle, AlertCircle, Zap, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// ─── Changelog data ───────────────────────────────────────────────────────────

type ChangeKind = 'new' | 'improved' | 'fixed' | 'breaking';

interface ChangeEntry {
  kind: ChangeKind;
  text: string;
}

interface Release {
  version: string;
  date: string;
  tag?: string;
  tagColor?: string;
  summary: string;
  changes: ChangeEntry[];
}

const RELEASES: Release[] = [
  {
    version: '1.2.0',
    date: 'June 10, 2026',
    tag: 'latest',
    tagColor: 'text-emerald-400 border-emerald-500/25 bg-emerald-500/[0.07]',
    summary: 'Developer Hub, OpenAPI spec, Postman collection, and the Built For Production section with live health check.',
    changes: [
      { kind: 'new',      text: '/developers — Developer Hub with one-click access to all resources' },
      { kind: 'new',      text: 'OpenAPI 3.1.0 spec published at /openapi.json' },
      { kind: 'new',      text: 'Postman Collection v2.1 with 9 pre-built requests at /postman_collection.json' },
      { kind: 'new',      text: 'Download OpenAPI Spec / Run in Postman / Download Postman Collection buttons sitewide' },
      { kind: 'new',      text: 'Built For Production homepage section with live GET /health terminal' },
      { kind: 'new',      text: 'Animated REQUEST → VERIFY → PAYMENT → RESPONSE pipeline terminal on Marketplace Kit' },
      { kind: 'improved', text: 'Marketplace Kit page linked from Navbar and Footer' },
    ],
  },
  {
    version: '1.1.1',
    date: 'June 8, 2026',
    summary: 'Performance improvements, vendor compatibility fixes, and playground enhancements.',
    changes: [
      { kind: 'improved', text: 'Playground: request history now persists up to 20 entries per session' },
      { kind: 'improved', text: 'API Reference: multi-language snippets (curl, JS, TS, Python) for all endpoints' },
      { kind: 'improved', text: 'Response latency reduced ~12% via Base RPC connection pooling' },
      { kind: 'fixed',    text: 'x402 payment header parsing edge case when proof contains padding characters' },
      { kind: 'fixed',    text: 'CORS preflight rejection on non-standard client User-Agent strings' },
    ],
  },
  {
    version: '1.1.0',
    date: 'June 5, 2026',
    summary: 'ACP Decide endpoint, x402 support on all ACP routes, and Virtuals ACP listing.',
    changes: [
      { kind: 'new',      text: 'POST /v1/acp/decide — policy-driven decision engine with full reasoning chain' },
      { kind: 'new',      text: 'x402 machine-payment accepted on /v1/acp/decide ($0.01 USDC per call)' },
      { kind: 'new',      text: 'Virtuals ACP registered — VerifyProceed agent discoverable via /v1/agents' },
      { kind: 'new',      text: 'Failure mode analysis now included in all GuardResponse and DecideResponse payloads' },
      { kind: 'improved', text: 'Guard verdict confidence scoring improved — reduced false warn rate by 18%' },
      { kind: 'improved', text: 'POST /v1/api-keys/signup: keys provisioned in < 200ms (down from ~900ms)' },
    ],
  },
  {
    version: '1.0.1',
    date: 'May 20, 2026',
    summary: 'Patch — rate limit header improvements and free-tier quota fix.',
    changes: [
      { kind: 'fixed',    text: 'Free tier: 100 req/month quota now resets correctly on UTC midnight' },
      { kind: 'fixed',    text: 'Retry-After header value was off by 1 second in some edge cases' },
      { kind: 'improved', text: 'All 4xx responses now include RFC 7807 { error, message, code } body' },
      { kind: 'improved', text: 'Health endpoint /health now returns API name in response body' },
    ],
  },
  {
    version: '1.0.0',
    date: 'May 13, 2026',
    tag: 'initial release',
    tagColor: 'text-blue-400 border-blue-500/25 bg-blue-500/[0.07]',
    summary: 'Initial public release. Guard API live on Base Mainnet with x402 payments and API key support.',
    changes: [
      { kind: 'new', text: 'GET  /health — public liveness endpoint' },
      { kind: 'new', text: 'GET  /v1/capabilities — capability manifest' },
      { kind: 'new', text: 'GET  /v1/agents — agent discovery' },
      { kind: 'new', text: 'POST /functions/v1/api-key-signup — self-service key provisioning (free tier: 100 req/month)' },
      { kind: 'new', text: 'POST /v1/acp/guard — ACP pre-execution safety check ($0.01 USDC · x402 or Bearer)' },
      { kind: 'new', text: 'POST /functions/v1/guard — private guard with up to 10 checks ($0.01 · Bearer required)' },
      { kind: 'new', text: 'x402 protocol: agents pay $0.01 USDC on Base Mainnet per call on ACP endpoints' },
      { kind: 'new', text: 'Checks: RPC health, stablecoin depeg, bridge exploit monitor, DEX liquidity, rug-pull risk' },
    ],
  },
];

// ─── Kind badge ───────────────────────────────────────────────────────────────

const KIND_STYLES: Record<ChangeKind, { label: string; cls: string }> = {
  new:      { label: 'new',      cls: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25' },
  improved: { label: 'improved', cls: 'text-blue-400 bg-blue-500/10 border-blue-500/25' },
  fixed:    { label: 'fixed',    cls: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/25' },
  breaking: { label: 'breaking', cls: 'text-red-400 bg-red-500/10 border-red-500/25' },
};

function KindBadge({ kind }: { kind: ChangeKind }) {
  const s = KIND_STYLES[kind];
  return (
    <span className={`inline-block flex-shrink-0 text-[9px] font-bold font-mono uppercase tracking-wide px-1.5 py-0.5 rounded border ${s.cls}`}>
      {s.label}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChangelogPage() {
  const hasBreaking = RELEASES.some((r) => r.changes.some((c) => c.kind === 'breaking'));

  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <div className="relative border-b border-white/[0.06] pt-16">
        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="section-label mb-4">
            <History className="w-3.5 h-3.5" /> Changelog
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
            className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            What's new.
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}
            className="text-gray-400 text-lg max-w-xl leading-relaxed mb-6">
            Version history for the VerifyProceed API. Breaking changes are always flagged. Migration notes included where applicable.
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.17 }}
            className="flex flex-wrap items-center gap-3">
            {(Object.entries(KIND_STYLES) as [ChangeKind, typeof KIND_STYLES[ChangeKind]][])
              .filter(([k]) => k !== 'breaking' || hasBreaking)
              .map(([, s]) => (
                <span key={s.label} className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${s.cls}`}>{s.label}</span>
              ))}
          </motion.div>
        </div>
      </div>

      {/* ── RELEASES ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[7px] top-2 bottom-0 w-px bg-white/[0.06] hidden sm:block" />

          <div className="space-y-12">
            {RELEASES.map((release, i) => (
              <motion.article
                key={release.version}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="sm:pl-8 relative"
              >
                {/* Timeline dot */}
                <div className={`hidden sm:block absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 ${
                  i === 0 ? 'border-emerald-400 bg-emerald-400/20' : 'border-white/[0.20] bg-[#050508]'
                }`} />

                {/* Version header */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold font-mono text-white">v{release.version}</span>
                    {release.tag && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${release.tagColor}`}>
                        {release.tag}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-gray-600">{release.date}</span>
                </div>

                {/* Summary */}
                <p className="text-sm text-gray-400 leading-relaxed mb-5 max-w-2xl">{release.summary}</p>

                {/* Changes */}
                <div className="space-y-2.5">
                  {release.changes.map((change, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <KindBadge kind={change.kind} />
                      <p className="text-sm text-gray-300 leading-relaxed">{change.text}</p>
                    </div>
                  ))}
                </div>

                {i < RELEASES.length - 1 && (
                  <div className="mt-10 h-px bg-white/[0.05]" />
                )}
              </motion.article>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-white/[0.06]"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-white">No breaking changes since v1.0.0</span>
              </div>
              <p className="text-xs text-gray-600">
                All v1.x releases are backwards-compatible. Breaking changes will be flagged and include a migration guide.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/developers"
                className="flex items-center gap-1.5 px-4 py-2 glass-card hover:border-white/[0.14] text-gray-400 hover:text-white text-sm font-medium rounded-xl transition-all">
                <History className="w-3.5 h-3.5" />
                Developer Hub
                <ChevronRight className="w-3.5 h-3.5 text-gray-700" />
              </Link>
              <Link to="/api-reference"
                className="flex items-center gap-1.5 px-4 py-2 glass-card hover:border-white/[0.14] text-gray-400 hover:text-white text-sm font-medium rounded-xl transition-all">
                API Reference
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── UPGRADE NUDGE ── */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl border border-blue-500/20 bg-blue-500/[0.04] p-7"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white mb-1">Always on the latest?</p>
                <p className="text-xs text-gray-500 leading-relaxed max-w-md">
                  The API is versioned in the URL path (/v1/...). You'll never be forced to migrate without notice.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <Link to="/get-api-key"
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all">
                Get API Key — Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/docs"
                className="flex items-center gap-2 px-5 py-2.5 glass-card hover:border-white/[0.14] text-gray-400 hover:text-white text-sm font-semibold rounded-xl transition-all">
                Read Docs
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
