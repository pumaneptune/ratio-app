import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Mail, Check, ArrowRight, AlertCircle } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { supabase } from '../lib/supabase';

const topics = ['Infrastructure plan', 'Enterprise pricing', 'Technical integration', 'Press / media', 'Security disclosure', 'Other'];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' });

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert({ name: form.name, email: form.email, topic: form.topic, message: form.message });

    setLoading(false);

    if (dbError) {
      setError('Something went wrong. Please try again or email us directly.');
      return;
    }

    setSent(true);
  };

  return (
    <PageLayout>
      <div className="min-h-screen">
        {/* Header */}
        <div className="relative border-b border-white/[0.06]">
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="section-label mb-5 justify-center">
              <MessageSquare className="w-3.5 h-3.5" /> Contact
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
              className="text-5xl font-bold text-white tracking-tight mb-4">
              Get in touch.
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.14 }}
              className="text-xl text-gray-400 max-w-lg mx-auto">
              For infrastructure plans, enterprise pricing, and technical integration questions.
            </motion.p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Info */}
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Before you write</h2>
              <div className="space-y-4 mb-8">
                {[
                  { label: 'API key or free tier', desc: 'Use the Get API Key page — keys are issued instantly, no waiting.', href: '/get-api-key', linkLabel: 'Get API Key →' },
                  { label: 'Technical docs', desc: 'Most integration questions are covered in the API reference and guides.', href: '/docs', linkLabel: 'Read Docs →' },
                  { label: 'Playground testing', desc: 'You can test all endpoints without a key in the Playground.', href: '/playground', linkLabel: 'Try Playground →' },
                ].map((item) => (
                  <div key={item.label} className="p-4 glass-card rounded-xl">
                    <p className="text-white text-sm font-semibold mb-1">{item.label}</p>
                    <p className="text-gray-500 text-sm mb-2">{item.desc}</p>
                    <a href={item.href} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">{item.linkLabel}</a>
                  </div>
                ))}
              </div>

              <div className="p-5 glass-card rounded-xl border border-white/[0.07]">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-white">Direct email</span>
                </div>
                <p className="text-gray-500 text-sm mb-2">For urgent issues or security disclosures:</p>
                <a href="mailto:api@verifyproceed.com" className="text-sm font-mono text-blue-400 hover:text-blue-300 transition-colors">api@verifyproceed.com</a>
              </div>
            </div>

            {/* Form */}
            {!sent ? (
              <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
                className="glass-card rounded-2xl p-8 border border-white/[0.09]">
                <h2 className="text-lg font-bold text-white mb-6">Send a message</h2>
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono text-gray-500 uppercase tracking-widest block mb-2">Name</label>
                      <input required value={form.name} onChange={(e) => update('name', e.target.value)}
                        placeholder="Your name"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 outline-none focus:border-blue-500/40 transition-colors" />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-gray-500 uppercase tracking-widest block mb-2">Email</label>
                      <input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)}
                        placeholder="you@co.com"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 outline-none focus:border-blue-500/40 transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-mono text-gray-500 uppercase tracking-widest block mb-2">Topic</label>
                    <select required value={form.topic} onChange={(e) => update('topic', e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500/40 transition-colors appearance-none">
                      <option value="" className="bg-[#0a0a12]">Select topic</option>
                      {topics.map((t) => <option key={t} value={t} className="bg-[#0a0a12]">{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-mono text-gray-500 uppercase tracking-widest block mb-2">Message</label>
                    <textarea required value={form.message} onChange={(e) => update('message', e.target.value)}
                      placeholder="Describe your use case or question..."
                      rows={5}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 outline-none focus:border-blue-500/40 transition-colors resize-none" />
                  </div>

                  {error && (
                    <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/[0.06] border border-red-500/25">
                      <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-red-300">{error}</p>
                    </div>
                  )}

                  <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold rounded-xl transition-all duration-200 hover:shadow-blue-glow active:scale-[0.98] text-sm">
                    {loading ? (
                      <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>Sending...</>
                    ) : (
                      <>Send Message <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-2xl p-8 border border-emerald-500/20 bg-emerald-500/[0.03] text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 mx-auto mb-4">
                  <Check className="w-6 h-6 text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Message sent.</h2>
                <p className="text-gray-400 text-sm">We'll get back to you within 1–2 business days.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
