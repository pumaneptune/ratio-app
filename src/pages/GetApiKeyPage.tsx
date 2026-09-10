import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { API_BASE_URL, ENDPOINTS } from '../lib/api';
import {
  Key, Check, ArrowRight, Shield, Zap, Terminal, Building2,
  Copy, ChevronRight, Lock, AlertCircle, ExternalLink,
  CheckCircle, Code, CreditCard,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 'form' | 'submitting' | 'success';

interface FormData {
  full_name: string;
  email: string;
  company: string;
  use_case: string;
  description: string;
}

interface ApiResult {
  ok: boolean;
  message: string;
  api_key: string;
  plan?: string;
  monthly_limit?: number;
  is_existing?: boolean;
  base_url?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const USE_CASES = [
  { value: 'defi-agent',   label: 'DeFi agent / trading bot' },
  { value: 'bridge',       label: 'Bridge / cross-chain automation' },
  { value: 'portfolio',    label: 'Portfolio management' },
  { value: 'risk-monitor', label: 'Risk monitoring & alerting' },
  { value: 'research',     label: 'Research / prototyping' },
  { value: 'enterprise',   label: 'Enterprise integration' },
  { value: 'other',        label: 'Other' },
];

const BENEFITS = [
  {
    icon: Zap,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    title: '100 free requests / month',
    desc: 'No credit card. No payment setup. Just a key.',
  },
  {
    icon: Shield,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    title: 'Full API access',
    desc: 'Guard, Decide, Capabilities, and Agents endpoints included.',
  },
  {
    icon: CreditCard,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    title: 'x402 on ACP endpoints',
    desc: 'Your key works alongside x402 on ACP endpoints. Pay $0.01 USDC per call without any quota.',
  },
  {
    icon: Terminal,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
    title: 'curl / fetch / any HTTP client',
    desc: 'No SDK required. Works with any language or HTTP client.',
  },
];

const ENDPOINT_PREVIEW = `POST /v1/api-keys/signup HTTP/1.1
Host: decision-verification-agent.onrender.com
Content-Type: application/json

{
  "full_name": "...",
  "email": "...",
  "company": "...",
  "use_case": "...",
  "requested_plan": "Free"
}`;

const ONBOARDING_STEPS = [
  { n: '01', title: 'Get your key',    desc: 'Fill out the form. Key is issued instantly.' },
  { n: '02', title: 'Set env variable', desc: 'export VP_API_KEY=vp_...' },
  { n: '03', title: 'First call',      desc: 'POST /v1/acp/guard with Authorization header.' },
  { n: '04', title: 'Go to production',desc: 'Upgrade to pay-per-call via x402 automatically.' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-card hover:border-white/20 text-gray-500 hover:text-white transition-all text-xs font-medium"
    >
      {copied
        ? <><Check className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400">Copied</span></>
        : <><Copy className="w-3.5 h-3.5" />{label ?? 'Copy'}</>
      }
    </button>
  );
}

function InputField({
  label, id, type = 'text', placeholder, value, onChange, required, hint,
}: {
  label: string; id: string; type?: string; placeholder?: string;
  value: string; onChange: (v: string) => void; required?: boolean; hint?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-mono text-gray-500 uppercase tracking-widest">
          {label} {required && <span className="text-blue-500">*</span>}
        </label>
        {hint && <span className="text-[10px] text-gray-700">{hint}</span>}
      </div>
      <div className={`relative rounded-xl border transition-all duration-150 ${
        focused ? 'border-blue-500/50 bg-blue-500/[0.03]' : 'border-white/[0.08] bg-white/[0.03]'
      }`}>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder-gray-700 outline-none"
        />
        {focused && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
        )}
      </div>
    </div>
  );
}

// ─── Animated key reveal ──────────────────────────────────────────────────────

function KeyReveal({ apiKey, isExisting }: { apiKey: string; isExisting: boolean }) {
  const [revealed, setRevealed] = useState(false);
  const masked = apiKey.slice(0, 8) + '•'.repeat(apiKey.length - 12) + apiKey.slice(-4);

  return (
    <div className="rounded-xl border border-blue-500/25 bg-gradient-to-br from-blue-500/[0.06] to-transparent overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-blue-500/15 bg-blue-500/[0.04]">
        <div className="flex items-center gap-2">
          <Key className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs font-mono text-blue-300 font-semibold">Your API Key</span>
          {isExisting && (
            <span className="text-[10px] font-mono text-gray-500 px-2 py-0.5 glass-card rounded">existing key</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRevealed(!revealed)}
            className="text-[10px] font-mono text-gray-500 hover:text-gray-300 transition-colors px-2 py-1 glass-card rounded"
          >
            {revealed ? 'hide' : 'reveal'}
          </button>
          <CopyButton text={apiKey} label="Copy key" />
        </div>
      </div>
      <div className="px-4 py-4">
        <AnimatePresence mode="wait">
          <motion.code
            key={revealed ? 'shown' : 'masked'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="text-sm font-mono text-blue-200 break-all leading-relaxed"
          >
            {revealed ? apiKey : masked}
          </motion.code>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Typing animation for terminal ───────────────────────────────────────────

function TypingText({ text, speed = 18 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const id = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return (
    <span>
      {displayed}
      <span className="animate-pulse text-blue-400">▋</span>
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function GetApiKeyPage() {
  const [step, setStep] = useState<Step>('form');
  const [error, setError] = useState('');
  const [result, setResult] = useState<ApiResult | null>(null);
  const [form, setForm] = useState<FormData>({
    full_name: '', email: '', company: '', use_case: '', description: '',
  });
  const successRef = useRef<HTMLDivElement>(null);

  const update = (k: keyof FormData) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.use_case) return;
    setError('');
    setStep('submitting');

    try {
      const res = await fetch(
        ENDPOINTS.API_KEY_SIGNUP,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: form.full_name,
            email: form.email,
            company: form.company,
            use_case: form.use_case,
            requested_plan: 'Free',
          }),
        }
      );
      const data: ApiResult = await res.json().catch(() => {
        throw new Error('Server returned an unreadable response. Please try again.');
      });
      if (!res.ok || !data.ok) {
        throw new Error(data.message ?? `Request failed (${res.status}). Please try again.`);
      }
      setResult(data);
      setStep('success');
      setTimeout(() => successRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      const isNetwork = err instanceof TypeError && err.message.toLowerCase().includes('fetch');
      setError(isNetwork ? 'Network error — could not reach the API. Check your connection and try again.' : msg);
      setStep('form');
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <div className="relative border-b border-white/[0.06] pt-16">
        <div className="absolute inset-0 grid-bg opacity-15" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-blue-600/[0.06] rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="section-label mb-4">
              <Key className="w-3.5 h-3.5" /> API Access
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
              className="text-5xl sm:text-6xl font-bold text-white tracking-tight leading-[1.04] mb-5"
            >
              Start building.<br />
              <span className="text-gradient-blue">Ship in minutes.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.13 }}
              className="text-xl text-gray-400 leading-relaxed mb-8 max-w-xl"
            >
              Get instant access to the ACP API. 100 free requests per month, no credit card, no subscriptions. Just build.
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}
              className="flex flex-wrap gap-2">
              {[
                { label: 'Free tier included', color: 'text-emerald-400 border-emerald-500/25 bg-emerald-500/[0.06]' },
                { label: 'Instant key delivery', color: 'text-blue-400 border-blue-500/25 bg-blue-500/[0.06]' },
                { label: 'x402 ready', color: 'text-purple-400 border-purple-500/25 bg-purple-500/[0.06]' },
              ].map((b) => (
                <span key={b.label} className={`text-xs font-mono px-3 py-1.5 rounded-full border ${b.color}`}>{b.label}</span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-[1fr_480px] gap-16 items-start">

          {/* ── LEFT: info panels ─────────────────────────────────────── */}
          <div className="space-y-10">

            {/* Benefits grid */}
            <div>
              <h2 className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-5">What you get</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {BENEFITS.map((b) => {
                  const Icon = b.icon;
                  return (
                    <motion.div
                      key={b.title}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl border ${b.bg}`}
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${b.bg}`}>
                          <Icon className={`w-3.5 h-3.5 ${b.color}`} />
                        </div>
                        <span className="text-white font-semibold text-sm">{b.title}</span>
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Tiers */}
            <div>
              <h2 className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-5">Plans</h2>
              <div className="space-y-2">
                {[
                  {
                    name: 'Free',
                    tag: 'No card required',
                    tagColor: 'text-emerald-400 border-emerald-500/25',
                    price: '$0',
                    unit: '100 calls / month',
                    features: ['100 requests / month', 'No card required', 'API key access', 'Public endpoints', 'Basic verification'],
                    highlight: false,
                  },
                  {
                    name: 'Pay-per-call',
                    tag: 'Machine-native',
                    tagColor: 'text-blue-400 border-blue-500/30',
                    price: '$0.01',
                    unit: 'per request · USDC on Base',
                    features: ['No subscriptions required', 'No billing portal', 'Paid via x402 automatically', 'Designed for autonomous agents'],
                    highlight: true,
                  },
                  {
                    name: 'Enterprise',
                    tag: 'Infrastructure',
                    tagColor: 'text-gray-400 border-white/[0.08]',
                    price: 'Custom',
                    unit: 'volume pricing',
                    features: ['Custom verification policies', 'Dedicated deployments', 'SLA support', 'Integration support'],
                    highlight: false,
                  },
                ].map((plan) => (
                  <div
                    key={plan.name}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      plan.highlight
                        ? 'border-blue-500/30 bg-blue-500/[0.05]'
                        : 'border-white/[0.06] bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-white font-semibold text-sm">{plan.name}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${plan.tagColor}`}>{plan.tag}</span>
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                          {plan.features.map((f) => (
                            <span key={f} className="text-xs text-gray-600 flex items-center gap-1">
                              <Check className="w-2.5 h-2.5 text-gray-700" />{f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className={`font-bold text-lg ${plan.highlight ? 'text-white' : 'text-gray-400'}`}>{plan.price}</p>
                      {plan.unit && <p className="text-xs text-gray-600">{plan.unit}</p>}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-700 mt-3">
                Free tier is permanent. Pay-per-call activates automatically when your free quota is exceeded.{' '}
                <Link to="/pricing" className="text-gray-500 hover:text-gray-300 underline underline-offset-2 transition-colors">
                  Full pricing →
                </Link>
              </p>
            </div>

            {/* Signup endpoint preview */}
            <div>
              <h2 className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-5">Key signup endpoint</h2>
              <div className="rounded-xl border border-white/[0.07] overflow-hidden bg-[#07080e]">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.05] bg-white/[0.02]">
                  <div className="flex items-center gap-2.5">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500/50" />
                      <span className="w-2 h-2 rounded-full bg-yellow-500/50" />
                      <span className="w-2 h-2 rounded-full bg-emerald-500/50" />
                    </div>
                    <span className="text-xs font-mono text-gray-600">POST /functions/v1/api-key-signup</span>
                  </div>
                  <CopyButton text={ENDPOINT_PREVIEW} />
                </div>
                <pre className="px-4 py-4 text-xs font-mono text-gray-400 leading-6 overflow-x-auto">{ENDPOINT_PREVIEW}</pre>
              </div>
              <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                Free signup — submit your email, name, and use case. Key is provisioned instantly. See the{' '}
                <Link to="/docs" className="text-gray-500 hover:text-gray-300 underline underline-offset-2 transition-colors">API docs</Link>.
              </p>
            </div>

            {/* Onboarding steps */}
            <div>
              <h2 className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-5">What happens next</h2>
              <div className="relative pl-6 space-y-5 border-l border-white/[0.06]">
                {ONBOARDING_STEPS.map((s, i) => (
                  <motion.div
                    key={s.n}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                    className="relative"
                  >
                    <div className="absolute -left-[1.5625rem] w-3 h-3 rounded-full bg-[#050508] border border-white/[0.12] flex items-center justify-center">
                      <span className="w-1 h-1 rounded-full bg-blue-500" />
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-[10px] font-mono text-blue-500 font-bold flex-shrink-0">{s.n}</span>
                      <div>
                        <p className="text-white font-semibold text-sm">{s.title}</p>
                        <p className="text-gray-600 text-xs mt-0.5 font-mono">{s.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>

          {/* ── RIGHT: form / success ─────────────────────────────────── */}
          <div className="lg:sticky lg:top-24">
            <AnimatePresence mode="wait">

              {/* ── FORM ── */}
              {(step === 'form' || step === 'submitting') && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Terminal preview card */}
                  <div className="rounded-xl border border-white/[0.07] overflow-hidden bg-[#07080e] mb-5">
                    <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-white/[0.05] bg-white/[0.02]">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500/50" />
                        <span className="w-2 h-2 rounded-full bg-yellow-500/50" />
                        <span className="w-2 h-2 rounded-full bg-emerald-500/50" />
                      </div>
                      <span className="text-xs font-mono text-gray-600">terminal</span>
                      <span className="ml-auto flex items-center gap-1.5 text-[10px] font-mono text-emerald-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        live
                      </span>
                    </div>
                    <div className="px-4 py-3 text-xs font-mono text-gray-500 min-h-[52px] flex items-center">
                      {step === 'submitting' ? (
                        <TypingText text="→ POST /v1/api-keys/signup — issuing key..." speed={22} />
                      ) : form.email ? (
                        <span className="text-gray-400">
                          → Ready to issue key for{' '}
                          <span className="text-blue-300">{form.email}</span>
                        </span>
                      ) : (
                        <span className="text-gray-700">→ Fill in the form to request access...</span>
                      )}
                    </div>
                  </div>

                  {/* Form card */}
                  <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-white/[0.09] bg-white/[0.02] backdrop-blur-sm overflow-hidden"
                  >
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-white/[0.06]">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                          <Key className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <h2 className="text-white font-bold text-base">Request API access</h2>
                          <p className="text-gray-500 text-xs">Free tier — instant key delivery</p>
                        </div>
                        <div className="ml-auto">
                          <span className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500">
                            <Lock className="w-2.5 h-2.5" /> TLS 1.3
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Fields */}
                    <div className="px-6 py-5 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 sm:col-span-1">
                          <InputField
                            id="full_name" label="Full name" required
                            placeholder="Ada Lovelace"
                            value={form.full_name} onChange={update('full_name')}
                          />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <InputField
                            id="email" label="Work email" type="email" required
                            placeholder="ada@company.com"
                            value={form.email} onChange={update('email')}
                          />
                        </div>
                      </div>

                      <InputField
                        id="company" label="Company / project"
                        placeholder="Acme Labs (optional)"
                        value={form.company} onChange={update('company')}
                      />

                      <div className="space-y-1.5">
                        <label htmlFor="use_case" className="text-xs font-mono text-gray-500 uppercase tracking-widest block">
                          Use case <span className="text-blue-500">*</span>
                        </label>
                        <div className={`rounded-xl border transition-all duration-150 ${
                          form.use_case ? 'border-blue-500/40 bg-blue-500/[0.03]' : 'border-white/[0.08] bg-white/[0.03]'
                        }`}>
                          <select
                            id="use_case"
                            required
                            value={form.use_case}
                            onChange={(e) => update('use_case')(e.target.value)}
                            className="w-full bg-transparent px-4 py-3 text-sm text-white outline-none appearance-none"
                          >
                            <option value="" disabled className="bg-[#0a0a12] text-gray-500">Select your primary use case</option>
                            {USE_CASES.map((uc) => (
                              <option key={uc.value} value={uc.value} className="bg-[#0a0a12]">{uc.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label htmlFor="description" className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                            What are you building?
                          </label>
                          <span className="text-[10px] text-gray-700">optional</span>
                        </div>
                        <textarea
                          id="description"
                          rows={3}
                          placeholder="Brief description of your agent or integration..."
                          value={form.description}
                          onChange={(e) => update('description')(e.target.value)}
                          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-gray-700 outline-none focus:border-blue-500/40 focus:bg-blue-500/[0.03] transition-all resize-none"
                        />
                      </div>

                      {/* Error */}
                      <AnimatePresence>
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/[0.06] border border-red-500/25"
                          >
                            <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-red-300">{error}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={step === 'submitting' || !form.full_name || !form.email || !form.use_case}
                        className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-all duration-200 hover:shadow-blue-glow active:scale-[0.98]"
                      >
                        {step === 'submitting' ? (
                          <>
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Issuing key...
                          </>
                        ) : (
                          <>
                            <Key className="w-4 h-4" />
                            Get API Key
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-white/[0.05] bg-white/[0.01] flex items-center justify-between">
                      <p className="text-[11px] text-gray-700">
                        By continuing you agree to our{' '}
                        <Link to="/terms" className="text-gray-500 hover:text-white transition-colors underline underline-offset-2">Terms</Link>
                        {' & '}
                        <Link to="/privacy" className="text-gray-500 hover:text-white transition-colors underline underline-offset-2">Privacy</Link>
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-700">
                        <Shield className="w-2.5 h-2.5" /> Encrypted
                      </div>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* ── SUCCESS ── */}
              {step === 'success' && result && (
                <motion.div
                  key="success"
                  ref={successRef}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-4"
                >
                  {/* Success header */}
                  <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.04] overflow-hidden">
                    <div className="px-6 py-5 border-b border-emerald-500/15">
                      <div className="flex items-start gap-3">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                          className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0"
                        >
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-bold">
                            {result.is_existing ? 'Existing key retrieved.' : "You're in."}
                          </p>
                          <p className="text-emerald-300/70 text-sm mt-0.5 leading-relaxed">
                            {result.message}
                          </p>
                        </div>
                        <div className="flex-shrink-0 flex flex-col items-end gap-1">
                          <span className="text-[10px] font-mono text-gray-700 px-2 py-0.5 rounded border border-white/[0.07] bg-white/[0.02]">
                            {result.plan ?? 'Free'}
                          </span>
                          {result.monthly_limit && (
                            <span className="text-[10px] font-mono text-gray-600">
                              {result.monthly_limit} req / mo
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Key reveal */}
                    <div className="px-6 py-5 space-y-4">
                      <KeyReveal apiKey={result.api_key} isExisting={result.is_existing ?? false} />

                      <div className="space-y-2">
                        {[
                          'Store in an environment variable (VP_API_KEY)',
                          'Never commit to version control or client-side code',
                          'Contact us to rotate or revoke your key at any time',
                        ].map((tip) => (
                          <div key={tip} className="flex items-start gap-2 text-xs text-gray-500">
                            <Check className="w-3.5 h-3.5 text-emerald-500/60 flex-shrink-0 mt-px" />
                            {tip}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quick start */}
                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
                    <div className="px-5 py-4 border-b border-white/[0.05]">
                      <p className="text-xs font-mono text-gray-600 uppercase tracking-widest">Quick start</p>
                    </div>
                    <div className="p-5 space-y-3">
                      {[
                        { step: '1', code: `export VP_API_KEY=${result.api_key.slice(0, 14)}...`, label: 'Set env var' },
                        { step: '2', code: `curl -X POST ${API_BASE_URL}/v1/acp/guard \\`, label: 'Call' },
                        { step: '3', code: `  -H "Authorization: Bearer $VP_API_KEY" \\`, label: '' },
                        { step: '4', code: `  -d '{"action":"bridge","chain":"base"}'`, label: 'First call' },
                      ].map((item) => (
                        <div key={item.step} className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full bg-blue-500/15 border border-blue-500/25 text-[10px] font-bold text-blue-400 flex items-center justify-center flex-shrink-0">
                            {item.step}
                          </span>
                          <code className="flex-1 text-xs font-mono text-gray-400 bg-white/[0.03] px-3 py-1.5 rounded-lg truncate">
                            {item.code}
                          </code>
                          <CopyButton text={item.code} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Next step CTAs */}
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/docs"
                      className="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-all hover:shadow-blue-glow">
                      Read Docs <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link to="/playground"
                      className="flex items-center justify-center gap-2 py-3 glass-card hover:border-white/15 text-gray-300 hover:text-white font-semibold rounded-xl text-sm transition-all">
                      <Terminal className="w-4 h-4" /> Playground
                    </Link>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-700 pt-1">
                    <span>Need more? See{' '}
                      <Link to="/pricing" className="text-gray-500 hover:text-white transition-colors underline underline-offset-2">pricing</Link>
                      {' '}or{' '}
                      <Link to="/contact" className="text-gray-500 hover:text-white transition-colors underline underline-offset-2">contact us</Link>.
                    </span>
                    <a href="https://github.com/verifyproceed" target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-gray-700 hover:text-gray-400 transition-colors">
                      GitHub <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* ── SOCIAL PROOF BAR ─────────────────────────────────────────── */}
      <div className="border-t border-white/[0.05] bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {[
              { icon: Code,       label: 'curl / fetch / any client', sub: 'No SDK required' },
              { icon: Zap,        label: 'x402 native',    sub: 'Machine payments' },
              { icon: Building2,  label: 'Base mainnet',   sub: 'USDC settlement' },
              { icon: Shield,     label: 'TLS 1.3',        sub: 'Encrypted in transit' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-gray-700" />
                <div>
                  <p className="text-sm font-medium text-gray-400">{label}</p>
                  <p className="text-xs text-gray-700">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
