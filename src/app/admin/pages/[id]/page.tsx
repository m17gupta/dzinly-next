import { cookies as cookiesFn, headers as headersFn } from "next/headers";
import PageEditor, { FieldConfig } from "@/components/admin/Editor";


export default async function PageDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const param = await params;
  const t = param.id;
  const cookies = await cookiesFn(); // no await
  const headers = await headersFn(); // no await
  const cookie = cookies.toString();
  const host = headers.get("x-forwarded-host") ?? headers.get("host");
  const proto = headers.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${proto}://${host}`;

  const res = await fetch(`${baseUrl}/api/pages/${t}`, {
    cache: "no-store",
    headers: { cookie },
  });

  const websiteId = cookies.get("current_website_id")?.value

  const viewwebsiteurl = await fetch(`${baseUrl}/api/domain/website?id=${websiteId}`, {
    cache: "no-store",
  });

  const website = await viewwebsiteurl.json()

  if (!res.ok) return <div className="text-sm text-red-600">Not found</div>;

  
  const { item } = await res.json();

  const fieldConfig: FieldConfig[] = [
    // Readonly fields (shown at top)
    { name: "slug", label: "Slug", type: "readonly", side: "NA" },
    { name: "createdAt", label: "CreatedAt", type: "readonly", side: "NA" },
    { name: "updatedAt", label: "UpdatedAt", type: "readonly", side: "NA" },

    // Left side (8/12 width) - Main content
    {
      name: "title",
      label: "Title",
      type: "text",
      side: "left",
      placeholder: "Enter page title",
    },
    {
      name: "content",
      label: "Content",
      type: "textarea",
      side: "left",
      rows: 10,
    },

    // Right side (4/12 width) - Metadata
    {
      name: "slug",
      label: "Slug",
      type: "text",
      side: "right",
      placeholder: "page-slug",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      side: "right",
      options: [
        { value: "draft", label: "draft" },
        { value: "published", label: "published" },
      ],
    },
    {
      name: "tenantId",
      label: "Tenant",
      type: "text",
      side: "right",
      placeholder: "tenant-id",
      readOnly: true
    },
     {
      name: "websiteId",
      label: "Website",
      type: "text",
      side: "right",
      placeholder: "website-id",
      readOnly: true
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">Edit Page</h2>
      <PageEditor viewUrl={website} id={t} item={item} fields={fieldConfig} />
    </div>
  );
}
