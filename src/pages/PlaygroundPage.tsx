import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SpecButtons } from '../components/SpecButtons';
import {
  Terminal, Play, Copy, Check, Zap, ChevronRight,
  AlertCircle, Clock, Hash, RefreshCw, Send,
  Lock, Unlock, CheckCircle, XCircle, Loader,
  Key, BookOpen, ExternalLink, ChevronDown,
  Wifi, WifiOff, Trash2, History, Info, Shield,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { API_BASE_URL, ENDPOINTS as API_ENDPOINTS } from '../lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

type EndpointId = 'health' | 'capabilities' | 'agents' | 'signup' | 'guard-acp' | 'decide-acp' | 'guard-private';

interface EndpointDef {
  id: EndpointId;
  method: 'GET' | 'POST';
  path: string;
  label: string;
  group: string;
  auth: 'none' | 'bearer' | 'bearer_or_x402';
  defaultBody: string;
  cost: string;
  description: string;
}

interface HistoryEntry {
  id: number;
  ts: Date;
  endpointId: EndpointId;
  method: string;
  path: string;
  statusCode: number | null;
  latencyMs: number | null;
  error: string | null;
  responseBody: string;
  requestBody: string;
}

// ─── Endpoint definitions ─────────────────────────────────────────────────────

const ENDPOINTS: EndpointDef[] = [
  {
    id: 'health',
    method: 'GET',
    path: '/health',
    label: 'Health',
    group: 'System',
    auth: 'none',
    defaultBody: '',
    cost: 'Free',
    description: 'Liveness check. Returns ok when API is operational.',
  },
  {
    id: 'capabilities',
    method: 'GET',
    path: API_ENDPOINTS.CAPABILITIES,
    label: 'Capabilities',
    group: 'System',
    auth: 'none',
    defaultBody: '',
    cost: 'Free',
    description: 'Returns all supported checks, actions and endpoint URLs.',
  },
  {
    id: 'agents',
    method: 'GET',
    path: API_ENDPOINTS.AGENTS,
    label: 'Agents',
    group: 'System',
    auth: 'none',
    defaultBody: '',
    cost: 'Free',
    description: 'Lists all agents in the ecosystem with their status and endpoints.',
  },
  {
    id: 'signup',
    method: 'POST',
    path: API_ENDPOINTS.API_KEY_SIGNUP,
    label: 'Issue API Key',
    group: 'Auth',
    auth: 'none',
    defaultBody: `{\n  "email": "agent@example.com",\n  "full_name": "Trading Bot v2",\n  "use_case": "defi-agent",\n  "description": "Autonomous DeFi trading agent on Base"\n}`,
    cost: 'Free',
    description: 'Self-provision an API key for private endpoints.',
  },
  {
    id: 'guard-acp',
    method: 'POST',
    path: API_ENDPOINTS.ACP_GUARD,
    label: 'ACP Guard',
    group: 'ACP',
    auth: 'bearer_or_x402',
    defaultBody: `{\n  "action": "bridge",\n  "chain": "base",\n  "amount_usd": 50000,\n  "strict_mode": false\n}`,
    cost: '$0.01',
    description: 'Pre-execution safety check. Returns verdict: proceed | block | warn.',
  },
  {
    id: 'decide-acp',
    method: 'POST',
    path: API_ENDPOINTS.ACP_DECIDE,
    label: 'ACP Decide',
    group: 'ACP',
    auth: 'bearer_or_x402',
    defaultBody: `{\n  "action": "swap",\n  "goal": "maximize yield on idle USDC",\n  "asset": "USDC",\n  "chain": "ethereum",\n  "amount": 100000000,\n  "policy": "conservative"\n}`,
    cost: '$0.01',
    description: 'Policy-driven decision with full reasoning chain.',
  },
  {
    id: 'guard-private',
    method: 'POST',
    path: API_ENDPOINTS.GUARD,
    label: 'Guard',
    group: 'Private',
    auth: 'bearer',
    defaultBody: `{\n  "action": "bridge",\n  "chain": "base",\n  "amount_usd": 50000\n}`,
    cost: '$0.01',
    description: 'Private guard endpoint — requires API key. Up to 10 checks.',
  },
];

const GROUPS = ['System', 'Auth', 'ACP', 'Private'];

// ─── Presets per endpoint ─────────────────────────────────────────────────────

const PRESETS: Partial<Record<EndpointId, { label: string; body: string }[]>> = {
  'guard-acp': [
    { label: 'Bridge · base',     body: `{\n  "action": "bridge",\n  "chain": "base",\n  "amount_usd": 50000\n}` },
    { label: 'Swap · strict',     body: `{\n  "action": "swap",\n  "chain": "ethereum",\n  "amount_usd": 250000,\n  "asset": "WBTC",\n  "strict_mode": true\n}` },
    { label: 'Transfer · USDC',   body: `{\n  "action": "transfer",\n  "chain": "arbitrum",\n  "amount_usd": 12500,\n  "asset": "USDC"\n}` },
  ],
  'decide-acp': [
    { label: 'Yield · conservative', body: `{\n  "action": "swap",\n  "goal": "maximize yield on idle USDC",\n  "asset": "USDC",\n  "chain": "ethereum",\n  "policy": "conservative"\n}` },
    { label: 'Lend · balanced',      body: `{\n  "action": "lend",\n  "goal": "earn yield on ETH",\n  "asset": "ETH",\n  "chain": "base",\n  "policy": "balanced"\n}` },
    { label: 'Stake · aggressive',   body: `{\n  "action": "stake",\n  "goal": "secure validator rewards",\n  "asset": "ETH",\n  "chain": "ethereum",\n  "policy": "aggressive"\n}` },
  ],
  'guard-private': [
    { label: 'Bridge · base',   body: `{\n  "action": "bridge",\n  "chain": "base",\n  "amount_usd": 50000\n}` },
    { label: 'Yield deposit',   body: `{\n  "action": "yield_deposit",\n  "chain": "base",\n  "amount_usd": 10000,\n  "asset": "USDC"\n}` },
  ],
};

// ─── JSON Highlighter ─────────────────────────────────────────────────────────

function JsonHighlight({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <code className="text-xs font-mono leading-[1.65] block">
      {lines.map((line, li) => {
        const parts: React.ReactNode[] = [];
        const regex = /"([^"]*)"(\s*:)?|(-?\d+\.?\d*)|(\btrue\b|\bfalse\b|\bnull\b)/g;
        let last = 0, m, ki = 0;
        while ((m = regex.exec(line)) !== null) {
          if (m.index > last) parts.push(<span key={`p${li}-${ki++}`} className="text-gray-500">{line.slice(last, m.index)}</span>);
          if (m[0].endsWith(':') && m[1] !== undefined) {
            parts.push(<span key={`k${li}-${ki++}`} className="text-blue-300">"{m[1]}"</span>);
            parts.push(<span key={`c${li}-${ki++}`} className="text-gray-600">:</span>);
          } else if (m[1] !== undefined) {
            parts.push(<span key={`s${li}-${ki++}`} className="text-emerald-300">"{m[1]}"</span>);
          } else if (m[3] !== undefined) {
            parts.push(<span key={`n${li}-${ki++}`} className="text-orange-300">{m[3]}</span>);
          } else if (m[4] !== undefined) {
            parts.push(<span key={`b${li}-${ki++}`} className="text-cyan-300">{m[4]}</span>);
          }
          last = m.index + m[0].length;
        }
        if (last < line.length) parts.push(<span key={`e${li}-${ki++}`} className="text-gray-500">{line.slice(last)}</span>);
        return <div key={li}>{parts.length ? parts : <span className="text-gray-500">{line}</span>}</div>;
      })}
    </code>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function CopyBtn({ text, size = 'sm' }: { text: string; size?: 'xs' | 'sm' }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const cls = size === 'xs'
    ? 'text-[10px] px-1.5 py-0.5'
    : 'text-xs px-2 py-1';
  return (
    <button onClick={handle} className={`flex items-center gap-1 font-mono text-gray-600 hover:text-gray-300 transition-colors rounded hover:bg-white/[0.05] ${cls}`}>
      {copied
        ? <><Check className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400">Copied</span></>
        : <><Copy className="w-3 h-3" />Copy</>}
    </button>
  );
}

function MethodBadge({ method }: { method: 'GET' | 'POST' }) {
  return (
    <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded border flex-shrink-0 ${
      method === 'GET'
        ? 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30'
        : 'text-blue-300 bg-blue-500/15 border-blue-500/30'
    }`}>{method}</span>
  );
}

function StatusBadge({ status }: { status: number | null }) {
  if (status === null) return null;
  const cls = status < 300 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25'
    : status === 402 ? 'text-yellow-300 bg-yellow-500/10 border-yellow-500/25'
    : status < 500 ? 'text-orange-400 bg-orange-500/10 border-orange-500/25'
    : 'text-red-400 bg-red-500/10 border-red-500/25';
  const label = status === 200 ? '200 OK' : status === 402 ? '402 Payment Required'
    : status === 401 ? '401 Unauthorized' : status === 400 ? '400 Bad Request'
    : status === 429 ? '429 Too Many Requests' : status === 500 ? '500 Server Error' : String(status);
  return <span className={`text-[11px] font-bold font-mono px-2.5 py-1 rounded border ${cls}`}>{label}</span>;
}

function VerdictBadge({ verdict }: { verdict: string }) {
  const map: Record<string, string> = {
    proceed: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
    block:   'text-red-400 bg-red-500/10 border-red-500/25',
    halt:    'text-red-400 bg-red-500/10 border-red-500/25',
    warn:    'text-yellow-300 bg-yellow-500/10 border-yellow-500/25',
    wait:    'text-blue-300 bg-blue-500/10 border-blue-500/25',
  };
  const icons: Record<string, React.ElementType> = { proceed: CheckCircle, block: XCircle, halt: XCircle, warn: AlertCircle, wait: Clock };
  const Icon = icons[verdict] ?? Shield;
  return (
    <motion.span initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      className={`flex items-center gap-1 text-[11px] font-bold font-mono px-2.5 py-1 rounded border ${map[verdict] ?? 'text-gray-400 border-gray-700'}`}>
      <Icon className="w-3 h-3" />{verdict}
    </motion.span>
  );
}

// ─── Actual API call ──────────────────────────────────────────────────────────

async function callApi(ep: EndpointDef, body: string, apiKey: string): Promise<{ status: number; body: string; latencyMs: number; error: null }> {
  // ENDPOINTS.API_KEY_SIGNUP and ENDPOINTS.GUARD are full Supabase URLs.
  // All other paths are relative to API_BASE_URL (Render public endpoints).
  const url = ep.path.startsWith("http") ? ep.path : `${API_BASE_URL}${ep.path}`;
  const headers: Record<string, string> = { 'Accept': 'application/json' };
  if (apiKey.trim()) headers['Authorization'] = `Bearer ${apiKey.trim()}`;
  if (ep.method === 'POST') headers['Content-Type'] = 'application/json';

  const start = Date.now();
  const response = await fetch(url, {
    method: ep.method,
    headers,
    body: ep.method === 'POST' && body.trim() ? body : undefined,
  });
  const latencyMs = Date.now() - start;

  const text = await response.text();
  let pretty = text;
  try { pretty = JSON.stringify(JSON.parse(text), null, 2); } catch {}

  return { status: response.status, body: pretty, latencyMs, error: null };
}

// ─── Line numbers ─────────────────────────────────────────────────────────────

function LineNumbers({ count }: { count: number }) {
  return (
    <div className="select-none text-right pr-3 border-r border-white/[0.04] flex-shrink-0" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="text-[11px] leading-[1.65] text-gray-700">{i + 1}</div>
      ))}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PlaygroundPage() {
  const [activeId, setActiveId] = useState<EndpointId>('health');
  const [apiKey, setApiKey] = useState('');
  const [body, setBody] = useState('');
  const [requestTab, setRequestTab] = useState<'body' | 'auth' | 'headers'>('body');
  const [responseTab, setResponseTab] = useState<'body' | 'info'>('body');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<number | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [responseBody, setResponseBody] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyCounter, setHistoryCounter] = useState(0);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const ep = ENDPOINTS.find((e) => e.id === activeId)!;
  const presets = PRESETS[activeId] ?? [];

  // Switch endpoint → reset request/response state, load default body
  const switchEndpoint = useCallback((id: EndpointId) => {
    setActiveId(id);
    const def = ENDPOINTS.find((e) => e.id === id)!;
    setBody(def.defaultBody);
    setStatus(null);
    setLatency(null);
    setResponseBody(null);
    setSendError(null);
    setJsonError(null);
    setRequestTab(def.method === 'POST' ? 'body' : 'auth');
  }, []);

  // Init body on mount
  useEffect(() => { setBody(ep.defaultBody); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Validate JSON body
  const validateBody = (text: string) => {
    if (!text.trim()) { setJsonError(null); return; }
    try { JSON.parse(text); setJsonError(null); }
    catch (e) { setJsonError((e as Error).message); }
  };

  const handleBodyChange = (val: string) => {
    setBody(val);
    validateBody(val);
  };

  const handleSend = async () => {
    if (sending) return;
    if (ep.method === 'POST' && body.trim()) {
      try { JSON.parse(body); }
      catch (e) { setJsonError((e as Error).message); return; }
    }

    setSending(true);
    setStatus(null);
    setLatency(null);
    setResponseBody(null);
    setSendError(null);

    const requestSnapshot = body;

    try {
      const result = await callApi(ep, body, apiKey);
      setStatus(result.status);
      setLatency(result.latencyMs);
      setResponseBody(result.body);
      setResponseTab('body');

      setHistoryCounter((c) => {
        const id = c + 1;
        setHistory((prev) => [{
          id,
          ts: new Date(),
          endpointId: activeId,
          method: ep.method,
          path: ep.path,
          statusCode: result.status,
          latencyMs: result.latencyMs,
          error: null,
          responseBody: result.body,
          requestBody: requestSnapshot,
        }, ...prev].slice(0, 20));
        return id;
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Network error';
      setSendError(msg);
      setHistoryCounter((c) => {
        const id = c + 1;
        setHistory((prev) => [{
          id,
          ts: new Date(),
          endpointId: activeId,
          method: ep.method,
          path: ep.path,
          statusCode: null,
          latencyMs: null,
          error: msg,
          responseBody: '',
          requestBody: requestSnapshot,
        }, ...prev].slice(0, 20));
        return id;
      });
    } finally {
      setSending(false);
    }
  };

  // Load a history entry back into the editor
  const loadHistory = (entry: HistoryEntry) => {
    const def = ENDPOINTS.find((e) => e.id === entry.endpointId);
    if (!def) return;
    setActiveId(entry.endpointId);
    setBody(entry.requestBody);
    setStatus(entry.statusCode);
    setLatency(entry.latencyMs);
    setResponseBody(entry.responseBody);
    setSendError(entry.error);
    setHistoryOpen(false);
    setRequestTab(def.method === 'POST' ? 'body' : 'auth');
  };

  const verdict = (() => {
    if (!responseBody) return null;
    try { const p = JSON.parse(responseBody); return typeof p.verdict === 'string' ? p.verdict : null; }
    catch { return null; }
  })();

  const responseLineCount = (responseBody ?? '').split('\n').length;
  const bodyLineCount = (body ?? '').split('\n').length;
  const fullUrl = ep.path.startsWith("http") ? ep.path : `${API_BASE_URL}${ep.path}`;

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col overflow-x-hidden">
      <Navbar />

      {/* ── PAGE HEADER ── */}
      <div className="relative border-b border-white/[0.06] pt-16 flex-shrink-0">
        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[200px] bg-blue-600/[0.05] rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-7">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="section-label">
                <Terminal className="w-3.5 h-3.5" /> Playground
              </div>
              <div className="h-4 w-px bg-white/[0.08]" />
              <h1 className="text-xl font-bold text-white tracking-tight">API Playground</h1>
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-[11px] font-mono text-emerald-400">Live</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setHistoryOpen(!historyOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                  historyOpen ? 'bg-white/[0.07] border-white/[0.12] text-white' : 'glass-card text-gray-500 hover:text-gray-300'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                History
                {history.length > 0 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/25">{history.length}</span>
                )}
              </button>
              <Link to="/api-reference" className="flex items-center gap-1.5 px-3 py-2 rounded-lg glass-card hover:border-white/15 text-gray-500 hover:text-gray-300 text-xs font-medium transition-all">
                <BookOpen className="w-3.5 h-3.5" /> API Docs
              </Link>
              <Link to="/get-api-key" className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all">
                <Key className="w-3.5 h-3.5" /> Get API Key
              </Link>
              <SpecButtons size="xs" layout="row" />
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="flex-1 flex max-w-[1400px] mx-auto w-full">

        {/* ── LEFT SIDEBAR: endpoint list ── */}
        <aside className="hidden md:flex flex-col w-56 border-r border-white/[0.06] flex-shrink-0 py-4">
          <p className="text-[10px] font-mono text-gray-700 uppercase tracking-widest px-4 mb-2">Endpoints</p>
          <div className="flex-1 overflow-y-auto">
            {GROUPS.map((group) => {
              const eps = ENDPOINTS.filter((e) => e.group === group);
              if (!eps.length) return null;
              return (
                <div key={group} className="mb-3">
                  <p className="text-[9px] font-mono text-gray-700 uppercase tracking-widest px-4 py-1.5">{group}</p>
                  {eps.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => switchEndpoint(e.id)}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-left transition-all duration-100 group ${
                        activeId === e.id
                          ? 'bg-blue-500/[0.08] border-r-2 border-blue-500'
                          : 'hover:bg-white/[0.02] border-r-2 border-transparent'
                      }`}
                    >
                      <MethodBadge method={e.method} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium truncate transition-colors ${activeId === e.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
                          {e.label}
                        </p>
                        <p className="text-[10px] font-mono text-gray-700 truncate">{e.path}</p>
                      </div>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Sidebar footer */}
          <div className="border-t border-white/[0.05] px-4 pt-3 space-y-1.5">
            <Link to="/api-reference" className="flex items-center gap-2 text-[11px] text-gray-600 hover:text-gray-400 transition-colors">
              <BookOpen className="w-3 h-3" /> Full API Reference
            </Link>
            <a href="https://github.com/verifyproceed" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-[11px] text-gray-600 hover:text-gray-400 transition-colors">
              <ExternalLink className="w-3 h-3" /> GitHub
            </a>
          </div>
        </aside>

        {/* ── CENTER: request builder ── */}
        <div className="flex-1 min-w-0 border-r border-white/[0.06] flex flex-col">

          {/* URL bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-[#06070c]">
            <MethodBadge method={ep.method} />
            <div className="flex-1 flex items-center gap-2 bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 min-w-0">
              <span className="text-xs font-mono text-gray-300 truncate flex-1">{fullUrl}</span>
              <CopyBtn text={fullUrl} size="xs" />
            </div>
            <button
              onClick={handleSend}
              disabled={sending}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-sm transition-all flex-shrink-0 active:scale-[0.97] ${
                sending
                  ? 'bg-blue-600/50 text-white/60 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-blue-glow'
              }`}
            >
              {sending
                ? <><Loader className="w-3.5 h-3.5 animate-spin" /> Sending</>
                : <><Send className="w-3.5 h-3.5" /> Send</>}
            </button>
          </div>

          {/* Endpoint description */}
          <div className="px-4 py-2.5 border-b border-white/[0.05] bg-white/[0.01] flex items-center gap-3">
            <span className="text-[11px] text-gray-600 leading-relaxed flex-1">{ep.description}</span>
            <span className={`text-[10px] font-mono flex-shrink-0 ${ep.cost === 'Free' ? 'text-emerald-400' : 'text-blue-400'}`}>
              {ep.cost}
            </span>
            {ep.auth === 'none' && <span className="text-[10px] font-mono text-emerald-500/70 flex-shrink-0">public</span>}
            {ep.auth === 'bearer' && <span className="text-[10px] font-mono text-yellow-400/70 flex-shrink-0">requires key</span>}
            {ep.auth === 'bearer_or_x402' && <span className="text-[10px] font-mono text-cyan-400/70 flex-shrink-0">key or x402</span>}
          </div>

          {/* Request tabs */}
          <div className="flex border-b border-white/[0.06] bg-[#06070c]">
            {(['body', 'auth', 'headers'] as const).map((t) => (
              <button key={t} onClick={() => setRequestTab(t)}
                className={`px-4 py-3 text-xs font-medium capitalize border-b-2 transition-all ${
                  requestTab === t
                    ? 'border-blue-500 text-white'
                    : 'border-transparent text-gray-600 hover:text-gray-400'
                }`}>
                {t}
                {t === 'body' && ep.method === 'POST' && (
                  <span className="ml-1.5 text-[9px] font-mono text-gray-700">JSON</span>
                )}
                {t === 'auth' && apiKey && (
                  <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                )}
              </button>
            ))}
          </div>

          {/* Request tab content */}
          <div className="flex-1 flex flex-col min-h-0">
            {requestTab === 'body' && (
              <div className="flex-1 flex flex-col">
                {/* Presets */}
                {presets.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 px-4 py-2 border-b border-white/[0.04] bg-white/[0.01]">
                    <span className="text-[10px] font-mono text-gray-700 uppercase tracking-widest">Presets</span>
                    {presets.map((p, i) => (
                      <button key={i} onClick={() => handleBodyChange(p.body)}
                        className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/[0.07] text-gray-500 hover:text-gray-200 hover:border-white/[0.14] transition-all bg-white/[0.02]">
                        {p.label}
                      </button>
                    ))}
                  </div>
                )}

                {ep.method === 'POST' ? (
                  <div className="flex-1 flex flex-col relative">
                    <div className="flex-1 overflow-auto">
                      <div className="flex">
                        <LineNumbers count={Math.max(bodyLineCount, 6)} />
                        <textarea
                          ref={bodyRef}
                          value={body}
                          onChange={(e) => handleBodyChange(e.target.value)}
                          spellCheck={false}
                          className="flex-1 p-3 pl-3 text-xs font-mono text-gray-300 bg-transparent outline-none resize-none leading-[1.65] min-h-[220px]"
                          style={{ caretColor: '#60a5fa' }}
                          placeholder='{\n  "action": "bridge"\n}'
                        />
                      </div>
                    </div>
                    {jsonError && (
                      <div className="flex items-center gap-2 px-4 py-2 border-t border-red-500/20 bg-red-500/[0.04]">
                        <AlertCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
                        <span className="text-[10px] font-mono text-red-400">{jsonError}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-gray-700">
                      <Wifi className="w-6 h-6" />
                      <p className="text-xs font-mono">GET request — no body</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {requestTab === 'auth' && (
              <div className="flex-1 p-5 space-y-4">
                <div>
                  <label className="text-[10px] font-mono text-gray-600 uppercase tracking-widest block mb-2">
                    Bearer Token
                  </label>
                  <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${
                    apiKey ? 'border-emerald-500/30 bg-emerald-500/[0.04]' : 'border-white/[0.08] bg-white/[0.02]'
                  }`}>
                    {apiKey
                      ? <Unlock className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      : <Lock className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />}
                    <input
                      type="text"
                      placeholder="vp_xxxxxxxxxxxxxxxxxxxxxxxx"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="flex-1 bg-transparent text-sm font-mono text-gray-300 placeholder-gray-700 outline-none"
                    />
                    {apiKey && (
                      <button onClick={() => setApiKey('')} className="text-gray-600 hover:text-gray-400">
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  {apiKey && (
                    <p className="text-[10px] font-mono text-emerald-400 mt-1.5 flex items-center gap-1.5">
                      <CheckCircle className="w-3 h-3" /> Authorization header will be sent
                    </p>
                  )}
                </div>

                {ep.auth === 'bearer_or_x402' && !apiKey && (
                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-cyan-500/[0.05] border border-cyan-500/20">
                    <Zap className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-mono text-cyan-300 font-semibold mb-0.5">x402 endpoint</p>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        Without an API key, the server will return HTTP 402. Add a Bearer key above to skip x402, or leave empty to see the payment challenge response.
                      </p>
                      <Link to="/get-api-key" className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 mt-1.5 transition-colors">
                        Get a free API key <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                )}

                {ep.auth === 'none' && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/[0.04] border border-emerald-500/15">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <p className="text-[11px] text-gray-500">This endpoint is public — no authentication required.</p>
                  </div>
                )}
              </div>
            )}

            {requestTab === 'headers' && (
              <div className="flex-1 p-5">
                <p className="text-[10px] font-mono text-gray-700 uppercase tracking-widest mb-3">Request Headers</p>
                <div className="rounded-lg border border-white/[0.07] overflow-hidden bg-[#07080e] divide-y divide-white/[0.04]">
                  {[
                    { key: 'Accept',        value: 'application/json',     always: true },
                    { key: 'Content-Type',  value: 'application/json',     always: ep.method === 'POST' },
                    { key: 'Authorization', value: apiKey ? `Bearer ${apiKey.slice(0, 12)}...` : '— not set —', always: false },
                  ].filter((h) => h.always || (h.key === 'Authorization' && apiKey)).map((h) => (
                    <div key={h.key} className="flex items-center gap-4 px-4 py-2.5 text-xs font-mono">
                      <span className="text-blue-300 w-36 flex-shrink-0">{h.key}</span>
                      <span className={h.key === 'Authorization' && apiKey ? 'text-emerald-300' : 'text-gray-500'}>{h.value}</span>
                    </div>
                  ))}
                </div>

                {!apiKey && ep.auth !== 'none' && (
                  <p className="text-[10px] text-gray-700 mt-2 font-mono">
                    Authorization header not set — add a Bearer token in the Auth tab.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Mobile endpoint picker */}
          <div className="md:hidden border-t border-white/[0.05] px-4 py-3 flex flex-wrap gap-2">
            {ENDPOINTS.map((e) => (
              <button key={e.id} onClick={() => switchEndpoint(e.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                  activeId === e.id ? 'bg-blue-500/10 border-blue-500/30 text-white' : 'border-white/[0.06] text-gray-600'
                }`}>
                <MethodBadge method={e.method} />
                {e.path}
              </button>
            ))}
          </div>
        </div>

        {/* ── RIGHT: response viewer ── */}
        <div className="flex-1 min-w-0 flex flex-col">

          {/* Response status bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-[#06070c] min-h-[53px]">
            {sending && (
              <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
                <Loader className="w-3.5 h-3.5 animate-spin" />
                <span>Sending request…</span>
              </div>
            )}
            {!sending && status !== null && (
              <>
                <StatusBadge status={status} />
                {verdict && <VerdictBadge verdict={verdict} />}
                {latency !== null && (
                  <div className="flex items-center gap-1 text-xs font-mono text-gray-600">
                    <Clock className="w-3 h-3" />{latency}ms
                  </div>
                )}
                {responseBody && (
                  <span className="text-[10px] font-mono text-gray-700">
                    {new Blob([responseBody]).size}B
                  </span>
                )}
                <div className="ml-auto flex items-center gap-2">
                  {responseBody && <CopyBtn text={responseBody} />}
                  <button onClick={() => { setStatus(null); setLatency(null); setResponseBody(null); setSendError(null); }}
                    className="text-gray-700 hover:text-gray-400 transition-colors p-1 rounded hover:bg-white/[0.04]">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            )}
            {!sending && sendError && (
              <div className="flex items-center gap-2 text-xs font-mono text-red-400">
                <XCircle className="w-3.5 h-3.5" />
                <span className="truncate">{sendError}</span>
              </div>
            )}
            {!sending && status === null && !sendError && (
              <span className="text-xs font-mono text-gray-700">Hit Send to see a response</span>
            )}
          </div>

          {/* Response tabs */}
          <div className="flex border-b border-white/[0.06] bg-[#06070c]">
            {(['body', 'info'] as const).map((t) => (
              <button key={t} onClick={() => setResponseTab(t)}
                className={`px-4 py-3 text-xs font-medium capitalize border-b-2 transition-all ${
                  responseTab === t ? 'border-blue-500 text-white' : 'border-transparent text-gray-600 hover:text-gray-400'
                }`}>
                {t === 'info' ? 'Request Info' : 'Response Body'}
              </button>
            ))}
          </div>

          {/* Response content */}
          <div className="flex-1 overflow-auto relative bg-[#07080e]">
            <AnimatePresence mode="wait">
              {/* Empty state */}
              {!sending && status === null && !sendError && responseTab === 'body' && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                    <WifiOff className="w-5 h-5 text-gray-700" />
                  </div>
                  <p className="text-sm font-mono text-gray-700">Response will appear here</p>
                  <p className="text-xs text-gray-800">Select an endpoint and press Send</p>
                </motion.div>
              )}

              {/* Loading */}
              {sending && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <Loader className="w-7 h-7 text-blue-500 animate-spin" />
                  <p className="text-xs font-mono text-gray-600">Waiting for response…</p>
                </motion.div>
              )}

              {/* Network error */}
              {sendError && !sending && (
                <motion.div key="error" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="p-5">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/[0.06] border border-red-500/20">
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-red-300 font-semibold mb-1">Request failed</p>
                      <p className="text-xs text-gray-500 leading-relaxed font-mono">{sendError}</p>
                      <div className="mt-3 space-y-1 text-xs text-gray-600">
                        <p>Possible causes:</p>
                        <p>· CORS blocked — the API may not allow browser requests</p>
                        <p>· Network error — check your connection</p>
                        <p>· Server down — check <code className="text-gray-500">GET /health</code></p>
                      </div>
                      <button onClick={() => switchEndpoint('health')}
                        className="mt-3 flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                        <RefreshCw className="w-3 h-3" /> Try /health
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Response body */}
              {responseBody && !sending && responseTab === 'body' && (
                <motion.div key="response" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="p-4">
                  {/* 402 callout */}
                  {status === 402 && (
                    <div className="flex items-start gap-2.5 mb-4 p-3 rounded-lg bg-yellow-500/[0.06] border border-yellow-500/20">
                      <Zap className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-mono text-yellow-300 font-semibold mb-0.5">x402 Payment Required</p>
                        <p className="text-[11px] text-gray-500">Pay $0.01 USDC on Base via x402 and retry. Add a Bearer key in Auth to skip this.</p>
                        <Link to="/get-api-key" className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 mt-1 transition-colors">
                          Get free API key <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-4">
                    <LineNumbers count={responseLineCount} />
                    <div className="flex-1 min-w-0 overflow-x-auto">
                      <JsonHighlight text={responseBody} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Request info tab */}
              {!sending && responseTab === 'info' && (
                <motion.div key="info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="p-5 space-y-4">
                  <div>
                    <p className="text-[10px] font-mono text-gray-700 uppercase tracking-widest mb-2">Request Details</p>
                    <div className="rounded-lg border border-white/[0.07] overflow-hidden divide-y divide-white/[0.04]">
                      {[
                        { label: 'Method',   value: ep.method, cls: ep.method === 'GET' ? 'text-emerald-300' : 'text-blue-300' },
                        { label: 'URL',      value: fullUrl,   cls: 'text-gray-300' },
                        { label: 'Auth',     value: ep.auth === 'none' ? 'None (public)' : apiKey ? 'Bearer token set' : 'Not configured', cls: ep.auth === 'none' ? 'text-emerald-400' : apiKey ? 'text-emerald-400' : 'text-gray-600' },
                        { label: 'Cost',     value: ep.cost,   cls: ep.cost === 'Free' ? 'text-emerald-400' : 'text-blue-400' },
                      ].map((r) => (
                        <div key={r.label} className="flex items-center gap-4 px-4 py-2.5">
                          <span className="text-[10px] font-mono text-gray-700 w-20 flex-shrink-0">{r.label}</span>
                          <span className={`text-xs font-mono ${r.cls}`}>{r.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {status !== null && (
                    <div>
                      <p className="text-[10px] font-mono text-gray-700 uppercase tracking-widest mb-2">Response Details</p>
                      <div className="rounded-lg border border-white/[0.07] overflow-hidden divide-y divide-white/[0.04]">
                        {[
                          { label: 'Status',  value: String(status),        cls: status < 300 ? 'text-emerald-400' : status === 402 ? 'text-yellow-300' : 'text-red-400' },
                          { label: 'Latency', value: latency != null ? `${latency}ms` : '—', cls: 'text-gray-300' },
                          { label: 'Size',    value: responseBody ? `${new Blob([responseBody]).size} bytes` : '—', cls: 'text-gray-500' },
                        ].map((r) => (
                          <div key={r.label} className="flex items-center gap-4 px-4 py-2.5">
                            <span className="text-[10px] font-mono text-gray-700 w-20 flex-shrink-0">{r.label}</span>
                            <span className={`text-xs font-mono ${r.cls}`}>{r.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {ep.method === 'POST' && body && (
                    <div>
                      <p className="text-[10px] font-mono text-gray-700 uppercase tracking-widest mb-2">Request Body</p>
                      <div className="rounded-lg border border-white/[0.07] overflow-hidden bg-[#050508]">
                        <div className="p-3 overflow-x-auto">
                          <JsonHighlight text={body} />
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── HISTORY DRAWER ── */}
      <AnimatePresence>
        {historyOpen && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.09] bg-[#07080e] shadow-2xl"
            style={{ maxHeight: '40vh' }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <History className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-sm font-semibold text-white">Request History</span>
                <span className="text-[10px] font-mono text-gray-600">{history.length} entries</span>
              </div>
              <div className="flex items-center gap-2">
                {history.length > 0 && (
                  <button onClick={() => setHistory([])}
                    className="flex items-center gap-1 text-xs text-gray-600 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-500/[0.05]">
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                )}
                <button onClick={() => setHistoryOpen(false)}
                  className="text-gray-600 hover:text-gray-400 p-1 rounded hover:bg-white/[0.04] transition-colors">
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: 'calc(40vh - 53px)' }}>
              {history.length === 0 ? (
                <div className="flex items-center justify-center py-8 gap-2 text-gray-700">
                  <Info className="w-4 h-4" />
                  <span className="text-sm font-mono">No requests yet</span>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.04]">
                  {history.map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() => loadHistory(entry)}
                      className="w-full flex items-center gap-4 px-4 py-3 hover:bg-white/[0.02] transition-colors group text-left"
                    >
                      <MethodBadge method={entry.method as 'GET' | 'POST'} />
                      <span className="text-xs font-mono text-gray-400 group-hover:text-white transition-colors flex-shrink-0">
                        {entry.path}
                      </span>
                      <span className="flex-1" />
                      {entry.error ? (
                        <span className="text-[10px] font-mono text-red-400">ERR</span>
                      ) : (
                        <span className={`text-[10px] font-bold font-mono ${
                          entry.statusCode === 200 ? 'text-emerald-400'
                          : entry.statusCode === 402 ? 'text-yellow-300'
                          : 'text-red-400'
                        }`}>{entry.statusCode}</span>
                      )}
                      {entry.latencyMs !== null && (
                        <span className="text-[10px] font-mono text-gray-700 w-14 text-right">
                          {entry.latencyMs}ms
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-gray-700 w-20 text-right">
                        {entry.ts.toLocaleTimeString('en-US', { hour12: false })}
                      </span>
                      <ChevronRight className="w-3 h-3 text-gray-700 group-hover:text-gray-400 transition-colors flex-shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
