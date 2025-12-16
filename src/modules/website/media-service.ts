import { ObjectId, Filter } from "mongodb";
import { getDatabase } from "@/lib/db/mongodb";
import type { Media } from "./types";

export interface MediaFolder {
  _id: ObjectId;
  tenantId: ObjectId;
  websiteId?: ObjectId;
  name: string;
  slug: string;
  parentId?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export class MediaService {
  private async col() {
    const db = await getDatabase();
    return db.collection<Media>("media");
  }
  private async folders() {
    const db = await getDatabase();
    return db.collection<MediaFolder>("media_folders");
  }

  async list(
    tenantId: string | ObjectId,
    opts?: {
      folderId?: string | ObjectId;
      skip?: number;
      limit?: number;
      websiteId?: string | ObjectId;
    }
  ) {
    const c = await this.col();
    const tid =
      typeof tenantId === "string" ? new ObjectId(tenantId) : tenantId;
    const query: Filter<Media> = { tenantId: tid } as any;
    if (opts?.folderId)
      (query as any).folderId =
        typeof opts.folderId === "string"
          ? new ObjectId(opts.folderId)
          : opts.folderId;
    if (opts?.websiteId) {
      const wid =
        typeof opts.websiteId === "string"
          ? new ObjectId(opts.websiteId)
          : opts.websiteId;
      (query as any).$or = [
        { websiteId: wid },
        { websiteId: { $exists: false } },
      ];
    }
    return c
      .find(query)
      .skip(opts?.skip || 0)
      .limit(opts?.limit || 50)
      .sort({ createdAt: -1 })
      .toArray();
  }

  async getById(
    tenantId: string | ObjectId,
    id: string | ObjectId,
    websiteId?: string | ObjectId
  ) {
    const c = await this.col();
    const tid =
      typeof tenantId === "string" ? new ObjectId(tenantId) : tenantId;
    const oid = typeof id === "string" ? new ObjectId(id) : id;
    const query: Filter<Media> = { _id: oid, tenantId: tid } as any;
    if (websiteId) {
      const wid =
        typeof websiteId === "string" ? new ObjectId(websiteId) : websiteId;
      (query as any).$or = [
        { websiteId: wid },
        { websiteId: { $exists: false } },
      ];
    }
    return c.findOne(query);
  }

  async create(
    tenantId: string | ObjectId,
    data: Omit<Media, "_id" | "tenantId" | "createdAt" | "updatedAt">,
    websiteId?: string | ObjectId
  ) {
    const c = await this.col();
    const tid =
      typeof tenantId === "string" ? new ObjectId(tenantId) : tenantId;
    const wid = websiteId
      ? typeof websiteId === "string"
        ? new ObjectId(websiteId)
        : websiteId
      : undefined;
    const doc: Omit<Media, "_id"> = {
      ...data,
      tenantId: tid,
      ...(wid ? { websiteId: wid } : {}),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any;

    if (doc.tags && typeof doc.tags == "string") {
      doc.tags = doc.tags.split(",");
    }

    const r = await c.insertOne(doc as Media);
    return { ...doc, _id: r.insertedId } as Media;
  }

  async remove(tenantId: string | ObjectId, id: string | ObjectId) {
    const c = await this.col();
    const tid =
      typeof tenantId === "string" ? new ObjectId(tenantId) : tenantId;
    const oid = typeof id === "string" ? new ObjectId(id) : id;
    const r = await c.deleteOne({ _id: oid, tenantId: tid } as any);
    return r.deletedCount > 0;
  }

  async listFolders(
    tenantId: string | ObjectId,
    websiteId?: string | ObjectId
  ) {
    const f = await this.folders();
    const tid =
      typeof tenantId === "string" ? new ObjectId(tenantId) : tenantId;
    const query: Partial<MediaFolder> & { tenantId: ObjectId } = {
      tenantId: tid,
    } as any;
    if (websiteId) {
      const wid =
        typeof websiteId === "string" ? new ObjectId(websiteId) : websiteId;
      (query as any).$or = [
        { websiteId: wid },
        { websiteId: { $exists: false } },
      ];
    }
    return f.find(query).sort({ createdAt: 1 }).toArray();
  }

  async createFolder(
    tenantId: string | ObjectId,
    data: Omit<MediaFolder, "_id" | "tenantId" | "createdAt" | "updatedAt">,
    websiteId?: string | ObjectId
  ) {
    const f = await this.folders();
    const tid =
      typeof tenantId === "string" ? new ObjectId(tenantId) : tenantId;
    const wid = websiteId
      ? typeof websiteId === "string"
        ? new ObjectId(websiteId)
        : websiteId
      : undefined;
    const doc: Omit<MediaFolder, "_id"> = {
      ...data,
      tenantId: tid,
      ...(wid ? { websiteId: wid } : {}),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any;
    const r = await f.insertOne(doc as MediaFolder);
    return { ...doc, _id: r.insertedId } as MediaFolder;
  }
}

export const mediaService = new MediaService();
