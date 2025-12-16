import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/db/mongodb';
import type { Order } from './types';

export class OrderService {
  private async getCollection() {
    const db = await getDatabase();
    return db.collection<Order>('orders');
  }

  async getByNumber(tenantId: string | ObjectId, orderNumber: string): Promise<Order | null> {
    const col = await this.getCollection();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    return col.findOne({ tenantId: tid, orderNumber });
  }

  async list(tenantId: string | ObjectId, opts?: { status?: Order['status']; skip?: number; limit?: number }): Promise<Order[]> {
    const col = await this.getCollection();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    const query: Partial<Order> & { tenantId: ObjectId } = { tenantId: tid };
    if (opts?.status) query.status = opts.status;
    return col.find(query).skip(opts?.skip || 0).limit(opts?.limit || 50).sort({ createdAt: -1 }).toArray();
  }

  async create(tenantId: string | ObjectId, data: Omit<Order, '_id' | 'tenantId' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const col = await this.getCollection();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    const doc: Omit<Order, '_id'> = { ...data, tenantId: tid, createdAt: new Date(), updatedAt: new Date() };
    const r = await col.insertOne(doc as Order);
    return { ...doc, _id: r.insertedId } as Order;
  }

  async update(id: string | ObjectId, tenantId: string | ObjectId, updates: Partial<Order>): Promise<boolean> {
    const col = await this.getCollection();
    const oid = typeof id === 'string' ? new ObjectId(id) : id;
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    const r = await col.updateOne({ _id: oid, tenantId: tid }, { $set: { ...updates, updatedAt: new Date() } });
    return r.modifiedCount > 0;
  }
}

export const orderService = new OrderService();
