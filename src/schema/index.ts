export type Theme = 'amber' | 'nocturnal' | 'slate' | 'forest' | 'rose';
export type SearchEngine = 'google' | 'duckduckgo' | 'ecosia' | 'bing';
export type DashboardLayout = 'grid' | 'stream' | 'compact' | 'zen' | 'bento';

export interface CustomQuickAction {
  id: string;
  label: string;
  icon: string;
  url: string;
  category: string;
}

export interface UserPreferences {
  theme: Theme;
  accentColor: string;
  searchEngine: SearchEngine;
  greeting: string;
  enabledCards: string[];
  categories: string[];
  customQuickActions: CustomQuickAction[];
  presetCardCategories: Record<string, string>;
  dashboardLayout: DashboardLayout;
}

export interface SessionUser {
  id: string;
  username: string;
  displayName: string;
  onboarded: boolean;
  preferences: UserPreferences;
}

export interface TodoItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  estimatedTime: string;
  completed: boolean;
  createdAt: string;
}

export interface WatchItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  platform: string;
  thumbnailUrl: string;
  videoUrl: string;
  watched: boolean;
  createdAt: string;
}

export interface OnboardingData {
  displayName: string;
  greeting: string;
  searchEngine: SearchEngine;
  enabledCards: string[];
}
