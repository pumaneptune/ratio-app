import { Link } from 'react-router-dom';
import { Shield, ExternalLink, Zap, Server, Lock, Cpu, Globe, Mail } from 'lucide-react';
import StatusBadge from './StatusBadge';

type FooterLink = { label: string; to: string; external?: boolean };

const footerLinks: Record<string, FooterLink[]> = {
  Developers: [
    { label: 'Quick Start',       to: '/docs/quickstart' },
    { label: 'API Reference',     to: '/api-reference' },
    { label: 'Playground',        to: '/playground' },
    { label: 'Use Cases',         to: '/use-cases' },
    { label: 'Marketplace Kit',   to: '/marketplace-kit' },
    { label: 'ACP Evaluator',      to: '/evaluator' },
    { label: 'How to use it',      to: '/evaluator/how-to' },
    { label: 'What we check',      to: '/evaluator/checks' },
    { label: 'Evaluator Rulings', to: '/evaluator/rulings' },
    { label: 'Detections',        to: '/detections' },
    { label: 'Changelog',         to: '/changelog' },
    { label: 'OpenAPI Spec',      to: '/openapi.json', external: true },
  ],
  Products: [
    { label: 'Guard API',       to: '/api' },
    { label: 'Decide API',      to: '/api' },
    { label: 'x402 Payments',   to: '/docs' },
    { label: 'Pricing',         to: '/pricing' },
  ],
  Company: [
    { label: 'About',         to: '/about' },
    { label: 'Contact',       to: '/contact' },
    { label: 'GitHub',        to: 'https://github.com/verifyproceed', external: true },
    { label: 'Twitter / X',   to: 'https://x.com/proceedapi', external: true },
  ],
  Legal: [
    { label: 'Terms of Service', to: '/terms' },
    { label: 'Privacy Policy',   to: '/privacy' },
    { label: 'Acceptable Use',   to: '/terms#acceptable-use' },
  ],
};

const TRUST_BADGES = [
  {
    icon: Server,
    label: 'Base Mainnet',
    sub: 'USDC settlement · chain_id 8453',
    color: 'text-blue-400',
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/[0.05]',
  },
  {
    icon: Shield,
    label: 'USDC',
    sub: 'Native stablecoin payments',
    color: 'text-emerald-400',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/[0.05]',
  },
  {
    icon: Zap,
    label: 'x402 Enabled',
    sub: 'Machine-native HTTP payments',
    color: 'text-cyan-400',
    border: 'border-cyan-500/20',
    bg: 'bg-cyan-500/[0.05]',
  },
  {
    icon: Cpu,
    label: 'ACP Compatible',
    sub: 'Coinbase agent protocol',
    color: 'text-sky-400',
    border: 'border-sky-500/20',
    bg: 'bg-sky-500/[0.05]',
  },
  {
    icon: Globe,
    label: 'Virtuals ACP Listed',
    sub: 'Registered agent service',
    color: 'text-teal-400',
    border: 'border-teal-500/20',
    bg: 'bg-teal-500/[0.05]',
  },
  {
    icon: Lock,
    label: 'TLS 1.3',
    sub: 'All traffic encrypted',
    color: 'text-gray-400',
    border: 'border-gray-500/20',
    bg: 'bg-gray-500/[0.05]',
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#050508]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Trust strip */}
        <div className="py-6 border-b border-white/[0.05]">
          <div className="flex flex-wrap gap-3 items-center justify-center sm:justify-start">
            {TRUST_BADGES.map(({ icon: Icon, label, sub, color, border, bg }) => (
              <div key={label}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border ${bg} ${border}`}>
                <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${color}`} />
                <div>
                  <p className={`text-[10px] font-semibold font-mono ${color}`}>{label}</p>
                  <p className="text-[9px] text-gray-700">{sub}</p>
                </div>
              </div>
            ))}

            {/* Live status — pushed right on larger screens */}
            <div className="sm:ml-auto">
              <StatusBadge status="operational" />
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12 py-14">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-400" />
              </div>
              <span className="font-bold text-white text-sm tracking-tight">VerifyProceed</span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed mb-5">
              Verification infrastructure for AI agents. Machine-payable APIs for autonomous systems. Built on Base.
            </p>

            {/* Infrastructure reliability note */}
            <div className="mb-5 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <p className="text-[10px] font-mono text-gray-700 uppercase tracking-widest mb-1.5">Infrastructure</p>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Pay-per-call tier: best-effort availability.<br />
                Settlement: Base Mainnet · USDC.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://x.com/proceedapi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-lg glass-card hover:border-white/20 transition-all text-gray-500 hover:text-white text-xs font-bold"
              >
                X
              </a>
              <a
                href="https://github.com/verifyproceed"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-lg glass-card hover:border-white/20 transition-all text-gray-500 hover:text-white text-xs font-mono"
              >
                GH
              </a>
              <a
                href="mailto:api@verifyproceed.com"
                className="w-8 h-8 flex items-center justify-center rounded-lg glass-card hover:border-white/20 transition-all text-gray-500 hover:text-white"
                title="api@verifyproceed.com"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-4">{section}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.to}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-600 hover:text-gray-300 transition-colors flex items-center gap-1"
                      >
                        {link.label}
                        <ExternalLink className="w-2.5 h-2.5 opacity-40" />
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        className="text-sm text-gray-600 hover:text-gray-300 transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-white/[0.04]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-700 font-mono">© 2026 VerifyProceed. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="https://base.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[10px] font-mono text-gray-700 hover:text-gray-500 transition-colors"
              >
                <ExternalLink className="w-2.5 h-2.5" />
                Built on Base
              </a>
              <Link to="/terms" className="text-[10px] font-mono text-gray-700 hover:text-gray-500 transition-colors">Terms</Link>
              <Link to="/privacy" className="text-[10px] font-mono text-gray-700 hover:text-gray-500 transition-colors">Privacy</Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
