import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

async function main() {
  const dbName = process.env.MONGODB_DB || 'kalpdee';
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const tenants = db.collection('tenants');
  const users = db.collection('users');

  const now = new Date();
  const existingTenant = await tenants.findOne({ slug: 'demo' });
  let tenantId: ObjectId;
  if (existingTenant) {
    tenantId = existingTenant._id as ObjectId;
  } else {
    const t = {
      slug: 'demo',
      name: 'Demo Tenant',
      email: 'owner@demo.local',
      customDomainVerified: false,
      plan: 'trial',
      subscriptionStatus: 'active',
      branding: { primaryColor: '#3b82f6', secondaryColor: '#f4e04f' },
      paymentGateways: {},
      features: { websiteEnabled: true, ecommerceEnabled: true, blogEnabled: true, invoicesEnabled: true },
      settings: { locale: 'en-US', currency: 'USD', timezone: 'UTC' },
      status: 'active',
      createdAt: now,
      updatedAt: now,
    } as any;
    const r = await tenants.insertOne(t);
    tenantId = r.insertedId as ObjectId;
  }

  const email = 'admin@demo.local';
  const password = 'Password123!';
  const existingUser = await users.findOne({ tenantId, email });
  if (!existingUser) {
    const passwordHash = await bcrypt.hash(password, 10);
    await users.insertOne({
      tenantId,
      email,
      passwordHash,
      name: 'Demo Admin',
      role: 'owner',
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });
  }

  console.log('Seed complete. Login with:');
  console.log('tenant: demo');
  console.log('email: admin@demo.local');
  console.log('password: Password123!');

  await client.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
