import { ObjectId } from 'mongodb';
import { Filter } from 'mongodb';

import { getDatabase } from '@/lib/db/mongodb';
import type { Post } from './types';

export class PostService {
  private async getCollection() {
    const db = await getDatabase();
    return db.collection<Post>('posts');
  }

  async getBySlug(tenantId: string | ObjectId, slug: string): Promise<Post | null> {
    const col = await this.getCollection();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    return col.findOne({ tenantId: tid, slug, status: 'published' });
  }

  async getBySlugForWebsite(
    tenantId: string | ObjectId,
    slug: string,
    websiteId?: string | ObjectId,
  ): Promise<Post | null> {
    const col = await this.getCollection();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    const wid = websiteId ? (typeof websiteId === 'string' ? new ObjectId(websiteId) : websiteId) : undefined;
    const query: Filter<Post> = { tenantId: tid, slug, status: 'published' } as any;
    if (wid) (query as any).$or = [{ websiteId: wid }, { websiteId: { $exists: false } }];
    return col.findOne(query);
  }

  async getById(
    tenantId: string | ObjectId,
    id: string | ObjectId,
    websiteId?: string | ObjectId,
  ): Promise<Post | null> {
    const col = await this.getCollection();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    const oid = typeof id === 'string' ? new ObjectId(id) : id;
    const wid = websiteId ? (typeof websiteId === 'string' ? new ObjectId(websiteId) : websiteId) : undefined;
    const query: Filter<Post> = { _id: oid, tenantId: tid } as any;
    if (wid) (query as any).$or = [{ websiteId: wid }, { websiteId: { $exists: false } }];
    return col.findOne(query);
  }

  async list(tenantId: string | ObjectId, opts?: { status?: Post['status']; tag?: string; skip?: number; limit?: number; websiteId?: string | ObjectId }): Promise<Post[]> {
    const col = await this.getCollection();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    const wid = opts?.websiteId ? (typeof opts.websiteId === 'string' ? new ObjectId(opts.websiteId) : opts.websiteId) : undefined;
    const query: Partial<Post> & { tenantId: ObjectId } = { tenantId: tid };
    if (wid) (query as any).$or = [{ websiteId: wid }, { websiteId: { $exists: false } }];
    if (opts?.status) query.status = opts.status;
    if (opts?.tag) query.tags = { $in: [opts.tag] } as unknown as Post['tags'];
    return col.find(query).skip(opts?.skip || 0).limit(opts?.limit || 50).sort({ createdAt: -1 }).toArray();
  }

  async create(tenantId: string | ObjectId, data: Omit<Post, '_id' | 'tenantId' | 'createdAt' | 'updatedAt'>, websiteId?: string | ObjectId): Promise<Post> {
    const col = await this.getCollection();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    const wid = websiteId ? (typeof websiteId === 'string' ? new ObjectId(websiteId) : websiteId) : undefined;
    const doc: Omit<Post, '_id'> = { ...data, tenantId: tid, ...(wid ? { websiteId: wid } : {}), createdAt: new Date(), updatedAt: new Date() };
    const r = await col.insertOne(doc as Post);
    return { ...doc, _id: r.insertedId } as Post;
  }

  async update(id: string | ObjectId, tenantId: string | ObjectId, updates: Partial<Post>): Promise<boolean> {
    const col = await this.getCollection();
    const oid = typeof id === 'string' ? new ObjectId(id) : id;
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    const r = await col.updateOne({ _id: oid, tenantId: tid }, { $set: { ...updates, updatedAt: new Date() } });
    return r.modifiedCount > 0;
  }
}

export const postService = new PostService();
