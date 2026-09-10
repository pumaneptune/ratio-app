import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Inbox, Search, Mail, Trash2, Check, CheckCheck, LogOut, ArrowLeft, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  created_at: string;
  is_read: boolean;
  read_at: string | null;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AdminInboxPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingMsgs, setLoadingMsgs] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate('/admin/sign-in', { replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    fetchMessages();
  }, [user]);

  async function fetchMessages() {
    setLoadingMsgs(true);
    setError('');
    const { data, error: err } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    setLoadingMsgs(false);
    if (err) { setError(err.message); return; }
    setMessages(data ?? []);
  }

  async function markRead(msg: ContactMessage, read: boolean) {
    const { error: err } = await supabase
      .from('contact_messages')
      .update({ is_read: read, read_at: read ? new Date().toISOString() : null })
      .eq('id', msg.id);
    if (err) return;
    setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, is_read: read, read_at: read ? new Date().toISOString() : null } : m));
    setSelected((prev) => prev && prev.id === msg.id ? { ...prev, is_read: read, read_at: read ? new Date().toISOString() : null } : prev);
  }

  async function deleteMessage(msg: ContactMessage) {
    const { error: err } = await supabase.from('contact_messages').delete().eq('id', msg.id);
    if (err) return;
    setMessages((prev) => prev.filter((m) => m.id !== msg.id));
    setSelected((prev) => prev && prev.id === msg.id ? null : prev);
  }

  if (loading || (!user && !loading)) {
    return (
      <PageLayout>
        <div className="min-h-screen" />
      </PageLayout>
    );
  }

  const filtered = messages.filter((m) => {
    if (filter === 'unread' && m.is_read) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.message.toLowerCase().includes(q) || m.topic.toLowerCase().includes(q);
  });

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <PageLayout>
      <div className="min-h-screen">
        <div className="border-b border-white/[0.06]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/25">
                  <Inbox className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Message inbox</h1>
                  <p className="text-xs text-gray-500 font-mono">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to site
                </Link>
                <button onClick={async () => { await signOut(); navigate('/admin/sign-in'); }} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-400 transition-colors">
                  <LogOut className="w-3.5 h-3.5" /> Sign out
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/[0.06] border border-red-500/25 mb-6">
              <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, email, topic, or message..."
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-700 outline-none focus:border-blue-500/40 transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2.5 rounded-xl text-xs font-mono transition-colors ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white/[0.04] text-gray-400 hover:text-white border border-white/[0.08]'}`}
              >
                All ({messages.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2.5 rounded-xl text-xs font-mono transition-colors ${filter === 'unread' ? 'bg-blue-600 text-white' : 'bg-white/[0.04] text-gray-400 hover:text-white border border-white/[0.08]'}`}
              >
                Unread ({unreadCount})
              </button>
            </div>
          </div>

          {loadingMsgs ? (
            <div className="flex items-center justify-center py-20">
              <svg className="w-6 h-6 animate-spin text-gray-600" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Inbox className="w-10 h-10 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">{messages.length === 0 ? 'No messages yet.' : 'No messages match your search.'}</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[380px_1fr] gap-4">
              <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
                {filtered.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setSelected(m); if (!m.is_read) markRead(m, true); }}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${selected?.id === m.id ? 'bg-blue-500/[0.08] border-blue-500/30' : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]'}`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-sm font-semibold truncate ${m.is_read ? 'text-gray-400' : 'text-white'}`}>{m.name}</span>
                      {!m.is_read && <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0 ml-2" />}
                    </div>
                    <p className="text-xs text-gray-500 mb-1 truncate">{m.topic}</p>
                    <p className="text-xs text-gray-600 truncate">{m.message}</p>
                    <p className="text-[10px] text-gray-700 font-mono mt-1.5">{formatDate(m.created_at)}</p>
                  </button>
                ))}
              </div>

              <div className="lg:sticky lg:top-4 lg:self-start">
                {selected ? (
                  <motion.div
                    key={selected.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-2xl p-6 border border-white/[0.09]"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-lg font-bold text-white">{selected.name}</h2>
                        <a href={`mailto:${selected.email}`} className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-mono">{selected.email}</a>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => markRead(selected, !selected.is_read)}
                          title={selected.is_read ? 'Mark unread' : 'Mark read'}
                          className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-white transition-colors"
                        >
                          {selected.is_read ? <Mail className="w-4 h-4" /> : <CheckCheck className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => deleteMessage(selected)}
                          title="Delete"
                          className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono text-blue-300">{selected.topic}</span>
                      <span className="text-[10px] text-gray-600 font-mono">{formatDate(selected.created_at)}</span>
                      {selected.is_read && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                          <Check className="w-3 h-3" /> Read
                        </span>
                      )}
                    </div>
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                      <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <a
                        href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.topic)}`}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" /> Reply by email
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  <div className="glass-card rounded-2xl p-10 border border-white/[0.06] text-center">
                    <Mail className="w-8 h-8 text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Select a message to read it.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
