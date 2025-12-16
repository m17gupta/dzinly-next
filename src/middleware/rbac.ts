import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { ObjectId } from 'mongodb';
import { RBACService } from '@/lib/rbac/rbac-service';
import { getDb } from '@/lib/db/mongodb';
import { User } from '@/types';

export interface RBACMiddlewareOptions {
  resource: string;
  action: string;
  requireTenantAccess?: boolean;
  allowSuperAdmin?: boolean;
}

export function withRBAC(options: RBACMiddlewareOptions) {
  return async function rbacMiddleware(
    request: NextRequest,
    handler: (request: NextRequest, context: { user: User; tenantId: ObjectId }) => Promise<NextResponse>
  ): Promise<NextResponse> {
    try {
      // Get session
      const session = await auth();
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const userId = new ObjectId(session.user.id);
      const tenantId = new ObjectId(session.user.tenantId);

      // Get user details
      const db = await getDb();
      const user = await db.collection('users').findOne({ _id: userId }) as User | null;
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Check if user is super admin and super admin is allowed
      if (options.allowSuperAdmin && user.role === 'A') {
        return handler(request, { user, tenantId });
      }

      // Check tenant access if required
      if (options.requireTenantAccess) {
        const hasAccess = await RBACService.canAccessTenant(userId, tenantId);
        if (!hasAccess) {
          return NextResponse.json({ error: 'Tenant access denied' }, { status: 403 });
        }
      }

      // Check specific permission
      const hasPermission = await RBACService.hasPermission(
        userId,
        options.resource,
        options.action,
        {
          tenantId,
       
        }
      );

      if (!hasPermission) {
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
      }

      // Log the access
      await RBACService.logActivity(
        tenantId,
        userId,
        options.action,
        options.resource,
        undefined,
        { endpoint: request.url },
        (
          request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
          request.headers.get('x-real-ip') ||
          undefined
        ),
        request.headers.get('user-agent') || undefined
      );

      return handler(request, { user, tenantId });
    } catch (error) {
      console.error('RBAC middleware error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  };
}

// Tenant isolation middleware
export async function withTenantIsolation(
  request: NextRequest,
  handler: (request: NextRequest, context: { tenantId: ObjectId; accessibleTenants: ObjectId[] }) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = new ObjectId(session.user.id);
    const tenantId = new ObjectId(session.user.tenantId);

    // Get accessible tenants for this user
    const accessibleTenants = await RBACService.getAccessibleTenants(userId);

    return handler(request, { tenantId, accessibleTenants });
  } catch (error) {
    console.error('Tenant isolation middleware error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Role-based UI middleware for dynamic rendering
export async function withRoleBasedUI(
  request: NextRequest,
  handler: (request: NextRequest, context: { user: User; uiConfig: any }) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = new ObjectId(session.user.id);
    const tenantId = new ObjectId(session.user.tenantId);

    // Get user details
    const db = await getDb();
    const user = await db.collection('users').findOne({ _id: userId }) as User | null;
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get UI configuration for user's role
    const uiConfig = await RBACService.getUIConfiguration(tenantId, user.role);

    return handler(request, { user, uiConfig });
  } catch (error) {
    console.error('Role-based UI middleware error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Franchise-specific middleware
export function withFranchiseAccess() {
  return withRBAC({
    resource: 'franchise',
    action: 'manage_clients',
    requireTenantAccess: true,
    allowSuperAdmin: true,
  });
}

// Admin-only middleware
export function withAdminAccess() {
  return async function adminMiddleware(
    request: NextRequest,
    handler: (request: NextRequest, context: { user: User; tenantId: ObjectId }) => Promise<NextResponse>
  ): Promise<NextResponse> {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = new ObjectId(session.user.id);
    const tenantId = new ObjectId(session.user.tenantId);

    const db = await getDb();
    const user = await db.collection('users').findOne({ _id: userId }) as User | null;
    
    if (!user || user.role !== 'A') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    return handler(request, { user, tenantId });
  };
}

// Client-specific middleware
export function withClientAccess() {
  return withRBAC({
    resource: 'client',
    action: 'view_own_data',
    requireTenantAccess: true,
  });
}

// Resource ownership middleware
export async function withResourceOwnership(
  request: NextRequest,
  resourceType: string,
  resourceId: string,
  handler: (request: NextRequest, context: { user: User; tenantId: ObjectId; isOwner: boolean }) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = new ObjectId(session.user.id);
    const tenantId = new ObjectId(session.user.tenantId);

    const db = await getDb();
    const user = await db.collection('users').findOne({ _id: userId }) as User | null;
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user owns the resource
    const resource = await db.collection(resourceType).findOne({ 
      _id: new ObjectId(resourceId),
      tenantId: user.tenantId,
    });

    const isOwner = resource?.userId?.equals(userId) || false;

    return handler(request, { user, tenantId, isOwner });
  } catch (error) {
    console.error('Resource ownership middleware error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}