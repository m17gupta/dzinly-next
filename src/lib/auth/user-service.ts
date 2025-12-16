import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import { getDatabase } from '../db/mongodb';
import type { User } from '@/types';

export class UserService {
  private async getCollection() {
    const db = await getDatabase();
    return db.collection<User>('users');
  }

  async getUserByEmail(
    tenantId: string | ObjectId,
    email: string
  ): Promise<User | null> {
    const collection = await this.getCollection();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    const response = await collection.findOne({
      tenantId: tid,
      email: email.toLowerCase(),
    });
    console.log("respsne user---", response)
    return response
  }

  async getUserById(id: string | ObjectId): Promise<User | null> {
    const collection = await this.getCollection();
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    return collection.findOne({ _id: objectId });
  }

  async createUser(data: {
    tenantId: string | ObjectId;
    email: string;
    password: string;
    name: string;
    role: User['role'];
  }): Promise<User> {
    const collection = await this.getCollection();
    const tid = typeof data.tenantId === 'string' ? new ObjectId(data.tenantId) : data.tenantId;

    // Check if user already exists
    const existing = await this.getUserByEmail(tid, data.email);
    if (existing) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    const user: Omit<User, '_id'> = {
      tenantId: tid,
      email: data.email.toLowerCase(),
      passwordHash,
      name: data.name,
      role: data.role,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: {
        dashboard: true,
        users: [],
        tenants: [],
        products: [],
        orders: [],
        content: [],
        settings: [],
      },
    };

    const result = await collection.insertOne(user as User);
    return { ...user, _id: result.insertedId } as User;
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

  async updateLastLogin(userId: string | ObjectId): Promise<void> {
    const collection = await this.getCollection();
    const id = typeof userId === 'string' ? new ObjectId(userId) : userId;

    await collection.updateOne(
      { _id: id },
      {
        $set: {
          lastLoginAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );
  }

  async listUsers(tenantId: string | ObjectId): Promise<User[]> {
    const collection = await this.getCollection();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    return collection
      .find({ tenantId: tid })
      .sort({ createdAt: -1 })
      .toArray();
  }
}

export const userService = new UserService();
