import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  session: { strategy: 'jwt', maxAge: 365 * 24 * 60 * 60 },
  pages: { signIn: '/enter' },
  callbacks: {
    async session({ session, token }) {
      if (token.user) session.user = token.user as typeof session.user;
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
