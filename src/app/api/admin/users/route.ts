import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db/mongodb';
import { RBACService } from '@/lib/rbac/rbac-service';
import { DEFAULT_USER_PERMISSIONS } from '@/lib/rbac/roles';
import { User, UserRole } from '@/types';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = new ObjectId(session.user.id);
    const tenantId = new ObjectId(session.user.tenantId);

    // Check if user has permission to read users
    const hasPermission = await RBACService.hasPermission(userId, 'users', 'read', {
      tenantId,

    });

    if (!hasPermission) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get manageable users for this user
    const users = await RBACService.getManageableUsers(userId, tenantId);

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = new ObjectId(session.user.id);
    const tenantId = new ObjectId(session.user.tenantId);

    // Check if user has permission to create users
    const hasPermission = await RBACService.hasPermission(userId, 'users', 'create', {
      tenantId,
    });

    if (!hasPermission) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { email, name, role, password, metadata } = body;

    // Validate required fields
    if (!email || !name || !role || !password) {
      return NextResponse.json(
        { error: 'Email, name, role, and password are required' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['A', 'F', 'B', 'C', 'D', 'E', 'G'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Check if the current user can manage this role
    const currentUser = await (await getDb()).collection('users').findOne({ _id: userId }) as User;
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const canManage = await RBACService.canUserManageUser(userId, new ObjectId());
    if (!canManage && role !== 'G') { // Allow creating guest users
      return NextResponse.json({ error: 'Cannot create user with this role' }, { status: 403 });
    }

    // Check if email already exists
    const db = await getDb();
    const existingUser = await db.collection('users').findOne({ email, tenantId });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Get default permissions for the role
    const defaultPermissions = DEFAULT_USER_PERMISSIONS[role as UserRole];

    // Create new user
    const newUser: Omit<User, '_id'> = {
      tenantId,
      email,
      name,
      role: role as UserRole,
      passwordHash,
      status: 'active',
      permissions: defaultPermissions,
      metadata: metadata || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('users').insertOne(newUser);

    // Log the user creation
    await RBACService.logActivity(
      tenantId,
      userId,
      'create',
      'user',
      result.insertedId,
      { email, name, role }
    );

    return NextResponse.json({
      message: 'User created successfully',
      userId: result.insertedId,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}