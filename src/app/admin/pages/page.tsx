import { cookies } from "next/headers";
import { DataTableExt } from "@/components/admin/DataTableExt";
import { auth } from "@/auth";
import { pageService } from "@/modules/website/page-service";

export default async function PagesAdmin() {
  const session = await auth();

  if (!session?.user?.tenantId) {
    return (
      <div className="text-sm text-red-600">Unauthorized: Please sign in</div>
    );
  }

  const currentWebsiteId = (await cookies()).get("current_website_id")?.value;

  try {
    const data = await pageService.listPages(
      session.user.tenantId as string,
      currentWebsiteId
    );

    const items = (data || []).map((p: any) => ({
      ...p,
      _id: p._id?.toString(),
      tenantId: p.tenantId?.toString(),
      websiteId: p.websiteId?.toString(),
      createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : null,
      updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : null,
      publishedAt: p.publishedAt
        ? new Date(p.publishedAt).toISOString().slice(0, 10)
        : null,
    }));

    const website = data.length > 0 ? data[0].website.primaryDomain : null;
    const sysdomain = data.length > 0 ? data[0].website.systemSubdomain : null;

    return (
      <div>
        <DataTableExt
          website={website}
          sysdomain={sysdomain}
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
    );
  } catch (error) {
    console.error("Error loading pages:", error);
    return (
      <div className="text-sm text-red-600">
        Failed to load pages:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }
}
