'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';

const navItems = [
  { href: '/home',  icon: 'home',        label: 'Home' },
  { href: '/focus', icon: 'task_alt',    label: 'To-Do' },
  { href: '/queue', icon: 'play_circle', label: 'Watch List' },
  { href: '/drift', icon: 'settings',    label: 'Settings' },
];

// TODO(extension): browser internal links (chrome://, edge://, brave://, about:)
// are blocked by the browser sandbox from web pages. Re-enable once the Chrome
// extension is built and navigation is handled via chrome.tabs.update().

const COLLAPSED_KEY = 'morrow_sidebar_collapsed';
const EXPANDED_W = 322;
const COLLAPSED_W = 74;

export default function Sidebar({ displayName }: { displayName: string }) {
  const path = usePathname();
  const initial = displayName.charAt(0).toUpperCase();

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COLLAPSED_KEY);
    if (stored === 'true') setCollapsed(true);
  }, []);

  const toggle = () => {
    const next = !collapsed;
    localStorage.setItem(COLLAPSED_KEY, String(next));
    setCollapsed(next);
    window.dispatchEvent(new Event('sidebar-toggle'));
  };

  const w = collapsed ? COLLAPSED_W : EXPANDED_W;

  return (
    <aside style={{
      background: 'var(--canvas-surface)',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      position: 'fixed', left: 0, top: 0,
      width: `${w}px`, height: '100%',
      display: 'flex', flexDirection: 'column',
      zIndex: 50, overflow: 'hidden',
      transition: 'width 0.22s ease',
    }}>
      {/* Top accent bar */}
      <div style={{ height: '3px', background: 'var(--canvas-primary)', opacity: 0.35, flexShrink: 0 }} />

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: collapsed ? '18px 12px' : '23px 18px', gap: '6px', transition: 'padding 0.22s ease' }}>

        {/* Header row: wordmark (expanded) + collapse toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', padding: collapsed ? '5px 0 18px' : '5px 5px 18px', minHeight: '46px' }}>
          {!collapsed && (
            <span style={{ fontFamily: 'var(--font-canvas-heading)', fontSize: '20px', letterSpacing: '-0.02em', userSelect: 'none' }}>
              <span style={{ fontWeight: 700, color: 'var(--canvas-primary)' }}>Mor</span>
              <span style={{ fontWeight: 400, color: 'var(--canvas-on-surface-variant)' }}>row</span>
            </span>
          )}
          <button
            onClick={toggle}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              width: '35px', height: '35px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--canvas-surface-high)',
              color: 'var(--canvas-on-surface-variant)',
              boxShadow: `-2px -2px 4px var(--canvas-shadow-light), 2px 2px 4px var(--canvas-shadow-dark)`,
              transition: 'all 0.15s ease', flexShrink: 0,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--canvas-primary)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--canvas-on-surface-variant)'; }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              {collapsed ? 'chevron_right' : 'chevron_left'}
            </span>
          </button>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
          {navItems.map(item => {
            const active = path === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  gap: collapsed ? 0 : '15px',
                  padding: collapsed ? '12px 0' : '12px 16px',
                  borderRadius: '14px',
                  fontSize: '16px', fontWeight: active ? 600 : 400,
                  color: active ? 'var(--canvas-primary)' : 'var(--canvas-on-surface-variant)',
                  background: active ? 'var(--canvas-surface-high)' : 'transparent',
                  border: active ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
                  boxShadow: active ? `inset 4px 4px 8px var(--canvas-shadow-dark), inset -4px -4px 8px var(--canvas-shadow-light)` : 'none',
                  textDecoration: 'none', transition: 'all 0.15s ease',
                  overflow: 'hidden', whiteSpace: 'nowrap',
                }}>
                <span className="material-symbols-outlined" style={{ fontSize: '22px', fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0", flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>

        {/* User pill */}
        <div style={{
          marginTop: '9px', borderRadius: '14px',
          display: 'flex', alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: collapsed ? 0 : '12px',
          padding: collapsed ? '12px 0' : '12px 14px',
          background: 'var(--canvas-surface-high)',
          boxShadow: `inset 4px 4px 8px var(--canvas-shadow-dark), inset -4px -4px 8px var(--canvas-shadow-light)`,
          border: '1px solid rgba(255,255,255,0.03)',
          overflow: 'hidden',
        }}>
          {collapsed ? (
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              title={`Sign out (${displayName})`}
              style={{
                width: '35px', height: '35px', borderRadius: '50%', flexShrink: 0, border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--canvas-surface-highest)',
                boxShadow: `-2px -2px 5px var(--canvas-shadow-light), 2px 2px 5px var(--canvas-shadow-dark)`,
                color: 'var(--canvas-primary)', fontSize: '14px', fontWeight: 700,
                fontFamily: 'var(--font-canvas-heading)',
              }}>
              {initial}
            </button>
          ) : (
            <>
              <div style={{
                width: '35px', height: '35px', borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--canvas-surface-highest)',
                boxShadow: `-2px -2px 5px var(--canvas-shadow-light), 2px 2px 5px var(--canvas-shadow-dark)`,
                color: 'var(--canvas-primary)', fontSize: '14px', fontWeight: 700,
                fontFamily: 'var(--font-canvas-heading)',
              }}>
                {initial}
              </div>
              <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--canvas-on-surface)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {displayName}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                title="Sign out"
                style={{
                  width: '32px', height: '32px', borderRadius: '9px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(186,26,26,0.2)', border: 'none', cursor: 'pointer', color: '#ffdad6',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(186,26,26,0.4)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(186,26,26,0.2)'; }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
