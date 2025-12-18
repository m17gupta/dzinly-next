import { cookies } from "next/headers";
import { auth } from "@/auth";
import { websiteService } from "@/lib/websites/website-service";
import { AppShellClient } from "./AppShellClient";
import { Website, User } from "./AppShell";

type AppShellProviderProps = {
  children: React.ReactNode;
};

export async function AppShellProvider({ children }: AppShellProviderProps) {
  // Get session and user data
  const session = await auth();
  console.log("session",session)
  const user: User | null = session?.user
    ? {
        id: session.user.id || "",
        email: session.user.email || "",
        name: session.user.name || "",
        tenantId: session.user.tenantId || "",
        tenantSlug: session.user.tenantSlug || "",
        role: session.user.role || "",
        // forward permissions if present on the session user
        permissions: Array.isArray((session.user as any).permissions)
          ? (session.user as any).permissions
          : undefined,
      }
    : null;

  // Get websites for the current tenant
  let websites: Website[] = [];
  let currentWebsite: Website | null = null;
  debugger
  if (user?.tenantId) {
    try {
      const websiteDocs = await websiteService.listByTenant(user.tenantId);
      websites = websiteDocs.map((doc) => ({
        _id: doc._id.toString(),
        websiteId: doc.websiteId,
        name: doc.name,
        primaryDomain: Array.isArray(doc.primaryDomain)
          ? doc.primaryDomain[0] ?? null
          : doc.primaryDomain,
        systemSubdomain: doc.systemSubdomain,
        serviceType: doc.serviceType,
        status: "active" as const, // TODO: Add status field to WebsiteDoc
      }));

      // Get current website from cookie
      const cookieStore = await cookies();
      const currentWebsiteId = cookieStore.get("current_website_id")?.value;

      if (currentWebsiteId) {
        currentWebsite =
          websites.find((w) => w._id === currentWebsiteId) || null;
      }

      // If no current website but websites exist, set the first one as current
      if (!currentWebsite && websites.length > 0) {
        
        currentWebsite = websites[0];
      }
    } catch (error) {
      console.error("Failed to load websites:", error);
    }
  }


  return (
    <AppShellClient
      websites={websites}
      currentWebsite={currentWebsite}
      user={user}
    >
      {children}
    </AppShellClient>
  );
}
