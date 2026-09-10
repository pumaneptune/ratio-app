import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, ChevronRight, Hash, Lock, Database, Wifi, ChevronDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const EFFECTIVE_DATE = 'May 13, 2026';
const CONTACT_EMAIL = 'info@eglinlabs.com';

const SECTIONS = [
  {
    id: 'information-collected',
    title: 'Information we collect',
    icon: Database,
    color: 'text-blue-400',
    subsections: [
      {
        heading: 'Account data',
        body: 'When you register for an API key, we collect your email address. We do not require name, payment method, or organization details for the free tier. Infrastructure plan customers provide additional contact and billing information under a separate agreement.',
      },
      {
        heading: 'API request metadata',
        body: 'For each API request, we log the endpoint path, HTTP method, timestamp, response status code, latency in milliseconds, and the API key (or x402 payment proof hash) used. We do not log request or response bodies by default. Request bodies may be captured for a limited period if you explicitly enable debug mode for troubleshooting.',
      },
      {
        heading: 'x402 payment data',
        body: 'When you use pay-per-call access via the x402 protocol, we record the payment proof hash, the USDC amount, the originating wallet address, and the Base transaction hash. This data is stored solely to verify payment validity and prevent double-submission. We do not store private keys or wallet credentials at any point.',
      },
      {
        heading: 'Technical data',
        body: 'We collect standard server-side logs that may include IP address, user agent, and referrer for security monitoring and abuse prevention. These logs are not linked to individual user profiles for analytics purposes.',
      },
    ],
  },
  {
    id: 'use-of-information',
    title: 'How we use your information',
    icon: Shield,
    color: 'text-emerald-400',
    subsections: [
      {
        heading: 'Service operation',
        body: 'We use collected data to provision and manage API keys, process x402 payment verifications, authenticate requests, enforce rate limits, and deliver API responses. Without this data, the Service cannot function.',
      },
      {
        heading: 'Service improvement',
        body: 'Aggregate, anonymized request metadata is used to monitor infrastructure performance, identify latency regressions, and prioritize reliability improvements. Individual request logs are not used for behavioral analysis or product marketing.',
      },
      {
        heading: 'Communications',
        body: 'We send transactional emails for API key issuance, material changes to these policies, and responses to support requests. We do not send marketing or promotional email unless you explicitly opt in.',
      },
      {
        heading: 'Security and abuse prevention',
        body: 'Technical logs are used to detect and block abuse patterns, investigate security incidents, and enforce rate limits. We retain the right to suspend access to API keys associated with abusive or fraudulent activity.',
      },
    ],
  },
  {
    id: 'blockchain-data',
    title: 'Blockchain and on-chain data',
    icon: Wifi,
    color: 'text-purple-400',
    subsections: [
      {
        heading: 'Public nature of blockchain transactions',
        body: 'x402 payments are settled on the Base blockchain, which is a public, permissionless ledger. Transaction data — including sender address, recipient address, amount, and transaction hash — is permanently and publicly visible on-chain. VerifyProceed has no ability to delete or modify blockchain records.',
      },
      {
        heading: 'What we store',
        body: 'We store only the transaction hash and payment proof hash necessary to validate that a payment was made and to prevent replay attacks. We do not maintain a database linking wallet addresses to user identities unless you have provided that linkage through account registration.',
      },
    ],
  },
  {
    id: 'data-retention',
    title: 'Data retention',
    icon: Database,
    color: 'text-cyan-400',
    subsections: [
      {
        heading: 'Retention periods',
        body: 'API request metadata logs are retained for 90 days. Payment proof records are retained for 12 months for fraud prevention. Account information is retained for the duration of your active account plus 30 days following closure. Aggregated, anonymized performance metrics may be retained indefinitely.',
      },
      {
        heading: 'Deletion requests',
        body: `You may request deletion of your personal data at any time by emailing ${CONTACT_EMAIL}. We will process deletion requests within 30 days. Note that data recorded on the Base blockchain cannot be deleted by any party.`,
      },
    ],
  },
  {
    id: 'security',
    title: 'Security',
    icon: Lock,
    color: 'text-orange-400',
    subsections: [
      {
        heading: 'Technical safeguards',
        body: 'All data in transit is encrypted via TLS 1.3. API keys are one-way hashed before storage — we cannot recover a lost key. Infrastructure is hosted on SOC 2 compliant providers with strict access controls and audit logging. We conduct periodic vulnerability assessments and follow responsible disclosure processes.',
      },
      {
        heading: 'Responsible disclosure',
        body: `If you discover a security vulnerability in our infrastructure or API, please disclose it responsibly to ${CONTACT_EMAIL} before public disclosure. We commit to acknowledging reports within 48 hours and providing status updates throughout remediation.`,
      },
    ],
  },
  {
    id: 'third-parties',
    title: 'Third-party services',
    icon: Wifi,
    color: 'text-gray-400',
    subsections: [
      {
        heading: 'Infrastructure providers',
        body: 'We use cloud infrastructure and CDN providers to deliver the Service. These providers process data on our behalf under data processing agreements that bind them to equivalent data protection standards.',
      },
      {
        heading: 'No advertising or tracking',
        body: 'We do not integrate third-party advertising networks, behavioral tracking SDKs, or social media pixels. The Service does not participate in data broker ecosystems.',
      },
    ],
  },
  {
    id: 'your-rights',
    title: 'Your rights',
    icon: Shield,
    color: 'text-blue-400',
    subsections: [
      {
        heading: 'Access, correction, and deletion',
        body: `You have the right to request access to the personal data we hold about you, correction of inaccurate data, and deletion of your data subject to applicable law and our retention obligations. To exercise these rights, email ${CONTACT_EMAIL}.`,
      },
      {
        heading: 'Portability',
        body: 'You may request a machine-readable export of your account data and request metadata. We will fulfill export requests within 30 days.',
      },
    ],
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    icon: Hash,
    color: 'text-gray-400',
    subsections: [
      {
        heading: 'Notification of changes',
        body: 'We may update this Privacy Policy as the platform and applicable law evolve. Material changes — those that meaningfully affect how we collect or use personal data — will be communicated via email to registered users at least 14 days before taking effect. The effective date at the top of this document will be updated with each revision.',
      },
    ],
  },
];

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

function SectionBlock({ sec, index }: { sec: typeof SECTIONS[number]; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const Icon = sec.icon;
  return (
    <FadeUp delay={index * 0.04}>
      <div className="rounded-2xl border border-white/[0.07] overflow-hidden bg-white/[0.01]">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-white/[0.02] transition-colors"
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border bg-white/[0.03] border-white/[0.08]`}>
            <Icon className={`w-4 h-4 ${sec.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-mono text-gray-700 uppercase tracking-widest mr-3">§{index + 1}</span>
            <span className="text-white font-semibold text-sm">{sec.title}</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-600 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="border-t border-white/[0.05] divide-y divide-white/[0.04]">
                {sec.subsections.map((sub, si) => (
                  <div key={si} className="px-6 py-5">
                    <h3 className="text-white font-semibold text-xs mb-2.5">{sub.heading}</h3>
                    <p className="text-gray-500 text-sm leading-[1.8]">{sub.body}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FadeUp>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <div className="relative pt-16 border-b border-white/[0.06]">
        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="section-label mb-4">
            <Shield className="w-3.5 h-3.5" /> Legal
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
            className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Privacy Policy
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.13 }}
            className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
            <span>Effective date: <span className="text-gray-400 font-mono">{EFFECTIVE_DATE}</span></span>
            <span>Contact: <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-400 hover:text-blue-300 transition-colors font-mono">{CONTACT_EMAIL}</a></span>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {/* Intro */}
        <FadeUp className="mb-10">
          <div className="p-6 rounded-2xl border border-blue-500/20 bg-blue-500/[0.04]">
            <p className="text-gray-300 text-sm leading-[1.8]">
              This Privacy Policy describes how VerifyProceed, Inc. ("VerifyProceed," "we," "us," or "our") collects, uses, and protects information when you use the ACP API and related services ("Service"). We built the Service for developers and autonomous systems. We collect only what is necessary to operate it.
            </p>
          </div>
        </FadeUp>

        {/* Quick index */}
        <FadeUp delay={0.05} className="mb-10">
          <div className="rounded-xl border border-white/[0.06] overflow-hidden">
            <div className="px-5 py-3 border-b border-white/[0.05] bg-white/[0.02]">
              <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Contents</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.04]">
              {SECTIONS.map((sec, i) => (
                <button key={sec.id} onClick={() => {
                  document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                  className="flex items-center gap-2.5 px-4 py-3 text-left hover:bg-white/[0.02] transition-colors group">
                  <span className="text-[10px] font-mono text-gray-700 w-5 flex-shrink-0">§{i + 1}</span>
                  <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">{sec.title}</span>
                  <ChevronRight className="w-3 h-3 text-gray-700 ml-auto group-hover:text-gray-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Sections */}
        <div className="space-y-3">
          {SECTIONS.map((sec, i) => (
            <div id={sec.id} key={sec.id}>
              <SectionBlock sec={sec} index={i} />
            </div>
          ))}
        </div>

        {/* Footer note */}
        <FadeUp className="mt-12">
          <div className="pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Questions?{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-400 hover:text-blue-300 transition-colors">{CONTACT_EMAIL}</a>
            </p>
            <div className="flex gap-4">
              <Link to="/terms" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Terms of Service</Link>
              <Link to="/contact" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Contact us</Link>
            </div>
          </div>
        </FadeUp>
      </div>

      <Footer />
    </div>
  );
}
