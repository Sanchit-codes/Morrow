'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { completeOnboarding } from '@/signal/actions';
import type { SearchEngine } from '@/schema';

const CARDS = [
  { id: 'mail',     icon: 'mail',          label: 'Mail' },
  { id: 'calendar', icon: 'calendar_month', label: 'Calendar' },
  { id: 'docs',     icon: 'description',   label: 'Docs' },
  { id: 'media',    icon: 'play_circle',   label: 'Media' },
  { id: 'notes',    icon: 'edit_note',     label: 'Notes' },
  { id: 'analytics',icon: 'analytics',     label: 'Analytics' },
];

const ENGINES: { value: SearchEngine; label: string; icon: string }[] = [
  { value: 'duckduckgo', label: 'DuckDuckGo', icon: 'travel_explore' },
  { value: 'google',     label: 'Google',     icon: 'search' },
  { value: 'ecosia',     label: 'Ecosia',     icon: 'eco' },
  { value: 'bing',       label: 'Bing',       icon: 'language' },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stepVariants: any = {
  initial: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
  animate: { x: 0, opacity: 1, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] } },
  exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.35, ease: [0.65, 0, 0.35, 1] } }),
};

interface Props { userId: string; displayName: string; }

export default function SetupClient({ userId, displayName }: Props) {
  const { update } = useSession();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    greeting: '',
    searchEngine: 'duckduckgo' as SearchEngine,
    enabledCards: ['mail', 'calendar', 'docs', 'media'] as string[],
  });

  const goNext = () => { setDir(1); setStep(s => s + 1); };
  const goPrev = () => { setDir(-1); setStep(s => s - 1); };
  const toggleCard = (id: string) => setData(d => ({
    ...d,
    enabledCards: d.enabledCards.includes(id) ? d.enabledCards.filter(c => c !== id) : [...d.enabledCards, id],
  }));

  const finish = async () => {
    setSaving(true);
    await completeOnboarding(userId, data);
    await update({ refresh: true });
    window.location.href = '/home';
  };

  const steps = [
    <div key="greet" className="space-y-8">
      <div className="space-y-2">
        <p className="font-label text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--color-primary)' }}>Step 1 of 3</p>
        <h2 className="font-sans text-4xl font-semibold tracking-tight" style={{ color: 'var(--color-on-surface)' }}>What should we call you?</h2>
        <p className="text-[16px] leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>This appears as the greeting on your new tab every morning.</p>
      </div>
      <div className="rounded-2xl shadow-sunken border border-white/[0.03] px-6 py-5 flex items-center gap-4"
        style={{ background: 'var(--color-surface-container)' }}>
        <span className="material-symbols-outlined select-none opacity-40" style={{ color: 'var(--color-on-surface)' }}>waving_hand</span>
        <input type="text" autoFocus value={data.greeting}
          onChange={e => setData(d => ({ ...d, greeting: e.target.value }))}
          placeholder={`Good morning, ${displayName || 'there'}...`}
          className="w-full bg-transparent border-none outline-none text-[17px] placeholder:opacity-25"
          style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-sans)', fontWeight: 600 }} />
      </div>
      <div className="rounded-2xl p-5 border border-white/[0.03]" style={{ background: 'var(--color-surface-container-low)' }}>
        <p className="font-label text-[11px] uppercase tracking-[0.15em] mb-3" style={{ color: 'var(--color-on-surface-variant)' }}>Preview</p>
        <p className="font-sans text-2xl font-semibold" style={{ color: 'var(--color-on-surface)' }}>
          {data.greeting ? `Good morning, ${data.greeting}.` : 'Good morning.'}
        </p>
        <p className="text-[15px] mt-1" style={{ color: 'var(--color-on-surface-variant)' }}>What will we discover today?</p>
      </div>
    </div>,

    <div key="search" className="space-y-8">
      <div className="space-y-2">
        <p className="font-label text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--color-primary)' }}>Step 2 of 3</p>
        <h2 className="font-sans text-4xl font-semibold tracking-tight" style={{ color: 'var(--color-on-surface)' }}>Choose your search engine</h2>
        <p className="text-[16px] leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>Powers the search bar on your new tab.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {ENGINES.map(eng => (
          <button key={eng.value} onClick={() => setData(d => ({ ...d, searchEngine: eng.value }))}
            className="rounded-2xl p-5 border text-left transition-all duration-200 flex flex-col gap-3 relative"
            style={{
              background: data.searchEngine === eng.value ? 'rgba(251,195,138,0.08)' : 'var(--color-surface-container)',
              borderColor: data.searchEngine === eng.value ? 'rgba(251,195,138,0.3)' : 'rgba(255,255,255,0.03)',
              boxShadow: data.searchEngine === eng.value ? '0 0 20px rgba(251,195,138,0.08)' : 'inset 4px 4px 8px rgba(0,0,0,0.4), inset -4px -4px 8px rgba(255,255,255,0.05)',
            }}>
            {data.searchEngine === eng.value && (
              <div className="absolute top-4 right-4 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'var(--color-primary)' }}>
                <Check size={11} color="#492900" />
              </div>
            )}
            <span className="material-symbols-outlined text-[28px] select-none"
              style={{ color: data.searchEngine === eng.value ? 'var(--color-primary)' : 'var(--color-on-surface-variant)', fontVariationSettings: "'FILL' 1" }}>{eng.icon}</span>
            <span className="font-sans font-medium text-[16px]" style={{ color: 'var(--color-on-surface)' }}>{eng.label}</span>
          </button>
        ))}
      </div>
    </div>,

    <div key="cards" className="space-y-8">
      <div className="space-y-2">
        <p className="font-label text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--color-primary)' }}>Step 3 of 3</p>
        <h2 className="font-sans text-4xl font-semibold tracking-tight" style={{ color: 'var(--color-on-surface)' }}>Pick your quick-launch cards</h2>
        <p className="text-[16px] leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>These appear on your home tab. You can change this in settings.</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {CARDS.map(card => {
          const active = data.enabledCards.includes(card.id);
          return (
            <button key={card.id} onClick={() => toggleCard(card.id)}
              className="rounded-2xl aspect-square flex flex-col items-center justify-center gap-3 transition-all duration-200 relative border"
              style={{
                background: active ? 'rgba(251,195,138,0.08)' : 'var(--color-surface-container)',
                borderColor: active ? 'rgba(251,195,138,0.3)' : 'rgba(255,255,255,0.03)',
                boxShadow: active ? '0 0 20px rgba(251,195,138,0.08)' : 'inset 4px 4px 8px rgba(0,0,0,0.4), inset -4px -4px 8px rgba(255,255,255,0.05)',
              }}>
              {active && (
                <div className="absolute top-3 right-3 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'var(--color-primary)' }}>
                  <Check size={9} color="#492900" />
                </div>
              )}
              <span className="material-symbols-outlined text-[28px] select-none"
                style={{ color: active ? 'var(--color-primary)' : 'var(--color-on-surface-variant)', fontVariationSettings: "'FILL' 1" }}>{card.icon}</span>
              <span className="font-label text-[12px] uppercase tracking-[0.1em]"
                style={{ color: active ? 'var(--color-on-surface)' : 'var(--color-on-surface-variant)' }}>{card.label}</span>
            </button>
          );
        })}
      </div>
    </div>,
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 py-16 relative overflow-hidden"
      style={{ background: 'var(--color-background)', fontFamily: 'var(--font-body)' }}>
      <div className="absolute inset-0 grain-overlay pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[700px] rounded-full blur-[150px]" style={{ background: 'rgba(251,195,138,0.04)' }} />
      </div>

      <div className="absolute top-8 left-8">
        <span className="font-sans font-semibold text-lg tracking-tight" style={{ color: 'var(--color-on-surface)' }}>Morrow</span>
      </div>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <motion.div className="h-full" style={{ background: 'var(--color-primary)' }}
          animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] }} />
      </div>

      <div className="w-full max-w-xl relative z-10">
        <div className="overflow-hidden">
          <AnimatePresence initial={false} custom={dir} mode="wait">
            <motion.div key={step} custom={dir} variants={stepVariants} initial="initial" animate="animate" exit="exit">
              {steps[step]}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between mt-12">
          <button onClick={goPrev} disabled={step === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-sans text-[14px] transition-all disabled:opacity-0"
            style={{ color: 'var(--color-on-surface-variant)' }}>
            <ArrowLeft size={16} /> Back
          </button>

          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div key={i} className="h-1 rounded-full transition-all duration-500"
                style={{ width: i === step ? '24px' : '8px', background: i <= step ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)' }} />
            ))}
          </div>

          {step < steps.length - 1 ? (
            <button onClick={goNext}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-sans font-medium text-[14px] glow-btn transition-all hover:brightness-110 hover:-translate-y-0.5"
              style={{ background: 'var(--color-primary)', color: '#492900' }}>
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={finish} disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-sans font-medium text-[14px] glow-btn transition-all hover:brightness-110 hover:-translate-y-0.5 disabled:opacity-60"
              style={{ background: 'var(--color-primary)', color: '#492900' }}>
              {saving ? <span className="w-4 h-4 rounded-full border-2 border-[#492900]/30 border-t-[#492900] animate-spin" /> : <>Launch desk <ArrowRight size={16} /></>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
