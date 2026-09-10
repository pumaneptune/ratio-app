import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, ChevronRight, Hash, Lock, CreditCard, Server, AlertTriangle, ChevronDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const EFFECTIVE_DATE = 'May 13, 2026';
const CONTACT_EMAIL = 'info@eglinlabs.com';

const SECTIONS = [
  {
    id: 'acceptance',
    title: 'Acceptance of terms',
    icon: Shield,
    color: 'text-blue-400',
    subsections: [
      {
        heading: 'Agreement to terms',
        body: 'By accessing or using the VerifyProceed ACP API and related services ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you are using the Service on behalf of an organization, you represent that you have authority to bind that organization, and "you" refers to that organization.',
      },
      {
        heading: 'Eligibility',
        body: 'You must be at least 18 years of age and capable of forming a legally binding agreement to use the Service. The Service is intended for developers, organizations, and autonomous systems operating within a framework of human oversight and legal compliance.',
      },
    ],
  },
  {
    id: 'api-key-usage',
    title: 'API key usage and responsibilities',
    icon: Lock,
    color: 'text-emerald-400',
    subsections: [
      {
        heading: 'Issuance',
        body: 'API keys are issued per user or organization. You are solely responsible for all activity that occurs under your API key, whether initiated by a human operator or by an autonomous agent acting on your behalf.',
      },
      {
        heading: 'Key security',
        body: 'You must not share API keys publicly, embed them in client-side or open-source code, or distribute them to unauthorized parties. If you suspect a key has been compromised, you must revoke it immediately via the API or by contacting support. We are not liable for unauthorized use of a key prior to your reported revocation.',
      },
      {
        heading: 'Programmatic key provisioning',
        body: 'Agents may provision API keys programmatically via the key signup endpoint. You remain responsible for all keys provisioned by agents operating under your account, including any actions those keys enable.',
      },
    ],
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable use',
    icon: Hash,
    color: 'text-cyan-400',
    subsections: [
      {
        heading: 'Permitted use',
        body: 'You may use the Service to integrate pre-execution safety checks, policy-driven decisions, and x402 payment infrastructure into legitimate autonomous systems, research projects, and production applications.',
      },
      {
        heading: 'Prohibited use',
        body: 'The following uses are expressly prohibited: automated attacks or load generation against the API infrastructure; generation of fraudulent x402 payment proofs; attempting to reverse-engineer proprietary verification logic or safety check methodology; reselling raw API access without a written reseller agreement; use of the Service to facilitate actions that violate applicable law; and intentional circumvention of rate limits or quota mechanisms.',
      },
      {
        heading: 'Consequences of misuse',
        body: 'Violation of these acceptable use requirements may result in immediate suspension or termination of your API key without refund, permanent account closure, and legal action where warranted.',
      },
    ],
  },
  {
    id: 'payments',
    title: 'x402 payments and billing',
    icon: CreditCard,
    color: 'text-purple-400',
    subsections: [
      {
        heading: 'Pay-per-call via x402',
        body: 'Pay-per-call usage is billed in real time via x402 micropayments in USDC on the Base blockchain. Each API request triggers a payment flow: the Service returns HTTP 402 with payment instructions, you or your agent pays the specified USDC amount on-chain, and you retry the request with a cryptographic payment proof. The Service verifies the on-chain transaction and processes the request.',
      },
      {
        heading: 'Finality of payments',
        body: 'Blockchain payments are irreversible once confirmed. Payments for API calls that return a valid response — regardless of the verdict contained in that response — are final and non-refundable. "Block" verdicts represent the Service functioning correctly, not a service failure.',
      },
      {
        heading: 'Pricing changes',
        body: 'Per-request pricing is published in the capability manifest at GET /v1/capabilities. We reserve the right to adjust pricing with 30 days\' advance notice communicated via email to registered users and via an update to the capability manifest. Continued use after the effective date of a price change constitutes acceptance.',
      },
      {
        heading: 'Free tier',
        body: 'The free tier provides 100 requests per month with no payment required. Free tier availability is provided on a best-effort basis and may be adjusted with 30 days\' notice. Unused free requests do not carry over between calendar months.',
      },
    ],
  },
  {
    id: 'sla',
    title: 'Service levels and infrastructure',
    icon: Server,
    color: 'text-blue-400',
    subsections: [
      {
        heading: 'Free and pay-per-call tiers',
        body: 'The free tier and pay-per-call tier are provided on a best-effort basis with no uptime guarantee or Service Level Agreement. We publish real-time system status and historical uptime data on our status page. We target 99.5% monthly availability for these tiers but do not contractually guarantee it.',
      },
      {
        heading: 'Infrastructure plan availability',
        body: 'Infrastructure plan customers receive enhanced availability targets as specified in their written infrastructure agreement. Scheduled maintenance windows, with at least 48 hours\' advance notice, are excluded from uptime calculations.',
      },
      {
        heading: 'Base mainnet dependency',
        body: 'x402 payment verification depends on the availability and finality of the Base mainnet. Network congestion, forks, or outages on Base are outside our control and do not constitute a Service failure for SLA purposes. We implement fallback verification mechanisms to minimize impact of transient network conditions.',
      },
    ],
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual property',
    icon: Lock,
    color: 'text-gray-400',
    subsections: [
      {
        heading: 'VerifyProceed IP',
        body: 'The ACP API, verification logic, policy engine, and associated infrastructure are proprietary to VerifyProceed, Inc. and protected by applicable intellectual property law. No license is granted to copy, modify, redistribute, or reverse-engineer these systems except as expressly permitted in a written agreement.',
      },
      {
        heading: 'Open protocol',
        body: 'The x402 payment protocol specification is published as an open standard. You may implement compatible clients, servers, and tooling under the terms of the specification\'s license without restriction.',
      },
      {
        heading: 'Your content',
        body: 'You retain full ownership of your agent code, system architecture, and any data you submit to the Service. We do not claim rights over your use cases, outputs, or business logic. We do not use your request bodies for training, model improvement, or any purpose beyond operating the Service.',
      },
    ],
  },
  {
    id: 'disclaimers',
    title: 'Disclaimers and limitation of liability',
    icon: AlertTriangle,
    color: 'text-orange-400',
    subsections: [
      {
        heading: 'No warranty',
        body: 'THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. VERIFYPROCEED EXPRESSLY DISCLAIMS ALL WARRANTIES INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT VERIFICATION RESULTS ARE EXHAUSTIVE, INFALLIBLE, OR FREE FROM FALSE POSITIVES OR FALSE NEGATIVES.',
      },
      {
        heading: 'Agent autonomy disclaimer',
        body: 'The Service provides safety signals and verdicts to inform autonomous agent decision-making. Final execution decisions remain with the agent and its operator. We are not liable for actions taken by autonomous agents that used our verdicts as one input among many, or for actions taken in defiance of a "block" verdict.',
      },
      {
        heading: 'Limitation of liability',
        body: 'TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, VERIFYPROCEED\'S AGGREGATE LIABILITY FOR ANY CLAIMS ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE IS LIMITED TO THE AMOUNTS PAID BY YOU IN THE 30 CALENDAR DAYS IMMEDIATELY PRECEDING THE CLAIM. WE ARE NOT LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.',
      },
    ],
  },
  {
    id: 'termination',
    title: 'Termination',
    icon: Shield,
    color: 'text-red-400',
    subsections: [
      {
        heading: 'Termination by us',
        body: 'We may suspend or terminate your API key and account immediately and without notice if you violate these Terms, engage in abusive behavior, or if we are required to do so by law. We will make reasonable efforts to notify you after the fact where legally and practically feasible.',
      },
      {
        heading: 'Termination by you',
        body: 'You may terminate your account at any time by revoking all API keys and contacting us to request account closure. Termination does not entitle you to refunds of amounts already paid via x402 payments or any pre-paid plan credits.',
      },
      {
        heading: 'Effect of termination',
        body: 'Upon termination, your right to use the Service ceases immediately. Sections covering intellectual property, disclaimers, limitation of liability, and governing law survive termination.',
      },
    ],
  },
  {
    id: 'governing-law',
    title: 'Governing law and disputes',
    icon: Hash,
    color: 'text-gray-400',
    subsections: [
      {
        heading: 'Governing law',
        body: 'These Terms are governed by and construed in accordance with applicable law, without regard to conflict of law principles.',
      },
      {
        heading: 'Dispute resolution',
        body: 'Before initiating formal proceedings, you agree to contact us in good faith to attempt to resolve any dispute. If disputes cannot be resolved informally, they shall be submitted to binding arbitration in Delaware under the rules of the American Arbitration Association, except that either party may seek injunctive relief in a court of competent jurisdiction.',
      },
    ],
  },
  {
    id: 'changes',
    title: 'Changes to these terms',
    icon: Hash,
    color: 'text-gray-400',
    subsections: [
      {
        heading: 'Notification',
        body: 'We may update these Terms at any time. Material changes — those that materially affect your rights or obligations — will be communicated via email to registered users at least 14 days before taking effect. The effective date at the top of this document will be updated with each revision. Continued use of the Service after the effective date constitutes acceptance of the revised Terms.',
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
    <FadeUp delay={index * 0.035}>
      <div className="rounded-2xl border border-white/[0.07] overflow-hidden bg-white/[0.01]">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-white/[0.02] transition-colors"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border bg-white/[0.03] border-white/[0.08]">
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

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <div className="relative pt-16 border-b border-white/[0.06]">
        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="section-label mb-4">
            <Shield className="w-3.5 h-3.5" /> Legal
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
            className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Terms of Service
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
              These Terms of Service govern your use of the VerifyProceed ACP API and all associated services. They are written to be precise rather than approachable — because the Service is infrastructure, and infrastructure terms matter. If anything is unclear, contact us before using the Service.
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
                  <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors truncate">{sec.title}</span>
                  <ChevronRight className="w-3 h-3 text-gray-700 ml-auto flex-shrink-0 group-hover:text-gray-500 transition-colors" />
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
              <Link to="/privacy" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Privacy Policy</Link>
              <Link to="/contact" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Contact us</Link>
            </div>
          </div>
        </FadeUp>
      </div>

      <Footer />
    </div>
  );
}
