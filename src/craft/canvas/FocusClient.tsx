'use client';

import { useState } from 'react';
import { createTodo, toggleTodo, deleteTodo } from '@/signal/todos';
import type { TodoItem } from '@/schema';

interface Props {
  userId: string;
  initialTodos: TodoItem[];
}

export default function FocusClient({ userId, initialTodos }: Props) {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos as unknown as TodoItem[]);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'General', estimatedTime: '' });

  const filtered = todos.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const todo = await createTodo(userId, form);
    setTodos(prev => [todo as unknown as TodoItem, ...prev]);
    setForm({ title: '', description: '', category: 'General', estimatedTime: '' });
    setShowAdd(false);
  };

  const handleToggle = async (id: string) => {
    await toggleTodo(id);
    setTodos(prev => prev.map(t => t._id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDelete = async (id: string) => {
    await deleteTodo(id);
    setTodos(prev => prev.filter(t => t._id !== id));
  };

  return (
    <div style={{ maxWidth: '1035px', padding: '55px', display: 'flex', flexDirection: 'column', gap: '37px' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '28px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-canvas-heading)', fontSize: '41px', fontWeight: 700, color: 'var(--canvas-on-surface)', letterSpacing: '-0.02em' }}>
            To-Do
          </h2>
          <p style={{ fontSize: '18px', color: 'var(--canvas-on-surface-variant)', marginTop: '5px' }}>
            {todos.filter(t => !t.completed).length} tasks remaining
          </p>
        </div>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <div style={{
            borderRadius: '9999px', padding: '12px 21px', display: 'flex', alignItems: 'center', gap: '12px', width: '322px',
            background: '#121416', boxShadow: 'inset 6px 6px 12px #070809, inset -6px -6px 12px #1d2023',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '21px', color: 'var(--canvas-on-surface-variant)' }}>search</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..."
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

      {/* Add form */}
      {showAdd && (
        <form onSubmit={handleAdd} style={{
          borderRadius: '18px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px',
          background: '#151719', boxShadow: 'inset 4px 4px 8px #070809, inset -4px -4px 8px #1d2023',
        }}>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Task title..." required
            style={{
              background: 'var(--canvas-surface-high)', border: 'none', outline: 'none', padding: '14px 18px', borderRadius: '12px',
              fontSize: '18px', fontWeight: 600, color: 'var(--canvas-on-surface)', fontFamily: 'var(--font-canvas-heading)',
            }} />
          <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Description (optional)"
            style={{
              background: 'var(--canvas-surface-high)', border: 'none', outline: 'none', padding: '14px 18px', borderRadius: '12px',
              fontSize: '16px', color: 'var(--canvas-on-surface-variant)', fontFamily: 'var(--font-canvas-body)',
            }} />
          <div style={{ display: 'flex', gap: '14px' }}>
            <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              placeholder="Category"
              style={{
                flex: 1, background: 'var(--canvas-surface-high)', border: 'none', outline: 'none', padding: '12px 16px', borderRadius: '12px',
                fontSize: '15px', color: 'var(--canvas-on-surface-variant)', fontFamily: 'var(--font-canvas-body)',
              }} />
            <input value={form.estimatedTime} onChange={e => setForm(f => ({ ...f, estimatedTime: e.target.value }))}
              placeholder="Est. time (e.g. 1h)"
              style={{
                flex: 1, background: 'var(--canvas-surface-high)', border: 'none', outline: 'none', padding: '12px 16px', borderRadius: '12px',
                fontSize: '15px', color: 'var(--canvas-on-surface-variant)', fontFamily: 'var(--font-canvas-body)',
              }} />
          </div>
          <button type="submit" style={{
            padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer',
            background: 'var(--canvas-primary)', color: '#0c0e10', fontWeight: 600, fontSize: '16px', fontFamily: 'var(--font-canvas-body)',
          }}>
            Add Task
          </button>
        </form>
      )}

      {/* Task list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '55px', color: 'var(--canvas-on-surface-variant)', fontSize: '17px' }}>
            {search ? 'No tasks match your search.' : 'No tasks yet. Add one above.'}
          </div>
        )}
        {filtered.map(task => (
          <article key={task._id} style={{
            borderRadius: '16px', padding: '23px 28px', display: 'flex', alignItems: 'center', gap: '23px',
            background: '#121416', boxShadow: 'inset 4px 4px 8px #070809, inset -4px -4px 8px #1d2023',
            opacity: task.completed ? 0.5 : 1, transition: 'opacity 0.2s ease',
          }}>
            <button onClick={() => handleToggle(task._id)} style={{
              width: '46px', height: '46px', borderRadius: '50%', border: 'none', cursor: 'pointer', flexShrink: 0,
              background: task.completed ? 'var(--canvas-primary)' : 'var(--canvas-surface-high)',
              color: task.completed ? '#0c0e10' : 'var(--canvas-on-surface-variant)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: task.completed ? 'inset 2px 2px 4px rgba(0,0,0,0.3)' : '-4px -4px 8px #1d2023, 4px 4px 8px #070809',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '23px', fontVariationSettings: task.completed ? "'FILL' 1" : "'FILL' 0" }}>
                {task.completed ? 'check_circle' : 'radio_button_unchecked'}
              </span>
            </button>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: '9px', alignItems: 'center', marginBottom: '5px' }}>
                <span style={{
                  padding: '2px 12px', borderRadius: '9999px', fontSize: '14px', fontWeight: 600,
                  background: 'var(--canvas-surface-high)', color: 'var(--canvas-on-surface-variant)',
                }}>{task.category}</span>
                {task.estimatedTime && (
                  <span style={{ fontSize: '14px', color: 'var(--canvas-on-surface-variant)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>schedule</span>
                    {task.estimatedTime}
                  </span>
                )}
              </div>
              <h3 style={{
                fontFamily: 'var(--font-canvas-heading)', fontSize: '18px', fontWeight: 600, color: 'var(--canvas-on-surface)',
                textDecoration: task.completed ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{task.title}</h3>
              {task.description && (
                <p style={{ fontSize: '16px', color: 'var(--canvas-on-surface-variant)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {task.description}
                </p>
              )}
            </div>

            <button onClick={() => handleDelete(task._id)} style={{
              width: '41px', height: '41px', borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: 'transparent', color: 'var(--canvas-on-surface-variant)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'color 0.15s ease',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#ffdad6'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--canvas-on-surface-variant)'; }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '21px' }}>delete</span>
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
