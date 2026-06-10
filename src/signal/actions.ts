'use server';

import bcrypt from 'bcryptjs';
import { connectDB } from '@/ledger/connect';
import { User } from '@/ledger/models/User';
import { Todo } from '@/ledger/models/Todo';
import { WatchItem } from '@/ledger/models/WatchItem';

export async function registerUser(data: {
  username: string;
  password: string;
  displayName: string;
}): Promise<{ success: true } | { error: string }> {
  await connectDB();
  const exists = await User.findOne({ username: data.username.toLowerCase() });
  if (exists) return { error: 'Username already taken' };

  const hashed = await bcrypt.hash(data.password, 12);
  await User.create({
    username: data.username.toLowerCase(),
    password: hashed,
    displayName: data.displayName || data.username,
  });
  return { success: true };
}

export async function resetUserData(userId: string): Promise<{ success: true }> {
  await connectDB();
  await Promise.all([
    Todo.deleteMany({ userId }),
    WatchItem.deleteMany({ userId }),
  ]);
  return { success: true };
}

export async function completeOnboarding(userId: string, data: {
  greeting: string;
  searchEngine: string;
  enabledCards: string[];
}): Promise<{ success: true }> {
  await connectDB();
  await User.findByIdAndUpdate(userId, {
    onboarded: true,
    'preferences.greeting': data.greeting,
    'preferences.searchEngine': data.searchEngine,
    'preferences.enabledCards': data.enabledCards,
  });
  return { success: true };
}
