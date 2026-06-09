import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) throw new Error('MONGODB_URI is not defined');

// Reuse connection across hot reloads in dev
const cached = global as typeof global & {
  _mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
};

if (!cached._mongoose) cached._mongoose = { conn: null, promise: null };

export async function connectDB() {
  if (cached._mongoose!.conn) return cached._mongoose!.conn;
  if (!cached._mongoose!.promise) {
    cached._mongoose!.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }
  cached._mongoose!.conn = await cached._mongoose!.promise;
  return cached._mongoose!.conn;
}
