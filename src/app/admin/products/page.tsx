import { cookies, headers } from "next/headers";
import { DataTableExt } from "@/components/admin/DataTableExt";

export default async function ProductsAdmin() {
  const cookie = (await cookies()).toString();
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${proto}://${host}`;
  const res = await fetch(`${baseUrl}/api/products`, { cache: "no-store", headers: { cookie } })
  if (!res.ok) {
    return <div className="text-sm text-red-600">Failed to load products</div>
  }
  const data = await res.json()
  const items = data.items || []

  return (
    <div>
      <DataTableExt
        title="Products"
        data={items}
        createHref="/admin/products/new"
        initialColumns={[
          // { key: "name", label: "Name", render: (_v, row) => (<a className="underline" href={`/admin/products/${row._id}`}>{row.name}</a>) },
          { key: "slug", label: "Slug" },
          { key: "productType", label: "Type" },
          { key: "status", label: "Status" },
          { key: "createdAt", label: "Created" },
        ]}
      />
    </div>
  )
}
