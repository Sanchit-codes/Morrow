'use server';

import { connectDB } from '@/ledger/connect';
import { Todo } from '@/ledger/models/Todo';

export async function getTodos(userId: string) {
  await connectDB();
  const todos = await Todo.find({ userId }).sort({ createdAt: -1 }).lean();
  return todos.map(t => ({ ...t, _id: t._id.toString(), userId: t.userId.toString() }));
}

export async function createTodo(userId: string, data: {
  title: string;
  description?: string;
  category?: string;
  estimatedTime?: string;
}) {
  await connectDB();
  const todo = await Todo.create({ userId, ...data });
  return { ...todo.toObject(), _id: todo._id.toString(), userId: todo.userId.toString() };
}

export async function toggleTodo(todoId: string) {
  await connectDB();
  const todo = await Todo.findById(todoId);
  if (!todo) return { error: 'Not found' };
  todo.completed = !todo.completed;
  await todo.save();
  return { success: true };
}

export async function deleteTodo(todoId: string) {
  await connectDB();
  await Todo.findByIdAndDelete(todoId);
  return { success: true };
}
