import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, CheckCircle, Clock, ExternalLink, ChevronDown,
  ShieldAlert, Activity, Filter,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// ─── Types ────────────────────────────────────────────────────────────────────

type Chain = 'all' | 'base' | 'ethereum' | 'arbitrum' | 'optimism';
type DetectionType = 'all' | 'stablecoin_peg' | 'bridge_exploit' | 'rpc_health' | 'price_deviation' | 'liquidity';
type Status = 'flagged' | 'resolved';

interface Detection {
  id: string;
  status: Status;
  type: DetectionType;
  chain: Exclude<Chain, 'all'>;
  description: string;
  timestamp: string;
  duration?: string;
  evidenceUrl: string;
}

// ─── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_DETECTIONS: Detection[] = [
  {
    id: 'det-001',
    status: 'flagged',
    type: 'stablecoin_peg',
    chain: 'base',
    description: 'USDT losing value: 0.971 on Base',
    timestamp: '2026-09-03 14:38 UTC',
    evidenceUrl: 'https://api.verifyproceed.com/v1/acp/guard?detection=det-001',
  },
  {
    id: 'det-002',
    status: 'resolved',
    type: 'bridge_exploit',
    chain: 'ethereum',
    description: 'Suspicious withdrawal detected on Native Bridge',
    timestamp: '2026-09-03 11:02 UTC',
    duration: 'Lasted 2h 41m',
    evidenceUrl: 'https://api.verifyproceed.com/v1/acp/guard?detection=det-002',
  },
  {
    id: 'det-003',
    status: 'resolved',
    type: 'rpc_health',
    chain: 'arbitrum',
    description: 'Arbitrum RPC latency exceeded 5s threshold',
    timestamp: '2026-09-03 08:15 UTC',
    duration: 'Lasted 18m',
    evidenceUrl: 'https://api.verifyproceed.com/v1/acp/guard?detection=det-003',
  },
  {
    id: 'det-004',
    status: 'flagged',
    type: 'price_deviation',
    chain: 'base',
    description: 'WETH price 4.1% below oracle on Base DEX',
    timestamp: '2026-09-03 06:44 UTC',
    evidenceUrl: 'https://api.verifyproceed.com/v1/acp/guard?detection=det-004',
  },
  {
    id: 'det-005',
    status: 'resolved',
    type: 'liquidity',
    chain: 'optimism',
    description: 'USDC/ETH pool depth dropped below $50k on Optimism',
    timestamp: '2026-09-02 22:31 UTC',
    duration: 'Lasted 1h 12m',
    evidenceUrl: 'https://api.verifyproceed.com/v1/acp/guard?detection=det-005',
  },
  {
    id: 'det-006',
    status: 'resolved',
    type: 'stablecoin_peg',
    chain: 'ethereum',
    description: 'DAI deviation 0.7% from peg on Ethereum',
    timestamp: '2026-09-02 19:07 UTC',
    duration: 'Lasted 47m',
    evidenceUrl: 'https://api.verifyproceed.com/v1/acp/guard?detection=det-006',
  },
  {
    id: 'det-007',
    status: 'flagged',
    type: 'bridge_exploit',
    chain: 'base',
    description: 'Unverified contract interacting with Base bridge contracts',
    timestamp: '2026-09-02 15:23 UTC',
    evidenceUrl: 'https://api.verifyproceed.com/v1/acp/guard?detection=det-007',
  },
  {
    id: 'det-008',
    status: 'resolved',
    type: 'rpc_health',
    chain: 'base',
    description: 'Base RPC returning intermittent 502 errors',
    timestamp: '2026-09-02 10:55 UTC',
    duration: 'Lasted 33m',
    evidenceUrl: 'https://api.verifyproceed.com/v1/acp/guard?detection=det-008',
  },
  {
    id: 'det-009',
    status: 'resolved',
    type: 'price_deviation',
    chain: 'arbitrum',
    description: 'ARB token price spike 8.3% in 5 minutes on Arbitrum',
    timestamp: '2026-09-01 21:18 UTC',
    duration: 'Lasted 9m',
    evidenceUrl: 'https://api.verifyproceed.com/v1/acp/guard?detection=det-009',
  },
  {
    id: 'det-010',
    status: 'resolved',
    type: 'liquidity',
    chain: 'ethereum',
    description: 'Low liquidity detected on ETH/USDC pair on Uniswap V3',
    timestamp: '2026-09-01 17:42 UTC',
    duration: 'Lasted 3h 5m',
    evidenceUrl: 'https://api.verifyproceed.com/v1/acp/guard?detection=det-010',
  },
];

// ─── Filter config ─────────────────────────────────────────────────────────────

const CHAIN_OPTIONS: { value: Chain; label: string }[] = [
  { value: 'all',       label: 'All Chains' },
  { value: 'base',      label: 'Base' },
  { value: 'ethereum',  label: 'Ethereum' },
  { value: 'arbitrum',  label: 'Arbitrum' },
  { value: 'optimism',  label: 'Optimism' },
];

const TYPE_OPTIONS: { value: DetectionType; label: string }[] = [
  { value: 'all',              label: 'All Types' },
  { value: 'stablecoin_peg',   label: 'Stablecoin Peg' },
  { value: 'bridge_exploit',   label: 'Bridge Exploit' },
  { value: 'rpc_health',       label: 'RPC Health' },
  { value: 'price_deviation',  label: 'Price Deviation' },
  { value: 'liquidity',        label: 'Liquidity' },
];

const TYPE_LABELS: Record<DetectionType, string> = {
  all: 'All Types',
  stablecoin_peg: 'Stablecoin Peg',
  bridge_exploit: 'Bridge Exploit',
  rpc_health: 'RPC Health',
  price_deviation: 'Price Deviation',
  liquidity: 'Liquidity',
};

// ─── Dropdown ──────────────────────────────────────────────────────────────────

function FilterDropdown<T extends string>({
  value, options, onChange, icon,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  icon: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
          open
            ? 'bg-white/[0.07] border-white/[0.15] text-white'
            : 'glass-card border-white/[0.08] text-gray-300 hover:text-white hover:border-white/[0.12]'
        }`}
      >
        {icon}
        <span>{selected?.label}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18 }}>
          <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.97 }}
              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-full left-0 mt-2 w-48 z-40 bg-[#050508]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-2">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { onChange(opt.value); setOpen(false); }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors ${
                      opt.value === value
                        ? 'bg-white/[0.06] text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Detection row ─────────────────────────────────────────────────────────────

function DetectionRow({ detection, index }: { detection: Detection; index: number }) {
  const isFlagged = detection.status === 'flagged';
  const Icon = isFlagged ? AlertTriangle : CheckCircle;
  const iconColor = isFlagged ? 'text-amber-400' : 'text-emerald-400';
  const iconBg = isFlagged ? 'bg-amber-500/10 border-amber-500/25' : 'bg-emerald-500/10 border-emerald-500/25';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="rounded-xl border border-white/[0.07] bg-[#07080e] p-4 sm:p-5 hover:border-white/[0.12] transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          {/* Status icon */}
          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${iconBg}`}>
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>

          {/* Description */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-200 leading-snug">{detection.description}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
              <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wide">
                {TYPE_LABELS[detection.type]}
              </span>
              <span className="text-[10px] font-mono text-gray-700">·</span>
              <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wide">
                {detection.chain}
              </span>
            </div>
          </div>

          {/* Timestamp */}
          <div className="flex items-center gap-1.5 sm:w-40 flex-shrink-0">
            <Clock className="w-3 h-3 text-gray-700 flex-shrink-0" />
            <span className="text-xs font-mono text-gray-500">{detection.timestamp}</span>
          </div>

          {/* Duration (if resolved) */}
          {detection.duration && (
            <div className="flex items-center gap-1.5 sm:w-32 flex-shrink-0">
              <CheckCircle className="w-3 h-3 text-gray-700 flex-shrink-0" />
              <span className="text-xs font-mono text-gray-500">{detection.duration}</span>
            </div>
          )}

          {/* Evidence link */}
          <a
            href={detection.evidenceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors flex-shrink-0"
          >
            evidence
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function DetectionsPage() {
  const [chainFilter, setChainFilter] = useState<Chain>('all');
  const [typeFilter, setTypeFilter] = useState<DetectionType>('all');

  const filtered = useMemo(() => {
    return MOCK_DETECTIONS.filter((d) => {
      if (chainFilter !== 'all' && d.chain !== chainFilter) return false;
      if (typeFilter !== 'all' && d.type !== typeFilter) return false;
      return true;
    });
  }, [chainFilter, typeFilter]);

  const flaggedCount = filtered.filter((d) => d.status === 'flagged').length;
  const resolvedCount = filtered.filter((d) => d.status === 'resolved').length;

  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      <Navbar />

      {/* ── HEADER ── */}
      <section className="relative border-b border-white/[0.06] pt-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-amber-600/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/25 bg-amber-500/[0.06] mb-5"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">Risk Feed</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.07 }}
            className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4"
          >
            Every environment risk VerifyProceed has caught, live and public.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12 }}
            className="text-gray-400 text-base leading-relaxed max-w-xl mx-auto"
          >
            A real-time feed of risk detections from the Risk Oracle. Each entry includes the check type, chain, timestamp, and a link to the full evidence.
          </motion.p>
        </div>
      </section>

      {/* ── FILTERS ── */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-600 uppercase tracking-widest">
            <Filter className="w-3.5 h-3.5" />
            Filter
          </div>
          <FilterDropdown value={chainFilter} options={CHAIN_OPTIONS} onChange={setChainFilter} icon={<Activity className="w-3.5 h-3.5 text-gray-500" />} />
          <FilterDropdown value={typeFilter} options={TYPE_OPTIONS} onChange={setTypeFilter} icon={<ShieldAlert className="w-3.5 h-3.5 text-gray-500" />} />

          {/* Counts */}
          <div className="flex items-center gap-3 sm:ml-auto">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-amber-400">
              <AlertTriangle className="w-3 h-3" />
              {flaggedCount} flagged
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
              <CheckCircle className="w-3 h-3" />
              {resolvedCount} resolved
            </span>
          </div>
        </div>
      </section>

      {/* ── DETECTIONS LIST ── */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${chainFilter}-${typeFilter}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-3 mt-2"
          >
            {filtered.length > 0 ? (
              filtered.map((d, i) => (
                <DetectionRow key={d.id} detection={d} index={i} />
              ))
            ) : (
              <div className="text-center py-16">
                <ShieldAlert className="w-8 h-8 text-gray-700 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No detections match the current filters.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/docs"
            className="inline-flex items-center gap-2 px-5 py-2.5 glass-card hover:border-white/15 text-gray-300 hover:text-white font-semibold rounded-xl text-sm transition-all"
          >
            Read the Docs
          </Link>
          <Link
            to="/api-reference"
            className="inline-flex items-center gap-2 px-5 py-2.5 glass-card hover:border-white/15 text-gray-300 hover:text-white font-semibold rounded-xl text-sm transition-all"
          >
            API Reference
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
