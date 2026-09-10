import { motion, AnimatePresence } from 'framer-motion';

export type SystemStatus = 'operational' | 'degraded' | 'down';

interface StatusConfig {
  dotClass: string;
  textClass: string;
  borderClass: string;
  bgClass: string;
  label: string;
  ping: boolean;
}

const STATUS_CONFIG: Record<SystemStatus, StatusConfig> = {
  operational: {
    dotClass: 'bg-emerald-400',
    textClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/25',
    bgClass: 'bg-emerald-500/[0.06]',
    label: 'All systems operational',
    ping: true,
  },
  degraded: {
    dotClass: 'bg-amber-400',
    textClass: 'text-amber-400',
    borderClass: 'border-amber-500/25',
    bgClass: 'bg-amber-500/[0.06]',
    label: 'Degraded performance',
    ping: true,
  },
  down: {
    dotClass: 'bg-red-400',
    textClass: 'text-red-400',
    borderClass: 'border-red-500/25',
    bgClass: 'bg-red-500/[0.06]',
    label: 'Service disruption',
    ping: false,
  },
};

export default function StatusBadge({ status = 'operational' }: { status?: SystemStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.borderClass} ${config.bgClass} backdrop-blur-sm`}>
      <span className="relative flex h-2 w-2">
        {config.ping && (
          <AnimatePresence>
            <motion.span
              initial={{ opacity: 0.5, scale: 1 }}
              animate={{ opacity: 0, scale: 2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
              className={`absolute inline-flex h-full w-full rounded-full ${config.dotClass}`}
            />
          </AnimatePresence>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dotClass}`} />
      </span>
      <span className={`text-xs font-mono font-semibold tracking-wide ${config.textClass}`}>
        {config.label}
      </span>
    </div>
  );
}
