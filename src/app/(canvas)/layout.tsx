import { auth } from '@/signal/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/craft/canvas/Sidebar';
import CanvasShell from '@/craft/canvas/CanvasShell';

export default async function CanvasLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/enter');

  const user = session.user as { displayName?: string; preferences?: { theme?: string } };
  const theme = user.preferences?.theme || 'amber';
  const displayName = user.displayName || 'You';

  return (
    <div className={`theme-${theme}`} style={{ background: 'var(--canvas-bg)', color: 'var(--canvas-on-surface)', minHeight: '100vh', display: 'flex', fontFamily: 'var(--font-canvas-body)' }}>
      <Sidebar displayName={displayName} />
      <CanvasShell>{children}</CanvasShell>
    </div>
  );
}
