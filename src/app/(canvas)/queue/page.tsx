import { auth } from '@/signal/auth';
import { redirect } from 'next/navigation';
import { getWatchItems } from '@/signal/watchlist';
import QueueClient from '@/craft/canvas/QueueClient';

export default async function QueuePage() {
  const session = await auth();
  if (!session?.user) redirect('/enter');

  const userId = (session.user as { id: string }).id;
  const items = await getWatchItems(userId);

  return <QueueClient userId={userId} initialItems={items} />;
}
