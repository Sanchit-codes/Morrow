'use client';

import { useEffect, useState } from 'react';

const COLLAPSED_KEY = 'morrow_sidebar_collapsed';

export default function CanvasShell({ children }: { children: React.ReactNode }) {
  const [marginLeft, setMarginLeft] = useState(280);

  useEffect(() => {
    const apply = () => {
      const collapsed = localStorage.getItem(COLLAPSED_KEY) === 'true';
      setMarginLeft(collapsed ? 64 : 280);
    };
    apply();

    /* Listen for sidebar toggle events broadcast from Sidebar */
    window.addEventListener('sidebar-toggle', apply);
    return () => window.removeEventListener('sidebar-toggle', apply);
  }, []);

  return (
    <main style={{ flex: 1, marginLeft: `${marginLeft}px`, minHeight: '100vh', overflow: 'auto', transition: 'margin-left 0.22s ease' }}>
      {children}
    </main>
  );
}
