import { auth } from '@/signal/auth';
import { redirect } from 'next/navigation';
import DriftClient from '@/craft/canvas/DriftClient';
import type { UserPreferences } from '@/schema';

export default async function DriftPage() {
  const session = await auth();
  if (!session?.user) redirect('/enter');

  const user = session.user as { id: string; displayName?: string; preferences?: UserPreferences };

  return (
    <DriftClient
      userId={user.id}
      displayName={user.displayName || ''}
      preferences={user.preferences}
    />
  );
}
