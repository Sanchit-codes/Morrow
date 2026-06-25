'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { resetUserData } from '@/signal/actions';
import type { UserPreferences, CustomQuickAction, DashboardLayout } from '@/schema';

/* ─── Constants ─── */

const ENGINES = [
  { value: 'duckduckgo', label: 'DuckDuckGo', icon: 'travel_explore' },
  { value: 'google',     label: 'Google',     icon: 'search' },
  { value: 'ecosia',     label: 'Ecosia',     icon: 'eco' },
  { value: 'bing',       label: 'Bing',       icon: 'language' },
];

const ACCENTS = ['#fbc38a', '#7eb3c4', '#a3c48b', '#b39ddb', '#f48fb1', '#80cbc4'];

const PRESET_CARDS = [
  { id: 'mail',      icon: 'mail',          label: 'Mail' },
  { id: 'calendar',  icon: 'calendar_month', label: 'Calendar' },
  { id: 'docs',      icon: 'description',   label: 'Docs' },
  { id: 'media',     icon: 'play_circle',   label: 'Media' },
  { id: 'notes',     icon: 'edit_note',     label: 'Notes' },
  { id: 'analytics', icon: 'analytics',     label: 'Analytics' },
];

const ICON_OPTIONS = [
  // Navigation & links
  'link', 'open_in_new', 'public', 'language', 'travel_explore',
  // Dev & tools
  'code', 'terminal', 'bug_report', 'build', 'api', 'webhook', 'data_object', 'integration_instructions',
  // Files & docs
  'folder', 'description', 'article', 'edit_note', 'note_add', 'inventory_2', 'archive',
  // Media
  'play_circle', 'videocam', 'music_note', 'photo', 'image', 'podcasts', 'headphones',
  // Communication
  'mail', 'chat', 'forum', 'message', 'notifications', 'send',
  // Data & analytics
  'analytics', 'bar_chart', 'trending_up', 'pie_chart', 'leaderboard', 'insights',
  // Cloud & infra
  'cloud', 'cloud_upload', 'storage', 'dns', 'hub', 'share',
  // Productivity
  'task_alt', 'checklist', 'timer', 'schedule', 'calendar_month', 'bookmark',
  // Commerce
  'shopping_cart', 'payments', 'credit_card', 'wallet', 'store',
  // Misc
  'star', 'dashboard', 'home', 'search', 'settings', 'lock', 'shield', 'key',
  'bolt', 'rocket_launch', 'explore', 'map', 'location_on', 'person', 'group',
];

const THEMES = [
  { id: 'amber',     label: 'Amber',     bg: '#1b1c1c', surface: '#252727', primary: '#fbc38a' },
  { id: 'nocturnal', label: 'Nocturnal', bg: '#0c0e10', surface: '#1c1e21', primary: '#bbc7dd' },
  { id: 'slate',     label: 'Slate',     bg: '#0e1115', surface: '#1e2330', primary: '#94a3b8' },
  { id: 'forest',    label: 'Forest',    bg: '#0d1310', surface: '#1a2a1e', primary: '#86a87a' },
  { id: 'rose',      label: 'Rose',      bg: '#130e10', surface: '#2a1e24', primary: '#c89fa8' },
];

const DASHBOARD_LAYOUTS: { id: DashboardLayout; label: string; desc: string }[] = [
  { id: 'grid',    label: 'Grid',    desc: 'Tabs + large 2-col card grid below search' },
  { id: 'stream',  label: 'Stream',  desc: 'Pills + icon row inline below search' },
  { id: 'compact', label: 'Compact', desc: 'No categories, small square icon cards' },
  { id: 'bento',   label: 'Bento',   desc: 'Category panels + individual cards side by side' },
  { id: 'zen',     label: 'Zen',     desc: 'Greeting and search only — no cards' },
];

const DEFAULT_CATEGORIES = ['All', 'Work', 'Design', 'Dev', 'Personal'];

/* ─── Helpers ─── */

function SectionLabel({ text }: { text: string }) {
  return <p style={{ fontSize: '13px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--canvas-on-surface-variant)', opacity: 0.55, margin: '0 0 12px' }}>{text}</p>;
}

function SectionTitle({ label }: { label: string }) {
  return <h3 style={{ fontFamily: 'var(--font-canvas-heading)', fontSize: '23px', fontWeight: 700, color: 'var(--canvas-on-surface)', letterSpacing: '-0.01em', margin: '0 0 7px' }}>{label}</h3>;
}

function SaveBtn({ onClick, saved }: { onClick: () => void; saved: boolean }) {
  return (
    <button onClick={onClick} style={{
      marginTop: '28px', padding: '13px 32px', borderRadius: '12px', border: 'none', cursor: 'pointer',
      fontSize: '15px', fontWeight: 600,
      background: saved ? 'var(--canvas-surface-high)' : 'var(--canvas-primary)',
      color: saved ? 'var(--canvas-on-surface-variant)' : 'var(--canvas-bg)',
      fontFamily: 'var(--font-canvas-body)', transition: 'all 0.3s ease',
      boxShadow: `-3px -3px 6px var(--canvas-shadow-light), 3px 3px 6px var(--canvas-shadow-dark)`,
    }}>
      {saved ? '✓ Saved' : 'Save changes'}
    </button>
  );
}

/* ─── Layout preview SVG ─── */
function LayoutPreview({ id }: { id: DashboardLayout }) {
  const pill = (x: number, y: number, w = 18) => <rect key={`${x}${y}`} x={x} y={y} width={w} height={5} rx={2.5} fill="currentColor" opacity={0.3} />;
  const tab  = (x: number, y: number, w = 22) => <rect key={`${x}${y}`} x={x} y={y} width={w} height={6} rx={1} fill="currentColor" opacity={0.25} />;
  const card = (x: number, y: number, w = 14, h = 20) => <rect key={`c${x}${y}`} x={x} y={y} width={w} height={h} rx={3} fill="currentColor" opacity={0.2} />;
  const sq   = (x: number, y: number) => <rect key={`s${x}${y}`} x={x} y={y} width={12} height={12} rx={3} fill="currentColor" opacity={0.2} />;
  const bar  = (x: number, y: number) => <rect key={`b${x}${y}`} x={x} y={y} width={60} height={7} rx={3.5} fill="currentColor" opacity={0.15} />;

  return (
    <svg viewBox="0 0 80 60" width="80" height="60" style={{ color: 'var(--canvas-primary)' }}>
      {/* Greeting lines */}
      <rect x={10} y={4} width={32} height={4} rx={2} fill="currentColor" opacity={0.35} />
      <rect x={10} y={10} width={20} height={3} rx={1.5} fill="currentColor" opacity={0.2} />
      {/* Search bar */}
      {bar(10, 18)}
      {/* Layout-specific elements */}
      {id === 'grid'    &&<>{tab(10, 30)} {tab(36, 30)} {tab(62, 30, 14)} {card(10, 40, 28, 16)} {card(42, 40, 28, 16)}</>}
      {id === 'stream'  && <>{pill(10, 30)} {pill(32, 30)} {pill(52, 30, 14)} {sq(10, 40)} {sq(26, 40)} {sq(42, 40)} {sq(58, 40)}</>}
      {id === 'compact' && <>{sq(10, 30)} {sq(26, 30)} {sq(42, 30)} {sq(58, 30)}</>}
      {id === 'bento'   && <>{sq(10, 28)} {sq(24, 28)} {sq(38, 28)} {sq(10, 43)} {sq(24, 43)} {sq(38, 43)} {card(54, 28, 12, 28)} {card(68, 28, 12, 28)}</>}
      {id === 'zen'     && <rect x={20} y={30} width={40} height={3} rx={1.5} fill="currentColor" opacity={0.12} />}
    </svg>
  );
}

/* ─── Props ─── */
interface Props {
  userId: string;
  displayName: string;
  preferences?: UserPreferences;
}

type NavSection = 'appearance' | 'layout' | 'search' | 'account';

/* ─── Main ─── */
export default function DriftClient({ userId, displayName: initDisplayName, preferences }: Props) {
  const { update } = useSession();
  const router = useRouter();

  const [activeSection, setActiveSection] = useState<NavSection>('appearance');
  const [saved, setSaved] = useState(false);
  const [resetting, setResetting] = useState(false);

  /* ── Appearance ── */
  const [theme, setTheme] = useState(preferences?.theme || 'amber');
  const [accentColor, setAccentColor] = useState(preferences?.accentColor || '#fbc38a');

  /* ── Layout (categories + quick actions merged) ── */
  const [dashboardLayout, setDashboardLayout] = useState<DashboardLayout>(preferences?.dashboardLayout || 'grid');
  const [enabledCards, setEnabledCards] = useState<string[]>(preferences?.enabledCards || ['mail', 'calendar', 'docs', 'media']);
  const [presetCardCategories, setPresetCardCategories] = useState<Record<string, string>>(
    preferences?.presetCardCategories ?? { mail: 'Work', calendar: 'Work', docs: 'Work', media: 'Personal', notes: 'Work', analytics: 'Work' }
  );
  const [customActions, setCustomActions] = useState<CustomQuickAction[]>(preferences?.customQuickActions || []);
  const [categories, setCategories] = useState<string[]>(preferences?.categories || DEFAULT_CATEGORIES);
  const [newCategory, setNewCategory] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newIcon, setNewIcon] = useState('link');
  const [newUrl, setNewUrl] = useState('');
  const [newActionCategory, setNewActionCategory] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);

  /* ── Search ── */
  const [searchEngine, setSearchEngine] = useState(preferences?.searchEngine || 'duckduckgo');
  const [greeting, setGreeting] = useState(preferences?.greeting || '');

  /* ── Account ── */
  const [displayNameVal, setDisplayNameVal] = useState(initDisplayName);

  const save = async (patch: Record<string, unknown>) => {
    await fetch('/api/user/preferences', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...patch }),
    });
    await update({ refresh: true });
    router.refresh();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const navItems: { id: NavSection; label: string; icon: string }[] = [
    { id: 'appearance', label: 'Appearance', icon: 'palette' },
    { id: 'layout',     label: 'Layout',     icon: 'dashboard_customize' },
    { id: 'search',     label: 'Search',     icon: 'search' },
    { id: 'account',    label: 'Account',    icon: 'manage_accounts' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--font-canvas-body)' }}>

      {/* ── Left nav ── */}
      <div style={{
        width: '219px', flexShrink: 0, padding: '55px 14px 55px 28px',
        display: 'flex', flexDirection: 'column', gap: '2px',
        borderRight: '1px solid rgba(255,255,255,0.04)',
      }}>
        <p style={{ fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--canvas-on-surface-variant)', opacity: 0.5, marginBottom: '14px', paddingLeft: '9px' }}>
          Settings
        </p>
        {navItems.map(item => {
          const active = activeSection === item.id;
          return (
            <button key={item.id} onClick={() => setActiveSection(item.id)} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 14px', borderRadius: '12px', border: 'none', cursor: 'pointer',
              textAlign: 'left', width: '100%', fontSize: '15px', fontWeight: active ? 600 : 400,
              background: active ? 'var(--canvas-surface-high)' : 'transparent',
              color: active ? 'var(--canvas-primary)' : 'var(--canvas-on-surface-variant)',
              boxShadow: active ? `inset 3px 3px 6px var(--canvas-shadow-dark), inset -3px -3px 6px var(--canvas-shadow-light)` : 'none',
              fontFamily: 'var(--font-canvas-body)', transition: 'all 0.15s ease',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px', fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, padding: '55px 64px', maxWidth: '851px', overflowY: 'auto' }}>

        {/* ══════ APPEARANCE ══════ */}
        {activeSection === 'appearance' && (
          <div>
            <SectionTitle label="Appearance" />
            <p style={{ fontSize: '15px', color: 'var(--canvas-on-surface-variant)', marginBottom: '32px' }}>Theme and accent color for your workspace.</p>

            <SectionLabel text="Theme" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
              {THEMES.map(t => {
                const active = theme === t.id;
                return (
                  <button key={t.id} onClick={() => setTheme(t.id as typeof theme)} style={{
                    borderRadius: '16px', border: active ? `1.5px solid var(--canvas-primary)` : '1.5px solid rgba(255,255,255,0.05)',
                    padding: '16px 18px', cursor: 'pointer', textAlign: 'left',
                    background: active ? 'var(--canvas-surface-high)' : 'var(--canvas-surface)',
                    boxShadow: `inset 3px 3px 6px var(--canvas-shadow-dark), inset -3px -3px 6px var(--canvas-shadow-light)`,
                    transition: 'all 0.2s ease', position: 'relative',
                  }}>
                    <div style={{ display: 'flex', gap: '5px', marginBottom: '9px', alignItems: 'center' }}>
                      <div style={{ width: '30px', height: '21px', borderRadius: '5px', background: t.bg, border: '1px solid rgba(255,255,255,0.1)' }} />
                      <div style={{ width: '21px', height: '21px', borderRadius: '5px', background: t.surface }} />
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: t.primary, marginLeft: '3px', boxShadow: `0 0 6px ${t.primary}70` }} />
                    </div>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--canvas-on-surface)' }}>{t.label}</span>
                    {active && <span className="material-symbols-outlined" style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '17px', color: 'var(--canvas-primary)', fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
                  </button>
                );
              })}
            </div>

            <SectionLabel text="Accent color" />
            <div className="canvas-recessed" style={{ display: 'flex', gap: '12px', padding: '18px', borderRadius: '14px' }}>
              {ACCENTS.map(color => (
                <button key={color} onClick={() => setAccentColor(color)} style={{
                  width: '39px', height: '39px', borderRadius: '50%', border: 'none', cursor: 'pointer', background: color,
                  boxShadow: accentColor === color ? `0 0 0 3px var(--canvas-bg), 0 0 0 5px ${color}` : `inset 2px 2px 4px rgba(0,0,0,0.4)`,
                  transition: 'box-shadow 0.2s ease',
                }} />
              ))}
            </div>

            <SaveBtn onClick={() => save({ theme, accentColor })} saved={saved} />
          </div>
        )}

        {/* ══════ LAYOUT (categories + quick actions) ══════ */}
        {activeSection === 'layout' && (
          <div>
            <SectionTitle label="Layout" />
            <p style={{ fontSize: '15px', color: 'var(--canvas-on-surface-variant)', marginBottom: '32px' }}>Choose how categories and quick actions appear on your home dashboard.</p>

            {/* ── Dashboard layout picker ── */}
            <SectionLabel text="Dashboard layout" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '37px' }}>
              {DASHBOARD_LAYOUTS.map(layout => {
                const active = dashboardLayout === layout.id;
                return (
                  <button key={layout.id} onClick={() => setDashboardLayout(layout.id)} style={{
                    borderRadius: '16px', border: active ? '1.5px solid var(--canvas-primary)' : '1.5px solid rgba(255,255,255,0.05)',
                    padding: '16px 18px', cursor: 'pointer', textAlign: 'left',
                    background: active ? 'var(--canvas-surface-high)' : 'var(--canvas-surface)',
                    boxShadow: `inset 3px 3px 6px var(--canvas-shadow-dark), inset -3px -3px 6px var(--canvas-shadow-light)`,
                    transition: 'all 0.2s ease', position: 'relative',
                  }}>
                    <div style={{ marginBottom: '12px' }}>
                      <LayoutPreview id={layout.id} />
                    </div>
                    <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--canvas-on-surface)', margin: '0 0 2px' }}>{layout.label}</p>
                    <p style={{ fontSize: '13px', color: 'var(--canvas-on-surface-variant)', opacity: 0.6, margin: 0 }}>{layout.desc}</p>
                    {active && <span className="material-symbols-outlined" style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '17px', color: 'var(--canvas-primary)', fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
                  </button>
                );
              })}
            </div>

            {/* ── Categories ── */}
            <SectionLabel text="Categories" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '9px', marginBottom: '14px' }}>
              {categories.map(cat => (
                <div key={cat} style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '9999px',
                  background: 'var(--canvas-surface-high)',
                  boxShadow: `inset 2px 2px 4px var(--canvas-shadow-dark), inset -2px -2px 4px var(--canvas-shadow-light)`,
                }}>
                  <span style={{ fontSize: '15px', color: 'var(--canvas-on-surface)' }}>{cat}</span>
                  {categories.length > 1 && (
                    <button onClick={() => setCategories(p => p.filter(c => c !== cat))} style={{
                      width: '18px', height: '18px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                      background: 'rgba(255,255,255,0.08)', color: 'var(--canvas-on-surface-variant)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>close</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '9px', marginBottom: '37px' }}>
              <div className="canvas-recessed" style={{ flex: 1, borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '0 16px', height: '46px' }}>
                <input value={newCategory} onChange={e => setNewCategory(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && newCategory.trim() && !categories.includes(newCategory.trim())) { setCategories(p => [...p, newCategory.trim()]); setNewCategory(''); } }}
                  placeholder="New category..."
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '15px', color: 'var(--canvas-on-surface)', fontFamily: 'var(--font-canvas-body)' }} />
              </div>
              <button onClick={() => { const t = newCategory.trim(); if (t && !categories.includes(t)) { setCategories(p => [...p, t]); setNewCategory(''); } }} style={{
                padding: '0 18px', height: '46px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                fontSize: '15px', fontWeight: 600, background: 'var(--canvas-primary)', color: 'var(--canvas-bg)', fontFamily: 'var(--font-canvas-body)',
              }}>Add</button>
            </div>

            {/* ── Preset quick actions ── */}
            <SectionLabel text="Quick actions — preset" />
            <div className="canvas-recessed" style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '23px' }}>
              {PRESET_CARDS.map((card, i) => {
                const enabled = enabledCards.includes(card.id);
                const assignedCat = presetCardCategories[card.id] || 'Work';
                return (
                  <div key={card.id} style={{
                    display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 21px',
                    borderBottom: i < PRESET_CARDS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '21px', color: 'var(--canvas-primary)', fontVariationSettings: "'FILL' 1" }}>{card.icon}</span>
                    <span style={{ fontSize: '16px', color: 'var(--canvas-on-surface)', minWidth: '83px' }}>{card.label}</span>
                    {/* Category chips */}
                    <div style={{ flex: 1, display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      {categories.filter(c => c !== 'All').map(cat => (
                        <button key={cat} onClick={() => setPresetCardCategories(p => ({ ...p, [card.id]: cat }))} style={{
                          padding: '3px 12px', borderRadius: '9999px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                          background: assignedCat === cat ? 'var(--canvas-primary)' : 'var(--canvas-surface-highest)',
                          color: assignedCat === cat ? 'var(--canvas-bg)' : 'var(--canvas-on-surface-variant)',
                          fontFamily: 'var(--font-canvas-body)', transition: 'all 0.15s ease',
                        }}>{cat}</button>
                      ))}
                    </div>
                    <button onClick={() => setEnabledCards(p => enabled ? p.filter(id => id !== card.id) : [...p, card.id])} style={{
                      width: '46px', height: '25px', borderRadius: '13px', border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0,
                      background: enabled ? 'var(--canvas-primary)' : 'var(--canvas-surface-highest)',
                      transition: 'background 0.2s ease',
                    }}>
                      <div style={{
                        width: '18px', height: '18px', borderRadius: '50%', position: 'absolute', top: '4px',
                        left: enabled ? '24px' : '4px', background: enabled ? 'var(--canvas-bg)' : 'var(--canvas-on-surface-variant)',
                        transition: 'left 0.2s ease',
                      }} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* ── Custom quick actions ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <SectionLabel text="Quick actions — custom" />
              <button onClick={() => setShowAddForm(v => !v)} style={{
                padding: '6px 16px', borderRadius: '9px', border: 'none', cursor: 'pointer',
                fontSize: '14px', fontWeight: 600, background: 'var(--canvas-surface-high)', color: 'var(--canvas-primary)',
                boxShadow: `-2px -2px 4px var(--canvas-shadow-light), 2px 2px 4px var(--canvas-shadow-dark)`,
                fontFamily: 'var(--font-canvas-body)',
              }}>
                {showAddForm ? 'Cancel' : '+ Add'}
              </button>
            </div>

            {showAddForm && (
              <div className="canvas-recessed" style={{ borderRadius: '16px', padding: '18px', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Label (e.g. GitHub)" style={inputStyle} />
                <input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="URL (e.g. https://github.com)" style={inputStyle} />
                {/* Category assignment */}
                <div>
                  <p style={{ fontSize: '14px', color: 'var(--canvas-on-surface-variant)', margin: '0 0 7px' }}>Category</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                    {categories.map(cat => (
                      <button key={cat} onClick={() => setNewActionCategory(cat)} style={{
                        padding: '6px 16px', borderRadius: '9999px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500,
                        background: newActionCategory === cat ? 'var(--canvas-primary)' : 'var(--canvas-surface-highest)',
                        color: newActionCategory === cat ? 'var(--canvas-bg)' : 'var(--canvas-on-surface-variant)',
                        fontFamily: 'var(--font-canvas-body)', transition: 'all 0.15s ease',
                      }}>{cat}</button>
                    ))}
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--canvas-on-surface-variant)', margin: 0 }}>Icon</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', maxHeight: '184px', overflowY: 'auto' }}>
                  {ICON_OPTIONS.map(ico => (
                    <button key={ico} onClick={() => setNewIcon(ico)} title={ico} style={{
                      width: '39px', height: '39px', borderRadius: '9px', border: 'none', cursor: 'pointer',
                      background: newIcon === ico ? 'var(--canvas-primary)' : 'var(--canvas-surface-highest)',
                      color: newIcon === ico ? 'var(--canvas-bg)' : 'var(--canvas-on-surface-variant)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease',
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>{ico}</span>
                    </button>
                  ))}
                </div>
                <button onClick={() => {
                  if (!newLabel.trim() || !newUrl.trim()) return;
                  setCustomActions(p => [...p, { id: crypto.randomUUID(), label: newLabel.trim(), icon: newIcon, url: newUrl.trim(), category: newActionCategory }]);
                  setNewLabel(''); setNewUrl(''); setNewIcon('link'); setNewActionCategory('All'); setShowAddForm(false);
                }} style={{
                  padding: '10px 23px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                  fontSize: '15px', fontWeight: 600, background: 'var(--canvas-primary)', color: 'var(--canvas-bg)',
                  fontFamily: 'var(--font-canvas-body)', alignSelf: 'flex-start',
                }}>Add shortcut</button>
              </div>
            )}

            {customActions.length > 0 && (
              <div className="canvas-recessed" style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '4px' }}>
                {customActions.map((action, i) => (
                  <div key={action.id} style={{
                    display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 21px',
                    borderBottom: i < customActions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '21px', color: 'var(--canvas-primary)', fontVariationSettings: "'FILL' 1" }}>{action.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--canvas-on-surface)', margin: 0 }}>{action.label}</p>
                      <p style={{ fontSize: '13px', color: 'var(--canvas-on-surface-variant)', opacity: 0.6, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{action.url} · <span style={{ color: 'var(--canvas-primary)', opacity: 0.8 }}>{action.category || 'All'}</span></p>
                    </div>
                    <button onClick={() => setCustomActions(p => p.filter(a => a.id !== action.id))} style={{
                      width: '32px', height: '32px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                      background: 'rgba(186,26,26,0.15)', color: '#ffdad6',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <SaveBtn onClick={() => save({ dashboardLayout, enabledCards, presetCardCategories, customQuickActions: customActions, categories })} saved={saved} />
          </div>
        )}

        {/* ══════ SEARCH ══════ */}
        {activeSection === 'search' && (
          <div>
            <SectionTitle label="Search & Greeting" />
            <p style={{ fontSize: '15px', color: 'var(--canvas-on-surface-variant)', marginBottom: '32px' }}>Search engine and greeting name shown on your dashboard.</p>

            <SectionLabel text="Search engine" />
            <div className="canvas-recessed" style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '32px' }}>
              {ENGINES.map((eng, i) => (
                <button key={eng.value} onClick={() => setSearchEngine(eng.value as typeof searchEngine)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '15px 21px', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
                  borderBottom: i < ENGINES.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  background: searchEngine === eng.value ? 'var(--canvas-surface-high)' : 'transparent',
                  color: searchEngine === eng.value ? 'var(--canvas-on-surface)' : 'var(--canvas-on-surface-variant)',
                  fontSize: '16px', fontWeight: 500, fontFamily: 'var(--font-canvas-body)', transition: 'all 0.15s ease',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '21px', color: 'var(--canvas-primary)' }}>{eng.icon}</span>
                    {eng.label}
                  </div>
                  {searchEngine === eng.value && <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--canvas-primary)', fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
                </button>
              ))}
            </div>

            <SectionLabel text="Greeting name" />
            <div className="canvas-recessed" style={{ borderRadius: '14px', display: 'flex', alignItems: 'center', padding: '0 21px', height: '58px', marginBottom: '7px' }}>
              <input value={greeting} onChange={e => setGreeting(e.target.value)} placeholder={`e.g. "Sanchit J"`}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '16px', color: 'var(--canvas-on-surface)', fontFamily: 'var(--font-canvas-body)' }} />
            </div>
            <p style={{ fontSize: '14px', color: 'var(--canvas-on-surface-variant)', opacity: 0.5 }}>Appears in "Good morning, [name]." on your dashboard.</p>

            <SaveBtn onClick={() => save({ searchEngine, greeting })} saved={saved} />
          </div>
        )}

        {/* ══════ ACCOUNT ══════ */}
        {activeSection === 'account' && (
          <div>
            <SectionTitle label="Account" />
            <p style={{ fontSize: '15px', color: 'var(--canvas-on-surface-variant)', marginBottom: '32px' }}>Manage your profile and data.</p>

            <SectionLabel text="Display name" />
            <div className="canvas-recessed" style={{ borderRadius: '14px', display: 'flex', alignItems: 'center', padding: '0 21px', height: '58px', marginBottom: '4px' }}>
              <input value={displayNameVal} onChange={e => setDisplayNameVal(e.target.value)} placeholder="Your display name"
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '16px', color: 'var(--canvas-on-surface)', fontFamily: 'var(--font-canvas-body)' }} />
            </div>

            <SaveBtn onClick={() => save({ displayName: displayNameVal })} saved={saved} />

            <div style={{ marginTop: '46px', padding: '23px 28px', borderRadius: '16px', border: '1px dashed rgba(186,26,26,0.3)' }}>
              <p style={{ fontSize: '16px', fontWeight: 600, color: '#ffdad6', margin: '0 0 4px' }}>Reset data</p>
              <p style={{ fontSize: '15px', color: 'var(--canvas-on-surface-variant)', margin: '0 0 18px' }}>Permanently deletes all To-Do items and Watch List entries. Preferences and themes are kept.</p>
              <button disabled={resetting} onClick={async () => {
                if (!confirm('Delete all todos and watch list items? This cannot be undone.')) return;
                setResetting(true);
                await resetUserData(userId);
                router.refresh();
                setResetting(false);
              }} style={{
                padding: '10px 23px', borderRadius: '12px', border: 'none', cursor: resetting ? 'default' : 'pointer',
                fontSize: '15px', fontWeight: 600, background: 'rgba(186,26,26,0.15)', color: '#ffdad6',
                fontFamily: 'var(--font-canvas-body)', opacity: resetting ? 0.6 : 1,
                boxShadow: `-2px -2px 4px var(--canvas-shadow-light), 2px 2px 4px var(--canvas-shadow-dark)`,
              }}>
                {resetting ? 'Resetting…' : 'Reset data'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'var(--canvas-surface-highest)', border: '1px solid rgba(255,255,255,0.05)',
  outline: 'none', fontSize: '16px', color: 'var(--canvas-on-surface)',
  fontFamily: 'var(--font-canvas-body)', boxSizing: 'border-box', padding: '12px 16px', borderRadius: '12px',
};
