import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/db/mongodb';
import type { ProductCategory } from './types';

export class ProductCategoryService {
  private async getCollection() {
    const db = await getDatabase();
    return db.collection<ProductCategory>('product_categories');
  }

  async getBySlug(tenantId: string | ObjectId, slug: string): Promise<ProductCategory | null> {
    const col = await this.getCollection();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    return col.findOne({ tenantId: tid, slug });
  }

  async list(tenantId: string | ObjectId, websiteId?: string | ObjectId): Promise<ProductCategory[]> {
    const col = await this.getCollection();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    const wid = websiteId ? (typeof websiteId === 'string' ? new ObjectId(websiteId) : websiteId) : undefined;
    const query: any = { tenantId: tid };
    if (wid) query.websiteId = wid;
    return col.find(query).sort({ sortOrder: 1, name: 1 }).toArray();
  }

  async create(tenantId: string | ObjectId, data: Omit<ProductCategory, '_id' | 'tenantId' | 'createdAt' | 'updatedAt'>, websiteId?: string | ObjectId): Promise<ProductCategory> {
    const col = await this.getCollection();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    const wid = websiteId ? (typeof websiteId === 'string' ? new ObjectId(websiteId) : websiteId) : undefined;
    const doc: Omit<ProductCategory, '_id'> = {
      ...data,
      tenantId: tid,
      ...(wid ? { websiteId: wid } : {}),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const r = await col.insertOne(doc as ProductCategory);
    return { ...doc, _id: r.insertedId } as ProductCategory;
  }

  async update(id: string | ObjectId, tenantId: string | ObjectId, updates: Partial<ProductCategory>): Promise<boolean> {
    const col = await this.getCollection();
    const oid = typeof id === 'string' ? new ObjectId(id) : id;
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    const r = await col.updateOne({ _id: oid, tenantId: tid }, { $set: { ...updates, updatedAt: new Date() } });
    return r.modifiedCount > 0;
  }

  async remove(id: string | ObjectId, tenantId: string | ObjectId): Promise<boolean> {
    const col = await this.getCollection();
    const oid = typeof id === 'string' ? new ObjectId(id) : id;
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    const r = await col.deleteOne({ _id: oid, tenantId: tid });
    return r.deletedCount > 0;
  }
}

export const productCategoryService = new ProductCategoryService();
