import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  displayName: string;
  onboarded: boolean;
  preferences: {
    theme: 'amber' | 'nocturnal' | 'slate' | 'forest' | 'rose';
    accentColor: string;
    searchEngine: 'google' | 'duckduckgo' | 'ecosia' | 'bing';
    greeting: string;
    enabledCards: string[];
    categories: string[];
    customQuickActions: { id: string; label: string; icon: string; url: string; category: string }[];
    presetCardCategories: Record<string, string>;
    dashboardLayout: 'grid' | 'stream' | 'compact' | 'zen' | 'bento';
  };
  createdAt: Date;
}

const CustomQuickActionSchema = new Schema(
  { id: String, label: String, icon: String, url: String, category: { type: String, default: 'All' } },
  { _id: false }
);

const UserSchema = new Schema<IUser>({
  username:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:    { type: String, required: true },
  displayName: { type: String, required: true, trim: true },
  onboarded:   { type: Boolean, default: false },
  preferences: {
    theme:        { type: String, enum: ['amber', 'nocturnal', 'slate', 'forest', 'rose'], default: 'amber' },
    accentColor:  { type: String, default: '#fbc38a' },
    searchEngine: { type: String, enum: ['google', 'duckduckgo', 'ecosia', 'bing'], default: 'duckduckgo' },
    greeting:     { type: String, default: '' },
    enabledCards: { type: [String], default: ['mail', 'calendar', 'docs', 'media'] },
    categories:       { type: [String], default: ['All', 'Work', 'Design', 'Dev', 'Personal'] },
    customQuickActions: { type: [CustomQuickActionSchema], default: [] },
    presetCardCategories: { type: mongoose.Schema.Types.Mixed, default: { mail: 'Work', calendar: 'Work', docs: 'Work', media: 'Personal', notes: 'Work', analytics: 'Work' } },
    dashboardLayout:  { type: String, enum: ['grid', 'stream', 'compact', 'zen', 'bento'], default: 'grid' },
  },
  createdAt: { type: Date, default: Date.now },
});

export const User = models.User || model<IUser>('User', UserSchema);
