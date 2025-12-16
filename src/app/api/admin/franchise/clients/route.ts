import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db/mongodb';
import { RBACService } from '@/lib/rbac/rbac-service';
import { BrandingService } from '@/lib/branding/branding-service';
import { Tenant, User } from '@/types';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = new ObjectId(session.user.id);
    const tenantId = new ObjectId(session.user.tenantId);

    // Check if user has franchise permissions
    const hasPermission = await RBACService.hasPermission(userId, 'franchise', 'manage_clients', {
      tenantId,
    
    });

    if (!hasPermission) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get franchise clients
    const clients = await RBACService.getFranchiseClients(tenantId);

    // Get client tenant details
    const db = await getDb();
    const clientDetails = await Promise.all(
      clients.map(async (client) => {
        const tenant = await db.collection('tenants').findOne({ _id: client.clientTenantId }) as Tenant;
        return {
          ...client,
          tenant,
        };
      })
    );

    return NextResponse.json({ clients: clientDetails });
  } catch (error) {
    console.error('Error fetching franchise clients:', error);
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
    const franchiseTenantId = new ObjectId(session.user.tenantId);

    // Check if user has franchise permissions to create clients
    const hasPermission = await RBACService.hasPermission(userId, 'franchise', 'create_clients', {
      tenantId: franchiseTenantId,

    });

    if (!hasPermission) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      email,
      phone,
      slug,
      adminUser,
      relationshipType = 'direct',
      commissionRate,
      settings = {
        allowDirectAccess: true,
        shareAnalytics: false,
        customBranding: false,
      },
    } = body;

    // Validate required fields
    if (!name || !email || !slug || !adminUser?.email || !adminUser?.name || !adminUser?.password) {
      return NextResponse.json(
        { error: 'Name, email, slug, and admin user details are required' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Check if slug is already taken
    const existingTenant = await db.collection('tenants').findOne({ slug });
    if (existingTenant) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }

    // Get franchise tenant for branding inheritance
    const franchiseTenant = await db.collection('tenants').findOne({ _id: franchiseTenantId }) as Tenant;
    if (!franchiseTenant) {
      return NextResponse.json({ error: 'Franchise not found' }, { status: 404 });
    }

    // Create client tenant
    const clientTenant: Omit<Tenant, '_id'> = {
      slug,
      name,
      email,
      phone,
      type: 'client',
      parentTenantId: franchiseTenantId,
      branding: settings.customBranding 
        ? BrandingService.getDefaultBrandingSettings()
        : franchiseTenant.branding,
      customDomainVerified: false,
      plan: 'basic',
      subscriptionStatus: 'active',
      paymentGateways: {},
      features: {
        websiteEnabled: true,
        ecommerceEnabled: true,
        blogEnabled: false,
        invoicesEnabled: false,
        franchiseManagement: false,
        clientManagement: false,
        whiteLabeling: false,
      },
      settings: {
        locale: 'en-US',
        currency: 'USD',
        timezone: 'America/New_York',
        maxUsers: 5,
      },
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const tenantResult = await db.collection('tenants').insertOne(clientTenant);
    const clientTenantId = tenantResult.insertedId;

    // Create admin user for the client
    const passwordHash = await bcrypt.hash(adminUser.password, 12);
    const clientAdminUser: Omit<User, '_id'> = {
      tenantId: clientTenantId,
      email: adminUser.email,
      name: adminUser.name,
      role: 'C', // Client role
      passwordHash,
      status: 'active',
      permissions: {
        dashboard: true,
        users: [],
        tenants: [],
        products: ['read'],
        orders: ['create', 'read'],
        content: ['read'],
        settings: [],
        client: {
          viewOwnData: true,
          editProfile: true,
          placeOrders: true,
        },
      },
      metadata: adminUser.metadata || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('users').insertOne(clientAdminUser);

    // Create franchise-client relationship
    const relationshipId = await RBACService.createFranchiseClientRelationship(
      franchiseTenantId,
      clientTenantId,
      {
        relationshipType,
        commissionRate,
        settings,
      }
    );

    // Log the client creation
    await RBACService.logActivity(
      franchiseTenantId,
      userId,
      'create',
      'client',
      clientTenantId,
      { name, email, slug, relationshipType }
    );

    return NextResponse.json({
      message: 'Client created successfully',
      clientTenantId,
      relationshipId,
    });
  } catch (error) {
    console.error('Error creating franchise client:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}