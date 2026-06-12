import { auth } from '@/signal/auth';
import { redirect } from 'next/navigation';
import SetupClient from '@/craft/ritual/SetupClient';

export default async function SetupPage() {
  const session = await auth();
  if (!session?.user) redirect('/enter');

  const user = session.user as { id: string; displayName?: string; onboarded?: boolean };
  if (user.onboarded) redirect('/');

  return <SetupClient userId={user.id} displayName={user.displayName || ''} />;
}
