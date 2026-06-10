import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/ledger/connect';
import { User } from '@/ledger/models/User';
import { authConfig } from '@/auth.config';

const DEFAULT_PRESET_CATEGORIES: Record<string, string> = {
  mail: 'Work', calendar: 'Work', docs: 'Work',
  media: 'Personal', notes: 'Work', analytics: 'Work',
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        await connectDB();
        const user = await User.findOne({ username: (credentials.username as string).toLowerCase() });
        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password as string, user.password);
        if (!valid) return null;

        const plain = user.toObject();
        return {
          id: plain._id.toString(),
          username: plain.username,
          displayName: plain.displayName,
          onboarded: plain.onboarded,
          preferences: {
            theme: plain.preferences.theme,
            accentColor: plain.preferences.accentColor,
            searchEngine: plain.preferences.searchEngine,
            greeting: plain.preferences.greeting,
            enabledCards: [...plain.preferences.enabledCards],
            categories: [...(plain.preferences.categories ?? ['All', 'Work', 'Design', 'Dev', 'Personal'])],
            customQuickActions: (plain.preferences.customQuickActions ?? []).map((a: { id: string; label: string; icon: string; url: string; category: string }) => ({ ...a })),
            presetCardCategories: { ...DEFAULT_PRESET_CATEGORIES, ...(plain.preferences.presetCardCategories ?? {}) },
            dashboardLayout: plain.preferences.dashboardLayout ?? 'grid',
          },
        };
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 365 * 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.user = user;
      } else if (trigger === 'update' && (token.user as { id?: string })?.id) {
        await connectDB();
        const fresh = await User.findById((token.user as { id: string }).id).lean<{
          _id: { toString(): string };
          username: string;
          displayName: string;
          onboarded: boolean;
          preferences: {
            theme: string;
            accentColor: string;
            searchEngine: string;
            greeting: string;
            enabledCards: string[];
            categories: string[];
            customQuickActions: { id: string; label: string; icon: string; url: string; category: string }[];
            presetCardCategories: Record<string, string>;
            dashboardLayout: string;
          };
        }>();
        if (fresh) {
          token.user = {
            id: fresh._id.toString(),
            username: fresh.username,
            displayName: fresh.displayName,
            onboarded: fresh.onboarded,
            preferences: {
              theme: fresh.preferences.theme,
              accentColor: fresh.preferences.accentColor,
              searchEngine: fresh.preferences.searchEngine,
              greeting: fresh.preferences.greeting,
              enabledCards: [...fresh.preferences.enabledCards],
              categories: [...(fresh.preferences.categories ?? ['All', 'Work', 'Design', 'Dev', 'Personal'])],
              customQuickActions: (fresh.preferences.customQuickActions ?? []).map(a => ({ ...a })),
              presetCardCategories: { ...DEFAULT_PRESET_CATEGORIES, ...(fresh.preferences.presetCardCategories ?? {}) },
              dashboardLayout: fresh.preferences.dashboardLayout ?? 'grid',
            },
          };
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) session.user = token.user as typeof session.user;
      return session;
    },
  },
  pages: {
    signIn: '/enter',
  },
});
