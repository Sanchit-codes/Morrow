import { Schema, Document, model, models } from 'mongoose';

export interface ITodo extends Document {
  userId: Schema.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  estimatedTime: string;
  completed: boolean;
  createdAt: Date;
}

const TodoSchema = new Schema<ITodo>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'General' },
  estimatedTime: { type: String, default: '' },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Todo = models.Todo || model<ITodo>('Todo', TodoSchema);
