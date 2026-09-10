import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Globe, Coins, Zap, Server, Code2, Package,
  FileText, BookOpen, Activity, RefreshCw,
  CheckCircle, AlertCircle, Loader2, ShieldCheck,
} from 'lucide-react';
import { API_BASE_URL, ENDPOINTS } from '../lib/api';

// ─── Capability tiles ─────────────────────────────────────────────────────────

const CAPABILITIES = [
  {
    icon: Globe,
    label: 'Base Mainnet',
    desc: 'Chain ID 8453 · Coinbase L2',
    color: 'text-blue-400',
    ring: 'border-blue-500/25 bg-blue-500/[0.07]',
  },
  {
    icon: Coins,
    label: 'USDC Settlement',
    desc: 'Native stablecoin · on-chain',
    color: 'text-teal-400',
    ring: 'border-teal-500/25 bg-teal-500/[0.07]',
  },
  {
    icon: Zap,
    label: 'x402 Compatible',
    desc: 'Machine-native HTTP payments',
    color: 'text-cyan-400',
    ring: 'border-cyan-500/25 bg-cyan-500/[0.07]',
  },
  {
    icon: Server,
    label: 'REST API',
    desc: 'Standard HTTP · HTTPS only',
    color: 'text-sky-400',
    ring: 'border-sky-500/25 bg-sky-500/[0.07]',
  },
  {
    icon: Code2,
    label: 'JSON Responses',
    desc: 'application/json · UTF-8',
    color: 'text-emerald-400',
    ring: 'border-emerald-500/25 bg-emerald-500/[0.07]',
  },
  {
    icon: Package,
    label: 'No SDK Required',
    desc: 'Plain fetch · any language',
    color: 'text-orange-400',
    ring: 'border-orange-500/25 bg-orange-500/[0.07]',
  },
  {
    icon: FileText,
    label: 'OpenAPI Support',
    desc: 'Spec v3.1.0 · importable',
    color: 'text-yellow-400',
    ring: 'border-yellow-500/25 bg-yellow-500/[0.07]',
  },
  {
    icon: BookOpen,
    label: 'Developer Docs',
    desc: 'Quickstart · examples · guides',
    color: 'text-gray-400',
    ring: 'border-white/[0.10] bg-white/[0.03]',
  },
  {
    icon: Activity,
    label: 'Live API Status',
    desc: 'Real-time health endpoint',
    color: 'text-emerald-400',
    ring: 'border-emerald-500/25 bg-emerald-500/[0.07]',
  },
];

// ─── Health check types ───────────────────────────────────────────────────────

type HealthState =
  | { phase: 'idle' }
  | { phase: 'loading'; startedAt: number }
  | { phase: 'ok';    data: Record<string, unknown>; latencyMs: number; checkedAt: Date }
  | { phase: 'error'; message: string;               latencyMs: number; checkedAt: Date };

function relativeTime(date: Date): string {
  const s = Math.round((Date.now() - date.getTime()) / 1000);
  if (s < 5)  return 'just now';
  if (s < 60) return `${s}s ago`;
  return `${Math.round(s / 60)}m ago`;
}

// ─── Live health terminal ─────────────────────────────────────────────────────

function HealthTerminal() {
  const [state, setState] = useState<HealthState>({ phase: 'idle' });
  const [tick, setTick] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const firedRef = useRef(false);

  const runCheck = useCallback(async () => {
    const startedAt = Date.now();
    setState({ phase: 'loading', startedAt });
    try {
      const res = await fetch(`${API_BASE_URL}${ENDPOINTS.HEALTH}`, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(10_000),
      });
      const latencyMs = Date.now() - startedAt;
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setState({ phase: 'ok', data: json, latencyMs, checkedAt: new Date() });
      } else {
        setState({ phase: 'error', message: `HTTP ${res.status}`, latencyMs, checkedAt: new Date() });
      }
    } catch (err) {
      const latencyMs = Date.now() - startedAt;
      setState({
        phase: 'error',
        message: err instanceof Error ? err.message : 'Network error',
        latencyMs,
        checkedAt: new Date(),
      });
    }
  }, []);

  // Fire once when section enters viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !firedRef.current) {
          firedRef.current = true;
          runCheck();
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [runCheck]);

  // Tick every second to update relative time display
  useEffect(() => {
    if (state.phase !== 'ok' && state.phase !== 'error') return;
    const id = setInterval(() => setTick(t => t + 1), 5000);
    return () => clearInterval(id);
  }, [state.phase]);

  void tick; // consumed to re-render for relative time

  const url = `${API_BASE_URL}${ENDPOINTS.HEALTH}`;
  const shortUrl = url.replace(/https?:\/\//, '');
  const jsonStr = state.phase === 'ok'
    ? JSON.stringify(state.data, null, 2)
    : '';

  return (
    <div ref={sectionRef}
      className="rounded-2xl overflow-hidden border border-white/[0.08] bg-[#07080e]"
      style={{ boxShadow: '0 24px 48px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)' }}
    >
      {/* Titlebar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-[#0a0b12]">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]/70" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]/70" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]/70" />
        </div>
        <span className="flex-1 text-center text-[11px] font-mono text-gray-600">health-check.sh</span>
        <div className="flex items-center gap-1.5">
          {state.phase === 'loading' ? (
            <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />
          ) : state.phase === 'ok' ? (
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
          ) : state.phase === 'error' ? (
            <span className="relative flex h-1.5 w-1.5">
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-400" />
            </span>
          ) : (
            <span className="relative flex h-1.5 w-1.5">
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-gray-600" />
            </span>
          )}
          <span className={`text-[10px] font-mono ${
            state.phase === 'ok' ? 'text-emerald-400'
            : state.phase === 'error' ? 'text-red-400'
            : state.phase === 'loading' ? 'text-blue-400'
            : 'text-gray-600'
          }`}>
            {state.phase === 'ok' ? 'operational' : state.phase === 'loading' ? 'checking' : state.phase === 'error' ? 'degraded' : 'idle'}
          </span>
        </div>
      </div>

      {/* Terminal body */}
      <div className="p-5 space-y-4 min-h-[260px]">

        {/* Request line */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[12px] font-mono">
            <span className="text-gray-700">$</span>
            <span className="text-white">curl</span>
            <span className="text-emerald-300/80 truncate">{shortUrl}</span>
          </div>
          <div className="text-[10px] font-mono text-gray-700 pl-4 flex items-center gap-2">
            <span className="text-gray-800">→</span>
            <span className="text-gray-600 truncate">{url}</span>
          </div>
        </div>

        {/* Loading */}
        {state.phase === 'loading' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-center gap-2 py-2">
            <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin flex-shrink-0" />
            <span className="text-[12px] font-mono text-blue-400">Connecting to API…</span>
          </motion.div>
        )}

        {/* Success */}
        {state.phase === 'ok' && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="space-y-3">
            {/* HTTP status + latency */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded border text-emerald-400 bg-emerald-500/10 border-emerald-500/25">
                HTTP 200 OK
              </span>
              <span className="text-[11px] font-mono text-gray-600">·</span>
              <span className="text-[11px] font-mono text-gray-400">{state.latencyMs}ms</span>
            </div>

            {/* JSON response */}
            <div className="rounded-lg bg-black/30 border border-white/[0.05] p-3">
              <pre className="text-[12px] font-mono leading-[1.65] text-gray-300 whitespace-pre-wrap break-all">
                {jsonStr.split('\n').map((line, i) => {
                  // Color keys vs values
                  const keyMatch = line.match(/^(\s*")([\w\s]+)(":\s*)(.*)/);
                  if (keyMatch) {
                    return (
                      <span key={i}>
                        <span className="text-gray-600">{keyMatch[1]}</span>
                        <span className="text-blue-300">{keyMatch[2]}</span>
                        <span className="text-gray-600">{keyMatch[3]}</span>
                        <span className={
                          keyMatch[4] === 'true' ? 'text-emerald-400'
                          : keyMatch[4] === 'false' ? 'text-red-400'
                          : keyMatch[4].startsWith('"') ? 'text-emerald-300'
                          : /^\d/.test(keyMatch[4]) ? 'text-yellow-300'
                          : 'text-gray-300'
                        }>{keyMatch[4]}</span>
                        {'\n'}
                      </span>
                    );
                  }
                  return <span key={i}><span className="text-gray-600">{line}</span>{'\n'}</span>;
                })}
              </pre>
            </div>
          </motion.div>
        )}

        {/* Error */}
        {state.phase === 'error' && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded border text-red-400 bg-red-500/10 border-red-500/25">
                ERROR
              </span>
              {state.latencyMs > 0 && (
                <span className="text-[11px] font-mono text-gray-600">{state.latencyMs}ms</span>
              )}
            </div>
            <div className="rounded-lg bg-black/30 border border-red-500/10 p-3">
              <p className="text-[12px] font-mono text-red-400 leading-relaxed">{state.message}</p>
            </div>
          </motion.div>
        )}

        {/* Idle placeholder */}
        {state.phase === 'idle' && (
          <div className="flex items-center gap-2 py-2">
            <span className="text-[12px] font-mono text-gray-700">Waiting for viewport…</span>
          </div>
        )}
      </div>

      {/* Status footer */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.05] bg-white/[0.015]">
        <div className="flex items-center gap-2">
          {state.phase === 'ok' && (
            <>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span className="text-[11px] font-mono text-emerald-400">
                Operational
              </span>
              <span className="text-[11px] font-mono text-gray-700">·</span>
              <span className="text-[11px] font-mono text-gray-600">
                {relativeTime(state.checkedAt)}
              </span>
            </>
          )}
          {state.phase === 'error' && (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
              <span className="text-[11px] font-mono text-red-400">
                Check failed · {relativeTime(state.checkedAt)}
              </span>
            </>
          )}
          {state.phase === 'loading' && (
            <span className="text-[11px] font-mono text-gray-600">Running check…</span>
          )}
          {state.phase === 'idle' && (
            <span className="text-[11px] font-mono text-gray-700">
              {url}
            </span>
          )}
        </div>

        <button
          onClick={runCheck}
          disabled={state.phase === 'loading'}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono text-gray-600 hover:text-gray-200 glass-card hover:border-white/[0.14] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-3 h-3 ${state.phase === 'loading' ? 'animate-spin' : ''}`} />
          re-run
        </button>
      </div>
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

export default function BuiltForProduction() {
  return (
    <section id="built-for-production" className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-label mb-4 justify-center"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Production Ready
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.07 }}
            className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4"
          >
            Built for production.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.14 }}
            className="text-gray-400 text-lg max-w-xl mx-auto"
          >
            REST API over HTTPS. JSON responses. No SDK required. Health endpoint is public — call it right now.
          </motion.p>
        </div>

        {/* Two-column: capability tiles + live terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-12 items-start">

          {/* Left: 3×3 capability grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {CAPABILITIES.map((cap, i) => {
              const Icon = cap.icon;
              return (
                <motion.div
                  key={cap.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className={`flex items-start gap-3 p-4 rounded-xl border ${cap.ring} transition-all hover:scale-[1.015]`}
                >
                  <div className={`w-8 h-8 rounded-lg border ${cap.ring} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${cap.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white leading-tight mb-0.5">{cap.label}</p>
                    <p className="text-[11px] font-mono text-gray-600 leading-snug">{cap.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right: live health terminal */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:sticky lg:top-24"
          >
            {/* Label */}
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Live Health Check</span>
            </div>
            <HealthTerminal />
            {/* Endpoint note */}
            <p className="text-[10px] font-mono text-gray-700 mt-3 text-center">
              Public endpoint · no auth required · try it yourself
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
