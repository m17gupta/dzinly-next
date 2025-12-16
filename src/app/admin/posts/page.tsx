import { cookies, headers } from "next/headers";
import { DataTableExt } from "@/components/admin/DataTableExt";

export default async function PostsAdmin() {
  const cookie = (await cookies()).toString();
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${proto}://${host}`;
  const res = await fetch(`${baseUrl}/api/posts`, { cache: "no-store", headers: { cookie } })
  if (!res.ok) {
    return <div className="text-sm text-red-600">Failed to load posts</div>
  }
  const data = await res.json()
  const items = data.items || []

  return (
    <div>
      <DataTableExt
        title="Posts"
        data={items}
        createHref="/admin/posts/new"
        initialColumns={[
          // { key: "title", label: "Title", render: (_v, row) => (<a className="underline" href={`/admin/posts/${row._id}`}>{row.title}</a>) },
          { key: "slug", label: "Slug" },
          { key: "status", label: "Status" },
          { key: "publishedAt", label: "Published" },
          { key: "createdAt", label: "Created" },
        ]}
      />
    </div>
  )
}
