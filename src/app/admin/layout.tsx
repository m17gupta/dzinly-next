import React from "react";
import { AppShellClient } from "@/components/admin/AppShellClient";
import { auth } from "@/auth";
import { websiteService } from "@/lib/websites/website-service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get session
  const session = await auth();
  
  // Redirect if not authenticated
  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Fetch websites for the tenant
  const websites = session.user.tenantId
    ? await websiteService.listByTenant(session.user.tenantId)
    : [];

  // Get current website from cookie
  const cookieStore = await cookies();
  const currentWebsiteId = cookieStore.get("current_website_id")?.value;
  
  const currentWebsite = currentWebsiteId
    ? websites.find((w) => String(w._id) === currentWebsiteId) || websites[0] || null
    : websites[0] || null;

  // Prepare user data
  const user = {
    id: session.user.id || "",
    name: session.user.name || "",
    email: session.user.email || "",
    tenantId: session.user.tenantId || "",
    tenantSlug: session.user.tenantSlug || "",
    role: session.user.role || "user",
    image: null,
  };

  // Serialize websites (convert ObjectId to string)
  const serializedWebsites = websites.map((w) => ({
    ...w,
    _id: String(w._id),
    tenantId: String(w.tenantId),
  }));

  const serializedCurrentWebsite = currentWebsite
    ? {
        ...currentWebsite,
        _id: String(currentWebsite._id),
        tenantId: String(currentWebsite.tenantId),
      }
    : null;

  return (
    <AppShellClient 
      user={user} 
      websites={serializedWebsites}
      currentWebsite={serializedCurrentWebsite}
    >
      {children}
    </AppShellClient>
  );
}