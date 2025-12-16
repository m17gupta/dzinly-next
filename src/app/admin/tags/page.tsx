"use client"

import { useEffect, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"

type Tag = { _id: string; name: string; slug: string }

export default function TagsAdmin() {
  const [items, setItems] = useState<Tag[]>([])
  const [isPending, startTransition] = useTransition()

  async function load() {
    const res = await fetch("/api/blog_tags", { cache: "no-store" })
    const data = await res.json()
    setItems(data.items || [])
  }

  async function create() {
    const name = prompt("Tag name")
    if (!name) return
    const slug = name.toLowerCase().replace(/\s+/g, "-")
    await fetch("/api/blog_tags", { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ name, slug }) })
    startTransition(() => { load() })
  }

  useEffect(() => { startTransition(() => { load() }) }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium">Blog Tags</h2>
        <div className="flex gap-2">
          <Button onClick={create}>New</Button>
          <Button onClick={() => startTransition(() => { load() })} disabled={isPending}>{isPending ? 'Loading...' : 'Reload'}</Button>
        </div>
      </div>
      <ul className="space-y-2">
        {items.map((p) => (
          <li key={p._id} className="border p-3 rounded">
            <div className="font-medium">{p.name}</div>
            <div className="text-xs text-muted-foreground">/{p.slug}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
