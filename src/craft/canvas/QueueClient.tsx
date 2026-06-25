'use client';

import { useState } from 'react';
import { createWatchItem, markWatched, deleteWatchItem } from '@/signal/watchlist';
import type { WatchItem } from '@/schema';

interface Props {
  userId: string;
  initialItems: WatchItem[];
}

const PLATFORMS = ['YouTube', 'Vimeo', 'Twitter/X', 'Other'];

export default function QueueClient({ userId, initialItems }: Props) {
  const [items, setItems] = useState<WatchItem[]>(initialItems as unknown as WatchItem[]);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: '', duration: '', platform: 'YouTube', videoUrl: '', thumbnailUrl: '' });

  const filtered = items.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.platform.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const item = await createWatchItem(userId, form);
    setItems(prev => [item as unknown as WatchItem, ...prev]);
    setForm({ title: '', description: '', category: '', duration: '', platform: 'YouTube', videoUrl: '', thumbnailUrl: '' });
    setShowAdd(false);
  };

  const handleToggle = async (id: string) => {
    await markWatched(id);
    setItems(prev => prev.map(i => i._id === id ? { ...i, watched: !i.watched } : i));
  };

  const handleDelete = async (id: string) => {
    await deleteWatchItem(id);
    setItems(prev => prev.filter(i => i._id !== id));
  };

  return (
    <div style={{ maxWidth: '1035px', padding: '55px', display: 'flex', flexDirection: 'column', gap: '37px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '28px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-canvas-heading)', fontSize: '41px', fontWeight: 700, color: 'var(--canvas-on-surface)', letterSpacing: '-0.02em' }}>
            Watch List
          </h2>
          <p style={{ fontSize: '18px', color: 'var(--canvas-on-surface-variant)', marginTop: '5px' }}>
            {items.filter(i => !i.watched).length} videos queued
          </p>
        </div>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <div style={{
            borderRadius: '9999px', padding: '12px 21px', display: 'flex', alignItems: 'center', gap: '12px', width: '322px',
            background: '#121416', boxShadow: 'inset 6px 6px 12px #070809, inset -6px -6px 12px #1d2023',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '21px', color: 'var(--canvas-on-surface-variant)' }}>search</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search queue..."
              style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '16px', color: 'var(--canvas-on-surface)', fontFamily: 'var(--font-canvas-body)', width: '100%' }} />
          </div>
          <button onClick={() => setShowAdd(s => !s)}
            style={{
              width: '51px', height: '51px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: showAdd ? '#232529' : 'var(--canvas-surface-high)', border: 'none', cursor: 'pointer',
              color: 'var(--canvas-on-surface)',
              boxShadow: showAdd ? 'inset 4px 4px 8px #070809, inset -4px -4px 8px #1d2023' : '2px 2px 5px rgba(0,0,0,0.5), -1px -1px 4px rgba(255,255,255,0.02)',
            }}>
            <span className="material-symbols-outlined" style={{ fontSize: '23px' }}>{showAdd ? 'close' : 'add'}</span>
          </button>
        </div>
      </header>

      {showAdd && (
        <form onSubmit={handleAdd} style={{
          borderRadius: '18px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px',
          background: '#151719', boxShadow: 'inset 4px 4px 8px #070809, inset -4px -4px 8px #1d2023',
        }}>
          {[
            { key: 'title', placeholder: 'Video title *', required: true },
            { key: 'videoUrl', placeholder: 'Video URL' },
            { key: 'description', placeholder: 'Description (optional)' },
            { key: 'thumbnailUrl', placeholder: 'Thumbnail URL (optional)' },
          ].map(f => (
            <input key={f.key} value={form[f.key as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              placeholder={f.placeholder} required={f.required}
              style={{
                background: 'var(--canvas-surface-high)', border: 'none', outline: 'none', padding: '14px 18px', borderRadius: '12px',
                fontSize: '16px', color: 'var(--canvas-on-surface)', fontFamily: 'var(--font-canvas-body)',
              }} />
          ))}
          <div style={{ display: 'flex', gap: '14px' }}>
            <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="Category"
              style={{ flex: 1, background: 'var(--canvas-surface-high)', border: 'none', outline: 'none', padding: '12px 16px', borderRadius: '12px', fontSize: '15px', color: 'var(--canvas-on-surface-variant)', fontFamily: 'var(--font-canvas-body)' }} />
            <input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="Duration (e.g. 12:30)"
              style={{ flex: 1, background: 'var(--canvas-surface-high)', border: 'none', outline: 'none', padding: '12px 16px', borderRadius: '12px', fontSize: '15px', color: 'var(--canvas-on-surface-variant)', fontFamily: 'var(--font-canvas-body)' }} />
            <select value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}
              style={{ flex: 1, background: 'var(--canvas-surface-high)', border: 'none', outline: 'none', padding: '12px 16px', borderRadius: '12px', fontSize: '15px', color: 'var(--canvas-on-surface-variant)', fontFamily: 'var(--font-canvas-body)' }}>
              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <button type="submit" style={{ padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', background: 'var(--canvas-primary)', color: '#0c0e10', fontWeight: 600, fontSize: '16px', fontFamily: 'var(--font-canvas-body)' }}>
            Add to Queue
          </button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '55px', color: 'var(--canvas-on-surface-variant)', fontSize: '17px' }}>
            {search ? 'No videos match your search.' : 'Queue is empty. Add something to watch.'}
          </div>
        )}
        {filtered.map(item => (
          <article key={item._id} style={{
            borderRadius: '16px', padding: '23px', display: 'flex', gap: '23px', alignItems: 'center',
            background: '#121416', boxShadow: 'inset 4px 4px 8px #070809, inset -4px -4px 8px #1d2023',
            opacity: item.watched ? 0.5 : 1, transition: 'opacity 0.2s ease',
          }}>
            {/* Thumbnail */}
            <div style={{
              width: '230px', height: '129px', borderRadius: '12px', flexShrink: 0, overflow: 'hidden', position: 'relative',
              background: 'var(--canvas-surface-high)',
            }}>
              {item.thumbnailUrl ? (
                <img src={item.thumbnailUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '37px', color: 'var(--canvas-on-surface-variant)', fontVariationSettings: "'FILL' 1" }}>smart_display</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: '9px', marginBottom: '7px', alignItems: 'center' }}>
                {item.category && (
                  <span style={{ padding: '2px 12px', borderRadius: '9999px', fontSize: '14px', fontWeight: 600, background: 'var(--canvas-surface-high)', color: 'var(--canvas-on-surface-variant)' }}>
                    {item.category}
                  </span>
                )}
                {item.duration && (
                  <span style={{ fontSize: '14px', color: 'var(--canvas-on-surface-variant)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>schedule</span>
                    {item.duration}
                  </span>
                )}
              </div>
              <h3 style={{
                fontFamily: 'var(--font-canvas-heading)', fontSize: '18px', fontWeight: 600, color: 'var(--canvas-on-surface)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                textDecoration: item.watched ? 'line-through' : 'none',
              }}>{item.title}</h3>
              {item.description && (
                <p style={{ fontSize: '15px', color: 'var(--canvas-on-surface-variant)', marginTop: '5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.description}
                </p>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '9px', color: 'var(--canvas-on-surface-variant)', fontSize: '14px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>smart_display</span>
                {item.platform}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flexShrink: 0 }}>
              {item.videoUrl && (
                <a href={item.videoUrl} target="_blank" rel="noreferrer" style={{
                  padding: '9px 18px', borderRadius: '12px', fontSize: '15px', fontWeight: 600, textDecoration: 'none',
                  background: 'var(--canvas-surface-high)', color: 'var(--canvas-on-surface)',
                  display: 'flex', alignItems: 'center', gap: '7px',
                  boxShadow: '2px 2px 5px rgba(0,0,0,0.5), -1px -1px 4px rgba(255,255,255,0.02)',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>play_arrow</span> Watch
                </a>
              )}
              <button onClick={() => handleToggle(item._id)}
                style={{
                  padding: '9px 18px', borderRadius: '12px', fontSize: '15px', fontWeight: 600, border: 'none', cursor: 'pointer',
                  background: 'var(--canvas-surface-high)', color: 'var(--canvas-on-surface-variant)',
                  display: 'flex', alignItems: 'center', gap: '7px', fontFamily: 'var(--font-canvas-body)',
                  boxShadow: item.watched ? 'inset 2px 2px 4px #070809' : '2px 2px 5px rgba(0,0,0,0.5), -1px -1px 4px rgba(255,255,255,0.02)',
                }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{item.watched ? 'visibility_off' : 'visibility'}</span>
                {item.watched ? 'Requeue' : 'Watched'}
              </button>
              <button onClick={() => handleDelete(item._id)}
                style={{
                  width: '41px', height: '41px', borderRadius: '50%', border: 'none', cursor: 'pointer', alignSelf: 'center',
                  background: 'transparent', color: 'var(--canvas-on-surface-variant)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#ffdad6'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--canvas-on-surface-variant)'; }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '21px' }}>delete</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
