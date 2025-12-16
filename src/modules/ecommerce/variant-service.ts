import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/db/mongodb';
import type { ProductVariant } from './types';

export class ProductVariantService {
  private async getCollection() {
    const db = await getDatabase();
    return db.collection<ProductVariant>('product_variants');
  }

  async list(tenantId: string | ObjectId, productId?: string, opts?: { skip?: number; limit?: number; websiteId?: string | ObjectId }) {
    const col = await this.getCollection();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    const query: Partial<ProductVariant> & { tenantId: ObjectId } = { tenantId: tid } as Partial<ProductVariant> & { tenantId: ObjectId };
    if (opts?.websiteId) (query as any).websiteId = typeof opts.websiteId === 'string' ? new ObjectId(opts.websiteId) : opts.websiteId;
    if (productId) (query as unknown as { productId: string }).productId = productId;
    return col.find(query).skip(opts?.skip || 0).limit(opts?.limit || 50).sort({ createdAt: -1 }).toArray();
  }

  async create(tenantId: string | ObjectId, data: Omit<ProductVariant, '_id' | 'tenantId' | 'createdAt' | 'updatedAt'>, websiteId?: string | ObjectId): Promise<ProductVariant> {
    const col = await this.getCollection();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    const wid = websiteId ? (typeof websiteId === 'string' ? new ObjectId(websiteId) : websiteId) : undefined;
    const doc: Omit<ProductVariant, '_id'> = { ...data, tenantId: tid as unknown as ObjectId, ...(wid ? { websiteId: wid } : {}), createdAt: new Date(), updatedAt: new Date() } as Omit<ProductVariant, '_id'>;
    const r = await col.insertOne(doc as ProductVariant);
    return { ...doc, _id: r.insertedId } as ProductVariant;
  }

  async update(id: string | ObjectId, tenantId: string | ObjectId, updates: Partial<ProductVariant>): Promise<boolean> {
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

export const productVariantService = new ProductVariantService();
