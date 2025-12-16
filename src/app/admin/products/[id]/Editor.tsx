"use client";
import { useState, useTransition } from 'react';

export default function ProductEditor({ id, item }: { id: string; item: any }) {
  const [name, setName] = useState(item.name || '');
  const [slug, setSlug] = useState(item.slug || '');
  const [status, setStatus] = useState(item.status || 'draft');
  const [description, setDescription] = useState(item.description || '');
  const [saving, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    start(async () => {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, status, description }),
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
            if (!confirm('Delete this product?')) return;
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
              window.location.href = '/admin/products';
            } else {
              setMsg('Delete failed');
            }
          }}
        >Delete</button>
      </div>
      <div>
        <label className="text-sm">Name</label>
        <input className="border p-2 w-full rounded" value={name} onChange={e => setName(e.target.value)} />
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
          <option value="archived">archived</option>
        </select>
      </div>
      <div>
        <label className="text-sm">Description</label>
        <textarea className="border p-2 w-full rounded min-h-40" value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <button type="submit" className="px-3 py-2 rounded bg-black text-white disabled:opacity-60" disabled={saving}>Save</button>
      {msg && <span className="text-sm ml-2">{msg}</span>}
    </form>
  );
}
