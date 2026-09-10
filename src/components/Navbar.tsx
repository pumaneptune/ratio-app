import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  Shield, Menu, X, ChevronRight, ExternalLink, ChevronDown,
  Zap, BookOpen, Play, FileText, Package, History, Code2, Scale,
  ListChecks, Activity,
} from 'lucide-react';

type NavLink = { label: string; to: string; external?: boolean };

const mainLinks: NavLink[] = [
  { label: 'Docs',            to: '/docs' },
  { label: 'API Reference',   to: '/api-reference' },
  { label: 'Playground',      to: '/playground' },
  { label: 'Detections',      to: '/detections' },
  { label: 'Use Cases',       to: '/use-cases' },
  { label: 'Marketplace Kit', to: '/marketplace-kit' },
  { label: 'Pricing',         to: '/pricing' },
];

const evaluatorItems = [
  { icon: Scale,      label: 'Overview',    sub: 'The neutral referee for on-chain work', to: '/evaluator' },
  { icon: BookOpen,   label: 'How to use it', sub: 'Step-by-step setup guide',            to: '/evaluator/how-to' },
  { icon: ListChecks, label: 'What we check', sub: 'Checks grouped by job type',          to: '/evaluator/checks' },
  { icon: Activity,   label: 'Rulings',     sub: 'Live feed of evaluator rulings',      to: '/evaluator/rulings' },
];

const dropdownItems = [
  { icon: Zap,      label: 'Quick Start',       sub: '5 min to first call',        to: '/docs/quickstart' },
  { icon: Code2,    label: 'API Reference',      sub: 'Full REST docs',             to: '/api-reference' },
  { icon: Play,     label: 'Playground',         sub: 'Fire live requests',         to: '/playground' },
  { icon: FileText, label: 'Use Cases',           sub: '9 integration patterns',     to: '/use-cases' },
  { icon: Package,  label: 'Marketplace Kit',    sub: 'Agent listing resources',    to: '/marketplace-kit' },
  { icon: Scale,    label: 'ACP Evaluator',       sub: 'Neutral third-party rulings', to: '/evaluator' },
  { icon: ListChecks, label: 'Evaluator Checks', sub: 'What gets verified by job type', to: '/evaluator/checks' },
  { icon: History,  label: 'Changelog',          sub: 'Releases and updates',       to: '/changelog' },
  { icon: BookOpen, label: 'OpenAPI Spec',        sub: 'Download / import',          to: '/openapi.json', external: true },
];

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [dropOpen, setDropOpen]       = useState(false);
  const [evalDropOpen, setEvalDropOpen] = useState(false);
  const dropRef                       = useRef<HTMLDivElement>(null);
  const evalDropRef                   = useRef<HTMLDivElement>(null);
  const location                      = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropOpen(false);
    setEvalDropOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
      if (evalDropRef.current && !evalDropRef.current.contains(e.target as Node)) {
        setEvalDropOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  const developerActive = dropdownItems.some(
    (d) => !d.external && location.pathname.startsWith(d.to)
  );

  const evaluatorActive = location.pathname.startsWith('/evaluator');

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#050508]/90 backdrop-blur-xl border-b border-white/[0.06]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center group-hover:border-blue-400/50 transition-colors">
              <Shield className="w-4 h-4 text-blue-400" />
            </div>
            <span className="font-bold text-white text-sm tracking-tight">VerifyProceed</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {mainLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`relative px-3.5 py-2 text-sm rounded-lg transition-all duration-150 whitespace-nowrap ${
                  isActive(link.to)
                    ? 'text-white bg-white/[0.07]'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400" />
                )}
              </Link>
            ))}

            {/* Evaluator dropdown */}
            <div className="relative" ref={evalDropRef}>
              <button
                onClick={() => setEvalDropOpen((o) => !o)}
                className={`flex items-center gap-1 px-3.5 py-2 text-sm rounded-lg transition-all duration-150 ${
                  evaluatorActive || evalDropOpen
                    ? 'text-white bg-white/[0.07]'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
                }`}
              >
                Evaluator
                <motion.span animate={{ rotate: evalDropOpen ? 180 : 0 }} transition={{ duration: 0.18 }}>
                  <ChevronDown className="w-3.5 h-3.5" />
                </motion.span>
              </button>

              <AnimatePresence>
                {evalDropOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.97 }}
                    transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full right-0 mt-2 w-64 bg-[#050508]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden"
                  >
                    <div className="p-2">
                      {evaluatorItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link key={item.label} to={item.to}>
                            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.05] transition-colors group/item">
                              <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center flex-shrink-0">
                                <Icon className="w-3.5 h-3.5 text-emerald-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-200 group-hover/item:text-white transition-colors">{item.label}</div>
                                <div className="text-[10px] text-gray-600">{item.sub}</div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Developer dropdown */}
            <div className="relative" ref={dropRef}>
              <button
                onClick={() => setDropOpen((o) => !o)}
                className={`flex items-center gap-1 px-3.5 py-2 text-sm rounded-lg transition-all duration-150 ${
                  developerActive || dropOpen
                    ? 'text-white bg-white/[0.07]'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
                }`}
              >
                Developers
                <motion.span animate={{ rotate: dropOpen ? 180 : 0 }} transition={{ duration: 0.18 }}>
                  <ChevronDown className="w-3.5 h-3.5" />
                </motion.span>
              </button>

              <AnimatePresence>
                {dropOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.97 }}
                    transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full right-0 mt-2 w-64 bg-[#050508]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden"
                  >
                    <div className="p-2">
                      {dropdownItems.map((item) => {
                        const Icon = item.icon;
                        const inner = (
                          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.05] transition-colors group/item">
                            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center flex-shrink-0">
                              <Icon className="w-3.5 h-3.5 text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-200 group-hover/item:text-white transition-colors">{item.label}</div>
                              <div className="text-[10px] text-gray-600">{item.sub}</div>
                            </div>
                            {item.external && <ExternalLink className="w-3 h-3 text-gray-700 flex-shrink-0" />}
                          </div>
                        );
                        return item.external ? (
                          <a key={item.label} href={item.to} target="_blank" rel="noopener noreferrer">
                            {inner}
                          </a>
                        ) : (
                          <Link key={item.label} to={item.to}>
                            {inner}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.05]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              <span className="text-[10px] font-mono text-emerald-400">Live · Base</span>
            </div>
            <a
              href="https://github.com/verifyproceed"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              GitHub
            </a>
            <Link
              to="/get-api-key"
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all duration-200 hover:shadow-blue-glow active:scale-[0.98]"
            >
              Get API Key
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-[#050508]/95 backdrop-blur-xl border-b border-white/[0.06] overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {mainLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`block w-full text-left px-4 py-3 text-sm rounded-lg transition-all ${
                    isActive(link.to)
                      ? 'text-white bg-white/[0.07]'
                      : 'text-gray-300 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Evaluator links in mobile */}
              <div className="pt-2 pb-1">
                <p className="px-4 text-[10px] font-mono text-gray-700 uppercase tracking-widest mb-1">Evaluator</p>
                {evaluatorItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`block w-full text-left px-4 py-2.5 text-sm rounded-lg transition-all ${
                      isActive(item.to)
                        ? 'text-white bg-white/[0.07]'
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Developer links in mobile */}
              <div className="pt-2 pb-1">
                <p className="px-4 text-[10px] font-mono text-gray-700 uppercase tracking-widest mb-1">Developers</p>
                {dropdownItems.map((item) =>
                  item.external ? (
                    <a
                      key={item.label}
                      href={item.to}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/[0.05] rounded-lg transition-all"
                    >
                      {item.label}
                      <ExternalLink className="w-3 h-3 opacity-40 ml-auto" />
                    </a>
                  ) : (
                    <Link
                      key={item.label}
                      to={item.to}
                      className={`block w-full text-left px-4 py-2.5 text-sm rounded-lg transition-all ${
                        isActive(item.to)
                          ? 'text-white bg-white/[0.07]'
                          : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </div>

              <div className="pt-3 border-t border-white/[0.06]">
                <Link
                  to="/get-api-key"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-all"
                >
                  Get API Key — Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
