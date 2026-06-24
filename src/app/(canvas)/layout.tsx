import { auth } from '@/signal/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/craft/canvas/Sidebar';
import CanvasShell from '@/craft/canvas/CanvasShell';

export default async function CanvasLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/enter');

  const user = session.user as { displayName?: string; preferences?: { theme?: string; accentColor?: string } };
  const theme = user.preferences?.theme || 'amber';
  const accentColor = user.preferences?.accentColor;
  const displayName = user.displayName || 'You';

  return (
    <div className={`theme-${theme}`} style={{ '--canvas-primary': accentColor, background: 'var(--canvas-bg)', color: 'var(--canvas-on-surface)', minHeight: '100vh', display: 'flex', fontFamily: 'var(--font-canvas-body)' } as React.CSSProperties}>
      <Sidebar displayName={displayName} />
      <CanvasShell>{children}</CanvasShell>
    </div>
  );
}
