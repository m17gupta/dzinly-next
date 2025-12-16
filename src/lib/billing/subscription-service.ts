import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/db/mongodb';

export interface SubscriptionDoc {
  _id: ObjectId;
  tenantId: ObjectId;
  plan: 'trial' | 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'past_due' | 'canceled' | 'incomplete';
  startedAt?: Date;
  currentPeriodEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class SubscriptionService {
  private async col() {
    const db = await getDatabase();
    return db.collection<SubscriptionDoc>('subscriptions');
  }

  async get(tenantId: string | ObjectId): Promise<SubscriptionDoc | null> {
    const c = await this.col();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    return c.findOne({ tenantId: tid });
  }

  async upsert(tenantId: string | ObjectId, updates: Partial<Omit<SubscriptionDoc, '_id' | 'tenantId'>>): Promise<SubscriptionDoc> {
    const c = await this.col();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    const now = new Date();
    const r = await c.findOneAndUpdate(
      { tenantId: tid },
      { $set: { ...updates, tenantId: tid, updatedAt: now }, $setOnInsert: { createdAt: now } },
      { upsert: true, returnDocument: 'after' }
    );
    return r as unknown as SubscriptionDoc;
  }
}

export const subscriptionService = new SubscriptionService();
