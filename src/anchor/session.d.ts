import 'next-auth';
import type { UserPreferences } from '@/schema';

declare module 'next-auth' {
  interface User {
    id: string;
    username: string;
    displayName: string;
    onboarded: boolean;
    preferences: UserPreferences;
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: import('next-auth').User;
  }
}
