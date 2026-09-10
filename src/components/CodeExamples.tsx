import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Copy, Check, Code, ArrowRight, ChevronRight, Zap } from 'lucide-react';

type Tab = 'guard' | 'decide' | 'payment';

interface Example {
  label: string;
  tag: string;
  description: string;
  steps: { label: string; status: string; statusColor: string }[];
  panels: { title: string; statusLabel: string; statusColor: string; code: string; lang: string }[];
}

const examples: Record<Tab, Example> = {
  guard: {
    label: 'Oracle API',
    tag: 'POST /v1/oracle',
    description: 'Pre-execution safety check for any on-chain action. Returns a deterministic verdict before your agent commits.',
    steps: [
      { label: 'Request sent', status: 'POST', statusColor: 'text-blue-400' },
      { label: '402 Payment Required', status: '402', statusColor: 'text-yellow-300' },
      { label: 'USDC paid on Base', status: 'paid', statusColor: 'text-purple-400' },
      { label: 'Verified response', status: '200', statusColor: 'text-emerald-400' },
    ],
    panels: [
      {
        title: 'request',
        statusLabel: 'POST /v1/oracle',
        statusColor: 'text-blue-400',
        lang: 'ts',
        code: `const response = await fetch(
  'https://api.verifyproceed.com/v1/oracle',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'swap',
      chain: 'base',
      assets: ['USDC', 'USDT'],
      amount_usd: 25000,
    }),
  }
);`,
      },
      {
        title: 'response',
        statusLabel: '200 OK · 183ms',
        statusColor: 'text-emerald-400',
        lang: 'json',
        code: `{
  "verdict": "halt",
  "risk": "high",
  "checks": {
    "stablecoin_peg": "FAIL — USDT at 0.971",
    "bridge_exploit_monitor": "pass",
    "rpc_health": "pass",
    "liquidity_depth": "pass"
  },
  "reasoning": "USDT is losing its value right now.",
  "latency_ms": 183
}`,
      },
    ],
  },

  decide: {
    label: 'Evaluator API',
    tag: 'POST /v1/acp/evaluate',
    description: 'Neutral third-party evaluator for financial and on-chain ACP jobs. Reads the actual blockchain to confirm a deliverable is real before releasing or refunding payment.',
    steps: [
      { label: 'Request sent', status: 'POST', statusColor: 'text-blue-400' },
      { label: '402 Payment Required', status: '402', statusColor: 'text-yellow-300' },
      { label: 'USDC paid on Base', status: 'paid', statusColor: 'text-purple-400' },
      { label: 'Verified response', status: '200', statusColor: 'text-emerald-400' },
    ],
    panels: [
      {
        title: 'request',
        statusLabel: 'POST /v1/acp/evaluate',
        statusColor: 'text-blue-400',
        lang: 'ts',
        code: `const response = await fetch(
  'https://api.verifyproceed.com/v1/acp/evaluate',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      job_id: 'acp_8823',
      job_type: 'bridge_transfer',
      deliverable_tx_hash: '0x9c2f...e8a1',
      claimed_amount_usd: 12000,
    }),
  }
);`,
      },
      {
        title: 'response',
        statusLabel: '200 OK · 640ms',
        statusColor: 'text-emerald-400',
        lang: 'json',
        code: `{
  "ruling": "complete",
  "reason_category": "verified_on_chain",
  "checks": {
    "transaction_confirmed": "pass",
    "destination_amount_matches": "pass",
    "bridge_status_at_execution": "pass"
  },
  "reasoning": "Transfer confirmed on both chains, amount matches within tolerance.",
  "tx_hash": "0xEVAL...a3f7",
  "latency_ms": 640
}`,
      },
    ],
  },

  payment: {
    label: 'Payment Flow',
    tag: 'x402 protocol',
    description: 'The full x402 machine-payment cycle. Agent receives 402, pays in USDC on Base, retries automatically, receives verified result.',
    steps: [
      { label: 'Agent sends request', status: 'POST', statusColor: 'text-blue-400' },
      { label: '402 Payment Required', status: '402', statusColor: 'text-yellow-300' },
      { label: 'Agent pays $0.01 USDC on Base', status: 'paid', statusColor: 'text-purple-400' },
      { label: 'Request retries', status: 'retry', statusColor: 'text-cyan-400' },
      { label: 'Verified response', status: '200', statusColor: 'text-emerald-400' },
    ],
    panels: [
      {
        title: 'payment handler',
        statusLabel: 'x402 · USDC on Base',
        statusColor: 'text-purple-400',
        lang: 'ts',
        code: `async function callWithPayment(endpoint, body) {
  // 1. Initial request — no auth needed
  let res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  // 2. Handle 402 Payment Required
  if (res.status === 402) {
    const challenge = await res.json();

    // 3. Agent pays in USDC on Base via x402
    const payment = await payUSDC({
      to: challenge.pay_to,
      amount: challenge.amount,
      chain: 'base',
    });

    // 4. Retry with x402 payment header
    res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...payment.headers, // x402 payment header added by SDK
      },
      body: JSON.stringify(body),
    });
  }

  return res.json();
}`,
      },
      {
        title: 'wire protocol',
        statusLabel: '402 → 200 · ~1.2s',
        statusColor: 'text-yellow-300',
        lang: 'json',
        code: `// ← 402 Payment Required
{
  "error": "payment_required",
  "amount": "0.01",
  "token": "USDC",
  "network": "base",
  "pay_to": "0x3f4a...c8b1",
  "expires_at": 1716234000
}

// ← 200 OK (after x402 payment + retry)
{
  "verdict": "block",
  "confidence": 0.92,
  "risk": "high",
  "payment_confirmed": true,
  "tx_hash": "0xabc...def",
  "latency_ms": 198
}`,
      },
    ],
  },
};

// Syntax highlighting
function highlight(code: string, lang: string): React.ReactNode[] {
  const lines = code.split('\n');
  return lines.map((line, i) => {
    if (lang === 'json') {
      return (
        <div key={i} className="leading-7">
          {highlightJsonLine(line)}
        </div>
      );
    }
    return (
      <div key={i} className="leading-7">
        {highlightTsLine(line)}
      </div>
    );
  });
}

function highlightJsonLine(line: string) {
  // Comment lines
  if (line.trim().startsWith('//')) {
    return <span className="text-gray-600 italic">{line}</span>;
  }
  // Key: "value" pattern
  const keyValMatch = line.match(/^(\s*)("[\w_]+")(\s*:\s*)(.+?)(\s*,?)$/);
  if (keyValMatch) {
    const [, indent, key, colon, val, comma] = keyValMatch;
    let valueEl: React.ReactNode;
    if (val.startsWith('"')) valueEl = <span className="text-emerald-300">{val}</span>;
    else if (val === 'true' || val === 'false' || val === 'null') valueEl = <span className="text-purple-400">{val}</span>;
    else if (/^[\d.]+$/.test(val)) valueEl = <span className="text-blue-300">{val}</span>;
    else valueEl = <span className="text-gray-300">{val}</span>;
    return (
      <>
        {indent}
        <span className="text-blue-200">{key}</span>
        <span className="text-gray-500">{colon}</span>
        {valueEl}
        <span className="text-gray-500">{comma}</span>
      </>
    );
  }
  if (line.trim() === '{' || line.trim() === '}' || line.trim() === '{,' || line.trim() === '},') {
    return <span className="text-gray-500">{line}</span>;
  }
  return <span className="text-gray-300">{line}</span>;
}

function highlightTsLine(line: string) {
  if (line.trim().startsWith('//')) {
    return <span className="text-gray-600 italic">{line}</span>;
  }
  // Keywords
  let result = line
    .replace(/\b(const|let|async|await|function|return|if|new)\b/g, '<kw>$1</kw>')
    .replace(/'([^']*)'/g, '<str>\'$1\'</str>');

  const parts: React.ReactNode[] = [];
  const regex = /<kw>(.*?)<\/kw>|<str>(.*?)<\/str>/g;
  let last = 0;
  let match;
  while ((match = regex.exec(result)) !== null) {
    if (match.index > last) parts.push(<span key={last} className="text-gray-300">{result.slice(last, match.index)}</span>);
    if (match[1] !== undefined) parts.push(<span key={match.index} className="text-purple-400">{match[1]}</span>);
    if (match[2] !== undefined) parts.push(<span key={match.index} className="text-emerald-300">{match[2]}</span>);
    last = match.index + match[0].length;
  }
  if (last < result.length) parts.push(<span key={last} className="text-gray-300">{result.slice(last)}</span>);
  return parts.length ? parts : <span className="text-gray-300">{line}</span>;
}

function CodePanel({ panel, onCopy, copied }: {
  panel: Example['panels'][0];
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="flex flex-col h-full glass-card rounded-xl overflow-hidden border border-white/[0.07]">
      {/* Chrome bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.015] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/45" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/45" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/45" />
          </div>
          <span className="text-xs font-mono text-gray-600">{panel.title}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className={`text-xs font-mono font-medium ${panel.statusColor}`}>{panel.statusLabel}</span>
          <button
            onClick={onCopy}
            className="flex items-center gap-1.5 text-xs font-mono text-gray-600 hover:text-gray-300 transition-colors"
          >
            {copied
              ? <><Check className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400">Copied</span></>
              : <><Copy className="w-3.5 h-3.5" />Copy</>
            }
          </button>
        </div>
      </div>

      {/* Code */}
      <div className="overflow-auto flex-1">
        <pre className="text-sm font-mono p-6 min-h-full">
          {highlight(panel.code, panel.lang)}
        </pre>
      </div>
    </div>
  );
}

function FlowBar({ steps }: { steps: Example['steps'] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 justify-center mb-10">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center gap-1.5">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl glass-card border border-white/[0.06]">
            <span className={`text-[11px] font-bold font-mono ${step.statusColor}`}>{step.status}</span>
            <span className="text-xs text-gray-400">{step.label}</span>
          </div>
          {i < steps.length - 1 && (
            <ChevronRight className="w-3.5 h-3.5 text-gray-700 flex-shrink-0" />
          )}
        </div>
      ))}
    </div>
  );
}

const tabs: { id: Tab; label: string; tag: string }[] = [
  { id: 'guard', label: 'Oracle API', tag: 'POST /v1/oracle' },
  { id: 'decide', label: 'Evaluator API', tag: 'POST /v1/acp/evaluate' },
  { id: 'payment', label: 'Payment Flow', tag: 'x402 protocol' },
];

export default function CodeExamples() {
  const [activeTab, setActiveTab] = useState<Tab>('guard');
  const [copied, setCopied] = useState<number | null>(null);

  const handleCopy = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  const example = examples[activeTab];

  return (
    <section id="code-examples" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/[0.05] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── HEADER ── */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-label mb-5 justify-center"
          >
            <Code className="w-3.5 h-3.5" />
            API Reference
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.04] mb-5"
          >
            Integrate in minutes.
            <br />
            <span className="text-gradient-blue">Run forever.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 leading-relaxed"
          >
            Deterministic verdicts in structured JSON. Built for machines — every field is typed, every response is predictable.
          </motion.p>
        </div>

        {/* ── TABS ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-2 justify-center mb-10"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative group flex flex-col items-start px-5 py-3 rounded-xl border text-left transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600/20 border-blue-500/40 text-white'
                  : 'glass-card border-white/[0.06] text-gray-400 hover:text-white hover:border-white/10'
              }`}
            >
              <span className="text-sm font-semibold">{tab.label}</span>
              <span className={`text-[11px] font-mono mt-0.5 ${activeTab === tab.id ? 'text-blue-400' : 'text-gray-600 group-hover:text-gray-500'}`}>
                {tab.tag}
              </span>
              {activeTab === tab.id && (
                <motion.div layoutId="tab-indicator" className="absolute inset-0 rounded-xl ring-1 ring-blue-500/40 pointer-events-none" />
              )}
            </button>
          ))}
        </motion.div>

        {/* ── FLOW BAR ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`flow-${activeTab}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <FlowBar steps={example.steps} />
          </motion.div>
        </AnimatePresence>

        {/* ── CODE PANELS ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Description strip */}
            <div className="flex items-center gap-3 mb-5 px-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
              <p className="text-sm text-gray-400">{example.description}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ minHeight: 420 }}>
              {example.panels.map((panel, idx) => (
                <CodePanel
                  key={idx}
                  panel={panel}
                  onCopy={() => handleCopy(panel.code, idx)}
                  copied={copied === idx}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── ENDPOINT QUICK-REF ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-10 flex flex-wrap gap-2 justify-center"
        >
          {[
            { method: 'POST', path: '/v1/oracle', color: 'text-blue-400' },
            { method: 'GET',  path: '/v1/capabilities', color: 'text-emerald-400' },
            { method: 'GET',  path: '/v1/agents', color: 'text-emerald-400' },
          ].map((ep) => (
            <span key={ep.path} className="flex items-center gap-2 glass-card rounded-lg px-3 py-1.5 text-xs font-mono border border-white/[0.04]">
              <span className={ep.color}>{ep.method}</span>
              <span className="text-gray-500">{ep.path}</span>
            </span>
          ))}
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-12 flex flex-wrap gap-4 justify-center"
        >
          <Link to="/get-api-key" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-blue-glow active:scale-[0.98] text-sm">
            <Zap className="w-4 h-4" />
            Start Building
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/api" className="inline-flex items-center gap-2 px-6 py-3 glass-card hover:border-white/15 text-gray-300 hover:text-white font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] text-sm">
            Full API Reference
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
