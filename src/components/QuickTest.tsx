import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Copy, Check, Terminal, ArrowRight, ChevronRight, Play } from 'lucide-react';

type TabId = 'health' | 'guard' | 'acp';

interface TabData {
  id: TabId;
  label: string;
  method: string;
  endpoint: string;
  statusCode: number;
  statusLabel: string;
  statusColor: string;
  curl: string;
  response: string;
  responseNote?: string;
}

const TABS: TabData[] = [
  {
    id: 'health',
    label: 'Health Check',
    method: 'GET',
    endpoint: '/health',
    statusCode: 200,
    statusLabel: '200 OK',
    statusColor: 'text-emerald-400',
    curl: `curl https://api.verifyproceed.com/health`,
    response: `{
  "ok": true,
  "name": "VerifyProceed API"
}`,
  },
  {
    id: 'guard',
    label: 'Guard',
    method: 'POST',
    endpoint: '/v1/acp/guard',
    statusCode: 200,
    statusLabel: '200 OK · 183ms',
    statusColor: 'text-emerald-400',
    curl: `curl -X POST https://api.verifyproceed.com/v1/acp/guard \\
  -H "Content-Type: application/json" \\
  -d '{
    "action": "swap",
    "chain": "base",
    "amount_usd": 5000,
    "asset": "USDC"
  }'`,
    response: `{
  "verdict": "proceed",
  "confidence": 0.94,
  "risk": "low",
  "expires_in": 300,
  "decision": {
    "action": "execute_swap",
    "reason": "All safety checks passed."
  },
  "evidence": [
    { "type": "rpc", "status": 200, "ok": true },
    { "type": "stablecoin_depeg", "asset_id": "usd-coin", "ok": true }
  ],
  "failure_modes": [],
  "latency_ms": 183
}`,
  },
  {
    id: 'acp',
    label: 'ACP Guard',
    method: 'POST',
    endpoint: '/v1/acp/guard',
    statusCode: 402,
    statusLabel: '402 Payment Required',
    statusColor: 'text-yellow-400',
    curl: `curl -X POST https://api.verifyproceed.com/v1/acp/guard \\
  -H "Content-Type: application/json" \\
  -d '{
    "action": "bridge",
    "amount_usd": 50000,
    "strict_mode": true
  }'`,
    response: `{
  "status": "payment_required",
  "code": 402,
  "price": "0.01",
  "currency": "USDC",
  "network": "base",
  "pay_to": "0x3f4a...c8b1",
  "note": "Pay via x402 and retry to receive verdict"
}`,
    responseNote: 'Agent pays $0.01 USDC on Base, retries, receives verdict.',
  },
];

function highlightCurl(code: string): React.ReactNode[] {
  return code.split('\n').map((line, i) => {
    // Continuation backslash line
    const isContinuation = line.trim().endsWith('\\');
    const cleanLine = isContinuation ? line.slice(0, line.lastIndexOf('\\')) : line;

    // URL
    if (i === 0) {
      const parts = cleanLine.split(' ');
      return (
        <div key={i} className="leading-7">
          <span className="text-purple-400">{parts[0]}</span>
          {parts.slice(1).map((p, j) => (
            <span key={j}>
              {' '}
              {p.startsWith('https') ? <span className="text-emerald-300">{p}</span> : <span className="text-gray-300">{p}</span>}
            </span>
          ))}
        </div>
      );
    }

    // Flags like -X, -H, -d
    const flagMatch = cleanLine.match(/^(\s*)(--?\w+)(.*)$/);
    if (flagMatch) {
      const [, indent, flag, rest] = flagMatch;
      // String value after flag
      const strMatch = rest.match(/^(\s*)(".+")(.*)$/);
      return (
        <div key={i} className="leading-7">
          {indent}
          <span className="text-yellow-400">{flag}</span>
          {strMatch
            ? <><span className="text-gray-500">{strMatch[1]}</span><span className="text-cyan-300">{strMatch[2]}</span><span className="text-gray-300">{strMatch[3]}</span></>
            : <span className="text-gray-300">{rest}</span>
          }
          {isContinuation && <span className="text-gray-700"> \</span>}
        </div>
      );
    }

    // JSON-like body lines
    const kvMatch = cleanLine.match(/^(\s*)("[\w_]+")(\s*:\s*)(.+?)(,?)(\s*)$/);
    if (kvMatch) {
      const [, indent, key, colon, val, comma] = kvMatch;
      let valEl: React.ReactNode;
      if (val.startsWith('"')) valEl = <span className="text-emerald-300">{val}</span>;
      else if (/^\d+$/.test(val)) valEl = <span className="text-blue-300">{val}</span>;
      else if (val === 'true' || val === 'false') valEl = <span className="text-purple-400">{val}</span>;
      else valEl = <span className="text-gray-300">{val}</span>;
      return (
        <div key={i} className="leading-7">
          {indent}<span className="text-blue-200">{key}</span><span className="text-gray-600">{colon}</span>{valEl}<span className="text-gray-500">{comma}</span>
        </div>
      );
    }

    // Braces
    if (/^\s*[{}'\s,]*$/.test(cleanLine)) {
      return <div key={i} className="leading-7 text-gray-600">{cleanLine}{isContinuation && <span className="text-gray-700"> \</span>}</div>;
    }

    return <div key={i} className="leading-7 text-gray-300">{cleanLine}{isContinuation && <span className="text-gray-700"> \</span>}</div>;
  });
}

function highlightJson(code: string): React.ReactNode[] {
  return code.split('\n').map((line, i) => {
    const kvMatch = line.match(/^(\s*)("[\w_]+")(\s*:\s*)(.+?)(,?)(\s*)$/);
    if (kvMatch) {
      const [, indent, key, colon, val, comma] = kvMatch;
      let valEl: React.ReactNode;
      if (val.startsWith('"')) valEl = <span className="text-emerald-300">{val}</span>;
      else if (/^[\d.]+$/.test(val)) valEl = <span className="text-blue-300">{val}</span>;
      else if (val === 'true' || val === 'false' || val === 'null') valEl = <span className="text-purple-400">{val}</span>;
      else valEl = <span className="text-gray-300">{val}</span>;
      return (
        <div key={i} className="leading-7">
          {indent}<span className="text-blue-200">{key}</span><span className="text-gray-600">{colon}</span>{valEl}<span className="text-gray-500">{comma}</span>
        </div>
      );
    }
    if (/^\s*[{},\s]*$/.test(line)) return <div key={i} className="leading-7 text-gray-600">{line}</div>;
    return <div key={i} className="leading-7 text-gray-300">{line}</div>;
  });
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handle}
      className="flex items-center gap-1.5 text-xs font-mono text-gray-600 hover:text-gray-300 transition-colors px-2 py-1 rounded hover:bg-white/[0.04]"
    >
      {copied
        ? <><Check className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400">Copied</span></>
        : <><Copy className="w-3 h-3" /><span>Copy</span></>
      }
    </button>
  );
}

function LineNumbers({ count }: { count: number }) {
  return (
    <div className="select-none pr-4 border-r border-white/[0.04] text-right" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="leading-7 text-[11px] text-gray-700">{i + 1}</div>
      ))}
    </div>
  );
}

export default function QuickTest() {
  const [active, setActive] = useState<TabId>('health');
  const tab = TABS.find((t) => t.id === active)!;

  const curlLines = tab.curl.split('\n').length;
  const responseLines = tab.response.split('\n').length;

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-25" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/[0.05] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-label mb-4 justify-center"
          >
            <Terminal className="w-3.5 h-3.5" />
            Quick Start
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4"
          >
            Test VerifyProceed in{' '}
            <span className="text-gradient-blue">30 Seconds</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.14 }}
            className="text-lg text-gray-500 max-w-md mx-auto font-mono"
          >
            No SDK.&nbsp;&nbsp;No setup.&nbsp;&nbsp;Just send a request.
          </motion.p>
        </div>

        {/* Terminal window */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card rounded-2xl overflow-hidden border border-white/[0.09] shadow-2xl"
        >
          {/* Window chrome */}
          <div className="flex items-center gap-0 border-b border-white/[0.06] bg-white/[0.02]">
            {/* Traffic lights */}
            <div className="flex items-center gap-1.5 px-4 py-3.5 border-r border-white/[0.05]">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
            </div>

            {/* Tabs */}
            <div className="flex items-end h-full">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActive(t.id)}
                  className={`relative flex items-center gap-2 px-5 py-3.5 text-xs font-mono border-r border-white/[0.05] transition-all duration-150 ${
                    active === t.id
                      ? 'text-white bg-white/[0.04]'
                      : 'text-gray-600 hover:text-gray-400 hover:bg-white/[0.02]'
                  }`}
                >
                  {active === t.id && (
                    <motion.div
                      layoutId="tab-underline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 rounded-t"
                    />
                  )}
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    t.method === 'GET'
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : 'text-blue-400 bg-blue-500/10'
                  }`}>
                    {t.method}
                  </span>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Right side live indicator */}
            <div className="ml-auto flex items-center gap-2 px-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-[11px] font-mono text-gray-600">live</span>
            </div>
          </div>

          {/* Content area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.05]"
            >
              {/* Left: curl command */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.05] bg-white/[0.01]">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-gray-600 uppercase tracking-wider">Request</span>
                    <span className="text-[10px] font-mono text-gray-700 px-1.5 py-0.5 rounded bg-white/[0.03] border border-white/[0.05]">
                      curl
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-gray-600">{tab.endpoint}</span>
                    <CopyButton text={tab.curl} />
                  </div>
                </div>
                <div className="overflow-auto p-5">
                  <pre className="text-[13px] font-mono leading-7">
                    <div className="flex gap-4">
                      <LineNumbers count={curlLines} />
                      <div className="flex-1 min-w-0">
                        {highlightCurl(tab.curl)}
                      </div>
                    </div>
                  </pre>
                </div>
              </div>

              {/* Right: response */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.05] bg-white/[0.01]">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-gray-600 uppercase tracking-wider">Response</span>
                    <span className={`text-[11px] font-mono font-bold ${tab.statusColor}`}>
                      {tab.statusLabel}
                    </span>
                  </div>
                  <CopyButton text={tab.response} />
                </div>
                <div className="overflow-auto p-5 flex-1">
                  <pre className="text-[13px] font-mono leading-7">
                    <div className="flex gap-4">
                      <LineNumbers count={responseLines} />
                      <div className="flex-1 min-w-0">
                        {highlightJson(tab.response)}
                      </div>
                    </div>
                  </pre>

                  {tab.responseNote && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="mt-4 flex items-start gap-2 px-3 py-2.5 rounded-lg bg-yellow-500/[0.06] border border-yellow-500/20"
                    >
                      <span className="text-yellow-500 text-xs font-mono font-bold flex-shrink-0 mt-0.5">x402</span>
                      <p className="text-xs font-mono text-yellow-400/80 leading-relaxed">{tab.responseNote}</p>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Footer bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-t border-white/[0.05] bg-white/[0.01]">
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-gray-600">
              <span>api.verifyproceed.com</span>
              <span className="text-gray-800">·</span>
              <span>REST · JSON · No auth on health</span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/playground"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all duration-200 text-xs active:scale-[0.97]"
              >
                <Play className="w-3 h-3" />
                Open Playground
              </Link>
              <Link
                to="/docs"
                className="inline-flex items-center gap-1.5 px-4 py-2 glass-card hover:border-white/15 text-gray-400 hover:text-white font-semibold rounded-lg transition-all duration-200 text-xs active:scale-[0.97]"
              >
                View Docs
                <ChevronRight className="w-3 h-3 text-gray-600" />
              </Link>
              <Link
                to="/get-api-key"
                className="inline-flex items-center gap-1 px-2 py-2 text-gray-500 hover:text-blue-400 font-medium text-xs transition-colors"
              >
                Get API Key
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Endpoint quick-ref below */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-2 mt-6"
        >
          {[
            { method: 'GET',  path: '/health',          color: 'text-emerald-400' },
            { method: 'POST', path: '/v1/guard',        color: 'text-blue-400' },
            { method: 'POST', path: '/v1/acp/guard',    color: 'text-blue-400' },
            { method: 'POST', path: '/v1/acp/decide',   color: 'text-blue-400' },
            { method: 'GET',  path: '/v1/capabilities', color: 'text-emerald-400' },
          ].map((ep) => (
            <span key={ep.path} className="flex items-center gap-2 glass-card rounded-lg px-3 py-1.5 text-[11px] font-mono border border-white/[0.04]">
              <span className={ep.color}>{ep.method}</span>
              <span className="text-gray-600">{ep.path}</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
