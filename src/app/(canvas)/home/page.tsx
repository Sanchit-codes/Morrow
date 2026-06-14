import { auth } from '@/signal/auth';
import { redirect } from 'next/navigation';
import HomeClient from '@/craft/canvas/HomeClient';
import type { UserPreferences } from '@/schema';

export default async function HomePage() {
  const session = await auth();
  if (!session?.user) redirect('/enter');

  const user = session.user as {
    id?: string;
    displayName?: string;
    preferences?: UserPreferences;
    onboarded?: boolean;
  };

  if (!user.onboarded) redirect('/setup');

  return <HomeClient user={user} userId={user.id ?? ''} />;
}
