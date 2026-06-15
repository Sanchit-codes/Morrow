'use server';

import { connectDB } from '@/ledger/connect';
import { WatchItem } from '@/ledger/models/WatchItem';

export async function getWatchItems(userId: string) {
  await connectDB();
  const items = await WatchItem.find({ userId }).sort({ createdAt: -1 }).lean();
  return items.map(i => ({ ...i, _id: i._id.toString(), userId: i.userId.toString() }));
}

export async function createWatchItem(userId: string, data: {
  title: string;
  description?: string;
  category?: string;
  duration?: string;
  platform?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
}) {
  await connectDB();
  const item = await WatchItem.create({ userId, ...data });
  return { ...item.toObject(), _id: item._id.toString(), userId: item.userId.toString() };
}

export async function markWatched(itemId: string) {
  await connectDB();
  const item = await WatchItem.findById(itemId);
  if (!item) return { error: 'Not found' };
  item.watched = !item.watched;
  await item.save();
  return { success: true };
}

export async function deleteWatchItem(itemId: string) {
  await connectDB();
  await WatchItem.findByIdAndDelete(itemId);
  return { success: true };
}
