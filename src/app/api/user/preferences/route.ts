import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/ledger/connect';
import { User } from '@/ledger/models/User';

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { userId, ...fields } = body;
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

  await connectDB();

  const update: Record<string, unknown> = {};

  if (fields.theme !== undefined)        update['preferences.theme']               = fields.theme;
  if (fields.accentColor !== undefined)  update['preferences.accentColor']         = fields.accentColor;
  if (fields.searchEngine !== undefined) update['preferences.searchEngine']        = fields.searchEngine;
  if (fields.greeting !== undefined)     update['preferences.greeting']            = fields.greeting;
  if (fields.enabledCards !== undefined) update['preferences.enabledCards']        = fields.enabledCards;
  if (fields.categories !== undefined)       update['preferences.categories']          = fields.categories;
  if (fields.dashboardLayout !== undefined)  update['preferences.dashboardLayout']     = fields.dashboardLayout;
  if (fields.customQuickActions !== undefined) update['preferences.customQuickActions'] = fields.customQuickActions;
  if (fields.presetCardCategories !== undefined) update['preferences.presetCardCategories'] = fields.presetCardCategories;
  if (fields.displayName !== undefined)  update['displayName']                     = fields.displayName;

  await User.findByIdAndUpdate(userId, update);
  return NextResponse.json({ success: true });
}
