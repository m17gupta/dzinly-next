import { cookies, headers } from "next/headers";
import { DataTableExt } from "@/components/admin/DataTableExt";

export default async function PagesAdmin() {
  const cookie = (await cookies()).toString();
  const currentWebsiteId = (await cookies()).get('current_website_id')?.value;
  
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${proto}://${host}`;
  const res = await fetch(`${baseUrl}/api/pages`, { cache: "no-store", headers: { cookie } })
  if (!res.ok) {
    return <div className="text-sm text-red-600">Failed to load pages</div>
  }

  const data = await res.json()

  
  const items = (data.items || []).map((p: any) => ({
    ...p,
    publishedAt: p.publishedAt ? new Date(p.publishedAt).toISOString().slice(0,10) : null,
  }));

  return (
    <div>
      <DataTableExt
        title="Pages"
        data={items}
        createHref="/admin/pages/new"
        initialColumns={[
          { key: "slug", label: "Slug" },
          { key: "status", label: "Status" },
          { key: "publishedAt", label: "Published" },
          { key: "createdAt", label: "Created" },
        ]}
      />
    </div>
  )
}
