import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Terminal, Copy, Check, Zap, ChevronRight, ArrowRight,
  CheckCircle, Clock, Shield, Key, Play, BookOpen,
  AlertCircle, RefreshCw, Hash, ArrowDown, Cpu,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { API_BASE_URL, SUPABASE_FUNCTIONS_URL } from '../lib/api';

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => { await navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1.5 text-xs font-mono text-gray-600 hover:text-gray-300 transition-colors px-2 py-1 rounded hover:bg-white/[0.05]"
    >
      {copied
        ? <><Check className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400">Copied</span></>
        : <><Copy className="w-3 h-3" />Copy</>}
    </button>
  );
}

// ─── Terminal code block ──────────────────────────────────────────────────────

type CodeLang = 'bash' | 'json' | 'js' | 'ts';

function CodeBlock({ code, lang = 'bash', filename, label, labelColor = 'text-gray-600' }: {
  code: string; lang?: CodeLang; filename?: string; label?: string; labelColor?: string;
}) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/[0.07] bg-[#07080e] my-4">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-[#0a0b12]">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ff5f57]/55" />
            <span className="w-2 h-2 rounded-full bg-[#febc2e]/55" />
            <span className="w-2 h-2 rounded-full bg-[#28c840]/55" />
          </div>
          {filename && <span className="text-[11px] font-mono text-gray-600">{filename}</span>}
          {label && <span className={`text-[10px] font-mono border border-white/[0.06] px-1.5 py-0.5 rounded ${labelColor}`}>{label}</span>}
        </div>
        <CopyBtn text={code} />
      </div>
      <div className="p-4 overflow-x-auto">
        <HighlightedCode code={code} lang={lang} />
      </div>
    </div>
  );
}

// ─── Syntax highlight ─────────────────────────────────────────────────────────

function HighlightedCode({ code, lang }: { code: string; lang: CodeLang }) {
  const lines = code.split('\n');
  return (
    <pre className="text-[13px] font-mono leading-[1.7]">
      {lines.map((line, i) => (
        <div key={i}>{renderLine(line, lang)}</div>
      ))}
    </pre>
  );
}

function renderLine(line: string, lang: CodeLang): React.ReactNode {
  if (lang === 'json') return renderJsonLine(line);
  if (lang === 'bash') return renderBashLine(line);
  if (lang === 'js' || lang === 'ts') return renderJsLine(line, lang);
  return <span className="text-gray-300">{line}</span>;
}

function renderJsonLine(line: string): React.ReactNode {
  if (line.trim().startsWith('//')) return <span className="text-gray-600 italic">{line}</span>;
  const kv = line.match(/^(\s*)("[\w_]+")(\s*:\s*)(.+?)(,?)$/);
  if (kv) {
    const [, indent, key, colon, val, comma] = kv;
    let ve: React.ReactNode;
    if (val.startsWith('"')) ve = <span className="text-emerald-300">{val}</span>;
    else if (/^[\d.]+$/.test(val)) ve = <span className="text-orange-300">{val}</span>;
    else if (val === 'true' || val === 'false' || val === 'null') ve = <span className="text-cyan-300">{val}</span>;
    else ve = <span className="text-gray-300">{val}</span>;
    return <>{indent}<span className="text-blue-200">{key}</span><span className="text-gray-600">{colon}</span>{ve}<span className="text-gray-600">{comma}</span></>;
  }
  return <span className="text-gray-500">{line}</span>;
}

function renderBashLine(line: string): React.ReactNode {
  if (line.trim().startsWith('#')) return <span className="text-gray-600 italic">{line}</span>;
  const parts: React.ReactNode[] = [];
  let rest = line;

  // curl keyword
  rest = rest.replace(/^(\s*)(curl)/, (_, sp, kw) => {
    parts.push(<span key="sp">{sp}</span>, <span key="kw" className="text-purple-400 font-semibold">{kw}</span>);
    return '';
  });
  if (parts.length) {
    // parse rest of curl line
    const tokens = rest.split(/(\s-[A-Za-z]+|\s--\w[\w-]*|"[^"]*"|'[^']*'|https?:\/\/\S+|\$\w+|\\$)/g);
    tokens.forEach((t, i) => {
      if (!t) return;
      if (/^\s-/.test(t) || /^\s--/.test(t)) parts.push(<span key={i} className="text-yellow-400">{t}</span>);
      else if (/^"/.test(t) || /^'/.test(t)) parts.push(<span key={i} className="text-emerald-300">{t}</span>);
      else if (/^https?:\/\//.test(t)) parts.push(<span key={i} className="text-blue-300">{t}</span>);
      else if (/^\$/.test(t)) parts.push(<span key={i} className="text-orange-300">{t}</span>);
      else if (t === '\\') parts.push(<span key={i} className="text-gray-700">{t}</span>);
      else parts.push(<span key={i} className="text-gray-300">{t}</span>);
    });
    return <>{parts}</>;
  }
  return <span className="text-gray-300">{line}</span>;
}

function renderJsLine(line: string, _lang: CodeLang): React.ReactNode {
  if (line.trim().startsWith('//')) return <span className="text-gray-600 italic">{line}</span>;
  const kws = ['const', 'let', 'async', 'await', 'function', 'return', 'if', 'throw', 'new', 'import', 'export', 'from', 'interface', 'type'];
  const kwRe = new RegExp(`\\b(${kws.join('|')})\\b`, 'g');
  const parts: React.ReactNode[] = [];
  let last = 0, m, i = 0;
  const combined = new RegExp(`${kwRe.source}|"[^"]*"|'[^']*'|\`[^\`]*\`|\\b(true|false|null|undefined)\\b|\\b\\d+(\\.\\d+)?\\b`, 'g');
  while ((m = combined.exec(line)) !== null) {
    if (m.index > last) parts.push(<span key={i++} className="text-gray-300">{line.slice(last, m.index)}</span>);
    const tok = m[0];
    if (kws.includes(tok)) parts.push(<span key={i++} className="text-purple-400">{tok}</span>);
    else if (/^["'`]/.test(tok)) parts.push(<span key={i++} className="text-emerald-300">{tok}</span>);
    else if (/^(true|false|null|undefined)$/.test(tok)) parts.push(<span key={i++} className="text-cyan-300">{tok}</span>);
    else if (/^\d/.test(tok)) parts.push(<span key={i++} className="text-orange-300">{tok}</span>);
    else parts.push(<span key={i++} className="text-gray-300">{tok}</span>);
    last = m.index + tok.length;
  }
  if (last < line.length) parts.push(<span key={i++} className="text-gray-300">{line.slice(last)}</span>);
  return parts.length ? <>{parts}</> : <span className="text-gray-300">{line}</span>;
}

// ─── Step component ───────────────────────────────────────────────────────────

function StepBadge({ n, done }: { n: number; done?: boolean }) {
  return (
    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 font-bold text-sm transition-all duration-300 ${
      done
        ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-400'
        : 'bg-blue-500/15 border-blue-500/40 text-blue-300'
    }`}>
      {done ? <CheckCircle className="w-4 h-4" /> : n}
    </div>
  );
}

interface StepProps {
  id: string;
  n: number;
  title: string;
  time: string;
  children: React.ReactNode;
  done?: boolean;
}

function Step({ id, n, title, time, children, done }: StepProps) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center gap-4 mb-6">
        <StepBadge n={n} done={done} />
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-gray-600 flex-shrink-0">
          <Clock className="w-3 h-3" />{time}
        </div>
      </div>
      <div className="pl-12">
        {children}
      </div>
    </section>
  );
}

// ─── Inline callout ───────────────────────────────────────────────────────────

function Callout({ icon: Icon, color, children }: { icon: React.ElementType; color: 'blue' | 'emerald' | 'yellow' | 'cyan'; children: React.ReactNode }) {
  const styles = {
    blue:    'border-blue-500/25 bg-blue-500/[0.05] text-blue-400',
    emerald: 'border-emerald-500/25 bg-emerald-500/[0.05] text-emerald-400',
    yellow:  'border-yellow-500/25 bg-yellow-500/[0.05] text-yellow-400',
    cyan:    'border-cyan-500/25 bg-cyan-500/[0.05] text-cyan-400',
  };
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border my-4 ${styles[color]}`}>
      <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
      <div className="text-sm leading-relaxed text-gray-300">{children}</div>
    </div>
  );
}

// ─── Agent flow diagram ───────────────────────────────────────────────────────

const FLOW_STEPS = [
  { icon: Cpu,        label: 'Agent',   desc: 'Autonomous agent ready to act',              color: 'blue' },
  { icon: Shield,     label: 'Verify',  desc: 'Call /functions/v1/guard — check conditions are safe', color: 'cyan' },
  { icon: Zap,        label: 'Pay',     desc: '$0.01 USDC on Base via x402 (or Bearer key)', color: 'yellow' },
  { icon: CheckCircle, label: 'Execute', desc: 'Proceed only if verdict is "proceed"',       color: 'emerald' },
] as const;

const FLOW_COLORS = {
  blue:    { ring: 'border-blue-500/40 bg-blue-500/[0.08]', text: 'text-blue-300', icon: 'text-blue-400', dot: 'bg-blue-500' },
  cyan:    { ring: 'border-cyan-500/40 bg-cyan-500/[0.08]', text: 'text-cyan-300', icon: 'text-cyan-400', dot: 'bg-cyan-500' },
  yellow:  { ring: 'border-yellow-500/40 bg-yellow-500/[0.08]', text: 'text-yellow-300', icon: 'text-yellow-400', dot: 'bg-yellow-400' },
  emerald: { ring: 'border-emerald-500/40 bg-emerald-500/[0.08]', text: 'text-emerald-300', icon: 'text-emerald-400', dot: 'bg-emerald-400' },
};

function AgentFlowDiagram() {
  return (
    <div className="my-6">
      {/* Desktop: horizontal */}
      <div className="hidden sm:flex items-start gap-0">
        {FLOW_STEPS.map((step, i) => {
          const c = FLOW_COLORS[step.color];
          const Icon = step.icon;
          return (
            <div key={step.label} className="flex items-start flex-1">
              <div className="flex-1 flex flex-col items-center text-center gap-3">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center ${c.ring}`}
                >
                  <Icon className={`w-7 h-7 ${c.icon}`} />
                </motion.div>
                <div>
                  <p className={`text-sm font-bold ${c.text}`}>{step.label}</p>
                  <p className="text-xs text-gray-600 mt-1 max-w-[120px] mx-auto leading-relaxed">{step.desc}</p>
                </div>
              </div>
              {i < FLOW_STEPS.length - 1 && (
                <div className="flex items-center pt-8 flex-shrink-0 px-1">
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: vertical */}
      <div className="flex sm:hidden flex-col gap-0">
        {FLOW_STEPS.map((step, i) => {
          const c = FLOW_COLORS[step.color];
          const Icon = step.icon;
          return (
            <div key={step.label} className="flex flex-col items-center">
              <div className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 ${c.ring}`}>
                <Icon className={`w-6 h-6 ${c.icon} flex-shrink-0`} />
                <div>
                  <p className={`text-sm font-bold ${c.text}`}>{step.label}</p>
                  <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
              {i < FLOW_STEPS.length - 1 && (
                <ArrowDown className="w-4 h-4 text-gray-700 my-1" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Sidebar nav ──────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'step-1', label: 'Test Connectivity',    time: '30s' },
  { id: 'step-2', label: 'Verify an Action',      time: '2m' },
  { id: 'step-3', label: 'x402 Payment Flow',    time: '1m' },
  { id: 'step-4', label: 'Agent Flow',            time: '1m' },
];

function SidebarNav({ active, done }: { active: string; done: Set<string> }) {
  return (
    <nav className="space-y-1">
      <p className="text-[10px] font-mono text-gray-700 uppercase tracking-widest px-3 mb-3">On this page</p>
      {NAV_ITEMS.map((item, i) => {
        const isDone = done.has(item.id);
        const isActive = active === item.id;
        return (
          <a key={item.id} href={`#${item.id}`}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group ${
              isActive
                ? 'bg-blue-500/[0.07] border border-blue-500/20 text-white'
                : isDone
                ? 'text-emerald-400/60 hover:text-emerald-400 hover:bg-emerald-500/[0.04]'
                : 'text-gray-600 hover:text-gray-300 hover:bg-white/[0.02]'
            }`}>
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
              isDone ? 'border-emerald-500/50 bg-emerald-500/15' : isActive ? 'border-blue-500/50 bg-blue-500/15' : 'border-white/[0.1]'
            }`}>
              {isDone
                ? <Check className="w-2.5 h-2.5 text-emerald-400" />
                : <span className={`text-[9px] font-bold ${isActive ? 'text-blue-300' : 'text-gray-700'}`}>{i + 1}</span>
              }
            </div>
            <span className="flex-1 font-medium">{item.label}</span>
            <span className="text-[10px] font-mono text-gray-700">{item.time}</span>
          </a>
        );
      })}
    </nav>
  );
}

// ─── Code data ────────────────────────────────────────────────────────────────

const S1_CURL = `curl ${API_BASE_URL}/health`;
const S1_RESPONSE = `{
  "ok":   true,
  "name": "Decision + Verification Agent"
}`;

const S2_CURL = `curl -X POST ${SUPABASE_FUNCTIONS_URL}/guard \\
  -H "Authorization: Bearer $VP_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "action":     "bridge",
    "chain":      "base",
    "amount_usd": 50000
  }'`;

const S2_RESPONSE = `{
  "verdict":    "proceed",
  "confidence": 0.95,
  "risk":       "low",
  "expires_in": 300,
  "decision": {
    "action": "execute_bridge",
    "reason": "All safety checks passed."
  },
  "evidence":      [...],
  "failure_modes": []
}`;

const S2_JS = `const response = await fetch("${SUPABASE_FUNCTIONS_URL}/guard", {
  method: "POST",
  headers: {
    "Authorization": \`Bearer \${process.env.VP_API_KEY}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    action:     "bridge",
    chain:      "base",
    amount_usd: 50000,
  }),
});

const { verdict, decision } = await response.json();

if (verdict !== "proceed") {
  // Block the action — do not execute
  throw new Error(decision.reason);
}

// Safe to proceed
console.log("Verified:", verdict, decision.reason);`;

const S3_CURL = `# Step 1: Send request without credentials
curl -X POST ${API_BASE_URL}/v1/acp/guard \\
  -H "Content-Type: application/json" \\
  -d '{"action":"bridge","chain":"base","amount_usd":50000}'`;

const S3_402 = `{
  "status":   "payment_required",
  "code":     402,
  "price":    "0.01",
  "currency": "USDC",
  "network":  "base",
  "pay_to":   "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  "note":     "Pay $0.01 USDC on Base and retry with x402 header"
}`;

const S3_RETRY = `# Step 2: Pay USDC on Base, then retry with x402 payment header
curl -X POST ${API_BASE_URL}/v1/acp/guard \\
  -H "Content-Type: application/json" \\
  -H "x402-Payment: <base64-signed-payment>" \\
  -d '{"action":"bridge","chain":"base","amount_usd":50000}'`;

const S3_JS = `async function guardWithX402(action) {
  const url  = "${API_BASE_URL}/v1/acp/guard";
  const body = JSON.stringify(action);

  // Attempt 1 — no credentials
  let res = await fetch(url, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  // Handle 402 Payment Required
  if (res.status === 402) {
    const challenge = await res.json();

    // Pay $0.01 USDC on Base via x402 SDK
    const payment = await payUSDC({
      to:     challenge.pay_to,
      amount: challenge.price,   // "0.01"
      chain:  "base",
    });

    // Retry with payment proof header
    res = await fetch(url, {
      method:  "POST",
      headers: {
        "Content-Type": "application/json",
        ...payment.headers,      // x402-Payment header
      },
      body,
    });
  }

  return res.json(); // verdict: "proceed" | "block"
}`;

const S4_JS = `import { guardWithX402 } from "./x402-guard";

async function agentAction() {

  // 1. VERIFY — check conditions before acting
  const result = await guardWithX402({
    action:     "bridge",
    chain:      "base",
    amount_usd: 50000,
  });

  // 2. GATE — never proceed if blocked
  if (result.verdict !== "proceed") {
    console.error("Action blocked:", result.decision.reason);
    return; // stop the agent
  }

  // 3. EXECUTE — safe to act
  await executeBridgeTransaction({
    chain:  "base",
    amount: 50000,
  });

  console.log("Executed. Confidence:", result.confidence);
}`;

// ─── Language tab component ───────────────────────────────────────────────────

type TabCode = { id: string; label: string; code: string; lang: CodeLang; filename: string };

function TabbedCode({ tabs }: { tabs: TabCode[] }) {
  const [active, setActive] = useState(tabs[0].id);
  const tab = tabs.find((t) => t.id === active) ?? tabs[0];
  return (
    <div className="rounded-xl overflow-hidden border border-white/[0.07] bg-[#07080e] my-4">
      <div className="flex items-center border-b border-white/[0.06] bg-[#0a0b12]">
        <div className="flex items-center gap-1.5 px-4 py-2.5 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#ff5f57]/55" />
          <span className="w-2 h-2 rounded-full bg-[#febc2e]/55" />
          <span className="w-2 h-2 rounded-full bg-[#28c840]/55" />
        </div>
        <div className="flex overflow-x-auto flex-1">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActive(t.id)}
              className={`flex-shrink-0 px-4 py-2.5 text-xs font-mono border-b-2 transition-all ${
                active === t.id ? 'text-white border-blue-500' : 'text-gray-600 border-transparent hover:text-gray-300'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="px-3 flex-shrink-0">
          <CopyBtn text={tab.code} />
        </div>
      </div>
      <div className="px-2 py-0.5 bg-[#08090f] border-b border-white/[0.03]">
        <span className="text-[10px] font-mono text-gray-700">{tab.filename}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
          <div className="p-4 overflow-x-auto">
            <HighlightedCode code={tab.code} lang={tab.lang} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function QuickstartPage() {
  const [activeSection, setActiveSection] = useState('step-1');
  const [done, setDone] = useState<Set<string>>(new Set());
  const contentRef = useRef<HTMLDivElement>(null);

  // Intersection observer to track active section
  useEffect(() => {
    const sections = document.querySelectorAll('section[id^="step-"]');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Mark sections as done when scrolled past
  useEffect(() => {
    const sections = document.querySelectorAll('section[id^="step-"]');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
            setDone((prev) => new Set([...prev, entry.target.id]));
          }
        }
      },
      { threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      <Navbar />

      {/* ── PAGE HERO ── */}
      <div className="relative border-b border-white/[0.06] pt-16">
        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-blue-600/[0.05] rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-xs font-mono text-gray-600 mb-6">
            <Link to="/docs" className="hover:text-gray-400 transition-colors">Docs</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-400">Quickstart</span>
          </motion.div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="section-label mb-3">
                <Terminal className="w-3.5 h-3.5" /> Quickstart
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
                className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.05] mb-3">
                Integrate in{' '}
                <span className="text-gradient-blue">5 minutes</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.13 }}
                className="text-gray-400 text-base leading-relaxed max-w-lg">
                Test the API, verify your first action, understand the x402 payment flow, and wire up the full agent pattern — all before your coffee is ready.
              </motion.p>
            </div>

            {/* Meta strip */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}
              className="flex flex-wrap sm:flex-col gap-2 sm:items-end flex-shrink-0">
              <div className="flex items-center gap-2 text-xs font-mono text-gray-600">
                <Clock className="w-3 h-3" />
                <span>~5 minutes</span>
              </div>
              {[
                { label: 'No SDK required',     c: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/[0.05]' },
                { label: 'curl + JS examples',  c: 'text-blue-400 border-blue-500/20 bg-blue-500/[0.05]' },
                { label: 'x402 explained',      c: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/[0.05]' },
              ].map((b) => (
                <span key={b.label} className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${b.c}`}>{b.label}</span>
              ))}
            </motion.div>
          </div>

          {/* Step overview */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
            className="mt-8 flex flex-wrap gap-2">
            {NAV_ITEMS.map((item, i) => (
              <a key={item.id} href={`#${item.id}`}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl glass-card hover:border-white/15 text-xs text-gray-500 hover:text-gray-200 transition-all">
                <span className="text-[10px] font-bold text-gray-700">{i + 1}</span>
                {item.label}
                <span className="text-[10px] font-mono text-gray-700">{item.time}</span>
              </a>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── LAYOUT ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-10">

          {/* ── SIDEBAR ── */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-8">
              <SidebarNav active={activeSection} done={done} />

              <div className="mt-6 border-t border-white/[0.05] pt-4 space-y-1.5">
                <p className="text-[10px] font-mono text-gray-700 uppercase tracking-widest mb-2">Continue</p>
                <Link to="/api-reference" className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-300 transition-colors py-1">
                  <BookOpen className="w-3 h-3" /> API Reference
                </Link>
                <Link to="/playground" className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-300 transition-colors py-1">
                  <Play className="w-3 h-3" /> API Playground
                </Link>
                <Link to="/get-api-key" className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-300 transition-colors py-1">
                  <Key className="w-3 h-3" /> Get API Key
                </Link>
              </div>
            </div>
          </aside>

          {/* ── CONTENT ── */}
          <div ref={contentRef} className="flex-1 min-w-0 space-y-16">

            {/* ───────────────── STEP 1: Test Connectivity ───────────────── */}
            <Step id="step-1" n={1} title="Test Connectivity" time="~30 seconds">
              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                Before writing any code, confirm the API is reachable. The <code className="text-blue-300 bg-blue-500/10 px-1.5 py-0.5 rounded text-xs font-mono">/health</code> endpoint is public — no authentication required.
              </p>

              <CodeBlock code={S1_CURL} lang="bash" filename="terminal" />

              <p className="text-gray-500 text-sm mb-2 font-mono">Expected response:</p>
              <CodeBlock code={S1_RESPONSE} lang="json" filename="response.json" label="200 OK" labelColor="text-emerald-400" />

              <Callout icon={CheckCircle} color="emerald">
                <strong className="text-white">You're connected.</strong> The API is live and responding. Move on to verifying your first action.
              </Callout>
            </Step>

            <div className="w-full h-px bg-white/[0.05]" />

            {/* ───────────────── STEP 2: Verify an Action ───────────────── */}
            <Step id="step-2" n={2} title="Verify an Action" time="~2 minutes">
              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                The Guard endpoint runs real-time safety checks before your agent executes an on-chain action. It returns a deterministic <span className="text-white font-semibold">verdict</span> — <code className="text-emerald-300 font-mono text-xs bg-emerald-500/10 px-1.5 py-0.5 rounded">proceed</code>, <code className="text-red-300 font-mono text-xs bg-red-500/10 px-1.5 py-0.5 rounded">block</code>, or <code className="text-yellow-300 font-mono text-xs bg-yellow-500/10 px-1.5 py-0.5 rounded">warn</code>.
              </p>

              <Callout icon={Key} color="blue">
                <strong className="text-white">API key required.</strong> Replace <code className="font-mono text-sm text-blue-300">$VP_API_KEY</code> with your key.{' '}
                <Link to="/get-api-key" className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors">
                  Get a free key →
                </Link>
              </Callout>

              <TabbedCode tabs={[
                { id: 'curl', label: 'curl', code: S2_CURL, lang: 'bash', filename: 'terminal.sh' },
                { id: 'js',   label: 'JavaScript', code: S2_JS, lang: 'js', filename: 'guard.js' },
              ]} />

              <p className="text-gray-500 text-sm mb-2 font-mono mt-4">Response when action is safe:</p>
              <CodeBlock code={S2_RESPONSE} lang="json" filename="response.json" label="200 proceed" labelColor="text-emerald-400" />

              {/* Verdict field explanation */}
              <div className="rounded-xl border border-white/[0.07] overflow-hidden mt-4">
                <div className="px-4 py-2.5 border-b border-white/[0.05] bg-white/[0.01]">
                  <span className="text-[11px] font-mono text-gray-600 uppercase tracking-widest">Response fields</span>
                </div>
                <div className="divide-y divide-white/[0.04] bg-[#07080e]">
                  {[
                    { field: 'verdict',    type: 'string',  vals: '"proceed" | "block" | "warn"',  desc: 'The safety verdict. Gate your agent on this field.' },
                    { field: 'confidence', type: 'number',  vals: '0.0 – 1.0',                    desc: 'Model confidence in the verdict.' },
                    { field: 'risk',       type: 'string',  vals: '"low" | "medium" | "high"',     desc: 'Overall risk level of the action.' },
                    { field: 'expires_in', type: 'number',  vals: 'seconds',                       desc: 'How long the verdict is valid. Re-check after this window.' },
                    { field: 'decision',   type: 'object',  vals: '{ action, reason }',            desc: 'Machine-readable decision with human-readable reason.' },
                  ].map((row) => (
                    <div key={row.field} className="flex flex-wrap items-start gap-3 px-4 py-3">
                      <span className="text-xs font-mono text-blue-300 w-24 flex-shrink-0">{row.field}</span>
                      <span className="text-[10px] font-mono text-gray-700 w-20 flex-shrink-0">{row.type}</span>
                      <span className="text-[10px] font-mono text-gray-600 w-36 flex-shrink-0">{row.vals}</span>
                      <span className="text-xs text-gray-500 flex-1">{row.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Callout icon={Shield} color="blue">
                <strong className="text-white">Pattern:</strong> call Guard before every on-chain action. If <code className="font-mono text-sm text-white">verdict !== "proceed"</code>, halt the agent and surface the reason. Never skip the gate.
              </Callout>
            </Step>

            <div className="w-full h-px bg-white/[0.05]" />

            {/* ───────────────── STEP 3: x402 Payment Flow ───────────────── */}
            <Step id="step-3" n={3} title="x402 Payment Flow" time="~1 minute">
              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                ACP endpoints support <span className="text-white font-semibold">x402 machine payments</span> — your agent pays <span className="text-cyan-300 font-semibold">$0.01 USDC on Base</span> and receives the verdict. No API key needed. Designed for fully autonomous agents.
              </p>

              {/* x402 flow steps */}
              <div className="space-y-3 my-6">
                {[
                  {
                    n: '1', color: 'blue',
                    label: 'Send request without credentials',
                    desc: 'Call the endpoint normally. No auth header required.',
                    code: S3_CURL, lang: 'bash' as CodeLang, file: 'step-1.sh',
                  },
                  {
                    n: '2', color: 'yellow',
                    label: 'Receive HTTP 402 — payment challenge',
                    desc: 'Server returns payment details: amount, currency, and destination.',
                    code: S3_402, lang: 'json' as CodeLang, file: 'response-402.json',
                  },
                  {
                    n: '3', color: 'cyan',
                    label: 'Pay $0.01 USDC on Base',
                    desc: 'Sign and broadcast a USDC transfer to the specified address.',
                    code: S3_JS, lang: 'js' as CodeLang, file: 'x402-guard.js',
                  },
                  {
                    n: '4', color: 'emerald',
                    label: 'Retry with payment proof',
                    desc: 'Attach the x402-Payment header and resend. Receive the verdict.',
                    code: S3_RETRY, lang: 'bash' as CodeLang, file: 'step-4.sh',
                  },
                ].map((s) => {
                  const colors: Record<string, string> = {
                    blue:    'border-blue-500/30 bg-blue-500/[0.04] text-blue-300',
                    yellow:  'border-yellow-500/30 bg-yellow-500/[0.04] text-yellow-300',
                    cyan:    'border-cyan-500/30 bg-cyan-500/[0.04] text-cyan-300',
                    emerald: 'border-emerald-500/30 bg-emerald-500/[0.04] text-emerald-300',
                  };
                  return (
                    <div key={s.n} className={`rounded-xl border overflow-hidden ${colors[s.color].split(' ')[0]}`}>
                      <div className={`flex items-center gap-3 px-4 py-3 border-b border-white/[0.04] ${colors[s.color].split(' ')[1]}`}>
                        <span className={`w-6 h-6 rounded-full border border-current flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${colors[s.color].split(' ')[2]}`}>
                          {s.n}
                        </span>
                        <div className="flex-1">
                          <p className={`text-sm font-semibold ${colors[s.color].split(' ')[2]}`}>{s.label}</p>
                          <p className="text-xs text-gray-600 mt-0.5">{s.desc}</p>
                        </div>
                      </div>
                      <div className="bg-[#07080e] p-4 overflow-x-auto">
                        <HighlightedCode code={s.code} lang={s.lang} />
                        <div className="flex justify-end mt-2">
                          <CopyBtn text={s.code} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Callout icon={Zap} color="cyan">
                <strong className="text-white">Tip:</strong> Use the <Link to="/get-api-key" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-2">free API key</Link> to skip x402 entirely during development. Switch to x402 when deploying a fully autonomous agent.
              </Callout>

              {/* Status code table */}
              <div className="rounded-xl border border-white/[0.07] overflow-hidden mt-4">
                <div className="px-4 py-2.5 border-b border-white/[0.05] bg-white/[0.01]">
                  <span className="text-[11px] font-mono text-gray-600 uppercase tracking-widest">x402 status codes</span>
                </div>
                <div className="divide-y divide-white/[0.04] bg-[#07080e]">
                  {[
                    { code: '200', label: 'OK',                 cls: 'text-emerald-400', desc: 'Payment verified. Verdict in response body.' },
                    { code: '402', label: 'Payment Required',   cls: 'text-yellow-300', desc: 'x402 challenge. Pay and retry with proof header.' },
                    { code: '401', label: 'Unauthorized',       cls: 'text-red-400',    desc: 'Invalid Bearer token. Check your API key.' },
                    { code: '400', label: 'Bad Request',        cls: 'text-orange-400', desc: 'Missing or invalid request body fields.' },
                  ].map((r) => (
                    <div key={r.code} className="flex items-center gap-4 px-4 py-3">
                      <span className={`text-[11px] font-bold font-mono w-10 flex-shrink-0 ${r.cls}`}>{r.code}</span>
                      <span className="text-xs font-mono text-gray-400 w-36 flex-shrink-0">{r.label}</span>
                      <span className="text-xs text-gray-600">{r.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Step>

            <div className="w-full h-px bg-white/[0.05]" />

            {/* ───────────────── STEP 4: Agent Flow ───────────────── */}
            <Step id="step-4" n={4} title="Agent Flow" time="~1 minute">
              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                The complete pattern for a safe autonomous agent. Every action is gated behind a verification call. Agents that skip the gate are vulnerable to bridge exploits, stablecoin depegs, and rug pulls.
              </p>

              <AgentFlowDiagram />

              <CodeBlock code={S4_JS} lang="js" filename="agent.js" />

              <Callout icon={AlertCircle} color="yellow">
                <strong className="text-white">Never bypass the gate.</strong> Even if confidence is 0.99, always check <code className="font-mono text-sm">verdict === "proceed"</code> before executing. The verdict <code className="font-mono text-sm">expires_in</code> seconds — re-verify if the agent stalls.
              </Callout>

              {/* Quick-ref */}
              <div className="rounded-xl border border-white/[0.07] overflow-hidden mt-4">
                <div className="px-4 py-2.5 border-b border-white/[0.05] bg-white/[0.01]">
                  <span className="text-[11px] font-mono text-gray-600 uppercase tracking-widest">Endpoint quick-reference</span>
                </div>
                <div className="divide-y divide-white/[0.04] bg-[#07080e]">
                  {[
                    { method: 'GET',  path: '/health',           auth: 'None',         desc: 'Liveness check',              cost: 'Free' },
                    { method: 'POST', path: '/functions/v1/guard',  auth: 'Bearer',       desc: 'Private guard — up to 10 checks', cost: '$0.01' },
                    { method: 'POST', path: '/v1/acp/guard',         auth: 'Bearer/x402',  desc: 'ACP guard — 3 checks, keyless', cost: '$0.01' },
                    { method: 'POST', path: '/v1/acp/decide',        auth: 'Bearer/x402',  desc: 'Policy-driven decision',       cost: '$0.01' },
                  ].map((r) => (
                    <div key={r.path} className="flex flex-wrap items-center gap-3 px-4 py-3">
                      <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded border flex-shrink-0 ${
                        r.method === 'GET' ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/25' : 'text-blue-300 bg-blue-500/10 border-blue-500/25'
                      }`}>{r.method}</span>
                      <code className="text-xs font-mono text-gray-300 flex-shrink-0">{r.path}</code>
                      <span className="text-[10px] font-mono text-gray-700 flex-shrink-0">{r.auth}</span>
                      <span className="text-xs text-gray-600 flex-1">{r.desc}</span>
                      <span className={`text-[10px] font-mono flex-shrink-0 ${r.cost === 'Free' ? 'text-emerald-400' : 'text-blue-400'}`}>{r.cost}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Step>

            <div className="w-full h-px bg-white/[0.05]" />

            {/* ───────────────── NEXT STEPS ───────────────── */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="pb-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-white">You're ready to ship.</h2>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed mb-8 pl-12">
                You've tested connectivity, made your first verified request, understood x402, and wired up the agent pattern. Here's what to do next.
              </p>

              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  {
                    icon: BookOpen,
                    title: 'Full API Reference',
                    desc: 'All 7 endpoints with every parameter, multi-language examples, and response schemas.',
                    link: '/api-reference',
                    label: 'Browse endpoints',
                    color: 'blue',
                  },
                  {
                    icon: Play,
                    title: 'API Playground',
                    desc: 'Fire real requests directly from your browser. Inspect responses, headers, and latency.',
                    link: '/playground',
                    label: 'Open playground',
                    color: 'cyan',
                  },
                  {
                    icon: Key,
                    title: 'Get an API Key',
                    desc: 'Free tier: 100 requests/month. No wallet needed. Skip x402 entirely during development.',
                    link: '/get-api-key',
                    label: 'Get free key',
                    color: 'emerald',
                  },
                ].map((card) => {
                  const Icon = card.icon;
                  const clr: Record<string, string> = {
                    blue:    'border-blue-500/25 bg-blue-500/[0.05] hover:border-blue-500/40 text-blue-300 text-blue-400',
                    cyan:    'border-cyan-500/25 bg-cyan-500/[0.05] hover:border-cyan-500/40 text-cyan-300 text-cyan-400',
                    emerald: 'border-emerald-500/25 bg-emerald-500/[0.05] hover:border-emerald-500/40 text-emerald-300 text-emerald-400',
                  };
                  const [borderBase, bgBase, borderHover, titleClr, iconClr] = clr[card.color].split(' ');
                  return (
                    <Link key={card.title} to={card.link}
                      className={`group flex flex-col gap-4 p-5 rounded-2xl border transition-all duration-200 ${borderBase} ${bgBase} ${borderHover}`}>
                      <Icon className={`w-6 h-6 ${iconClr}`} />
                      <div className="flex-1">
                        <p className={`font-bold text-sm mb-1 ${titleClr}`}>{card.title}</p>
                        <p className="text-xs text-gray-500 leading-relaxed">{card.desc}</p>
                      </div>
                      <div className={`flex items-center gap-1.5 text-xs font-medium ${titleClr} group-hover:gap-2.5 transition-all`}>
                        {card.label} <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.section>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
