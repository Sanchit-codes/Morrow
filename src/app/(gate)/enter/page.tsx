'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await signIn('credentials', {
      username: form.username,
      password: form.password,
      redirect: false,
    });

    if (res?.error) {
      setError('Invalid username or password.');
      setLoading(false);
      return;
    }

    router.push('/home');
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-background)', fontFamily: 'var(--font-body)' }}>
      {/* Left — branding panel */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-16 relative overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 grain-overlay pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(251,195,138,0.04)' }} />

        <Link href="/" className="font-sans font-semibold text-xl tracking-tight" style={{ color: 'var(--color-on-surface)' }}>
          Morrow
        </Link>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.2 }}>
          <p className="font-label text-[10px] uppercase tracking-[0.25em] mb-4" style={{ color: 'var(--color-primary)' }}>Welcome back</p>
          <h1 className="font-sans text-5xl font-semibold leading-tight tracking-tight mb-6" style={{ color: 'var(--color-on-surface)' }}>
            Your desk is<br />
            <span style={{ color: 'var(--color-primary-container)' }}>waiting for you.</span>
          </h1>
          <p className="text-[17px] leading-relaxed max-w-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
            Sign in to return to your focused digital workspace — todos, watch list, and everything in between.
          </p>
        </motion.div>

        <div className="flex items-center gap-3 opacity-40">
          <div className="w-8 h-[1px]" style={{ background: 'var(--color-primary)' }} />
          <span className="font-label text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--color-primary)' }}>Morrow · 2025</span>
        </div>
      </div>

      {/* Right — form */}
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
          <div className="lg:hidden mb-10">
            <Link href="/" className="font-sans font-semibold text-xl tracking-tight" style={{ color: 'var(--color-on-surface)' }}>Morrow</Link>
          </div>

          <h2 className="font-sans text-3xl font-semibold tracking-tight mb-2" style={{ color: 'var(--color-on-surface)' }}>Sign in</h2>
          <p className="text-[15px] mb-10" style={{ color: 'var(--color-on-surface-variant)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/join" className="transition-colors" style={{ color: 'var(--color-primary)' }}>Create one</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-label text-[11px] uppercase tracking-[0.15em] block mb-2" style={{ color: 'var(--color-on-surface-variant)' }}>
                Username
              </label>
              <div className="rounded-2xl shadow-sunken border border-white/[0.03] px-5 py-4 flex items-center gap-3"
                style={{ background: 'var(--color-surface-container)' }}>
                <span className="material-symbols-outlined text-[20px] select-none" style={{ color: 'var(--color-on-surface-variant)' }}>person</span>
                <input
                  type="text"
                  autoComplete="username"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  placeholder="your_username"
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
                <span className="material-symbols-outlined text-[20px] select-none" style={{ color: 'var(--color-on-surface-variant)' }}>lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
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
            </div>

            {error && (
              <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="font-label text-[12px] text-[var(--color-error)] pl-1">
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
                <>Sign in <ArrowRight size={18} /></>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
