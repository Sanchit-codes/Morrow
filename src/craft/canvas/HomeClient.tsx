'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { CustomQuickAction, DashboardLayout } from '@/schema';

const SEARCH_URLS: Record<string, string> = {
  google:     'https://www.google.com/search?q=',
  duckduckgo: 'https://duckduckgo.com/?q=',
  ecosia:     'https://www.ecosia.org/search?q=',
  bing:       'https://www.bing.com/search?q=',
};

const PRESET_CARDS = [
  { id: 'mail',      icon: 'mail',          label: 'Mail',      href: 'https://mail.google.com' },
  { id: 'calendar',  icon: 'calendar_month', label: 'Calendar',  href: '/focus' },
  { id: 'docs',      icon: 'description',   label: 'Docs',      href: 'https://docs.google.com' },
  { id: 'media',     icon: 'play_circle',   label: 'Media',     href: '/queue' },
  { id: 'notes',     icon: 'edit_note',     label: 'Notes',     href: '#' },
  { id: 'analytics', icon: 'analytics',     label: 'Analytics', href: '#' },
];

const DEFAULT_PRESET_CATEGORIES: Record<string, string> = {
  mail: 'Work', calendar: 'Work', docs: 'Work',
  media: 'Personal', notes: 'Work', analytics: 'Work',
};

const DEFAULT_CATEGORIES = ['All', 'Work', 'Design', 'Dev', 'Personal'];

type CardItem = { id: string; icon: string; label: string; href: string; isCustom?: boolean; category: string };

interface Props {
  user: {
    displayName?: string;
    preferences?: {
      greeting?: string;
      searchEngine?: string;
      enabledCards?: string[];
      categories?: string[];
      customQuickActions?: CustomQuickAction[];
      presetCardCategories?: Record<string, string>;
      dashboardLayout?: DashboardLayout;
    };
  };
  userId: string;
}

function getGreetingPrefix() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function LiveClock() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
      setDate(now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  if (!time) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--canvas-on-surface-variant)', opacity: 0.5 }}>
      <span style={{ fontFamily: 'var(--font-canvas-heading)', fontSize: '15px', fontWeight: 600, letterSpacing: '0.04em' }}>{time}</span>
      <span style={{ width: '1px', height: '14px', background: 'currentColor', opacity: 0.4 }} />
      <span style={{ fontFamily: 'var(--font-canvas-body)', fontSize: '13px' }}>{date}</span>
    </div>
  );
}

function CardLink({ card, children, style, onMouseEnter, onMouseLeave, title }: {
  card: CardItem; children: React.ReactNode; style: React.CSSProperties;
  onMouseEnter?: () => void; onMouseLeave?: () => void; title?: string;
}) {
  const isExternal = card.href.startsWith('http') || card.isCustom;
  return isExternal
    ? <a href={card.href} target="_blank" rel="noopener noreferrer" style={style} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} title={title}>{children}</a>
    : <Link href={card.href} style={style} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} title={title}>{children}</Link>;
}

function GridCard({ card }: { card: CardItem }) {
  const [hov, setHov] = useState(false);
  return (
    <CardLink card={card} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px', borderRadius: '16px', textDecoration: 'none',
      background: hov ? 'var(--canvas-surface-high)' : 'var(--canvas-surface)',
      border: hov ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.02)',
      boxShadow: hov ? `-3px -3px 6px var(--canvas-shadow-light), 3px 3px 6px var(--canvas-shadow-dark)` : `inset 3px 3px 7px var(--canvas-shadow-dark), inset -3px -3px 7px var(--canvas-shadow-light)`,
      transition: 'all 0.2s ease', cursor: 'pointer',
    }}>
      <div style={{ width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--canvas-surface-high)', color: hov ? 'var(--canvas-primary)' : 'var(--canvas-on-surface-variant)', boxShadow: `inset 3px 3px 6px var(--canvas-shadow-dark), inset -3px -3px 6px var(--canvas-shadow-light)`, transition: 'color 0.2s ease' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '20px', fontVariationSettings: hov ? "'FILL' 1" : "'FILL' 0" }}>{card.icon}</span>
      </div>
      <span style={{ fontSize: '14px', fontWeight: 600, color: hov ? 'var(--canvas-on-surface)' : 'var(--canvas-on-surface-variant)', fontFamily: 'var(--font-canvas-body)', transition: 'color 0.2s ease' }}>{card.label}</span>
    </CardLink>
  );
}

function StreamCard({ card }: { card: CardItem }) {
  const [hov, setHov] = useState(false);
  return (
    <CardLink card={card} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 16px', borderRadius: '9999px', textDecoration: 'none',
      background: hov ? 'var(--canvas-surface-high)' : 'var(--canvas-surface)',
      border: hov ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.02)',
      boxShadow: hov ? `-2px -2px 5px var(--canvas-shadow-light), 2px 2px 5px var(--canvas-shadow-dark)` : `inset 2px 2px 5px var(--canvas-shadow-dark), inset -2px -2px 5px var(--canvas-shadow-light)`,
      transition: 'all 0.2s ease', cursor: 'pointer',
    }}>
      <span className="material-symbols-outlined" style={{ fontSize: '16px', color: hov ? 'var(--canvas-primary)' : 'var(--canvas-on-surface-variant)', fontVariationSettings: hov ? "'FILL' 1" : "'FILL' 0", transition: 'color 0.2s ease' }}>{card.icon}</span>
      <span style={{ fontSize: '13px', fontWeight: 500, color: hov ? 'var(--canvas-on-surface)' : 'var(--canvas-on-surface-variant)', fontFamily: 'var(--font-canvas-body)', transition: 'color 0.2s ease', whiteSpace: 'nowrap' }}>{card.label}</span>
    </CardLink>
  );
}

function CompactCard({ card }: { card: CardItem }) {
  const [hov, setHov] = useState(false);
  return (
    <CardLink card={card} title={card.label} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      width: '56px', height: '56px', borderRadius: '16px', textDecoration: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: hov ? 'var(--canvas-surface-high)' : 'var(--canvas-surface)',
      border: hov ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.02)',
      boxShadow: hov ? `-2px -2px 5px var(--canvas-shadow-light), 2px 2px 5px var(--canvas-shadow-dark)` : `inset 2px 2px 5px var(--canvas-shadow-dark), inset -2px -2px 5px var(--canvas-shadow-light)`,
      transition: 'all 0.2s ease', cursor: 'pointer',
    }}>
      <span className="material-symbols-outlined" style={{ fontSize: '22px', color: hov ? 'var(--canvas-primary)' : 'var(--canvas-on-surface-variant)', fontVariationSettings: hov ? "'FILL' 1" : "'FILL' 0", transition: 'color 0.2s ease' }}>{card.icon}</span>
    </CardLink>
  );
}

function BentoSquare({ card }: { card: CardItem }) {
  const [hov, setHov] = useState(false);
  return (
    <CardLink card={card} title={card.label} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      aspectRatio: '1/1', borderRadius: '18px', textDecoration: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: hov ? 'var(--canvas-surface-high)' : 'var(--canvas-surface)',
      border: hov ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.02)',
      boxShadow: hov ? `-3px -3px 6px var(--canvas-shadow-light), 3px 3px 6px var(--canvas-shadow-dark)` : `inset 3px 3px 7px var(--canvas-shadow-dark), inset -3px -3px 7px var(--canvas-shadow-light)`,
      transition: 'all 0.2s ease', cursor: 'pointer',
    }}>
      <span className="material-symbols-outlined" style={{ fontSize: '26px', color: hov ? 'var(--canvas-primary)' : 'var(--canvas-on-surface-variant)', fontVariationSettings: hov ? "'FILL' 1" : "'FILL' 0", transition: 'color 0.2s ease' }}>{card.icon}</span>
    </CardLink>
  );
}

function BentoPanel({ title, cards }: { title: string; cards: CardItem[] }) {
  const [hov, setHov] = useState<string | null>(null);
  return (
    <div style={{
      borderRadius: '18px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '2px',
      background: 'var(--canvas-surface)',
      border: '1px solid rgba(255,255,255,0.04)',
      boxShadow: `inset 3px 3px 7px var(--canvas-shadow-dark), inset -3px -3px 7px var(--canvas-shadow-light)`,
    }}>
      <p style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--canvas-primary)', opacity: 0.75, margin: '0 0 12px', fontFamily: 'var(--font-canvas-body)' }}>{title}</p>
      {cards.map(card => {
        const isExt = card.href.startsWith('http') || card.isCustom;
        const h = hov === card.id;
        const linkStyle: React.CSSProperties = {
          display: 'flex', alignItems: 'center', gap: '9px', padding: '6px 8px', borderRadius: '9px',
          textDecoration: 'none', transition: 'all 0.15s ease', cursor: 'pointer',
          background: h ? 'var(--canvas-surface-high)' : 'transparent',
          color: h ? 'var(--canvas-on-surface)' : 'var(--canvas-on-surface-variant)',
        };
        const inner = (
          <>
            <span className="material-symbols-outlined" style={{ fontSize: '14px', color: h ? 'var(--canvas-primary)' : 'var(--canvas-on-surface-variant)', fontVariationSettings: h ? "'FILL' 1" : "'FILL' 0", transition: 'color 0.15s ease', flexShrink: 0 }}>{card.icon}</span>
            <span style={{ fontSize: '13px', fontWeight: 500, fontFamily: 'var(--font-canvas-body)', transition: 'color 0.15s ease' }}>{card.label}</span>
          </>
        );
        return isExt
          ? <a key={card.id} href={card.href} target="_blank" rel="noopener noreferrer" style={linkStyle} onMouseEnter={() => setHov(card.id)} onMouseLeave={() => setHov(null)}>{inner}</a>
          : <Link key={card.id} href={card.href} style={linkStyle} onMouseEnter={() => setHov(card.id)} onMouseLeave={() => setHov(null)}>{inner}</Link>;
      })}
    </div>
  );
}

function CategoryPills({ categories, active, onSelect }: { categories: string[]; active: string; onSelect: (c: string) => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
      {categories.map(cat => {
        const isActive = active === cat;
        return (
          <button key={cat} onClick={() => onSelect(cat)} style={{
            padding: '7px 22px', borderRadius: '9999px', fontSize: '13px', fontWeight: isActive ? 600 : 400,
            border: 'none', cursor: 'pointer', transition: 'all 0.2s ease',
            background: isActive ? 'var(--canvas-surface-highest)' : 'var(--canvas-surface-high)',
            color: isActive ? 'var(--canvas-on-surface)' : 'var(--canvas-on-surface-variant)',
            fontFamily: 'var(--font-canvas-body)',
            boxShadow: isActive ? `inset 3px 3px 6px var(--canvas-shadow-dark), inset -3px -3px 6px var(--canvas-shadow-light)` : `-2px -2px 4px var(--canvas-shadow-light), 2px 2px 4px var(--canvas-shadow-dark)`,
          }}>{cat}</button>
        );
      })}
    </div>
  );
}

function CategoryTabs({ categories, active, onSelect }: { categories: string[]; active: string; onSelect: (c: string) => void }) {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', width: '100%' }}>
      {categories.map(cat => {
        const isActive = active === cat;
        return (
          <button key={cat} onClick={() => onSelect(cat)} style={{
            padding: '9px 18px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: isActive ? 600 : 400,
            background: 'transparent', fontFamily: 'var(--font-canvas-body)', transition: 'all 0.15s ease',
            color: isActive ? 'var(--canvas-primary)' : 'var(--canvas-on-surface-variant)',
            borderBottom: isActive ? '2px solid var(--canvas-primary)' : '2px solid transparent',
            marginBottom: '-1px',
          }}>{cat}</button>
        );
      })}
    </div>
  );
}

/* ────────────────────────────────────────
   EDIT MODE
──────────────────────────────────────── */

function Editable({ card, editMode, onEdit, children, style }: {
  card: CardItem; editMode: boolean; onEdit: (id: string) => void;
  children: React.ReactNode; style?: React.CSSProperties;
}) {
  if (!editMode) return <>{children}</>;
  return (
    <div style={{ position: 'relative', ...style }}>
      {children}
      <div
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(card.id); }}
        style={{
          position: 'absolute', inset: 0, cursor: 'pointer', zIndex: 20,
          borderRadius: '14px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(187, 199, 221, 0.06)',
          border: '1.5px dashed rgba(187, 199, 221, 0.28)',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--canvas-primary)', opacity: 0.85, fontVariationSettings: "'FILL' 1" }}>edit</span>
      </div>
    </div>
  );
}

function CardEditorPanel({ card, categories, saving, onSave, onClose }: {
  card: CardItem; categories: string[]; saving: boolean;
  onSave: (id: string, updates: { label: string; icon: string; href: string; category: string }) => void;
  onClose: () => void;
}) {
  const [label, setLabel] = useState(card.label);
  const [icon, setIcon]   = useState(card.icon);
  const [href, setHref]   = useState(card.href);
  const [category, setCategory] = useState(card.category);

  const textRow = (lbl: string, value: string, set: (v: string) => void, placeholder?: string) => (
    <div style={{ marginBottom: '18px' }}>
      <p style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--canvas-on-surface-variant)', opacity: 0.45, margin: '0 0 8px', fontFamily: 'var(--font-canvas-body)' }}>{lbl}</p>
      <div style={{ background: 'var(--canvas-surface-highest)', borderRadius: '9px', padding: '0 12px', height: '38px', display: 'flex', alignItems: 'center' }}>
        <input value={value} onChange={e => set(e.target.value)} placeholder={placeholder}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '13px', color: 'var(--canvas-on-surface)', fontFamily: 'var(--font-canvas-body)' }} />
      </div>
    </div>
  );

  return (
    <div style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: '240px', zIndex: 200, background: 'var(--canvas-surface)', borderLeft: '1px solid rgba(255,255,255,0.05)', boxShadow: '-12px 0 48px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-canvas-body)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 18px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '15px', color: 'var(--canvas-primary)', fontVariationSettings: "'FILL' 1" }}>{icon || card.icon}</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--canvas-on-surface)' }}>Edit Shortcut</span>
        </div>
        <button onClick={onClose} style={{ width: '26px', height: '26px', borderRadius: '7px', border: 'none', cursor: 'pointer', background: 'var(--canvas-surface-high)', color: 'var(--canvas-on-surface-variant)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px' }}>
        {textRow('Label', label, setLabel)}
        <div style={{ marginBottom: '18px' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--canvas-on-surface-variant)', opacity: 0.45, margin: '0 0 8px', fontFamily: 'var(--font-canvas-body)' }}>Icon</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--canvas-surface-highest)', borderRadius: '9px', padding: '0 12px', height: '38px', display: 'flex', alignItems: 'center', flex: 1 }}>
              <input value={icon} onChange={e => setIcon(e.target.value)} placeholder="e.g. home"
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '13px', color: 'var(--canvas-on-surface)', fontFamily: 'var(--font-canvas-body)' }} />
            </div>
            <span className="material-symbols-outlined" style={{ fontSize: '22px', color: 'var(--canvas-primary)', fontVariationSettings: "'FILL' 1", flexShrink: 0 }}>{icon || 'link'}</span>
          </div>
        </div>
        {textRow('URL', href, setHref, 'https://…')}

        <div>
          <p style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--canvas-on-surface-variant)', opacity: 0.45, margin: '0 0 8px', fontFamily: 'var(--font-canvas-body)' }}>Category</p>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {categories.filter(c => c !== 'All').map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500, fontFamily: 'var(--font-canvas-body)', transition: 'all 0.15s', background: category === cat ? 'var(--canvas-primary)' : 'var(--canvas-surface-highest)', color: category === cat ? 'var(--canvas-bg)' : 'var(--canvas-on-surface-variant)' }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '14px 18px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button onClick={() => onSave(card.id, { label, icon, href, category })} disabled={saving} style={{ width: '100%', height: '38px', borderRadius: '9px', border: 'none', cursor: saving ? 'default' : 'pointer', fontSize: '13px', fontWeight: 600, background: 'var(--canvas-primary)', color: 'var(--canvas-bg)', fontFamily: 'var(--font-canvas-body)', opacity: saving ? 0.65 : 1 }}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────
   MAIN
──────────────────────────────────────── */

export default function HomeClient({ user, userId }: Props) {
  const { update } = useSession();
  const router = useRouter();

  const [query, setQuery]               = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [editMode, setEditMode]         = useState(false);
  const [editCardId, setEditCardId]     = useState<string | null>(null);
  const [saving, setSaving]             = useState(false);

  const engine       = user.preferences?.searchEngine || 'duckduckgo';
  const enabledIds   = user.preferences?.enabledCards || ['mail', 'calendar', 'docs', 'media'];
  const categories   = user.preferences?.categories || DEFAULT_CATEGORIES;
  const customActions = user.preferences?.customQuickActions || [];
  const presetCats   = { ...DEFAULT_PRESET_CATEGORIES, ...(user.preferences?.presetCardCategories ?? {}) };
  const layout: DashboardLayout = user.preferences?.dashboardLayout || 'grid';

  const greetingName = user.preferences?.greeting;
  const greeting = greetingName ? `${getGreetingPrefix()}, ${greetingName}.` : `${getGreetingPrefix()}.`;

  const allCards: CardItem[] = [
    ...PRESET_CARDS.filter(c => enabledIds.includes(c.id)).map(c => ({ ...c, category: presetCats[c.id] || 'Work' })),
    ...customActions.map(a => ({ id: a.id, icon: a.icon, label: a.label, href: a.url, isCustom: true, category: a.category || 'All' })),
  ];

  const visibleCards = activeCategory === 'All' ? allCards : allCards.filter(c => c.category === activeCategory);

  const editCard = editCardId ? allCards.find(c => c.id === editCardId) ?? null : null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const url = query.startsWith('http') ? query : `${SEARCH_URLS[engine]}${encodeURIComponent(query)}`;
    window.location.href = url;
  };

  const handleSaveCard = async (cardId: string, updates: { label: string; icon: string; href: string; category: string }) => {
    setSaving(true);
    const card = allCards.find(c => c.id === cardId);
    if (!card) { setSaving(false); return; }

    if (card.isCustom) {
      const newActions = customActions.map(a =>
        a.id === cardId ? { ...a, label: updates.label, icon: updates.icon, url: updates.href, category: updates.category } : a
      );
      await fetch('/api/user/preferences', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, customQuickActions: newActions }),
      });
    } else {
      const presetDefaults = PRESET_CARDS.find(c => c.id === cardId);
      const isModified = presetDefaults && (
        updates.label !== presetDefaults.label ||
        updates.icon !== presetDefaults.icon ||
        updates.href !== presetDefaults.href
      );
      if (isModified) {
        const newEnabledIds = enabledIds.filter(id => id !== cardId);
        const newCustomActions = [...customActions, {
          id: cardId, label: updates.label, icon: updates.icon, url: updates.href, category: updates.category,
        }];
        await fetch('/api/user/preferences', {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, enabledCards: newEnabledIds, customQuickActions: newCustomActions }),
        });
      } else {
        await fetch('/api/user/preferences', {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, presetCardCategories: { ...presetCats, [cardId]: updates.category } }),
        });
      }
    }

    await update({ refresh: true });
    router.refresh();
    setEditCardId(null);
    setSaving(false);
  };

  const clockBar = (
    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '8px' }}>
      <LiveClock />
    </div>
  );

  const greetingBlock = (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font-canvas-heading)', fontSize: '52px', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--canvas-on-surface)', lineHeight: 1.1, margin: 0 }}>{greeting}</h1>
      <p style={{ fontSize: '17px', color: 'var(--canvas-on-surface-variant)', marginTop: '10px', opacity: 0.7, fontFamily: 'var(--font-canvas-body)' }}>What will we discover today?</p>
    </div>
  );

  const searchBar = (
    <form onSubmit={handleSearch} style={{ width: '100%' }}>
      <div className="canvas-search-recessed" style={{ height: '58px', borderRadius: '9999px', display: 'flex', alignItems: 'center', padding: '0 24px', gap: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--canvas-on-surface-variant)', opacity: 0.7 }}>search</span>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search the web or type a URL…"
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '15px', color: 'var(--canvas-on-surface)', fontFamily: 'var(--font-canvas-body)' }} />
      </div>
    </form>
  );

  const wrap = (children: React.ReactNode) => (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '28px 56px 0', background: 'var(--canvas-bg)' }}>
      {clockBar}{children}
    </div>
  );

  const center = (children: React.ReactNode, pb = '48px') => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '26px', maxWidth: '680px', margin: '0 auto', width: '100%', paddingBottom: pb }}>
      {children}
    </div>
  );

  /* Edit FAB — only show when there are quick actions to edit */
  const editFAB = allCards.length > 0 && (
    <button
      onClick={() => { setEditMode(v => !v); if (editMode) setEditCardId(null); }}
      title={editMode ? 'Done editing' : 'Edit shortcuts'}
      style={{
        position: 'fixed', bottom: '28px', right: '28px', zIndex: 100,
        width: '40px', height: '40px', borderRadius: '12px', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: editMode ? 'var(--canvas-primary)' : 'var(--canvas-surface-high)',
        color: editMode ? 'var(--canvas-bg)' : 'var(--canvas-on-surface-variant)',
        boxShadow: `-3px -3px 7px var(--canvas-shadow-light), 3px 3px 7px var(--canvas-shadow-dark)`,
        transition: 'all 0.15s',
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>
        {editMode ? 'check' : 'edit'}
      </span>
    </button>
  );

  /* ════════ GRID ════════ */
  if (layout === 'grid') {
    return (
      <>
        {wrap(center(
          <>{greetingBlock}{searchBar}
            <CategoryTabs categories={categories} active={activeCategory} onSelect={setActiveCategory} />
            {visibleCards.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', width: '100%' }}>
                {visibleCards.map(card => (
                  <Editable key={card.id} card={card} editMode={editMode} onEdit={setEditCardId}>
                    <GridCard card={card} />
                  </Editable>
                ))}
              </div>
            )}
          </>
        ))}
        {editFAB}
        {editCard && <CardEditorPanel card={editCard} categories={categories} saving={saving} onSave={handleSaveCard} onClose={() => setEditCardId(null)} />}
      </>
    );
  }

  /* ════════ STREAM ════════ */
  if (layout === 'stream') {
    return (
      <>
        {wrap(center(
          <>{greetingBlock}{searchBar}
            <CategoryPills categories={categories} active={activeCategory} onSelect={setActiveCategory} />
            {visibleCards.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                {visibleCards.map(card => (
                  <Editable key={card.id} card={card} editMode={editMode} onEdit={setEditCardId} style={{ display: 'inline-block' }}>
                    <StreamCard card={card} />
                  </Editable>
                ))}
              </div>
            )}
          </>
        ))}
        {editFAB}
        {editCard && <CardEditorPanel card={editCard} categories={categories} saving={saving} onSave={handleSaveCard} onClose={() => setEditCardId(null)} />}
      </>
    );
  }

  /* ════════ COMPACT ════════ */
  if (layout === 'compact') {
    return (
      <>
        {wrap(center(
          <>{greetingBlock}{searchBar}
            {allCards.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                {allCards.map(card => (
                  <Editable key={card.id} card={card} editMode={editMode} onEdit={setEditCardId} style={{ display: 'inline-flex' }}>
                    <CompactCard card={card} />
                  </Editable>
                ))}
              </div>
            )}
          </>
        ))}
        {editFAB}
        {editCard && <CardEditorPanel card={editCard} categories={categories} saving={saving} onSave={handleSaveCard} onClose={() => setEditCardId(null)} />}
      </>
    );
  }

  /* ════════ BENTO ════════ */
  if (layout === 'bento') {
    const nonAllCats = categories.filter(c => c !== 'All');
    const cardsByCategory: Record<string, CardItem[]> = {};
    for (const cat of nonAllCats) cardsByCategory[cat] = [];
    for (const card of allCards) {
      const cat = (card.category === 'All' || !card.category) ? nonAllCats[0] : card.category;
      if (cat && cardsByCategory[cat]) cardsByCategory[cat].push(card);
    }
    const populatedPanels = nonAllCats.filter(c => cardsByCategory[c]?.length > 0);
    const gridCards = allCards.slice(0, 6);
    const paddedCount = Math.ceil(gridCards.length / 3) * 3;

    return (
      <>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--canvas-bg)', padding: '28px 56px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}><LiveClock /></div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: '48px', gap: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '32px' }}>
              <div>
                <h1 style={{ fontFamily: 'var(--font-canvas-heading)', fontSize: '54px', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--canvas-on-surface)', lineHeight: 1.05, margin: 0 }}>{greeting}</h1>
              </div>
              <form onSubmit={handleSearch} style={{ width: '340px', flexShrink: 0 }}>
                <div className="canvas-search-recessed" style={{ height: '50px', borderRadius: '9999px', display: 'flex', alignItems: 'center', padding: '0 20px', gap: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--canvas-on-surface-variant)', opacity: 0.7 }}>search</span>
                  <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search…"
                    style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '14px', color: 'var(--canvas-on-surface)', fontFamily: 'var(--font-canvas-body)' }} />
                </div>
              </form>
            </div>

            {allCards.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(3, 1fr) ${populatedPanels.map(() => '1.6fr').join(' ')}`, gap: '14px', alignItems: 'stretch' }}>
                <div style={{ gridColumn: '1 / 4', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: `repeat(${Math.max(2, Math.ceil(paddedCount / 3))}, 1fr)`, gap: '14px' }}>
                  {Array.from({ length: paddedCount }).map((_, i) =>
                    gridCards[i]
                      ? (
                        <Editable key={gridCards[i].id} card={gridCards[i]} editMode={editMode} onEdit={setEditCardId} style={{ aspectRatio: '1/1' }}>
                          <BentoSquare card={gridCards[i]} />
                        </Editable>
                      )
                      : <div key={`empty-${i}`} style={{ aspectRatio: '1/1', borderRadius: '18px', background: 'var(--canvas-surface)', border: '1px solid rgba(255,255,255,0.02)', boxShadow: `inset 2px 2px 5px var(--canvas-shadow-dark), inset -2px -2px 5px var(--canvas-shadow-light)` }} />
                  )}
                </div>
                {populatedPanels.map(cat => (
                  <BentoPanel key={cat} title={cat} cards={cardsByCategory[cat]} />
                ))}
              </div>
            )}
          </div>
        </div>
        {editFAB}
        {editCard && <CardEditorPanel card={editCard} categories={categories} saving={saving} onSave={handleSaveCard} onClose={() => setEditCardId(null)} />}
      </>
    );
  }

  /* ════════ ZEN (+ fallback) ════════ */
  return wrap(center(<>{greetingBlock}{searchBar}</>));
}
