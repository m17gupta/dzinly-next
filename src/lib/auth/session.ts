// src/lib/auth/session.ts
import { auth } from "@/lib/auth";

/**
 * Returns the session object or null.
 * Call this from server-side contexts (server components, route handlers).
 */
export async function getSession() {
  return await auth();
}

/**
 * Throws if there is no authenticated user.
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session || !("user" in session) || !session.user) {
    throw new Error("Unauthorized - Please sign in");
  }
  return session.user as {
    id: string;
    email: string;
    name: string;
    tenantId: string;
    tenantSlug: string;
    role: string;
  };
}

/**
 * Ensure user has one of the allowed roles.
 */
export async function requireRole(allowedRoles: string[]) {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    throw new Error("Insufficient permissions");
  }
  return user;
}
