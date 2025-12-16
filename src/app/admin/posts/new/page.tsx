"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function NewPost() {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: "", slug: "", content: "", status: "draft" })

  async function submit() {
    setSaving(true)
    await fetch("/api/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    setSaving(false)
    window.location.href = "/admin/posts"
  }

  return (
    <div className="max-w-xl space-y-3">
      <h2 className="text-xl font-medium">New Post</h2>
      <input className="border p-2 w-full rounded" placeholder="Title" value={form.title} onChange={(e)=>setForm({...form, title:e.target.value, slug:e.target.value.toLowerCase().replace(/\s+/g,'-')})} />
      <input className="border p-2 w-full rounded" placeholder="Slug" value={form.slug} onChange={(e)=>setForm({...form, slug:e.target.value})} />
      <textarea className="border p-2 w-full rounded h-40" placeholder="Content" value={form.content} onChange={(e)=>setForm({...form, content:e.target.value})} />
      <div className="flex gap-2">
        <Button onClick={submit} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        <a className="underline text-sm" href="/admin/posts">Cancel</a>
      </div>
    </div>
  )
}
