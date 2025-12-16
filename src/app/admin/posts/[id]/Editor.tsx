"use client";
import { useState, useTransition } from 'react';

export default function PostEditor({ id, item }: { id: string; item: any }) {
  const [title, setTitle] = useState(item.title || '');
  const [slug, setSlug] = useState(item.slug || '');
  const [status, setStatus] = useState(item.status || 'draft');
  const [content, setContent] = useState(item.content || '');
  const [saving, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    start(async () => {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, slug, status, content }),
      });
      setMsg(res.ok ? 'Saved' : 'Save failed');
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-medium">/{slug}</div>
        <button
          type="button"
          className="px-3 py-2 rounded bg-red-600 text-white"
          onClick={async () => {
            if (!confirm('Delete this post?')) return;
            const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
            if (res.ok) {
              window.location.href = '/admin/posts';
            } else {
              setMsg('Delete failed');
            }
          }}
        >Delete</button>
      </div>
      <div>
        <label className="text-sm">Title</label>
        <input className="border p-2 w-full rounded" value={title} onChange={e => setTitle(e.target.value)} />
      </div>
      <div>
        <label className="text-sm">Slug</label>
        <input className="border p-2 w-full rounded" value={slug} onChange={e => setSlug(e.target.value)} />
      </div>
      <div>
        <label className="text-sm">Status</label>
        <select className="border p-2 w-full rounded" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="draft">draft</option>
          <option value="published">published</option>
        </select>
      </div>
      <div>
        <label className="text-sm">Content</label>
        <textarea className="border p-2 w-full rounded min-h-40" value={content} onChange={e => setContent(e.target.value)} />
      </div>
      <button type="submit" className="px-3 py-2 rounded bg-black text-white disabled:opacity-60" disabled={saving}>Save</button>
      {msg && <span className="text-sm ml-2">{msg}</span>}
    </form>
  );
}
