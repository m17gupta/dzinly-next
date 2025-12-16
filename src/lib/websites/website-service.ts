import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/db/mongodb";

export type ServiceType = "WEBSITE_ONLY" | "ECOMMERCE";

export interface WebsiteDoc {
  _id: ObjectId;
  websiteId: string;
  tenantId: ObjectId;
  name: string;
  serviceType: ServiceType;
  primaryDomain?: string[] | null;
  systemSubdomain: string;
  branding?: {
    // legacy fields
    logoUrl?: string | null;
    colorPaletteJson?: Record<string, unknown> | null;
    headerLayoutId?: string | null;
    footerContentHtml?: string | null;
    // new structured branding
    header?: {
      logoUrl?: string | null;
      navLinks?: { label: string; href: string }[];
    };
    footer?: {
      text?: string | null;
      links?: { label: string; href: string }[];
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 40);
}

export class WebsiteService {
  private async col() {
    const db = await getDatabase();
    return db.collection<WebsiteDoc>("websites");
  }

  async ensureIndexes() {
    const c = await this.col();
    await Promise.all([
      c.createIndex(
        { websiteId: 1 },
        { unique: true, name: "uniq_websites_id" }
      ),
      c.createIndex(
        { tenantId: 1, createdAt: -1 },
        { name: "websites_tenant_createdAt" }
      ),
      c.createIndex(
        { systemSubdomain: 1 },
        { unique: true, name: "uniq_websites_sys_sub" }
      ),
      // Unique only for actual string domains; avoid indexing nulls
      c.createIndex(
        { primaryDomain: 1 },
        { unique: true, sparse: true, name: "uniq_websites_primary_domain" }
      ),
    ]);
  }

  async listByTenant(tenantId: string | ObjectId) {
    const c = await this.col();
    const tid =
      typeof tenantId === "string" ? new ObjectId(tenantId) : tenantId;
    return c.find({ tenantId: tid }).sort({ createdAt: -1 }).toArray();
  }

  async getByHost(host: string) {
    const c = await this.col();
    const doc = await c.findOne({
      $or: [
        { primaryDomain: host }, // matches string
        { primaryDomain: { $elemMatch: { $eq: host } } }, // matches array
        { systemSubdomain: host },
      ],
    });
    return doc || null;
  }

  private async generateSystemSubdomain(
    tenantSlug: string,
    websiteName: string
  ) {
    const base = process.env.SYSTEM_BASE_DOMAIN || "Dzinly.xyz";
    const left = `${slugify(tenantSlug)}-${slugify(websiteName)}`.slice(0, 60);
    const candidate = `${left}.${base}`;
    const c = await this.col();
    const exists = await c.findOne({ systemSubdomain: candidate });
    if (!exists) return candidate;
    const suf = Math.random().toString(36).slice(2, 6);
    return `${left}-${suf}.${base}`;
  }

  async create(params: {
    tenantId: string | ObjectId;
    tenantSlug: string;
    name: string;
    serviceType: ServiceType;
    primaryDomain?: string[] | null;
  }) {
    const c = await this.col();
    const tid =
      typeof params.tenantId === "string"
        ? new ObjectId(params.tenantId)
        : params.tenantId;
    const websiteId = new ObjectId().toHexString();
    const systemSubdomain = await this.generateSystemSubdomain(
      params.tenantSlug,
      params.name
    );
    const now = new Date();
    const doc: Omit<WebsiteDoc, "_id"> = {
      websiteId,
      tenantId: tid,
      name: params.name,
      serviceType: params.serviceType,
      ...(params.primaryDomain ? { primaryDomain: params.primaryDomain } : {}),
      systemSubdomain,
      branding: {},
      createdAt: now,
      updatedAt: now,
    };
    const r = await c.insertOne(doc as WebsiteDoc);
    return { ...doc, _id: r.insertedId } as WebsiteDoc;
  }

  async getByWebsiteId(websiteId: string) {
    const c = await this.col();
    return c.findOne({ websiteId });
  }

  async updateBranding(
    websiteId: string,
    updates: NonNullable<WebsiteDoc["branding"]>
  ) {
    const c = await this.col();
    const r = await c.updateOne(
      { websiteId },
      { $set: { branding: updates, updatedAt: new Date() } }
    );
    return r.modifiedCount > 0;
  }

  async updateDomain(websiteId: string, primaryDomain: string[] | null) {
    const c = await this.col();
    const r = await c.updateOne(
      { websiteId },
      { $set: { primaryDomain, updatedAt: new Date() } }
    );
    return r.modifiedCount > 0;
  }
}

export const websiteService = new WebsiteService();
