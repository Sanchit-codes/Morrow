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
//
// type BrowserLinks = { bookmarks: string; downloads: string; history: string } | null;
//
// function detectBrowserLinks(): BrowserLinks {
//   const ua = navigator.userAgent;
//   const uad = (navigator as { userAgentData?: { brands: { brand: string }[] } }).userAgentData;
//   const brands = uad?.brands?.map(b => b.brand) ?? [];
//
//   if (brands.some(b => b.includes('Brave')))
//     return { bookmarks: 'brave://bookmarks', downloads: 'brave://downloads', history: 'brave://history' };
//   if (brands.some(b => b.includes('Microsoft Edge')) || /Edg\//.test(ua))
//     return { bookmarks: 'edge://favorites', downloads: 'edge://downloads', history: 'edge://history' };
//   if (brands.some(b => b.includes('Google Chrome') || b.includes('Chromium')) || /Chrome\//.test(ua))
//     return { bookmarks: 'chrome://bookmarks', downloads: 'chrome://downloads', history: 'chrome://history' };
//   if (/Firefox\//.test(ua))
//     return { bookmarks: 'about:bookmarks', downloads: 'about:downloads', history: 'about:history' };
//   return null;
// }
//
// const BROWSER_NAV = [
//   { key: 'bookmarks', icon: 'bookmarks',  label: 'Bookmarks' },
//   { key: 'downloads', icon: 'download',   label: 'Downloads' },
//   { key: 'history',   icon: 'history',    label: 'History'   },
// ] as const;

const COLLAPSED_KEY = 'morrow_sidebar_collapsed';
const EXPANDED_W = 280;
const COLLAPSED_W = 64;

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

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: collapsed ? '16px 10px' : '20px 16px', gap: '6px', transition: 'padding 0.22s ease' }}>

        {/* Header row: wordmark (expanded) + collapse toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', padding: collapsed ? '4px 0 16px' : '4px 4px 16px', minHeight: '40px' }}>
          {!collapsed && (
            <span style={{ fontFamily: 'var(--font-canvas-heading)', fontSize: '17px', letterSpacing: '-0.02em', userSelect: 'none' }}>
              <span style={{ fontWeight: 700, color: 'var(--canvas-primary)' }}>Mor</span>
              <span style={{ fontWeight: 400, color: 'var(--canvas-on-surface-variant)' }}>row</span>
            </span>
          )}
          <button
            onClick={toggle}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              width: '30px', height: '30px', borderRadius: '9px', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--canvas-surface-high)',
              color: 'var(--canvas-on-surface-variant)',
              boxShadow: `-2px -2px 4px var(--canvas-shadow-light), 2px 2px 4px var(--canvas-shadow-dark)`,
              transition: 'all 0.15s ease', flexShrink: 0,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--canvas-primary)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--canvas-on-surface-variant)'; }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
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
                  gap: collapsed ? 0 : '13px',
                  padding: collapsed ? '10px 0' : '10px 14px',
                  borderRadius: '12px',
                  fontSize: '14px', fontWeight: active ? 600 : 400,
                  color: active ? 'var(--canvas-primary)' : 'var(--canvas-on-surface-variant)',
                  background: active ? 'var(--canvas-surface-high)' : 'transparent',
                  border: active ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
                  boxShadow: active ? `inset 4px 4px 8px var(--canvas-shadow-dark), inset -4px -4px 8px var(--canvas-shadow-light)` : 'none',
                  textDecoration: 'none', transition: 'all 0.15s ease',
                  overflow: 'hidden', whiteSpace: 'nowrap',
                }}>
                <span className="material-symbols-outlined" style={{ fontSize: '19px', fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0", flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && item.label}
              </Link>
            );
          })}

          {/* TODO(extension): browser shortcuts (Bookmarks, Downloads, History)
              commented until chrome.tabs.update() is available in the extension */}
        </nav>

        {/* User pill */}
        <div style={{
          marginTop: '8px', borderRadius: '12px',
          display: 'flex', alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: collapsed ? 0 : '10px',
          padding: collapsed ? '10px 0' : '10px 12px',
          background: 'var(--canvas-surface-high)',
          boxShadow: `inset 4px 4px 8px var(--canvas-shadow-dark), inset -4px -4px 8px var(--canvas-shadow-light)`,
          border: '1px solid rgba(255,255,255,0.03)',
          overflow: 'hidden',
        }}>
          {/* Avatar — doubles as sign-out trigger when collapsed */}
          {collapsed ? (
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              title={`Sign out (${displayName})`}
              style={{
                width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0, border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--canvas-surface-highest)',
                boxShadow: `-2px -2px 5px var(--canvas-shadow-light), 2px 2px 5px var(--canvas-shadow-dark)`,
                color: 'var(--canvas-primary)', fontSize: '12px', fontWeight: 700,
                fontFamily: 'var(--font-canvas-heading)',
              }}>
              {initial}
            </button>
          ) : (
            <>
              <div style={{
                width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--canvas-surface-highest)',
                boxShadow: `-2px -2px 5px var(--canvas-shadow-light), 2px 2px 5px var(--canvas-shadow-dark)`,
                color: 'var(--canvas-primary)', fontSize: '12px', fontWeight: 700,
                fontFamily: 'var(--font-canvas-heading)',
              }}>
                {initial}
              </div>
              <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--canvas-on-surface)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {displayName}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                title="Sign out"
                style={{
                  width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(186,26,26,0.2)', border: 'none', cursor: 'pointer', color: '#ffdad6',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(186,26,26,0.4)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(186,26,26,0.2)'; }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
