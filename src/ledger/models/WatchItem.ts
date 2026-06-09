import { Schema, Document, model, models } from 'mongoose';

export interface IWatchItem extends Document {
  userId: Schema.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  duration: string;
  platform: string;
  thumbnailUrl: string;
  videoUrl: string;
  watched: boolean;
  createdAt: Date;
}

const WatchItemSchema = new Schema<IWatchItem>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'General' },
  duration: { type: String, default: '' },
  platform: { type: String, default: 'YouTube' },
  thumbnailUrl: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  watched: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const WatchItem = models.WatchItem || model<IWatchItem>('WatchItem', WatchItemSchema);
