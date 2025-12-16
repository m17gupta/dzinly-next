import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/db/mongodb';
import type { Cart } from './types';

export class CartService {
  private async getCollection() {
    const db = await getDatabase();
    return db.collection<Cart>('carts');
  }

  async getBySession(tenantId: string | ObjectId, sessionId: string): Promise<Cart | null> {
    const col = await this.getCollection();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    return col.findOne({ tenantId: tid, sessionId });
  }

  async createOrUpdateBySession(
    tenantId: string | ObjectId,
    sessionId: string,
    data: Omit<Cart, '_id' | 'tenantId' | 'sessionId' | 'createdAt' | 'updatedAt'>
  ): Promise<Cart> {
    const col = await this.getCollection();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    const now = new Date();
    const update = {
      $set: {
        ...data,
        tenantId: tid,
        sessionId,
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    };
    const doc = await col.findOneAndUpdate(
      { tenantId: tid, sessionId },
      update,
      { upsert: true, returnDocument: 'after' }
    );
    // In MongoDB Node.js driver v7, by default includeResultMetadata is false and the return is the document or null
    if (!doc) {
      // In extremely rare race conditions, doc can be null right after upsert; fetch explicitly
      const fresh = await col.findOne({ tenantId: tid, sessionId });
      if (!fresh) throw new Error('Failed to create or fetch cart');
      return fresh as Cart;
    }
    return doc as Cart;
  }

  async updateExpiry(id: string | ObjectId, expiresAt: Date): Promise<boolean> {
    const col = await this.getCollection();
    const oid = typeof id === 'string' ? new ObjectId(id) : id;
    const r = await col.updateOne({ _id: oid }, { $set: { expiresAt, updatedAt: new Date() } });
    return r.modifiedCount > 0;
  }
}

export const cartService = new CartService();
