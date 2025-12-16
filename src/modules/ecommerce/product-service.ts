import { ObjectId } from 'mongodb';
import { Filter } from 'mongodb';

import { getDatabase } from '@/lib/db/mongodb';
import type { Product } from './types';

export class ProductService {
  private async getCollection() {
    const db = await getDatabase();
    return db.collection<Product>("products");
  }

  async getProduct(
    tenantId: string | ObjectId,
    productId: string | ObjectId
  ): Promise<Product | null> {
    const collection = await this.getCollection();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    const pid = typeof productId === 'string' ? new ObjectId(productId) : productId;
    return collection.findOne({
      _id: pid,
      tenantId: tid,
    });
  }

  async getProductBySlug(
    tenantId: string | ObjectId,
    slug: string
  ): Promise<Product | null> {
    const collection = await this.getCollection();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    return collection.findOne({ tenantId: tid, slug, status: 'published' });
  }

  async getProductBySlugForWebsite(
    tenantId: string | ObjectId,
    slug: string,
    websiteId?: string | ObjectId,
  ): Promise<Product | null> {
    const c = await this.getCollection();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    const wid = websiteId ? (typeof websiteId === 'string' ? new ObjectId(websiteId) : websiteId) : undefined;
    const query: Filter<Product> = { tenantId: tid, slug, status: 'published' } as any;
    if (wid) (query as any).$or = [{ websiteId: wid }, { websiteId: { $exists: false } }];
    return c.findOne(query);
  }

  async listProducts(
    tenantId: string | ObjectId,
    filters?: {
      productType?: Product['productType'];
      categoryId?: string;
      status?: Product['status'];
      skip?: number;
      limit?: number;
      websiteId?: string | ObjectId;
    }
  ): Promise<Product[]> {
    const collection = await this.getCollection();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    const query: Partial<Product> & { tenantId: ObjectId } = { tenantId: tid };
    if (filters?.websiteId) {
      const wid = typeof filters.websiteId === 'string' ? new ObjectId(filters.websiteId) : filters.websiteId;
      (query as any).$or = [{ websiteId: wid }, { websiteId: { $exists: false } }];
    }
    if (filters?.productType) {
      query.productType = filters.productType;
    }
    if (filters?.categoryId) {
      (query as unknown as { categoryIds: string[] }).categoryIds = [filters.categoryId];
    }
    if (filters?.status) {
      query.status = filters.status;
    }
    return collection
      .find(query)
      .skip(filters?.skip || 0)
      .limit(filters?.limit || 50)
      .sort({ createdAt: -1 })
      .toArray();
  }

  async createProduct(
    tenantId: string | ObjectId,
    data: Omit<Product, keyof import('@/types').BaseDocument>,
    websiteId?: string | ObjectId,
  ): Promise<Product> {
    const collection = await this.getCollection();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    const wid = websiteId ? (typeof websiteId === 'string' ? new ObjectId(websiteId) : websiteId) : undefined;
    const product: Omit<Product, '_id'> = {
      ...data,
      tenantId: tid,
      ...(wid ? { websiteId: wid } : {}),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await collection.insertOne(product as Product);
    return { ...product, _id: result.insertedId } as Product;
  }

  async updateProduct(
    id: string | ObjectId,
    tenantId: string | ObjectId,
    updates: Partial<Product>
  ): Promise<boolean> {
    const collection = await this.getCollection();
    const oid = typeof id === 'string' ? new ObjectId(id) : id;
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    const result = await collection.updateOne(
      { _id: oid, tenantId: tid },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      }
    );
    return result.modifiedCount > 0;
  }

  async deleteProduct(
    id: string | ObjectId,
    tenantId: string | ObjectId
  ): Promise<boolean> {
    const collection = await this.getCollection();
    const oid = typeof id === 'string' ? new ObjectId(id) : id;
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    const result = await collection.deleteOne({
      _id: oid,
      tenantId: tid,
    });
    return result.deletedCount > 0;
  }

  async getById(
    tenantId: string | ObjectId,
    id: string | ObjectId,
    websiteId?: string | ObjectId,
  ): Promise<Product | null> {
    const c = await this.getCollection();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    const oid = typeof id === 'string' ? new ObjectId(id) : id;
    const wid = websiteId ? (typeof websiteId === 'string' ? new ObjectId(websiteId) : websiteId) : undefined;
    const query: Filter<Product> = { _id: oid, tenantId: tid } as any;
    if (wid) (query as any).$or = [{ websiteId: wid }, { websiteId: { $exists: false } }];
    return c.findOne(query);
  }

  async searchProducts(
    tenantId: string | ObjectId,
    searchTerm: string
  ): Promise<Product[]> {
    const collection = await this.getCollection();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    return collection
      .find({
        tenantId: tid,
        status: 'published',
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { tags: { $regex: searchTerm, $options: 'i' } },
        ],
      })
      .limit(20)
      .toArray();
  }
}

export const productService = new ProductService();
