import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SpecButtons } from '../components/SpecButtons';
import {
  Terminal, Copy, Check, ArrowRight, ChevronRight,
  Zap, Shield, Clock, CreditCard, Server,
  Hash, Lock, Wifi, AlertCircle,
  ChevronDown, ExternalLink, Play, Activity, Key,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { API_BASE_URL, SUPABASE_FUNCTIONS_URL } from '../lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

type Method = 'POST' | 'GET';
type Verdict = 'proceed' | 'block' | 'halt' | 'warn' | 'wait';
type LangId = 'curl' | 'js' | 'ts' | 'python';

interface Param { name: string; type: string; required: boolean; desc: string; values?: string[] }

interface Endpoint {
  id: string;
  method: Method;
  path: string;
  tag: string;
  tagColor: string;
  summary: string;
  description: string;
  cost: string;
  latency: string;
  auth: 'none' | 'bearer' | 'bearer_or_x402';
  params?: Param[];
  requestBody?: string;
  requestBodyCompact?: string;
  responses: { status: number; label: string; body: string; verdict?: Verdict }[];
  badge?: string;
}

// ─── Endpoint definitions ─────────────────────────────────────────────────────

const ENDPOINT_DEFS: Endpoint[] = [
  {
    id: 'health',
    method: 'GET',
    path: '/health',
    tag: 'System',
    tagColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/[0.07]',
    summary: 'Liveness check',
    description: 'Returns ok: true when the API is operational. Use this to monitor uptime. No authentication required — safe to poll every 30s from any monitoring system.',
    cost: 'Free',
    latency: '~5ms',
    auth: 'none',
    responses: [
      {
        status: 200, label: 'OK',
        body: `{\n  "ok":   true,\n  "name": "Decision + Verification Agent"\n}`,
      },
    ],
  },
  {
    id: 'capabilities',
    method: 'GET',
    path: '/v1/capabilities',
    tag: 'System',
    tagColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/[0.07]',
    summary: 'Capability manifest',
    description: "Returns all supported checks, guard actions, decision types, and endpoint URLs. Agents should call this at startup to discover what's available. Cacheable for 5 minutes.",
    cost: 'Free',
    latency: '~30ms',
    auth: 'none',
    responses: [
      {
        status: 200, label: 'OK',
        body: `{\n  "name": "Decision + Verification Agent",\n  "checks_supported": [\n    "http", "rpc", "price", "tx",\n    "dex_price", "stablecoin_depeg",\n    "bridge_exploit_monitor", "rug_pull_risk"\n  ],\n  "guard_actions_supported": [\n    "swap", "transfer", "bridge", "yield_deposit", "generic"\n  ],\n  "max_checks_private": 10,\n  "max_checks_acp":     3,\n  "decision_types": ["proceed", "wait", "block"],\n  "base_url": "${API_BASE_URL}",\n  "endpoints": {\n    "acp_guard":     "/v1/acp/guard",\n    "acp_decision":  "/v1/acp/decide",\n    "private_guard": "/functions/v1/guard",\n    "api_key_signup": "/functions/v1/api-key-signup",\n    "agents":        "/v1/agents",\n    "health":        "/health"\n  }\n}`,
      },
    ],
  },
  {
    id: 'agents',
    method: 'GET',
    path: '/v1/agents',
    tag: 'Agents',
    tagColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/[0.07]',
    summary: 'List agents',
    description: 'Returns all agents in the ecosystem. Each agent has a slug, live status, description, and list of endpoints it exposes.',
    cost: 'Free',
    latency: '~25ms',
    auth: 'none',
    responses: [
      {
        status: 200, label: 'OK',
        body: `[\n  {\n    "name":        "Decision Verification Agent",\n    "slug":        "decision-verification-agent",\n    "status":      "live",\n    "description": "Verifies conditions before autonomous systems act.",\n    "endpoints":   ["/v1/decide", "/v1/acp/decide", "/functions/v1/guard", "/v1/acp/guard"]\n  },\n  {\n    "name":        "Execution Guard Engine",\n    "slug":        "execution-guard-engine",\n    "status":      "live",\n    "description": "Universal guard — builds correct safety checks automatically.",\n    "endpoints":   ["/functions/v1/guard", "/v1/acp/guard"]\n  }\n]`,
      },
    ],
  },
  {
    id: 'signup',
    method: 'POST',
    path: `${SUPABASE_FUNCTIONS_URL}/api-key-signup`,
    tag: 'Auth',
    tagColor: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/[0.07]',
    summary: 'Issue API key',
    description: 'Creates a vp_ API key stored in the shared api_signups key store. Keys are immediately valid on /functions/v1/guard. Free tier — 100 requests/month, no credit card required.',
    cost: 'Free',
    latency: '~200ms',
    auth: 'none',
    params: [
      { name: 'email',       type: 'string', required: true,  desc: 'Email address for key delivery and recovery.' },
      { name: 'full_name',   type: 'string', required: true,  desc: 'Your name or agent identifier.' },
      { name: 'use_case',    type: 'string', required: true,  desc: 'Primary use case: defi-agent, bridge, research, etc.' },
      { name: 'company',     type: 'string', required: false, desc: 'Organization or project name.' },
      { name: 'description', type: 'string', required: false, desc: 'Brief description of what you are building.' },
    ],
    requestBody: `{\n  "email":       "agent@example.com",\n  "full_name":   "Trading Bot v2",\n  "use_case":    "defi-agent",\n  "description": "Autonomous DeFi trading agent on Base"\n}`,
    requestBodyCompact: `{"email":"agent@example.com","full_name":"Trading Bot v2","use_case":"defi-agent"}`,
    responses: [
      {
        status: 200, label: 'Key issued',
        body: `{\n  "ok":      true,\n  "message": "Signup received. Use the issued key for private endpoints.",\n  "api_key": "vp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx",\n  "base_url": "${API_BASE_URL}"\n}`,
      },
    ],
  },
  {
    id: 'guard-acp',
    method: 'POST',
    path: '/v1/acp/guard',
    tag: 'ACP',
    tagColor: 'text-blue-400 border-blue-500/30 bg-blue-500/[0.07]',
    summary: 'Pre-execution safety check (ACP)',
    description: 'Runs real-time safety checks before your agent executes an on-chain action. Checks include: RPC health, bridge exploits, stablecoin depeg, DEX liquidity, and rug-pull risk. Returns a deterministic verdict with confidence score and full evidence breakdown. Up to 3 checks per request. x402-enabled — pay $0.01 USDC on Base.',
    cost: '$0.01',
    latency: '~180ms',
    auth: 'bearer_or_x402',
    badge: 'x402',
    params: [
      { name: 'action',      type: 'string',  required: true,  desc: 'Agent action type.', values: ['swap', 'transfer', 'bridge', 'yield_deposit', 'generic'] },
      { name: 'chain',       type: 'string',  required: true,  desc: 'Target chain.',       values: ['base', 'ethereum', 'arbitrum', 'optimism'] },
      { name: 'amount_usd',  type: 'number',  required: false, desc: 'USD value of operation. Enables amount-based risk thresholds.' },
      { name: 'asset',       type: 'string',  required: false, desc: 'Asset symbol (e.g. USDC, ETH, WBTC).' },
      { name: 'strict_mode', type: 'boolean', required: false, desc: 'Block on warnings in addition to hard failures. Default: false.' },
      { name: 'context',     type: 'object',  required: false, desc: 'Arbitrary metadata forwarded to checks.' },
    ],
    requestBody: `{\n  "action":     "bridge",\n  "chain":      "base",\n  "amount_usd": 50000\n}`,
    requestBodyCompact: `{"action":"bridge","chain":"base","amount_usd":50000}`,
    responses: [
      {
        status: 200, label: 'proceed — low risk', verdict: 'proceed',
        body: `{\n  "verdict":    "proceed",\n  "confidence": 0.95,\n  "risk":       "low",\n  "expires_in": 300,\n  "decision": {\n    "action":      "execute_swap",\n    "reason":      "All safety checks passed successfully.",\n    "constraints": {}\n  },\n  "evidence": [\n    {\n      "type":     "rpc",\n      "rpc_url":  "https://mainnet.base.org/",\n      "status":   200,\n      "latency_ms": 32,\n      "ok":       true\n    },\n    {\n      "type":            "stablecoin_depeg",\n      "asset_id":        "usd-coin",\n      "price":           0.999762,\n      "deviation_pct":   0.000238,\n      "severity":        "safe",\n      "ok":              true\n    }\n  ],\n  "failure_modes": []\n}`,
      },
      {
        status: 200, label: 'block — high risk', verdict: 'block',
        body: `{\n  "verdict":    "block",\n  "confidence": 0.92,\n  "risk":       "high",\n  "expires_in": 300,\n  "decision": {\n    "action":      "block",\n    "reason":      "Non-transient check failed in strict mode.",\n    "constraints": {}\n  },\n  "evidence": [\n    {\n      "type":   "rpc",\n      "status": 200,\n      "ok":     true\n    }\n  ],\n  "failure_modes": []\n}`,
      },
      {
        status: 402, label: 'Payment Required',
        body: `{\n  "error": "payment_required",\n  "payment": {\n    "protocol":  "x402",\n    "version":   "1",\n    "token":     "USDC",\n    "network":   "base",\n    "amount":    "0.010000",\n    "recipient": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",\n    "nonce":     "a1b2c3d4e5f6789012",\n    "expires_at": "2026-06-15T10:05:00Z"\n  },\n  "message": "Pay $0.01 USDC on Base via x402 and retry."\n}`,
      },
    ],
  },
  {
    id: 'decide-acp',
    method: 'POST',
    path: '/v1/acp/decide',
    tag: 'ACP',
    tagColor: 'text-blue-400 border-blue-500/30 bg-blue-500/[0.07]',
    summary: 'Policy-driven decision (ACP)',
    description: 'Provide a goal and the engine returns a structured decision with full reasoning chain and failure modes. Uses live signals to evaluate whether the action is safe to proceed. x402-enabled.',
    cost: '$0.01',
    latency: '~240ms',
    auth: 'bearer_or_x402',
    badge: 'x402',
    params: [
      { name: 'action',  type: 'string', required: true,  desc: 'Agent action type.',    values: ['swap', 'transfer', 'bridge', 'yield_deposit', 'generic'] },
      { name: 'goal',    type: 'string', required: true,  desc: 'What the agent is trying to achieve. Used for reasoning.' },
      { name: 'asset',   type: 'string', required: false, desc: 'Asset symbol (e.g. USDC, ETH).' },
      { name: 'chain',   type: 'string', required: false, desc: 'Target chain identifier.' },
      { name: 'amount',  type: 'number', required: false, desc: 'Token amount in atomic units.' },
      { name: 'policy',  type: 'string', required: false, desc: 'Risk policy.',           values: ['conservative', 'balanced', 'aggressive'] },
    ],
    requestBody: `{\n  "action": "swap",\n  "goal":   "maximize yield on idle USDC",\n  "asset":  "USDC",\n  "chain":  "ethereum",\n  "amount": 100000000,\n  "policy": "conservative"\n}`,
    requestBodyCompact: `{"action":"swap","goal":"maximize yield on idle USDC","asset":"USDC","chain":"ethereum","policy":"conservative"}`,
    responses: [
      {
        status: 200, label: 'block — halt', verdict: 'block',
        body: `{\n  "verdict":    "block",\n  "confidence": 0.9,\n  "risk":       "high",\n  "expires_in": 300,\n  "decision": {\n    "action":  "halt",\n    "reason":  "No evidence provided to support decision.",\n    "constraints": {}\n  },\n  "evidence":      [],\n  "failure_modes": ["insufficient evidence", "lack of context"]\n}`,
      },
    ],
  },
  {
    id: 'guard-private',
    method: 'POST',
    path: `${SUPABASE_FUNCTIONS_URL}/guard`,
    tag: 'Private',
    tagColor: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/[0.07]',
    summary: 'Pre-execution safety check (private)',
    description: 'Same as /v1/acp/guard but requires API key authentication and supports up to 10 checks per request. Recommended for production workloads that need maximum check coverage.',
    cost: '$0.01',
    latency: '~180ms',
    auth: 'bearer',
    params: [
      { name: 'action',      type: 'string',  required: true,  desc: 'Agent action type.', values: ['swap', 'transfer', 'bridge', 'yield_deposit', 'generic'] },
      { name: 'chain',       type: 'string',  required: true,  desc: 'Target chain.',       values: ['base', 'ethereum', 'arbitrum', 'optimism'] },
      { name: 'amount_usd',  type: 'number',  required: false, desc: 'USD value of operation.' },
      { name: 'asset',       type: 'string',  required: false, desc: 'Asset symbol.' },
      { name: 'strict_mode', type: 'boolean', required: false, desc: 'Block on warnings. Default: false.' },
    ],
    requestBody: `{\n  "action":     "bridge",\n  "chain":      "base",\n  "amount_usd": 50000\n}`,
    requestBodyCompact: `{"action":"bridge","chain":"base","amount_usd":50000}`,
    responses: [
      {
        status: 200, label: 'proceed', verdict: 'proceed',
        body: `{\n  "verdict":    "proceed",\n  "confidence": 0.95,\n  "risk":       "low",\n  "expires_in": 300,\n  "decision": {\n    "action":  "execute_bridge",\n    "reason":  "All safety checks passed.",\n    "constraints": {}\n  },\n  "evidence":      [...],\n  "failure_modes": []\n}`,
      },
      {
        status: 401, label: 'Unauthorized',
        body: `{ "error": "invalid_api_key" }`,
      },
    ],
  },
];

// ─── Code snippet builders ────────────────────────────────────────────────────

const LANGS: { id: LangId; label: string; filename: (ep: Endpoint) => string }[] = [
  { id: 'curl',   label: 'curl',       filename: (ep) => `${ep.id}.sh` },
  { id: 'js',     label: 'JavaScript', filename: (ep) => `${ep.id}.js` },
  { id: 'ts',     label: 'TypeScript', filename: (ep) => `${ep.id}.ts` },
  { id: 'python', label: 'Python',     filename: (ep) => `${ep.id}.py` },
];

function buildSnippets(ep: Endpoint): Record<LangId, string> {
  const url = `${API_BASE_URL}${ep.path}`;
  const isGet = ep.method === 'GET';
  const hasAuth = ep.auth !== 'none';
  const body = ep.requestBodyCompact ?? ep.requestBody?.replace(/\n\s*/g, ' ') ?? '';
  const prettyBody = ep.requestBody ?? '{}';

  // curl
  const curlLines: string[] = [`curl${isGet ? '' : ' -X POST'} "${url}" \\`];
  if (hasAuth) curlLines.push(`  -H "Authorization: Bearer $VP_API_KEY" \\`);
  if (!isGet) {
    curlLines.push(`  -H "Content-Type: application/json" \\`);
    curlLines.push(`  -d '${body}'`);
  } else {
    curlLines[curlLines.length - 1] = curlLines[curlLines.length - 1].replace(/ \\$/, '');
  }
  const curl = curlLines.join('\n');

  // JavaScript
  let js: string;
  if (isGet) {
    js = `const response = await fetch("${url}"${hasAuth ? `, {\n  headers: {\n    "Authorization": "Bearer " + process.env.VP_API_KEY,\n  },\n}` : ''});\n\nif (!response.ok) throw new Error(\`HTTP \${response.status}\`);\nconst data = await response.json();\nconsole.log(data);`;
  } else {
    js = `const response = await fetch("${url}", {\n  method: "POST",\n  headers: {\n${hasAuth ? '    "Authorization": "Bearer " + process.env.VP_API_KEY,\n' : ''}    "Content-Type": "application/json",\n  },\n  body: JSON.stringify(${prettyBody.replace(/^/, '').replace(/\n/g, '\n  ')}),\n});\n\nif (!response.ok) throw new Error(\`HTTP \${response.status}\`);\nconst data = await response.json();\nconsole.log(data);`;
  }

  // TypeScript
  const tsReturnType = ep.id === 'guard-acp' || ep.id === 'guard-private'
    ? `interface GuardResponse {\n  verdict:    "proceed" | "block" | "warn";\n  confidence: number;\n  risk:       "low" | "medium" | "high";\n  expires_in: number;\n  evidence:   unknown[];\n  decision:   { action: string; reason: string };\n}\n\n`
    : ep.id === 'decide-acp'
    ? `interface DecideResponse {\n  verdict:       "proceed" | "block" | "wait";\n  confidence:    number;\n  risk:          "low" | "medium" | "high";\n  decision:      { action: string; reason: string };\n  failure_modes: string[];\n}\n\n`
    : '';

  let ts: string;
  if (isGet) {
    ts = `${tsReturnType}const response = await fetch("${url}"${hasAuth ? `, {\n  headers: {\n    Authorization: \`Bearer \${process.env.VP_API_KEY}\`,\n  },\n}` : ''});\n\nif (!response.ok) throw new Error(\`HTTP \${response.status}\`);\nconst data = await response.json();\nconsole.log(data);`;
  } else {
    const returnTypeAnnotation = tsReturnType
      ? `: ${tsReturnType.split(' ')[1].split('\n')[0]}`
      : '';
    ts = `${tsReturnType}const response = await fetch("${url}", {\n  method: "POST",\n  headers: {\n${hasAuth ? `    Authorization: \`Bearer \${process.env.VP_API_KEY}\`,\n` : ''}    "Content-Type": "application/json",\n  },\n  body: JSON.stringify(${prettyBody.replace(/^/, '').replace(/\n/g, '\n  ')}),\n});\n\nif (!response.ok) throw new Error(\`HTTP \${response.status}\`);\nconst data${returnTypeAnnotation} = await response.json();\nconsole.log(data${ep.id.includes('guard') || ep.id.includes('decide') ? '.verdict' : ''});`;
  }

  // Python
  let python: string;
  if (isGet) {
    python = `import requests\n\n${hasAuth ? 'import os\n\nheaders = {\n    "Authorization": f"Bearer {os.environ[\'VP_API_KEY\']}",\n}\n\n' : ''}response = requests.get(\n    "${url}",\n${hasAuth ? '    headers=headers,\n' : ''})\n\nresponse.raise_for_status()\ndata = response.json()\nprint(data)`;
  } else {
    const pyBody = prettyBody.replace(/true/g, 'True').replace(/false/g, 'False').replace(/null/g, 'None');
    python = `import requests${hasAuth ? '\nimport os' : ''}\n\n${hasAuth ? `headers = {\n    "Authorization": f"Bearer {os.environ['VP_API_KEY']}",\n    "Content-Type": "application/json",\n}\n\n` : ''}payload = ${pyBody}\n\nresponse = requests.post(\n    "${url}",\n${hasAuth ? '    headers=headers,\n' : ''}    json=payload,\n)\n\nresponse.raise_for_status()\ndata = response.json()\nprint(data${ep.id.includes('guard') || ep.id.includes('decide') ? '["verdict"]' : ''})`;
  }

  return { curl, js, ts, python };
}

// ─── Syntax highlighter ───────────────────────────────────────────────────────

function Highlight({ code, lang }: { code: string; lang: LangId }) {
  if (lang === 'curl') return <CurlHighlight code={code} />;
  if (lang === 'js' || lang === 'ts') return <JsTsHighlight code={code} lang={lang} />;
  if (lang === 'python') return <PythonHighlight code={code} />;
  return <code className="text-gray-300 text-xs font-mono leading-7">{code}</code>;
}

function tokenise(line: string, patterns: { regex: RegExp; className: string }[]): React.ReactNode[] {
  const tokens: { start: number; end: number; cls: string; text: string }[] = [];
  for (const { regex, className } of patterns) {
    const re = new RegExp(regex.source, 'g');
    let m: RegExpExecArray | null;
    while ((m = re.exec(line)) !== null) {
      tokens.push({ start: m.index, end: m.index + m[0].length, cls: className, text: m[0] });
    }
  }
  tokens.sort((a, b) => a.start - b.start);

  // Remove overlapping tokens (keep first)
  const clean: typeof tokens = [];
  let cursor = 0;
  for (const t of tokens) {
    if (t.start >= cursor) { clean.push(t); cursor = t.end; }
  }

  const parts: React.ReactNode[] = [];
  let pos = 0;
  clean.forEach((t, i) => {
    if (t.start > pos) parts.push(<span key={`plain-${i}`} className="text-gray-400">{line.slice(pos, t.start)}</span>);
    parts.push(<span key={`tok-${i}`} className={t.cls}>{t.text}</span>);
    pos = t.end;
  });
  if (pos < line.length) parts.push(<span key="tail" className="text-gray-400">{line.slice(pos)}</span>);
  return parts.length ? parts : [<span key="line" className="text-gray-400">{line}</span>];
}

function CurlHighlight({ code }: { code: string }) {
  const patterns = [
    { regex: /\bcurl\b/, className: 'text-purple-400 font-semibold' },
    { regex: /-[A-Za-z]+/, className: 'text-yellow-400' },
    { regex: /"[^"]*"/, className: 'text-emerald-300' },
    { regex: /'[^']*'/, className: 'text-cyan-300' },
    { regex: /https?:\/\/[^\s"'\\]+/, className: 'text-blue-300' },
    { regex: /\$[A-Z_]+/, className: 'text-orange-300' },
    { regex: /\\$/, className: 'text-gray-700' },
  ];
  return (
    <code className="text-xs font-mono leading-7 block">
      {code.split('\n').map((line, i) => <div key={i}>{tokenise(line, patterns)}</div>)}
    </code>
  );
}

function JsTsHighlight({ code, lang }: { code: string; lang: 'js' | 'ts' }) {
  const keywords = ['const', 'let', 'var', 'async', 'await', 'function', 'return', 'if', 'throw', 'new', 'import', 'export', 'from', 'interface'];
  const tsKeywords = lang === 'ts' ? ['string', 'number', 'boolean', 'unknown', 'void'] : [];
  const kw = [...keywords, ...tsKeywords].join('|');
  const patterns = [
    { regex: /\/\/.*$/, className: 'text-gray-600 italic' },
    { regex: new RegExp(`\\b(${kw})\\b`), className: 'text-purple-400' },
    { regex: /"[^"]*"/, className: 'text-emerald-300' },
    { regex: /`[^`]*`/, className: 'text-emerald-300' },
    { regex: /\b(true|false|null|undefined)\b/, className: 'text-cyan-300' },
    { regex: /\b\d+(\.\d+)?\b/, className: 'text-orange-300' },
    { regex: /\b[A-Z][A-Za-z]+(?=\s*[{(<])/, className: 'text-cyan-400' },
    { regex: /process\.env\.\w+/, className: 'text-orange-300' },
  ];
  return (
    <code className="text-xs font-mono leading-7 block">
      {code.split('\n').map((line, i) => <div key={i}>{tokenise(line, patterns)}</div>)}
    </code>
  );
}

function PythonHighlight({ code }: { code: string }) {
  const patterns = [
    { regex: /#.*$/, className: 'text-gray-600 italic' },
    { regex: /\b(import|from|def|class|return|if|else|for|in|as|raise|print|True|False|None)\b/, className: 'text-purple-400' },
    { regex: /f?"[^"]*"/, className: 'text-emerald-300' },
    { regex: /f?'[^']*'/, className: 'text-emerald-300' },
    { regex: /\b\d+(\.\d+)?\b/, className: 'text-orange-300' },
    { regex: /os\.environ\[.*?\]/, className: 'text-orange-300' },
    { regex: /\b[A-Z][A-Za-z]+/, className: 'text-cyan-400' },
    { regex: /\[("[^"]*"(,\s*)?)+\]/, className: 'text-cyan-300' },
  ];
  return (
    <code className="text-xs font-mono leading-7 block">
      {code.split('\n').map((line, i) => <div key={i}>{tokenise(line, patterns)}</div>)}
    </code>
  );
}

// ─── JSON highlight ───────────────────────────────────────────────────────────

function JsonToken({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <code className="text-xs font-mono leading-6 block">
      {lines.map((line, li) => {
        const parts: React.ReactNode[] = [];
        const regex = /"([^"]*)"(\s*:)?|(-?\d+\.?\d*)|(\btrue\b|\bfalse\b|\bnull\b)|(\/\/.*)/g;
        let last = 0, m, ki = 0;
        while ((m = regex.exec(line)) !== null) {
          if (m.index > last) parts.push(<span key={`t${li}-${ki++}`} className="text-gray-500">{line.slice(last, m.index)}</span>);
          if (m[0].endsWith(':') && m[1] !== undefined) {
            parts.push(<span key={`k${li}-${ki++}`} className="text-blue-300">"{m[1]}"</span>);
            parts.push(<span key={`c${li}-${ki++}`} className="text-gray-500">:</span>);
          } else if (m[1] !== undefined) {
            parts.push(<span key={`s${li}-${ki++}`} className="text-emerald-300">"{m[1]}"</span>);
          } else if (m[3] !== undefined) {
            parts.push(<span key={`n${li}-${ki++}`} className="text-orange-300">{m[3]}</span>);
          } else if (m[4] !== undefined) {
            parts.push(<span key={`b${li}-${ki++}`} className="text-cyan-300">{m[4]}</span>);
          } else if (m[5] !== undefined) {
            parts.push(<span key={`cm${li}-${ki++}`} className="text-gray-600 italic">{m[5]}</span>);
          }
          last = m.index + m[0].length;
        }
        if (last < line.length) parts.push(<span key={`e${li}-${ki++}`} className="text-gray-500">{line.slice(last)}</span>);
        return <div key={li}>{parts}</div>;
      })}
    </code>
  );
}

// ─── Shared UI components ─────────────────────────────────────────────────────

function CopyBtn({ text, className = '' }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => { await navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className={`flex items-center gap-1.5 text-xs transition-colors ${className}`}
    >
      {copied
        ? <><Check className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400 font-mono">Copied</span></>
        : <><Copy className="w-3 h-3" /><span className="font-mono">Copy</span></>}
    </button>
  );
}

function TerminalChrome({ filename, label, labelColor = 'text-gray-600', children, copyText }: {
  filename: string; label?: string; labelColor?: string; children: React.ReactNode; copyText: string;
}) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/[0.07] bg-[#07080e]">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-[#0a0b12]">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ff5f57]/60" />
            <span className="w-2 h-2 rounded-full bg-[#febc2e]/60" />
            <span className="w-2 h-2 rounded-full bg-[#28c840]/60" />
          </div>
          <span className="text-xs font-mono text-gray-600">{filename}</span>
          {label && <span className={`text-[10px] font-mono border border-white/[0.06] px-1.5 py-0.5 rounded ${labelColor}`}>{label}</span>}
        </div>
        <CopyBtn text={copyText} className="text-gray-600 hover:text-gray-300 px-2 py-1 rounded hover:bg-white/[0.04]" />
      </div>
      <div className="p-4 overflow-x-auto">{children}</div>
    </div>
  );
}

function MethodBadge({ method, size = 'sm' }: { method: Method; size?: 'xs' | 'sm' }) {
  const color = method === 'POST'
    ? 'text-blue-300 bg-blue-500/15 border-blue-500/30'
    : 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30';
  const px = size === 'xs' ? 'px-1.5 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[10px]';
  return <span className={`inline-block font-bold font-mono rounded border flex-shrink-0 ${color} ${px}`}>{method}</span>;
}

function StatusBadge({ status }: { status: number }) {
  const c = status === 200 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25'
    : status === 402 ? 'text-yellow-300 bg-yellow-500/10 border-yellow-500/25'
    : status === 401 ? 'text-red-400 bg-red-500/10 border-red-500/25'
    : 'text-gray-400 bg-white/[0.04] border-white/[0.08]';
  return <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${c}`}>{status}</span>;
}

function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const map: Record<Verdict, string> = {
    proceed: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
    block:   'text-red-400 bg-red-500/10 border-red-500/25',
    halt:    'text-red-400 bg-red-500/10 border-red-500/25',
    warn:    'text-yellow-300 bg-yellow-500/10 border-yellow-500/25',
    wait:    'text-blue-300 bg-blue-500/10 border-blue-500/25',
  };
  return <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${map[verdict]}`}>{verdict}</span>;
}

function AuthBadge({ auth }: { auth: Endpoint['auth'] }) {
  if (auth === 'none') return <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400"><Activity className="w-3 h-3" /> Public — no auth required</div>;
  if (auth === 'bearer') return <div className="flex items-center gap-1.5 text-xs font-mono text-yellow-400"><Lock className="w-3 h-3" /> API key required</div>;
  return <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400"><Zap className="w-3 h-3" /> Bearer token or x402 USDC payment</div>;
}

// ─── Response panel ───────────────────────────────────────────────────────────

function ResponseTabs({ responses }: { responses: Endpoint['responses'] }) {
  const [tab, setTab] = useState(0);
  const r = responses[tab];
  return (
    <div>
      <div className="flex gap-1.5 mb-3 flex-wrap">
        {responses.map((res, i) => (
          <button key={i} onClick={() => setTab(i)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              tab === i
                ? 'bg-white/[0.07] border-white/[0.12] text-white'
                : 'border-transparent text-gray-600 hover:text-gray-400 hover:bg-white/[0.02]'
            }`}>
            <StatusBadge status={res.status} />
            <span>{res.label}</span>
            {res.verdict && <VerdictBadge verdict={res.verdict} />}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
          <TerminalChrome filename="response.json" label={`${r.status} ${r.label}`} copyText={r.body}>
            <JsonToken text={r.body} />
          </TerminalChrome>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Param row ────────────────────────────────────────────────────────────────

function ParamRow({ p }: { p: Param }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border-b border-white/[0.04] last:border-0 transition-colors ${open ? 'bg-white/[0.015]' : ''}`}>
      <button
        onClick={() => p.values ? setOpen(!open) : undefined}
        className={`w-full flex items-center gap-3 px-4 py-3 text-left ${p.values ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <div className="flex-1 min-w-0 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-sm font-mono text-blue-300 flex-shrink-0">{p.name}</span>
          <span className="text-[10px] font-mono text-gray-600 px-1.5 py-0.5 bg-white/[0.03] border border-white/[0.06] rounded flex-shrink-0">{p.type}</span>
          {p.required
            ? <span className="text-[10px] font-mono text-red-400/80 flex-shrink-0">required</span>
            : <span className="text-[10px] font-mono text-gray-700 flex-shrink-0">optional</span>
          }
          <span className="text-xs text-gray-500 leading-relaxed">{p.desc}</span>
        </div>
        {p.values && <ChevronDown className={`w-3.5 h-3.5 text-gray-600 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />}
      </button>
      <AnimatePresence>
        {open && p.values && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }} className="overflow-hidden">
            <div className="px-4 pb-3 flex flex-wrap gap-1.5">
              {p.values.map((v) => (
                <span key={v} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.07] text-gray-400">{v}</span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Multi-language code panel ────────────────────────────────────────────────

function MultiLangPanel({ ep }: { ep: Endpoint }) {
  const [lang, setLang] = useState<LangId>('curl');
  const snippets = buildSnippets(ep);
  const langMeta = LANGS.find((l) => l.id === lang)!;
  const code = snippets[lang];

  return (
    <div className="rounded-xl overflow-hidden border border-white/[0.07] bg-[#07080e]">
      {/* Tab bar */}
      <div className="flex items-center border-b border-white/[0.06] bg-[#0a0b12]">
        <div className="flex items-center gap-1.5 px-4 py-2.5">
          <span className="w-2 h-2 rounded-full bg-[#ff5f57]/60" />
          <span className="w-2 h-2 rounded-full bg-[#febc2e]/60" />
          <span className="w-2 h-2 rounded-full bg-[#28c840]/60" />
        </div>
        <div className="flex-1 flex overflow-x-auto">
          {LANGS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              className={`relative flex-shrink-0 px-4 py-2.5 text-xs font-mono transition-colors border-b-2 ${
                lang === l.id
                  ? 'text-white border-blue-500 bg-white/[0.03]'
                  : 'text-gray-600 border-transparent hover:text-gray-300 hover:bg-white/[0.02]'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <div className="px-4 py-2.5 flex-shrink-0">
          <CopyBtn text={code} className="text-gray-600 hover:text-gray-300 px-2 py-1 rounded hover:bg-white/[0.04]" />
        </div>
      </div>

      {/* Filename strip */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#08090f] border-b border-white/[0.04]">
        <span className="text-[10px] font-mono text-gray-700">{langMeta.filename(ep)}</span>
      </div>

      {/* Code */}
      <AnimatePresence mode="wait">
        <motion.div
          key={lang}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="p-5 overflow-x-auto"
        >
          <Highlight code={code} lang={lang} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Sidebar nav item ─────────────────────────────────────────────────────────

function NavItem({ ep, active, onClick }: { ep: Endpoint; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-150 group ${
        active ? 'bg-white/[0.06] border border-white/[0.10]' : 'hover:bg-white/[0.02] border border-transparent'
      }`}>
      <MethodBadge method={ep.method} size="xs" />
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-mono truncate transition-colors ${active ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{ep.path}</p>
        <p className="text-[10px] text-gray-700 mt-0.5 truncate">{ep.summary}</p>
      </div>
      {active && <ChevronRight className="w-3 h-3 text-gray-500 flex-shrink-0" />}
    </button>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeading({ label }: { label: string }) {
  return (
    <h2 className="text-[11px] font-mono text-gray-600 uppercase tracking-widest mb-4 flex items-center gap-2">
      <Hash className="w-3.5 h-3.5" /> {label}
    </h2>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ApiReferencePage() {
  const [activeId, setActiveId] = useState('health');
  const contentRef = useRef<HTMLDivElement>(null);
  const ep = ENDPOINT_DEFS.find((e) => e.id === activeId)!;

  const switchEndpoint = (id: string) => {
    setActiveId(id);
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && ENDPOINT_DEFS.find((e) => e.id === hash)) setActiveId(hash);
  }, []);

  // Group endpoints by tag
  const groups: Record<string, Endpoint[]> = {};
  for (const e of ENDPOINT_DEFS) {
    if (!groups[e.tag]) groups[e.tag] = [];
    groups[e.tag].push(e);
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col overflow-x-hidden">
      <Navbar />

      {/* ── PAGE HERO ── */}
      <div className="relative pt-16 border-b border-white/[0.06] flex-shrink-0">
        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/[0.05] rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="section-label mb-3">
                <Terminal className="w-3.5 h-3.5" /> API Reference
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
                className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-3">
                REST API
              </motion.h1>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}
                className="flex flex-wrap items-center gap-3 text-sm">
                <span className="font-mono text-gray-700 text-xs">Base URL</span>
                <code className="text-blue-300 font-mono text-xs bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-lg">
                  {API_BASE_URL}
                </code>
                <CopyBtn text={API_BASE_URL} className="text-gray-600 hover:text-gray-300 px-2 py-1 rounded hover:bg-white/[0.04]" />
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.16 }}
              className="flex flex-wrap gap-2 items-center">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/[0.06]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-xs font-mono text-emerald-400">All systems operational</span>
              </div>
              {[
                { label: 'x402 enabled', c: 'text-cyan-400 border-cyan-500/25 bg-cyan-500/[0.06]' },
                { label: 'Base Mainnet', c: 'text-blue-400 border-blue-500/25 bg-blue-500/[0.06]' },
                { label: 'TLS 1.3',      c: 'text-gray-400 border-white/[0.1] bg-white/[0.02]' },
              ].map((b) => (
                <span key={b.label} className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${b.c}`}>{b.label}</span>
              ))}
              <SpecButtons size="xs" />
            </motion.div>
          </div>

          {/* Endpoint quick-jump */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mt-8 flex flex-wrap gap-2">
            {ENDPOINT_DEFS.map((e) => (
              <button key={e.id} onClick={() => switchEndpoint(e.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-mono transition-all duration-150 ${
                  activeId === e.id
                    ? 'bg-white/[0.07] border-white/[0.14] text-white'
                    : 'border-white/[0.06] text-gray-500 hover:text-gray-200 hover:border-white/[0.10] bg-white/[0.02]'
                }`}>
                <MethodBadge method={e.method} size="xs" />
                {e.path}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="flex-1 flex">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex gap-0 lg:gap-10 py-8">

          {/* ── SIDEBAR ── */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="sticky top-8 space-y-1">
              {Object.entries(groups).map(([tag, eps]) => (
                <div key={tag} className="mb-4">
                  <p className="text-[10px] font-mono text-gray-700 uppercase tracking-widest mb-1.5 px-3">{tag}</p>
                  {eps.map((e) => (
                    <NavItem key={e.id} ep={e} active={activeId === e.id} onClick={() => switchEndpoint(e.id)} />
                  ))}
                </div>
              ))}

              <div className="border-t border-white/[0.05] pt-4 space-y-0.5 mt-4">
                <p className="text-[10px] font-mono text-gray-700 uppercase tracking-widest mb-1.5 px-3">Resources</p>
                <Link to="/playground" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-blue-300 transition-colors hover:bg-blue-500/[0.04]">
                  <Play className="w-3 h-3" /> Try in Playground
                </Link>
                <Link to="/docs" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-gray-300 transition-colors hover:bg-white/[0.02]">
                  <Terminal className="w-3 h-3" /> Full Docs
                </Link>
                <Link to="/get-api-key" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-gray-300 transition-colors hover:bg-white/[0.02]">
                  <Key className="w-3 h-3" /> Get API Key
                </Link>
                <a href="https://github.com/verifyproceed" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-gray-300 transition-colors hover:bg-white/[0.02]">
                  <ExternalLink className="w-3 h-3" /> GitHub
                </a>
              </div>

              <div className="mt-5 p-3 rounded-xl border border-white/[0.06] bg-white/[0.01] space-y-2">
                <p className="text-[10px] font-mono text-gray-700 uppercase tracking-widest mb-2">Infrastructure</p>
                {[
                  { icon: Wifi,   label: 'Base Mainnet',  sub: 'USDC settlement' },
                  { icon: Shield, label: 'TLS 1.3',       sub: 'Encrypted in transit' },
                  { icon: Server, label: 'Multi-region',  sub: 'Global edge' },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon className="w-3 h-3 text-gray-600 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-gray-400">{label}</p>
                      <p className="text-[9px] text-gray-700">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* ── CONTENT ── */}
          <div ref={contentRef} className="flex-1 min-w-0">
            {/* Mobile endpoint picker */}
            <div className="lg:hidden flex flex-wrap gap-2 mb-6">
              {ENDPOINT_DEFS.map((e) => (
                <button key={e.id} onClick={() => switchEndpoint(e.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-mono transition-all ${
                    activeId === e.id ? 'bg-white/[0.07] border-white/[0.12] text-white' : 'border-white/[0.06] text-gray-500 hover:text-white bg-white/[0.02]'
                  }`}>
                  <MethodBadge method={e.method} size="xs" />
                  {e.path}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeId}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-10"
              >
                {/* ── HEADER ── */}
                <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
                  <div className={`h-0.5 ${ep.method === 'POST' ? 'bg-gradient-to-r from-blue-500/60 via-blue-400/30 to-transparent' : 'bg-gradient-to-r from-emerald-500/60 via-emerald-400/30 to-transparent'}`} />
                  <div className="p-6 sm:p-8 bg-white/[0.015]">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <MethodBadge method={ep.method} />
                      <code className="text-xl sm:text-2xl font-mono text-white font-semibold">{ep.path}</code>
                      <span className={`text-[10px] font-mono font-semibold px-2.5 py-1 rounded-lg border ${ep.tagColor}`}>{ep.tag}</span>
                      {ep.badge === 'x402' && (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-300 px-2.5 py-1 rounded-lg border border-cyan-500/30 bg-cyan-500/[0.07]">
                          <Zap className="w-2.5 h-2.5" /> x402
                        </span>
                      )}
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-3xl">{ep.description}</p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      {[
                        { icon: CreditCard, label: 'Cost',     value: ep.cost,    color: 'text-blue-400' },
                        { icon: Clock,      label: 'Latency',  value: ep.latency, color: 'text-emerald-400' },
                        { icon: Lock,       label: 'Auth',     value: ep.auth === 'none' ? 'Public' : ep.auth === 'bearer' ? 'Bearer' : 'Bearer / x402', color: ep.auth === 'none' ? 'text-emerald-400' : ep.auth === 'bearer' ? 'text-yellow-400' : 'text-cyan-400' },
                        { icon: Server,     label: 'Protocol', value: 'HTTPS · REST', color: 'text-gray-400' },
                      ].map(({ icon: Icon, label, value, color }) => (
                        <div key={label} className="glass-card rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-1.5">
                            <Icon className={`w-3 h-3 ${color}`} />
                            <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">{label}</span>
                          </div>
                          <p className={`text-sm font-mono font-semibold ${color}`}>{value}</p>
                        </div>
                      ))}
                    </div>

                    <AuthBadge auth={ep.auth} />
                  </div>
                </div>

                {/* ── REQUEST ── */}
                <div>
                  <SectionHeading label="Request" />

                  {ep.auth !== 'none' && (
                    <div className="rounded-xl border border-white/[0.07] overflow-hidden mb-4">
                      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.05] bg-white/[0.02]">
                        <Lock className="w-3 h-3 text-gray-600" />
                        <span className="text-xs font-mono text-gray-500">Authentication</span>
                      </div>
                      <div className="divide-y divide-white/[0.04] bg-[#07080e]">
                        <div className="flex items-center gap-4 px-4 py-3 flex-wrap">
                          <span className="text-[10px] font-mono text-gray-700 w-28 flex-shrink-0">Bearer token</span>
                          <code className="text-xs font-mono text-blue-300">Authorization: Bearer vp_...</code>
                        </div>
                        {ep.auth === 'bearer_or_x402' && (
                          <div className="flex items-center gap-4 px-4 py-3 flex-wrap">
                            <span className="text-[10px] font-mono text-gray-700 w-28 flex-shrink-0">x402 payment</span>
                            <code className="text-xs font-mono text-cyan-300">x402-Payment: {"<base64-signed-payment>"}</code>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {ep.params && ep.params.length > 0 && (
                    <div className="rounded-xl border border-white/[0.07] overflow-hidden mb-4">
                      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.05] bg-white/[0.02]">
                        <AlertCircle className="w-3 h-3 text-gray-600" />
                        <span className="text-xs font-mono text-gray-500">Body parameters</span>
                        <span className="ml-auto text-[10px] font-mono text-gray-700">Click enum fields to expand allowed values</span>
                      </div>
                      <div className="bg-[#07080e]">
                        {ep.params.map((p) => <ParamRow key={p.name} p={p} />)}
                      </div>
                    </div>
                  )}

                  {ep.requestBody
                    ? (
                      <TerminalChrome filename="request.json" label="body · JSON" copyText={ep.requestBody}>
                        <JsonToken text={ep.requestBody} />
                      </TerminalChrome>
                    )
                    : (
                      <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-white/[0.06] text-gray-700 bg-white/[0.01]">
                        <Wifi className="w-3.5 h-3.5" />
                        <span className="text-xs font-mono">No body — GET request</span>
                      </div>
                    )
                  }
                </div>

                {/* ── RESPONSES ── */}
                <div>
                  <SectionHeading label="Responses" />
                  <ResponseTabs responses={ep.responses} />
                </div>

                {/* ── STATUS CODES ── */}
                <div>
                  <SectionHeading label="Status codes" />
                  <div className="rounded-xl overflow-hidden border border-white/[0.07] bg-[#07080e] divide-y divide-white/[0.04]">
                    {[
                      { code: 200,  label: 'OK',                  desc: 'Request succeeded. Verdict returned in body.', color: 'text-emerald-400' },
                      ...(ep.auth === 'bearer_or_x402' ? [{ code: 402, label: 'Payment Required', desc: 'x402: send USDC on Base and retry with payment header.', color: 'text-yellow-300' }] : []),
                      ...(ep.auth === 'bearer' ? [{ code: 401, label: 'Unauthorized', desc: 'Missing or invalid API key. Check Authorization header.', color: 'text-red-400' }] : []),
                      { code: 400,  label: 'Bad Request',         desc: 'Missing required fields or invalid parameter values.',  color: 'text-orange-400' },
                      { code: 500,  label: 'Internal Server Error', desc: 'Unexpected error. Retry with exponential backoff.',     color: 'text-red-400' },
                    ].map((s) => (
                      <div key={s.code} className="flex items-center gap-4 px-4 py-3">
                        <span className={`text-xs font-bold font-mono w-10 flex-shrink-0 ${s.color}`}>{s.code}</span>
                        <span className="text-xs font-mono text-gray-400 w-36 flex-shrink-0">{s.label}</span>
                        <span className="text-xs text-gray-600 leading-relaxed">{s.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── x402 FLOW ── */}
                {ep.badge === 'x402' && (
                  <div>
                    <SectionHeading label="x402 payment flow" />
                    <div className="space-y-2">
                      {[
                        { step: '1', label: 'Send request',            desc: 'Call endpoint with no credentials.', color: 'blue' },
                        { step: '2', label: 'Receive 402',             desc: 'Response includes USDC amount, recipient, and nonce.', color: 'yellow' },
                        { step: '3', label: 'Pay $0.01 USDC on Base', desc: 'Sign and broadcast payment to the given recipient address.', color: 'purple' },
                        { step: '4', label: 'Retry with header',       desc: 'Attach the signed x402-Payment header and resend.', color: 'cyan' },
                        { step: '5', label: 'Receive verdict',         desc: 'Server verifies on-chain. Returns full verified response.', color: 'emerald' },
                      ].map((s) => (
                        <div key={s.step} className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-${s.color}-500/20 bg-${s.color}-500/[0.04]`}>
                          <span className={`w-6 h-6 rounded-full border border-${s.color}-500/30 bg-${s.color}-500/10 flex items-center justify-center text-[10px] font-bold text-${s.color}-400 flex-shrink-0`}>
                            {s.step}
                          </span>
                          <span className="text-white text-sm font-semibold flex-shrink-0">{s.label}</span>
                          <span className="text-gray-500 text-sm">{s.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── CODE EXAMPLES ── */}
                <div>
                  <SectionHeading label="Code examples" />
                  <MultiLangPanel ep={ep} />
                </div>

                {/* ── CTAs ── */}
                <div className="flex flex-wrap gap-3 pb-6">
                  <Link to="/playground" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-all hover:shadow-blue-glow">
                    <Play className="w-4 h-4" /> Try in Playground
                  </Link>
                  <Link to="/get-api-key" className="flex items-center gap-2 px-5 py-2.5 glass-card hover:border-white/15 text-gray-300 hover:text-white font-semibold rounded-xl text-sm transition-all">
                    <Key className="w-4 h-4" /> Get API Key
                  </Link>
                  <Link to="/docs" className="flex items-center gap-2 px-5 py-2.5 glass-card hover:border-white/15 text-gray-300 hover:text-white font-semibold rounded-xl text-sm transition-all">
                    Full Docs <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
