import { ObjectId } from 'mongodb';
import { getDatabase } from '../db/mongodb';
import type { Tenant } from '@/types';
import { TenantModel } from '@/models/tenant';

export class TenantService {
  private async getCollection() {
    const db = await getDatabase();
    return db.collection<Tenant>('tenants');
  }

  async getTenantBySlug(slug: string): Promise<Tenant | null> {
    const collection = await this.getCollection();
    return collection.findOne({ slug: slug.toLowerCase() });
  }

  async getTenantById(id: string | ObjectId): Promise<Tenant | null> {
    const collection = await this.getCollection();
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    return collection.findOne({ _id: objectId });
  }

  async getTenantByDomain(domain: string): Promise<Tenant | null> {
    const collection = await this.getCollection();
    return collection.findOne({
      customDomain: domain.toLowerCase(),
      customDomainVerified: true,
    });
  }

  async createTenant(data: {
    slug: string;
    name: string;
    email: string;
    plan?: Tenant['plan'];
  }): Promise<Tenant> {
    const collection = await this.getCollection();

    // Check if slug already exists
    const existing = await this.getTenantBySlug(data.slug);
    if (existing) {
      throw new Error('Tenant slug already exists');
    }

    const tenant: Omit<TenantModel, "_id"> = {
      slug: data.slug.toLowerCase(),
      name: data.name,
      email: data.email,
      plan: data.plan || 'trial',
      subscriptionStatus: 'active',
      customDomainVerified: false,
      branding: {
        colors: {
          primary: '#3b82f6',
          secondary: '#f4e04f',
        },
      },
      paymentGateways: {},
      features: {
        websiteEnabled: true,
        ecommerceEnabled: true,
        blogEnabled: true,
        invoicesEnabled: true,
      },
      settings: {
        locale: 'en-US',
        currency: 'USD',
        timezone: 'UTC',
      },
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(tenant as Tenant);
    return { ...tenant, _id: result.insertedId } as Tenant;
  }

  async updateTenant(
    id: string | ObjectId,
    updates: Partial<Tenant>
  ): Promise<boolean> {
    const collection = await this.getCollection();
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;

    const result = await collection.updateOne(
      { _id: objectId },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      }
    );
    return result.modifiedCount > 0;
  }

  async suspendTenant(id: string | ObjectId): Promise<boolean> {
    return this.updateTenant(id, { status: 'suspended' });
  }

  async activateTenant(id: string | ObjectId): Promise<boolean> {
    return this.updateTenant(id, { status: 'active' });
  }

  async verifyCustomDomain(
    id: string | ObjectId,
    domain: string
  ): Promise<boolean> {
    return this.updateTenant(id, {
      customDomain: domain.toLowerCase(),
      customDomainVerified: true,
    });
  }

  async listTenants(options?: {
    skip?: number;
    limit?: number;
    status?: Tenant['status'];
  }): Promise<Tenant[]> {
    const collection = await this.getCollection();
    const query: Partial<Pick<Tenant, 'status'>> = {};
    if (options?.status) {
      query.status = options.status;
    }
    return collection
      .find(query)
      .skip(options?.skip || 0)
      .limit(options?.limit || 50)
      .sort({ createdAt: -1 })
      .toArray();
  }
}

export const tenantService = new TenantService();
