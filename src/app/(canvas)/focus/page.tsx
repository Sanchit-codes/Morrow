import { auth } from '@/signal/auth';
import { redirect } from 'next/navigation';
import { getTodos } from '@/signal/todos';
import FocusClient from '@/craft/canvas/FocusClient';

export default async function FocusPage() {
  const session = await auth();
  if (!session?.user) redirect('/enter');

  const userId = (session.user as { id: string }).id;
  const todos = await getTodos(userId);

  return <FocusClient userId={userId} initialTodos={todos} />;
}
