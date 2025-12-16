"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function NewProduct() {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: "", slug: "", status: "draft", description: "", productType: "physical" })

  async function submit() {
    setSaving(true)
    await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    setSaving(false)
    window.location.href = "/admin/products"
  }

  return (
    <div className="max-w-xl space-y-3">
      <h2 className="text-xl font-medium">New Product</h2>
      <input className="border p-2 w-full rounded" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value, slug:e.target.value.toLowerCase().replace(/\s+/g,'-')})} />
      <input className="border p-2 w-full rounded" placeholder="Slug" value={form.slug} onChange={(e)=>setForm({...form, slug:e.target.value})} />
      <textarea className="border p-2 w-full rounded h-40" placeholder="Description" value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} />
      <div className="flex gap-2">
        <Button onClick={submit} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        <a className="underline text-sm" href="/admin/products">Cancel</a>
      </div>
    </div>
  )
}
