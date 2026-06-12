'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, Eye, EyeOff, Check } from 'lucide-react';
import { registerUser } from '@/signal/actions';

const rules = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
];

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', displayName: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordStrength = rules.filter(r => r.test(form.password)).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (passwordStrength < rules.length) {
      setError('Password does not meet all requirements.');
      return;
    }

    setLoading(true);
    const result = await registerUser({
      username: form.username,
      password: form.password,
      displayName: form.displayName || form.username,
    });

    if ('error' in result) {
      setError(result.error ?? 'Something went wrong.');
      setLoading(false);
      return;
    }

    await signIn('credentials', {
      username: form.username,
      password: form.password,
      redirect: false,
    });

    router.push('/setup');
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-background)', fontFamily: 'var(--font-body)' }}>
      {/* Left — form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-8 py-16 relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[500px] rounded-full blur-[100px]" style={{ background: 'rgba(251,195,138,0.03)' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="w-full max-w-md relative z-10"
        >
          <div className="mb-10">
            <Link href="/" className="font-sans font-semibold text-xl tracking-tight" style={{ color: 'var(--color-on-surface)' }}>Morrow</Link>
          </div>

          <h2 className="font-sans text-3xl font-semibold tracking-tight mb-2" style={{ color: 'var(--color-on-surface)' }}>Create your desk</h2>
          <p className="text-[15px] mb-10" style={{ color: 'var(--color-on-surface-variant)' }}>
            Already have an account?{' '}
            <Link href="/enter" style={{ color: 'var(--color-primary)' }}>Sign in</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-label text-[11px] uppercase tracking-[0.15em] block mb-2" style={{ color: 'var(--color-on-surface-variant)' }}>
                Username
              </label>
              <div className="rounded-2xl shadow-sunken border border-white/[0.03] px-5 py-4 flex items-center gap-3"
                style={{ background: 'var(--color-surface-container)' }}>
                <span className="material-symbols-outlined text-[20px] select-none opacity-50" style={{ color: 'var(--color-on-surface)' }}>alternate_email</span>
                <input
                  type="text"
                  autoComplete="username"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value.replace(/\s/g, '').toLowerCase() }))}
                  placeholder="choose_a_username"
                  className="w-full bg-transparent border-none outline-none text-[15px] placeholder:opacity-30"
                  style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-body)' }}
                />
              </div>
            </div>

            <div>
              <label className="font-label text-[11px] uppercase tracking-[0.15em] block mb-2" style={{ color: 'var(--color-on-surface-variant)' }}>
                Display name <span className="opacity-40 normal-case tracking-normal">(optional)</span>
              </label>
              <div className="rounded-2xl shadow-sunken border border-white/[0.03] px-5 py-4 flex items-center gap-3"
                style={{ background: 'var(--color-surface-container)' }}>
                <span className="material-symbols-outlined text-[20px] select-none opacity-50" style={{ color: 'var(--color-on-surface)' }}>person</span>
                <input
                  type="text"
                  autoComplete="name"
                  value={form.displayName}
                  onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
                  placeholder="How should we greet you?"
                  className="w-full bg-transparent border-none outline-none text-[15px] placeholder:opacity-30"
                  style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-body)' }}
                />
              </div>
            </div>

            <div>
              <label className="font-label text-[11px] uppercase tracking-[0.15em] block mb-2" style={{ color: 'var(--color-on-surface-variant)' }}>
                Password
              </label>
              <div className="rounded-2xl shadow-sunken border border-white/[0.03] px-5 py-4 flex items-center gap-3"
                style={{ background: 'var(--color-surface-container)' }}>
                <span className="material-symbols-outlined text-[20px] select-none opacity-50" style={{ color: 'var(--color-on-surface)' }}>lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full bg-transparent border-none outline-none text-[15px] placeholder:opacity-30"
                  style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-body)' }}
                />
                <button type="button" onClick={() => setShowPassword(s => !s)} className="opacity-40 hover:opacity-80 transition-opacity">
                  {showPassword ? <EyeOff size={16} style={{ color: 'var(--color-on-surface)' }} /> : <Eye size={16} style={{ color: 'var(--color-on-surface)' }} />}
                </button>
              </div>

              {form.password.length > 0 && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 space-y-2">
                  <div className="flex gap-1">
                    {rules.map((_, i) => (
                      <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ background: i < passwordStrength ? 'var(--color-primary)' : 'rgba(255,255,255,0.08)' }} />
                    ))}
                  </div>
                  <div className="space-y-1">
                    {rules.map((rule, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check size={11} className="transition-colors" style={{ color: rule.test(form.password) ? 'var(--color-primary)' : 'rgba(255,255,255,0.2)' }} />
                        <span className="font-label text-[11px] tracking-wide transition-colors"
                          style={{ color: rule.test(form.password) ? 'var(--color-on-surface-variant)' : 'rgba(255,255,255,0.2)' }}>
                          {rule.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {error && (
              <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="font-label text-[12px]" style={{ color: 'var(--color-error)' }}>
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading || !form.username || !form.password}
              className="w-full py-4 rounded-2xl font-sans font-semibold text-[15px] glow-btn transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-3 mt-2"
              style={{ background: 'var(--color-primary)', color: '#492900' }}
            >
              {loading ? (
                <span className="w-5 h-5 rounded-full border-2 border-[#492900]/30 border-t-[#492900] animate-spin" />
              ) : (
                <>Create desk <ArrowRight size={18} /></>
              )}
            </button>

            <p className="text-center font-label text-[11px] tracking-wide opacity-40 mt-2" style={{ color: 'var(--color-on-surface-variant)' }}>
              No email. No tracking. Just you.
            </p>
          </form>
        </motion.div>
      </div>

      {/* Right — branding panel */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-16 relative overflow-hidden border-l border-white/5">
        <div className="absolute inset-0 grain-overlay pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(251,195,138,0.04)' }} />

        <div />

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.3 }}>
          <p className="font-label text-[10px] uppercase tracking-[0.25em] mb-4" style={{ color: 'var(--color-primary)' }}>Your space</p>
          <h2 className="font-sans text-5xl font-semibold leading-tight tracking-tight mb-6" style={{ color: 'var(--color-on-surface)' }}>
            A desk built<br />
            <span style={{ color: 'var(--color-primary-container)' }}>for deep work.</span>
          </h2>
          <ul className="space-y-5">
            {[
              { icon: 'task_alt', text: 'Manage your todo list by category and time estimate' },
              { icon: 'play_circle', text: 'Queue videos from YouTube, Vimeo, or any URL' },
              { icon: 'bookmarks', text: 'Organize bookmarks into focused work contexts' },
              { icon: 'extension', text: 'Set as your new tab with one browser extension' },
            ].map((item, i) => (
              <motion.li key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl recessed-surface flex items-center justify-center flex-shrink-0" style={{ color: 'var(--color-primary)' }}>
                  <span className="material-symbols-outlined text-[18px] select-none" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                </div>
                <span className="text-[15px]" style={{ color: 'var(--color-on-surface-variant)' }}>{item.text}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <div className="flex items-center gap-3 opacity-40">
          <div className="w-8 h-[1px]" style={{ background: 'var(--color-primary)' }} />
          <span className="font-label text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--color-primary)' }}>Morrow · 2025</span>
        </div>
      </div>
    </div>
  );
}
