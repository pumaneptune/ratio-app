import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { useAuth } from '../lib/auth';

export default function AdminSignInPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfo('');

    const fn = mode === 'signin' ? signIn : signUp;
    const { error: err } = await fn(email, password);

    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    if (mode === 'signup') {
      setInfo('Account created. You are now signed in.');
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="glass-card rounded-2xl p-8 border border-white/[0.09]">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/25 mx-auto mb-5">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-xl font-bold text-white text-center mb-1">Admin access</h1>
            <p className="text-sm text-gray-500 text-center mb-6">
              {mode === 'signin' ? 'Sign in to view contact messages.' : 'Create an admin account.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-gray-500 uppercase tracking-widest block mb-2">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@co.com"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-700 outline-none focus:border-blue-500/40 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-mono text-gray-500 uppercase tracking-widest block mb-2">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    required
                    type="password"
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-700 outline-none focus:border-blue-500/40 transition-colors"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/[0.06] border border-red-500/25">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-300">{error}</p>
                </div>
              )}
              {info && (
                <div className="p-3.5 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/25">
                  <p className="text-xs text-emerald-300">{info}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold rounded-xl transition-all duration-200 hover:shadow-blue-glow active:scale-[0.98] text-sm"
              >
                {loading ? 'Please wait...' : (
                  <>
                    {mode === 'signin' ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 text-center">
              <button
                onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setInfo(''); }}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
}
