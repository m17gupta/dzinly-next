import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db/mongodb';
import { RBACService } from '@/lib/rbac/rbac-service';
import { User } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = new ObjectId(session.user.id);
    const tenantId = new ObjectId(session.user.tenantId);
    // Check if user has permission to read users
    const hasPermission = await RBACService.hasPermission(userId, 'users', 'read', { tenantId });
    if (!hasPermission) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    // Get manageable users for this user
    const users = await RBACService.getManageableUsers(userId, tenantId);
    // Filter out super_admin users (SuperAdmin interface uses 'super_admin')
    const filteredUsers = users.filter((user: any) => user.role !== 'super_admin');
    return NextResponse.json({ users: filteredUsers });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
