export default async function OrdersAdmin() {
  const res = await fetch("/api/orders", { cache: "no-store" })
  const data = await res.json()
  const items = data.items || []

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium">Orders</h2>
        <a className="underline text-sm self-center" href="/admin/orders">Refresh</a>
      </div>
      <ul className="space-y-2">
        {items.map((p: { _id: string; orderNumber: number; status: string }) => (
          <li key={p._id} className="border p-3 rounded">
            <div className="font-medium">Order #{p.orderNumber}</div>
            <div className="text-xs text-muted-foreground">{p.status}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
