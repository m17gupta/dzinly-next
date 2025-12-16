import { ObjectId } from 'mongodb';
import { BrandingSettings } from '@/types';

export interface TenantModel {
  _id: ObjectId;
  slug: string;
  name: string;
  email: string;
  customDomainVerified: boolean;
  plan: 'trial' | 'basic' | 'pro' | 'enterprise';
  subscriptionStatus: 'active' | 'suspended' | 'cancelled';
  branding: BrandingSettings;
  paymentGateways: Record<string, unknown>;
  features: {
    websiteEnabled: boolean;
    ecommerceEnabled: boolean;
    blogEnabled: boolean;
    invoicesEnabled: boolean;
  };
  settings: {
    locale: string;
    currency: string;
    timezone: string;
    taxRate?: number;
    maxUsers?: number;
    maxSubTenants?: number;
  };
  status: 'active' | 'suspended' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

// Example usage:
export const demoTenant: TenantModel = {
  _id: new ObjectId('6921a1a6372216689709f02f'),
  slug: 'demo',
  name: 'Demo Tenant',
  email: 'owner@demo.local',
  customDomainVerified: false,
  plan: 'trial',
  subscriptionStatus: 'active',
  branding: {
    colors: {
      primary: '#3b82f6',
      secondary: '#f4e04f',
    },
  },
  paymentGateways: {},
  features: {
    websiteEnabled: true,
    ecommerceEnabled: true,
    blogEnabled: true,
    invoicesEnabled: true,
  },
  settings: {
    locale: 'en-US',
    currency: 'USD',
    timezone: 'UTC',
  },
  status: 'active',
  createdAt: new Date('2025-11-22T11:42:30.559Z'),
  updatedAt: new Date('2025-11-22T11:42:30.559Z'),
};
