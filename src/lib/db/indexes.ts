import { getDatabase } from './mongodb';

export async function ensureIndexes() {
  const db = await getDatabase();
  await Promise.all([
    // Core
    db.collection('tenants').createIndex({ slug: 1 }, { unique: true, name: 'uniq_tenants_slug' }),
    db.collection('users').createIndex({ tenantId: 1, email: 1 }, { unique: true, name: 'uniq_users_tenant_email' }),
    db.collection('users').createIndex({ tenantId: 1, role: 1 }, { name: 'users_tenant_role' }),
    db.collection('custom_roles').createIndex({ tenantId: 1, name: 1 }, { unique: true, name: 'uniq_custom_roles_tenant_name' }),

    // Websites
    db.collection('websites').createIndex({ websiteId: 1 }, { unique: true, name: 'uniq_websites_id' }),
    db.collection('websites').createIndex({ tenantId: 1, createdAt: -1 }, { name: 'websites_tenant_createdAt' }),
    db.collection('websites').createIndex({ systemSubdomain: 1 }, { unique: true, name: 'uniq_websites_sys_sub' }),
    db.collection('websites').createIndex({ primaryDomain: 1 }, { unique: true, sparse: true, name: 'uniq_websites_primary_domain' }),

    // Website Content (scoped by tenant+website)
    db.collection('pages').createIndex({ tenantId: 1, websiteId: 1, slug: 1 }, { unique: true, name: 'uniq_pages_tenant_website_slug' }),
    db.collection('posts').createIndex({ tenantId: 1, websiteId: 1, slug: 1 }, { unique: true, name: 'uniq_posts_tenant_website_slug' }),
    db.collection('categories').createIndex({ tenantId: 1, websiteId: 1, slug: 1 }, { unique: true, name: 'uniq_categories_tenant_website_slug' }),
    db.collection('blog_tags').createIndex({ tenantId: 1, websiteId: 1, slug: 1 }, { unique: true, name: 'uniq_blog_tags_tenant_website_slug' }),
    db.collection('media').createIndex({ tenantId: 1, filename: 1 }, { name: 'media_tenant_filename' }),
    db.collection('media_folders').createIndex({ tenantId: 1, slug: 1 }, { unique: true, name: 'uniq_media_folders_tenant_slug' }),

    // Ecommerce (scoped by tenant+website)
    db.collection('products').createIndex({ tenantId: 1, websiteId: 1, slug: 1 }, { unique: true, name: 'uniq_products_tenant_website_slug' }),
    db.collection('products').createIndex({ tenantId: 1, websiteId: 1, status: 1 }, { name: 'products_tenant_website_status' }),
    // Text index (Mongo allows only one text index per collection). Ignore if already exists differently.
    (async () => {
      try {
        await db.collection('products').createIndex({ name: 'text', description: 'text', tags: 'text' });
      } catch {
        // ignore conflicts with existing text index configuration
      }
    })(),
    db.collection('product_categories').createIndex({ tenantId: 1, websiteId: 1, slug: 1 }, { unique: true, name: 'uniq_product_categories_tenant_website_slug' }),
    db.collection('product_variants').createIndex({ tenantId: 1, websiteId: 1, productId: 1, name: 1 }, { unique: true, name: 'uniq_variants_tenant_website_product_name' }),

    db.collection('orders').createIndex({ tenantId: 1, orderNumber: 1 }, { unique: true, name: 'uniq_orders_tenant_number' }),
    db.collection('carts').createIndex({ tenantId: 1, sessionId: 1 }, { name: 'carts_tenant_session' }),
    db.collection('carts').createIndex({ expiresAt: 1 }, { name: 'ttl_carts_expiry', expireAfterSeconds: 0 }),

    // Billing
    db.collection('invoices').createIndex({ tenantId: 1, invoiceNumber: 1 }, { unique: true, name: 'uniq_invoices_tenant_number' }),
    db.collection('payments').createIndex({ tenantId: 1, orderId: 1, status: 1 }, { name: 'payments_tenant_order_status' }),
    db.collection('subscriptions').createIndex({ tenantId: 1, status: 1 }, { name: 'subscriptions_tenant_status' }),

    // System
    db.collection('audit_logs').createIndex({ tenantId: 1, createdAt: -1 }, { name: 'audit_logs_tenant_createdAt' }),
    db.collection('audit_logs').createIndex({ expiresAt: 1 }, { name: 'ttl_audit_logs_expiry', expireAfterSeconds: 0 }),
    db.collection('activities').createIndex({ tenantId: 1, userId: 1, createdAt: -1 }, { name: 'activities_tenant_user_createdAt' }),
    db.collection('invitations').createIndex({ tenantId: 1, email: 1 }, { name: 'invitations_tenant_email' }),
    db.collection('invitations').createIndex({ expiresAt: 1 }, { name: 'ttl_invitations_expiry', expireAfterSeconds: 0 }),
    db.collection('password_reset_tokens').createIndex({ userId: 1, createdAt: -1 }, { name: 'pwd_reset_user_createdAt' }),
    db.collection('password_reset_tokens').createIndex({ expiresAt: 1 }, { name: 'ttl_password_reset_expiry', expireAfterSeconds: 0 }),

    // Plugins
    db.collection('plugin_registry').createIndex({ key: 1 }, { unique: true, name: 'uniq_plugin_registry_key' }),
    db.collection('plugin_installations').createIndex({ tenantId: 1, pluginKey: 1 }, { unique: true, name: 'uniq_plugin_install_tenant_plugin' }),
  ]);
}
